import GameLevel from "./GameLevel.js";
import GameLevelBasement from "./GameLevelBasement.js";
import GameLevelMC from "./GameLevelMC.js";
import GameLevelWater from "./GameLevelWater.js";
import GameSetterOverworld from "../platformer3x/GameSetterOverworld.js";

class GameControl {
  constructor(path, levelClasses = [GameLevelBasement, GameLevelMC, GameLevelWater]) {
    this.path = path;

    this.canvas = null; // single canvas for all levels

    this.rpgLevels = levelClasses;
    this.platformerLevels = [GameSetterOverworld];

    this.currentLevel = null;
    this.currentLevelIndex = 0;
    this.isPlatformerActive = false;
    this.isPaused = false;

    this.exitKeyListener = this.handleExitKey.bind(this);
    this.gameLoopId = null;

    window.addEventListener('loadPlatformer', () => this.switchToPlatformer());
    window.addEventListener('loadRPG', () => this.switchToRPG());
  }

  start() {
    this.ensureCanvasExists();
    this.addExitKeyListener();
    this.currentLevelIndex = 0;
    this.isPlatformerActive = false;
    this.transitionToLevel();
  }

  ensureCanvasExists() {
    this.canvas = document.getElementById('gameCanvas');
    if (!this.canvas) {
      console.error("Canvas element with id 'gameCanvas' not found. Make sure it exists in your HTML.");
    } else {
      // Optionally set canvas size or style here if needed
      this.canvas.width = this.canvas.clientWidth || 800;
      this.canvas.height = this.canvas.clientHeight || 600;
    }
  }

  destroyCurrentLevel() {
    if (this.currentLevel && typeof this.currentLevel.destroy === 'function') {
      this.currentLevel.destroy();
    }
    if (this.gameLoopId) {
      cancelAnimationFrame(this.gameLoopId);
      this.gameLoopId = null;
    }
  }

  clearCanvas() {
    if (!this.canvas) return;
    const ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  transitionToLevel() {
    this.destroyCurrentLevel();
    this.clearCanvas();

    const levels = this.isPlatformerActive ? this.platformerLevels : this.rpgLevels;
    const GameLevelClass = levels[this.currentLevelIndex];

    if (!GameLevelClass) {
      alert("Invalid level index or missing level class!");
      this.currentLevelIndex = 0;
      return;
    }

    if (this.isPlatformerActive) {
      console.log(`Creating platformer level index ${this.currentLevelIndex}`, GameLevelClass);
      this.currentLevel = new GameLevelClass(this, this.canvas);
      this.currentLevel.continue = true;
      if (typeof this.currentLevel.create === 'function') {
        this.currentLevel.create();
        console.log('Platformer level created.');
      } else {
        console.warn('Platformer level missing create() method.');
      }
    } else {
      console.log(`Creating RPG level index ${this.currentLevelIndex}`, GameLevelClass);
      this.currentLevel = new GameLevel(this, this.canvas);
      this.currentLevel.create(GameLevelClass);
    }

    this.isPaused = false;
    this.gameLoopCounter = 0;
    this.gameLoop();
  }

  gameLoop() {
    if (!this.currentLevel || !this.currentLevel.continue) {
      this.handleLevelEnd();
      return;
    }
    if (this.isPaused) return;

    if (typeof this.currentLevel.update === 'function') {
      this.currentLevel.update();
    }

    this.gameLoopCounter++;
    this.gameLoopId = requestAnimationFrame(() => this.gameLoop());
  }

  handleLevelEnd() {
    this.destroyCurrentLevel();

    if (this.isPlatformerActive) {
      if (this.platformerLevels.length === 1) {
        console.log("Only one platformer level. Stopping the game loop.");
        this.isPaused = true;
        return;
      } else if (this.currentLevelIndex < this.platformerLevels.length - 1) {
        alert("Platformer level ended. Moving to next level.");
        this.currentLevelIndex++;
      } else {
        alert("All platformer levels completed!");
        this.currentLevelIndex = 0;
      }
    } else {
      if (this.currentLevelIndex < this.rpgLevels.length - 1) {
        alert("RPG level ended. Moving to next level.");
        this.currentLevelIndex++;
      } else {
        alert("All RPG levels completed!");
        this.currentLevelIndex = 0;
      }
    }

    this.transitionToLevel();
  }

  handleExitKey(event) {
    if (event.key === 'Escape') {
      if (this.currentLevel) {
        this.currentLevel.continue = false;
      }
    }
  }

  addExitKeyListener() {
    document.addEventListener('keydown', this.exitKeyListener);
  }

  removeExitKeyListener() {
    document.removeEventListener('keydown', this.exitKeyListener);
  }

  pause() {
    this.isPaused = true;
    this.removeExitKeyListener();
    this.destroyCurrentLevel();
  }

  resume() {
    this.isPaused = false;
    this.addExitKeyListener();
    this.transitionToLevel();
  }

  nextLevel() {
    const levels = this.isPlatformerActive ? this.platformerLevels : this.rpgLevels;
    this.currentLevelIndex = (this.currentLevelIndex + 1) % levels.length;
    this.transitionToLevel();
  }

  restartLevel() {
    if (this.currentLevel && typeof this.currentLevel.destroy === 'function') {
      this.currentLevel.destroy();
    }
    this.gameLoopCounter = 0;
    this.transitionToLevel();
  }

  switchToPlatformer() {
    console.log("Switching to platformer...");
    this.destroyCurrentLevel();
    this.isPlatformerActive = true;
    this.currentLevelIndex = 0;
    this.isPaused = false;
    this.transitionToLevel();
  }

  switchToRPG() {
    console.log("Switching back to RPG...");
    this.destroyCurrentLevel();
    this.isPlatformerActive = false;
    this.currentLevelIndex = 0;
    this.isPaused = false;
    this.transitionToLevel();
  }
}

export default GameControl;
