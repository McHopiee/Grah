import GameEnv from './PlatformerEngine/GameEnv.js';
import GamePlatformerObject from './GamePlatformerObject.js';

export class FinishLine extends GamePlatformerObject {
    constructor(data, gameEnv) {
        const canvas = document.getElementById('gameCanvas');
        const image = new window.Image();

        // Fallback to a default image if src is missing
        image.src = data.src || "/images/gamify/loading.jpg";

        // Extract extra parameters from data if needed
        const xPercentage = data.xPercentage ?? 0;
        const yPercentage = data.yPercentage ?? 0;

        super(canvas, image, data);

        // Use a default aspect ratio if image is not loaded yet
        this.aspect_ratio = (image.width && image.height) ? image.width / image.height : 1;
        this.x = xPercentage * GameEnv.innerWidth;
        this.y = yPercentage * GameEnv.innerHeight;
        this.scaleSize = data?.scaleSize || 80;

        // Handle image loading for correct aspect ratio
        image.onload = () => {
            this.aspect_ratio = image.width / image.height || 1;
            if (typeof this.size === "function") this.size();
        };
    }

    update() {
        // No update actions needed
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
    }

    size() {
        const scaledHeight = GameEnv.innerHeight * (this.scaleSize / 832);
        const scaledWidth = scaledHeight * this.aspect_ratio;
        const finishlineX = this.x;
        const finishlineY = this.y;

        this.bottom = finishlineY;
        this.collisionHeight = scaledHeight;
        this.collisionWidth = scaledWidth;

        this.canvas.width = scaledWidth;
        this.canvas.height = scaledHeight;
        this.canvas.style.width = `${scaledWidth}px`;
        this.canvas.style.height = `${scaledHeight}px`;
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = `${finishlineX}px`;
        this.canvas.style.top = `${finishlineY}px`; 
    }
}

export default FinishLine;