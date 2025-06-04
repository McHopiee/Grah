import GameEnv from './PlatformerEngine/GameEnv.js';
import BackgroundPlat from './PlatformerEngine/BackgroundPlat.js';

export class BackgroundParallax extends BackgroundPlat  {
    constructor(data, gameEnv) {
        const canvas = document.getElementById('gameCanvas');
        const image = new window.Image();
        image.src = data.src;

        super(canvas, image, data);

        this.parallaxSpeed = data.parallaxSpeed || 1; 
        this.moveOnKeyAction = data.moveOnKeyAction || false;
    }

    // speed is used for background parallax behavior
    update() {
        this.speed = this.moveOnKeyAction ? this.parallaxSpeed * GameEnv.backgroundDirection : this.parallaxSpeed;
        if (super.update) super.update();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (super.draw) super.draw();
    }
}

export default BackgroundParallax;