import Phaser from "phaser";
import {
  BACKGROUND_COLOR,
  CAMERA_ZOOM,
  GAME_HEIGHT,
  GAME_WIDTH,
} from "../config/constants";
import { BootScene } from "../scenes/BootScene";
import { HelloFarmScene } from "../scenes/HelloFarmScene";

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: "game",
  backgroundColor: BACKGROUND_COLOR,
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, HelloFarmScene],
  render: {
    antialias: false,
    pixelArt: true,
    roundPixels: true,
  },
  callbacks: {
    postBoot: (game) => {
      game.canvas.setAttribute("aria-label", "Hello Farm game canvas");
      game.canvas.style.imageRendering = "pixelated";
      game.scene.getScenes(true).forEach((scene) => {
        scene.cameras.main.setZoom(CAMERA_ZOOM);
      });
    },
  },
};
