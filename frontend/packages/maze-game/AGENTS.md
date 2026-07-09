# Template Package

Starter template for new packages in this workspace. Copy this directory and update the following:

1. **`package.json`** — rename `@parkerstovall.com/template` and bump version to `1.0.0`
2. **`src/index.ts`** — export your public API
3. **`src/dev.ts`** — wire up manual dev testing (loaded by `index.html`)
4. **`vite.config.ts`** — add plugins or externals as needed (e.g. `react`, `phaser`)

## What to Copy
- `index.html` is ready for local dev mode and already points at `src/dev.ts`.
- Use this package as the starting point for new workspace libraries or browser demos.

## Dev

```bash
pnpm dev
```

## Build

```bash
pnpm build
```

## Test

```bash
pnpm test
```
