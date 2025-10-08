// apps/api/api/index.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import { ConfigService } from '@nestjs/config';
import { VersioningType, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// single Express server reused across invocations
const server = express();
let isBootstrapped = false;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    // disable Nest logger in serverless to reduce cold-start noise (optional)
    logger: false,
  });

  const cfg = app.get(ConfigService);

  const origin =
    cfg.get<string>('CORS_ORIGIN') ??
    process.env.CORS_ORIGIN ??
    'http://localhost:3001';

  const globalPrefix = cfg.get<string>('GLOBAL_PREFIX') ?? 'api';
  const apiVersion = cfg.get<string>('API_VERSION') ?? '1';

  // CORS
  app.enableCors({ origin, credentials: true });

  // Prefix + versioning
  app.setGlobalPrefix(globalPrefix);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: apiVersion,
  });

  // Validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Swagger (routes only; don't write files on Vercel)
  const openapi = new DocumentBuilder()
    .setTitle('Nextflix API')
    .setDescription('API documentation for Nextflix prototype')
    .setVersion(apiVersion)
    .addServer('/', 'Vercel')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();

  const doc = SwaggerModule.createDocument(app, openapi, {
    ignoreGlobalPrefix: false,
  });
  SwaggerModule.setup('docs', app, doc);

  // IMPORTANT: no app.listen() in serverless
  await app.init();

  isBootstrapped = true;
}

// Vercel entry point
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!isBootstrapped) {
    await bootstrap();
  }
  // hand off to Express/Nest
  server(req as any, res as any);
}
