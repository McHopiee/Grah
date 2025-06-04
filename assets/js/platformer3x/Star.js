import GameEnv from './GameEnv.js';
import GamePlatformerObject from './GamePlatformerObject.js';

export class Star extends GamePlatformerObject {
    constructor(data, gameEnv) {
        const canvas = document.getElementById('gameCanvas');
        const image = new window.Image();
        image.src = data.src;

        // Use xPercentage and yPercentage from data if present, else default to 0.5
        const xPercentage = data.xPercentage ?? 0.5;
        const yPercentage = data.yPercentage ?? 0.5;

        super(canvas, image, data, xPercentage, yPercentage);
        this.starX = xPercentage * GameEnv.innerWidth;
        this.starY = yPercentage;
        this.size();
    }

    // Required, but no update action
    update() {
        this.collisionChecks()
    }

    // Draw position is always 0,0
    draw() {
        // Save the current transformation matrix
        this.ctx.save();

        // Rotate the canvas 90 degrees to the left
        this.ctx.rotate(-Math.PI / 2);

        // Draw the image at the rotated position (swap x and y)
        this.ctx.drawImage(this.image, -this.image.height, 0);

        // Restore the original transformation matrix
        this.ctx.restore();
    }

    // Center and set Coin position with adjustable height and width
    size() {
        const scaledWidth = this.image.width * 0.2;
        const scaledHeight = this.image.height * 0.2;

        const starX = this.starX;
        const starY = (GameEnv.bottom - scaledHeight) * this.starY;

        // Set variables used in Display and Collision algorithms
        this.bottom = starY;
        this.collisionHeight = scaledHeight;
        this.collisionWidth = scaledWidth;

        this.canvas.style.width = `${scaledWidth}px`;
        this.canvas.style.height = `${scaledHeight}px`;
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = `${starX}px`;
        this.canvas.style.top = `${starY}px`;
    }
    collisionAction() {
        // check player collision
        if (this.collisionData.touchPoints.other.id === "player") {
            this.destroy();
            GameEnv.playSound("coin");
        }
    }
    
    // Method to hide the coin
    hide() {
        this.canvas.style.display = 'none';
    }

    // Method to show the coin
    show() {
        this.canvas.style.display = 'block';
    }
}

export default Star;