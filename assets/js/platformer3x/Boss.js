import GameEnv from './PlatformerEngine/GameEnv.js';
import Character from './Character.js';
import GameControl from './PlatformerEngine/GameControl.js';
import Enemy from './Enemy.js';
import GameLevel from './GameLevel.js';
import PlayerZombie from './PlayerZombie.js';
import hpBar from './hpBar.js';

export class Boss extends Enemy {
    // instantiation: constructor sets up boss object
    constructor(data, gameEnv) {
        const canvas = document.getElementById('gameCanvas');
        const image = new window.Image();
        image.src = data.src;

        // Get extra parameters from data
        const xPercentage = data.xPercentage ?? 0;
        const yPercentage = data.yPercentage ?? 0;
        const name = data.name ?? "Boss";
        const minPosition = data.minPosition ?? 0;

        super(canvas, image, data, xPercentage, yPercentage, name, minPosition);

        this.storeSpeed = this.speed;
        this.animationSpeed = data?.animationSpeed || 1; // higher "animationSpeed" means slower animation
        this.counter = this.animationSpeed;
        this.enemySpeed();

        // Hp Bar
        this.maxHp = 100; // Maximum health points
        this.currentHp = 100; // Current health points
        this.hpBar = new hpBar(100, 15, this.canvasWidth, this.canvasHeight, this.maxHp, this.currentHp, this.x, this.y);

        this.attackRange = 50;
    }

    // Overwrite the method
    updateFrameX() {
        // Update animation frameX of the object
        if (!this.state.isDying || this.state.animation !== "death") {
            if (this.frameX < this.maxFrame) {
                if (this.counter > 0) {
                    this.frameX = this.frameX;
                    this.counter--;
                } else {
                    this.frameX++;
                    this.counter = this.animationSpeed;
                }
            } else {
                this.frameX = this.minFrame;
            }
        } else if (this.state.isDying && this.state.animation === "death") {
            this.animationSpeed = 50;
            if (this.frameX < this.maxFrame) {
                if (this.counter > 0) {
                    this.frameX = this.frameX;
                    this.counter--;
                } else {
                    this.frameX++;
                    this.counter = this.animationSpeed;
                }
            } else {
                this.destroy();
                if (this.hpBar && typeof this.hpBar.destroy === "function") {
                    this.hpBar.destroy();
                }
            }
        }
    }

    // Overwrite the method
    updateMovement() {
        if (this.state.animation === "right") {
            this.speed = Math.abs(this.storeSpeed);
        } else if (this.state.animation === "left") {
            this.speed = -Math.abs(this.storeSpeed);
        } else if (["death", "idleL", "idleR"].includes(this.state.animation)) {
            this.speed = 0;
        }
        // Move the enemy
        this.x += this.speed;
        this.playerBottomCollision = false;
    }

    randomEvent() {
        if (GameControl.randomEventId === 1 && GameControl.randomEventState === 2) {
            this.state.direction = "left";
            this.state.animation = "idleL";
            GameControl.endRandomEvent();
        } else if (GameControl.randomEventId === 2 && GameControl.randomEventState === 2) {
            this.state.direction = "right";
            this.state.animation = "idleR";
            GameControl.endRandomEvent();
        } else if (GameControl.randomEventId === 3 && GameControl.randomEventState === 2) {
            this.state.direction = "left";
            this.state.animation = "left";
            GameControl.endRandomEvent();
        } else if (GameControl.randomEventId === 4 && GameControl.randomEventState === 2) {
            this.state.direction = "right";
            this.state.animation = "right";
            GameControl.endRandomEvent();
        }
    }

    update() {
        if (super.update) super.update();
        this.randomEvent();
        if (this.hpBar && typeof this.hpBar.updateHpBar === "function") {
            this.hpBar.updateHpBar(this.currentHp, this.x, this.y, this.canvasWidth, this.canvasHeight);
        }
    }

    // Overwrite the method
    collisionAction() {
        if (this.collisionData.touchPoints.other.id === "tube") {
            if (this.state.direction === "left" && this.collisionData.touchPoints.other.right) {
                this.state.animation = "right";
                this.state.direction = "right";
            } else if (this.state.direction === "right" && this.collisionData.touchPoints.other.left) {
                this.state.animation = "left";
                this.state.direction = "left";
            }
        }
        if (this.collisionData.touchPoints.other.id === "player") {
            if (this.collisionData.touchPoints.other.right && !this.collisionData.touchPoints.other.bottom) {
                this.x -= 10;
                this.state.direction = "left";
                this.state.animation = "attackL";
                this.speed = 0;
            } else if (this.collisionData.touchPoints.other.left && !this.collisionData.touchPoints.other.bottom) {
                this.x += 10;
                this.state.direction = "right";
                this.state.animation = "attackR";
                this.speed = 0;
            } else if (this.collisionData.touchPoints.other.bottom && this.immune === 0) {
                GameEnv.goombaBounce = true;
            }
        } else {
            if (this.currentHp < 0) {
                this.state.animation = "death";
                if (!this.state.isDying && this.state.animation === "death") {
                    this.frameX = 0;
                }
                this.state.isDying = true;
                GameEnv.invincible = true;
                GameEnv.playSound("goombaDeath");
            } else {
                if (GameEnv.playerAttack && (Math.abs((this.x + this.canvasWidth) / 2 - (GameEnv.x + GameEnv.canvasWidth) / 2) < (this.canvasWidth / 2 + this.attackRange))) {
                    this.currentHp -= 1;
                }
            }
        }
        if (this.collisionData.touchPoints.other.id === "jumpPlatform") {
            if (this.state.direction === "left" && this.collisionData.touchPoints.other.right) {
                this.state.animation = "right";
                this.state.direction = "right";
            } else if (this.state.direction === "right" && this.collisionData.touchPoints.other.left) {
                this.state.direction = "left";
                this.state.animation = "left";
            }
        }
    }
}

export default Boss;