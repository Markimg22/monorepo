import path from 'node:path';
import config from '@monorepo/vitest-config/react';
import { defineConfig, mergeConfig } from 'vitest/config';

export default mergeConfig(
    config,
    defineConfig({
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
    }),
);
