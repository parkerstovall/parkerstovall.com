# parker-stovall.com

Personal site and game portfolio. Built as a pnpm monorepo orchestrated by Turborepo.

---

## Packages

| Package | Description |
|---|---|
| `app` | React frontend — TanStack Router, hosts the games |
| `mustachio` | Phaser side-scroller game |
| `pac-man` | Phaser Pac-Man clone |
| `pac-man-map-generator` | Procedural maze generator used by the Pac-Man package |
| `template` | Starter package for new workspace packages |

---

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 11+

---

## Setup

```bash
pnpm install
```

---

## Development

Run the app in dev mode:

```bash
cd frontend
pnpm dev
```

Run a specific package in dev mode:

```bash
pnpm --filter @parkerstovall.com/mustachio dev
```

Each package includes its own `index.html` and `dev` script so you can run it directly from that package directory or through `pnpm --filter`.

Common examples:

```bash
pnpm --filter @parkerstovall.com/pac-man dev
pnpm --filter @parkerstovall.com/pac-man-map-generator dev
pnpm --filter @parkerstovall.com/template dev
```

---

## Building

Build all packages:

```bash
cd frontend
pnpm build
```

Turbo caches build artifacts — subsequent builds only recompile changed packages.

---

## Testing

Run the full test suite:

```bash
cd frontend
pnpm test
```

Run tests for a single package:

```bash
pnpm --filter @parkerstovall.com/pac-man-map-generator test
```

Tests are written with [Vitest](https://vitest.dev/). Each test file imports its globals explicitly from `vitest` — no ambient globals.

---

## Linting

```bash
cd frontend
pnpm lint
```

---

## Project Structure

```
frontend/
  app/                        # React app (TanStack Router)
  packages/
    mustachio/                # Phaser side-scroller
    pac-man/                  # Phaser Pac-Man clone
    pac-man-map-generator/    # Procedural maze generator
    template/                 # Starter package for new workspaces
  turbo.json                  # Turborepo task graph
  pnpm-workspace.yaml
```
