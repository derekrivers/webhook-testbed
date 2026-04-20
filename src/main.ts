import Phaser from "phaser";
import { gameConfig } from "./game/config";
import "./styles.css";

const gameContainer = globalThis.document?.getElementById("game");
const game = gameContainer ? new Phaser.Game(gameConfig) : null;

window.addEventListener("beforeunload", () => {
  game?.destroy(true);
});
