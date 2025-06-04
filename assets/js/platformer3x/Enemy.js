import Character from './Character.js';
import GameEnv from './PlatformerEngine/GameEnv.js';
import GameControl from './PlatformerEngine/GameControl.js';

export class Enemy extends Character {

    initEnvironmentState = {
        animation: 'right',
        direction: 'right',
        isDying: false,
    };

    constructor(data, gameEnv) {
        const canvas = document.getElementById('gameCanvas');
        const image = new window.Image();
        image.src = data.src;

        const xPercentage = data.xPercentage ?? 0;
        const yPercentage = data.yPercentage ?? 0;
        const name = data.name ?? "Enemy";
        const minPosition = data.minPosition ?? 0;

        // Only pass extra args if Character expects them, otherwise just (canvas, image, data)
        super(canvas, image, data, xPercentage, yPercentage, name, minPosition);

        this.playerData = data;
        this.name = name;
        this.y = yPercentage;
        this.isIdle = false;
        this.x = xPercentage * GameEnv.innerWidth;
        this.state = { ...this.initEnvironmentState };
        this.minPosition = minPosition * GameEnv.innerWidth;
        this.maxPosition = this.x + xPercentage * GameEnv.innerWidth;
        this.immune = 0;
    }

    setAnimation(key) {
        var animation = this.playerData[key];
        this.setFrameY(animation.row);
        this.setMinFrame(animation.min ? animation.min : 0);
        this.setMaxFrame(animation.frames);
        if (this.isIdle && animation.idleFrame) {
            this.setFrameX(animation.idleFrame.column);
            this.setMinFrame(animation.idleFrame.frames);
        }
    }

    enemySpeed() {
        if (["easy", "normal"].includes(GameEnv.difficulty)) {
            this.speed = this.speed * Math.floor(Math.random() * 1.5 + 2);
        } else if (GameEnv.difficulty === "hard") {
            this.speed = this.speed * Math.floor(Math.random() * 3 + 3);
        } else {
            this.speed = this.speed * 5;
        }
    }

    checkBoundaries() {
        if (this.x <= this.minPosition || (this.x + this.canvasWidth >= this.maxPosition)) {
            if (this.state.direction === "left") {
                this.state.animation = "right";
                this.state.direction = "right";
            } else if (this.state.direction === "right") {
                this.state.animation = "left";
                this.state.direction = "left";
            }
        }
    }

    updateMovement() {
        if (this.state.animation === "right") {
            this.speed = Math.abs(this.speed);
        } else if (this.state.animation === "left") {
            this.speed = -Math.abs(this.speed);
        } else if (this.state.animation === "idle" || this.state.animation === "death") {
            this.speed = 0;
        }
        this.x += this.speed;
        this.playerBottomCollision = false;
    }

    update() {
        if (super.update) super.update();
        this.setAnimation(this.state.animation);
        this.checkBoundaries();
        this.updateMovement();
    }

    collisionAction() {
        if (this.collisionData.touchPoints.other.id === "finishline") {
            if (this.state.direction === "left" && this.collisionData.touchPoints.other.right) {
                this.state.animation = "right";
                this.state.direction = "right";
            } else if (this.state.direction === "right" && this.collisionData.touchPoints.other.left) {
                this.state.animation = "left";
                this.state.direction = "left";
            }
        }

        if (this.collisionData.touchPoints.other.id === "player") {
            if (this.collisionData.touchPoints.other.bottom && this.immune == 0) {
                GameEnv.invincible = true;
                GameEnv.goombaBounce = true;
                this.canvas.style.transition = "transform 2s, opacity 1s";
                this.canvas.style.transformOrigin = "bottom";
                this.canvas.style.transform = "scaleY(0)";
                this.speed = 0;
                GameEnv.playSound("goombaDeath");

                setTimeout(() => {
                    GameEnv.invincible = false;
                    this.destroy();
                }, 1500);
            }
        }

        if (this.collisionData.touchPoints.other.id === "jumpPlatform") {
            if (this.state.direction === "left" && this.collisionData.touchPoints.other.right) {
                this.state.animation = "right";
                this.state.direction = "right";
            } else if (this.state.direction === "right" && this.collisionData.touchPoints.other.left) {
                this.state.animation = "left";
                this.state.direction = "left";
            }
        }
    }
}

export default Enemy;