# webhook-testbed

A Vite + TypeScript + Phaser 3 prototype for a small top-down farm slice.

## Project overview

This repository currently ships a single playable scene centered on tile-based movement and map-driven interaction.

- Move one tile at a time with the arrow keys or `W`, `A`, `S`, `D`.
- The camera follows the player and stays clamped to the farm map bounds.
- Collision comes from the Tiled `Collision` layer, so blocked tiles are authored in the map instead of hard-coded in the scene.
- Press `E` to inspect the tile directly in front of the player based on their current facing direction.
- Interactions are resolved from the Tiled `Interactables` object layer. The current proof of concept is a sign that logs a message to the browser console.

The current gameplay lives in `src/scenes/HelloFarmScene.ts` and is configured through shared constants and helper systems rather than scene-local one-off logic.

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

- `npm run dev` starts the Vite development server for moment-to-moment gameplay iteration.
- `npm run build` runs a TypeScript no-emit check and creates a production build with Vite.
- `npm run lint` checks the TypeScript codebase with ESLint.
- `npm run format` formats the repository with Prettier.
- `npm run format:check` verifies formatting without changing files.
- `npm run test` runs the Vitest test suite once.
- `npm run typecheck` runs the standalone TypeScript type check.

## Developer workflow

A typical local workflow looks like this:

1. Run `npm install` after cloning or when dependencies change.
2. Use `npm run dev` while iterating on scene logic, systems, or map data.
3. Run `npm run test` and `npm run typecheck` during implementation when you want quick validation.
4. Before handing off a change, run the broader verification set:
   ```bash
   npm run lint
   npm run format:check
   npm run test
   npm run typecheck
   npm run build
   ```
5. If formatting fails, run `npm run format`, then re-run the checks.

## Project structure

- `src/main.ts` boots the Phaser application into the page.
- `src/game/config.ts` defines the Phaser game configuration, renderer settings, scene list, scaling, and post-boot canvas setup.
- `src/config/constants.ts` stores shared sizing, zoom, and UI constants.
- `src/scenes/` contains scene implementations, including the current playable slice in `HelloFarmScene.ts`.
- `src/systems/GridMovement.ts` owns tile-step movement rules, queueing, bounds checks, and world-position conversion.
- `src/systems/interaction.ts` converts Tiled objects into tile coordinates and resolves interactables by facing tile.
- `tests/` contains Vitest coverage for the project test harness and future gameplay/unit tests.
- `assets/` stores the checked-in Tiled map, tilesets, sprites, and asset licensing notes.

## Current playable slice

The playable slice is intentionally small, but the current implementation already demonstrates the core loop the rest of the prototype can build on:

- `HelloFarmScene` loads `assets/maps/farm.tmj` plus the Sprout Lands tilesets and player spritesheet.
- The player spawns on an open tile, faces the requested direction immediately, and moves in timed grid steps.
- Input buffering is supported through the grid movement state, so a new direction can be queued while a move tween is still finishing.
- The scene hides the collision layer visually, while still using it to block movement.
- A HUD-style text prompt reminds the player of the movement and interaction controls, and the map-authored prompt is appended when available.

## Editing the farm map

The current gameplay depends heavily on the Tiled map, so README-level map guidance is worth keeping close to the code:

- Open `assets/maps/farm.tmj` directly in Tiled.
- The map uses relative paths into `assets/tilesets/`, so the checked-in tilesets resolve without extra setup.
- The `Ground` and `Decor` layers control the visible farm layout.
- The `Collision` layer defines blocked tiles. Scene movement checks `hasTileAt(...)` on that layer to decide whether a move is valid.
- The `Interactables` object layer defines things the player can use with `E`.
- Interactable objects should stay aligned to the tile grid because the interaction system converts object coordinates into tile coordinates before building the registry.
- The current sample object is the `farm-sign` sign, which demonstrates the interaction flow and prompt text plumbing.

## Asset sourcing

The current playable slice uses art from the free Sprout Lands Basic pack by Cup Nooble.
See `assets/LICENSE` for source links, license notes, and required credit.

## Current limitations / next steps

This is still an early prototype. The repository does not yet include systems like inventory, farming actions, save data, dialogue UI, or multiple playable areas. The current codebase is best understood as a clean vertical slice for movement, map loading, camera behavior, and map-authored interaction rather than a complete game loop.
