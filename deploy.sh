#!/usr/bin/env bash
set -Eeuo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"
umask 077
command -v docker >/dev/null || { echo 'Install Docker Engine and the Docker Compose plugin first.' >&2; exit 1; }
docker compose version >/dev/null
docker info >/dev/null
command -v curl >/dev/null || { echo 'curl is required for deployment health checks.' >&2; exit 1; }
command -v openssl >/dev/null || { echo 'openssl is required to generate secrets.' >&2; exit 1; }
IMPORT_DIR=''
if [[ ${1:-} == --import ]]; then
  [[ -n ${2:-} && -d $2 ]] || { echo 'Usage: ./deploy.sh [--import /path/to/export-directory]' >&2; exit 1; }
  IMPORT_DIR=$(cd -- "$2" && pwd)
elif [[ $# -gt 0 ]]; then echo 'Usage: ./deploy.sh [--import /path/to/export-directory]' >&2; exit 1; fi
if [[ ! -f .env.production ]]; then
  key() { openssl rand -hex 32; }
  cat > .env.production <<ENV
DOMAIN=subs.sicepot.com
PUBLIC_URL=https://subs.sicepot.com
VPS_IP=163.227.96.70
LETSENCRYPT_EMAIL=
DATABASE_NAME=briamco_db
DATABASE_USER=strapi
DATABASE_PASSWORD=$(key)
APP_KEYS=$(key),$(key),$(key),$(key)
ADMIN_JWT_SECRET=$(key)
API_TOKEN_SALT=$(key)
TRANSFER_TOKEN_SALT=$(key)
JWT_SECRET=$(key)
ENV
  echo 'Created .env.production with random secrets. Keep this file and back it up securely.'
fi
chmod 600 .env.production
# This is a trusted, local administrator-owned environment file.
set -a
source .env.production
set +a
[[ $DOMAIN =~ ^[a-zA-Z0-9][a-zA-Z0-9.-]+[a-zA-Z0-9]$ && $DOMAIN != *..* ]] || { echo 'Invalid DOMAIN.' >&2; exit 1; }
[[ $PUBLIC_URL == "https://$DOMAIN" ]] || { echo 'PUBLIC_URL must equal https://DOMAIN (without trailing slash).' >&2; exit 1; }
for required in VPS_IP DATABASE_NAME DATABASE_USER DATABASE_PASSWORD APP_KEYS ADMIN_JWT_SECRET API_TOKEN_SALT TRANSFER_TOKEN_SALT JWT_SECRET; do
  [[ -n ${!required:-} ]] || { echo "Missing $required in .env.production" >&2; exit 1; }
done
[[ $DATABASE_NAME =~ ^[a-zA-Z_][a-zA-Z0-9_]*$ && $DATABASE_USER =~ ^[a-zA-Z_][a-zA-Z0-9_]*$ ]] || { echo 'Database name/user must be SQL identifiers.' >&2; exit 1; }
DC=(docker compose --env-file .env.production -f docker-compose.production.yml)
"${DC[@]}" config --quiet
mkdir -p deploy/nginx/runtime
# Preserve an existing HTTPS configuration on repeat deployments.
write_http() {
  { printf 'server {\n listen 80;\n server_name %s;\n location /.well-known/acme-challenge/ { root /var/www/certbot; }\n' "$DOMAIN"
    cat deploy/nginx/proxy.conf.template
    printf '\n}\n'
  } > deploy/nginx/runtime/default.conf
}
write_https() {
  { printf 'server {\n listen 80;\n server_name %s;\n location /.well-known/acme-challenge/ { root /var/www/certbot; }\n location / { return 301 https://$host$request_uri; }\n}\n' "$DOMAIN"
    printf 'server {\n listen 443 ssl;\n http2 on;\n server_name %s;\n ssl_certificate /etc/letsencrypt/live/%s/fullchain.pem;\n ssl_certificate_key /etc/letsencrypt/live/%s/privkey.pem;\n ssl_protocols TLSv1.2 TLSv1.3;\n ssl_session_cache shared:SSL:10m;\n' "$DOMAIN" "$DOMAIN" "$DOMAIN"
    cat deploy/nginx/proxy.conf.template
    printf '\n}\n'
  } > deploy/nginx/runtime/default.conf
}
echo 'Building production frontend and Strapi images...'
"${DC[@]}" build --pull
if [[ -n $IMPORT_DIR ]]; then
  [[ -s $IMPORT_DIR/database.dump && -s $IMPORT_DIR/uploads.tar.gz ]] || { echo 'Import requires database.dump and uploads.tar.gz.' >&2; exit 1; }
  # Never overwrite an initialized database, including databases containing enquiries.
  "${DC[@]}" up -d --wait --wait-timeout 120 postgres
  count=$("${DC[@]}" exec -T postgres psql -U "$DATABASE_USER" -d "$DATABASE_NAME" -Atc "SELECT count(*) FROM pg_tables WHERE schemaname='public'")
  [[ $count == 0 ]] || { echo 'Import refused: production database is not empty. No data was replaced.' >&2; exit 1; }
  echo 'Importing existing database and uploaded media...'
  "${DC[@]}" exec -T postgres pg_restore --exit-on-error --no-owner --no-acl -U "$DATABASE_USER" -d "$DATABASE_NAME" < "$IMPORT_DIR/database.dump"
  "${DC[@]}" run --rm --no-deps -T --user root --entrypoint sh strapi -c 'tar -xzf - -C /app/public && chown -R node:node /app/public/uploads' < "$IMPORT_DIR/uploads.tar.gz"
fi
if "${DC[@]}" run --rm --no-deps --entrypoint sh certbot -c "test -s /etc/letsencrypt/live/$DOMAIN/fullchain.pem"; then
  write_https
else
  write_http
fi
echo 'Starting database, CMS, frontend and Nginx...'
"${DC[@]}" up -d --wait --wait-timeout 600 postgres strapi frontend nginx
"${DC[@]}" exec -T nginx nginx -t
"${DC[@]}" exec -T nginx nginx -s reload
email_args=(--register-unsafely-without-email)
if [[ -n ${LETSENCRYPT_EMAIL:-} ]]; then email_args=(--email "$LETSENCRYPT_EMAIL"); fi
echo "Obtaining/validating HTTPS certificate. DNS A record must point $DOMAIN to $VPS_IP; ports 80 and 443 must be open."
if ! "${DC[@]}" run --rm --no-deps certbot certonly --webroot -w /var/www/certbot --non-interactive --agree-tos --keep-until-expiring "${email_args[@]}" -d "$DOMAIN"; then
  echo 'Certificate issuance failed. Check DNS and port 80, then run ./deploy.sh again. Database volumes were preserved.' >&2
  exit 1
fi
write_https
"${DC[@]}" exec -T nginx nginx -t
"${DC[@]}" exec -T nginx nginx -s reload
"${DC[@]}" up -d certificate-renewal
# Verify the public endpoints through this host, independent of DNS caching.
curl --fail --silent --show-error --resolve "$DOMAIN:443:127.0.0.1" "https://$DOMAIN/_health" -o /dev/null
curl --fail --silent --show-error --resolve "$DOMAIN:443:127.0.0.1" "https://$DOMAIN/" -o /dev/null
curl --fail --silent --show-error --resolve "$DOMAIN:443:127.0.0.1" "https://$DOMAIN/api/website-content?locale=en" -o /dev/null
printf '\nDeployment ready.\nWebsite: %s\nStrapi admin: %s/admin\n' "$PUBLIC_URL" "$PUBLIC_URL"
echo 'On a new database, create your first admin account in /admin. Existing imported admin accounts keep their passwords.'
