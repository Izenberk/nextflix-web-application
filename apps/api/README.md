# Nextflix API

NestJS service that backs the Nextflix frontend by exposing a REST API and proxying movie data from TMDB.

## Local development

```bash
pnpm install
pnpm dev --filter=@nextflix/api
```

The API starts on [http://localhost:3000](http://localhost:3000) and exposes versioned routes under `/api/v1` by default.

### Environment variables

| Variable | Required | Default | Notes |
| --- | --- | --- | --- |
| `TMDB_ACCESS_TOKEN_V4` | ✅ | — | TMDB API v4 access token. Required for every request. |
| `GLOBAL_PREFIX` | ⛔ | `api` | Set a custom REST prefix. |
| `API_VERSION` | ⛔ | `1` | Exposed version segment (`/api/{version}`). |
| `PORT` | ⛔ | `3000` | Local-only HTTP port. Ignored in serverless deployments. |

## Vercel deployment

This folder contains a `vercel.json` configuration that compiles the Nest app into a single serverless function (`dist/main.js`).

When you create a Vercel project with `apps/api` as the root directory:

1. Use `pnpm install --frozen-lockfile` as the install command.
2. Use `pnpm dlx turbo run build --filter=@nextflix/api...` as the build command.
3. Provide `TMDB_ACCESS_TOKEN_V4` (and any optional overrides) in Project → Settings → Environment Variables.

The resulting deployment will answer all HTTP methods and supports CORS for any `*.vercel.app` frontend out of the box.
