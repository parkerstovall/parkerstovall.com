# Project Guidelines

## Code Style
- Use TypeScript and preserve package formatting conventions (single quotes, no semicolons, trailing commas).
- Keep types and shared constants centralized in `src/types.ts` and `src/shared.ts`.

## Architecture
- Public API exports from `src/index.ts`.
- Core generator flow is in `src/map-generator.ts` with helpers in `src/map-builder*.ts`.
- Input options are validated via Zod in `src/options.ts` before generation runs.

## Build and Test
- From `frontend/`:
  - `pnpm --filter @parkerstovall.com/pac-man-map-generator build`
  - `pnpm --filter @parkerstovall.com/pac-man-map-generator lint`
  - `pnpm --filter @parkerstovall.com/pac-man-map-generator patch`
  - `pnpm --filter @parkerstovall.com/pac-man-map-generator minor`
  - `pnpm --filter @parkerstovall.com/pac-man-map-generator major`
- No test script is currently defined.

## Project Conventions
- Keep deterministic option handling and validation paths intact in `src/options.ts`.
- Preserve map generation constraints and symmetry logic used by `src/map-generator.ts`.
- Build stays in Vite library mode with type declarations (`vite.config.ts`).

## Integration Points
- Consumed by `@parkerstovall.com/pac-man`.
- Exposes pure generation logic used in browser game runtime.

## Security
- Treat option validation as a safety boundary; do not bypass Zod validation for external inputs.
