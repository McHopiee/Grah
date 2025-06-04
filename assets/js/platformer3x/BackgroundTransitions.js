import GameEnv from './PlatformerEngine/GameEnv.js';
import BackgroundPlat from './PlatformerEngine/BackgroundPlat.js';

export class BackgroundTransitions extends BackgroundPlat {
    constructor(data, gameEnv) {
        const canvas = document.getElementById('gameCanvas');
        const image = new window.Image();
        image.src = data.src;

        super(canvas, image, data);
        GameEnv.transitionHide = false;
    }

    update() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (super.update) super.update();
        if (GameEnv.transitionHide === true) {
            this.destroy();
        }
    }
}

export default BackgroundTransitions;