// GameControl.js
import GameLevel from "./GameLevel.js";
import GameLevelFinale from "./GameLevelFinale.js";
import GameLevelBasement from "./GameLevelBasement.js";
import GameLevelMC from "./GameLevelMC.js";


class GameControl {
    /**
     * GameControl class to manage the game levels and transitions
     * @param {*} path - The path to the game assets
     * @param {*} levelClasses - The classes of for each game level
     */
    constructor(path, levelClasses = [GameLevelBasement, GameLevelMC, GameLevelFinale]) {
        // GameControl properties
        this.path = path;
        this.levelClasses = levelClasses;
        this.currentLevel = null;
        this.currentLevelIndex = 0;
        this.gameLoopCounter = 0;
        this.isPaused = false;
        this.exitKeyListener = this.handleExitKey.bind(this);
        this.gameOver = null; // Callback for when the game is over 
        this.savedCanvasState = []; // Save the current levels game elements 
    }

    /**
     * Starts the game by 
     * 1. Adding an exit key listener
     * 2. Transitioning to the first level
     */
    start() {
        this.addExitKeyListener();
        this.transitionToLevel();
    }

    /**
     * Transition to the next level with a fade-out and fade-in effect
     */
    transitionToLevel() {
        // Create the fade overlay
        const fadeOverlay = document.createElement('div');
        fadeOverlay.style.position = 'fixed';
        fadeOverlay.style.top = '0';
        fadeOverlay.style.left = '0';
        fadeOverlay.style.width = '100%';
        fadeOverlay.style.height = '100%';
        fadeOverlay.style.backgroundColor = 'black';
        fadeOverlay.style.opacity = '0';
        fadeOverlay.style.transition = 'opacity 1s ease-in-out';
        fadeOverlay.style.zIndex = '1000'; // Ensure it appears above everything else

        // Create the "Loading..." message
        const loadingMessage = document.createElement('div');
        loadingMessage.innerText = 'Loading...';
        loadingMessage.style.position = 'absolute';
        loadingMessage.style.top = '50%';
        loadingMessage.style.left = '50%';
        loadingMessage.style.transform = 'translate(-50%, -50%)';
        loadingMessage.style.color = 'white';
        loadingMessage.style.fontSize = '2rem';
        loadingMessage.style.fontFamily = 'Arial, sans-serif';
        fadeOverlay.appendChild(loadingMessage);

        // Add the overlay to the document
        document.body.appendChild(fadeOverlay);

        // Fade to black
        requestAnimationFrame(() => {
            fadeOverlay.style.opacity = '1';
        });

        setTimeout(() => {
            // Switch levels when the screen is black
            const GameLevelClass = this.levelClasses[this.currentLevelIndex];
            this.currentLevel = new GameLevel(this);
            this.currentLevel.create(GameLevelClass);

            // Keep the "Loading..." message visible for a bit longer
            setTimeout(() => {
                // Fade back in
                fadeOverlay.style.opacity = '0';
                setTimeout(() => document.body.removeChild(fadeOverlay), 1000);

                // Start game loop after transition
                this.gameLoop();
            }, 1000); // Additional delay for the "Loading..." message
        }, 1000); // Wait for fade-out duration
    }

    /**
     * The main game loop 
     * 1. Updates the current level
     * 2. Handles the level start
     * 3. Requests the next frame
     */
    gameLoop() {
        // If the level is not set to continue, handle the level end condition 
        if (!this.currentLevel.continue) {
            this.handleLevelEnd();
            return;
        }
        // If the game level is paused, stop the game loop
        if (this.isPaused) {
            return;
        }
        this.currentLevel.update();
        this.handleInLevelLogic();
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    /**
     * This method is a placeholder for future logic that needs to be executed during the game loop.
     * For example, a starting page or time-based events
     */
    handleInLevelLogic() {
        // This condition is established for future starting page logic
        if (this.currentLevelIndex === 0 && this.gameLoopCounter === 0) {
            console.log("Start Level.");
        }
        // This counter is established for future time-based logic, like frames per second
        this.gameLoopCounter++;
    }

    /**
     * Handles the level end by
     * 1. Destroying the current level
     * 2. Calling the gameOver callback if it exists
     * 3. Transitioning to the next level
     */
    handleLevelEnd() {
        // Alert the user that the level has ended
        if (this.currentLevelIndex < this.levelClasses.length - 1) {
            alert("Level ended.");
        } else {
            alert("All levels completed.");
        }
        this.currentLevel.destroy();
        // Call the gameOver callback if it exists
        if (this.gameOver) {
            this.gameOver();
        } else {
            this.currentLevelIndex++;
            this.transitionToLevel();
        }
    }

    /**
     * Exit key handler to end the current level
     * @param {*} event - The keydown event object
     */
    handleExitKey(event) {
        if (event.key === 'Escape') {
            this.currentLevel.continue = false;
        }
    }

    // Helper method to add exit key listener
    addExitKeyListener() {
        document.addEventListener('keydown', this.exitKeyListener);
    }

    // Helper method to remove exit key listener
    removeExitKeyListener() {
        document.removeEventListener('keydown', this.exitKeyListener);
    }

    // Helper method to save the current canvas id and image data in the game container
    saveCanvasState() {
        const gameContainer = document.getElementById('gameContainer');
        const canvasElements = gameContainer.querySelectorAll('canvas');
        this.savedCanvasState = Array.from(canvasElements).map(canvas => {
            return {
                id: canvas.id,
                imageData: canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height)
            };
        });
    }

    // Helper method to hide the current canvas state in the game container
    hideCanvasState() {
        const gameContainer = document.getElementById('gameContainer');
        const canvasElements = gameContainer.querySelectorAll('canvas');4
        canvasElements.forEach(canvas => {
            if (canvas.id !== 'gameCanvas') {
                canvas.style.display = 'none';
            }
        });
    }

    // Helper method to restore the hidden canvas item to be visible
    showCanvasState() {
        const gameContainer = document.getElementById('gameContainer');
        this.savedCanvasState.forEach(hidden_canvas => {
            const canvas = document.getElementById(hidden_canvas.id);
            if (canvas) {
                canvas.style.display = 'block';
                canvas.getContext('2d').putImageData(hidden_canvas.imageData, 0, 0);
            }
        });
    }

    /**
     * Game level in Game Level helper method to pause the underlying game level
     * 1. Set the current game level to paused
     * 2. Remove the exit key listener
     * 3. Save the current canvas game containers state
     * 4. Hide the current canvas game containers
     */
    pause() {
        this.isPaused = true;
        this.removeExitKeyListener();
        this.saveCanvasState();
        this.hideCanvasState();
     }

     /**
      * Game level in Game Level helper method to resume the underlying game level
      * 1. Set the current game level to not be paused
      * 2. Add the exit key listener
      * 3. Show the current canvas game containers
      * 4. Start the game loop
      */
    resume() {
        this.isPaused = false;
        this.addExitKeyListener();
        this.showCanvasState();
        this.gameLoop();
    }

    /**
     * Move to the next level
     */
    nextLevel() {
        this.currentLevelIndex = (this.currentLevelIndex + 1) % this.levelClasses.length;
        this.transitionToLevel();
    }

    /**
     * Restart the current level.
     */
    restartLevel() {
        console.log("Restarting the current level...");
        if (this.currentLevel) {
            this.currentLevel.destroy(); // Clean up the current level
        }
        const CurrentLevelClass = this.levelClasses[this.currentLevelIndex];
        this.currentLevel = new GameLevel(this);
        this.currentLevel.create(CurrentLevelClass);
    }
}

export default GameControl;