// apps/api/src/app.controller.ts
import { Controller, Get, VERSION_NEUTRAL, Header } from '@nestjs/common'

@Controller({ path: '', version: VERSION_NEUTRAL })
export class AppController {
  @Get()
  @Header('Content-Type', 'text/html')
  home(): string {
    return `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Nextflix API</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      background: #0f0f0f;
      color: #eee;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
    }
    h1 { color: #e50914; margin-bottom: .5rem; }
    a {
      color: #2C5DE3;
      text-decoration: none;
      font-weight: 500;
    }
    a:hover { text-decoration: underline; }
    .links { margin-top: 1rem; }
  </style>
</head>
<body>
  <h1>Nextflix API 🚀</h1>
  <p>Welcome to the backend service for Nextflix.</p>
  <div class="links">
    <a href="/docs">Swagger Docs</a> · 
    <a href="/api/v1/movies/popular">Try the API</a>
  </div>
</body>
</html>
    `
  }

  @Get('health')
  health() {
    return { status: 'ok' }
  }
}
