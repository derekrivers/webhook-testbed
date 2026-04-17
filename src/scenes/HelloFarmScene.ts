import Phaser from "phaser";
import {
  FONT_FAMILY,
  GAME_HEIGHT,
  GAME_WIDTH,
  TILE_SIZE,
} from "../config/constants";

export class HelloFarmScene extends Phaser.Scene {
  constructor() {
    super("hello-farm");
  }

  create(): void {
    const centerX = GAME_WIDTH / 2;
    const centerY = GAME_HEIGHT / 2;

    this.add.rectangle(centerX, centerY, GAME_WIDTH, GAME_HEIGHT, 0x87c97f);
    this.add.rectangle(centerX, centerY + TILE_SIZE * 2, TILE_SIZE * 10, TILE_SIZE * 4, 0x8b5a2b);
    this.add.rectangle(centerX, centerY + TILE_SIZE, TILE_SIZE * 8, TILE_SIZE * 3, 0x6ea64f);
    this.add.circle(centerX - TILE_SIZE * 4, centerY - TILE_SIZE * 2, TILE_SIZE, 0xf9d65c);

    this.add
      .text(centerX, centerY - TILE_SIZE * 4, "Hello Farm", {
        color: "#16351a",
        fontFamily: FONT_FAMILY,
        fontSize: "18px",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(centerX, centerY + TILE_SIZE * 5, "Phaser + Vite + TypeScript", {
        color: "#16351a",
        fontFamily: FONT_FAMILY,
        fontSize: "10px",
      })
      .setOrigin(0.5);
  }
}
