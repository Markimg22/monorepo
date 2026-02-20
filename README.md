# Monorepo

A professional monorepo template with TypeScript, ESLint, Prettier, and git hooks pre-configured.

## Requirements

- Node.js >= 22.22.0
- pnpm >= 10.15.0

## Getting Started

```bash
pnpm install
pnpm lefthook install
```

## Structure

```
apps/        # Standalone applications
packages/    # Shared libraries
```

## Shared Packages

| Package                       | Description                      |
| ----------------------------- | -------------------------------- |
| `@monorepo/typescript-config` | Shared TypeScript configurations |
| `@monorepo/eslint-config`     | Shared ESLint configurations     |
| `@monorepo/prettier-config`   | Shared Prettier configurations   |

## Tooling

- **TypeScript** — strict mode with per-context configs (`node`, `nextjs`, `react-library`)
- **ESLint** — flat config with `typescript-eslint` and `eslint-config-prettier`
- **Prettier** — with `prettier-plugin-organize-imports` (and `prettier-plugin-tailwindcss` for React)
- **Lefthook** — runs Prettier and ESLint on staged files before commit
- **Commitlint** — enforces [Conventional Commits](https://www.conventionalcommits.org/)

## Commit Convention

```
<type>(<scope>): <description>
- <body>
```

Common types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `ci`
