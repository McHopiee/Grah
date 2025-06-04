// GameControl.js

import GameEnv from './GameEnv.js';
import GameLevel from '../GameLevel.js';
import GameSetup from '../GameSetup.js';
import PlayerZombie from '../PlayerZombie.js';
import SettingsControl from "../SettingsControl.js";
import GameSetterOverworldLevel from '../GameSetterOverworld.js';

const GameControl = {
  intervalID: null,
  inTransition: false,
  localStorageTimeKey: "localTimes",

  startTimer() {
    if (GameEnv.timerActive) {
      console.warn("TIMER ACTIVE: TRUE, TIMER NOT STARTED");
      return;
    }
    this.intervalID = setInterval(() => this.updateTimer(), GameEnv.timerInterval);
    GameEnv.timerActive = true;
  },

  stopTimer() {
    if (!GameEnv.timerActive) return;
    this.saveTime(GameEnv.time, GameEnv.coinScore);
    GameEnv.timerActive = false;
    GameEnv.time = 0;
    GameEnv.coinScore = 0;
    this.updateCoinDisplay();
    clearInterval(this.intervalID);
  },

  saveTime(time, coins) {
    if (typeof localStorage === "undefined") return;
    const existingData = JSON.parse(localStorage.getItem(this.localStorageTimeKey)) || [];
    existingData.push({ time, coins, date: new Date().toISOString() });
    localStorage.setItem(this.localStorageTimeKey, JSON.stringify(existingData));
  },

  updateTimer() {
    if (!GameEnv.timerActive) return;
    GameEnv.time += GameEnv.timerInterval;
    const timeScoreEl = document.getElementById('timeScore');
    if (timeScoreEl) {
      timeScoreEl.textContent = (GameEnv.time / 1000).toFixed(2);
    }
  },

  updateCoinDisplay() {
    const coins = GameEnv.coinScore;
    const coinDisplay = document.getElementById('coinScore');
    if (!coinDisplay) {
      console.error("COIN DISPLAY DOES NOT EXIST");
      return;
    }
    coinDisplay.textContent = coins;
  },

  async transitionToLevel(newLevel) {
    this.inTransition = true;
    GameEnv.destroy();

    if (GameEnv.currentLevel !== newLevel) {
      GameEnv.claimedCoinIds = [];
    }

    await newLevel.load();
    GameEnv.currentLevel = newLevel;

    GameEnv.setInvert();
    window.dispatchEvent(new Event('resize'));

    this.inTransition = false;
  },

  gameLoop() {
    if (!this.inTransition) {
      GameEnv.update();

      const currentLevel = GameEnv.currentLevel;
      if (currentLevel) {
        if (currentLevel.isComplete && currentLevel.isComplete()) {
          const currentIndex = GameEnv.levels.indexOf(currentLevel);
          if (currentIndex !== -1 && currentIndex + 1 < GameEnv.levels.length) {
            this.transitionToLevel(GameEnv.levels[currentIndex + 1]);
          } else {
            // All levels complete, but no pop-up or alert
            this.stop(); // Stop the game silently
            return; // Exit early to avoid calling requestAnimationFrame
          }
        }
      } else {
        if (GameEnv.levels.length > 0) {
          this.transitionToLevel(GameEnv.levels[0]);
        }
      }
    }
    this._animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
  },

  async start() {
    if (this.inTransition) return;

    this.inTransition = true;

    GameEnv.reset();

    GameEnv.levels = [new GameSetterOverworldLevel(GameEnv)];

    if (GameEnv.levels.length > 0) {
      GameEnv.currentLevel = GameEnv.levels[0];
      await GameEnv.currentLevel.load();
    } else {
      console.error("No platformer levels loaded!");
    }

    GameEnv.setInvert();

    GameEnv.time = 0;
    GameEnv.coinScore = 0;
    this.updateCoinDisplay();

    this.startTimer();
    this.inTransition = false;
    this.gameLoop();
  },

  stop() {
    this.inTransition = true;

    this.stopTimer();

    if (this._animationFrameId) {
      cancelAnimationFrame(this._animationFrameId);
      this._animationFrameId = null;
    }

    GameEnv.destroy();
    GameEnv.currentLevel = null;
    GameEnv.levels = [];
    GameEnv.player = null;

    this.inTransition = false;
  }
};

export default GameControl;
