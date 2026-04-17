import { describe, expect, it } from "vitest";

import { GAME_HEIGHT, GAME_WIDTH, TILE_SIZE } from "../src/config/constants";

describe("project constants", () => {
  it("derive the default game dimensions from the tile size", () => {
    expect(GAME_WIDTH).toBe(TILE_SIZE * 24);
    expect(GAME_HEIGHT).toBe(TILE_SIZE * 18);
  });
});
