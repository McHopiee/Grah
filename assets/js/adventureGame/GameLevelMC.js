// To build GameLevels, each contains GameObjects from below imports
import Background from './Background.js';
import Player from './Player.js';
import Npc from './Npc.js';
import GameControl from './GameControl.js';
import Creeper from './Creeper.js';
import GameSetterOverworld from '../platformer3x/GameSetterOverworld.js';

class GameLevelMC {
  constructor(gameEnv) {
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    // Background image info
    const image_src_main = path + "/images/gamify/maine_RPG.png";
    const image_data_main = {
      name: 'main',
      greeting: "Welcome to the main hub of Overwold.",
      src: image_src_main,
      pixels: { height: 320, width: 480 }
    };

    // Player sprite info
    const sprite_src_player = path + "/images/gamify/steve.png";
    const PLAYER_SCALE_FACTOR = 5;
    const sprite_data_player = {
      id: 'Player',
      greeting: "I am Steve.",
      src: sprite_src_player,
      SCALE_FACTOR: PLAYER_SCALE_FACTOR,
      STEP_FACTOR: 800,
      ANIMATION_RATE: 50,
      INIT_POSITION: { x: 0, y: height - (height / PLAYER_SCALE_FACTOR) },
      pixels: { height: 1500, width: 600 },
      orientation: { rows: 4, columns: 3 },
      down: { row: 0, start: 0, columns: 3 },
      downRight: { row: 2, start: 0, columns: 3, rotate: Math.PI / 16 },
      downLeft: { row: 1, start: 0, columns: 3, rotate: -Math.PI / 16 },
      left: { row: 1, start: 0, columns: 3 },
      right: { row: 2, start: 0, columns: 3 },
      up: { row: 3, start: 0, columns: 3 },
      upLeft: { row: 1, start: 0, columns: 3, rotate: Math.PI / 16 },
      upRight: { row: 2, start: 0, columns: 3, rotate: -Math.PI / 16 },
      hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
      keypress: { up: 87, left: 65, down: 83, right: 68 }
    };

    // Creeper sprite info with movement and animation
    const sprite_src_creeper = path + "/images/gamify/creepa.png";
    const sprite_greet_creeper = "KABOOM!!";
    const sprite_data_creeper = {
      id: 'Creeper',
      greeting: sprite_greet_creeper,
      src: sprite_src_creeper,
      SCALE_FACTOR: 4,
      ANIMATION_RATE: 25,
      pixels: { height: 1200, width: 1600 },
      INIT_POSITION: { x: 100, y: 100 },
      orientation: { rows: 1, columns: 2 },
      down: { row: 0, start: 0, columns: 2 },
      right: { row: 0, start: 0, columns: 2 },
      left: { row: 0, start: 0, columns: 2 },
      up: { row: 0, start: 0, columns: 2 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
      walkingArea: {
        xMin: width / 10,
        xMax: (width * 5 / 7),
        yMin: height / 4,
        yMax: (height * 8 / 15)
      },
      speed: 10,
      direction: { x: 1, y: 1 },

      sound: new Audio(path + "/sounds/creeper.mp3"),

      updatePosition: function () {
        this.INIT_POSITION.x += this.direction.x * this.speed;
        this.INIT_POSITION.y += this.direction.y * this.speed;

        if (this.INIT_POSITION.x <= this.walkingArea.xMin) {
          this.INIT_POSITION.x = this.walkingArea.xMin;
          this.direction.x = 1;
        }
        if (this.INIT_POSITION.x >= this.walkingArea.xMax) {
          this.INIT_POSITION.x = this.walkingArea.xMax;
          this.direction.x = -1;
        }
        if (this.INIT_POSITION.y <= this.walkingArea.yMin) {
          this.INIT_POSITION.y = this.walkingArea.yMin;
          this.direction.y = 1;
        }
        if (this.INIT_POSITION.y >= this.walkingArea.yMax) {
          this.INIT_POSITION.y = this.walkingArea.yMax;
          this.direction.y = -1;
        }

        // Update DOM element if present
        const spriteElement = document.getElementById(this.id);
        if (spriteElement) {
          spriteElement.style.transform = this.direction.x === -1 ? "scaleX(-1)" : "scaleX(1)";
          spriteElement.style.left = this.INIT_POSITION.x + 'px';
          spriteElement.style.top = this.INIT_POSITION.y + 'px';
        }
      },
      isAnimating: false,
      playAnimation: function () {
        if (this.isAnimating) return;
        this.isAnimating = true;

        const spriteElement = document.getElementById(this.id);
        if (!spriteElement) {
          this.isAnimating = false;
          return;
        }

        this.sound.play();

        spriteElement.style.transition = 'filter 1s ease-in-out';
        spriteElement.style.filter = 'brightness(3) saturate(0)';

        setTimeout(() => {
          spriteElement.style.filter = 'none';
          setTimeout(() => {
            spriteElement.style.transition = '';
            this.isAnimating = false;
          }, 1000);
        }, 1000);
      }
    };

    // Schedule creeper movement updates every 100ms
    setInterval(() => {
      sprite_data_creeper.updatePosition();
    }, 100);

    // Schedule creeper animation every 5 seconds
    setInterval(() => {
      sprite_data_creeper.playAnimation();
    }, 5000);

    // Villager sprite info and interaction
    const sprite_src_villager = path + "/images/gamify/villager.png";
    const sprite_greet_villager = "Aur aur aur";
    const sprite_data_villager = {
      id: 'Villager',
      greeting: sprite_greet_villager,
      src: sprite_src_villager,
      SCALE_FACTOR: 6,
      ANIMATION_RATE: 100,
      pixels: { width: 700, height: 1400 },
      INIT_POSITION: { x: (width * 10 / 11), y: (height * 1 / 40) },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },

      reaction: function () {
        alert(sprite_greet_villager);
      },

      interact: async function () {
        if (confirm("Would you like to play the platformer challenge?")) {
          if (typeof window.startPlatformerLevel === "function") {
            // Pass the platformer level class in an array
            window.startPlatformerLevel([GameSetterOverworld]);
          } else if (this.gameControl) {
            // Fallback if gameControl is defined (not always the case)
            this.gameControl.levelClasses = [GameSetterOverworld];
            this.gameControl.currentLevelIndex = 0;
            this.gameControl.restartLevel();
          } else {
            alert("Platformer loader not found. Please implement window.startPlatformerLevel([GameSetterOverworld]) or provide gameControl.");
          }
        }
      }
    };

    // Proximity check + listen for 'e' key to interact with villager
    setTimeout(() => {
      function checkProximityAndListen() {
        const dx = (sprite_data_player.INIT_POSITION.x || 0) - (sprite_data_villager.INIT_POSITION.x || 0);
        const dy = (sprite_data_player.INIT_POSITION.y || 0) - (sprite_data_villager.INIT_POSITION.y || 0);
        const near = Math.abs(dx) < 100 && Math.abs(dy) < 100;

        if (near) {
          function onE(e) {
            if (e.key.toLowerCase() === 'e') {
              sprite_data_villager.interact();
              // Remove listener after one interaction
              document.removeEventListener('keydown', onE);
            }
          }
          // Add keydown listener once player is near villager
          document.addEventListener('keydown', onE);
        } else {
          // Keep checking proximity every 300ms
          setTimeout(checkProximityAndListen, 300);
        }
      }
      checkProximityAndListen();
    }, 1000);

    // Store all classes and data to be used by GameControl or game runner
    this.classes = [
      { class: Background, data: image_data_main },
      { class: Player, data: sprite_data_player },
      { class: Npc, data: sprite_data_villager },
      { class: Creeper, data: sprite_data_creeper },
      { class: GameControl, data: {} }
    ];
  }
}

export default GameLevelMC;
