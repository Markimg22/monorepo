# @monorepo/ui — CLAUDE.md

Guidance for working with the shared React UI component library.

## Overview

Shared React UI component library built with **React**, **TypeScript**, **Tailwind CSS v4**, and **Vite**. Integrates **shadcn/ui** components and custom feature components in a single distributable package.

## Structure

```
packages/ui/
├── src/
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components (installed via CLI)
│   │   │   ├── button/
│   │   │   │   ├── index.ts      # Barrel export
│   │   │   │   ├── button.tsx    # shadcn component
│   │   │   │   ├── button.styles.ts
│   │   │   │   └── button.stories.tsx
│   │   │   └── ...other shadcn components
│   │   ├── stepper/              # Custom feature components
│   │   │   ├── index.ts
│   │   │   ├── stepper.tsx
│   │   │   ├── stepper.styles.ts
│   │   │   ├── stepper.spec.tsx
│   │   │   └── stepper.stories.tsx
│   │   └── index.ts              # Barrel export for all components
│   ├── lib/
│   │   └── utils.ts              # Utilities (cn, cva, etc.)
│   ├── styles/
│   │   ├── globals.css           # Global styles
│   │   └── theme.css             # Tailwind theme with CSS variables
│   └── index.ts                  # Root entry (exports CSS only)
├── .storybook/                   # Storybook for visual development
├── components.json               # shadcn CLI config
├── vite.config.ts
└── tsconfig.json
```

## Components

### shadcn/ui Components (`components/ui/`)

Base UI components installed from shadcn/ui using the CLI:

```bash
pnpm dlx shadcn-ui add button
pnpm dlx shadcn-ui add card
# etc.
```

Components are installed to `src/components/ui/<name>/` and use **Radix UI** primitives with **Tailwind CSS** styling.

**Don't manually create or edit these** — use shadcn CLI to install and the upstream repo for patches.

### Custom Components

Feature components and custom designs live in `src/components/<name>/` (outside `ui/`):

```
src/components/
├── stepper/          # Custom component
├── wizard/           # Custom component
└── ui/               # shadcn only
```

## Build & Granular Imports

All components are auto-discovered and exported with granular imports:

```ts
import { Button } from '@monorepo/ui/button';      // shadcn component
import { Stepper } from '@monorepo/ui/stepper';    // custom component
import { cn } from '@monorepo/ui/utils';
```

**How it works:**

- `vite.config.ts` uses `globSync` to discover all `.ts/.tsx` files in `src/`
- Entry names are **flattened**: `components/ui/button/index.ts` → `components/button/index.js` in dist
- File exclusions: `*.d.ts`, `*.spec.tsx`, `*.stories.tsx`, `*.test-helper.{ts,tsx}`, `src/tests/**`, `src/styles/**`
- `preserveModules` + `preserveModulesRoot: 'src'` preserves folder structure for remaining entries
- Result: `dist/components/button/`, `dist/components/stepper/`, `dist/lib/utils.js`
- Root `package.json` exports wildcard: `"./*": { "import": "./dist/components/*/index.js" }`

### Adding New Custom Components

1. Create `src/components/<name>/` folder
2. Add implementation files
3. Create `index.ts` barrel:

```ts
// src/components/wizard/index.ts
export * from './wizard';

// src/components/wizard/wizard.tsx
export function Wizard({ ... }) { ... }
```

**No configuration changes needed** — entry points are auto-discovered and flattened during build.

## CSS & Tailwind

### Shared Theme

The package exports two CSS entry points (consumed by apps):

- `@monorepo/ui/theme.css` — source CSS with `:root` variables, `@theme inline`, and custom variants. Must be re-processed by each consumer's Tailwind (cannot be pre-compiled).
- `@monorepo/ui/styles.css` — pre-compiled component utility classes from all components.

**Export conditions in `package.json`:**

```json
{
    "./theme.css": {
        "style": "./src/styles/theme.css",
        "default": "./src/styles/theme.css"
    },
    "./styles.css": {
        "style": "./dist/index.css",
        "default": "./dist/index.css"
    }
}
```

