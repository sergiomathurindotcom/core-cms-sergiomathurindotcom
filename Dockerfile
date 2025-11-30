FROM node:20-alpine AS builder

WORKDIR /app

# Install system dependencies including PostgreSQL client
RUN apk add --no-cache postgresql-client

# Install dependencies
COPY strapi/package*.json ./
RUN npm ci --only=production

# Copy application
COPY strapi/ .

# Build admin panel
ENV NODE_ENV=production
RUN npm run build

# Production image
FROM node:20-alpine

WORKDIR /app

# Install PostgreSQL client for backup/restore operations
RUN apk add --no-cache postgresql-client

# Copy from builder
COPY --from=builder /app ./

# Expose port
EXPOSE 1337

# Health check
#HEALTHCHECK --interval=30s --timeout=3s --start-period=60s \
#  CMD node -e "require('http').get('http://localhost:1337/_health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start Strapi
CMD ["npm", "run", "start"]
