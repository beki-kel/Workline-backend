# Stage 1: Build
FROM node:20-alpine AS builder

RUN apk add --no-cache openssl
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/


# Install all dependencies including dev
RUN pnpm install --frozen-lockfile

# Copy all project files
COPY . .

# Generate Prisma Client in builder stage
RUN pnpm prisma generate

# Build NestJS
RUN pnpm build


# Stage 2: Production
FROM node:20-alpine AS production

RUN apk add --no-cache openssl
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy ONLY production deps metadata
COPY package.json pnpm-lock.yaml ./

# Copy Prisma schema + config
COPY prisma ./prisma/



# Install only production dependencies (no devDependencies)
RUN pnpm install --prod --frozen-lockfile

# Copy built dist + generated prisma client from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma



# NO prisma generate needed here ❌
# The client is already copied.


# Expose port
EXPOSE 24731

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "dist/main.js"]
