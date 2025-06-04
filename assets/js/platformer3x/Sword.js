import GameEnv from "./PlatformerEngine/GameEnv.js";
import GamePlatformerObject from "./GamePlatformerObject.js";

export class Sword extends GamePlatformerObject {
  constructor(data, gameEnv) {
    const canvas = document.getElementById('gameCanvas');
    const image = new window.Image();
    image.src = data.src;

    super(canvas, image, data);
    this.isCollected = false;
  }

  update() {
    // No need to call super.update() unless you have logic there
    if (!this.isCollected && GameEnv.player && this.checkCollision(GameEnv.player)) {
      this.pickUp();
    }
  }

  /**
   * Checks for collision with the player.
   * @param {GamePlatformerObject} player - The player instance to check collision against.
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
    if (GameEnv.player) {
      GameEnv.player.hasSword = true;
    }
    this.hide();
    this.destroy();
  }

  hide() {
    if (this.canvas) {
      this.canvas.style.display = 'none';
    }
  }

  destroy() {
    // Remove sword from gameObjects list in GameEnv (or wherever you track game objects)
    const index = GameEnv.gameObjects.indexOf(this);
    if (index !== -1) {
      GameEnv.gameObjects.splice(index, 1);
    }
    // Remove canvas from DOM safely
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

export default Sword;
