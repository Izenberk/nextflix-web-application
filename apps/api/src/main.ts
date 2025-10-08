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
  const globalPrefix = cfg.get<string>('GLOBAL_PREFIX') ?? 'api';
  const apiVersion = cfg.get<string>('API_VERSION') ?? '1';

  // --- CORS (CSV allow-list) -----------------------------------------------
  // Example env: CORS_ORIGIN="https://nextflix-web-application-web.vercel.app,http://localhost:3001"
  const originEnv =
    cfg.get<string>('CORS_ORIGIN') ?? process.env.CORS_ORIGIN ?? '';
  const allowlist = originEnv
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  app.enableCors({
    origin(origin, callback) {
      // Allow server-to-server / curl / same-origin (no Origin header)
      if (!origin) return callback(null, true);
      if (allowlist.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`), false);
    },
    credentials: true, // set to false if you never use cookies/auth
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  // -------------------------------------------------------------------------

  // Prefix + versioning
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
    .addServer('/', 'Local')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();

  const doc = SwaggerModule.createDocument(app, openapi, {
    ignoreGlobalPrefix: false,
  });

  SwaggerModule.setup('docs', app, doc, {
    customfavIcon: '/favicon.ico', // served by ServeStaticModule
  });

  // Emit openapi.json locally only (Vercel FS is read-only)
  if (process.env.VERCEL !== '1') {
    try {
      const outPath = join(
        process.cwd(),
        '../web/public/api-docs/openapi.json',
      );
      mkdirSync(dirname(outPath), { recursive: true });
      writeFileSync(outPath, JSON.stringify(doc, null, 2));

      console.log(`📝 OpenAPI emitted: ${outPath}`);
    } catch (e) {
      console.warn('Skipping openapi.json write:', e);
    }
  }

  await app.listen(port);

  console.log(
    `✅ API base: http://localhost:${port}/${globalPrefix}/${apiVersion}`,
  );

  console.log(`📘 Swagger UI: http://localhost:${port}/docs`);
}
bootstrap();
