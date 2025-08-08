#!/bin/bash

LOCATION='next-school-admin-system'
DEST='root@calp'

ssh $DEST "mkdir -p ~/$LOCATION"

rsync -rvv  app.tar *.sh $DEST:~/$LOCATION/
