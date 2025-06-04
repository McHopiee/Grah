import GameEnv from './PlatformerEngine/GameEnv.js';
import GameObject from './GamePlatformerObject.js';

export class MovingPlatform extends GameObject {
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
        this.direction = -1; // Move up
        this.speed = 0.5; // Reduced speed
        this.maxTop = 300;

        // Add glow effect
        this.canvas.style.boxShadow = "0 0 10px 5px rgba(0, 255, 255, 0.7)";
    }

    update() {
        if (GameEnv.destroyedMagicBeam === true) {     
            this.movePlatform();
        }
    }

    movePlatform() {
        // Use parseFloat to handle decimal positions
        let currentPosition = parseFloat(this.canvas.style.top) || 0;

        // Only move up if above maxTop, otherwise move down
        if (currentPosition <= this.maxTop) {
            this.direction = 1; // Move down
        } else if (currentPosition >= (GameEnv.bottom - (parseFloat(this.canvas.style.height) || 0))) {
            this.direction = -1; // Move up
        }

        // Move the platform
        this.canvas.style.top = (currentPosition + this.direction * this.speed) + 'px';
        this.draw();
    }

    // Draw position is always 0,0
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
    }

    // Set platform position
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

export default MovingPlatform;