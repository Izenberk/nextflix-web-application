// apps/api/src/main.ts
import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { VersioningType, ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false })
  const cfg = app.get(ConfigService)

  const port = Number(cfg.get('PORT') ?? 3000)
  const host = cfg.get<string>('HOST') ?? '0.0.0.0'
  const origin = cfg.get<string>('CORS_ORIGIN') ?? 'http://localhost:3001'
  const globalPrefix = cfg.get<string>('GLOBAL_PREFIX') ?? 'api'
  const apiVersion = String(cfg.get('API_VERSION') ?? '1')

  // CORS
  app.enableCors({ origin, credentials: true })

  // Prefix + versioning
  app.setGlobalPrefix(globalPrefix)
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: apiVersion })

  // Validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))

  // Swagger @ /docs (UI) and /docs/json (OpenAPI spec)
  const swaggerTitle = cfg.get<string>('SWAGGER_TITLE') ?? 'Nextflix API'
  const swaggerDesc = cfg.get<string>('SWAGGER_DESCRIPTION') ?? 'REST API documentation'
  const swaggerVer = cfg.get<string>('SWAGGER_VERSION') ?? apiVersion

  const docConfig = new DocumentBuilder()
    .setTitle(swaggerTitle)
    .setDescription(swaggerDesc)
    .setVersion(swaggerVer)
    // Helps "Try it out" use the correct base in environments with a prefix & version
    .addServer(`/${globalPrefix}/v${apiVersion}`)
    .build()

  const document = SwaggerModule.createDocument(app, docConfig)
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: `${swaggerTitle} · Docs`,
    swaggerOptions: { persistAuthorization: true },
    // Serve UI at /docs even though the app uses a global prefix
    useGlobalPrefix: false,
    jsonDocumentUrl: '/docs/json',
  })

  // Liveness endpoint for Docker/Render health checks
  app.getHttpAdapter().get('/healthz', (_req: any, res: any) => res.status(200).send('ok'))

  await app.listen(port, host)
}

bootstrap()
