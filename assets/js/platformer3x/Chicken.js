// Chicken.js

import GamePlatformerObject from './GamePlatformerObject.js';

class Chicken extends GamePlatformerObject {
  constructor(data, gameEnv) {
    // Create canvas and image as per new pattern
    const canvas = document.getElementById('gameCanvas');
    const image = new window.Image();
    image.src = data.src;

    super(canvas, image, data);

    this.frameWidth = data.frameWidth || data.width || 32;
    this.frameHeight = data.frameHeight || data.height || 32;
    this.scaleSize = data.scaleSize || 60;

    this.frameIndex = 0;
    this.frameTick = 0;
    this.frameTickMax = 10; // Animation speed

    // Check if there are animation frames
    this.frames = data.frames || 1;
  }

  update() {
    if (this.frames > 1) {
      this.frameTick++;
      if (this.frameTick >= this.frameTickMax) {
        this.frameTick = 0;
        this.frameIndex = (this.frameIndex + 1) % this.frames;
      }
    }
  }

  draw() {
    const scale = this.scaleSize / this.frameWidth;
    this.ctx.drawImage(
      this.image,
      this.frameIndex * this.frameWidth, 0,  // Source x, y in spritesheet
      this.frameWidth, this.frameHeight,     // Source width, height
      this.x, this.y,                        // Destination x, y
      this.frameWidth * scale, this.frameHeight * scale // Destination width, height
    );
  }
}

export default Chicken;
