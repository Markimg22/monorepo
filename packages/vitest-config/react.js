import { mergeConfig } from 'vitest/config';

import { base } from './base.js';

/** @type {import('vitest/config').UserConfig} */
export const react = mergeConfig(base, {
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['@monorepo/vitest-config/react-setup']
    }
});
