# Monorepo Template

Template moderno e escalável para projetos monorepo, pré-configurado com as melhores ferramentas do ecossistema JavaScript/TypeScript.

## Sobre

Este template fornece uma base sólida para desenvolvimento de aplicações web em monorepo, utilizando Turborepo para gerenciamento de builds e tarefas. Inclui configurações compartilhadas de TypeScript, Biome (linting/formatting) e Vitest (testes), permitindo consistência entre todos os projetos do workspace. Ideal para times que buscam produtividade, padronização de código e uma experiência de desenvolvimento otimizada.

## Tech Stack

| Categoria | Tecnologia |
|-----------|------------|
| Runtime | Node.js 22+ |
| Package Manager | pnpm 10.15 |
| Build System | Turborepo |
| Linguagem | TypeScript 5.9 |
| Linting/Format | Biome |
| Testes | Vitest |
| Frontend | Next.js 16 + React 19 |
| Estilização | Tailwind CSS 4 |

## Estrutura do Projeto

```
monorepo/
├── apps/
│   └── web/                 # Aplicação Next.js principal
├── packages/
│   ├── typescript-config/   # Configurações TypeScript compartilhadas
│   ├── biome-config/        # Configuração Biome (lint/format)
│   └── vitest-config/       # Configurações Vitest para testes
└── docs/                    # Documentação do projeto
```

## Começando

### Pré-requisitos

- Node.js >= 22.22.0
- pnpm 10.15.0

### Instalação

```bash
# Clone o repositório
git clone https://github.com/Markimg22/monorepo.git
cd monorepo

# Instale as dependências
pnpm install

# Inicie o desenvolvimento
pnpm dev
```

## Comandos

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Inicia servidor de desenvolvimento |
| `pnpm build` | Build de produção |
| `pnpm check` | Lint + Format (Biome) |
| `pnpm test` | Executa testes |
| `pnpm test:coverage` | Testes com cobertura |

### Filtrar por Projeto

```bash
pnpm dev --filter=@monorepo/web
pnpm build --filter=@monorepo/web
```

## Criando Novos Projetos

Use os generators do Turborepo:

```bash
# Novo package compartilhado
pnpm turbo gen package

# Novo app Next.js
pnpm turbo gen app
```

## Documentação

Documentação detalhada disponível em [`docs/`](./docs/):

- [Configuração PT-BR](./docs/configuration-pt-br.md) - Setup do monorepo

## Convenções

### Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add user authentication
fix: resolve login redirect issue
docs: update installation guide
```

### Dependências

- Use `catalog:` para dependências compartilhadas
- Use `workspace:*` para packages internos

## Licença

MIT
