#!/usr/bin/env bash
set -Eeuo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"
umask 077
[[ -f .env.production ]] || { echo 'Run ./deploy.sh first.' >&2; exit 1; }
DC=(docker compose --env-file .env.production -f docker-compose.production.yml)
output="backups/production-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$output"
"${DC[@]}" exec -T postgres sh -c 'exec pg_dump -Fc -U "$POSTGRES_USER" -d "$POSTGRES_DB"' > "$output/database.dump"
"${DC[@]}" exec -T strapi tar -czf - -C /app/public uploads > "$output/uploads.tar.gz"
printf 'Backup ready: %s\nKeep .env.production securely with your backups.\n' "$output"
