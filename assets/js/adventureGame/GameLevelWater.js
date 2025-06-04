import Background from './Background.js';
import Npc from './Npc.js';
import Player from './Player.js';
import GameControl from './GameControl.js';
import Shark from './Shark.js';
import Pufferfish from './Pufferfish.js'; 
import Goldfish from './Goldfish.js';

class GameLevelWater {
  constructor(gameEnv) {
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    const image_src_water = path + "/images/gamify/deepseadungeon.jpeg";
    const image_data_water = {
      id: 'Water',
      src: image_src_water,
      pixels: { height: 597, width: 340 }
    };

    const sprite_src_octopus = path + "/images/gamify/octopus.png";
    const OCTOPUS_SCALE_FACTOR = 5;
    const sprite_data_octopus = {
      id: 'Octopus',
      greeting: "Hi I am Octopus, the water wanderer. I am looking for wisdom and adventure!",
      src: sprite_src_octopus,
      SCALE_FACTOR: OCTOPUS_SCALE_FACTOR,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 50,
      GRAVITY: true,
      INIT_POSITION: { x: 0, y: height - (height / OCTOPUS_SCALE_FACTOR) },
      pixels: { height: 250, width: 167 },
      orientation: { rows: 3, columns: 2 },
      down: { row: 0, start: 0, columns: 2 },
      downLeft: { row: 0, start: 0, columns: 2, mirror: true, rotate: Math.PI / 16 },
      downRight: { row: 0, start: 0, columns: 2, rotate: -Math.PI / 16 },
      left: { row: 1, start: 0, columns: 2, mirror: true },
      right: { row: 1, start: 0, columns: 2 },
      up: { row: 0, start: 0, columns: 2 },
      upLeft: { row: 1, start: 0, columns: 2, mirror: true, rotate: -Math.PI / 16 },
      upRight: { row: 1, start: 0, columns: 2, rotate: Math.PI / 16 },
      hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
      keypress: { up: 87, left: 65, down: 83, right: 68 }
    };

    const sprite_src_nomad = path + "/images/gamify/animwizard.png";
    const sprite_data_nomad = {
      id: 'JavaWorld',
      greeting: "Hi I am Java Portal. Leave this world and go on a Java adventure!",
      src: sprite_src_nomad,
      SCALE_FACTOR: 10,
      ANIMATION_RATE: 100,
      pixels: { height: 307, width: 813 },
      INIT_POSITION: { x: (width * 3 / 4), y: (height * 3 / 4) },
      orientation: { rows: 3, columns: 7 },
      down: { row: 1, start: 0, columns: 6 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
      interact: function () {
        let primaryGame = gameEnv.gameControl;
        let levelArray = [GameLevelWater];
        let gameInGame = new GameControl(path, levelArray);
        primaryGame.pause();
        gameInGame.start();
        gameInGame.gameOver = function () {
          primaryGame.resume();
        }
      }
    };

    const sprite_src_shark = path + "/images/gamify/shark.png";
    const sprite_data_shark = {
      id: 'Shark',
      greeting: "Enemy Shark",
      src: sprite_src_shark,
      SCALE_FACTOR: 5,
      ANIMATION_RATE: 100,
      pixels: { height: 225, width: 225 },
      INIT_POSITION: { x: 100, y: 100 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.25, heightPercentage: 0.55 },
      walkingArea: {
        xMin: 0,
        xMax: width - 100,
        yMin: 0,
        yMax: height / 4
      },
      speed: 10,
      direction: { x: 1, y: 1 },
      sound: new Audio(path + "/sounds/shark.mp3"),
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
        if (!spriteElement) return;

        this.sound.play();
        const particleCount = 20;

        for (let i = 0; i < particleCount; i++) {
          const particle = document.createElement('div');
          particle.className = 'splash-particle';
          particle.style.position = 'absolute';
          particle.style.left = `${spriteElement.offsetLeft + spriteElement.offsetWidth / 3}px`;
          particle.style.top = `${spriteElement.offsetTop + spriteElement.offsetHeight / 3}px`;
          particle.style.width = '6px';
          particle.style.height = '6px';
          particle.style.borderRadius = '50%';
          particle.style.backgroundColor = 'aqua';
          particle.style.pointerEvents = 'none';
          particle.style.zIndex = 1000;
          particle.style.opacity = 1;
          particle.style.transition = 'transform 1s ease-out, opacity 1s ease-out';

          const angle = Math.random() * 2 * Math.PI;
          const distance = 60 + Math.random() * 40;
          const x = Math.cos(angle) * distance;
          const y = Math.sin(angle) * distance;

          document.body.appendChild(particle);
          requestAnimationFrame(() => {
            particle.style.transform = `translate(${x}px, ${y}px)`;
            particle.style.opacity = 0;
          });

          setTimeout(() => {
            particle.remove();
          }, 1000);
        }

        setTimeout(() => {
          this.isAnimating = false;
        }, 1000);
      }
    };

    setInterval(() => {
      sprite_data_shark.updatePosition();
    }, 100);
    setInterval(() => {
      sprite_data_shark.playAnimation();
    }, 1000);

    const sprite_src_puffer = path + "/images/gamify/puffer.png";
    const sprite_data_puffer = {
      id: 'Pufferish',
      greeting: "Enemy Pufferfish",
      src: sprite_src_puffer,
      SCALE_FACTOR: 5,
      ANIMATION_RATE: 10,
      pixels: { height: 100, width: 200 },
      orientation: { rows: 1, columns: 2 },
      down: { row: 0, start: 0, columns: 2 },
      hitbox: { widthPercentage: 0.25, heightPercentage: 0.55 }
    };

    const sprite_src_gold = path + "/images/gamify/gold.png";
    const sprite_data_gold = {
      id: 'Goldfish',
      greeting: "Enemy Goldfish",
      src: sprite_src_gold,
      SCALE_FACTOR: 5,
      ANIMATION_RATE: 10,
      pixels: { height: 100, width: 200 },
      orientation: { rows: 1, columns: 2 },
      down: { row: 0, start: 0, columns: 2 },
      hitbox: { widthPercentage: 0.25, heightPercentage: 0.55 }
    };

    // Updated setupRandomMotion to ensure no clipping off-screen
    function setupRandomMotion(spriteData, yOffset = 0) {
      spriteData.direction = { x: Math.random() < 0.5 ? -1 : 1 };
      spriteData.speed = 5;
      const spriteWidth = spriteData.pixels.width / spriteData.SCALE_FACTOR;

      spriteData.INIT_POSITION = {
        x: Math.random() * (width - spriteWidth),
        y: height / 2 + yOffset
      };

      setInterval(() => {
        spriteData.INIT_POSITION.x += spriteData.direction.x * spriteData.speed;

        if (spriteData.INIT_POSITION.x < 0) {
          spriteData.INIT_POSITION.x = 0;
          spriteData.direction.x = 1;
        }
        if (spriteData.INIT_POSITION.x > width - spriteWidth) {
          spriteData.INIT_POSITION.x = width - spriteWidth;
          spriteData.direction.x = -1;
        }

        if (Math.random() < 0.03) {
          spriteData.direction.x *= -1;
        }

        const spriteElement = document.getElementById(spriteData.id);
        if (spriteElement) {
          spriteElement.style.transform = spriteData.direction.x === -1 ? "scaleX(-1)" : "scaleX(1)";
          spriteElement.style.left = spriteData.INIT_POSITION.x + 'px';
          spriteElement.style.top = spriteData.INIT_POSITION.y + 'px';
        }
      }, 100);
    }

    setupRandomMotion(sprite_data_puffer, 0);
    setupRandomMotion(sprite_data_gold, 100);

    this.classes = [
      { class: Background, data: image_data_water },
      { class: Player, data: sprite_data_octopus },
      { class: Npc, data: sprite_data_nomad },
      { class: Shark, data: sprite_data_shark },
      { class: Pufferfish, data: sprite_data_puffer },
      { class: Goldfish, data: sprite_data_gold },
    ];
  }
}

export default GameLevelWater;
