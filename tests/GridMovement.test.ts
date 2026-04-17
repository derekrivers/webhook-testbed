import { describe, expect, it } from "vitest";
import {
  finishGridMove,
  getTargetTile,
  queueDirection,
  toWorldPosition,
  tryStartGridMove,
} from "../src/systems/GridMovement";

describe("GridMovement", () => {
  it("computes the next tile for a direction", () => {
    expect(getTargetTile({ x: 4, y: 5 }, "left")).toEqual({ x: 3, y: 5 });
    expect(getTargetTile({ x: 4, y: 5 }, "up")).toEqual({ x: 4, y: 4 });
  });

  it("converts a tile to centered world coordinates", () => {
    expect(toWorldPosition({ x: 2, y: 3 }, 16)).toEqual({ x: 40, y: 56 });
  });

  it("starts a successful move into an open tile", () => {
    const result = tryStartGridMove(
      { position: { x: 2, y: 2 }, facing: "down", isMoving: false },
      "right",
      { width: 20, height: 12 },
      () => false
    );

    expect(result.blocked).toBe(false);
    expect(result.moveTo).toEqual({ x: 3, y: 2 });
    expect(result.nextState).toEqual({
      position: { x: 3, y: 2 },
      facing: "right",
      isMoving: true,
      queuedDirection: undefined,
    });
  });

  it("rejects a blocked move without changing tile position", () => {
    const result = tryStartGridMove(
      { position: { x: 2, y: 2 }, facing: "down", isMoving: false },
      "up",
      { width: 20, height: 12 },
      (position) => position.x === 2 && position.y === 1
    );

    expect(result.blocked).toBe(true);
    expect(result.moveTo).toBeUndefined();
    expect(result.nextState.position).toEqual({ x: 2, y: 2 });
    expect(result.nextState.facing).toBe("up");
  });

  it("queues the next direction while a move is already in progress", () => {
    const movingState = {
      position: { x: 2, y: 2 },
      facing: "down" as const,
      isMoving: true,
    };

    expect(queueDirection(movingState, "left").queuedDirection).toBe("left");

    const result = tryStartGridMove(movingState, "left", { width: 20, height: 12 }, () => false);
    expect(result.blocked).toBe(false);
    expect(result.moveTo).toBeUndefined();
    expect(result.nextState.queuedDirection).toBe("left");
    expect(finishGridMove(result.nextState).isMoving).toBe(false);
  });
});
