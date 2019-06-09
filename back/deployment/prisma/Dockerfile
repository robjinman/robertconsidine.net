FROM prismagraphql/prisma:1.32

RUN apk add curl

ARG PRISMA_CONFIG
ENV PRISMA_CONFIG=$PRISMA_CONFIG

RUN if [ -z "$PRISMA_CONFIG" ]; then echo "Missing required arg PRISMA_CONFIG"; exit 1; fi

ENTRYPOINT sh -c /app/start.sh

EXPOSE 4466
