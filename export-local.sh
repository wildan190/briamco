#!/usr/bin/env bash
set -Eeuo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"
umask 077
output="backups/local-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$output"
echo 'Exporting local database and uploaded files. Avoid editing CMS content during export.'
docker exec briamco-postgres sh -c 'exec pg_dump -Fc -U "$POSTGRES_USER" -d "$POSTGRES_DB"' > "$output/database.dump"
docker exec briamco-strapi tar -czf - -C /app/public uploads > "$output/uploads.tar.gz"
printf 'Export ready: %s\nCopy this directory securely to the VPS, then use ./deploy.sh --import /path/to/directory on a NEW database.\n' "$output"
