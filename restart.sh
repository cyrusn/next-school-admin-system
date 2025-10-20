#!/bin/bash

# ./load.sh && ./stop.sh && ./start.sh && ./prune.sh
docker load -i ./app.tar

docker stop next

docker rm next

docker run -d --name next -p 3000:3000 cyrusn/next-school-admin-system:latest

docker container prune -f

docker image prune -a -f
