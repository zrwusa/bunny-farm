# api.Dockerfile

# Step 1: Use official Node image
FROM node:22.10.0-alpine AS builder

# Step 2: Set workdir and copy files
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY apps/api ./apps/api
COPY tsconfig.json tsconfig.build.json nest-cli.json ./

# Install dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Build the NestJS project
RUN pnpm --filter=apps/api build

# Step 3: Production image
FROM node:22.10.0-alpine

WORKDIR /app

# Copy built files and production dependencies
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/package.json ./package.json

# Expose port
EXPOSE 3000

# Start the app
CMD ["node", "dist/main"]
