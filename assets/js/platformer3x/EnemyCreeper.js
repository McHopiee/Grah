import Character from './Character.js';
import GameEnv from './GameEnv.js';
import GameControl from './GameControl.js';

export class Creeper extends Character {
    constructor(canvas, image, data, xPercentage, yPercentage, name, minPosition) {
        super(canvas, image, data);

        this.name = name;
        this.y = yPercentage;

        this.x = xPercentage * GameEnv.innerWidth;

        this.minPosition = minPosition * GameEnv.innerWidth;
        this.maxPosition = this.x + xPercentage * GameEnv.innerWidth;

        this.immune = 0;

        // Creeper-specific speed logic
        if (["easy", "normal"].includes(GameEnv.difficulty)) {
            this.speed = this.speed * Math.floor(Math.random() * 1.5 + 1.5);
        } else if (GameEnv.difficulty === "hard") {
            this.speed = this.speed * Math.floor(Math.random() * 2 + 2.5);
        } else {
            this.speed = this.speed * 6;
        }

        // Creeper explosion cooldown (prevents constant exploding)
        this.explodeCooldown = false;
    }

    update() {
        super.update();

        // Move within boundaries
        if (this.x <= this.minPosition || (this.x + this.canvasWidth >= this.maxPosition)) {
            this.speed = -this.speed;
        }

        // Random chance to change direction based on difficulty
        switch (GameEnv.difficulty) {
            case "normal":
                if (Math.random() < 0.005) this.speed = -this.speed;
                break;
            case "hard":
                if (Math.random() < 0.01) this.speed = -this.speed;
                break;
            case "impossible":
                if (Math.random() < 0.02) this.speed = -this.speed;
                break;
        }

        // Creeper's glow effect (e.g., green hue)
        this.canvas.style.filter = "hue-rotate(90deg) brightness(1.2)";

        // Movement
        this.x -= this.speed;

        this.playerBottomCollision = false;
    }

    collisionAction() {
        if (this.collisionData.touchPoints.other.id === "player" && !this.explodeCooldown) {
            this.explode();
        }

        if (this.collisionData.touchPoints.other.id === "finishline" || this.collisionData.touchPoints.other.id === "jumpPlatform") {
            if (this.collisionData.touchPoints.other.left || this.collisionData.touchPoints.other.right) {
                this.speed = -this.speed;
            }
        }
    }

    explode() {
        this.explodeCooldown = true;
        this.canvas.style.transition = "transform 0.5s, opacity 0.5s";
        this.canvas.style.transformOrigin = "center";
        this.canvas.style.transform = "scale(2)";
        this.canvas.style.opacity = 0.5;

        GameEnv.playSound("explosion"); // Play an explosion sound if you have one

        // Create explosion shards
        const shards = 20;
        for (let i = 0; i < shards; i++) {
            const shard = document.createElement('div');
            shard.style.position = 'absolute';
            shard.style.width = '5px';
            shard.style.height = '5px';
            shard.style.backgroundColor = 'limegreen'; // Color of shards
            shard.style.left = `${this.x}px`;
            shard.style.top = `${this.y}px`;
            this.canvas.parentElement.appendChild(shard);

            const angle = Math.random() * 2 * Math.PI;
            const speed = Math.random() * 5 + 2;

            const shardX = Math.cos(angle) * speed;
            const shardY = Math.sin(angle) * speed;

            shard.animate([
                { transform: 'translate(0, 0)', opacity: 1 },
                { transform: `translate(${shardX * 20}px, ${shardY * 20}px)`, opacity: 0 }
            ], {
                duration: 1000,
                easing: 'ease-out',
                fill: 'forwards'
            });

            setTimeout(() => {
                shard.remove();
            }, 1000);
        }

        // Destroy the Creeper after delay
        setTimeout(() => {
            this.destroy();
        }, 1000);
    }
}

export default Creeper;
