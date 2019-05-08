FROM prismagraphql/prisma:1.32
ENV PRISMA_CONFIG_PATH prisma.yml
COPY deployment/prisma/config.yml config.yml
COPY deployment/prisma/sub.sh sub.sh
ENTRYPOINT sh sub.sh && sh -c /app/start.sh
EXPOSE 4466
