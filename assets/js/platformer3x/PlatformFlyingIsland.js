import GamePlatformerObject from './GamePlatformerObject.js';
import GameEnv from './PlatformerEngine/GameEnv.js';
import GameControl from './PlatformerEngine/GameControl.js';
import BlockPlatform from './BlockPlatform.js';

export class FlyingIsland extends BlockPlatform {
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
    }

    update() {
        // Add any custom update logic here if needed
        // Otherwise, just call parent update (which may be empty)
        if (super.update) super.update();
    }

    draw() {
        if (super.draw) super.draw();
    }

    size() {
        // Use a constant ratio for scaling, or fallback to parent logic if needed
        const scaledHeight = GameEnv.innerWidth * (1/27) * 0.75;
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

export default FlyingIsland;