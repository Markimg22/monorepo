# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a monorepo template. Package manager is **pnpm@10.15.0**, requiring **Node.js >= 22.22.0**.

## Package Manager

Always use `pnpm` (not npm or yarn):

```bash
pnpm install              # Install dependencies
pnpm add <pkg>            # Add a dependency
pnpm add -D <pkg>         # Add a dev dependency
pnpm -F <pkg> <cmd>       # Run a command in a specific workspace package
pnpm lefthook install     # Register git hooks (run after cloning)
```

## Monorepo Structure

- `apps/` — standalone applications
- `packages/` — shared libraries consumed by apps or other packages
- `pnpm-workspace.yaml` — workspace globs and shared dependency versions (`catalog:`)

Shared dependency versions are managed via `catalog:` in `pnpm-workspace.yaml`. Always use `catalog:` instead of hardcoded versions for deps listed there.

## Shared Packages

| Package                       | Purpose                      |
| ----------------------------- | ---------------------------- |
| `@monorepo/typescript-config` | Shared `tsconfig.json` bases |
| `@monorepo/eslint-config`     | Shared ESLint flat configs   |
| `@monorepo/prettier-config`   | Shared Prettier configs      |

When adding a new package, declare workspace deps with `"workspace:*"`:

```json
{
    "devDependencies": {
        "@monorepo/typescript-config": "workspace:*",
        "@monorepo/eslint-config": "workspace:*",
        "@monorepo/prettier-config": "workspace:*"
    }
}
```

## TypeScript

Each package extends the appropriate config in its `tsconfig.json`:

```json
{ "extends": "@monorepo/typescript-config/node" }
```

Available configs:

- `base.json` — strict settings shared by all configs
- `node.json` — for Node.js apps/packages (`ESNext` + `Bundler`)
- `nextjs.json` — for Next.js apps (`jsx: preserve`, `noEmit: true`)
- `react-library.json` — for React component packages (`jsx: react-jsx`)

## ESLint

Each package imports the appropriate config in its `eslint.config.mjs`:

```js
import { node } from '@monorepo/eslint-config/node';
// or
import { react } from '@monorepo/eslint-config/react';
```

Available configs:

- `base.js` — `typescript-eslint` + `eslint-config-prettier` (shared by all)
- `node.js` — extends base
- `react.js` — extends base + `eslint-plugin-react-hooks` + `@next/eslint-plugin-next`

## Prettier

Each package references the appropriate config in its `package.json`:

```json
{ "prettier": "@monorepo/prettier-config" }
```

Or for React (includes `prettier-plugin-tailwindcss`):

```json
{ "prettier": "@monorepo/prettier-config/react" }
```

## Git Hooks

Hooks are managed by **lefthook** and run automatically on commit:

- `pre-commit` — runs Prettier and ESLint with `--fix` on staged files
- `commit-msg` — validates commit message with commitlint

## Commit Convention

Commits follow [Conventional Commits](https://www.conventionalcommits.org/) enforced by commitlint.

Format:

```
<type>(<scope>): <description>
- <body>
```

Common types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `ci`

Examples:

```
feat(auth): add JWT authentication
- implement login and logout endpoints
- add refresh token support

chore(eslint-config): add react rules
fix(api): handle null response from external service
```
