#!/bin/bash
docker build -t next-school-admin-system .
docker stop next-school-admin-system
docker run -p 3000:3000 next-school-admin-system --name next-school-admin-system



