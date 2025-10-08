// apps/api/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { VersioningType, ValidationPipe, RequestMethod } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import type { IncomingMessage, ServerResponse } from 'http';

// ---- Vercel Node Function signature
type VercelHandler = (
  req: IncomingMessage & any,
  res: ServerResponse & any,
) => void;

let cachedHandler: VercelHandler | null = null;

async function setupAppCommon(app: import('@nestjs/common').INestApplication) {
  const cfg = app.get(ConfigService);
  const globalPrefix = cfg.get<string>('GLOBAL_PREFIX') ?? 'api';
  const apiVersion = cfg.get<string>('API_VERSION') ?? '1';

  // CORS (dev + Vercel)
  app.enableCors({
    origin: [
      'http://localhost:3001',
      'http://127.0.0.1:3001',
      /.*\.vercel\.app$/,
    ],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    maxAge: 86400,
  });

  // Global prefix + exclusions
  app.setGlobalPrefix(globalPrefix, {
    exclude: [
      { path: '/', method: RequestMethod.GET },
      { path: '/health', method: RequestMethod.GET },
    ],
  });

  // URI versioning -> /api/v1/...
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: apiVersion,
  });

  // Validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Swagger at /api/v1/docs (ignoreGlobalPrefix=false)
  const openapi = new DocumentBuilder()
    .setTitle('Nextflix API')
    .setVersion(apiVersion)
    .build();
  const doc = SwaggerModule.createDocument(app, openapi, {
    ignoreGlobalPrefix: false,
  });
  SwaggerModule.setup('docs', app, doc);
}

// ---------- Serverless path (Vercel calls the default export)
async function createServerlessHandler(): Promise<VercelHandler> {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    cors: false,
  });
  await setupAppCommon(app);
  await app.init(); // IMPORTANT: no app.listen() in serverless
  return server as unknown as VercelHandler; // express app is a (req,res) handler
}

export default async function handler(
  req: IncomingMessage & any,
  res: ServerResponse & any,
) {
  const h = cachedHandler ?? (cachedHandler = await createServerlessHandler());
  return h(req, res);
}

// ---------- Local dev path: run classic HTTP server if executed directly
if (
  process.env.NODE_ENV !== 'production' &&
  typeof require !== 'undefined' &&
  require.main === module
) {
  (async () => {
    const app = await NestFactory.create(AppModule, { cors: false });
    await setupAppCommon(app);
    const cfg = app.get(ConfigService);
    const port = cfg.get<number>('PORT') ?? 3000;
    await app.listen(port);
    console.log(`API: http://localhost:${port}/api/v1`);
  })();
}
