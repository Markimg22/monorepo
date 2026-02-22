# Monorepo

A professional monorepo template with TypeScript, ESLint, Prettier, Vitest, and git hooks pre-configured.

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
| `@monorepo/vitest-config`     | Shared Vitest configurations     |
| `@monorepo/ui`                | Shared UI component library      |

## Workspace Scripts

Run from the monorepo root — NX orchestrates execution across all packages:

```bash
pnpm dev            # Start dev servers
pnpm test           # Run tests
pnpm test:coverage  # Run tests with coverage
pnpm lint           # Lint all packages
pnpm typecheck      # Type-check all packages
pnpm format         # Format all files with Prettier
```

## Tooling

- **TypeScript** — strict mode with per-context configs (`node`, `nextjs`, `react-library`)
- **ESLint** — flat config with `typescript-eslint` and `eslint-config-prettier`
- **Prettier** — with `prettier-plugin-organize-imports` and `prettier-plugin-tailwindcss`
- **Vitest** — shared base and React configs with jsdom and Testing Library
- **NX** — package-based monorepo orchestration (`nx affected` for smart task running)
- **Lefthook** — runs Prettier and `nx affected --target=lint` on staged files before commit
- **Commitlint** — enforces [Conventional Commits](https://www.conventionalcommits.org/)

## Commit Convention

```
<type>(<scope>): <description>
- <body>
```

Common types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `ci`
