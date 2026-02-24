'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@monorepo/ui/button';

export default function Home() {
    const { t, language, setLanguage, supportedLanguages, isHydrated } = useTranslation();

    if (!isHydrated) {
        return (
            <div className="flex h-screen flex-col items-center justify-center gap-4">
                <div className="h-12 w-48 animate-pulse rounded-lg bg-gray-200" />
            </div>
        );
    }

    return (
        <div className="flex h-screen flex-col items-center justify-center gap-4">
            <h1 className="text-3xl font-bold">{t('common.greeting')}</h1>

            <div className="flex gap-2">
                {supportedLanguages.map((lang) => (
                    <Button key={lang} onClick={() => setLanguage(lang)} variant={language === lang ? 'default' : 'outline'}>
                        {lang}
                    </Button>
                ))}
            </div>

            <p className="text-sm text-gray-500">{language}</p>
            <p>{t('common.from-i18n')}</p>
        </div>
    );
}
