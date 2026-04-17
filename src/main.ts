import Phaser from "phaser";
import { gameConfig } from "./game/config";
import "./styles.css";

const game = new Phaser.Game(gameConfig);

window.addEventListener("beforeunload", () => {
  game.destroy(true);
});
