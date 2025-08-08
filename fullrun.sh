#!/bin/bash
./load.sh
docker stop $(docker ps -a -q --filter ancestor=cyrusn/next-school-admin-system:latest)
./prune.sh
./start.sh
