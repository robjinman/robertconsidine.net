Deploying robjinman.com
=======================

The prisma server is deployed to AWS Fargate, a simpler alternative to EC2 for
running containerized applications.

The PostgreSQL database is deployed to AWS RDS.


Initial deployment to AWS
-------------------------

These are the steps I followed to set up the necessary infrastructure in the
cloud.

Create a service-linked role. From the console, run

        aws iam create-service-linked-role --aws-service-name ecs.amazonaws.com

Create a CloudFormation stack with the supplied postgres template.

Create a CloudFormation stack with the supplied fargate template.

Add a CNAME DNS record for api.robjinman.com pointing to the prisma service's
load balancer.


Deploying the code
------------------

From /back, source the env_prod.sh file and run prisma deploy.

        . ../deployment/env_prod.sh
        prisma deploy


Links
-----

* https://www.prisma.io/tutorials/deploy-prisma-to-aws-fargate-ct14
