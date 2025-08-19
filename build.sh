#!/bin/bash

# Exit on any error
set -e

echo "Installing dependencies..."
npm ci --prefer-offline --no-audit

echo "Building the application..."
npm run build

echo "Build completed successfully!"
