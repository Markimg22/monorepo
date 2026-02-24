# @monorepo/typescript-config — CLAUDE.md

Guidance for working with the shared TypeScript configurations.

## Overview

Provides **reusable TypeScript configuration bases** for all packages and apps in the monorepo. Each config is tailored to a specific environment or use case, extending a common strict `base.json`.

## Structure

```
packages/typescript-config/
├── base.json              # Strict base config (shared by all)
├── node.json              # Node.js packages/apps
├── nextjs.json            # Next.js applications
├── react-library.json     # React component libraries
└── package.json
```

## Configurations

### `base.json`

**Strict TypeScript settings** shared by all other configs:

```json
{
    "compilerOptions": {
        "strict": true,
        "noImplicitAny": true,
        "noImplicitThis": true,
        "strictNullChecks": true,
        "strictFunctionTypes": true,
        "strictBindCallApply": true,
        "strictPropertyInitialization": true,
        "noImplicitReturns": true,
        "noFallthroughCasesInSwitch": true,
        "noUncheckedIndexedAccess": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "exactOptionalPropertyTypes": true,
        "noPropertyAccessFromIndexSignature": true
    }
}
```

### `node.json`

For **Node.js packages and CLI tools**:

```json
{
    "extends": "./base.json",
    "compilerOptions": {
        "target": "ESNext",
        "module": "ESNext",
        "moduleResolution": "bundler",
        "lib": ["ESNext"],
        "declaration": true,
        "declarationMap": true,
        "sourceMap": true,
        "outDir": "dist"
    },
    "include": ["src"]
}
```

**Used by:**

- `packages/i18n`
- `packages/eslint-config`
- `packages/vitest-config`
- `packages/typescript-config`

### `nextjs.json`

For **Next.js applications**:

```json
{
    "extends": "./base.json",
    "compilerOptions": {
        "target": "ESNext",
        "lib": ["ESNext", "DOM", "DOM.Iterable"],
        "jsx": "preserve",
        "noEmit": true,
        "module": "ESNext",
        "moduleResolution": "bundler",
        "allowJs": true,
        "resolveJsonModule": true,
        "skipLibCheck": true
    },
    "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
    "exclude": ["node_modules"]
}
```

**Used by:**

- `apps/web`

### `react-library.json`

For **React component libraries**:

```json
{
    "extends": "./base.json",
    "compilerOptions": {
        "target": "ESNext",
        "lib": ["ESNext", "DOM", "DOM.Iterable"],
        "jsx": "react-jsx",
        "declaration": true,
        "declarationMap": true,
        "sourceMap": true,
        "module": "ESNext",
        "moduleResolution": "bundler",
        "resolveJsonModule": true,
        "outDir": "dist"
    },
    "include": ["src", ".storybook/**/*.ts", ".storybook/**/*.tsx", "vite.config.ts"]
}
```

**Used by:**

- `packages/ui`

## Usage in Packages

Each package's `tsconfig.json` extends an appropriate base:

```json
{
    "extends": "@monorepo/typescript-config/node"
}
```

Or with relative imports:

```json
{
    "extends": "../../packages/typescript-config/node.json"
}
```

## Customization

Packages can **extend and override** settings:

```json
{
    "extends": "@monorepo/typescript-config/node",
    "compilerOptions": {
        "outDir": "build",
        "baseUrl": ".",
        "paths": {
            "@/*": ["src/*"]
        }
    },
    "include": ["src", "scripts", "vite.config.ts"]
}
```

## Adding New Configs

1. Create `<name>.json` in this package
2. Extend `base.json`
3. Document in CLAUDE.md and README.md
4. Update packages/apps to use it

## Development

```bash
pnpm -F @monorepo/typescript-config lint
pnpm -F @monorepo/typescript-config typecheck
```

This package exports only JSON files — no TypeScript/JavaScript code to build or test.

## Distribution

The package is published to npm. Consumers import via the `extends` field in their `tsconfig.json`.
