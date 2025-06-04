import GameControl from './PlatformerEngine/GameControl.js';
import GameEnv from './PlatformerEngine/GameEnv.js';
import GamePlatformerObject from './GamePlatformerObject.js';

export class ShakingPlatform extends GamePlatformerObject {
    constructor(data, gameEnv) {
        const canvas = document.getElementById('gameCanvas');
        const image = new window.Image();
        image.src = data.src;

        // Use xPercentage and yPercentage from data if present, else default to 0
        const xPercentage = data.xPercentage ?? 0;
        const yPercentage = data.yPercentage ?? 0;
        const name = data.name ?? "ShakingPlatform";

        super(canvas, image, data);

        this.platformX = xPercentage * GameEnv.innerWidth;
        this.platformY = yPercentage;
        this.data = data;
        this.name = name;
        this.relativeX = ""; // used for the item block's spritesheet.        
    }

    update() {
        this.collisionChecks();
    }

    collisionAction() {
        // collision only detects mario and it only applies to the item block
        if (this.collisionData.touchPoints.other.id === "player" && this.name === "itemBlock") {
            if (this.relativeX === 0 || this.relativeX === this.canvas.width) {
                if (this.relativeX === 0) {
                    GameControl.startRandomEvent("game");
                }
                this.relativeX = -1 * this.canvas.width;
                // Call shake effect when collision happens
                this.shakePlatform();
            } else if (this.relativeX === "") {
                this.relativeX = 0;
            }
        }        
    }
    
    shakePlatform() {
        // Shake the platform by applying a series of small movements
        const intensity = 5;
        const duration = 250;
        const startX = parseInt(this.canvas.style.left) || 0;
        const startY = parseInt(this.canvas.style.bottom) || 0;
        const startTime = Date.now();

        const shake = () => {
            const elapsedTime = Date.now() - startTime;
            const fraction = elapsedTime / duration;

            if (fraction < 1) {
                const x = startX + intensity * Math.sin(fraction * 4 * Math.PI);
                const y = startY + intensity * Math.cos(fraction * 4 * Math.PI);
                this.canvas.style.left = x + "px";
                this.canvas.style.bottom = y + "px";
                setTimeout(shake, 16); // 16ms for 60fps
            } else {
                this.canvas.style.left = startX + "px";
                this.canvas.style.bottom = startY + "px";
            }
        };

        shake();
    }

    resetRelativeX() {
        this.relativeX = ""; // Reset relative X position
    }

    // Set platform position
    size() {
        // Formula for Height should be on constant ratio, using a proportion of 832
        const scaledHeight = GameEnv.innerHeight * ((this.data.sizeRatio || 1) / 832);
        const scaledWidth = GameEnv.innerHeight * 0.1;  // width of jump platform is 1/10 of height
        const platformX = this.platformX;
        const platformY = (GameEnv.bottom - scaledHeight) * this.platformY;
        this.x = platformX;
        this.y = platformY;

        // set variables used in Display and Collision algorithms
        this.bottom = platformY;
        this.collisionHeight = scaledHeight;
        this.collisionWidth = scaledWidth;

        this.canvas.style.width = `${scaledWidth}px`;
        this.canvas.style.height = `${scaledHeight}px`;
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = `${platformX}px`;
        this.canvas.style.bottom = `${platformY}px`; 
    }

    // Draw position is always 0,0
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(
            this.image,
            0,
            0,
            this.canvas.width / (this.data.widthRatio || 1),
            this.canvas.height / (this.data.heightRatio || 1)
        );
    }
}

export default ShakingPlatform;
