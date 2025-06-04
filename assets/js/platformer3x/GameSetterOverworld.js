// GameSetterOverworld.js

import BackgroundPlat from './PlatformerEngine/BackgroundPlat.js';
import BackgroundTransitions from './BackgroundTransitions.js';
import Platform from './Platform.js';
import PlayerSteve from './PlayerSteve.js';
import BlockPlatform from './BlockPlatform.js';
import MovingPlatform from './PlatformMoving.js';
import Sword from './Sword.js';
import Zombie from './EnemyZombie.js';
import Chicken from './Chicken.js';
import FinishLine from './FinishLine.js';  

const path = "/Grah_Blog"

// ASSETS: Minecraft-style images
const assets = {
  obstacles: {
    grassBlock: { src: path + "/images/gamify/grass_block.jpg" },
    sword: { src: path + "/images/gamify/sword.jpg" },
  },
  backgrounds: {
    overworld: { src: path + "/images/gamify/mcbackground.jpg" },
  },
  players: {
    steve: {
      src: path + "/images/gamify/steve.png",
      width: 32,
      height: 32,
      scaleSize: 60,
      speedRatio: 0.7,
      idle: { left: { row: 1, frames: 0 }, right: { row: 2, frames: 0 } },
      walk: { left: { row: 1, frames: 5 }, right: { row: 2, frames: 5 } },
      run: { left: { row: 1, frames: 5 }, right: { row: 2, frames: 5 } },
      jump: { left: { row: 1, frames: 0 }, right: { row: 2, frames: 0 } },
      hitbox: { widthPercentage: 0.3, heightPercentage: 0.8 }
    },
  },
  enemies: {
    zombie: {
      src: path + "/images/gamify/zombie.png",
      width: 32,
      height: 32,
      scaleSize: 60,
      speedRatio: 0.5,
    },
  },
  npcs: {
    chicken: { src: path + "/images/gamify/chicken.png", width: 32, height: 32, scaleSize: 60 },
  },
  transitions: {
    end: { src: path + "/images/gamify/loading.jpg" },
  },
};

// OBJECTS in the level
const objects = [
  { name: 'overworld', id: 'background', class: BackgroundPlat, data: assets.backgrounds.overworld },
  { name: 'ground', id: 'platform', class: Platform, data: assets.obstacles.grassBlock },
  { name: 'floating', id: 'jumpPlatform', class: BlockPlatform, data: assets.obstacles.grassBlock, xPercentage: 0.2, yPercentage: 0.7 },
  { name: 'floating', id: 'jumpPlatform', class: BlockPlatform, data: assets.obstacles.grassBlock, xPercentage: 0.3, yPercentage: 0.6 },
  { name: 'floating', id: 'jumpPlatform', class: BlockPlatform, data: assets.obstacles.grassBlock, xPercentage: 0.4, yPercentage: 0.5 },
  { name: 'sword', id: 'sword', class: Sword, data: assets.obstacles.sword, xPercentage: 0.3, yPercentage: 0.55 },
  { name: 'zombie', id: 'zombie', class: Zombie, data: assets.enemies.zombie, xPercentage: 0.5, minPosition: 0.1 },
  { name: 'steve', id: 'player', class: PlayerSteve, data: assets.players.steve },
  { name: 'chicken', id: 'npc', class: Chicken, data: assets.npcs.chicken, xPercentage: 0.9, yPercentage: 0.8 },
  { name: 'finish', id: 'finishline', class: FinishLine, data: assets.transitions.end, xPercentage: 0.95, yPercentage: 0.85 }
];

// --- Chicken Interaction Feature ---

// Helper: Show dialogue box
function showDialogueBox(message, onClose) {
  let box = document.createElement('div');
  box.id = 'dialogue-box';
  box.style.position = 'fixed';
  box.style.left = '50%';
  box.style.top = '70%';
  box.style.transform = 'translate(-50%, -50%)';
  box.style.background = 'rgba(0,0,0,0.85)';
  box.style.color = '#fff';
  box.style.padding = '24px 32px';
  box.style.borderRadius = '12px';
  box.style.fontSize = '1.2em';
  box.style.zIndex = 9999;
  box.innerText = message;
  document.body.appendChild(box);

  function handleEscape(e) {
    if (e.key === 'Escape') {
      document.body.removeChild(box);
      document.removeEventListener('keydown', handleEscape);
      if (onClose) onClose();
    }
  }
  document.addEventListener('keydown', handleEscape);
}

// Chicken interaction logic
let nearChicken = false;
let dialogueActive = false;

function setupChickenInteraction(gameObjects) {
  const player = gameObjects.find(obj => obj.name === 'steve');
  const chicken = gameObjects.find(obj => obj.name === 'chicken');
  if (!player || !chicken) {
    console.warn("Player or chicken not found in game objects.");
    return;
  }

  console.log("Setup chicken interaction, player and chicken found.");

  // Check proximity each frame
  function checkProximity() {
    const px = player.x ?? (player.xPercentage * window.innerWidth);
    const py = player.y ?? (player.yPercentage * window.innerHeight);
    const cx = chicken.x ?? (chicken.xPercentage * window.innerWidth);
    const cy = chicken.y ?? (chicken.yPercentage * window.innerHeight);
    nearChicken = Math.abs(px - cx) < 60 && Math.abs(py - cy) < 60 && !dialogueActive;
    requestAnimationFrame(checkProximity);
  }
  checkProximity();

  // Listen for 'e' key
  document.addEventListener('keydown', function onE(e) {
    if (e.key === 'e' && nearChicken && !dialogueActive) {
      dialogueActive = true;
      showDialogueBox("Bawk! You saved me! Thank you!", () => {
        dialogueActive = false;
      });
    }
  });
}

// After your game objects are created and added to the game, call this:
if (typeof window !== 'undefined') {
  window.addEventListener('game-objects-ready', (e) => {
    setupChickenInteraction(e.detail.objects);
  });
}

// --- Platformer Level Class for GameControl ---
class GameSetterOverworldLevel {
  constructor(gameEnv) {
    this.tag = 'OverworldPlatformer';
    this.assets = assets;
    this.objects = objects;
    this.classes = objects.map(obj => obj.class);  // FIXED: classes must be array of class constructors
    this.continue = true;
    console.log('GameSetterOverworldLevel created:', this);
  }

  create() {
    console.log("Creating Overworld Platformer Level...");
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('game-objects-ready', { detail: { objects: this.objects } });
      window.dispatchEvent(event);
    }
  }
}

export default GameSetterOverworldLevel;
