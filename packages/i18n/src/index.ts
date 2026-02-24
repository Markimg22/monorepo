import en from './locales/en.json';
import ptBR from './locales/pt-BR.json';

import type { SupportedLanguage, TranslationKey, Translations } from './types';

const messages: Record<SupportedLanguage, Translations> = {
    'pt-BR': ptBR,
    en: en
};

let currentLanguage: SupportedLanguage = 'pt-BR';

/**
 * Get the current language
 */
export function getLanguage(): SupportedLanguage {
    return currentLanguage;
}

/**
 * Set the current language
 */
export function setLanguage(language: SupportedLanguage): void {
    if (!messages[language]) {
        console.warn(`Language "${language}" not supported. Using fallback "pt-BR"`);
        currentLanguage = 'pt-BR';
        return;
    }
    currentLanguage = language;
}

/**
 * Get translation by key path (e.g., "common.greeting")
 * Overloaded signatures for type-safe keys and fallback for testing
 */
export function t(key: TranslationKey, language?: SupportedLanguage): string;
export function t(key: string, language?: SupportedLanguage): string;
export function t(key: string, language?: SupportedLanguage): string {
    const lang = language ?? currentLanguage;
    const keys = key.split('.');
    let value: unknown = messages[lang];

    for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
            value = (value as Record<string, unknown>)[k];
        } else {
            console.warn(`Translation key "${key}" not found for language "${lang}"`);
            return key; // Return the key itself as fallback
        }
    }

    return typeof value === 'string' ? value : key;
}

/**
 * Get all translations for a specific language
 */
export function getTranslations(language?: SupportedLanguage): Translations {
    const lang = language ?? currentLanguage;
    return messages[lang];
}

/**
 * Get list of supported languages
 */
export function getSupportedLanguages(): SupportedLanguage[] {
    return Object.keys(messages) as SupportedLanguage[];
}

export type { SupportedLanguage, TranslationKey, Translations } from './types';
