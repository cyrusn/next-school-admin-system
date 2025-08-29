#!/bin/bash

tmux new-session -d -s "next" 'cd ~/next-school-admin-system/ && docker run -p 3000:3000 cyrusn/next-school-admin-system:latest'
