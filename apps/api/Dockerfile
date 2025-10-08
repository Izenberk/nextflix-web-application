# apps/api/Dockerfile

# --- Build stage ---
FROM node:20-alpine AS build
WORKDIR /repo
RUN corepack enable

# Workspace manifests first (cache-friendly)
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# App + shared packages (tsconfig/types/etc.)
COPY apps/api ./apps/api
COPY packages ./packages

# Install & build API
RUN pnpm install --frozen-lockfile
WORKDIR /repo/apps/api
RUN pnpm build

# --- Runtime stage ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Bring compiled code and exact deps from build stage
COPY --from=build /repo/apps/api/dist ./dist
COPY --from=build /repo/apps/api/package.json ./package.json
# Optional: only if you actually have it
# COPY --from=build /repo/apps/api/public ./public
COPY --from=build /repo/apps/api/node_modules ./node_modules

EXPOSE 3000
CMD ["node", "dist/main.js"]
