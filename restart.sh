#!/bin/bash
tmux kill-session -t next
tmux new-session -d -s "next" ~/next-school-admin-system/start.sh
