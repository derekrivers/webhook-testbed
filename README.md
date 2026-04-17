# webhook-testbed

A Vite + TypeScript + Phaser 3 starter for the farm-game prototype work in this repository.

## Prerequisites

- Node.js 18 or newer
- npm 9 or newer

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

## Available scripts

- `npm run dev` starts the Vite development server.
- `npm run build` runs a TypeScript no-emit check and creates a production build with Vite.
- `npm run lint` checks the TypeScript codebase with ESLint.
- `npm run format` formats the repository with Prettier.
- `npm run format:check` verifies formatting without changing files.
- `npm run test` runs the Vitest test suite once.
- `npm run typecheck` runs the standalone TypeScript type check.

## Developer workflow

A typical local workflow looks like this:

1. Run `npm install` after cloning or when dependencies change.
2. Use `npm run dev` while iterating on game code in `src/`.
3. Before opening a change for review, run:
   ```bash
   npm run lint
   npm run format:check
   npm run test
   npm run typecheck
   npm run build
   ```
4. If formatting fails, run `npm run format`, then re-run the checks.

## What is included

- Vite app bootstrap with TypeScript entrypoints under `src/`
- Strict TypeScript compiler settings
- Phaser game bootstrapping from `src/main.ts`
- Shared constants and game config modules for later farm-scene expansion
- A trivial Vitest unit test under `tests/` to validate the test harness
- A visible placeholder `HelloFarmScene` so a clean clone shows working game output quickly

## Next steps

Later tickets can add gameplay systems, asset loading, additional scenes, and fuller project documentation.
