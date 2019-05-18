Deploying robjinman.com
=======================

Initial deployment to AWS
-------------------------

These are the steps I followed to set up the necessary infrastructure in the
cloud.

### Roles

Create a service-linked role. From the console, run

        aws iam create-service-linked-role --aws-service-name ecs.amazonaws.com

### NAT gateway

Create a NAT gateway on one of the public subnets. (Ideally, one in each
public subnet, but this could get expensive.)

### Subnets

Create a route table called 'robjinman-com-private'. Add a default route to
the NAT gateway (destination 0.0.0.0/0).

Create 3 private subnets in 3 different availability zones and associate them
with the above route table.

* robjinman-com-private-a
* robjinman-com-private-b
* robjinman-com-private-c

From AWS ElastiCache add the above subnets to a subnet group and name it
'robjinman-com-private'. Do the same from RDS to create an RDS subnet group.

### Creating the database

Create a Postgres RDS instance with name 'robjinman-com-db'. When prompted,
create a new security group. Call both the database and master user 'prisma'.
Add the database to the robjinman-com-private RDS subnet group.

### Security groups

Create the EC2 security groups

* robjinman-com-prisma-sg
* robjinman-com-api-sg

Add a rule to robjinman-com-prisma-sg to allow inbound traffic from
robjinman-com-api-sg and robjinman-com-prisma-sg on TCP port 4466.

Add a rule to the database's security group to allow inbound traffic from
robjinman-com-prisma-sg on TCP port 5432.

Add a rule to robjinman-com-api-sg to allow inbound traffic from anywhere
on TCP port 4000.

### SSL certificates

Obtain an SSL certificate for robjinman.com from AWS ACM using the region
US-East (N. Virginia). Set the domain to robjinman.com and set *.robjinman.com
as an additional name.

Repeat the above for the EU (London) region. The reason we need two certificates
is because CloudFront only works with certificates from US-East (N. Virginia),
but the load balancer will need a certificate from its own region.

Create an ECR repo called 'robjinman-com/prisma' and another called
'robjinman-com/api'. Copy the given commands into the respective deploy.sh and
edit accordingly.

### Building the docker images

Build the prisma docker image and publish to the ECR repo. From /back, run

        deployment/prisma/deploy.sh

Build the api docker image and publish to the ECR repo. From /back, run

        deployment/api/deploy.sh

### ECS setup

Create an IAM role of type 'Elastic container service task' and attach
the AmazonS3FullAccess policy. Call it 'ecs_task_s3_full_access'.

Create two ECS clusters based on the 'Networking only' template. Call them
'robjinman-com-prisma' and 'robjinman-com-api'.

### Load balancers

From EC2, create an internal load balancer called 'robjinman-com-prisma-lb'.
Select the private subnets. Assign the robjinman-com-prisma-sg security group.
Add a listener on port 4466. Create a new IP target group called
robjinman-com-prisma-tg with protocol HTTP/80. Set the health check endpoint to
/status.

Create an internet-facing load balancer with name 'robjinman-com-api-lb'.
Add an HTTPS listener on port 4000 and assign the public subnets. Assign the
robjinman-com-api-sg security group. Create an IP target group called
robjinman-com-api-tg with protocol HTTP/80. Set the health check endpoint to
/health.

### Create prisma instance

Create an ECS task definition of type 'Fargate' with name
'robjinman-com-prisma'.

Add a container, specifying the URI of the prisma docker image. Call it
'robjinman-com-prisma'. Add the port mapping 4466. Set the environment variables
from deployment/prisma/config.yml.

Create an ECS service on the robjinman-com-prisma cluster from the
robjinman-com-prisma task definition. Call it 'robjinman-com-prisma'. Set the
number of tasks to 1. Select all three private subnets. Set the security group
to robjinman-com-prisma-sg and disable auto-assign public IP. Select the
robjinman-com-prisma-lb load balancer, select the robjinman-com-prisma-tg target
group. Disable service discovery.

