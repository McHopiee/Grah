// GameSetMinecraft.js

import Background from './Background.js';
import BackgroundTransitions from './BackgroundTransitions.js';
import Platform from './Platform.js';
import PlayerMinecraft from './PlayerMinecraft.js';
import BlockPlatform from './BlockPlatform.js';
import SpawnPlatform from './PlatformSpawn.js';
import MovingPlatform from './PlatformMoving.js';
import Sword from './Sword.js';
import Zombie from './EnemyZombie.js';
import PigNPC from './PigNPC.js';
import FinishLine from './FinishLine.js';

// ASSETS: Minecraft-style images
const assets = {
  obstacles: {
    grassBlock: { src: "/images/minecraft/grass_block.png" },
    sword: { src: "/images/minecraft/sword.png" },
  },
  backgrounds: {
    overworld: { src: "/images/minecraft/overworld_background.png" },
  },
  players: {
    steve: {
      src: "/images/minecraft/steve.png",
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
      src: "/images/minecraft/zombie.png",
      width: 32,
      height: 32,
      scaleSize: 60,
      speedRatio: 0.5,
    },
  },
  npcs: {
    pig: { src: "/images/minecraft/pig.png", width: 32, height: 32, scaleSize: 60 },
  },
  transitions: {
    end: { src: "/images/platformer/transitions/end.png" },
  },
};

// OBJECTS in the level
const objects = [
  { name: 'overworld', id: 'background', class: Background, data: assets.backgrounds.overworld },

  // Main ground platform
  { name: 'ground', id: 'platform', class: Platform, data: assets.obstacles.grassBlock },

  // Floating blocks
  { name: 'floating', id: 'jumpPlatform', class: BlockPlatform, data: assets.obstacles.grassBlock, xPercentage: 0.2, yPercentage: 0.7 },
  { name: 'floating', id: 'jumpPlatform', class: BlockPlatform, data: assets.obstacles.grassBlock, xPercentage: 0.3, yPercentage: 0.6 },
  { name: 'floating', id: 'jumpPlatform', class: BlockPlatform, data: assets.obstacles.grassBlock, xPercentage: 0.4, yPercentage: 0.5 },

  // Sword pickup on one of the floating blocks
  { name: 'sword', id: 'sword', class: Sword, data: assets.obstacles.sword, xPercentage: 0.3, yPercentage: 0.55 },

  // Moving zombie enemy
  { name: 'zombie', id: 'zombie', class: Zombie, data: assets.enemies.zombie, xPercentage: 0.5, minPosition: 0.1 },

  // Player
  { name: 'steve', id: 'player', class: PlayerMinecraft, data: assets.players.steve },

  // Pig at end
  { name: 'pig', id: 'npc', class: PigNPC, data: assets.npcs.pig, xPercentage: 0.9, yPercentage: 0.8 },

  // Finish line at the pig
  { name: 'finishline', id: 'finishline', class: FinishLine, data: assets.transitions.end, xPercentage: 0.9, yPercentage: 0.8 },
];

// Game config
const GameMinecraft = {
  tag: 'MinecraftPlatformer',
  assets: assets,
  objects: objects
};

export default GameMinecraft;
