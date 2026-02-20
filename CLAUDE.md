# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a monorepo template. Package manager is **pnpm@10.15.0**, requiring **Node.js >= 22.22.0**.

## Package Manager

Always use `pnpm` (not npm or yarn):

```bash
pnpm install          # Install dependencies
pnpm add <pkg>        # Add a dependency
pnpm add -D <pkg>     # Add a dev dependency
pnpm -F <pkg> <cmd>   # Run a command in a specific workspace package
```

## Monorepo Structure

- `apps/` — standalone applications
- `packages/` — shared libraries consumed by apps or other packages
- `pnpm-workspace.yaml` — workspace globs and shared dependency versions (`catalog:`)

## TypeScript

Shared configs live in `packages/typescript-config`. Each package extends the appropriate config:

```json
{ "extends": "@monorepo/typescript-config/node" }
```

Available configs:
- `base.json` — strict settings shared by all configs
- `node.json` — for Node.js apps/packages (`ESNext` + `Bundler`)

When adding a new package, add `"@monorepo/typescript-config": "workspace:*"` to its `devDependencies`.

Shared dependency versions are managed via `catalog:` in `pnpm-workspace.yaml`. Always use `catalog:` instead of hardcoded versions for deps listed there.
