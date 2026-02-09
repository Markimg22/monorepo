# Initial Configuration

Step-by-step guide to configure the monorepo from scratch.

## Summary

- [Requirements](#requirements)
- [Initializing the Project](#initializing-the-project)
- [Workspace Configuration](#workspace-configuration)
- [Shared Packages](#shared-packages)
    - [typescript-config](#typescript-config)
    - [biome-config](#biome-config)
    - [vitest-config](#vitest-config)
- [Git Hooks](#git-hooks)
    - [Commitlint](#commitlint)
    - [Lefthook](#lefthook)
    - [Conventional Commits](#conventional-commits)
- [Workflow](#workflow)
    - [TurboRepo](#turborepo)
    - [Commands](#commands)
    - [Generators](#generators)
    - [Creating Projects Manually](#creating-projects-manually)
---

## Requirements

| Tool | Version |
|------|---------|
| Node.js | >= 22.22.0 |
| pnpm | 10.15.0 |

---

## Initializing the Project

At the project root, run:

```bash
pnpm init
```

Configure `package.json`:

```json
{
    "name": "monorepo",
    "version": "1.0.0",
    "description": "A template for a Monorepo project.",
    "license": "MIT",
    "author": "@Markimg22",
    "packageManager": "pnpm@10.15.0",
    "engines": {
        "node": ">=22.22.0"
    },
    "keywords": [
        "monorepo",
        "template"
    ]
}
```

---

## Workspace Configuration

Create the `pnpm-workspace.yaml` file at the root:

```yaml
packages:
    - apps/*
    - packages/*

catalog:
    '@biomejs/biome': 2.3.14
    '@tailwindcss/postcss': 4.1.18
    '@testing-library/jest-dom': 6.9.1
    '@testing-library/react': 16.3.2
    '@testing-library/user-event': 14.6.1
    '@types/node': 24.5.0
    '@types/react': 19.2.11
    '@types/react-dom': 19.2.3
    '@vitest/coverage-v8': 4.0.18
    jsdom: 26.1.0
    lucide-react: ^0.563.0
    react: 19.2.3
    react-dom: 19.2.3
    tailwindcss: 4.1.18
    typescript: 5.9.2
    vite: ^6.4.1
    vitest: 4.0.17

injectWorkspacePackages: true
```

**Explanation:**

- `packages` - Defines the monorepo directories
- `catalog` - Centralizes shared dependency versions
- `injectWorkspacePackages` - Allows injecting workspace packages

Create `.gitignore`:

```text
node_modules
dist
.turbo
.next
coverage
.DS_Store
```

**Initial structure:**

```
.
├── .gitignore
├── package.json
└── pnpm-workspace.yaml
```

---

## Shared Packages

Packages are located in `packages/` and are shared across all monorepo projects.

### typescript-config

Shared TypeScript configurations.

```bash
mkdir -p packages/typescript-config
cd packages/typescript-config
pnpm init
```

**`package.json`:**

```json
{
    "name": "@monorepo/typescript-config",
    "version": "1.0.0",
    "description": "Shared TypeScript configurations for monorepo",
    "author": "@Markimg22",
    "license": "MIT",
    "type": "module",
    "exports": {
        "./base.json": "./base.json",
        "./node.json": "./node.json",
        "./library.json": "./library.json",
        "./react.json": "./react.json"
    },
    "files": ["*.json"],
    "devDependencies": {
        "@types/node": "catalog:",
        "typescript": "catalog:"
    }
}
```

**`base.json`** - Base configuration:

```json
{
    "$schema": "https://json.schemastore.org/tsconfig",
    "display": "Base",
    "compilerOptions": {
        "strict": true,
        "strictNullChecks": true,
        "noUncheckedIndexedAccess": true,
        "noImplicitOverride": true,
        "noEmitOnError": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "resolveJsonModule": true,
        "isolatedModules": true,
        "verbatimModuleSyntax": true,
        "moduleDetection": "force",
        "declaration": true,
        "declarationMap": true,
        "sourceMap": true
    },
    "exclude": ["node_modules", "dist"]
}
```

**`node.json`** - For Node.js projects:

```json
{
    "$schema": "https://json.schemastore.org/tsconfig",
    "display": "Node.js 22",
    "extends": "./base.json",
    "compilerOptions": {
        "lib": ["ES2024"],
        "target": "ES2024",
        "module": "NodeNext",
        "moduleResolution": "NodeNext",
        "outDir": "dist",
        "rootDir": "src"
    }
}
```

**`library.json`** - For shared libraries:

```json
{
    "$schema": "https://json.schemastore.org/tsconfig",
    "display": "Library",
    "extends": "./base.json",
    "compilerOptions": {
        "lib": ["ES2024"],
        "target": "ES2024",
        "module": "NodeNext",
        "moduleResolution": "NodeNext",
        "outDir": "dist",
        "rootDir": "src",
        "composite": true
    }
}
```

> `composite: true` enables project references for incremental builds.

**Usage:**

```json
{
    "extends": "@monorepo/typescript-config/node.json"
}
```

**`react.json`** - For React projects:

```json
{
    "$schema": "https://json.schemastore.org/tsconfig",
    "display": "React",
    "extends": "./base.json",
    "compilerOptions": {
        "lib": ["ES2024", "DOM", "DOM.Iterable"],
        "target": "ES2022",
        "module": "ESNext",
        "moduleResolution": "bundler",
        "jsx": "react-jsx"
    }
}
```

**Usage:**

```json
{
    "extends": "@monorepo/typescript-config/react.json"
}
```

---

### biome-config

Biome configuration for linting and formatting.

```bash
mkdir -p packages/biome-config
cd packages/biome-config
pnpm init
```

**`package.json`:**

```json
{
    "name": "@monorepo/biome-config",
    "version": "1.0.0",
    "description": "Shared Biome configuration for monorepo",
    "author": "@Markimg22",
    "license": "MIT",
    "type": "module",
    "exports": {
        "./biome.json": "./biome.json"
    },
    "files": ["biome.json"],
    "devDependencies": {
        "@biomejs/biome": "catalog:"
    }
}
```

**`biome.json`:**

```json
{
    "$schema": "https://biomejs.dev/schemas/2.3.14/schema.json",
    "root": false,
    "files": {
        "includes": ["**", "!**/*.hbs"]
    },
    "vcs": {
        "enabled": true,
        "clientKind": "git",
        "useIgnoreFile": true
    },
    "assist": {
        "actions": {
            "source": {
                "organizeImports": "on"
            }
        }
    },
    "linter": {
        "enabled": true,
        "rules": {
            "recommended": true
        }
    },
    "formatter": {
        "enabled": true,
        "indentStyle": "space",
        "indentWidth": 4,
        "lineWidth": 100,
        "lineEnding": "lf"
    },
    "javascript": {
        "formatter": {
            "enabled": true,
            "quoteStyle": "single",
            "semicolons": "always"
        }
    },
    "json": {
        "formatter": {
            "enabled": true,
            "indentStyle": "space",
            "indentWidth": 4
        }
    }
}
```

**Main configurations:**

| Option | Value | Description |
|--------|-------|-------------|
| `indentWidth` | 4 | Indentation with 4 spaces |
| `lineWidth` | 100 | Character limit per line |
| `quoteStyle` | single | Single quotes |
| `semicolons` | always | Always use semicolons |

> **Important:** **Usage in apps and packages:**

Create a `biome.jsonc` file (not `biome.json`) in the project:

```jsonc
{
    "$schema": "https://biomejs.dev/schemas/2.3.14/schema.json",
    "extends": ["@monorepo/biome-config/biome.json"],
    "root": false
}
```

> **Important:** Use `biome.jsonc` (with 'c') in child projects so that editors like Zed correctly detect the local configuration instead of using only the monorepo root configuration.

At the project root, create a `biome.json` as well for the editor to work correctly.

```json
{
    "$schema": "https://biomejs.dev/schemas/2.3.14/schema.json",
    // Here you should use the relative path
    "extends": ["./packages/biome-config/biome.json"],
    "root": true
}
```

And modify your `package.json` by adding *biome* as a *devDependencies*:

```json
{
    "devDependencies": {
        "@biomejs/biome": "catalog:"
    }
}
```

And for the *Zed* editor, install the **Biome** extension and create a `.zed/settings.json` at the root:

```json
{
    "code_actions_on_format": {
        "source.organizeImports.biome": true,
        "source.fixAll.biome": true
    },
    "format_on_save": "on",
    "formatter": {
        "language_server": { "name": "biome" }
    }
}
```

---

### vitest-config

Vitest configuration for testing.

```bash
mkdir -p packages/vitest-config
cd packages/vitest-config
pnpm init
```

**`package.json`:**

```json
{
    "name": "@monorepo/vitest-config",
    "version": "1.0.0",
    "description": "Shared Vitest configuration for monorepo",
    "author": "@Markimg22",
    "license": "MIT",
    "type": "module",
    "exports": {
        "./node": "./node.ts",
        "./react": "./react.ts"
    },
    "files": ["*.ts"],
    "devDependencies": {
        "typescript": "catalog:",
        "vitest": "catalog:"
    }
}
```

**`node.ts`** - For Node.js projects:

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        include: ['src/**/*.{test,spec}.{js,ts}'],
        exclude: ['node_modules', 'dist'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: ['node_modules', 'dist', '**/*.{test,spec}.{js,ts}'],
        },
        testTimeout: 10000,
        hookTimeout: 10000,
    },
});
```

**`react.ts`** - For React/Next.js projects:

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
        exclude: ['node_modules', 'dist', '.next'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: ['node_modules', 'dist', '.next', '**/*.{test,spec}.{js,ts,jsx,tsx}'],
        },
        testTimeout: 10000,
        hookTimeout: 10000,
        setupFiles: ['./vitest.setup.ts'],
    },
});
```

**`react.setup.ts`** - Setup for React tests:

```typescript
import '@testing-library/jest-dom/vitest';
```

**Usage:**

```typescript
// vitest.config.ts
import config from '@monorepo/vitest-config/node';
export default config;
```

To customize:

```typescript
import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from '@monorepo/vitest-config/node';

export default mergeConfig(baseConfig, defineConfig({
    test: {
        // customizations
    },
}));
```

---

## Final Structure

```
.
├── .gitignore
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── packages/
    ├── typescript-config/
    │   ├── package.json
    │   ├── base.json
    │   ├── node.json
    │   └── library.json
    ├── biome-config/
    │   ├── package.json
    │   └── biome.json
    └── vitest-config/
        ├── package.json
        ├── node.ts
        └── react.ts
```

After creating the packages, run:

```bash
cd ../..
pnpm install
```

---

## Git Hooks

Commitlint and Lefthook configuration for commit standardization.

---

## Commitlint

Commitlint validates commit messages following the [Conventional Commits](https://www.conventionalcommits.org/) standard.

### Installation

First, install *biome* and *typescript* from your previously configured packages at the project root:

```bash
pnpm add -D -w "@monorepo/biome-config@workspace:*" "@monorepo/typescript-config@workspace:*"
```

At the project root:

```bash
pnpm add -Dw @commitlint/cli @commitlint/config-conventional @commitlint/types
```

### Configuration

Create `commitlint.config.ts` at the root:

```typescript
import type { UserConfig } from '@commitlint/types';

const config: UserConfig = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            [
                'feat',     // New feature
                'fix',      // Bug fix
                'docs',     // Documentation
                'style',    // Formatting (does not affect code)
                'refactor', // Refactoring
                'perf',     // Performance
                'test',     // Tests
                'build',    // Build system
                'ci',       // CI/CD
                'chore',    // General tasks
                'revert',   // Revert commit
            ],
        ],
        'type-case': [2, 'always', 'lower-case'],
        'type-empty': [2, 'never'],
        'subject-empty': [2, 'never'],
        'subject-case': [2, 'always', 'lower-case'],
        'subject-full-stop': [2, 'never', '.'],
        'header-max-length': [2, 'always', 100],
    },
};

export default config;
```

### Rules

| Rule | Description |
|------|-------------|
| `type-enum` | Allowed commit types |
| `type-case` | Type must be lowercase |
| `type-empty` | Type is required |
| `subject-empty` | Message is required |
| `subject-case` | Message must be lowercase |
| `subject-full-stop` | No period at the end of the message |
| `header-max-length` | Maximum 100 characters in the header |

---

## Lefthook

Lefthook is a fast and configurable git hooks manager.

### Installation

```bash
pnpm add -Dw lefthook
```

### Configuration

Create `lefthook.yml` at the root:

```yaml
# Lefthook configuration
# https://github.com/evilmartians/lefthook

commit-msg:
    commands:
        commitlint:
            run: pnpm commitlint --edit {1}

pre-push:
    parallel: true
    commands:
        build:
            run: pnpm build
        check:
            run: pnpm check
```

### Installing the Hooks

```bash
pnpm lefthook install
```

To install automatically, add the `prepare` script to `package.json`:

```json
{
    "scripts": {
        "prepare": "lefthook install"
    }
}
```

### Configured Hooks

| Hook | When It Runs | Action |
|------|--------------|--------|
| `commit-msg` | When creating a commit | Validates message with Commitlint |
| `pre-push` | Before push | Runs build and check in parallel |

### Temporarily Skip Hooks

```bash
# Skip pre-push
git push --no-verify

# Skip commit-msg
git commit --no-verify -m "message"
```

---

## Conventional Commits

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Components:**

| Part | Required | Description |
|------|----------|-------------|
| `type` | Yes | Commit type |
| `scope` | No | Context/affected module |
| `subject` | Yes | Short description |
| `body` | No | Detailed description |
| `footer` | No | Breaking changes, issues |

### Commit Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat: add user authentication` |
| `fix` | Bug fix | `fix: resolve memory leak` |
| `docs` | Documentation | `docs: update installation guide` |
| `style` | Formatting | `style: fix indentation` |
| `refactor` | Refactoring | `refactor: simplify validation logic` |
| `perf` | Performance | `perf: optimize database queries` |
| `test` | Tests | `test: add unit tests for auth` |
| `build` | Build system | `build: update webpack config` |
| `ci` | CI/CD | `ci: add github actions workflow` |
| `chore` | General tasks | `chore: update dependencies` |
| `revert` | Revert commit | `revert: remove broken feature` |

### Examples

**Simple:**

```
feat: add password reset functionality
```

**With scope:**

```
fix(api): resolve connection timeout issue
```

**With body:**

```
refactor(auth): simplify token validation

Removed redundant checks and consolidated validation logic
into a single function for better maintainability.
```

**Breaking change:**

```
feat(api)!: change response format

BREAKING CHANGE: API responses now use camelCase instead of snake_case.
```

**Referencing issue:**

```
fix: resolve login redirect loop

Closes #123
```

---

## Workflow

Guide for commands, TurboRepo, and generators for development.

---

## TurboRepo

TurboRepo is a high-performance build system for monorepos. It optimizes task execution with intelligent caching and parallelization.

### Installation

```bash
pnpm add -D turbo -w
```

### Configuration

Create `turbo.json` at the root:

```json
{
    "$schema": "https://turbo.build/schema.json",
    "tasks": {
        "build": {
            "dependsOn": ["^build"],
            "outputs": [".next/**", "!.next/cache/**", "dist/**"]
        },
        "dev": {
            "cache": false,
            "persistent": true
        },
        "check": {
            "dependsOn": ["^build"]
        },
        "lint": {},
        "format": {},
        "test": {
            "dependsOn": ["^build"]
        },
        "test:coverage": {
            "dependsOn": ["^build"]
        }
    }
}
```

**Task explanation:**

| Task | Description |
|------|-------------|
| `build` | Compiles projects. `^build` compiles dependencies first |
| `dev` | Development server. No cache, persistent |
| `check` | Biome check (lint + format) |
| `lint` | Linting only |
| `format` | Formatting only |
| `test` | Run tests |
| `test:coverage` | Tests with coverage |

---

## Commands

### Global Commands

Create new scripts in `package.json`:

```json
{
    "scripts": {
        "build": "turbo run build",
        "dev": "turbo run dev",
        "check": "turbo run check",
        "lint": "turbo run lint",
        "format": "turbo run format",
        "test": "turbo run test",
        "test:coverage": "turbo run test:coverage",
        "prepare": "lefthook install"
    }
}
```

Run from the project root:

```bash
pnpm dev           # Start dev server for all projects
pnpm build         # Production build
pnpm check         # Lint + Format (Biome)
pnpm lint          # Lint only
pnpm format        # Format only
pnpm test          # Run tests
pnpm test:coverage # Tests with coverage
```

### Filter by Project

```bash
# Build a specific project
pnpm build --filter=@monorepo/web

# Dev a specific project
pnpm dev --filter=@monorepo/web

# Tests for a specific project
pnpm test --filter=@monorepo/utils
```

### Cache

Turborepo uses cache to avoid re-running tasks that haven't changed. To clear the cache:

```bash
pnpm turbo run build --force  # Ignore cache
rm -rf .turbo                  # Remove local cache
```

---

## Generators

Turborepo has Plop-based generators to automatically create new packages and apps.

### Installation

```bash
pnpm add -D @turbo/gen -w
```

### Structure

```
turbo/
└── generators/
    ├── config.ts          # Generator configuration
    └── templates/         # Handlebars templates
        ├── package/       # Templates for packages
        └── app/           # Templates for apps
```

### Generator: Package

Creates a new shared package in `packages/`:

```bash
pnpm turbo gen package
```

**Prompts:**

| Field | Description |
|-------|-------------|
| `name` | Package name (without `@monorepo/` prefix) |
| `description` | Package description |
| `withTests` | Include test configuration (default: true) |

**Generated files:**

```
packages/<name>/
├── package.json
├── tsconfig.json
├── biome.jsonc
├── vitest.config.ts  # if withTests
└── src/
    ├── index.ts
    └── index.test.ts  # if withTests
```

### Generator: App

Creates a new Next.js app in `apps/`:

```bash
pnpm turbo gen web
```

**Prompts:**

| Field | Description |
|-------|-------------|
| `name` | App name (without `@monorepo/` prefix) |
| `description` | App description |
| `port` | Development port (default: 3000) |

**Generated files:**

```
apps/<name>/
├── package.json
├── tsconfig.json
├── biome.jsonc
├── next.config.ts
├── postcss.config.mjs
├── vitest.config.ts
├── vitest.setup.ts
└── src/
    └── app/
        ├── layout.tsx
        ├── page.tsx
        └── globals.css
```

### Usage with Arguments

To avoid interactive prompts:

```bash
# Package
pnpm turbo gen package --args "utils" "Utility functions" "true"

# App
pnpm turbo gen app --args "admin" "Admin dashboard" "3001"
```

### After Creating a Project

```bash
pnpm install   # Install dependencies
pnpm build     # Verify build
pnpm check     # Verify lint/format
```

---

## Creating Projects Manually

### New Package

1. Create the folder in `packages/`:

```bash
mkdir -p packages/my-package
cd packages/my-package
pnpm init
```

2. Configure `package.json`:

```json
{
    "name": "@monorepo/my-package",
    "version": "1.0.0",
    "description": "Package description",
    "author": "@Markimg22",
    "license": "MIT",
    "type": "module",
    "exports": {
        ".": "./src/index.ts"
    },
    "files": ["src", "dist"],
    "devDependencies": {
        "@monorepo/typescript-config": "workspace:*",
        "@monorepo/biome-config": "workspace:*",
        "@monorepo/vitest-config": "workspace:*",
        "typescript": "catalog:",
        "vitest": "catalog:"
    },
    "scripts": {
        "build": "tsc",
        "check": "biome check --write .",
        "lint": "biome lint .",
        "format": "biome format --write .",
        "test": "vitest",
        "test:coverage": "vitest --coverage"
    }
}
```

3. Configure `tsconfig.json`:

```json
{
    "extends": "@monorepo/typescript-config/library.json",
    "compilerOptions": {
        "outDir": "dist",
        "rootDir": "src"
    },
    "include": ["src"]
}
```

4. Configure `biome.jsonc`:

```jsonc
{
    "$schema": "https://biomejs.dev/schemas/2.3.14/schema.json",
    "extends": ["@monorepo/biome-config/biome.json"],
    "root": false
}
```

> Use `biome.jsonc` so that editors correctly detect the local configuration.

5. Configure `vitest.config.ts`:

```typescript
import config from '@monorepo/vitest-config/node';
export default config;
```

### New Next.js App

1. Create the folder in `apps/`:

```bash
mkdir -p apps/my-app
cd apps/my-app
pnpm init
```

2. Configure `package.json`:

```json
{
    "name": "@monorepo/my-app",
    "version": "1.0.0",
    "private": true,
    "description": "App description",
    "author": "@Markimg22",
    "license": "MIT",
    "type": "module",
    "scripts": {
        "dev": "next dev --port 3000",
        "build": "next build",
        "start": "next start",
        "check": "biome check --write .",
        "lint": "biome lint .",
        "format": "biome format --write .",
        "test": "vitest",
        "test:coverage": "vitest --coverage"
    },
    "dependencies": {
        "next": "^16.3.3",
        "react": "^19.1.0",
        "react-dom": "^19.1.0"
    },
    "devDependencies": {
        "@monorepo/typescript-config": "workspace:*",
        "@monorepo/biome-config": "workspace:*",
        "@monorepo/vitest-config": "workspace:*",
        "@testing-library/jest-dom": "^6.7.0",
        "@testing-library/react": "^16.3.0",
        "@types/node": "catalog:",
        "@types/react": "^19.1.8",
        "@types/react-dom": "^19.1.6",
        "jsdom": "^26.1.0",
        "tailwindcss": "^4.1.11",
        "typescript": "catalog:",
        "vitest": "catalog:"
    }
}
```

3. Configure `tsconfig.json`:

```json
{
    "extends": "@monorepo/typescript-config/base.json",
    "compilerOptions": {
        "lib": ["dom", "dom.iterable", "ES2024"],
        "jsx": "preserve",
        "module": "ESNext",
        "moduleResolution": "Bundler",
        "noEmit": true,
        "plugins": [{ "name": "next" }],
        "baseUrl": ".",
        "paths": {
            "@/*": ["./src/*"]
        }
    },
    "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
    "exclude": ["node_modules"]
}
```

4. Configure `next.config.ts`:

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {};

export default nextConfig;
```

5. Configure `vitest.config.ts`:

```typescript
import config from '@monorepo/vitest-config/react';
export default config;
```

6. Create the folder structure:

```bash
mkdir -p src/app
```

7. Run `pnpm install` at the root.
