# ---------- base ----------
FROM node:20-alpine AS base
WORKDIR /repo
RUN corepack enable

# ---------- builder ----------
FROM base AS builder

# 1) Copy manifests first (cache-friendly)
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/api/package.json apps/api/package.json
# If API imports any internal packages at runtime, also copy their manifests:
# COPY packages/*/package.json packages/*/package.json

# 2) Full workspace install (includes devDeps for build)
RUN pnpm install --frozen-lockfile

# 3) Copy source and build API
COPY . .
RUN pnpm --filter @nextflix/api build

# ---------- runner (standalone prod install) ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
EXPOSE 3000

# IMPORTANT: install the API as a STANDALONE package:
# - DO NOT copy pnpm-workspace.yaml or the root package.json into the runner.
# - This ensures pnpm installs deps from apps/api/package.json into /app/node_modules.
COPY apps/api/package.json ./package.json
RUN corepack enable && pnpm install --prod --no-frozen-lockfile

# Bring compiled code + public assets
COPY --from=builder /repo/apps/api/dist ./dist
# Your code uses: join(process.cwd(), 'apps/api/public')
# With WORKDIR=/app, that resolves to /app/apps/api/public, so copy there:
COPY --from=builder /repo/apps/api/public ./apps/api/public

CMD ["node", "dist/main.js"]
