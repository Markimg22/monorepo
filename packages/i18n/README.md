# @monorepo/i18n

Centralized internationalization (i18n) package with **type-safe translations** for all apps.

## Installation

```bash
pnpm add @monorepo/i18n
```

## Quick Start

### Basic Usage

```ts
import { t, setLanguage } from '@monorepo/i18n';

// Get translation (default language: pt-BR)
console.log(t('common.greeting')); // "Olá, bem-vindo!"

// Change language
setLanguage('en');
console.log(t('common.greeting')); // "Hello, welcome!"

// Get translation for specific language
console.log(t('common.greeting', 'pt-BR')); // "Olá, bem-vindo!"
```

### Type-Safe Keys

Translation keys are **fully type-safe**:

```ts
import { t, type TranslationKey } from '@monorepo/i18n';

const greeting: string = t('common.greeting'); // ✅ Valid key
const invalid: string = t('invalid.key'); // ❌ Type error
```

TypeScript enforces that only valid, existing keys can be used.

## API

### `t(key, language?)`

Retrieve a translation by dot-separated key path.

```ts
import { t } from '@monorepo/i18n';

t('common.greeting'); // Current language (pt-BR by default)
t('common.greeting', 'en'); // Specific language
```

**Returns:** Translation string, or key as fallback if missing (with warning)

### `setLanguage(language)`

Change the current language.

```ts
import { setLanguage } from '@monorepo/i18n';

setLanguage('en');
```

### `getLanguage()`

Get the current language.

```ts
import { getLanguage } from '@monorepo/i18n';

console.log(getLanguage()); // "pt-BR" or "en"
```

### `getSupportedLanguages()`

Get list of all supported languages.

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

## Supported Languages

- **`pt-BR`** — Portuguese (Brazil) — Default
- **`en`** — English

## Adding New Translations

1. Edit translation files in `src/locales/`:
    - `src/locales/pt-BR.json`
    - `src/locales/en.json`

2. Add your keys and values:

```json
{
    "common": {
        "greeting": "Olá, bem-vindo!",
        "from-i18n": "Do pacote i18n"
    },
    "auth": {
        "login": "Entrar",
        "logout": "Sair"
    }
}
```

3. **Type-safe keys are auto-generated** — no manual type updates needed!

4. Build and deploy:

```bash
pnpm -F @monorepo/i18n build
```

## React Integration

Use the `useTranslation()` hook in React apps (from `@monorepo/web`):

```ts
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

**Hook Features:**

- Auto-detects browser language on first visit
- Persists language selection to localStorage
- Type-safe translation function
- Syncs with core i18n package

## Testing

Function overloads allow flexible testing:

```ts
// Runtime-only (for tests, loose typing)
import { t, setLanguage, type SupportedLanguage } from '@monorepo/i18n';

setLanguage('es' as SupportedLanguage); // Test unsupported language
t('missing.key'); // Returns key, logs warning
```

## Export Types

Import types for use in your app:

```ts
import type { SupportedLanguage, TranslationKey, Translations } from '@monorepo/i18n';
```

- `SupportedLanguage` — Union of supported language codes
- `TranslationKey` — Type-safe translation key paths
- `Translations` — Full translation object structure

## For Developers

For detailed development guidance, see [CLAUDE.md](./CLAUDE.md).

```bash
pnpm -F @monorepo/i18n build      # Build
pnpm -F @monorepo/i18n lint       # Lint
pnpm -F @monorepo/i18n typecheck  # Type check
pnpm -F @monorepo/i18n test       # Test
```
