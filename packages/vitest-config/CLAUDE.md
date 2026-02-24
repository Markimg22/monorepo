# @monorepo/vitest-config — CLAUDE.md

Guidance for working with the shared Vitest configurations.

## Overview

Provides **reusable Vitest configurations** for unit and integration testing across the monorepo. Tailored for different environments (Node.js vs. browser/React).

## Structure

```
packages/vitest-config/
├── src/
│   ├── base.ts              # Node.js test config
│   ├── react.ts             # React component test config
│   └── index.ts             # Exports all configs
├── vitest.config.js
└── package.json
```

## Configurations

### `base.ts`

For **Node.js packages** (server-side unit tests):

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'node',
        globals: true,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html']
        }
    }
});
```

**Features:**

- Node environment (no jsdom)
- Globals enabled (`describe`, `it`, `expect` without imports)
- V8 coverage provider

**Used by:**

- `packages/i18n`
- `packages/eslint-config`
- `packages/vitest-config`
- `packages/typescript-config`

### `react.ts`

For **React component packages**:

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['@testing-library/jest-dom/vitest'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html']
        }
    }
});
```

**Features:**

- jsdom environment (browser-like DOM)
- React plugin for JSX support
- Testing Library setup included
- Globals enabled
- V8 coverage provider

**Used by:**

- `packages/ui`

## Usage

### Node Package

`packages/i18n/vitest.config.js`:

```js
import { base } from '@monorepo/vitest-config/base';

export default base;
```

Then add test script to `package.json`:

```json
{
    "scripts": {
        "test": "vitest",
        "test:coverage": "vitest --coverage"
    }
}
```

### React Package

`packages/ui/vitest.config.js`:

```js
import { react } from '@monorepo/vitest-config/react';

export default react;
```

## Running Tests

```bash
pnpm test                           # All packages
pnpm test:coverage                  # All with coverage
pnpm exec nx run @monorepo/ui:test  # Specific package
```

## Writing Tests

### Node.js Tests

`src/index.spec.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { t, setLanguage } from './index';

describe('i18n', () => {
    beforeEach(() => {
        setLanguage('pt-BR');
    });

    it('returns translation for valid key', () => {
        const result = t('common.greeting');
        expect(result).toBe('Olá, bem-vindo!');
    });
});
```

### React Component Tests

`src/components/button/button.spec.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Button } from './button';

describe('Button', () => {
    it('renders with text', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('handles click events', async () => {
        const user = userEvent.setup();
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Click</Button>);

        await user.click(screen.getByText('Click'));
        expect(handleClick).toHaveBeenCalled();
    });
});
```

## Coverage

Generate coverage reports:

```bash
pnpm test:coverage
```

Coverage files written to `coverage/`:

- `coverage/index.html` — HTML report
- `coverage/coverage-final.json` — Raw data

### Coverage Configuration

Both configs use **V8** provider with reporters:

- `text` — Console output
- `json` — Machine-readable
- `html` — Browsable report

Customize in package's `vitest.config.js`:

```js
import { react } from '@monorepo/vitest-config/react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    ...react,
    test: {
        ...react.test,
        coverage: {
            ...react.test?.coverage,
            include: ['src/**/*.ts', 'src/**/*.tsx'],
            exclude: ['src/**/*.spec.ts', 'src/**/*.stories.tsx'],
            lines: 80,
            functions: 80,
            branches: 80,
            statements: 80
        }
    }
});
```

## Testing Library Integration

React config includes **@testing-library/jest-dom**:

```ts
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'vitest';

expect(element).toBeInTheDocument(); // Jest DOM matchers
expect(element).toBeVisible();
expect(element).toHaveAttribute('role', 'button');
```

## Environment Variables

Tests can access environment variables:

```ts
import { describe, it, expect } from 'vitest';

describe('config', () => {
    it('reads env var', () => {
        expect(process.env.NODE_ENV).toBe('test');
    });
});
```

Set during test runs via `.env.test` or `vitest` CLI options.

## Debugging Tests

Run tests in watch mode:

```bash
pnpm exec nx run @monorepo/ui:test -- --watch
```

Run single file:

```bash
pnpm exec nx run @monorepo/ui:test -- src/components/button/button.spec.tsx
```

Run with UI:

```bash
pnpm exec nx run @monorepo/ui:test -- --ui
```

## CI/CD

In GitHub Actions or other CI, run:

```bash
pnpm test --run                 # No watch mode
pnpm test:coverage --run        # With coverage report
```

## Dependencies

Both configs depend on:

- `vitest` — Test framework
- `@vitest/coverage-v8` — Coverage provider (add to package's devDependencies)

React config also needs:

- `@vitejs/plugin-react` — JSX support
- `@testing-library/react` — React component testing
- `@testing-library/jest-dom` — DOM matchers
- `jsdom` — Browser environment

## Development

```bash
pnpm -F @monorepo/vitest-config lint
pnpm -F @monorepo/vitest-config typecheck
```

This package exports only configuration functions — no tests to run.

## Customization

Each package can extend and override settings:

```js
import { react } from '@monorepo/vitest-config/react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    ...react,
    test: {
        ...react.test,
        exclude: ['src/**/*.skip.spec.tsx'],
        globals: false // Require imports
    }
});
```

## Related

- **ESLint**: `@monorepo/eslint-config`
- **TypeScript**: `@monorepo/typescript-config`
