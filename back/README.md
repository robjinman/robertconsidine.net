RobJinman.com
=============

Running the API locally
-----------------------

Ensure there is no local installation of postgres running

```
    sudo service postgresql stop
```

Create/run the docker containers

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
