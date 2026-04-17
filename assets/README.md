# Game assets

This directory contains checked-in art and map data for the first playable farm slice.

## Layout

- `maps/` contains the farm TMJ map and source notes.
- `tilesets/` contains imported Sprout Lands environment tilesets.
- `sprites/` contains the imported player spritesheet.
- `LICENSE` records the source pack, license constraints, and required credit.

## Source and credit

The imported art comes from the free Sprout Lands Basic pack by Cup Nooble.
A public mirror was used to fetch the exact free-pack files for this task, while the original asset page remains the canonical source:

- Original pack: https://cupnooble.itch.io/sprout-lands-asset-pack
- Mirror used for file retrieval: https://github.com/perquis/sprout_lands
- Credit: Cup Nooble

## Editing the map

Open `assets/maps/farm.tmj` directly in Tiled. The TMJ file stores relative paths to the checked-in tileset PNGs, so it can be reopened and resaved without extra setup.
