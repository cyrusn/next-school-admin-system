#!/bin/bash

LOCATION='next-school-admin-system'
DEST='root@calp'

ssh $DEST "mkdir -p ~/$LOCATION"

rsync -rvvvv  app.tar load.sh start.sh $DEST:~/$LOCATION/
