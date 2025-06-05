// EnemyEnderman.js
import Character from './Character.js';
import GameEnv from './GameEnv.js';
import GameControl from './GameControl.js';

export class Enderman extends Character {
  constructor(canvas, image, data, xPercentage, yPercentage, name, minPosition) {
    super(canvas, image, data);
    
    this.name = name;
    this.y = yPercentage;
    
    this.x = xPercentage * GameEnv.innerWidth;
    this.minPosition = minPosition * GameEnv.innerWidth;
    this.maxPosition = this.x + xPercentage * GameEnv.innerWidth;

    this.immune = 1; // Endermen are immune to normal damage
    this.speed = 2; // base speed
    this.teleportCooldown = 0; // track teleportation
  }

  update() {
    super.update();

    // Move as usual
    this.x -= this.speed;

    // If at boundaries, reverse
    if (this.x <= this.minPosition || (this.x + this.canvasWidth >= this.maxPosition)) {
      this.speed = -this.speed;
    }

    // Teleport occasionally
    if (this.teleportCooldown <= 0 && Math.random() < 0.002) {
      this.teleport();
      this.teleportCooldown = 300; // cooldown frames
    }

    if (this.teleportCooldown > 0) {
      this.teleportCooldown--;
    }

    this.playerBottomCollision = false;
  }

  teleport() {
    // Randomly jump to another place in min/max range
    const newX = this.minPosition + Math.random() * (this.maxPosition - this.minPosition - this.canvasWidth);
    const newY = this.y + (Math.random() - 0.5) * 100; // small vertical variation
    this.x = newX;
    this.y = Math.max(0, Math.min(GameEnv.innerHeight - this.canvasHeight, newY));

    // Add teleport effect
    this.canvas.style.transition = 'opacity 0.2s';
    this.canvas.style.opacity = 0;
    setTimeout(() => {
      this.canvas.style.opacity = 1;
    }, 200);
  }

  collisionAction() {
    if (this.collisionData.touchPoints.other.id === 'player') {
      // Damage player if collided
      if (!GameEnv.invincible) {
        GameEnv.playerHit = true;
        // optionally play sound
        GameEnv.playSound("endermanAttack");
      }
    }

    // Turn around if hitting finish line or jump platform
    if (['finishline', 'jumpPlatform'].includes(this.collisionData.touchPoints.other.id)) {
      if (this.collisionData.touchPoints.other.left || this.collisionData.touchPoints.other.right) {
        this.speed = -this.speed;
      }
    }
  }
}

export default Enderman;
