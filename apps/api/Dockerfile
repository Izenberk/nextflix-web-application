# apps/api/Dockerfile

# ---------- base ----------
FROM node:20-alpine AS base
WORKDIR /repo
RUN corepack enable

# ---------- builder ----------
FROM base AS builder

# 1) Copy manifests first (better cache)
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/api/package.json apps/api/package.json
# If API depends on internal packages at runtime, also copy their manifests:
# COPY packages/*/package.json packages/*/package.json

# 2) Install all deps (incl. dev for building)
RUN pnpm install --frozen-lockfile

# 3) Copy source and build
COPY . .
RUN pnpm --filter @nextflix/api build

# ---------- runner (standalone prod install) ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Render sets PORT at runtime; don’t hardcode 3000
ENV PORT=3000
EXPOSE 3000

# Install prod deps for the API as a standalone app
COPY apps/api/package.json ./package.json
RUN corepack enable && pnpm install --prod --no-frozen-lockfile

# Bring compiled code + public assets
COPY --from=builder /repo/apps/api/dist ./dist
# Your ServeStaticModule uses join(process.cwd(), 'apps/api/public')
COPY --from=builder /repo/apps/api/public ./apps/api/public

# Health (optional): if you added /healthz, Render can probe it
CMD ["node", "dist/main.js"]
