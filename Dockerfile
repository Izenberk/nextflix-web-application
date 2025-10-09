# syntax=docker/dockerfile:1.7

# ---------- base ----------
FROM node:20-alpine AS base
WORKDIR /repo
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate

# only lockfiles/manifests first for better cache
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
# each workspace package.json (adjust if you have more workspaces)
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
# if you have shared packages, include just their package.json files:
# COPY packages/*/package.json packages/*/

RUN pnpm install --frozen-lockfile

# now copy sources (node_modules are excluded by .dockerignore)
COPY apps ./apps
# COPY packages ./packages  # uncomment if you actually have /packages

# ---------- builds ----------
FROM base AS build-api
RUN pnpm --filter "@nextflix/api" build

FROM base AS build-web
RUN pnpm --filter "@nextflix/web" build

# ---------- runtime:api ----------
FROM node:20-alpine AS api
WORKDIR /app
ENV NODE_ENV=production
# bring runtime deps + built app
COPY --from=base /repo/node_modules ./node_modules
COPY --from=base /repo/apps/api ./apps/api
# If your Nest build outputs to dist, prefer copying the built output:
# COPY --from=build-api /repo/apps/api/dist ./apps/api/dist
EXPOSE 3000
CMD ["pnpm", "--filter", "@nextflix/api", "start:prod"]

# ---------- runtime:web ----------
FROM node:20-alpine AS web
WORKDIR /app
ENV NODE_ENV=production
COPY --from=base /repo/node_modules ./node_modules
COPY --from=base /repo/apps/web ./apps/web
# If you want to run Next in prod mode with prebuilt .next:
# COPY --from=build-web /repo/apps/web/.next ./apps/web/.next
EXPOSE 3000
CMD ["pnpm", "--filter", "@nextflix/web", "start"]
