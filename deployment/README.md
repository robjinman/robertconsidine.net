Deploying robjinman.com
=======================

Deploying Prisma to AWS Fargate
-------------------------------

I followed [this guide](https://www.prisma.io/tutorials/deploy-prisma-to-aws-fargate-ct14).

A step that was missing from the guide was the creation of an IAM role.

        aws iam create-service-linked-role --aws-service-name ecs.amazonaws.com

From /back, source the env_prod.sh file and run prisma deploy.

        . ../deployment/env_prod.sh
        prisma deploy
