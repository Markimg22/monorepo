import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';
import dts from 'vite-plugin-dts';

// Plugin to preserve "use client" directive
function preserveUseClient(): Plugin {
    return {
        name: 'preserve-use-client',
        generateBundle(_, bundle) {
            for (const chunk of Object.values(bundle)) {
                if (chunk.type === 'chunk' && chunk.fileName === 'index.js') {
                    chunk.code = `'use client';\n${chunk.code}`;
                }
            }
        },
    };
}

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        dts({
            include: ['src/**/*'],
            exclude: ['src/**/*.spec.tsx', 'src/**/*.stories.tsx'],
            rollupTypes: true,
        }),
        preserveUseClient(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'MonorepoUI',
            formats: ['es'],
            fileName: 'index',
        },
        rollupOptions: {
            external: ['react', 'react-dom', 'react/jsx-runtime'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                },
            },
        },
        cssCodeSplit: false,
        outDir: 'dist',
    },
});
