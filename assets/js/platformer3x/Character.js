import GameEnv from './PlatformerEngine/GameEnv.js';
import GamePlatformerObject from './GamePlatformerObject.js';

class Character extends GamePlatformerObject {
    constructor(data, gameEnv) {
        const canvas = document.getElementById('gameCanvas');
        const image = new window.Image();
        image.src = data.src;

        super(canvas, image, data);

        this.spriteWidth = data.width;
        this.spriteHeight = data.height;
        this.scaleSize = data?.scaleSize || 80;

        this.minFrame = 0;
        this.maxFrame = 0;
        this.frameX = 0;
        this.frameY = 0;

        this.gravityEnabled = true;
        this.onTop = false;
    }

    setSpriteAnimation(animation) {
        this.setFrameY(animation.row);
        this.setMinFrame(animation.min ? animation.min : 0);
        this.setMaxFrame(animation.frames);
    }

    getMinFrame() { return this.minFrame; }
    setMinFrame(minFrame) { this.minFrame = minFrame; }

    getMaxFrame() { return this.maxFrame; }
    setMaxFrame(maxFrame) { this.maxFrame = maxFrame; }

    getFrameX() { return this.frameX; }
    setFrameX(frameX) { this.frameX = frameX; }

    getFrameY() { return this.frameY; }
    setFrameY(frameY) { this.frameY = frameY; }

    updateInfo(json) {
        super.updateInfo(json);
        var element = this.canvas;
        if (json.id === element.id) {
            this.x = json.x * GameEnv.innerWidth;
            this.y = (json.y * (GameEnv.bottom - GameEnv.top)) + GameEnv.top;
            this.frameY = json.frameY;
        }
        return json.id === element.id;
    }

    draw() {
        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;
        this.canvas.style.width = `${this.canvas.width}px`;
        this.canvas.style.height = `${this.canvas.height}px`;
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = `${this.x}px`;
        this.canvas.style.top = `${this.y}px`;

        this.ctx.drawImage(
            this.image,
            this.frameX * this.spriteWidth,
            this.frameY * this.spriteHeight,
            this.spriteWidth,
            this.spriteHeight,
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );

        this.ctx.fillStyle = "black";
        this.ctx.font = "10px Arial";
        this.ctx.fillText(this.name, 0, this.canvas.height / 4);
    }

    size() {
        var scaledCharacterHeight = GameEnv.innerHeight * (this.scaleSize / 832);
        var canvasScale = scaledCharacterHeight / this.spriteHeight;
        this.canvasHeight = this.spriteHeight * canvasScale;
        this.canvasWidth = this.spriteWidth * canvasScale;

        this.bottom = GameEnv.bottom - this.canvasHeight;
        this.collisionHeight = this.canvasHeight;
        this.collisionWidth = this.canvasWidth;

        if (GameEnv.prevInnerWidth) {
            const proportionalX = (this.x / GameEnv.prevInnerWidth) * GameEnv.innerWidth;
            this.setX(proportionalX);
            this.setY(this.bottom);
        } else {
            this.setX(0);
            this.setY(this.bottom);
        }
    }

    updateY() {
        if (this.bottom > this.y && this.gravityEnabled) {
            this.y += GameEnv.gravity;
            this.onTop = false;
        } else {
            this.onTop = true;
        }
    }

    updateFrameX() {
        if (this.frameX < this.maxFrame) {
            this.frameX++;
        } else {
            this.frameX = this.minFrame;
        }
    }

    update() {
        this.updateY();
        this.updateFrameX();
        this.collisionChecks();
    }
}

export default Character;
