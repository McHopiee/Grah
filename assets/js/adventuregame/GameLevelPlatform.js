import Background from './Background.js';
import Npc from './Npc.js';
import Player from './Player.js';
import GameControl from './GameControl.js';
import FallingBlock from './FallingBlock.js';

class GameLevelPlatform {
  constructor(gameEnv) {
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    this.gameObjects = [];

    // Background image data
    const image_src_plat = path + "/images/gamify/MCplat.png";
    const image_data_plat = {
      id: 'Platform',
      src: image_src_plat,
      pixels: { height: 320, width: 480 },
    };

    // Player data
    const sprite_src_player = path + "/images/gamify/steve.png";
    const PLAYER_SCALE_FACTOR = 5;
    const sprite_data_player = {
      id: 'Player',
      greeting: "I am Steve.",
      src: sprite_src_player,
      SCALE_FACTOR: PLAYER_SCALE_FACTOR,
      STEP_FACTOR: 500,
      ANIMATION_RATE: 50,
      INIT_POSITION: { x: 0, y: height - (height / PLAYER_SCALE_FACTOR) },
      pixels: { height: 1500, width: 600 },
      orientation: { rows: 4, columns: 3 },
      down: { row: 0, start: 0, columns: 3 },
      downRight: { row: 2, start: 0, columns: 3, rotate: Math.PI / 16 },
      downLeft: { row: 1, start: 0, columns: 3, rotate: -Math.PI / 16 },
      left: { row: 1, start: 0, columns: 3 },
      right: { row: 2, start: 0, columns: 3 },
      up: { row: 3, start: 0, columns: 3 },
      upLeft: { row: 1, start: 0, columns: 3, rotate: Math.PI / 16 },
      upRight: { row: 2, start: 0, columns: 3, rotate: -Math.PI / 16 },
      hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
      keypress: { up: 87, left: 65, down: 83, right: 68 } // W, A, S, D
    };

    // Create player
    this.player = new Player(sprite_data_player);
    this.gameObjects.push(this.player);

    // Create falling block
    this.fallingBlock = new FallingBlock({
      INIT_POSITION: { x: 200, y: 100 },
      pixels: { width: 50, height: 50 },
      SCALE_FACTOR: 1,
      gameHeight: height
    });
    this.gameObjects.push(this.fallingBlock);

    // Level classes (for engine use?)
    this.classes = [
      { class: Background, data: image_data_plat },
      { class: Player, data: sprite_data_player },
      { class: FallingBlock, data: image_data_plat }
    ];
  }

  update() {
    if (
      this.player &&
      this.player.INIT_POSITION.x > 180 &&
      !this.fallingBlock.isFalling
    ) {
      this.fallingBlock.triggerFall();
    }

    for (const obj of this.gameObjects) {
      if (typeof obj.updatePosition === 'function') {
        obj.updatePosition();
      }
    }
  }

  draw(ctx) {
    for (const obj of this.gameObjects) {
      ctx.fillStyle = 'gray';
      ctx.fillRect(
        obj.INIT_POSITION.x,
        obj.INIT_POSITION.y,
        obj.pixels.width,
        obj.pixels.height
      );
    }
  }
}

export default GameLevelPlatform;
