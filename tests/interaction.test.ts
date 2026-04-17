import { describe, expect, it, vi } from "vitest";
import {
  createInteractableRegistry,
  createInteractionKey,
  getFacingTile,
  objectToTilePosition,
} from "../src/systems/interaction";

describe("interaction helpers", () => {
  it("computes the tile in front of the player for each facing direction", () => {
    const position = { x: 5, y: 6 };

    expect(getFacingTile(position, "up")).toEqual({ x: 5, y: 5 });
    expect(getFacingTile(position, "down")).toEqual({ x: 5, y: 7 });
    expect(getFacingTile(position, "left")).toEqual({ x: 4, y: 6 });
    expect(getFacingTile(position, "right")).toEqual({ x: 6, y: 6 });
  });

  it("maps tiled object coordinates onto a grid tile", () => {
    expect(
      objectToTilePosition(
        { x: 176, y: 112, width: 16, height: 16 } as never,
        16,
        16
      )
    ).toEqual({ x: 11, y: 6 });
  });

  it("registers and resolves interactables by tile key", () => {
    const interact = vi.fn();
    const registry = createInteractableRegistry([{ position: { x: 11, y: 6 }, interact }]);

    registry.get(createInteractionKey({ x: 11, y: 6 }))?.interact();
    registry.get(createInteractionKey({ x: 0, y: 0 }))?.interact();

    expect(interact).toHaveBeenCalledTimes(1);
  });
});
