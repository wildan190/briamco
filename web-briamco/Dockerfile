FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
ENV NPM_CONFIG_FETCH_RETRIES=5 \
    NPM_CONFIG_FETCH_RETRY_MINTIMEOUT=10000 \
    NPM_CONFIG_FETCH_RETRY_MAXTIMEOUT=60000 \
    NPM_CONFIG_FETCH_TIMEOUT=180000 \
    NPM_CONFIG_MAXSOCKETS=5
# Keep downloaded packages when a network interruption causes an install retry.
RUN --mount=type=cache,id=briamco-npm,target=/root/.npm,sharing=locked \
    set -eu; \
    for attempt in 1 2 3; do \
      if npm ci  --prefer-offline --no-audit --no-fund; then exit 0; fi; \
      if [ "$attempt" -eq 3 ]; then echo "npm install failed after 3 attempts" >&2; exit 1; fi; \
      echo "npm install interrupted; retrying ($attempt/3)..."; \
      sleep 10; \
    done
COPY . .
ARG VITE_STRAPI_URL
ENV VITE_STRAPI_URL=$VITE_STRAPI_URL NODE_ENV=production
RUN npm run build
FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
