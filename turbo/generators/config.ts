import type { PlopTypes } from '@turbo/gen';

export default function generator(plop: PlopTypes.NodePlopAPI): void {
    // Helper para converter nome para diferentes formatos
    plop.setHelper('kebabCase', (text: string) => {
        return text
            .replace(/([a-z])([A-Z])/g, '$1-$2')
            .replace(/[\s_]+/g, '-')
            .toLowerCase();
    });

    plop.setHelper('pascalCase', (text: string) => {
        return text
            .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
            .replace(/^(.)/, (c) => c.toUpperCase());
    });

    // Generator para criar novos packages
    plop.setGenerator('package', {
        description: 'Create a new shared package in packages/',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Package name (without @monorepo/ prefix):',
                validate: (input: string) => {
                    if (!input || input.trim() === '') {
                        return 'Package name is required';
                    }
                    if (!/^[a-z][a-z0-9-]*$/.test(input)) {
                        return 'Package name must be lowercase, start with a letter, and contain only letters, numbers, and hyphens';
                    }
                    return true;
                },
            },
            {
                type: 'input',
                name: 'description',
                message: 'Package description:',
                default: 'A shared package for monorepo monorepo',
            },
            {
                type: 'confirm',
                name: 'withTests',
                message: 'Include test setup?',
                default: true,
            },
        ],
        actions: (answers) => {
            const actions: PlopTypes.ActionType[] = [
                {
                    type: 'add',
                    path: 'packages/{{kebabCase name}}/package.json',
                    templateFile: 'templates/package/package.json.hbs',
                },
                {
                    type: 'add',
                    path: 'packages/{{kebabCase name}}/tsconfig.json',
                    templateFile: 'templates/package/tsconfig.json.hbs',
                },
                {
                    type: 'add',
                    path: 'packages/{{kebabCase name}}/biome.jsonc',
                    templateFile: 'templates/package/biome.jsonc.hbs',
                },
                {
                    type: 'add',
                    path: 'packages/{{kebabCase name}}/src/index.ts',
                    templateFile: 'templates/package/src/index.ts.hbs',
                },
            ];

            if (answers?.withTests) {
                actions.push(
                    {
                        type: 'add',
                        path: 'packages/{{kebabCase name}}/vitest.config.ts',
                        templateFile: 'templates/package/vitest.config.ts.hbs',
                    },
                    {
                        type: 'add',
                        path: 'packages/{{kebabCase name}}/src/index.test.ts',
                        templateFile: 'templates/package/src/index.test.ts.hbs',
                    },
                );
            }

            return actions;
        },
    });

    // Generator para criar novos apps Next.js
    plop.setGenerator('web', {
        description: 'Create a new Next.js app in apps/',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'App name (without @monorepo/ prefix):',
                validate: (input: string) => {
                    if (!input || input.trim() === '') {
                        return 'App name is required';
                    }
                    if (!/^[a-z][a-z0-9-]*$/.test(input)) {
                        return 'App name must be lowercase, start with a letter, and contain only letters, numbers, and hyphens';
                    }
                    return true;
                },
            },
            {
                type: 'input',
                name: 'description',
                message: 'App description:',
                default: 'A Next.js application',
            },
            {
                type: 'input',
                name: 'port',
                message: 'Development port:',
                default: '3000',
                validate: (input: string) => {
                    const port = Number.parseInt(input, 10);
                    if (Number.isNaN(port) || port < 1000 || port > 65535) {
                        return 'Port must be a number between 1000 and 65535';
                    }
                    return true;
                },
            },
        ],
        actions: [
            // Config files
            {
                type: 'add',
                path: 'apps/{{kebabCase name}}/package.json',
                templateFile: 'templates/app/web/package.json.hbs',
            },
            {
                type: 'add',
                path: 'apps/{{kebabCase name}}/tsconfig.json',
                templateFile: 'templates/app/web/tsconfig.json.hbs',
            },
            {
                type: 'add',
                path: 'apps/{{kebabCase name}}/biome.jsonc',
                templateFile: 'templates/app/web/biome.jsonc.hbs',
            },
            {
                type: 'add',
                path: 'apps/{{kebabCase name}}/next.config.ts',
                templateFile: 'templates/app/web/next.config.ts.hbs',
            },
            {
                type: 'add',
                path: 'apps/{{kebabCase name}}/postcss.config.mjs',
                templateFile: 'templates/app/web/postcss.config.mjs.hbs',
            },
            {
                type: 'add',
                path: 'apps/{{kebabCase name}}/vitest.config.ts',
                templateFile: 'templates/app/web/vitest.config.ts.hbs',
            },
            {
                type: 'add',
                path: 'apps/{{kebabCase name}}/.gitignore',
                templateFile: 'templates/app/web/gitignore.hbs',
            },
            // App source files
            {
                type: 'add',
                path: 'apps/{{kebabCase name}}/src/app/layout.tsx',
                templateFile: 'templates/app/web/src/app/layout.tsx.hbs',
            },
            {
                type: 'add',
                path: 'apps/{{kebabCase name}}/src/app/page.tsx',
                templateFile: 'templates/app/web/src/app/page.tsx.hbs',
            },
            {
                type: 'add',
                path: 'apps/{{kebabCase name}}/src/styles/globals.css',
                templateFile: 'templates/app/web/src/styles/globals.css.hbs',
            },
        ],
    });
}
