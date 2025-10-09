# ⏭️ Nextflix Frontend (Next.js)

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=222)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

> Movie browsing UI using React Query, Suspense, and Tailwind.

- Dev URL: http://localhost:3001
- API base: `NEXT_PUBLIC_API_BASE_URL` + `NEXT_PUBLIC_API_BASE_PATH`

## ✨ Features
- Hero section with trailer support
- Rows: Popular, Now Playing, Top Rated, Upcoming
- Movie detail modal
- Theming and responsive layout

## 🚀 Getting Started
Prereqs: Node 18+, pnpm 10+

Install (from repo root):
```bash
pnpm install
```

Run dev:
```bash
pnpm --filter @nextflix/web dev
```

Build and start:
```bash
pnpm --filter @nextflix/web build
pnpm --filter @nextflix/web start
```

Lint and type‑check:
```bash
pnpm --filter @nextflix/web lint
pnpm --filter @nextflix/web check-types
```

## 🔧 Environment
Create `apps/web/.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_PATH=/api/v1
```

## 📦 Scripts
- `dev` — Next dev server (port 3001)
- `build` — Production build
- `start` — Start production server
- `lint` — ESLint
- `check-types` — TypeScript no‑emit

## ☁️ Deployment
- Ensure build environment installs devDependencies (TypeScript/Tailwind/PostCSS).
- Set `NEXT_PUBLIC_API_BASE_URL` to your Render API URL (e.g., `https://your-api.onrender.com`).
- Keep `NEXT_PUBLIC_API_BASE_PATH=/api/v1` unless changed server‑side.

