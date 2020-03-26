robjinman.com - Back-end API
============================

The back-end API for my personal website.


Dev environment setup
---------------------

Download and install nodejs to /opt.

Install VS Code via the .deb from the official website.

Set the NODE_PATH environment variable, and add the bin directory of node to
the PATH. To ~/.bashrc append the following:

```
    export NODE_PATH=/opt/node-v10.15.0-linux-x64
    PATH="$NODE_PATH/bin:$PATH"
```

Install the prisma CLI via npm

```
    npm install -g prisma
```


Running the API locally
-----------------------

Ensure there is no local installation of postgres running

```
    sudo service postgresql stop
```

Set the environment variables

```
    source ./deployment/env_dev.sh
```

Run the app

```
    docker-compose up
```

Or, run the data layer separately from the app (so that the app can be restarted independently when
the code changes).

```
    source ./deployment/env_dev.sh

    docker-compose -f prisma/docker-compose.yml up
```

Deploy latest prisma configuration and apply DB migrations

```
    prisma deploy
```

To start the app. Kill and restart after changing the code.

```
    node ./src/index.js
```


Useful links
------------

* https://www.howtographql.com/graphql-js/0-introduction/
* https://www.prisma.io/tutorials/deploy-prisma-to-aws-fargate-ct14
