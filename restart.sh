#!/bin/bash

# ./load.sh && ./stop.sh && ./start.sh && ./prune.sh
docker load -i ./app.tar

docker stop next

docker rm next

./start.sh

docker container prune -f

docker image prune -a -f
