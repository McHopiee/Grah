// EnemyZombie.js
import Enemy from './Enemy.js';
import GameEnv from './PlatformerEngine/GameEnv.js';
import GameControl from './PlatformerEngine/GameControl.js';

class EnemyZombie extends Enemy {
    constructor(data, gameEnv) {
        const canvas = document.getElementById('gameCanvas');
        const image = new window.Image();
        image.src = data.src;

        // Use the same argument pattern as Enemy expects
        const xPercentage = data.xPercentage ?? 0;
        const yPercentage = data.yPercentage ?? 0;
        const name = data.name ?? "EnemyZombie";
        const minPosition = data.minPosition ?? 0;

        super(canvas, image, data, xPercentage, yPercentage, name, minPosition);

        this.name = name;
        this.x = xPercentage * GameEnv.innerWidth;
        this.y = yPercentage * GameEnv.innerHeight;

        this.minPosition = minPosition * GameEnv.innerWidth;
        this.speed = 1.5;

        this.isAlive = true;
        this.damageCooldown = 0;
    }

    update() {
        if (!this.isAlive) return;

        const player = GameControl.player;
        if (!player) return;

        const dx = player.x - this.x;

        if (Math.abs(dx) > 1) {
            this.x += Math.sign(dx) * this.speed;
        }

        if (this.damageCooldown > 0) {
            this.damageCooldown--;
        }

        if (this.collidesWith(player)) {
            if (player.hasSword) {
                this.isAlive = false;
                this.destroy();
            } else if (this.damageCooldown === 0) {
                player.lives -= 1;
                this.damageCooldown = 60;
                if (player.lives <= 0) {
                    GameControl.restartLevel();
                }
            }
        }

        if (super.update) super.update();
    }

    collidesWith(player) {
        const buffer = 10;
        return (
            this.x + this.width > player.x + buffer &&
            this.x < player.x + player.width - buffer &&
            this.y + this.height > player.y + buffer &&
            this.y < player.y + player.height - buffer
        );
    }

    destroy() {
        // Remove canvas from DOM safely
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        const index = GameEnv.gameObjects.indexOf(this);
        if (index !== -1) {
            GameEnv.gameObjects.splice(index, 1);
        }
    }
}

export default EnemyZombie;
