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

## Apps

| App             | Purpose         | Stack                    |
| --------------- | --------------- | ------------------------ |
| `@monorepo/web` | Web application | Next.js, Tailwind CSS v4 |

## Shared Packages

| Package                       | Purpose                                         |
| ----------------------------- | ----------------------------------------------- |
| `@monorepo/ui`                | Shared React UI component library               |
| `@monorepo/i18n`              | Centralized internationalization (i18n) package |
| `@monorepo/typescript-config` | Shared `tsconfig.json` bases                    |
| `@monorepo/eslint-config`     | Shared ESLint flat configs                      |
| `@monorepo/vitest-config`     | Shared Vitest configs                           |

When adding a new package, declare workspace deps with `"workspace:*"`:

```json
{
    "devDependencies": {
        "@monorepo/typescript-config": "workspace:*",
        "@monorepo/eslint-config": "workspace:*",
        "@monorepo/vitest-config": "workspace:*"
    }
}
```

## NX

NX is configured in package-based mode (`nx.json`). It auto-discovers scripts from every `package.json` — no `project.json` files needed. `defaultBase` is set to `master`.

Run a target across all packages from the root:

```bash
pnpm dev            # nx run-many --target=dev
pnpm test           # nx run-many --target=test
pnpm test:coverage  # nx run-many --target=test:coverage
pnpm lint           # nx run-many --target=lint
pnpm typecheck      # nx run-many --target=typecheck
pnpm format         # prettier --write .
```

Run a target in a specific package:

```bash
pnpm exec nx run @monorepo/ui:lint
pnpm exec nx run @monorepo/ui:test
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

React packages that use `recommendedTypeChecked` must set `parserOptions.project` in their local `eslint.config.mjs`:

```js
import { react } from '@monorepo/eslint-config/react';
import { defineConfig } from 'eslint/config';

export default defineConfig(...react, {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
        parserOptions: {
            project: './tsconfig.json',
            tsconfigRootDir: import.meta.dirname
        }
    }
});
```

Also ensure `.storybook/**/*.ts` files are included in `tsconfig.json` using explicit glob patterns (TypeScript does not traverse dot-prefixed directories by default):

```json
{ "include": ["src", ".storybook/**/*.ts", ".storybook/**/*.tsx", "vite.config.ts"] }
```

## Tailwind CSS v4

### Theme sharing

`@monorepo/ui` exports two CSS entry points via the `exports` field (with `"style"` condition for Turbopack/enhanced-resolve compatibility):

- `@monorepo/ui/theme.css` — **source CSS** with CSS variables (`:root`, `.dark`), `@theme inline` (Tailwind token mapping), and `@custom-variant dark`. Distributed as source because `@theme inline` must be processed by each consumer's Tailwind build (it cannot be pre-compiled).
- `@monorepo/ui/styles.css` — **compiled CSS** (`dist/index.css`) with all pre-built component utility classes.

To consume the shared theme in a new app:

```css
@import 'tailwindcss';
@import '@monorepo/ui/theme.css';
@import '@monorepo/ui/styles.css';
```

### Export conditions

CSS exports in `@monorepo/ui` must use the `"style"` condition. Turbopack (Next.js) uses `enhanced-resolve` which looks for this condition when resolving CSS `@import`:

```json
"./theme.css": {
    "style": "./src/styles/theme.css",
    "default": "./src/styles/theme.css"
}
```

### Tailwind utility functions

`tailwindFunctions` is configured in the root `prettier.config.mjs` so `prettier-plugin-tailwindcss` sorts classes inside `cva`, `cn`, `clsx`, and `twMerge`. The VS Code workspace settings also configure `tailwindCSS.classFunctions` for IntelliSense in these functions.

## Prettier

Prettier config lives at the root `prettier.config.mjs` and applies to all packages.

For React packages using Tailwind CSS v4, create a local `prettier.config.mjs` that extends the root config and adds `tailwindStylesheet`:

```js
import rootConfig from '../../prettier.config.mjs';

export default {
    ...rootConfig,
    tailwindStylesheet: './src/styles/globals.css'
};
```

Then reference it in the package's `package.json`:

```json
{ "prettier": "./prettier.config.mjs" }
```

## Vitest

Each package imports the appropriate config in its `vitest.config.js`:

```js
import { base } from '@monorepo/vitest-config/base';
// or
import { react } from '@monorepo/vitest-config/react';

export default react;
```

The `react` config includes `globals: true`, `jsdom` environment, and `@testing-library/jest-dom/vitest` setup. Packages using it must declare `@vitest/coverage-v8` as a direct `devDependency` to use `--coverage`.

## Git Hooks

Hooks are managed by **lefthook** and run automatically on commit:

- `pre-commit` — runs Prettier on staged files and `nx affected --target=lint` on affected packages
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
