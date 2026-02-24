# @monorepo/vitest-config

Shared **Vitest configurations** for unit and integration testing across the monorepo.

## Installation

```bash
pnpm add -D @monorepo/vitest-config
```

## Available Configs

| Config  | Environment | Use Case              | Includes                                         |
| ------- | ----------- | --------------------- | ------------------------------------------------ |
| `base`  | Node.js     | Server-side tests     | Globals, V8 coverage                             |
| `react` | jsdom       | React component tests | React plugin, Testing Library, Jest DOM matchers |

## Quick Start

### Node.js Package

`packages/i18n/vitest.config.js`:

```js
import { base } from '@monorepo/vitest-config/base';

export default base;
```

`package.json`:

```json
{
    "scripts": {
        "test": "vitest",
        "test:coverage": "vitest --coverage"
    },
    "devDependencies": {
        "@vitest/coverage-v8": "workspace:*"
    }
}
```

### React Package

`packages/ui/vitest.config.js`:

```js
import { react } from '@monorepo/vitest-config/react';

export default react;
```

## Configuration Details

### `base.ts`

Node.js testing environment:

- **Environment**: `node`
- **Globals**: Enabled (`describe`, `it`, `expect` without imports)
- **Coverage**: V8 provider with text, JSON, HTML reporters

**Used by:**

- `packages/eslint-config`
- `packages/vitest-config`
- `packages/typescript-config`

### `react.ts`

React component testing environment:

- **Environment**: `jsdom` (browser-like DOM)
- **React Plugin**: JSX support via Vite React plugin
- **Globals**: Enabled
- **Testing Library**: Includes `@testing-library/jest-dom` setup
- **Coverage**: V8 provider

## Running Tests

```bash
pnpm test                           # All packages
pnpm test:coverage                  # With coverage
pnpm exec nx run @monorepo/ui:test  # Specific package
pnpm exec nx run @monorepo/ui:test -- --watch  # Watch mode
```

## Coverage Reports

Generate coverage:

```bash
pnpm test:coverage
```

Output:

- `coverage/index.html` — Browsable HTML report
- `coverage/coverage-final.json` — Machine-readable data

### Thresholds

Set minimum coverage in `vitest.config.js`:

```js
export default {
    test: {
        coverage: {
            lines: 80,
            functions: 80,
            branches: 75,
            statements: 80
        }
    }
};
```

## Testing Library Utilities

React config includes Testing Library matchers:

```ts
expect(element).toBeInTheDocument();
expect(element).toBeVisible();
expect(element).toHaveAttribute('role', 'button');
expect(element).toHaveTextContent('Click me');
expect(button).toBeDisabled();
```

## Mocking & Spies

Vitest provides mocking utilities:

```ts
import { vi, describe, it, expect } from 'vitest';

describe('module', () => {
    it('mocks functions', () => {
        const mock = vi.fn();
        mock('test');

        expect(mock).toHaveBeenCalledWith('test');
        expect(mock).toHaveBeenCalledOnce();
    });
});
```

## Debugging

Run tests in watch mode:

```bash
pnpm exec nx run @monorepo/ui:test -- --watch
```

Run single file:

```bash
pnpm exec nx run @monorepo/ui:test -- src/components/button.spec.tsx
```

Run with browser UI:

```bash
pnpm exec nx run @monorepo/ui:test -- --ui
```

## CI/CD

For continuous integration (GitHub Actions, etc.):

```bash
pnpm test --run          # No watch, exit after tests
pnpm test:coverage --run # With coverage
```

## Customization

Override config in your package:

```js
import { react } from '@monorepo/vitest-config/react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    ...react,
    test: {
        ...react.test,
        exclude: ['src/**/*.skip.spec.tsx'],
        globals: false // Require explicit imports
    }
});
```

## Dependencies

**Always add to package's devDependencies:**

```json
"devDependencies": {
    "@vitest/coverage-v8": "workspace:*"
}
```

**React packages also need:**

```json
"devDependencies": {
    "@vitejs/plugin-react": "workspace:*",
    "@testing-library/react": "workspace:*",
    "@testing-library/user-event": "workspace:*"
}
```

## For Developers

For development guidance, see [CLAUDE.md](./CLAUDE.md).

```bash
pnpm -F @monorepo/vitest-config lint
pnpm -F @monorepo/vitest-config typecheck
```