The `"style"` condition ensures Turbopack (Next.js with enhanced-resolve) resolves CSS imports correctly.

### Prettier & Tailwind Class Sorting

Root `prettier.config.mjs` sorts Tailwind classes inside `cva`, `cn`, `clsx`, and `twMerge`.

Local `prettier.config.mjs` (in this package) extends root config and points to `./src/styles/globals.css`:

```js
import rootConfig from '../../prettier.config.mjs';

export default {
    ...rootConfig,
    tailwindStylesheet: './src/styles/globals.css'
};
```

## Development

```bash
pnpm -F @monorepo/ui dev        # Start Storybook on port 6006
pnpm -F @monorepo/ui build      # Build for distribution
pnpm -F @monorepo/ui lint       # Run ESLint
pnpm -F @monorepo/ui typecheck  # Run TypeScript
pnpm -F @monorepo/ui test       # Run Vitest
```

## Component Conventions

### File Structure

Each component is a folder with:

- `index.ts` — barrel export
- `<component>.tsx` — component implementation
- `<component>.styles.ts` — optional styling constants
- `<component>.stories.tsx` — Storybook stories (auto-excluded from build)
- `<component>.spec.tsx` — unit tests (auto-excluded from build)

```ts
// src/components/stepper/index.ts
export * from './stepper';

// src/components/stepper/stepper.tsx
export function Stepper({ ... }) { ... }
```

### TypeScript & React

- Use `react-library.json` tsconfig (in `tsconfig.json`)
- All components should export named exports
- Use TypeScript for prop types
- Leverage shadcn utils like `cn()` for class merging

### 'use client' Directive

Components automatically get `'use client'` injected during build via the `preserveUseClient()` plugin in `vite.config.ts`.

## Testing

Using **Vitest** with **React Testing Library**.

```bash
pnpm -F @monorepo/ui test              # Run tests
pnpm -F @monorepo/ui test:coverage     # Coverage report
```

Test files use `.spec.tsx` extension and live alongside components.

## Storybook

Visual component development and documentation:

```bash
pnpm -F @monorepo/ui dev              # Start Storybook on port 6006
```

Story files use `.stories.tsx` extension and are auto-excluded from the build.

## shadcn/ui Integration

`components.json` configures the shadcn CLI:

```json
{
    "style": "default",
    "tsx": true,
    "alias": {
        "@": "./src",
        "@/components/ui": "./src/components/ui"
    }
}
```

Install components with:

```bash
pnpm dlx shadcn-ui add <component-name>
```

Components are installed to `src/components/ui/<component-name>/`.

## Publishing & Distribution

Build output in `dist/`:

```
dist/
├── components/
│   ├── button/                 # flattened from ui/button
│   │   ├── index.js
│   │   ├── index.d.ts
│   │   ├── button.js
│   │   ├── button.d.ts
│   │   ├── button.styles.js
│   │   └── button.styles.d.ts
│   ├── stepper/                # custom component
│   │   ├── index.js
│   │   ├── index.d.ts
│   │   ├── stepper.js
│   │   ├── stepper.d.ts
│   │   ├── stepper.styles.js
│   │   └── stepper.styles.d.ts
│   └── index.js
├── lib/
│   ├── utils.js
│   └── utils.d.ts
├── index.js
└── index.css                   # all compiled component styles
```

**Formats:** ES modules only (`format: 'es'`), no CommonJS.

**sideEffects:** Marked in `package.json` for CSS imports:

```json
{ "sideEffects": ["**/*.css"] }
```

## TypeScript Config

Extends `@monorepo/typescript-config/react-library`:

```json
{ "extends": "@monorepo/typescript-config/react-library" }
```

## ESLint Config

Extends `@monorepo/eslint-config/react` with TypeScript project support:

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

Include `.storybook/**/*.ts` files in `tsconfig.json` (TypeScript doesn't traverse dot-prefixed directories by default).

## Vitest Config

Uses `react` config from `@monorepo/vitest-config`:

```js
import { react } from '@monorepo/vitest-config/react';

export default react;
```

Includes jsdom environment, globals, and Testing Library setup.
