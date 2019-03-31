robjinman.com - Back-end API
============================

The back-end API for my personal website.


Dev environment setup
---------------------

Download and install nodejs to /opt.

Install yarn as per the instructions on the website.

Install VS Code via the .deb from the official website.

Set the NODE_PATH environment variable, and add the bin directories of both yarn
and node to the PATH. To ~/.bashrc append the following:

```
    export NODE_PATH=/opt/node-v10.15.0-linux-x64
    PATH="$NODE_PATH/bin:$PATH"

    PATH="/home/rob/.yarn/bin:$PATH"
```

Install the prisma CLI via yarn

```
    yarn global add prisma
```


Running the API locally
-----------------------

Ensure there is no local installation of postgres running

```
    sudo service postgresql stop
```

Create/run the docker containers, which contain the prisma server and the db
server.

```
    sudo docker-compose -f prisma/docker-compose.yml up
```

Deploy latest prisma configuration and apply DB migrations

```
    PRISMA_MANAGEMENT_API_SECRET=XXXXXX prisma deploy
```

Run the app

```
    node src/index.js
```


Useful links
------------

* https://www.howtographql.com/graphql-js/0-introduction/
