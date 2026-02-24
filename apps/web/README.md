# @monorepo/web

Next.js web application with **Tailwind CSS v4**, **shared UI components**, and **type-safe internationalization**.

## Getting Started

### Development

```bash
pnpm -F @monorepo/web dev
# Open http://localhost:3000
```

### Build

```bash
pnpm -F @monorepo/web build
pnpm -F @monorepo/web start
```

## Stack

- **Framework**: Next.js with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: `@monorepo/ui` (shadcn + custom)
- **Internationalization**: `@monorepo/i18n` (type-safe)
- **Package Manager**: pnpm

## Key Features

### Shared UI Components

Granular imports from `@monorepo/ui`:

```tsx
import { Button } from '@monorepo/ui/button';
import { Card, CardContent } from '@monorepo/ui/card';
import { Stepper } from '@monorepo/ui/stepper';
import { cn } from '@monorepo/ui/utils';

export function Page() {
    return (
        <Card>
            <CardContent>
                <Button className={cn('px-4', 'py-2')}>
                    Click me
                </Button>
            </CardContent>
        </Card>
    );
}
```

### Type-Safe Translations

Integrated `useTranslation()` hook:

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

**Features:**

- Auto-detects browser language on first visit
- Saves language preference to `localStorage`
- Full TypeScript type safety for translation keys
- Supports: `pt-BR` (default), `en`

### Tailwind CSS v4

Global styles with shared theme:

```css
/* src/styles/globals.css */
@import 'tailwindcss';
@import '@monorepo/ui/theme.css';
@import '@monorepo/ui/styles.css';
```

Automatic class sorting on save:

```tsx
// Before
<div className="text-white p-4 bg-blue-500 rounded">

// After (auto-formatted)
<div className="rounded bg-blue-500 p-4 text-white">
```

## Project Structure

```
apps/web/
├── src/
│   ├── app/                    # Next.js pages (App Router)
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/             # Local components
│   ├── hooks/
│   │   └── useTranslation.ts   # i18n integration
│   └── styles/
│       └── globals.css         # Tailwind + theme imports
├── public/                     # Static assets
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

## Commands

```bash
pnpm -F @monorepo/web dev          # Start dev server
pnpm -F @monorepo/web build        # Production build
pnpm -F @monorepo/web start        # Run production server
pnpm -F @monorepo/web lint         # Run ESLint
pnpm -F @monorepo/web typecheck    # Run TypeScript
pnpm -F @monorepo/web test         # Run tests (if configured)
```

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Variables prefixed with `NEXT_PUBLIC_` are available in browser code.

## Dependencies

### Direct Dependencies

- **next** — Framework
- **react** — UI library
- **@monorepo/ui** — Shared components
- **@monorepo/i18n** — Translations

### Dev Dependencies

- **typescript** — Type checking
- **@monorepo/typescript-config** — Shared TS config (nextjs)
- **@monorepo/eslint-config** — Shared ESLint config (react)
- **tailwindcss** — CSS framework
- **prettier** — Code formatter

## Adding a New Page

1. Create `src/app/<route>/page.tsx`:

```tsx
'use client';

import { useTranslation } from '@monorepo/web/hooks';
import { Button } from '@monorepo/ui/button';

export default function MyPage() {
    const { t } = useTranslation();

    return (
        <main>
            <h1>{t('common.greeting')}</h1>
            <Button>Get started</Button>
        </main>
    );
}
```

2. Page is automatically accessible at `/my-route`

## Adding a New Component

1. Create `src/components/my-component.tsx`:

```tsx
'use client';

import { Button } from '@monorepo/ui/button';

interface MyComponentProps {
    title: string;
}

export function MyComponent({ title }: MyComponentProps) {
    return (
        <div>
            <h2>{title}</h2>
            <Button>Action</Button>
        </div>
    );
}
```

2. Import and use in pages:

```tsx
import { MyComponent } from '@/components/my-component';

export default function Page() {
    return <MyComponent title="Hello" />;
}
```

## Performance Tips

- **Granular imports**: Always import specific components from `@monorepo/ui`

    ```tsx
    import { Button } from '@monorepo/ui/button';  // ✅ Small bundle
    import * from '@monorepo/ui';                  // ❌ Large bundle
    ```

- **Use `next/image`** for image optimization

- **Use `cn()`** from `@monorepo/ui/utils` for dynamic classes:

    ```tsx
    import { cn } from '@monorepo/ui/utils';
    <div className={cn('p-4', isActive && 'bg-blue-500')} />
    ```

- **Code splitting**: Next.js automatically splits routes into separate bundles

## Testing

If Vitest is configured:

```bash
pnpm -F @monorepo/web test
pnpm -F @monorepo/web test:coverage
```

## Building for Production

```bash
pnpm build       # Build all packages
pnpm start       # Run production server
```

## Monorepo Commands

Run from monorepo root:

```bash
pnpm dev          # Starts all dev servers
pnpm build        # Builds all packages and apps
pnpm lint         # Lints all packages
pnpm typecheck    # Type-checks all packages
pnpm test         # Tests all packages
```

## Deployment

The app can be deployed to:

- **Vercel** (recommended for Next.js)
- **Docker**
- **Node.js servers**

## For Developers

For detailed development guidance, see [CLAUDE.md](./CLAUDE.md).

## Related Packages

- **`@monorepo/ui`** — UI components and utilities
- **`@monorepo/i18n`** — Type-safe translations
- **`@monorepo/typescript-config`** — TypeScript settings
- **`@monorepo/eslint-config`** — Linting rules
