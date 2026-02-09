# Configuração Inicial

Guia passo a passo para configurar o monorepo do zero.

## Sumário

- [Requisitos](#requisitos)
- [Inicializando o Projeto](#inicializando-o-projeto)
- [Configuração do Workspace](#configuração-do-workspace)
- [Packages Compartilhados](#packages-compartilhados)
    - [typescript-config](#typescript-config)
    - [biome-config](#biome-config)
    - [vitest-config](#vitest-config)
- [Git Hooks](#git-hooks)
    - [Commitlint](#commitlint)
    - [Lefthook](#lefthook)
    - [Conventional Commits](#conventional-commits)
- [Fluxo de Trabalho](#fluxo-de-trabalho)
    - [TurboRepo](#turborepo)
    - [Comandos](#comandos)
    - [Generators](#generators)
    - [Criando Projetos Manualmente](#criando-projetos-manualmente)
---

## Requisitos

| Ferramenta | Versão |
|------------|--------|
| Node.js | >= 22.22.0 |
| pnpm | 10.15.0 |

---

## Inicializando o Projeto

Na raiz do projeto, execute:

```bash
pnpm init
```

Configure o `package.json`:

```json
{
    "name": "monorepo",
    "version": "1.0.0",
    "description": "A template for a Monorepo project.",
    "license": "MIT",
    "author": "@Markimg22",
    "packageManager": "pnpm@10.15.0",
    "engines": {
        "node": ">=22.22.0"
    },
    "keywords": [
        "monorepo",
        "template"
    ]
}
```

---

## Configuração do Workspace

Crie o arquivo `pnpm-workspace.yaml` na raiz:

```yaml
packages:
    - apps/*
    - packages/*

catalog:
    '@biomejs/biome': 2.3.14
    '@tailwindcss/postcss': 4.1.18
    '@testing-library/jest-dom': 6.9.1
    '@testing-library/react': 16.3.2
    '@testing-library/user-event': 14.6.1
    '@types/node': 24.5.0
    '@types/react': 19.2.11
    '@types/react-dom': 19.2.3
    '@vitest/coverage-v8': 4.0.18
    jsdom: 26.1.0
    lucide-react: ^0.563.0
    react: 19.2.3
    react-dom: 19.2.3
    tailwindcss: 4.1.18
    typescript: 5.9.2
    vite: ^6.4.1
    vitest: 4.0.17

injectWorkspacePackages: true
```

**Explicação:**

- `packages` - Define os diretórios do monorepo
- `catalog` - Centraliza versões das dependências compartilhadas
- `injectWorkspacePackages` - Permite injetar packages do workspace

Crie o `.gitignore`:

```text
node_modules
dist
.turbo
.next
coverage
.DS_Store
```

**Estrutura inicial:**

```
.
├── .gitignore
├── package.json
└── pnpm-workspace.yaml
```

---

## Packages Compartilhados

Packages ficam em `packages/` e são compartilhados entre todos os projetos do monorepo.

### typescript-config

Configurações TypeScript compartilhadas.

```bash
mkdir -p packages/typescript-config
cd packages/typescript-config
pnpm init
```

**`package.json`:**

```json
{
    "name": "@monorepo/typescript-config",
    "version": "1.0.0",
    "description": "Shared TypeScript configurations for monorepo",
    "author": "@Markimg22",
    "license": "MIT",
    "type": "module",
    "exports": {
        "./base.json": "./base.json",
        "./node.json": "./node.json",
        "./library.json": "./library.json",
        "./react.json": "./react.json"
    },
    "files": ["*.json"],
    "devDependencies": {
        "@types/node": "catalog:",
        "typescript": "catalog:"
    }
}
```

**`base.json`** - Configuração base:

```json
{
    "$schema": "https://json.schemastore.org/tsconfig",
    "display": "Base",
    "compilerOptions": {
        "strict": true,
        "strictNullChecks": true,
        "noUncheckedIndexedAccess": true,
        "noImplicitOverride": true,
        "noEmitOnError": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "resolveJsonModule": true,
        "isolatedModules": true,
        "verbatimModuleSyntax": true,
        "moduleDetection": "force",
        "declaration": true,
        "declarationMap": true,
        "sourceMap": true
    },
    "exclude": ["node_modules", "dist"]
}
```

**`node.json`** - Para projetos Node.js:

```json
{
    "$schema": "https://json.schemastore.org/tsconfig",
    "display": "Node.js 22",
    "extends": "./base.json",
    "compilerOptions": {
        "lib": ["ES2024"],
        "target": "ES2024",
        "module": "NodeNext",
        "moduleResolution": "NodeNext",
        "outDir": "dist",
        "rootDir": "src"
    }
}
```

**`library.json`** - Para bibliotecas compartilhadas:

```json
{
    "$schema": "https://json.schemastore.org/tsconfig",
    "display": "Library",
    "extends": "./base.json",
    "compilerOptions": {
        "lib": ["ES2024"],
        "target": "ES2024",
        "module": "NodeNext",
        "moduleResolution": "NodeNext",
        "outDir": "dist",
        "rootDir": "src",
        "composite": true
    }
}
```

> `composite: true` habilita project references para builds incrementais.

**Uso:**

```json
{
    "extends": "@monorepo/typescript-config/node.json"
}
```

**`react.json`** - Para projetos React:

```json
{
    "$schema": "https://json.schemastore.org/tsconfig",
    "display": "React",
    "extends": "./base.json",
    "compilerOptions": {
        "lib": ["ES2024", "DOM", "DOM.Iterable"],
        "target": "ES2022",
        "module": "ESNext",
        "moduleResolution": "bundler",
        "jsx": "react-jsx"
    }
}
```

**Uso:**

```json
{
    "extends": "@monorepo/typescript-config/react.json"
}
```

---

### biome-config

Configuração do Biome para linting e formatação.

```bash
mkdir -p packages/biome-config
cd packages/biome-config
pnpm init
```

**`package.json`:**

```json
{
    "name": "@monorepo/biome-config",
    "version": "1.0.0",
    "description": "Shared Biome configuration for monorepo",
    "author": "@Markimg22",
    "license": "MIT",
    "type": "module",
    "exports": {
        "./biome.json": "./biome.json"
    },
    "files": ["biome.json"],
    "devDependencies": {
        "@biomejs/biome": "catalog:"
    }
}
```

**`biome.json`:**

```json
{
    "$schema": "https://biomejs.dev/schemas/2.3.14/schema.json",
    "root": false,
    "files": {
        "includes": ["**", "!**/*.hbs"]
    },
    "vcs": {
        "enabled": true,
        "clientKind": "git",
        "useIgnoreFile": true
    },
    "assist": {
        "actions": {
            "source": {
                "organizeImports": "on"
            }
        }
    },
    "linter": {
        "enabled": true,
        "rules": {
            "recommended": true
        }
    },
    "formatter": {
        "enabled": true,
        "indentStyle": "space",
        "indentWidth": 4,
        "lineWidth": 100,
        "lineEnding": "lf"
    },
    "javascript": {
        "formatter": {
            "enabled": true,
            "quoteStyle": "single",
            "semicolons": "always"
        }
    },
    "json": {
        "formatter": {
            "enabled": true,
            "indentStyle": "space",
            "indentWidth": 4
        }
    }
}
```

**Configurações principais:**

| Opção | Valor | Descrição |
|-------|-------|-----------|
| `indentWidth` | 4 | Indentação com 4 espaços |
| `lineWidth` | 100 | Limite de caracteres por linha |
| `quoteStyle` | single | Aspas simples |
| `semicolons` | always | Sempre usar ponto e vírgula |

> **Importante:**  **Uso em apps e packages:**

Crie um arquivo `biome.jsonc` (não `biome.json`) no projeto:

```jsonc
{
    "$schema": "https://biomejs.dev/schemas/2.3.14/schema.json",
    "extends": ["@monorepo/biome-config/biome.json"],
    "root": false
}
```

> **Importante:** Use `biome.jsonc` (com 'c') nos projetos filhos para que editores como Zed detectem corretamente a configuração local em vez de usar apenas a configuração da raiz do monorepo.

Na raiz do projeto crie um `biome.json` também para o editor funcionar corretamente.

```json
{
    "$schema": "https://biomejs.dev/schemas/2.3.14/schema.json",
    // Aqui deve usar o caminho relativo
    "extends": ["./packages/biome-config/biome.json"],
    "root": true
}
```

E altere seu `package.json` adicionando o *biome* como *devDependencies*:

```json
{
    "devDependencies": {
        "@biomejs/biome": "catalog:"
    }
}
```

E no caso do editor *Zed* instale a extensão do **Biome** e cria na raiz um `.zed/settings.json`:

```json
{
    "code_actions_on_format": {
        "source.organizeImports.biome": true,
        "source.fixAll.biome": true
    },
    "format_on_save": "on",
    "formatter": {
        "language_server": { "name": "biome" }
    }
}
```

---

### vitest-config

Configuração do Vitest para testes.

```bash
mkdir -p packages/vitest-config
cd packages/vitest-config
pnpm init
```

**`package.json`:**

```json
{
    "name": "@monorepo/vitest-config",
    "version": "1.0.0",
    "description": "Shared Vitest configuration for monorepo",
    "author": "@Markimg22",
    "license": "MIT",
    "type": "module",
    "exports": {
        "./node": "./node.ts",
        "./react": "./react.ts"
    },
    "files": ["*.ts"],
    "devDependencies": {
        "typescript": "catalog:",
        "vitest": "catalog:"
    }
}
```

**`node.ts`** - Para projetos Node.js:

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        include: ['src/**/*.{test,spec}.{js,ts}'],
        exclude: ['node_modules', 'dist'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: ['node_modules', 'dist', '**/*.{test,spec}.{js,ts}'],
        },
        testTimeout: 10000,
        hookTimeout: 10000,
    },
});
```

**`react.ts`** - Para projetos React/Next.js:

```typescript
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
```

**`react.setup.ts`** - Setup para testes React:

```typescript
import '@testing-library/jest-dom/vitest';
```

**Uso:**

```typescript
// vitest.config.ts
import config from '@monorepo/vitest-config/node';
export default config;
```

Para customizar:

```typescript
import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from '@monorepo/vitest-config/node';

export default mergeConfig(baseConfig, defineConfig({
    test: {
        // customizações
    },
}));
```

---

## Estrutura Final

```
.
├── .gitignore
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── packages/
    ├── typescript-config/
    │   ├── package.json
    │   ├── base.json
    │   ├── node.json
    │   └── library.json
    ├── biome-config/
    │   ├── package.json
    │   └── biome.json
    └── vitest-config/
        ├── package.json
        ├── node.ts
        └── react.ts
```

Após criar os packages, execute:

```bash
cd ../..
pnpm install
```

---

## Git Hooks

Configuração de Commitlint e Lefthook para padronização de commits.

---

## Commitlint

O Commitlint valida mensagens de commit seguindo o padrão [Conventional Commits](https://www.conventionalcommits.org/).

### Instalação

Primeiro instale o *biome* e *typescript* dos seus pacotes anteriormentes configurados na raiz do projeto:

```bash
pnpm add -D -w "@monorepo/biome-config@workspace:*" "@monorepo/typescript-config@workspace:*"
```

Na raiz do projeto

```bash
pnpm add -Dw @commitlint/cli @commitlint/config-conventional @commitlint/types
```

### Configuração

Crie `commitlint.config.ts` na raiz:

```typescript
import type { UserConfig } from '@commitlint/types';

const config: UserConfig = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            [
                'feat',     // Nova funcionalidade
                'fix',      // Correção de bug
                'docs',     // Documentação
                'style',    // Formatação (não afeta código)
                'refactor', // Refatoração
                'perf',     // Performance
                'test',     // Testes
                'build',    // Build system
                'ci',       // CI/CD
                'chore',    // Tarefas gerais
                'revert',   // Reverter commit
            ],
        ],
        'type-case': [2, 'always', 'lower-case'],
        'type-empty': [2, 'never'],
        'subject-empty': [2, 'never'],
        'subject-case': [2, 'always', 'lower-case'],
        'subject-full-stop': [2, 'never', '.'],
        'header-max-length': [2, 'always', 100],
    },
};

export default config;
```

### Regras

| Regra | Descrição |
|-------|-----------|
| `type-enum` | Tipos de commit permitidos |
| `type-case` | Tipo deve ser lowercase |
| `type-empty` | Tipo é obrigatório |
| `subject-empty` | Mensagem é obrigatória |
| `subject-case` | Mensagem deve ser lowercase |
| `subject-full-stop` | Sem ponto final na mensagem |
| `header-max-length` | Máximo 100 caracteres no header |

---

## Lefthook

O Lefthook é um gerenciador de git hooks rápido e configurável.

### Instalação

```bash
pnpm add -Dw lefthook
```

### Configuração

Crie `lefthook.yml` na razi:

```yaml
# Lefthook configuration
# https://github.com/evilmartians/lefthook

commit-msg:
    commands:
        commitlint:
            run: pnpm commitlint --edit {1}

pre-push:
    parallel: true
    commands:
        build:
            run: pnpm build
        check:
            run: pnpm check
```

### Instalando os Hooks

```bash
pnpm lefthook install
```

Para instalar automaticamente, adicione o script `prepare` no `package.json`:

```json
{
    "scripts": {
        "prepare": "lefthook install"
    }
}
```

### Hooks Configurados

| Hook | Quando Executa | Ação |
|------|----------------|------|
| `commit-msg` | Ao criar commit | Valida mensagem com Commitlint |
| `pre-push` | Antes do push | Executa build e check em paralelo |

### Ignorar Hooks Temporariamente

```bash
# Ignorar pre-push
git push --no-verify

# Ignorar commit-msg
git commit --no-verify -m "mensagem"
```

---

## Conventional Commits

### Formato

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Componentes:**

| Parte | Obrigatório | Descrição |
|-------|-------------|-----------|
| `type` | Sim | Tipo do commit |
| `scope` | Não | Contexto/módulo afetado |
| `subject` | Sim | Descrição curta |
| `body` | Não | Descrição detalhada |
| `footer` | Não | Breaking changes, issues |

### Tipos de Commit

| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| `feat` | Nova funcionalidade | `feat: add user authentication` |
| `fix` | Correção de bug | `fix: resolve memory leak` |
| `docs` | Documentação | `docs: update installation guide` |
| `style` | Formatação | `style: fix indentation` |
| `refactor` | Refatoração | `refactor: simplify validation logic` |
| `perf` | Performance | `perf: optimize database queries` |
| `test` | Testes | `test: add unit tests for auth` |
| `build` | Build system | `build: update webpack config` |
| `ci` | CI/CD | `ci: add github actions workflow` |
| `chore` | Tarefas gerais | `chore: update dependencies` |
| `revert` | Reverter commit | `revert: remove broken feature` |

### Exemplos

**Simples:**

```
feat: add password reset functionality
```

**Com scope:**

```
fix(api): resolve connection timeout issue
```

**Com body:**

```
refactor(auth): simplify token validation

Removed redundant checks and consolidated validation logic
into a single function for better maintainability.
```

**Breaking change:**

```
feat(api)!: change response format

BREAKING CHANGE: API responses now use camelCase instead of snake_case.
```

**Referenciando issue:**

```
fix: resolve login redirect loop

Closes #123
```

---

## Fluxo de Trabalho

Guia de comandos, TurboRepo e generators para desenvolvimento.

---

## TurboRepo

O TurboRepo é um build system de alta performance para monorepos. Ele otimiza a execução de tasks com cache inteligente e paralelização.

### Instalação

```bash
pnpm add -D turbo -w
```

### Configuração

Crie `turbo.json` na raiz:

```json
{
    "$schema": "https://turbo.build/schema.json",
    "tasks": {
        "build": {
            "dependsOn": ["^build"],
            "outputs": [".next/**", "!.next/cache/**", "dist/**"]
        },
        "dev": {
            "cache": false,
            "persistent": true
        },
        "check": {
            "dependsOn": ["^build"]
        },
        "lint": {},
        "format": {},
        "test": {
            "dependsOn": ["^build"]
        },
        "test:coverage": {
            "dependsOn": ["^build"]
        }
    }
}
```

**Explicação das tasks:**

| Task | Descrição |
|------|-----------|
| `build` | Compila projetos. `^build` compila dependências primeiro |
| `dev` | Servidor de desenvolvimento. Sem cache, persistente |
| `check` | Biome check (lint + format) |
| `lint` | Apenas linting |
| `format` | Apenas formatação |
| `test` | Executa testes |
| `test:coverage` | Testes com cobertura |

---

## Comandos

### Comandos Globais

Crie novos scripts em `package.json`:

```json
{
    "scripts": {
        "build": "turbo run build",
        "dev": "turbo run dev",
        "check": "turbo run check",
        "lint": "turbo run lint",
        "format": "turbo run format",
        "test": "turbo run test",
        "test:coverage": "turbo run test:coverage",
        "prepare": "lefthook install"
    }
}
```

Execute da raiz do projeto:

```bash
pnpm dev           # Inicia dev server de todos os projetos
pnpm build         # Build de produção
pnpm check         # Lint + Format (Biome)
pnpm lint          # Apenas lint
pnpm format        # Apenas format
pnpm test          # Executa testes
pnpm test:coverage # Testes com cobertura
```

### Filtrar por Projeto

```bash
# Build de um projeto específico
pnpm build --filter=@monorepo/web

# Dev de um projeto específico
pnpm dev --filter=@monorepo/web

# Testes de um projeto específico
pnpm test --filter=@monorepo/utils
```

### Cache

O Turborepo usa cache para evitar reexecutar tasks que não mudaram. Para limpar o cache:

```bash
pnpm turbo run build --force  # Ignora cache
rm -rf .turbo                  # Remove cache local
```

---

## Generators

O Turborepo possui generators baseados no Plop para criar novos packages e apps automaticamente.

### Instalação

```bash
pnpm add -D @turbo/gen -w
```

### Estrutura

```
turbo/
└── generators/
    ├── config.ts          # Configuração dos generators
    └── templates/         # Templates Handlebars
        ├── package/       # Templates para packages
        └── app/           # Templates para apps
```

### Generator: Package

Cria um novo package compartilhado em `packages/`:

```bash
pnpm turbo gen package
```

**Prompts:**

| Campo | Descrição |
|-------|-----------|
| `name` | Nome do package (sem prefixo `@monorepo/`) |
| `description` | Descrição do package |
| `withTests` | Incluir configuração de testes (default: true) |

**Arquivos gerados:**

```
packages/<name>/
├── package.json
├── tsconfig.json
├── biome.jsonc
├── vitest.config.ts  # se withTests
└── src/
    ├── index.ts
    └── index.test.ts  # se withTests
```

### Generator: App

Cria um novo app Next.js em `apps/`:

```bash
pnpm turbo gen web
```

**Prompts:**

| Campo | Descrição |
|-------|-----------|
| `name` | Nome do app (sem prefixo `@monorepo/`) |
| `description` | Descrição do app |
| `port` | Porta de desenvolvimento (default: 3000) |

**Arquivos gerados:**

```
apps/<name>/
├── package.json
├── tsconfig.json
├── biome.jsonc
├── next.config.ts
├── postcss.config.mjs
├── vitest.config.ts
├── vitest.setup.ts
└── src/
    └── app/
        ├── layout.tsx
        ├── page.tsx
        └── globals.css
```

### Uso com Argumentos

Para evitar prompts interativos:

```bash
# Package
pnpm turbo gen package --args "utils" "Utility functions" "true"

# App
pnpm turbo gen app --args "admin" "Admin dashboard" "3001"
```

### Após Criar um Projeto

```bash
pnpm install   # Instalar dependências
pnpm build     # Verificar build
pnpm check     # Verificar lint/format
```

---

## Criando Projetos Manualmente

### Novo Package

1. Crie a pasta em `packages/`:

```bash
mkdir -p packages/meu-package
cd packages/meu-package
pnpm init
```

2. Configure o `package.json`:

```json
{
    "name": "@monorepo/meu-package",
    "version": "1.0.0",
    "description": "Descrição do package",
    "author": "@Markimg22",
    "license": "MIT",
    "type": "module",
    "exports": {
        ".": "./src/index.ts"
    },
    "files": ["src", "dist"],
    "devDependencies": {
        "@monorepo/typescript-config": "workspace:*",
        "@monorepo/biome-config": "workspace:*",
        "@monorepo/vitest-config": "workspace:*",
        "typescript": "catalog:",
        "vitest": "catalog:"
    },
    "scripts": {
        "build": "tsc",
        "check": "biome check --write .",
        "lint": "biome lint .",
        "format": "biome format --write .",
        "test": "vitest",
        "test:coverage": "vitest --coverage"
    }
}
```

3. Configure o `tsconfig.json`:

```json
{
    "extends": "@monorepo/typescript-config/library.json",
    "compilerOptions": {
        "outDir": "dist",
        "rootDir": "src"
    },
    "include": ["src"]
}
```

4. Configure o `biome.jsonc`:

```jsonc
{
    "$schema": "https://biomejs.dev/schemas/2.3.14/schema.json",
    "extends": ["@monorepo/biome-config/biome.json"],
    "root": false
}
```

> Use `biome.jsonc` para que editores detectem a configuração local corretamente.

5. Configure o `vitest.config.ts`:

```typescript
import config from '@monorepo/vitest-config/node';
export default config;
```

### Novo App Next.js

1. Crie a pasta em `apps/`:

```bash
mkdir -p apps/meu-app
cd apps/meu-app
pnpm init
```

2. Configure o `package.json`:

```json
{
    "name": "@monorepo/meu-app",
    "version": "1.0.0",
    "private": true,
    "description": "Descrição do app",
    "author": "@Markimg22",
    "license": "MIT",
    "type": "module",
    "scripts": {
        "dev": "next dev --port 3000",
        "build": "next build",
        "start": "next start",
        "check": "biome check --write .",
        "lint": "biome lint .",
        "format": "biome format --write .",
        "test": "vitest",
        "test:coverage": "vitest --coverage"
    },
    "dependencies": {
        "next": "^16.3.3",
        "react": "^19.1.0",
        "react-dom": "^19.1.0"
    },
    "devDependencies": {
        "@monorepo/typescript-config": "workspace:*",
        "@monorepo/biome-config": "workspace:*",
        "@monorepo/vitest-config": "workspace:*",
        "@testing-library/jest-dom": "^6.7.0",
        "@testing-library/react": "^16.3.0",
        "@types/node": "catalog:",
        "@types/react": "^19.1.8",
        "@types/react-dom": "^19.1.6",
        "jsdom": "^26.1.0",
        "tailwindcss": "^4.1.11",
        "typescript": "catalog:",
        "vitest": "catalog:"
    }
}
```

3. Configure o `tsconfig.json`:

```json
{
    "extends": "@monorepo/typescript-config/base.json",
    "compilerOptions": {
        "lib": ["dom", "dom.iterable", "ES2024"],
        "jsx": "preserve",
        "module": "ESNext",
        "moduleResolution": "Bundler",
        "noEmit": true,
        "plugins": [{ "name": "next" }],
        "baseUrl": ".",
        "paths": {
            "@/*": ["./src/*"]
        }
    },
    "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
    "exclude": ["node_modules"]
}
```

4. Configure o `next.config.ts`:

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {};

export default nextConfig;
```

5. Configure o `vitest.config.ts`:

```typescript
import config from '@monorepo/vitest-config/react';
export default config;
```

6. Crie a estrutura de pastas:

```bash
mkdir -p src/app
```

7. Execute `pnpm install` na raiz.
