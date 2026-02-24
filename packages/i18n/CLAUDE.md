# @monorepo/i18n — CLAUDE.md

Guidance for working with the internationalization (i18n) package.

## Overview

Centralized **internationalization (i18n)** package providing type-safe translations for all apps in the monorepo. Supports multiple languages with automatic browser detection and persistent storage.

## Structure

```
packages/i18n/
├── src/
│   ├── locales/                # Translation JSON files
│   │   ├── en.json
│   │   └── pt-BR.json
│   ├── index.ts                # Main API
│   ├── types.ts                # Type definitions (auto-inferred from JSON)
│   └── index.spec.ts           # Unit tests
├── vite.config.ts
└── tsconfig.json
```

## Supported Languages

- `pt-BR` — Portuguese (Brazil) — Default
- `en` — English

## Type-Safe Translations

The `TranslationKey` type is **automatically inferred** from the JSON files — no manual updates needed.

```ts
import { t, type TranslationKey } from '@monorepo/i18n';

// ✅ Type-safe — only valid keys allowed
const greeting: string = t('common.greeting');
const message: string = t('common.from-i18n');

// ❌ Type error — key doesn't exist
const invalid: string = t('invalid.key');
```

### How It Works

1. **JSON files** define translations in nested structure:

    ```json
    {
        "common": {
            "greeting": "Hello, welcome!",
            "from-i18n": "From i18n package"
        }
    }
    ```

2. **`Translations` type** is auto-inferred using `typeof`:

    ```ts
    import type enJson from './locales/en.json';
    export type Translations = typeof enJson;
    ```

3. **`TranslationKey` type** generates a union of all valid dot-separated paths:

    ```ts
    export type TranslationKey = 'common.greeting' | 'common.from-i18n';
    ```

4. **Function overloads** support both strict typing (production) and loose typing (tests):
    ```ts
    export function t(key: TranslationKey, language?: SupportedLanguage): string;
    export function t(key: string, language?: SupportedLanguage): string;
    ```

## API

### `t(key, language?)`

Get a translation by key path.

```ts
import { t } from '@monorepo/i18n';

// Get translation in current language (default: pt-BR)
t('common.greeting');

// Get translation in specific language
t('common.greeting', 'en');
```

**Overloads:**

- `t(key: TranslationKey, language?: SupportedLanguage): string` — Type-safe
- `t(key: string, language?: SupportedLanguage): string` — Runtime fallback (for tests)

### `setLanguage(language)`

Change the current language.

```ts
import { setLanguage } from '@monorepo/i18n';

setLanguage('en');
t('common.greeting'); // "Hello, welcome!"
```

### `getLanguage()`

Get the current language.

```ts
import { getLanguage } from '@monorepo/i18n';

console.log(getLanguage()); // "pt-BR" or "en"
```

### `getSupportedLanguages()`

Get list of supported languages.

```ts
import { getSupportedLanguages } from '@monorepo/i18n';

console.log(getSupportedLanguages()); // ["pt-BR", "en"]
```

### `getTranslations(language?)`

Get all translations for a language.

```ts
import { getTranslations } from '@monorepo/i18n';

const messages = getTranslations('en');
```

## Adding Translations

1. Edit the locale files in `src/locales/`:
    - `src/locales/pt-BR.json`
    - `src/locales/en.json`

2. **No TypeScript type updates needed** — `TranslationKey` auto-infers from JSON

3. Build and deploy:
    ```bash
    pnpm -F @monorepo/i18n build
    ```

### Example

Add a new section to both JSON files:

```json
{
  "common": { ... },
  "auth": {
    "login": "Login",
    "logout": "Logout"
  }
}
```

Now available with type safety:

```ts
t('auth.login'); // ✅ Type-safe
t('auth.logout'); // ✅ Type-safe
```

## React Hooks Integration

The `@monorepo/web` app provides a `useTranslation()` hook for React components:

```ts
import { useTranslation } from '@monorepo/web/hooks';

export function MyComponent() {
    const { t, language, setLanguage, supportedLanguages } = useTranslation();

    return (
        <div>
            <p>{t('common.greeting')}</p>
            <select value={language} onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}>
                {supportedLanguages.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                ))}
            </select>
        </div>
    );
}
```

**Features:**

- Auto-detects browser language on first load
- Persists language selection to `localStorage` (`app:language` key)
- Provides type-safe `t()` wrapper
- Syncs language with core i18n package

## Development

```bash
pnpm -F @monorepo/i18n build      # Build for distribution
pnpm -F @monorepo/i18n lint       # Run ESLint
pnpm -F @monorepo/i18n typecheck  # Run TypeScript
pnpm -F @monorepo/i18n test       # Run Vitest
```

## Testing

Unit tests in `src/index.spec.ts` verify:

- Translation lookup by key
- Language switching
- Fallback behavior for missing keys
- Edge cases (invalid languages, etc.)

Function overloads allow testing with any key:

```ts
import { t, setLanguage, type SupportedLanguage } from '@monorepo/i18n';

setLanguage('es' as SupportedLanguage); // Runtime-only, for testing
t('missing.key'); // Logs warning, returns key as fallback
```

## TypeScript Config

Extends `@monorepo/typescript-config/node`:

```json
{ "extends": "@monorepo/typescript-config/node" }
```

## ESLint Config

Extends `@monorepo/eslint-config/node` with TypeScript project support:

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

## Vitest Config

Uses `base` config from `@monorepo/vitest-config`:

```js
import { base } from '@monorepo/vitest-config/base';

export default base;
```

Uses Node environment (no jsdom), suitable for server-side i18n logic.

## Distribution

Build output in `dist/`:

```
dist/
├── index.js
├── index.d.ts
├── types.js
├── types.d.ts
└── locales/
    ├── en.json
    └── pt-BR.json
```

**Format:** ES modules only (`format: 'es'`)

## Consumer Apps

Apps import and use the i18n package:

```ts
import { t, setLanguage, getSupportedLanguages } from '@monorepo/i18n';
```

Type safety is enforced in each consumer at build time.
