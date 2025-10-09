<div align="center">

# 🎬 Nextflix Monorepo

[![Node >= 18](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white)](./package.json)
[![pnpm](https://img.shields.io/badge/pnpm-10+-F69220?logo=pnpm&logoColor=white)](https://pnpm.io)
[![Turbo](https://img.shields.io/badge/turbo-monorepo-000?logo=turbo&logoColor=white)](https://turbo.build)

</div>

> Full‑stack demo: Next.js frontend + NestJS backend powered by TMDB.

**Apps**
- Frontend: `apps/web` (Next.js)
- Backend: `apps/api` (NestJS)

**Packages**
- ESLint config: `packages/eslint-config`
- TypeScript config: `packages/typescript-config`

## 🚀 Quick Start

- Prerequisites: Node 18+, pnpm 10+
- Install deps: `pnpm install`
- Dev all: `pnpm dev`
- Build all: `pnpm build`

## 🧩 Dev Scripts

- Frontend dev: `pnpm --filter @nextflix/web dev` → http://localhost:3001
- Backend dev: `pnpm --filter @nextflix/api dev` → http://localhost:3000/api/v1
- Lint: `pnpm lint`
- Type‑check: `pnpm check-types`

## 🔧 Environment

Frontend (`apps/web/.env.local`)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_PATH=/api/v1
```

Backend (`apps/api/.env`)
```env
PORT=3000
GLOBAL_PREFIX=api
API_VERSION=1
TMDB_ACCESS_TOKEN_V4=YOUR_TMDB_V4_ACCESS_TOKEN
CORS_ORIGINS=http://localhost:3001,https://your-frontend.example.com
```

## 📦 Project Structure

```
apps/
  web/   # Next.js app (frontend)
  api/   # NestJS app (backend)
packages/
  eslint-config/
  typescript-config/
```

## ☁️ Deployment

- Backend: Render (Docker) using `apps/api/Dockerfile` (or Blueprint via `render.yaml`).
  - Ensure env keys align: use `TMDB_ACCESS_TOKEN_V4` and `CORS_ORIGINS` (comma‑separated).
- Frontend: Any Next‑compatible platform. Set `NEXT_PUBLIC_API_BASE_URL` to your API URL.

## 📚 Per‑App Docs

- Frontend: see `apps/web/README.md`
- Backend: see `apps/api/README.md`

