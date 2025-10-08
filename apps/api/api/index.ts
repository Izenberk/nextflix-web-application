// apps/api/api/index.ts
import 'reflect-metadata';
import serverlessHttp from 'serverless-http';
import express from 'express';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { VersioningType, ValidationPipe } from '@nestjs/common';

let cachedHandler: ReturnType<typeof serverlessHttp> | null = null;

async function bootstrap() {
  const expressApp = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp), {
    // keep logs minimal in serverless
    logger: ['error', 'warn', 'log'],
  });

  const cfg = app.get(ConfigService);
  const origin = cfg.get<string>('CORS_ORIGIN') ?? 'http://localhost:3001';
  const globalPrefix = cfg.get<string>('GLOBAL_PREFIX') ?? 'api';
  const apiVersion = cfg.get<string>('API_VERSION') ?? '1';

  // CORS
  app.enableCors({ origin, credentials: true });

  // Prefix + versioning
  app.setGlobalPrefix(globalPrefix);
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: apiVersion });

  // Validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Swagger (mounted at /docs). Note: no file writes in serverless
  const openapi = new DocumentBuilder()
    .setTitle('Nextflix API')
    .setDescription('API documentation for Nextflix prototype')
    .setVersion(apiVersion)
    .addServer('/', 'Serverless Base')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();

  const doc = SwaggerModule.createDocument(app, openapi, { ignoreGlobalPrefix: false });
  SwaggerModule.setup('docs', app, doc);

  // IMPORTANT: serverless = init only; DO NOT listen()
  await app.init();

  return serverlessHttp(expressApp);
}

export default async function handler(req: any, res: any) {
  try {
    if (!cachedHandler) cachedHandler = await bootstrap();
    return cachedHandler(req, res);
  } catch (err) {
    console.error('Serverless bootstrap error:', err);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
}
