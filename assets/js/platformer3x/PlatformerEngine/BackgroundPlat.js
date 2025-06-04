// BackgroundPlat.js
import GameEnv from './GameEnv.js';
import GamePlatformerObject from '../GamePlatformerObject.js';
import GameControl from './GameControl.js';

class BackgroundPlat extends GamePlatformerObject {
    constructor(data, gameEnv) {
        // Get canvas and image from DOM and data
        const canvas = document.getElementById('gameCanvas');
        const image = new window.Image();
        image.src = data.src;

        super(canvas, image, data);

        if (isNaN(GameEnv.innerWidth) || isNaN(GameEnv.innerHeight)) {
            GameEnv.initialize();
        }

        this.canvasWidth = GameEnv.innerWidth;

        if (this.canvasWidth > GameEnv.innerHeight) {
            this.canvasHeight = GameEnv.innerHeight * 0.7;
        } else {
            this.canvasHeight = this.canvasWidth / (16 / 9);
        }

        // Set default width/height if not provided by image
        this.width = data.width || image.width || this.canvasWidth;
        this.height = data.height || image.height || this.canvasHeight;

        this.x = 0;
        this.y = 0;

        console.log(`width:${this.canvasWidth}, height:${this.canvasHeight}`);
    }

    update() {
        this.x = (this.x - (this.speed || 1)) % this.width;

        if (GameControl.randomEventId === 1 && GameControl.randomEventState === 1) {
            this.canvas.style.filter = "invert(100)";
            GameControl.endRandomEvent();
        }
    }

    draw() {
        const canvasWidth = this.canvasWidth;
        let xWrapped = this.x % this.width;
        if (xWrapped > 0) {
            xWrapped -= this.width;
        }

        let numDraws = Math.ceil(canvasWidth / this.width) + 1;

        for (let i = 0; i < numDraws; i++) {
            this.ctx.drawImage(
                this.image,
                0, 0,
                this.width, this.height,
                xWrapped + i * this.width, 0,
                this.width, this.height
            );
        }
    }

    size() {
        const canvasLeft = 0;
        GameEnv.backgroundHeight = this.canvasHeight;

        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.width = `${this.canvasWidth}px`;
        this.canvas.style.height = `${GameEnv.backgroundHeight}px`;
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = `${canvasLeft}px`;
        this.canvas.style.top = `${GameEnv.top}px`;

        GameEnv.setBottom();
    }
}

export default BackgroundPlat;
