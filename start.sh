#!/bin/bash

docker image prune --force
docker container prune --force
docker run -p 3000:3000 cyrusn/next-school-admin-system:latest
