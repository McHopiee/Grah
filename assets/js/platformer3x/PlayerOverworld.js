import GameEnv from './GameEnv.js';
import PlayerBase from './PlayerBase.js';
import GameControl from './GameControl.js';

/**
 * @class PlayerOverworld class
 * @description PlayerOverworld.js manages the user-controlled character in the overworld map.
 * It extends PlayerBase and adds Overworld-specific events and interactions.
 * WASD keys control the player, with collisions, events, and gravity applied.
 *
 * @extends PlayerBase
 */
export class PlayerOverworld extends PlayerBase {

    /**
     * Constructor for PlayerOverworld.
     * @param {HTMLCanvasElement} canvas - The canvas element to draw the player on.
     * @param {HTMLImageElement} image - The player sprite image.
     * @param {Object} data - Player properties: width, height, scale, etc.
     */
    constructor(canvas, image, data) {
        super(canvas, image, data);

        // Overworld-specific variables
        this.timer = false;
        GameEnv.invincible = false; // Player starts not invincible
    }

    /**
     * @override
     * Adjusts jump height based on difficulty or level context.
     */
    updateJump() {
        let jumpHeightFactor;
        if (GameEnv.difficulty === "easy") {
            jumpHeightFactor = 0.5;
        } else if (GameEnv.difficulty === "normal") {
            jumpHeightFactor = 0.4;
        } else {
            jumpHeightFactor = 0.3; // Hard difficulty
        }
        if (GameEnv.currentLevel.tag === "boss") {
            jumpHeightFactor = 0; // No jumping in boss overworld
        }
        this.setY(this.y - (this.bottom * jumpHeightFactor));
    }

    /**
     * @override
     * Handles player collisions with specific objects in the overworld.
     */
    handleCollisionStart() {
        super.handleCollisionStart(); // Call base collision logic
        // Add overworld-specific collisions
        this.handleCollisionEvent("door");
        this.handleCollisionEvent("portal");
        this.handleCollisionEvent("item");
    }

    /**
     * @override
     * Reactions to collision events unique to overworld.
     */
    handlePlayerReaction() {
        super.handlePlayerReaction(); // Base reactions
        switch (this.state.collision) {
            case "door":
                // Enter a door to transition to a new level
                if (this.collisionData.touchPoints.this.onTopofOther || this.state.isFinishing) {
                    this.state.movement = { up: false, down: false, left: false, right: false, falling: false };
                    this.state.isFinishing = true;
                    this.gravityEnabled = true;
                    if (Math.abs(this.y - this.bottom) <= GameEnv.gravity) {
                        GameControl.transitionToLevel(GameEnv.nextLevel);
                    }
                }
                break;

            case "portal":
                // Touching a portal in the overworld
                if (this.collisionData.touchPoints.this.onTopofOther) {
                    GameEnv.playSound("PortalActivate");
                    setTimeout(() => {
                        GameControl.transitionToLevel(GameEnv.nextLevel);
                    }, 500);
                }
                break;

            case "item":
                // Picking up an item in the overworld
                if (!GameEnv.collectedItem) {
                    GameEnv.collectedItem = true;
                    this.canvas.style.filter = "brightness(1.5)";
                    setTimeout(() => {
                        this.canvas.style.filter = "brightness(1)";
                    }, 1000);
                }
                break;
        }
    }

}

export default PlayerOverworld;
