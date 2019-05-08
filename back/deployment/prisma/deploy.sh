#!/bin/bash -e

$(aws ecr get-login --no-include-email --region eu-west-2)
docker build --file deployment/prisma/Dockerfile --tag robjinman-com/prisma .
docker tag robjinman-com/prisma:latest 596072319882.dkr.ecr.eu-west-2.amazonaws.com/robjinman-com/prisma:latest
docker push 596072319882.dkr.ecr.eu-west-2.amazonaws.com/robjinman-com/prisma:latest

