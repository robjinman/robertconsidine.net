#!/bin/bash -e

if [ -z "$PRISMA_MANAGEMENT_API_SECRET" ]; then
  echo "PRISMA_MANAGEMENT_API_SECRET environment variable not set. Aborting."
  exit 1
fi

if [ -z "$DATABASE_HOST" ]; then
  echo "DATABASE_HOST environment variable not set. Aborting."
  exit 1
fi

if [ -z "$DATABASE_PASSWORD" ]; then
  echo "DATABASE_PASSWORD environment variable not set. Aborting."
  exit 1
fi

PRISMA_CONFIG="
managementApiSecret: ${PRISMA_MANAGEMENT_API_SECRET}
port: 4466
databases:
  default:
    migrations: true
    connector: postgres
    host: ${DATABASE_HOST}
    port: 5432
    user: prisma
    password: ${DATABASE_PASSWORD}"

$(aws ecr get-login --no-include-email --region eu-west-2)
docker build --file deployment/prisma/Dockerfile --tag robjinman-com/prisma . --build-arg PRISMA_CONFIG="$PRISMA_CONFIG"
docker tag robjinman-com/prisma:latest 596072319882.dkr.ecr.eu-west-2.amazonaws.com/robjinman-com/prisma:latest
docker push 596072319882.dkr.ecr.eu-west-2.amazonaws.com/robjinman-com/prisma:latest
