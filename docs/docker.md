## Run with docker

```bash
# build docker image
$ docker build -t <image-name> .

# run docker image
$ docker run -p 3000:3000 <image-name>

# build docker image monorepo
$ docker build --platform=linux/amd64 -f apps/transcoder/Dockerfile -t transcoder:1.0.0 .
$ docker build --platform=linux/amd64 -f apps/api/Dockerfile -t api:1.0.0 .

$ docker build --platform=linux/amd64 -f apps/transcoder/Dockerfile -t transcoder:2.0.0 .

or

# run docker-compose
$ docker-compose up
```

## Push to docker hub

```bash

# create docker tag
$ docker tag api:1.0.0 thanhan201/api:1.0.0

# push to docker hub
$ docker push thanhan201/api:1.0.0
```
