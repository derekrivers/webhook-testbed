import type Phaser from "phaser";

export type FacingDirection = "up" | "down" | "left" | "right";

export interface TilePosition {
  x: number;
  y: number;
}

export interface InteractableEntry {
  position: TilePosition;
  interact: () => void;
}

export function getFacingTile(position: TilePosition, facing: FacingDirection): TilePosition {
  switch (facing) {
    case "up":
      return { x: position.x, y: position.y - 1 };
    case "down":
      return { x: position.x, y: position.y + 1 };
    case "left":
      return { x: position.x - 1, y: position.y };
    case "right":
      return { x: position.x + 1, y: position.y };
  }
}

export function createInteractionKey(position: TilePosition): string {
  return `${position.x},${position.y}`;
}

export function objectToTilePosition(
  object: Phaser.Types.Tilemaps.TiledObject,
  tileWidth: number,
  tileHeight: number
): TilePosition {
  const x = object.x ?? 0;
  const y = object.y ?? 0;

  return {
    x: Math.floor(x / tileWidth),
    y: Math.floor((y - (object.height ?? tileHeight)) / tileHeight),
  };
}

export function createInteractableRegistry(entries: InteractableEntry[]): Map<string, InteractableEntry> {
  return new Map(entries.map((entry) => [createInteractionKey(entry.position), entry]));
}
