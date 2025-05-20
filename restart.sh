#!/bin/bash
docker stop next-school-admin-system
docker run -p 3000:3000 --name next-school-admin-system next-school-admin-system

