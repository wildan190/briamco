# Base stage
FROM node:20-alpine

# Install system dependencies for Strapi and sharp
RUN apk add --no-cache \
    dumb-init \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    pixman-dev \
    libc6-compat

WORKDIR /app

# Copy package files first
COPY package*.json ./
COPY .npmrc ./

# Install dependencies with legacy peer deps and optional dependencies
RUN npm install --legacy-peer-deps --include=optional

# Copy application code (excluding node_modules)
COPY . .

# Ensure standard favicon files exist
RUN touch /app/favicon.png /app/favicon.ico

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S strapi -u 1001

# Set ownership
RUN chown -R strapi:nodejs /app

USER strapi

# Expose port
EXPOSE 1337

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
    CMD wget --quiet --tries=1 --spider http://localhost:1337/admin/login || exit 1

# Use dumb-init to handle proper signal forwarding
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]
