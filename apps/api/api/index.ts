// apps/api/api/index.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import serverlessExpress from '@vendia/serverless-express';
import type { Handler, Context, Callback } from 'aws-lambda';
import { ValidationPipe } from '@nestjs/common';

let cached: Handler;

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(AppModule, { cors: false });

  // CORS for your web app (Vercel + local dev)
  app.enableCors({
    origin: [
      /.*\.vercel\.app$/,
      'http://localhost:3000',
      'https://nextflix-web-application-web.vercel.app',
    ],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  // Keep your global setup similar to main.ts
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Important: DO NOT call app.listen() in serverless
  await app.init();

  const server = app.getHttpAdapter().getHttpServer();
  return serverlessExpress({ app: server });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  if (!cached) cached = await bootstrap();
  return cached(event, context, callback);
};
