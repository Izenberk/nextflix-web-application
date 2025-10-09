import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { VersioningType, ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';

let server: ReturnType<typeof express> | null = null;

async function bootstrapServer() {
  const expressApp = express();
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
    { cors: false },
  );

  const cfg = app.get(ConfigService);
  const origin = cfg.get<string>('CORS_ORIGIN') ?? '*';
  const globalPrefix = cfg.get<string>('GLOBAL_PREFIX') ?? 'api';
  const apiVersion = cfg.get<string>('API_VERSION') ?? '1';

  app.enableCors({ origin, credentials: true });
  app.setGlobalPrefix(globalPrefix);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: apiVersion,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // No listen() on serverless — just init the app
  await app.init();
  return expressApp;
}

// Vercel entry
export default async function handler(req: VercelRequest, res: VercelResponse) {
  server = server ?? (await bootstrapServer());
  return (server as any)(req, res);
}