### Create api instance

Create an ECS task definition of type 'Fargate' with name 'robjinman-com-api'.
Set the task role to ecs_task_s3_full_access.

Add a container, specifying the URI of the api docker image. Call it
'robjinman-com-api'. Add the port mapping 4000. Set the relevant environment
variables defined in env_prod.sh.

Create an ECS service on the robjinman-com-api cluster from the
robjinman-com-api task definition. Call it 'robjinman-com-api'. Set the number
of tasks to 1. Select all three public subnets. Set the security group
to robjinman-com-api-sg. Keep auto-assign public IP enabled. Select the
robjinman-com-api-lb load balancer. Listen on HTTPS/443, but keep the target
group protocol on HTTP. Disable service discovery.

### Front-end apps

Create an S3 bucket and set its name to the domain that will point to it, i.e.
robjinman.com or blightednixhound.robjinman.com. Enable the 'static web hosting'
option. Enable public access policies. Add the following bucket policy with
the Resource set accordingly.

        {
            "Version": "2012-10-17",
            "Id": "PolicyForPublicWebsite",
            "Statement": [
                {
                    "Sid": "AddPerm",
                    "Effect": "Allow",
                    "Principal": "*",
                    "Action": "s3:GetObject",
                    "Resource": "arn:aws:s3:::blightednixhound.robjinman.com/*"
                }
            ]
        }

Add the following CORS configuration.

        <CORSConfiguration>
         <CORSRule>
          <AllowedOrigin>https://*.robjinman.com</AllowedOrigin>
          <AllowedMethod>POST</AllowedMethod>
          <AllowedMethod>GET</AllowedMethod>
          <AllowedHeader>*</AllowedHeader>
         </CORSRule>
        </CORSConfiguration>

Create a CloudFront distribution for each bucket, specifying the SSL certificate
and index.html as the root object. Add the bucket's domain name to 'alternate
domain names', e.g. blightednixhound.robjinman.com.

Configure each CloudFront distribution as follows:

* Edit the default behaviour to redirect HTTP requests to HTTPS.
* Add a custom error response to respond with index.html, status 200 on 404
errors (with TTL = 0).

### DNS configuration

In Route 53, add the following records:

* robjinman.com (A - alias) -> CloudFront distro for robjinman.com S3 bucket
* www.robjinman.com (CNAME) -> Same as above
* api.robjinman.com (A - alias) -> api-robjinman-com-lb load balancer
* blightednixhound.robjinman.com (A - alias) -> CloudFront distro for
  blightednixhound.robjinman.com S3 bucket


Subsequent Deployments
----------------------

### Back-end

To redeploy the back-end after code changes, run back/deployment/api/deploy.sh.
Run a new task in the robjinman-com-api service by updating the service and
selecting 'Force new deployment'. Then stop the old task. The task should
deploy the latest prisma schema on start up.

If for some reason the 'prisma deploy' fails, it can be run manually by spinning
up an EC2 instance on the public subnet, copying the prisma directory into it
and running the command from there.

From /back, copy the prisma directory to the instance and log in

        scp -r ./prisma ubuntu@35.176.188.95:/home/ubuntu/
        ssh ubuntu@35.176.188.95

Deploy the prisma schema

        PRISMA_ENDPOINT=XXXXXX PRISMA_MANAGEMENT_API_SECRET=XXXXXX prisma deploy

The api service still needs to be redeployed so that it has the generated
javascript files. It will usually succeed this time as the schema will be
up-to-date.

### Front-end and admin site

To build and deploy, from /front or /admin, run

        ng build --prod
        ./deploy.sh


Links
-----

* https://medium.com/@ariklevliber/aws-fargate-from-start-to-finish-for-a-nodejs-app-9a0e5fbf6361
* https://medium.com/smidyo-codex/deploying-a-production-ready-prisma-server-on-aws-fargate-ecs-how-to-properly-provide-f5909ad1e191
