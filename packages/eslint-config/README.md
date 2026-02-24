# @monorepo/eslint-config

Shared **ESLint flat configurations** for all packages and apps in the monorepo.

## Installation

```bash
pnpm add -D @monorepo/eslint-config
```

## Available Configs

| Config  | Purpose                        | Plugins                                                    |
| ------- | ------------------------------ | ---------------------------------------------------------- |
| `base`  | Shared rules (all projects)    | `typescript-eslint`, `prettier`                            |
| `node`  | Node.js packages, CLI tools    | Extends `base`                                             |
| `react` | React components, Next.js apps | Extends `base` + `react-hooks`, `@next/eslint-plugin-next` |

## Quick Start

### Node.js Package

`eslint.config.mjs`:

```js
import { node } from '@monorepo/eslint-config/node';
import { defineConfig } from 'eslint/config';

export default defineConfig(...node, {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
        parserOptions: {
            project: './tsconfig.json',
            tsconfigRootDir: import.meta.dirname
        }
    }
});
```

### React Package or Next.js App

`eslint.config.mjs`:

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

## Configuration Details

### `base.js`

Shared linting rules for all projects:

- **`typescript-eslint`** — Type-safe linting with strict rules
- **`eslint-config-prettier`** — Disables Prettier-conflicting rules

Enforces:

- Proper TypeScript usage
- No unused imports
- No unused variables
- No implicit `any`
- Strict null checks

### `node.js`

For server-side code and packages:

- Extends `base`
- No React-specific rules
- Suitable for: CLI tools, backend services, configuration packages

### `react.js`

For client-side React and Next.js code:

- Extends `base`
- `react-hooks` — Enforces Rules of Hooks
- `@next/eslint-plugin-next` — Next.js best practices

Enforces:

- Hooks only called in components/custom hooks
- All dependencies in `useEffect` dependency arrays
- No problematic React patterns
- Next.js image optimization
- Next.js link usage

## Type Checking

Both configs support **TypeScript type-aware linting**.

**Required setup in each package:**

```js
languageOptions: {
    parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname
    }
}
```

This enables rules that need type information (e.g., detecting unused variables, unsafe null access, etc.).

## Customization

Override rules in your local config:

```js
import { react } from '@monorepo/eslint-config/react';
import { defineConfig } from 'eslint/config';

export default defineConfig(...react, {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
        '@typescript-eslint/no-explicit-any': 'warn', // Less strict
        'no-console': 'off' // Allow console
    }
});
```

## Usage Across Monorepo

- **`packages/i18n`** → `node`
- **`packages/ui`** → `react`
- **`packages/eslint-config`** → `node`
- **`packages/vitest-config`** → `node`
- **`packages/typescript-config`** → `node`
- **`apps/web`** → `react`

## Running ESLint

```bash
pnpm lint                           # All packages (via NX)
pnpm exec nx run @monorepo/ui:lint  # Specific package
```

## Flat Config Format

This package uses **ESLint v9+ flat config format** (`eslint.config.mjs`), not the legacy `.eslintrc` format.

## Prettier Integration

Prettier config is managed separately at the monorepo root (`prettier.config.mjs`). ESLint is configured to not conflict with Prettier formatting.

## For Developers

For development guidance, see [CLAUDE.md](./CLAUDE.md).

```bash
pnpm -F @monorepo/eslint-config lint
pnpm -F @monorepo/eslint-config typecheck
```
