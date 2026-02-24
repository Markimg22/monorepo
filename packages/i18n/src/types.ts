import type enJson from './locales/en.json';

export type SupportedLanguage = 'pt-BR' | 'en';

/**
 * Translations type is automatically inferred from the JSON files
 * No need to manually update when adding new keys!
 */
export type Translations = typeof enJson;

/**
 * Type-safe translation key (e.g., "common.greeting")
 * Ensures you can only call t() with valid dot-separated paths
 */
export type TranslationKey = {
    [K in keyof Translations]: {
        [SK in keyof Translations[K]]: `${K & string}.${SK & string}`;
    }[keyof Translations[K]];
}[keyof Translations];
