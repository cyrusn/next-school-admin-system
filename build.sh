#!/bin/bash
docker buildx build --platform linux/amd64 -t cyrusn/next-school-admin-system:latest .
docker save -o app.tar cyrusn/next-school-admin-system:latest


