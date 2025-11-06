#!/bin/bash

LOCATION='next-school-admin-system'
DEST='root@calp'

ssh $DEST "mkdir -p ~/$LOCATION"

rsync -rvv app.tar load.sh restart.sh start.sh $DEST:~/$LOCATION/

