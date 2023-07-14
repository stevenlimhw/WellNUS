#!/bin/sh
set -e

echo "run db migration."
/app/migrate -path /app/migration -database "postgresql://root:password@postgres:5432/wellnus?sslmode=disable" -verbose up

echo "start the app."
exec "$@"