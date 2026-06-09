# Project Guidelines

## Code Style
- Use TypeScript/TSX with existing formatting conventions (single quotes, no semicolons, trailing commas).
- Maintain current split between React wrapper (`src/pac-man.tsx`) and Phaser scene logic (`src/game/**`).

## Architecture
- Package exports `PacMan` from `src/index.ts`.
- `PacMan` component owns Phaser lifecycle (create on mount, destroy on unmount).
- Game scene setup lives under `src/game/_scenes`, with sprite/ui helpers under `src/game/sprites` and `src/game/ui`.

## Build and Test
- From `frontend/`:
  - `pnpm --filter @parkerstovall.com/pac-man dev`
  - `pnpm --filter @parkerstovall.com/pac-man build`
  - `pnpm --filter @parkerstovall.com/pac-man lint`
  - `pnpm --filter @parkerstovall.com/pac-man patch`
- Run tests with: `pnpm --filter @parkerstovall.com/pac-man test`.

## Local Dev
- `index.html` loads `src/dev.tsx`, which renders the `PacMan` component into `#app` for manual browser testing.

## Project Conventions
- Keep Vite library build outputs and type generation behavior from `vite.config.ts`.
- Preserve externalized dependencies (`react`, `react-dom`, `phaser`) in rollup options.
- Avoid changing exported component contract unless the app integration is updated together.

## Integration Points
- Consumed by `app/src/routes/games/pac-man.tsx`.
- Uses `@parkerstovall.com/pac-man-map-generator` to generate map layout data.

## Security
- Client-side runtime only; no authentication or secret-management logic in this package.
