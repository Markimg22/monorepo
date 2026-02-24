# @monorepo/ui

Shared React UI component library with **shadcn/ui** components and custom feature components.

## Installation

```bash
pnpm add @monorepo/ui
```

## Usage

### Granular Imports

Import components directly by name:

```ts
import { Button } from '@monorepo/ui/button';
import { Card, CardContent } from '@monorepo/ui/card';
import { Stepper } from '@monorepo/ui/stepper';
import { cn } from '@monorepo/ui/utils';
```

### Styles

Import the shared theme and component styles:

```css
@import 'tailwindcss';
@import '@monorepo/ui/theme.css';
@import '@monorepo/ui/styles.css';
```

## Components

### shadcn/ui Components

Base UI components from shadcn/ui (installed in `src/components/ui/`):

- `button` — Interactive button component
- `card` — Container component
- `input` — Text input field
- ...and more from shadcn/ui catalog

### Custom Components

Feature-specific components built for this monorepo:

- `stepper` — Multi-step form component

## Utilities

### `cn()`

Merge and deduplicate Tailwind classes:

```ts
import { cn } from '@monorepo/ui/utils';

cn('px-4 py-2', condition && 'text-red-500'); // → 'px-4 py-2 text-red-500'
```

## Development

### Storybook

View and test components visually:

```bash
pnpm -F @monorepo/ui dev
# Open http://localhost:6006
```

### Adding New Components

#### shadcn/ui Components

Install from shadcn with the CLI:

```bash
pnpm dlx shadcn-ui add dialog
```

Components are installed to `src/components/ui/`.

#### Custom Components

1. Create `src/components/<name>/index.ts`:

```ts
export * from './<name>';
```

2. Create `src/components/<name>/<name>.tsx`:

```tsx
export function MyComponent() {
    return <div>...</div>;
}
```

3. Build and import:

```ts
import { MyComponent } from '@monorepo/ui/my-component';
```

### Testing

```bash
pnpm -F @monorepo/ui test              # Run tests
pnpm -F @monorepo/ui test:coverage     # Coverage
```

### Linting & TypeScript

```bash
pnpm -F @monorepo/ui lint
pnpm -F @monorepo/ui typecheck
```

## Build

```bash
pnpm -F @monorepo/ui build
```

Generates ES module bundles in `dist/` with:

- Granular component entry points
- Type definitions (`.d.ts`)
- Compiled CSS

## Theme Customization

The shared theme uses Tailwind CSS v4 variables. Customize in `src/styles/theme.css`:

```css
:root {
    --color-primary: #3b82f6;
    --color-secondary: #1f2937;
}

@theme inline {
    --color-primary: #3b82f6;
    --color-secondary: #1f2937;
}
```

## TypeScript

All components are fully typed with TypeScript. Props are exported as types:

```ts
import type { ButtonProps } from '@monorepo/ui/button';
```

## Publishing

This package is published to npm as `@monorepo/ui` and consumed by apps in this monorepo.

For more details on development and configuration, see [CLAUDE.md](./CLAUDE.md).
