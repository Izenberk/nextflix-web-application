import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { VersioningType, ValidationPipe } from '@nestjs/common';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false });
  const cfg = app.get(ConfigService);

  const port = cfg.get<number>('PORT') ?? 3000;
  const origin = cfg.get<string>('CORS_ORIGIN') ?? 'http://localhost:3001';
  const globalPrefix = cfg.get<string>('GLOBAL_PREFIX') ?? 'api';
  const apiVersion = cfg.get<string>('API_VERSION') ?? '1';

  // CORS
  app.enableCors({ origin, credentials: true });

  // Prefix + versioning (use variables, not literals)
  app.setGlobalPrefix(globalPrefix);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: apiVersion,
  });

  // Validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Swagger / OpenAPI
  const openapi = new DocumentBuilder()
    .setTitle('Nextflix API')
    .setDescription('API documentation for Nextflix prototype')
    .setVersion(apiVersion)
    // Let tools know both base URLs:
    .addServer(`http://localhost:${port}/${globalPrefix}`, 'Local (no version)')
    .addServer(
      `http://localhost:${port}/${globalPrefix}/${apiVersion}`,
      'Local v1',
    )
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();

  const doc = SwaggerModule.createDocument(app, openapi);
  SwaggerModule.setup('/docs', app, doc);

  // Emit openapi.json to Next.js **public/**
  const outPath = join(process.cwd(), '../web/public/api-docs/openapi.json');
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(doc, null, 2));

  await app.listen(port);

  console.log(
    `✅ API base: http://localhost:${port}/${globalPrefix}/${apiVersion}`,
  );
  console.log(`📘 Swagger UI: http://localhost:${port}/docs`);
  console.log(`📝 OpenAPI:    ${outPath}`);
}
bootstrap();
