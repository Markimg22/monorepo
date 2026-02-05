# Monorepo Template

A modern and scalable template for monorepo projects, pre-configured with the best tools from the JavaScript/TypeScript ecosystem.

## About

This template provides a solid foundation for developing web applications in a monorepo, using Turborepo for build and task management. It includes shared configurations for TypeScript, Biome (linting/formatting), and Vitest (testing), ensuring consistency across all workspace projects. Ideal for teams seeking productivity, code standardization, and an optimized development experience.

## Tech Stack

| Category | Technology |
|----------|------------|
| Runtime | Node.js 22+ |
| Package Manager | pnpm 10.15 |
| Build System | Turborepo |
| Language | TypeScript 5.9 |
| Linting/Format | Biome |
| Testing | Vitest |
| Frontend | Next.js 16 + React 19 |
| Styling | Tailwind CSS 4 |

## Project Structure

```
monorepo/
├── apps/
│   └── web/                 # Main Next.js application
├── packages/
│   ├── typescript-config/   # Shared TypeScript configurations
│   ├── biome-config/        # Biome configuration (lint/format)
│   └── vitest-config/       # Vitest configurations for testing
└── docs/                    # Project documentation
```

## Getting Started

### Prerequisites

- Node.js >= 22.22.0
- pnpm 10.15.0

### Installation

```bash
# Clone the repository
git clone https://github.com/Markimg22/monorepo.git
cd monorepo

# Install dependencies
pnpm install

# Start development
pnpm dev
```

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm check` | Lint + Format (Biome) |
| `pnpm test` | Run tests |
| `pnpm test:coverage` | Tests with coverage |

### Filter by Project

```bash
pnpm dev --filter=@monorepo/web
pnpm build --filter=@monorepo/web
```

## Creating New Projects

Use Turborepo generators:

```bash
# New shared package
pnpm turbo gen package

# New Next.js app
pnpm turbo gen app
```

## Documentation

Detailed documentation available in [`docs/`](./docs/):

- [Configuration PT-BR](./docs/configuration-pt-br.md) - Monorepo setup (Portuguese)
- [Configuration EN](./docs/configuration-en.md) - Monorepo setup (English)

## Conventions

### Commits

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add user authentication
fix: resolve login redirect issue
docs: update installation guide
```

### Dependencies

- Use `catalog:` for shared dependencies
- Use `workspace:*` for internal packages

## License

MIT
