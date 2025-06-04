// EnemyZombie.js
import Character from './Character.js';
import GameEnv from './GameEnv.js';
import Enemy from './Enemy.js';
import GameControl from './GameControl.js';

class EnemyZombie extends Enemy {
    constructor(canvas, image, data, xPercentage, yPercentage, name, minPosition) {
        super(canvas, image, data);

        // Initialize position and movement
        this.name = name;
        this.x = xPercentage * GameEnv.innerWidth;
        this.y = yPercentage * GameEnv.innerHeight;

        this.minPosition = minPosition * GameEnv.innerWidth;
        this.speed = 1.5; // Adjust speed as needed

        this.isAlive = true;
        this.damageCooldown = 0; // To prevent rapid damage
    }

    update() {
        // Only update if zombie is alive
        if (!this.isAlive) return;

        // Track player (harry)
        const player = GameControl.player;
        const dx = player.x - this.x;

        // Determine direction
        if (Math.abs(dx) > 1) {
            this.x += Math.sign(dx) * this.speed;
        }

        // Cooldown to prevent damage every frame
        if (this.damageCooldown > 0) {
            this.damageCooldown--;
        }

        // Collision with player
        if (this.collidesWith(player)) {
            if (player.hasSword) {
                // Player has sword, zombie dies
                this.isAlive = false;
            } else if (this.damageCooldown === 0) {
                // Player takes damage
                player.lives -= 1;
                this.damageCooldown = 60; // 1 second of cooldown at 60 FPS

                // Reset player if lives <= 0
                if (player.lives <= 0) {
                    GameControl.restartLevel();
                }
            }
        }

        super.update();
    }

    collidesWith(player) {
        // Basic collision detection (box-based)
        const buffer = 10; // Small buffer to fine-tune collision
        return (
            this.x + this.width > player.x + buffer &&
            this.x < player.x + player.width - buffer &&
            this.y + this.height > player.y + buffer &&
            this.y < player.y + player.height - buffer
        );
    }
}

export default EnemyZombie;
