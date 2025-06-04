import GameEnv from './GameEnv.js';
import GamePlatformerObject from './GamePlatformerObject.js';

export class PlatformFilter extends GamePlatformerObject {
    constructor(data, gameEnv) {
        const canvas = document.getElementById('gameCanvas');
        const image = new window.Image();
        image.src = data.src;

        // Extract extra parameters from data if needed
        const xPercentage = data.xPercentage ?? 0;
        const yPercentage = data.yPercentage ?? 0;
        const name = data.name ?? "PlatformFilter";

        super(canvas, image, data);

        this.platformX = xPercentage * GameEnv.innerWidth;
        this.platformY = yPercentage;
        this.data = data;
        this.name = name;
        this.relativeX = ""; // used for the item block's spritesheet.

        // Example filter (you can combine as needed)
        this.canvas.style.filter = 'hue-rotate(90deg)';
    }

    update() {
        // If you want to change the filter dynamically, do it here
        this.changeAppearance();
    }

    changeAppearance() {
        // Example: change filter dynamically if needed
        // You can make this dynamic based on game state if desired
        this.canvas.style.filter = 'hue-rotate(90deg)';
    }

    // set platform position
    size() {
        const scaledHeight = GameEnv.innerWidth * (1/27);
        const scaledWidth = scaledHeight;
        const platformX = this.platformX;
        const platformY = (GameEnv.bottom - scaledHeight) * this.platformY;
        this.bottom = platformY;
        this.collisionHeight = scaledHeight;
        this.collisionWidth = scaledWidth;
        this.canvas.style.width = `${scaledWidth}px`;
        this.canvas.style.height = `${scaledHeight}px`;
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = `${platformX}px`;
        this.canvas.style.top = `${platformY}px`;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
    }
}

export default PlatformFilter;

