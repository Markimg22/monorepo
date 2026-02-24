import { node } from '@monorepo/eslint-config/node';
import { defineConfig } from 'eslint/config';

export default defineConfig(...node, {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
        parserOptions: {
            project: './tsconfig.json',
            tsconfigRootDir: import.meta.dirname
        }
    }
});
