#!/usr/bin/env bash
# Installs Java and DynamoDB Local for pnpm dev, if they are missing. WSL and Ubuntu only, because it uses apt.
# Usage, from any folder: bin/setup-local-db.sh
set -euo pipefail

db_dir="$(dirname "$0")/../api/.dynamodb-local"
db_jar="$db_dir/DynamoDBLocal.jar"
download_url="https://d1ni2b6xgvw0s0.cloudfront.net/v2.x/dynamodb_local_latest.tar.gz"

if command -v java > /dev/null && [ -f "$db_jar" ]; then
  echo "Java and DynamoDB Local are installed."
  exit 0
fi

if ! command -v java > /dev/null; then
  echo "Installing Java..."
  # A fresh WSL often has empty or stale package lists, and then apt install fails.
  sudo apt update
  sudo apt install -y openjdk-21-jre-headless
fi

if [ ! -f "$db_jar" ]; then
  # data/ holds the tables: the dev:db script in api/package.json points -dbPath at it.
  echo "Downloading DynamoDB Local..."
  mkdir -p "$db_dir/data"
  curl -fsSL "$download_url" | tar -xz -C "$db_dir"
  echo "DynamoDB Local is installed in api/.dynamodb-local/."
fi
