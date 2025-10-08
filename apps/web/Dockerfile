# apps/web/Dockerfile
FROM node:20-alpine AS build
WORKDIR /repo
RUN corepack enable

# Copy workspace manifests first (cache-friendly)
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copy the app and ALL workspace packages used by it (tsconfig/eslint/shared types, etc.)
COPY apps/web ./apps/web
COPY packages ./packages

# Install deps for the whole workspace (enables pnpm symlinks to packages/*)
RUN pnpm install --frozen-lockfile

# Build web
WORKDIR /repo/apps/web
# Optional: disable telemetry inside CI images
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# --- Runtime image (standalone) ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001
# Next standalone output
COPY --from=build /repo/apps/web/.next/standalone ./
COPY --from=build /repo/apps/web/.next/static ./apps/web/.next/static
COPY --from=build /repo/apps/web/public ./apps/web/public
EXPOSE 3001
CMD ["node", "apps/web/server.js"]
