Minimal Deployment
==================

A fairly minimal cloud deployment that is more cost efficient than what is described in
deployment.md.

Copy task_template.json to task.json and replace all instances of XXXXXXXX with the correct values.


Initial deployment
------------------

The following assumes an existing VPC with two subnets and an existing RDS instance with its own
security group.

Install the ECS CLI

        sudo curl -o /usr/local/bin/ecs-cli https://amazon-ecs-cli.s3.amazonaws.com/ecs-cli-linux-amd64-latest

Check version

        ecs-cli --version

Configure the CLI

        ecs-cli configure profile --profile-name robjinman-com --access-key $AWS_ACCESS_KEY_ID --secret-key $AWS_SECRET_ACCESS_KEY
        ecs-cli configure --cluster robjinman-com --default-launch-type EC2 --region eu-west-2 --config-name robjinman-com

If you don't already have a VPC, create one

        aws ec2 create-vpc --cidr-block 172.31.0.0/16

If a task execution role doesn't already exist, we need to create one. First,
create a file called task-execution-assume-role.json with the following contents

        {
          "Version": "2012-10-17",
          "Statement": [
            {
              "Sid": "",
              "Effect": "Allow",
              "Principal": {
                "Service": "ecs-tasks.amazonaws.com"
              },
              "Action": "sts:AssumeRole"
            }
          ]
        }

And then create the role

        aws iam --region eu-west-2 create-role --role-name ecsTaskExecutionRole --assume-role-policy-document file://task-execution-assume-role.json
        aws iam --region eu-west-2 attach-role-policy --role-name ecsTaskExecutionRole --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy

Create a security group and allow SSH access from your IP. Allow traffic to port 4000 from anywhere.

        curl https://checkip.amazonaws.com # Returns your IP, e.g. 203.0.113.57

        aws ec2 create-security-group --group-name robjinman-com-sg --description "Robjinman.com SG" --vpc-id vpc-53001c3a
        aws ec2 authorize-security-group-ingress --group-id sg-00236cc26a17e7a7a --protocol tcp --port 22 --cidr 203.0.113.57/32
        aws ec2 authorize-security-group-ingress --group-id sg-00236cc26a17e7a7a --protocol tcp --port 4000 --cidr 0.0.0.0/0
        aws ec2 authorize-security-group-ingress --group-id sg-00236cc26a17e7a7a --ip-permissions IpProtocol=tcp,FromPort=4000,ToPort=4000,Ipv6Ranges=[{CidrIpv6=::/0}]

Allow access to the RDS instance from the new security group

        aws ec2 authorize-security-group-ingress --group-id sg-070da3a38b5f040dd --protocol tcp --port 5432 --source-group sg-00236cc26a17e7a7a

Create a cluster with a single container instance

        ecs-cli up --keypair rob-desktop --capability-iam --size 1 --instance-type t2.small --vpc vpc-53001c3a --subnets subnet-802022fb,subnet-0fe6b542 --security-group sg-00236cc26a17e7a7a --cluster-config robjinman-com

Create the task definition

        aws ecs register-task-definition --cli-input-json file://task.json

Create the service from the task definition

        aws ecs create-service \
          --cluster robjinman-com \
          --service-name robjinman-com \
          --task-definition robjinman-com \
          --desired-count 1 \
          --network-configuration '{
            "awsvpcConfiguration": {
              "subnets": ["subnet-802022fb", "subnet-0fe6b542"],
              "securityGroups": ["sg-00236cc26a17e7a7a"]
            }
          }'

Create a load balancer

        aws elb create-load-balancer --load-balancer-name robjinman-com-lb --listeners "Protocol=HTTPS,LoadBalancerPort=4000,InstanceProtocol=HTTP,InstancePort=4000,SSLCertificateId=arn:aws:acm:eu-west-2:596072319882:certificate/bde76772-7de4-44f6-8f48-e9513d1c0c0d" --subnets subnet-0fe6b542 subnet-802022fb subnet-b04c9dd9 --security-groups sg-00236cc26a17e7a7a

        aws elb register-instances-with-load-balancer --load-balancer-name robjinman-com-lb --instances i-0688f3ab5ceb60947

        aws elb configure-health-check --load-balancer-name robjinman-com-lb --health-check Target=HTTP:4000/health,Interval=30,UnhealthyThreshold=2,HealthyThreshold=2,Timeout=3


Subsequent deployments
----------------------

After code changes to the back-end, build and redeploy the docker image

        ./deployment/api/deploy.sh

Redeploying after updating the task definition

        aws ecs register-task-definition --cli-input-json file://task.json
        aws ecs update-service --cluster robjinman-com --service robjinman-com --task-definition robjinman-com

Redeploying after updating docker images

        aws ecs update-service --cluster robjinman-com --service robjinman-com --task-definition robjinman-com --force-new-deployment

If the above complains about lack of EC2 instances available, you may need to stop the task first.

        aws ecs stop-task --cluster robjinman-com --task 7517bf3b-923f-4644-9bfd-4c90a6b6296d

The task ID can be obtained by running

        aws ecs list-tasks --cluster robjinman-com


Useful commands
---------------

SSH into an EC2 instance

        ssh ec2-user@18.130.231.249

List Docker containers

        docker ps

Attach to running Docker container

        docker exec -i -t 5d6fae20a21c bash
