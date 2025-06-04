import GameEnv from './PlatformerEngine/GameEnv.js';
import GameObject from './GamePlatformerObject.js';

export class Platform extends GameObject {
    constructor(data, gameEnv) {
        const canvas = document.getElementById('gameCanvas');
        const image = new window.Image();
        image.src = data.src;

        super(canvas, image, data);

        // Optionally set width/height from data if provided
        this.width = data.width || image.width;
        this.height = data.height || image.height;
        this.speed = data.speed || 1;
        this.x = data.x || 0;
        this.y = data.y || 0;
    }

    // Update uses modulo math to cycle to start at width extent
    update() {
        this.x = (this.x - this.speed) % this.width;
    }

    // Draws are used to capture primary frame and wrap around to next frame
    draw() {
        this.ctx.drawImage(this.image, this.x, this.y);
        this.ctx.drawImage(this.image, this.x + this.width, this.y);
    }

    // Background canvas is set to screen
    size() {
        // Update canvas size
        const scaledHeight = GameEnv.backgroundHeight / 6;

        const canvasWidth = GameEnv.innerWidth;
        const canvasLeft = 0;
        GameEnv.platformHeight = scaledHeight;
    
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.width = `${canvasWidth}px`;
        this.canvas.style.height = `${GameEnv.platformHeight}px`;
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = `${canvasLeft}px`;
        this.canvas.style.top = `${GameEnv.bottom}px`; 
    }
}

export default Platform;