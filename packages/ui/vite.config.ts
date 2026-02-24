import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { globSync } from 'node:fs';
import { extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import dts from 'vite-plugin-dts';

import pkg from './package.json';

// Auto-discover all entry points, flattening nested component structure
const entries = Object.fromEntries(
    globSync('src/**/*.{ts,tsx}')
        .filter(
            (file) =>
                !/\.(d\.ts|spec\.tsx|stories\.tsx|test-helper\.(ts|tsx))$/.test(file) &&
                !file.includes('src/tests/') &&
                !file.includes('src/styles/')
        )
        .map((file) => {
            let entryName = relative('src', file.slice(0, file.length - extname(file).length));
            // Flatten: components/ui/button/index -> components/button/index
            entryName = entryName.replace(/^components\/ui\//, 'components/');
            return [entryName, fileURLToPath(new URL(file, import.meta.url))];
        })
);

// Plugin to inject 'use client' in component chunks
function preserveUseClient(): Plugin {
    return {
        name: 'preserve-use-client',
        generateBundle(_, bundle) {
            for (const chunk of Object.values(bundle)) {
                if (
                    chunk.type === 'chunk' &&
                    chunk.fileName.startsWith('components/') &&
                    !chunk.code.startsWith("'use client'")
                ) {
                    chunk.code = `'use client';\n${chunk.code}`;
                }
            }
        }
    };
}

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        dts({
            include: ['src/**/*'],
            exclude: ['src/**/*.spec.tsx', 'src/**/*.stories.tsx', 'src/**/*.test-helper.{ts,tsx}', 'src/tests/**'],
            entryRoot: 'src',
            beforeWriteFile: (filePath, content) => {
                // Flatten: dist/components/ui/button/index.d.ts -> dist/components/button/index.d.ts
                const newPath = filePath.replace(/\/components\/ui\//, '/components/');
                return { filePath: newPath, content };
            }
        }),
        preserveUseClient()
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    build: {
        lib: {
            entry: entries,
            formats: ['es']
        },
        rollupOptions: {
            external: [
                'react',
                'react-dom',
                'react/jsx-runtime',
                ...Object.keys(pkg.dependencies || {}),
                ...Object.keys(pkg.peerDependencies || {})
            ],
            output: {
                preserveModules: true,
                preserveModulesRoot: 'src',
                entryFileNames: '[name].js',
                assetFileNames: (assetInfo) => {
                    const fileName = assetInfo.names?.[0];
                    if (fileName?.endsWith('.css')) {
                        return 'index.css';
                    }
                    return '[name].[ext]';
                }
            }
        },
        cssCodeSplit: false,
        outDir: 'dist'
    }
});
