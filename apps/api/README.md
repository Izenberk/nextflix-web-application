# 🧰 Nextflix Backend (NestJS)

[![NestJS](https://img.shields.io/badge/NestJS-11-EA2845?logo=nestjs&logoColor=white)](https://nestjs.com)
[![Node](https://img.shields.io/badge/Node-20-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Render](https://img.shields.io/badge/Deploy-Render-46E3B7?logo=render&logoColor=111)](https://render.com)

> REST API wrapping TMDB for popular/now‑playing/top‑rated/upcoming movies with Swagger docs.

- Local base: http://localhost:3000/api/v1
- Swagger: http://localhost:3000/api/v1/docs

## 🚀 Getting Started
Prereqs: Node 18+, pnpm 10+

Install (from repo root):
```bash
pnpm install
```

Dev:
```bash
pnpm --filter @nextflix/api dev
```

Build and run:
```bash
pnpm --filter @nextflix/api build
node apps/api/dist/main.js
```

## 🔧 Environment
Create `apps/api/.env`:
```env
PORT=3000
GLOBAL_PREFIX=api
API_VERSION=1
TMDB_ACCESS_TOKEN_V4=YOUR_TMDB_V4_ACCESS_TOKEN
CORS_ORIGINS=http://localhost:3001,https://your-frontend.example.com
```

Notes:
- `TMDB_ACCESS_TOKEN_V4` is required (Bearer v4 token).
- `CORS_ORIGINS` is a comma‑separated list of allowed origins.

## 🔐 CORS
The app enables CORS and can be configured via `CORS_ORIGINS`. Ensure your frontend origin(s) are included.

## 📜 Endpoints
- `GET /api/v1/movies/popular`
- `GET /api/v1/movies/top-rated`
- `GET /api/v1/movies/now-playing`
- `GET /api/v1/movies/upcoming`
- `GET /api/v1/docs` — Swagger UI

## 🐳 Deploy on Render (Docker)
- Use `apps/api/Dockerfile` or the `render.yaml` blueprint at repo root.
- Verify env names match the code:
  - Use `TMDB_ACCESS_TOKEN_V4` (not `TMDB_API_KEY`)
  - Use `CORS_ORIGINS` (comma‑separated; not `CORS_ORIGIN`)
- After deploy: your API base is `https://<service>.onrender.com/api/v1`

