import { react } from '@monorepo/eslint-config/react';
import { defineConfig } from 'eslint/config';

export default defineConfig({ ignores: ['.next/**'] }, ...react, {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
        parserOptions: {
            project: './tsconfig.json',
            tsconfigRootDir: import.meta.dirname
        }
    }
});
