import Phaser from "phaser";
import { FONT_FAMILY, GAME_HEIGHT, GAME_WIDTH } from "../config/constants";

const MAP_KEY = "farm-map";
const GRASS_TILESET_KEY = "farm-tiles-grass";
const FENCE_TILESET_KEY = "farm-tiles-fences";
const WATER_TILESET_KEY = "farm-tiles-water";
const PLAYER_SPRITESHEET_KEY = "farm-player";

export class HelloFarmScene extends Phaser.Scene {
  constructor() {
    super("hello-farm");
  }

  preload(): void {
    this.load.tilemapTiledJSON(MAP_KEY, "assets/maps/farm.tmj");
    this.load.image(GRASS_TILESET_KEY, "assets/tilesets/sprout-lands-grass.png");
    this.load.image(FENCE_TILESET_KEY, "assets/tilesets/sprout-lands-fences.png");
    this.load.image(WATER_TILESET_KEY, "assets/tilesets/sprout-lands-water.png");
    this.load.spritesheet(PLAYER_SPRITESHEET_KEY, "assets/sprites/sprout-lands-player.png", {
      frameWidth: 48,
      frameHeight: 48,
    });
  }

  create(): void {
    const map = this.make.tilemap({ key: MAP_KEY });
    const groundTiles = map.addTilesetImage("sprout-lands-grass", GRASS_TILESET_KEY);
    const fenceTiles = map.addTilesetImage("sprout-lands-fences", FENCE_TILESET_KEY);
    const waterTiles = map.addTilesetImage("sprout-lands-water", WATER_TILESET_KEY);
    const tilesets = [groundTiles, fenceTiles, waterTiles].filter(
      (tileset): tileset is Phaser.Tilemaps.Tileset => Boolean(tileset)
    );

    map.createLayer("Ground", tilesets);
    map.createLayer("Decor", tilesets);

    const collisionLayer = map.createLayer("Collision", tilesets);
    collisionLayer?.setVisible(false);
    collisionLayer?.setCollisionByExclusion([-1, 0]);

    const player = this.add.sprite(120, 96, PLAYER_SPRITESHEET_KEY, 0);
    player.setDepth(2);

    const interactables = map.getObjectLayer("Interactables");
    const sign = interactables?.objects[0];
    const prompt = sign?.properties?.find(
      (property: { name: string; value: unknown }) => property.name === "prompt"
    )?.value;

    this.add
      .text(8, 8, "Farm slice loaded", {
        color: "#16351a",
        fontFamily: FONT_FAMILY,
        fontSize: "12px",
        fontStyle: "bold",
      })
      .setScrollFactor(0)
      .setDepth(3);

    this.add
      .text(8, GAME_HEIGHT - 24, typeof prompt === "string" ? prompt : "Interactable hook ready.", {
        color: "#16351a",
        fontFamily: FONT_FAMILY,
        fontSize: "10px",
        wordWrap: { width: GAME_WIDTH - 16 },
      })
      .setScrollFactor(0)
      .setDepth(3);

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.centerOn(map.widthInPixels / 2, map.heightInPixels / 2);
  }
}
