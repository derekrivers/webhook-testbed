import Phaser from "phaser";
import { FONT_FAMILY, GAME_HEIGHT, GAME_WIDTH } from "../config/constants";
import { Player } from "../game/Player";
import {
  finishGridMove,
  type GridDirection,
  type GridMoveState,
  type GridPosition,
  GRID_STEP_MS,
  toWorldPosition,
  tryStartGridMove,
} from "../systems/GridMovement";
import {
  createInteractableRegistry,
  createInteractionKey,
  getFacingTile,
  objectToTilePosition,
  type InteractableEntry,
} from "../systems/interaction";

const MAP_KEY = "farm-map";
const GRASS_TILESET_KEY = "farm-tiles-grass";
const FENCE_TILESET_KEY = "farm-tiles-fences";
const WATER_TILESET_KEY = "farm-tiles-water";
const PLAYER_SPRITESHEET_KEY = "farm-player";
const DEFAULT_PLAYER_TILE: GridPosition = { x: 2, y: 2 };

export class HelloFarmScene extends Phaser.Scene {
  private player?: Player;
  private collisionLayer?: Phaser.Tilemaps.TilemapLayer;
  private movementState: GridMoveState = {
    position: DEFAULT_PLAYER_TILE,
    facing: "down",
    isMoving: false,
  };
  private movementKeys?: Record<string, Phaser.Input.Keyboard.Key>;
  private interactKey?: Phaser.Input.Keyboard.Key;
  private interactables = new Map<string, InteractableEntry>();

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

    this.collisionLayer = map.createLayer("Collision", tilesets) ?? undefined;
    this.collisionLayer?.setVisible(false);
    this.collisionLayer?.setCollisionByExclusion([-1, 0]);

    Player.createAnimations(this, PLAYER_SPRITESHEET_KEY);

    const spawnTile = this.findOpenSpawnTile(map);
    const spawnPosition = toWorldPosition(spawnTile, map.tileWidth, map.tileHeight);

    this.movementState = {
      position: spawnTile,
      facing: "down",
      isMoving: false,
    };

    this.player = new Player(this, spawnPosition.x, spawnPosition.y, PLAYER_SPRITESHEET_KEY);
    this.player.face(this.movementState.facing);

    this.movementKeys = this.input.keyboard?.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      d: Phaser.Input.Keyboard.KeyCodes.D,
    }) as Record<string, Phaser.Input.Keyboard.Key> | undefined;
    this.interactKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    const interactableObjects = map.getObjectLayer("Interactables")?.objects ?? [];
    const sign = interactableObjects[0];
    const prompt = sign?.properties?.find(
      (property: { name: string; value: unknown }) => property.name === "prompt"
    )?.value;

    this.interactables = createInteractableRegistry(
      interactableObjects
        .filter((object) => object.type === "sign")
        .map((object) => ({
          position: objectToTilePosition(object, map.tileWidth, map.tileHeight),
          interact: () => {
            const name = object.name || "interactable";
            globalThis.console.log(
              `[interaction] ${name}: Farm sign says hello from the playable slice.`
            );
          },
        }))
    );

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
      .text(8, GAME_HEIGHT - 24, typeof prompt === "string" ? `Move with arrows/WASD, press E to interact. ${prompt}` : "Move with arrows/WASD, press E to interact.", {
        color: "#16351a",
        fontFamily: FONT_FAMILY,
        fontSize: "10px",
        wordWrap: { width: GAME_WIDTH - 16 },
      })
      .setScrollFactor(0)
      .setDepth(3);

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player, true);
    this.cameras.main.roundPixels = true;
  }

  update(): void {
    if (this.interactKey && Phaser.Input.Keyboard.JustDown(this.interactKey)) {
      this.tryInteract();
    }

    const direction = this.getJustPressedDirection();
    if (direction) {
      this.handleMoveRequest(direction);
    }
  }

  private getJustPressedDirection(): GridDirection | undefined {
    const keys = this.movementKeys;
    if (!keys) {
      return undefined;
    }

    const justPressed = (...inputKeys: Array<Phaser.Input.Keyboard.Key | undefined>): boolean => {
      for (const key of inputKeys) {
        if (key && Phaser.Input.Keyboard.JustDown(key)) {
          return true;
        }
      }

      return false;
    };

    if (justPressed(keys.left, keys.a)) {
      return "left";
    }
    if (justPressed(keys.right, keys.d)) {
      return "right";
    }
    if (justPressed(keys.up, keys.w)) {
      return "up";
    }
    if (justPressed(keys.down, keys.s)) {
      return "down";
    }

    return undefined;
  }

  private handleMoveRequest(direction: GridDirection): void {
    const player = this.player;
    const collisionLayer = this.collisionLayer;

    if (!player || !collisionLayer) {
      return;
    }

    const result = tryStartGridMove(
      this.movementState,
      direction,
      { width: collisionLayer.layer.width, height: collisionLayer.layer.height },
      (position) => collisionLayer.hasTileAt(position.x, position.y)
    );

    this.movementState = result.nextState;

    if (!result.moveTo) {
      player.face(this.movementState.facing);
      return;
    }

    const targetPosition = toWorldPosition(result.moveTo, collisionLayer.tilemap.tileWidth, collisionLayer.tilemap.tileHeight);
    player.walk(this.movementState.facing);

    this.tweens.add({
      targets: player,
      x: targetPosition.x,
      y: targetPosition.y,
      duration: GRID_STEP_MS,
      ease: "Sine.Out",
      onComplete: () => {
        this.movementState = finishGridMove(this.movementState);
        player.face(this.movementState.facing);

        const queuedDirection = this.movementState.queuedDirection;
        if (queuedDirection) {
          this.movementState = { ...this.movementState, queuedDirection: undefined };
          this.handleMoveRequest(queuedDirection);
        }
      },
    });
  }

  private tryInteract(): void {
    const interactionTile = getFacingTile(this.movementState.position, this.movementState.facing);
    const interactable = this.interactables.get(createInteractionKey(interactionTile));
    interactable?.interact();
  }

  private findOpenSpawnTile(map: Phaser.Tilemaps.Tilemap): GridPosition {
    const fallback = DEFAULT_PLAYER_TILE;
    const collisionLayer = map.getLayer("Collision")?.tilemapLayer;

    if (!collisionLayer) {
      return fallback;
    }

    if (!collisionLayer.hasTileAt(fallback.x, fallback.y)) {
      return fallback;
    }

    for (let y = 0; y < map.height; y += 1) {
      for (let x = 0; x < map.width; x += 1) {
        if (!collisionLayer.hasTileAt(x, y)) {
          return { x, y };
        }
      }
    }

    return fallback;
  }
}
