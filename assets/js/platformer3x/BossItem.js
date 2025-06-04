import GameControl from './PlatformerEngine/GameControl.js';
import GameEnv from './PlatformerEngine/GameEnv.js';
import JumpPlatform from './PlatformJump.js';

export class BossItem extends JumpPlatform {
    constructor(data, gameEnv) {
        const canvas = document.getElementById('gameCanvas');
        const image = new window.Image();
        image.src = data.src;

        // Extract extra parameters from data if needed
        const xPercentage = data.xPercentage ?? 0;
        const yPercentage = data.yPercentage ?? 0;
        const name = data.name ?? "BossItem";

        // Only pass extra args if JumpPlatform expects them, otherwise just (canvas, image, data)
        super(canvas, image, data, xPercentage, yPercentage, name);

        this.relativeX = ""; // used for the item block's spritesheet.
    }

    // Required, but no update action
    update() {
        if (super.update) super.update();
    }

    collisionAction() {
        // collision only detects mario and it only applies to the item block
        if (this.collisionData.touchPoints.other.id === "player" && this.name === "itemBlock") {
            if (this.relativeX === 0 || this.relativeX === this.canvas.width) {
                if (this.relativeX === 0) {
                    GameControl.startRandomEvent("zombie");
                }
                this.relativeX = -1 * this.canvas.width;
            } else if (this.relativeX === "") {
                this.relativeX = 0;
            }
        }        
    }

    // Set platform position
    size() {
        if (super.size) super.size();
    }

    // Draw position is always 0,0
    draw() {
        if (!GameEnv.playerChange) {
            this.ctx.drawImage(
                this.image,
                this.relativeX,
                0,
                this.canvas.width / (this.data.widthRatio || 1),
                this.canvas.height / (this.data.heightRatio || 1)
            );
        } else {
            this.destroy();
        }
    }
}

export default BossItem;