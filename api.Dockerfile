# ---- STEP 1: Build Stage ----
FROM node:22.10.0-alpine AS builder

# Enable pnpm and install turbo
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm add -g turbo

WORKDIR /app

# Copy all files (assumes .dockerignore is configured to skip node_modules, dist, etc.)
COPY . .

# Install monorepo dependencies (turbo will use root)
RUN pnpm install --no-frozen-lockfile

# Build only the api app (and its dependencies)
RUN turbo run build --filter=api...

# ---- STEP 2: Production Image ----
FROM node:22.10.0-alpine

WORKDIR /app

# Copy only what’s needed to run
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# (Optional) Copy .env if needed (Render can inject env vars directly)
# COPY --from=builder /app/apps/api/.env .env

# Expose Render-expected port (PORT env variable)
EXPOSE 8080

# Start the NestJS app
CMD ["node", "dist/main"]
