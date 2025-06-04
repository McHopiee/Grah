// GameControl.js
import GameLevel from "./GameLevel.js";
import GameLevelBasement from "./GameLevelBasement.js";  
import GameLevelMC from "./GameLevelMC.js";
import GameLevelWater from "./GameLevelWater.js";
import GameSetterOverworld from "../platformer3x/GameSetterOverworld.js";

class GameControl { 
    constructor(path, levelClasses = [GameLevelBasement, GameLevelMC, GameLevelWater]) {
        this.path = path;
        this.levelClasses = levelClasses;
        this.currentLevel = null;
        this.currentLevelIndex = 0;
        this.gameLoopCounter = 0;
        this.isPaused = false;
        this.exitKeyListener = this.handleExitKey.bind(this);
        this.gameOver = null;
        this.savedCanvasState = [];

        // Listen for custom event to load the platformer
        window.addEventListener('loadPlatformer', () => {
            this.levelClasses = [GameSetterOverworld]; // Switch to platformer
            this.currentLevelIndex = 0; // Start at index 0 of platformer levels
            this.restartLevel(); // Restart to apply changes
        });
    }

    start() {
        this.addExitKeyListener();
        this.transitionToLevel();
    }

    transitionToLevel() {
        const GameLevelClass = this.levelClasses[this.currentLevelIndex];
        this.currentLevel = new GameLevel(this);
        this.currentLevel.create(GameLevelClass);
        this.gameLoop();
    }

    gameLoop() {
        if (!this.currentLevel.continue) {
            this.handleLevelEnd();
            return;
        }
        if (this.isPaused) {
            return;
        }
        this.currentLevel.update();
        this.handleInLevelLogic();

        if (this.currentLevel.restart) {
            this.restartLevel();
            return;
        }
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    handleInLevelLogic() {
        if (this.currentLevelIndex === 0 && this.gameLoopCounter === 0) {
            console.log("Start Level.");
        }
        this.gameLoopCounter++;
    }

    handleLevelEnd() {
        if (this.currentLevelIndex < this.levelClasses.length - 1) {
            alert("Level ended.");
        } else {
            alert("All levels completed.");
        }
        this.currentLevel.destroy();
        if (this.gameOver) {
            this.gameOver();
        } else {
            this.currentLevelIndex++;
            this.transitionToLevel();
        }
    }

    handleExitKey(event) {
        if (event.key === 'Escape') {
            this.currentLevel.continue = false;
        }
    }

    addExitKeyListener() {
        document.addEventListener('keydown', this.exitKeyListener);
    }

    removeExitKeyListener() {
        document.removeEventListener('keydown', this.exitKeyListener);
    }

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

    hideCanvasState() {
        const gameContainer = document.getElementById('gameContainer');
        const canvasElements = gameContainer.querySelectorAll('canvas');
        canvasElements.forEach(canvas => {
            if (canvas.id !== 'gameCanvas') {
                canvas.style.display = 'none';
            }
        });
    }

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

    pause() {
        this.isPaused = true;
        this.removeExitKeyListener();
        this.saveCanvasState();
        this.hideCanvasState();
    }

    resume() {
        this.isPaused = false;
        this.addExitKeyListener();
        this.showCanvasState();
        this.gameLoop();
    }

    nextLevel() {
        this.currentLevelIndex = (this.currentLevelIndex + 1) % this.levelClasses.length;
        this.transitionToLevel();
    }

    restartLevel() {
        if (this.currentLevel) {
            this.currentLevel.destroy();
        }
        this.gameLoopCounter = 0;
        this.transitionToLevel();
    }
}

export default GameControl;
