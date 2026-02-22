import next from '@next/eslint-plugin-next';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from 'eslint/config';

import { base } from './base.js';

/** @type {import("typescript-eslint").Config} */
export const react = defineConfig(...base, {
    plugins: {
        'react-hooks': reactHooks,
        '@next/next': next
    },
    rules: {
        ...reactHooks.configs.recommended.rules,
        ...next.configs.recommended.rules,
        ...next.configs['core-web-vitals'].rules
    }
});
