import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

/** @type {import("typescript-eslint").Config} */
export const base = defineConfig(
    eslint.configs.recommended,
    {
        ignores: ['node_modules', 'dist']
    },
    {
        files: ['**/*.ts', '**/*.tsx'],
        extends: [tseslint.configs.recommendedTypeChecked],
        rules: {
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
            '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports', fixStyle: 'inline-type-imports' }],
            '@typescript-eslint/no-import-type-side-effects': 'error'
        }
    },
    {
        files: ['**/*.js', '**/*.mjs'],
        extends: [tseslint.configs.recommended]
    },
    {
        linterOptions: {
            reportUnusedDisableDirectives: true
        }
    },
    prettier
);
