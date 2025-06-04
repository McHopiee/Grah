import GameEnv from './GameEnv.js';
import GamePlatformerObject from './GamePlatformerObject.js';

export class SpawnPlatform extends GamePlatformerObject {
    constructor(data, gameEnv) {
        const canvas = document.getElementById('gameCanvas');
        const image = new window.Image();
        image.src = data.src;

        // Use xPercentage and yPercentage from data if present, else default to 0
        const xPercentage = data.xPercentage ?? 0;
        const yPercentage = data.yPercentage ?? 0;

        super(canvas, image, data);

        this.platformX = xPercentage * GameEnv.innerWidth;
        this.platformY = yPercentage;
        this.direction = 1;
        this.speed = 1;
        this.minBottom = 150; // Minimum bottom position for the platform
        this.maxBottom = 300; // Maximum bottom position for the platform

        // Add glow effect
        this.canvas.style.boxShadow = "0 0 10px 5px rgba(0, 255, 255, 0.7)";
    }

    update() {
        // Only show platform if destroyedChocoFrog is true
        this.canvas.style.visibility = GameEnv.destroyedChocoFrog ? 'visible' : 'hidden';
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
    }

    size() {
        // Formula for Height should be on constant ratio, using a proportion of 832
        const scaledHeight = GameEnv.innerWidth * (1/27);
        const scaledWidth = scaledHeight;
        const platformX = this.platformX;
        const platformY = (GameEnv.bottom - scaledHeight) * this.platformY;
        // set variables used in Display and Collision algorithms
        this.bottom = platformY;
        this.collisionHeight = scaledHeight;
        this.collisionWidth = scaledWidth;
        this.canvas.style.width = `${scaledWidth}px`;
        this.canvas.style.height = `${scaledHeight}px`;
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = `${platformX}px`;
        this.canvas.style.top = `${platformY}px`;
    }
}

export default SpawnPlatform;