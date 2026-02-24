'use client';

import {
    getSupportedLanguages,
    setLanguage as setI18nLanguage,
    t,
    type SupportedLanguage,
    type TranslationKey
} from '@monorepo/i18n';
import { useCallback, useState } from 'react';

const LANGUAGE_STORAGE_KEY = 'app:language';

/**
 * Extract language code from browser locale (e.g., 'pt-BR' -> 'pt')
 */
function extractLanguageCode(locale: string | null | undefined): string | null {
    if (typeof locale !== 'string') return null;
    const [code] = locale.split('-');
    return code?.toLowerCase() ?? null;
}

/**
 * Detect user's preferred language from browser
 */
function detectBrowserLanguage(supported: SupportedLanguage[]): SupportedLanguage | null {
    if (typeof navigator === 'undefined' || !navigator.language) {
        return null;
    }

    const browserLocale = navigator.language;
    const browserCode = extractLanguageCode(browserLocale);

    if (!browserCode) return null;

    // Try exact locale match first (e.g., 'pt-BR' === 'pt-BR')
    const exactMatch = supported.find((lang) => lang.toLowerCase() === browserLocale.toLowerCase());
    if (exactMatch) return exactMatch;

    // Fallback to language code match (e.g., 'pt' matches 'pt-BR')
    for (const lang of supported) {
        if (extractLanguageCode(lang) === browserCode) {
            return lang;
        }
    }

    return null;
}

/**
 * Initialize language from storage or browser preference
 */
function initializeLanguage(supported: SupportedLanguage[]): SupportedLanguage {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY) as SupportedLanguage | null;

    if (stored && supported.includes(stored)) {
        return stored;
    }

    const detected = detectBrowserLanguage(supported);
    return detected ?? (supported[0] as SupportedLanguage);
}

/**
 * Hook for managing translations with language switching
 */
export function useTranslation() {
    const supportedLanguages = getSupportedLanguages();

    const [language, setLanguage] = useState<SupportedLanguage>(() => {
        const initialLang = initializeLanguage(supportedLanguages);
        setI18nLanguage(initialLang);
        return initialLang;
    });

    const changeLanguage = useCallback(
        (lang: SupportedLanguage) => {
            if (!supportedLanguages.includes(lang)) {
                console.warn(`Language "${lang}" is not supported. Supported: ${supportedLanguages.join(', ')}`);
                return;
            }

            setI18nLanguage(lang);
            setLanguage(lang);
            localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
        },
        [supportedLanguages]
    );

    const isHydrated = true;

    // Type-safe wrapper for t function
    const typeSafeT = (key: TranslationKey, lang?: SupportedLanguage) => t(key, lang);

    return {
        t: typeSafeT,
        language,
        setLanguage: changeLanguage,
        supportedLanguages,
        isHydrated
    };
}
