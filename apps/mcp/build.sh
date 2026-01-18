#!/bin/bash
set -e

# Enable corepack and install pnpm
corepack enable
corepack prepare pnpm@9.14.2 --activate

# Navigate to monorepo root
cd ../..

# Install dependencies
pnpm install --frozen-lockfile

# Build dependencies
pnpm --filter @polotrip/db build

# Build MCP app
pnpm --filter @polotrip/mcp build
