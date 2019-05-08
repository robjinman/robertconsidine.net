#!/bin/bash -e

$(aws ecr get-login --no-include-email --region eu-west-2)
docker build --file deployment/api/Dockerfile --tag robjinman-com/api .
docker tag robjinman-com/api:latest 596072319882.dkr.ecr.eu-west-2.amazonaws.com/robjinman-com/api:latest
docker push 596072319882.dkr.ecr.eu-west-2.amazonaws.com/robjinman-com/api:latest

