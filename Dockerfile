# Stage 1: Build
FROM node:20-alpine AS builder

# Install OpenSSL for Prisma (required in Alpine)
RUN apk add --no-cache openssl

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma Client
RUN pnpm prisma generate

# Build application
RUN pnpm build

# Stage 2: Production
FROM node:20-alpine AS production

# Install OpenSSL for Prisma (required in Alpine)
RUN apk add --no-cache openssl

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/
COPY prisma.config.js ./


# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Copy built application from builder
COPY --from=builder /app/dist ./dist


# Generate Prisma Client in production
RUN pnpm prisma generate

# Expose port
EXPOSE 24731

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "dist/main.js"]
