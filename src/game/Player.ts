import Phaser from "phaser";
import type { GridDirection } from "../systems/GridMovement";

const DIRECTION_ROW: Record<GridDirection, number> = {
  down: 0,
  left: 1,
  right: 2,
  up: 3,
};

export class Player extends Phaser.GameObjects.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture, 0);
    scene.add.existing(this);
    this.setOrigin(0.5, 0.75);
    this.setDepth(2);
  }

  static createAnimations(scene: Phaser.Scene, texture: string): void {
    const animationManager = scene.anims;

    for (const [direction, row] of Object.entries(DIRECTION_ROW) as [GridDirection, number][]) {
      const start = row * 4;
      const idleKey = `player-idle-${direction}`;
      const walkKey = `player-walk-${direction}`;

      if (!animationManager.exists(idleKey)) {
        animationManager.create({
          key: idleKey,
          frames: [{ key: texture, frame: start }],
          frameRate: 1,
          repeat: -1,
        });
      }

      if (!animationManager.exists(walkKey)) {
        animationManager.create({
          key: walkKey,
          frames: animationManager.generateFrameNumbers(texture, {
            start,
            end: start + 3,
          }),
          frameRate: 10,
          repeat: -1,
        });
      }
    }
  }

  face(direction: GridDirection): void {
    this.play(`player-idle-${direction}`, true);
  }

  walk(direction: GridDirection): void {
    this.play(`player-walk-${direction}`, true);
  }
}
