#!/bin/bash
set -e

# Navigate to monorepo root (dependencies already installed by installCommand)
cd ../..

# Build dependencies
pnpm --filter @polotrip/db build

# Build MCP app
pnpm --filter @polotrip/mcp build
