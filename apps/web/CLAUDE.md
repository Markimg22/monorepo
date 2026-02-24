# @monorepo/web — CLAUDE.md

Guidance for working with the Next.js web application.

## Overview

**Next.js web application** serving as the main frontend for the monorepo. Uses **TypeScript**, **Tailwind CSS v4**, **React**, and shared packages (`@monorepo/ui`, `@monorepo/i18n`).

## Structure

```
apps/web/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   └── ...other routes
│   ├── components/             # Local UI components (not in @monorepo/ui)
│   ├── hooks/                  # Local React hooks
│   │   └── useTranslation.ts   # i18n integration hook
│   ├── styles/
│   │   └── globals.css         # Global styles (imports Tailwind)
│   └── middleware.ts           # Next.js middleware (optional)
├── public/                     # Static assets
├── next.config.js
├── tsconfig.json
├── tailwind.config.js
└── prettier.config.mjs
```

## Shared Dependencies

### `@monorepo/ui`

Reusable UI components:

```tsx
import { Button } from '@monorepo/ui/button';
import { Card } from '@monorepo/ui/card';
import { cn } from '@monorepo/ui/utils';

export function HomePage() {
    return (
        <Card>
            <Button variant="primary">
                Click me
            </Button>
        </Card>
    );
}
```

### `@monorepo/i18n`

Type-safe translations with browser detection and persistence:

```tsx
import { useTranslation } from '@monorepo/web/hooks';

export function Header() {
    const { t, language, setLanguage, supportedLanguages } = useTranslation();

    return (
        <header>
            <h1>{t('common.greeting')}</h1>
            <select value={language} onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}>
                {supportedLanguages.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                ))}
            </select>
        </header>
    );
}
```

## Styling with Tailwind CSS v4

### Global Styles

`src/styles/globals.css` imports the shared theme and component styles:

```css
@import 'tailwindcss';
@import '@monorepo/ui/theme.css';
@import '@monorepo/ui/styles.css';
```

### Class Sorting

Prettier automatically sorts Tailwind classes:

```tsx
// Input
<div className="text-white p-4 bg-blue-500 rounded">

// After formatting
<div className="rounded bg-blue-500 p-4 text-white">
```

This is configured in the local `prettier.config.mjs`.

## Internationalization

`useTranslation` hook in `src/hooks/useTranslation.ts`:

- **Auto-detection**: Detects browser language on first load
- **Persistence**: Saves language selection to `localStorage` (`app:language` key)
- **Type-safe**: Full TypeScript support for translation keys
- **Synced**: Integrates with core `@monorepo/i18n` package

Usage:

```tsx
import { useTranslation } from '@monorepo/web/hooks';

export function MyComponent() {
    const { t, language, setLanguage } = useTranslation();

    // t() has type safety — only valid translation keys allowed
    const greeting = t('common.greeting');

    return <p>{greeting}</p>;
}
```

## Development

```bash
pnpm -F @monorepo/web dev        # Start dev server (port 3000)
pnpm -F @monorepo/web build      # Build for production
pnpm -F @monorepo/web lint       # Run ESLint
pnpm -F @monorepo/web typecheck  # Run TypeScript
pnpm -F @monorepo/web test       # Run Vitest (if configured)
```

### Dev Server

```bash
pnpm -F @monorepo/web dev
# Open http://localhost:3000
```

### Build & Start

```bash
pnpm -F @monorepo/web build
pnpm -F @monorepo/web start
```

## File Structure Guidelines

### Pages (`src/app/`)

Use Next.js App Router:

```tsx
// src/app/page.tsx
'use client';

import { useTranslation } from '@monorepo/web/hooks';
import { Button } from '@monorepo/ui/button';

export default function HomePage() {
    const { t } = useTranslation();

    return (
        <main>
            <h1>{t('common.greeting')}</h1>
            <Button>Get started</Button>
        </main>
    );
}
```

### Components (`src/components/`)

Local components specific to the web app:

```tsx
// src/components/header.tsx
'use client';

import { useTranslation } from '@monorepo/web/hooks';

export function Header() {
    const { t, language, setLanguage, supportedLanguages } = useTranslation();

    return (
        <header>
            <h1>{t('common.greeting')}</h1>
            {/* Language switcher */}
        </header>
    );
}
```

### Hooks (`src/hooks/`)

Local React hooks for this app:

```tsx
// src/hooks/useMyFeature.ts
import { useState, useCallback } from 'react';

export function useMyFeature() {
    const [state, setState] = useState();
    // ...
}
```

## TypeScript Config

Extends `@monorepo/typescript-config/nextjs`:

```json
{
    "extends": "@monorepo/typescript-config/nextjs",
    "compilerOptions": {
        "baseUrl": ".",
        "paths": {
            "@/*": ["./src/*"]
        }
    }
}
```

## ESLint Config

Extends `@monorepo/eslint-config/react` with Next.js rules:

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

## Environment Variables

Create `.env.local` for local development:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Next.js variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

## Building & Deployment

### Production Build

```bash
pnpm -F @monorepo/web build
```

Creates optimized `.next` directory.

### Docker

For containerized deployment, create a `Dockerfile` that:

1. Installs monorepo dependencies
2. Builds all packages
3. Builds the Next.js app
4. Starts the Next.js server

## Performance

- **Image optimization**: Use `next/image` for automatic optimization
- **Code splitting**: Next.js automatically code-splits at route level
- **CSS-in-JS**: Use Tailwind CSS classes (included in build)
- **Font optimization**: Configure fonts in `next.config.js`

## Testing

If Vitest is configured, run tests:

```bash
pnpm -F @monorepo/web test
```

## Linting & Type Checking

```bash
pnpm -F @monorepo/web lint
pnpm -F @monorepo/web typecheck
```

## Monorepo Integration

### Running from Root

All tasks can be orchestrated from the monorepo root:

```bash
pnpm dev         # Starts all dev servers (web, Storybook, etc.)
pnpm build       # Builds all packages and apps
pnpm lint        # Lints all packages
pnpm typecheck   # Type-checks all packages
pnpm test        # Tests all packages
```

### Smart Task Running

NX is configured to run `nx affected` tasks on staged files:

```bash
git add src/components/header.tsx
pnpm lint  # Only lints affected packages
```

## Related Packages

- **`@monorepo/ui`** — Shared UI components (Button, Card, etc.)
- **`@monorepo/i18n`** — Translations with type safety
- **`@monorepo/typescript-config`** — TypeScript configuration (nextjs.json)
- **`@monorepo/eslint-config`** — ESLint configuration (react)
- **`@monorepo/vitest-config`** — Test configuration (if testing)

## Development Tips

- **Hot reload**: Changes to files automatically refresh
- **Component imports**: Use granular imports from `@monorepo/ui`:
    ```tsx
    import { Button } from '@monorepo/ui/button';  // ✅
    import { Button } from '@monorepo/ui';         // ❌ Larger bundle
    ```
- **Type safety**: Use `TranslationKey` type from `@monorepo/i18n` for i18n
- **CSS classes**: Use `cn()` from `@monorepo/ui/utils` for conditional classes:
    ```tsx
    import { cn } from '@monorepo/ui/utils';
    <div className={cn('p-4', condition && 'bg-red-500')} />
    ```
