#!/bin/bash

# This script runs Prisma commands as the postgres user

# Check if command is provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 <prisma-command>"
    exit 1
fi

COMMAND="$*"

# Run the Prisma command as postgres user
sudo -u postgres env $(grep -v '^#' .env | xargs) npx prisma $COMMAND

echo "Command completed." 