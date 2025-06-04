import Character from './Character.js';
import GameEnv from './GameEnv.js';

export class MagicBeam extends Character {
    // Constructor sets up Character object 
    constructor(data, gameEnv) {
        const canvas = document.getElementById('gameCanvas');
        const image = new window.Image();
        image.src = data.src;

        // Extract extra parameters from data if needed
        const xPercentage = data.xPercentage ?? 0;
        const yPercentage = data.yPercentage ?? 0;
        const name = data.name ?? "MagicBeam";
        const minPosition = data.minPosition ?? 0;

        super(canvas, image, data);

        this.name = name;
        this.x = xPercentage * GameEnv.innerWidth;
        this.yPercentage = yPercentage;
        this.y = GameEnv.bottom * this.yPercentage;
        this.canvas.style.top = `${this.y}px`;

        this.minPosition = minPosition * GameEnv.innerWidth;
        this.maxPosition = this.x + xPercentage * GameEnv.innerWidth;

        this.immune = 0;
        GameEnv.destroyedMagicBeam = false;
        this.speed = data.speed || 2;
        this.canvasWidth = data.width || image.width || 100;
    }

    update() {
        if (super.update) super.update();

        // Check for boundaries
        if (this.x <= this.minPosition || (this.x + this.canvasWidth >= this.maxPosition)) {
            this.speed = -this.speed;
        }
        this.x += this.speed;
        this.playerBottomCollision = false;

        this.y = GameEnv.bottom * this.yPercentage;
        this.canvas.style.top = `${this.y}px`;
    }

    explode() {
        const shards = 3; // reduced number of shards
        for (let i = 0; i < shards; i++) {
            const shard = document.createElement('div');
            shard.style.position = 'absolute';
            shard.style.width = '5px';
            shard.style.height = '5px';
            shard.style.backgroundColor = '#FFD700'; // golden yellow color for the shards
            shard.style.left = `${this.x}px`;
            shard.style.top = `${this.y}px`;
            if (this.canvas.parentElement) {
                this.canvas.parentElement.appendChild(shard); 
            }
    
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
        this.canvas.style.opacity = 0;
    }
    
    // Player action on collisions
    collisionAction() {
        if (this.collisionData.touchPoints.other.id === "player") {
            if (this.collisionData.touchPoints.other.bottom && this.immune === 0) {
                GameEnv.invincible = true;
                GameEnv.goombaBounce1 = true;
                this.explode();

                setTimeout(() => {
                    GameEnv.invincible = false;
                    this.destroy();
                    GameEnv.destroyedMagicBeam = true;
                }, 500);
            }
        }
        if (this.collisionData.touchPoints.other.id === "jumpPlatform") {
            if (this.collisionData.touchPoints.other.left || this.collisionData.touchPoints.other.right) {
                this.speed = -this.speed;            
            }
        }
    }
}

export default MagicBeam;