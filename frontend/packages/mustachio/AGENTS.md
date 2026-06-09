# Project Guidelines

## Code Style
- Use TypeScript and preserve formatting from existing files (single quotes, no semicolons, trailing commas).
- Keep Phaser object naming and folder structure conventions under `src/objects`, `src/scenes`, and `src/levels`.

## Architecture
- Library entrypoint is `src/index.ts`, exporting `startMustachio` from `src/main.ts`.
- Core runtime is Phaser-based; scenes coordinate gameplay and UI (`src/scenes/*`).
- Mobile controls are handled by `src/MobileControls.ts` and game-side input mapping.

## Build and Test
- From `frontend/`:
  - `pnpm --filter @parkerstovall.com/mustachio dev`
  - `pnpm --filter @parkerstovall.com/mustachio build`
  - `pnpm --filter @parkerstovall.com/mustachio lint`
  - `pnpm --filter @parkerstovall.com/mustachio preview`
  - `pnpm --filter @parkerstovall.com/mustachio patch`
- No test script is currently defined.

## Local Dev
- `index.html` loads `src/dev.ts`, which mounts the game into `#app` for manual browser testing.

## Project Conventions
- Build is library mode via Vite (`vite.config.ts`) and emits `dist/index.js` + types.
- Keep `phaser` externalized in library builds and compatible with peer dependency range.
- Avoid changing public API shape in `src/index.ts` unless explicitly requested.

## Integration Points
- Consumed by app route `app/src/routes/games/mustachio.tsx`.
- Relies on `phaser` and browser APIs for rendering/input.

## Security
- Client-only package; no auth/secret handling paths in this package.
