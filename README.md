RobertConsidine.net
===================

My personal website.


Main components
---------------

The running components of the app. The number is the port on which the service
runs when executed locally.

* 5432: Database server - PostgreSQL
* 4466: Prisma server - Data access layer to simplify DB access
* 4000: Back-end app - The GraphQL API
* 4201: Admin front-end app
* 4200: Front-end app


Commands
--------

### Running the app

Start the back-end app. From project_root/back, run

        source ./deployment/utils.sh
        extract_vars ./deployment/env_dev.txt

        docker-compose up

Build and run the admin app. From project_root/admin, run

        ng serve --watch

Build and run the front-end app. From project_root/front, run

        ng serve --watch


### Development

To run just the data layer, from project_root/back

        docker-compose -f prisma/docker-compose.yml up

Every time the GraphQL schema changes, apply DB migrations and regenerate prisma
client, then restart the back-end app

        PRISMA_MANAGEMENT_API_SECRET=XXXXXX prisma deploy
        node ./src/index.js

Regenerate types.ts (configured in codegen.yml)

        rm ./src/app/types.ts
        gql-gen

Create a new Angular component

        ng generate component my-component

Create a new Angular service

        ng generate service my-service



Populating with dummy data
--------------------------

Create the admin user.

        mutation {
          signup(
            name: "rob"
            email: "rob@mail.com"
            password: "admin"
          ) {
            token
          }
        }

Or if one already exists

        mutation {
          login(email: "rob@mail.com", password: "admin") {
            token
          }
        }

Add the following HTTP header with the returned token.

        HTTP HEADERS
        {"Authorization": "Bearer TOKEN"}

Post some articles.

        mutation {
	        article1: postArticle(
            title: "My First Article"
            summary: "A summary of my first article."
            content: "The contents of my first article"
            tags: ["first", "interesting", "fun"]
          ) {
            id
          },
	        article2: postArticle(
            title: "My Second Article"
            summary: "A summary of my second article."
            content: "The contents of my second article"
            tags: ["second", "very interesting", "cool"]
          ) {
            id
          },
	        article3: postArticle(
            title: "My Third Article"
            summary: "A summary of my third article."
            content: "The contents of my third article"
            tags: ["third", "amusing", "cool", "fun"]
          ) {
            id
          }
        }

### Hosting

#### S3

1. Name the bucket the same as the domain, e.g. www.example.com
2. Enable the 'static web hosting' option
3. Enable public access policies
4. Add a bucket policy to allow all GET requests

        {
            "Version": "2012-10-17",
            "Id": "PolicyForPublicWebsite",
            "Statement": [
                {
                    "Sid": "AddPerm",
                    "Effect": "Allow",
                    "Principal": "*",
                    "Action": "s3:GetObject",
                    "Resource": "arn:aws:s3:::robertconsidine.net/*"
                }
            ]
        }

5. Add a CNAME DNS entry to point to the bucket
