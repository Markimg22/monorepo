import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
        exclude: ['node_modules', 'dist', '.next'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: ['node_modules', 'dist', '.next', '**/*.{test,spec}.{js,ts,jsx,tsx}'],
        },
        testTimeout: 10000,
        hookTimeout: 10000,
        setupFiles: ['./vitest.setup.ts'],
    },
});
