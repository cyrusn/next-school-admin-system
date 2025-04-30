#!/bin/bash

LOCATION='next-school-admin-system'
DEST='root@calp'

ssh $DEST "mkdir -p ~/$LOCATION"

rsync -rv .env.key.json .env.local $DEST:~/$LOCATION/
