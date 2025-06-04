import Character from './Character.js';
import GameEnv from './PlatformerEngine/GameEnv.js';
import GameControl from './PlatformerEngine/GameControl.js';

export class Laser extends Character {
    constructor(data, gameEnv) {
        const canvas = document.getElementById('gameCanvas');
        const image = new window.Image();
        image.src = data.src;

        super(canvas, image, data);

        // Set width and height from data or image
        this.width = data.width || image.width || 100;
        this.height = data.height || image.height || 20;
        this.speed = data.speed || 2;
        this.x = data.x || 0;
        this.y = data.y || 0;
    }

    // Update uses modulo math to cycle to start at width extent
    update() {
        this.x = (this.x - this.speed) % this.width;
    }

    // Draws are used to capture primary frame and wrap around to next frame
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        this.ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
    }

    // Background canvas is set to screen
    size() {
        this.canvas.width = this.width * 2;
        this.canvas.height = this.height;
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = `20px`;
        this.canvas.style.top = `${GameEnv.innerHeight * 0.25}px`; 
    }
}

export default Laser;