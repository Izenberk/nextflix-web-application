import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false });
  const cfg = app.get(ConfigService);
  const port = cfg.get<number>('PORT') ?? 3000;
  const origin = cfg.get<string>('CORS_ORIGIN') ?? 'http://localhost:3001';

  app.enableCors({ origin, credentials: true });

  const swagger = new DocumentBuilder()
    .setTitle('Nextflix API')
    .setDescription('API documentation for Nextflix prototype')
    .setVersion('v1')
    .build();

  const doc = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup('/docs', app, doc);

  await app.listen(port);
}
bootstrap();
