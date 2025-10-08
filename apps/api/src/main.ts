// apps/api/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  VersioningType,
  ValidationPipe,
  RequestMethod,
  VERSION_NEUTRAL, // <-- add this import
} from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false });
  const cfg = app.get(ConfigService);

  const port = cfg.get<number>('PORT') ?? 3000;
  const globalPrefix = cfg.get<string>('GLOBAL_PREFIX') ?? 'api';
  const apiVersion = cfg.get<string>('API_VERSION') ?? '1';

  // ... your enableCors(...) here ...

  // Exclude specific routes from the global prefix
  app.setGlobalPrefix(globalPrefix, {
    exclude: [
      { path: '/', method: RequestMethod.GET },
      { path: '/health', method: RequestMethod.GET },
    ],
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: apiVersion,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Swagger stays at /docs
  const openapi = new DocumentBuilder()
    .setTitle('Nextflix API')
    .setVersion(apiVersion)
    .build();
  const doc = SwaggerModule.createDocument(app, openapi, {
    ignoreGlobalPrefix: false,
  });
  SwaggerModule.setup('docs', app, doc);

  await app.listen(port);
  console.log(`API: http://localhost:${port}/${globalPrefix}/${apiVersion}`);
}
bootstrap();
