import { defineConfig } from 'vitest/config';

/** @type {import('vitest/config').UserConfig} */
export const base = defineConfig({
    test: {
        environment: 'node',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'lcov'],
            exclude: ['node_modules/**', 'dist/**', '**/*.config.*', '**/*.d.ts']
        }
    }
});
