#!/bin/sh

# Get the current branch name
branch_name=$(git rev-parse --abbrev-ref HEAD)

# Define the pattern
valid_branch_regex="^(CASH|GRES)-[0-9]+/[a-z0-9.-]+$"

# Validate the branch name
if [[ ! $branch_name =~ $valid_branch_regex ]]; then
  echo "❌ Branch name '$branch_name' does not match the required pattern: $valid_branch_regex"
  exit 1
fi

echo "✅ Branch name '$branch_name' is valid."
