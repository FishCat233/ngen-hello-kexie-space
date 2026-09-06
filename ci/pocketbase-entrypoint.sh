#!/bin/sh
set -eu

MIGRATIONS_DIR="${PB_MIGRATIONS_DIR:-/pb_migrations}"

/usr/local/bin/pocketbase migrate up \
  --dir=/pb_data \
  --migrationsDir="$MIGRATIONS_DIR"

exec /usr/local/bin/entrypoint.sh "$@"
