import { beforeEach, describe, expect, it } from 'vitest';
import { getLanguage, getSupportedLanguages, getTranslations, setLanguage, t, type SupportedLanguage } from './index';

describe('@monorepo/i18n', () => {
    beforeEach(() => {
        setLanguage('pt-BR');
    });

    describe('getLanguage', () => {
        it('should return default language (pt-BR)', () => {
            expect(getLanguage()).toBe('pt-BR');
        });
    });

    describe('setLanguage', () => {
        it('should set language to en', () => {
            setLanguage('en');
            expect(getLanguage()).toBe('en');
        });

        it('should fallback to pt-BR for unsupported language', () => {
            setLanguage('es' as SupportedLanguage);
            expect(getLanguage()).toBe('pt-BR');
        });
    });

    describe('t (translation)', () => {
        it('should translate common.greeting in pt-BR', () => {
            setLanguage('pt-BR');
            expect(t('common.greeting')).toBe('Olá, bem-vindo!');
        });

        it('should translate common.greeting in en', () => {
            setLanguage('en');
            expect(t('common.greeting')).toBe('Hello, welcome!');
        });

        it('should return key for missing translation', () => {
            expect(t('missing.key')).toBe('missing.key');
        });

        it('should translate with explicit language parameter', () => {
            setLanguage('pt-BR');
            expect(t('common.greeting', 'en')).toBe('Hello, welcome!');
        });
    });

    describe('getTranslations', () => {
        it('should return all translations for current language', () => {
            setLanguage('pt-BR');
            const translations = getTranslations();
            expect(translations.common.greeting).toBe('Olá, bem-vindo!');
        });

        it('should return all translations for specific language', () => {
            const translations = getTranslations('en');
            expect(translations.common.greeting).toBe('Hello, welcome!');
        });
    });

    describe('getSupportedLanguages', () => {
        it('should return list of supported languages', () => {
            const languages = getSupportedLanguages();
            expect(languages).toContain('pt-BR');
            expect(languages).toContain('en');
            expect(languages.length).toBe(2);
        });
    });
});
