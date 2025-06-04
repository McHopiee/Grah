import GameEnv from "./GameEnv.js";
import GameObject from "./GameObject.js";

export class Sword extends GameObject {
  constructor(canvas, image, data) {
    super(canvas, image, data);
    this.isCollected = false;
  }

  update() {
    super.update();

    if (!this.isCollected && this.checkCollision(GameEnv.player)) {
      this.pickUp();
    }
  }

  /**
   * Checks for collision with the player.
   * @param {GameObject} player - The player instance to check collision against.
   * @returns {boolean} True if colliding, false otherwise.
   */
  checkCollision(player) {
    return (
      this.x < player.x + player.width &&
      this.x + this.width > player.x &&
      this.y < player.y + player.height &&
      this.y + this.height > player.y
    );
  }

  /**
   * Handles logic when the sword is picked up by the player.
   */
  pickUp() {
    this.isCollected = true;
    GameEnv.player.hasSword = true;

    // You could remove the sword from the game world, hide it, or change its state.
    this.destroy();
  }

  destroy() {
    // Remove sword from gameObjects list in GameEnv (or wherever you track game objects)
    if (GameEnv.gameObjects.includes(this)) {
      const index = GameEnv.gameObjects.indexOf(this);
      GameEnv.gameObjects.splice(index, 1);
    }
    super.destroy();
  }
}

export default Sword;
