# @monorepo/eslint-config — CLAUDE.md

Guidance for working with the shared ESLint configurations.

## Overview

Provides **reusable ESLint flat configs** for all packages and apps in the monorepo. Uses **ESLint v9+** flat config format with TypeScript support.

## Structure

```
packages/eslint-config/
├── src/
│   ├── configs/
│   │   ├── base.js             # Shared base config
│   │   ├── node.js             # Node.js packages
│   │   └── react.js            # React packages/apps
│   └── index.ts                # Export all configs
├── eslint.config.mjs           # ESLint config for this package
└── package.json
```

## Configurations

### `base.js`

**Shared rules** for all environments:

- **typescript-eslint**: Type-safe linting
- **eslint-config-prettier**: Disables Prettier-conflicting rules

```js
import { base } from '@monorepo/eslint-config/base';

export default defineConfig(...base);
```

### `node.js`

For **Node.js packages**, CLI tools, and backend code:

- Extends `base`
- No React-specific rules

```js
import { node } from '@monorepo/eslint-config/node';

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

**Used by:**

- `packages/i18n`
- `packages/eslint-config`
- `packages/vitest-config`
- `packages/typescript-config`

### `react.js`

For **React packages and Next.js apps**:

- Extends `base`
- Adds `eslint-plugin-react-hooks`
- Adds `@next/eslint-plugin-next` (Next.js specific)

```js
import { react } from '@monorepo/eslint-config/react';

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

**Used by:**

- `packages/ui`
- `apps/web`

## Usage

### Node Packages

`packages/i18n/eslint.config.mjs`:

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

### React Packages

`packages/ui/eslint.config.mjs`:

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

## TypeScript Type Checking

Both `node` and `react` configs require `parserOptions.project` when using rules that need type information.

**Must set in each package's ESLint config:**

```js
languageOptions: {
    parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname
    }
}
```

**Without this**, you'll see errors like:

```
You have used a rule which requires type information, but don't have parserOptions set
```

## Customization

Extend and add custom rules in package-specific configs:

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
    },
    rules: {
        '@typescript-eslint/no-explicit-any': 'warn' // Override
    }
});
```

## Running ESLint

```bash
pnpm lint                           # All packages
pnpm exec nx run @monorepo/ui:lint  # Specific package
```

## Development

```bash
pnpm -F @monorepo/eslint-config lint
pnpm -F @monorepo/eslint-config typecheck
```

## Included Rules

### typescript-eslint

Type-safe JavaScript/TypeScript linting:

- Unused variables detection
- Unused function parameters
- Strict null checks
- Unused `@typescript-eslint` types
- Promise handling
- Async/await safety

### react-hooks (React only)

Enforces React Hooks rules:

- `rules-of-hooks` — Hooks called only in components/hooks
- `exhaustive-deps` — Dependency arrays are complete

### @next/eslint-plugin-next (React only)

Next.js specific checks:

- Proper use of `next/image`
- Proper use of `next/link`
- No unused CSS modules
- Script optimization

## Distribution

This package is published to npm. Consumers import via:

```js
import { node } from '@monorepo/eslint-config/node';
// or
import { react } from '@monorepo/eslint-config/react';
```

## Related

- **TypeScript Config**: `@monorepo/typescript-config`
- **Prettier**: Root `prettier.config.mjs`
- **Commitlint**: Root `.commitlintrc.cjs`
