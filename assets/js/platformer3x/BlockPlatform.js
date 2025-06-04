import GameEnv from './PlatformerEngine/GameEnv.js';
import GamePlatformerObject from './GamePlatformerObject.js';

export class BlockPlatform extends GamePlatformerObject {
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

        // Add glow effect
        this.canvas.style.boxShadow = "0 0 10px 5px rgba(0, 255, 255, 0.7)";
    }

    update() {
        // No update action needed, but method must exist
    }

    draw() {
        this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
    }

    size() {
        // Formula for Height should be on constant ratio, using a proportion of 832
        const scaledHeight = GameEnv.innerWidth * (1/27);
        const scaledWidth = scaledHeight;  // width of jump platform is 1/10 of height
        const platformX = this.platformX;
        const platformY = (GameEnv.bottom - scaledHeight) * this.platformY;
        // set variables used in Display and Collision algorithms
        this.bottom = platformY;
        this.collisionHeight = scaledHeight;
        this.collisionWidth = scaledWidth;
        //this.canvas.width = this.width;
        //this.canvas.height = this.height;
        this.canvas.style.width = `${scaledWidth}px`;
        this.canvas.style.height = `${scaledHeight}px`;
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = `${platformX}px`;
        this.canvas.style.top = `${platformY}px`;
    }
}

export default BlockPlatform;