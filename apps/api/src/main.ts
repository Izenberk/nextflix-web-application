// apps/api/src/main.ts
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { VersioningType, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false });
  const cfg = app.get(ConfigService);

  const port = Number(cfg.get('PORT') ?? 3000);
  const host = cfg.get<string>('HOST') ?? '0.0.0.0';
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

  // Liveness endpoint for Docker healthcheck
  app.getHttpAdapter().get('/healthz', (_req: any, res: any) => res.status(200).send('ok'));

  await app.listen(port, host);
}

bootstrap();
