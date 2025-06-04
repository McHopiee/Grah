/**
 * GameEnv.js key purpose is to manage shared game environment data and methods.
 * 
 * Updated for smooth transitions between game modes.
 */
export class GameEnv {

    // Static properties as before...
    static userID = "Guest";
    static player = null;
    static levels = [];
    static currentLevel = null;
    static gameObjects = [];
    static isInverted = false;
    static gameSpeed = 2;
    static backgroundDirection = 0;
    static transitionHide = false;
    static gravity = 3;
    static destroyedMushroom = false;
    static destroyedMagicBeam = false;
    static destroyedChocoFrog = false;
    static playMessage = false;
    static difficulty = "normal";
    static innerWidth;
    static prevInnerWidth;
    static innerHeight;
    static top;
    static bottom;
    static prevBottom;
    static invincible = false;
    static goombaInvincible = false;
    static goombaBounce = false;
    static goombaBounce1 = false;

    static timerActive = false;
    static timerInterval = 10;
    static coinScore = 0;
    static time = 0;
    static darkMode = true;
    static playerAttack = false;

    static playerChange = false;

    static claimedCoinIds = [];

    // Prevent instantiation
    constructor() {
        throw new Error('GameEnv is a static class and cannot be instantiated.');
    }
  
    /**
     * Set top of game as header height
     */
    static setTop() {
        const header = document.querySelector('header');
        if (header) {
            this.top = header.offsetHeight;
        } else {
            this.top = 0;
        }
    }
  
    /**
     * Set bottom boundary for the game environment
     */
    static setBottom() {
        this.bottom = this.top + (this.backgroundHeight || 0);
    }
  
    /**
     * Initialize environment dimensions and reset any dynamic properties
     */
    static initialize() {
        // Reset key gameplay properties here if needed on transition
        this.prevInnerWidth = this.innerWidth;
        this.prevBottom = this.bottom;

        this.innerWidth = window.innerWidth;
        this.innerHeight = window.innerHeight;
        this.setTop();
        this.setBottom();

        // Reset dynamic gameplay flags
        this.invincible = false;
        this.goombaInvincible = false;
        this.goombaBounce = false;
        this.goombaBounce1 = false;
        this.destroyedMushroom = false;
        this.destroyedMagicBeam = false;
        this.destroyedChocoFrog = false;
        this.playMessage = false;
        this.playerAttack = false;
        this.backgroundDirection = 0;
        this.coinScore = 0;
        this.time = 0;
        this.timerActive = false;
        this.playerChange = false;
        this.claimedCoinIds = [];

        // If you want to reset difficulty or other persistent state, do it here or elsewhere
    }
  
    /**
     * Resize game objects based on new window size
     */
    static resize() {
        this.initialize();  // Recalculate sizes

        // Resize all game objects safely
        for (const gameObject of this.gameObjects) {
            if (typeof gameObject.size === "function") {
                gameObject.size();
            }
        }
    }
  
    /**
     * Update, serialize, and draw game objects
     */
    static update() {
        if (this.player === null || this.player.state?.isDying === false) {
            for (const gameObject of this.gameObjects) {
                if (typeof gameObject.update === "function") gameObject.update();
                if (typeof gameObject.serialize === "function") gameObject.serialize();
                if (typeof gameObject.draw === "function") gameObject.draw();
            }
        }
    }
  
    /**
     * Destroy all game objects and clear arrays for clean transition
     */
    static destroy() {
        // Destroy objects in reverse order safely
        for (let i = this.gameObjects.length - 1; i >= 0; i--) {
            const gameObject = this.gameObjects[i];
            if (typeof gameObject.destroy === "function") {
                gameObject.destroy();
            }
        }
        this.gameObjects = [];
        this.player = null;
        this.currentLevel = null;
        this.levels = [];
    }
  
    /**
     * Toggle canvas filter for invert mode
     */
    static setInvert() {
        for (const gameObject of this.gameObjects) {
            if (gameObject.invert && !this.isInverted) {
                gameObject.canvas.style.filter = "none";
            } else if (gameObject.invert && this.isInverted) {
                gameObject.canvas.style.filter = "invert(100%)";
            } else {
                gameObject.canvas.style.filter = "none";
            }
        }
    }

    static PlayerPosition = {
        playerX: 0,
        playerY: 0
    };

    /**
     * Play a sound by element ID
     * @param {string} id - id of the audio element
     */
    static playSound(id) {
        const sound = document.getElementById(id);
        if (sound) sound.play();
    }

    /**
     * Update parallax background direction based on key inputs
     * @param {string} key - the key pressed
     */
    static updateParallaxDirection(key) {
        let keys = [];
        if (this.player && this.player.pressedKeys) {
            keys = Object.keys(this.player.pressedKeys);
        }
        switch (key) {
            case "a":
                if (this.player?.x > 2) this.backgroundDirection = -1;
                break;
            case "d":
                if (this.player?.x < (this.innerWidth - 2)) this.backgroundDirection = 1;
                break;
            case "s":
                if (keys.includes("a") && keys.includes("s") && this.player?.x > 2) {
                    this.backgroundDirection = -5;
                } else if (keys.includes("d") && keys.includes("s") && this.player?.x < (this.innerWidth - 2)) {
                    this.backgroundDirection = 5;
                } else {
                    this.backgroundDirection = 0;
                }
                break;
            default:
                this.backgroundDirection = 0;
                break;
        }
    }

    /**
     * Reset all environment properties and game objects for clean start or transition
     */
    static reset() {
        this.destroy();
        this.initialize();
    }
}

export default GameEnv;
