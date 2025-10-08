# Nextflix Monorepo

A Turbo-powered monorepo that contains the **Nextflix** frontend (`apps/web`, built with Next.js 15) and the accompanying **NestJS** API (`apps/api`). The apps share tooling via pnpm workspaces and Turborepo pipelines.

## Repository layout

| Path | Description |
| --- | --- |
| `apps/web` | Public Next.js application that renders the Nextflix UI. |
| `apps/api` | NestJS server that proxies requests to the TMDB API and exposes REST endpoints consumed by the frontend. |
| `packages/*` | Shared TypeScript, ESLint, and UI utilities. |

## Getting started locally

1. Install dependencies once at the repository root:

   ```bash
   pnpm install
   ```

2. Start both applications in watch mode:

   ```bash
   pnpm dev
   ```

   The web app runs on [http://localhost:3001](http://localhost:3001) and expects the API to be reachable at `http://localhost:3000/api/v1` by default.

### Environment variables

Create `.env` files next to each app when running locally or deploying:

#### `apps/api`

| Variable | Required | Default | Notes |
| --- | --- | --- | --- |
| `TMDB_ACCESS_TOKEN_V4` | ✅ | — | TMDB API v4 access token used when requesting movie data. |
| `PORT` | ⛔ | `3000` | Only used for local development (ignored on Vercel). |
| `GLOBAL_PREFIX` | ⛔ | `api` | API prefix that appears in final routes (`/api/v1/...`). |
| `API_VERSION` | ⛔ | `1` | API version number that becomes the second segment of the path. |

#### `apps/web`

| Variable | Required | Default | Notes |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | ⛔ | `http://localhost:3000` | Base origin for the API project. Set this to the deployed API URL on Vercel. |
| `NEXT_PUBLIC_API_BASE_PATH` | ⛔ | `/api/v1` | Path segment that points to the API version. |

## Vercel deployment

Deploy the frontend and backend as **two separate Vercel projects**, each pointing to the same GitHub repository but with different root directories and build commands.

### Frontend (`apps/web`)

1. Create a new Vercel project and select this repository.
2. In **Project Settings → General → Build & Development Settings** set:
   - **Root Directory**: `.` (repository root)
   - **Install Command**: `pnpm install --frozen-lockfile`
   - **Build Command**: `pnpm dlx turbo run build --filter=@nextflix/web...`
   - **Output Directory**: `apps/web/.next`
3. Define the required environment variables in **Project Settings → Environment Variables** (at minimum `NEXT_PUBLIC_API_BASE_URL` pointing to the deployed API URL).
4. Trigger a deployment. Vercel automatically runs `next start` on the generated build output.

### Backend (`apps/api`)

1. Create a second Vercel project that also references this repository.
2. In **Project Settings → General → Build & Development Settings** set:
   - **Root Directory**: `apps/api`
   - **Framework Preset**: `Other`
   - **Install Command**: `pnpm install --frozen-lockfile`
   - **Build Command**: `pnpm dlx turbo run build --filter=@nextflix/api...`
   - (No output directory is needed for serverless functions.)
3. The provided `apps/api/vercel.json` routes every HTTP method to the compiled NestJS handler located at `dist/main.js` and pins the Node.js runtime to 20.x.
4. Add your API secrets (`TMDB_ACCESS_TOKEN_V4`, optional overrides for `GLOBAL_PREFIX`/`API_VERSION`, etc.) in **Environment Variables**.
5. Deploy. The API is exposed as a single serverless function whose base URL should be used to configure the frontend (`NEXT_PUBLIC_API_BASE_URL`).

### Linking the apps

After both projects deploy successfully:

1. Copy the API project’s production URL (for example, `https://nextflix-api.vercel.app`).
2. In the frontend project settings, set `NEXT_PUBLIC_API_BASE_URL` to that URL (no trailing slash).
3. Redeploy the frontend so it reads the new environment variable and proxies traffic to the serverless API.

That’s it! Subsequent pushes to the repository will trigger coordinated builds for each project using the commands above.
