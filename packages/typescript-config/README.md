# @monorepo/typescript-config

Shared **strict TypeScript configurations** for all packages and apps in the monorepo.

## Installation

```bash
pnpm add -D @monorepo/typescript-config
```

## Available Configs

| Config          | Purpose                  | Module | Target | JSX       |
| --------------- | ------------------------ | ------ | ------ | --------- |
| `base`          | Shared strict settings   | ESNext | ESNext | —         |
| `node`          | Node.js packages         | ESNext | ESNext | —         |
| `nextjs`        | Next.js applications     | ESNext | ESNext | preserve  |
| `react-library` | React component packages | ESNext | ESNext | react-jsx |

## Usage

### Node.js Packages

For backend code, CLI tools, and configuration packages:

```json
{
    "extends": "@monorepo/typescript-config/node",
    "compilerOptions": {
        "baseUrl": ".",
        "paths": {
            "@": ["src"]
        }
    }
}
```

### Next.js Applications

For Next.js apps with `jsx: preserve`:

```json
{
    "extends": "@monorepo/typescript-config/nextjs",
    "compilerOptions": {
        "baseUrl": ".",
        "paths": {
            "@": ["src"]
        }
    }
}
```

### React Component Libraries

For reusable React component packages:

```json
{
    "extends": "@monorepo/typescript-config/react-library",
    "compilerOptions": {
        "baseUrl": ".",
        "paths": {
            "@": ["src"]
        }
    },
    "include": ["src", ".storybook/**/*.ts", ".storybook/**/*.tsx", "vite.config.ts"]
}
```

**Used by:**

- `@monorepo/ui`

## Configuration Details

### `base.json`

Strict TypeScript settings enforced across all environments:

- `strict: true` — All strict options enabled
- `noImplicitAny` — Errors on implicit `any`
- `noUnusedLocals` — Errors on unused variables
- `noUnusedParameters` — Errors on unused parameters
- `noImplicitReturns` — Errors if not all code paths return
- `exactOptionalPropertyTypes` — Strict optional property handling
- `noPropertyAccessFromIndexSignature` — Prevents unsafe index access

### Module Systems

- **`node`**: `ESNext` + `bundler` moduleResolution (Vite, esbuild)
- **`nextjs`**: `ESNext` + `bundler` + `jsx: preserve` for Next.js
- **`react-library`**: `ESNext` + `bundler` + `jsx: react-jsx` for React

## Customizing a Config

Extend and override in your package's `tsconfig.json`:

```json
{
    "extends": "@monorepo/typescript-config/node",
    "compilerOptions": {
        "lib": ["ESNext", "DOM"],
        "paths": {
            "@/*": ["./src/*"]
        }
    },
    "include": ["src", "build.config.ts"],
    "exclude": ["node_modules", "dist"]
}
```

## Strict Checking

All configs enforce **strict mode** and additional safety checks. This catches common errors at build time:

```ts
// ❌ Error: noUnusedLocals
const unused = 42;

// ❌ Error: noImplicitReturns
function getUser(id: number) {
    if (id > 0) {
        return { id };
    }
    // Missing return for else case
}

// ❌ Error: noImplicitAny
const config = { timeout: 30 };
Object.keys(config).forEach((key) => {
    // 'key' has implicit any
    console.log(config[key]);
});
```

## Monorepo Structure

All packages extend one of these configurations:

```
packages/
├── typescript-config/        ← You are here
├── ui/                        → react-library.json
├── eslint-config/             → node.json
└── vitest-config/             → node.json

apps/
└── web/                        → nextjs.json
```

## For Developers

For development guidance, see [CLAUDE.md](./CLAUDE.md).
