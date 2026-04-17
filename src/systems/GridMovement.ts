export type GridDirection = "up" | "down" | "left" | "right";

export interface GridPosition {
  x: number;
  y: number;
}

export interface GridBounds {
  width: number;
  height: number;
}

export interface GridMoveState {
  position: GridPosition;
  facing: GridDirection;
  isMoving: boolean;
  queuedDirection?: GridDirection;
}

export interface GridMoveResult {
  nextState: GridMoveState;
  moveTo?: GridPosition;
  blocked: boolean;
}

export const GRID_STEP_MS = 180;

const DIRECTION_VECTORS: Record<GridDirection, GridPosition> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export function getTargetTile(position: GridPosition, direction: GridDirection): GridPosition {
  const vector = DIRECTION_VECTORS[direction];
  return {
    x: position.x + vector.x,
    y: position.y + vector.y,
  };
}

export function isWithinBounds(position: GridPosition, bounds: GridBounds): boolean {
  return position.x >= 0 && position.y >= 0 && position.x < bounds.width && position.y < bounds.height;
}

export function toWorldPosition(position: GridPosition, tileWidth: number, tileHeight = tileWidth): GridPosition {
  return {
    x: position.x * tileWidth + tileWidth / 2,
    y: position.y * tileHeight + tileHeight / 2,
  };
}

export function queueDirection(state: GridMoveState, direction: GridDirection): GridMoveState {
  return {
    ...state,
    facing: direction,
    queuedDirection: direction,
  };
}

export function tryStartGridMove(
  state: GridMoveState,
  direction: GridDirection,
  bounds: GridBounds,
  isBlocked: (position: GridPosition) => boolean
): GridMoveResult {
  if (state.isMoving) {
    return {
      nextState: queueDirection(state, direction),
      blocked: false,
    };
  }

  const target = getTargetTile(state.position, direction);
  const blocked = !isWithinBounds(target, bounds) || isBlocked(target);

  if (blocked) {
    return {
      nextState: {
        ...state,
        facing: direction,
        queuedDirection: undefined,
      },
      blocked: true,
    };
  }

  return {
    nextState: {
      position: target,
      facing: direction,
      isMoving: true,
      queuedDirection: undefined,
    },
    moveTo: target,
    blocked: false,
  };
}

export function finishGridMove(state: GridMoveState): GridMoveState {
  return {
    ...state,
    isMoving: false,
  };
}
