# @monorepo/i18n

Centralized translations package for the monorepo. Used across all apps (web, api, etc.).

## Installation

```bash
pnpm add @monorepo/i18n
```

## Usage

### Basic Translation

```ts
import { t, setLanguage } from '@monorepo/i18n';

// Get current language translation (default: pt-BR)
console.log(t('common.greeting')); // "Olá, bem-vindo!"

// Change language
setLanguage('en');
console.log(t('common.greeting')); // "Hello, welcome!"

// Get translation for specific language
console.log(t('common.greeting', 'pt-BR')); // "Olá, bem-vindo!"
```

### Get Current Language

```ts
import { getLanguage, setLanguage } from '@monorepo/i18n';

console.log(getLanguage()); // "pt-BR"
setLanguage('en');
console.log(getLanguage()); // "en"
```

### Get Supported Languages

```ts
import { getSupportedLanguages } from '@monorepo/i18n';

console.log(getSupportedLanguages()); // ["pt-BR", "en"]
```

## Adding New Translations

1. Edit the locale files in `src/locales/`:
    - `src/locales/pt-BR.json`
    - `src/locales/en.json`

2. Update the `Translations` type in `src/types.ts` to match your new structure

3. Run `pnpm -F @monorepo/i18n build` to compile

## Supported Languages

- `pt-BR` - Portuguese (Brazil) - Default
- `en` - English

## TypeScript Support

All translations are type-safe. The `Translations` interface ensures you're using valid keys.

```ts
import type { Translations } from '@monorepo/i18n';

const greeting: string = t('common.greeting'); // ✅ Valid
const invalid: string = t('invalid.key'); // ⚠️ Runtime warning
```
