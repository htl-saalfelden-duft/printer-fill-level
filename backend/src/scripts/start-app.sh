#!/bin/bash
set -e

echo "Stop and Remove Containers"
docker  compose down
echo "Build API"
docker compose up --build -d
echo "Generate Migrations"
docker compose exec api npm run migration:generate init
docker compose exec api npx tsc -p tsconfig.build.json
