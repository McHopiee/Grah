// GameSetterOverworld.js
// Key objective is to define objects for a Minecraft-themed GameLevel
import GameSet from './GameSet.js';
// To build GameLevels, each contains GameObjects from below imports
import BackgroundParallax from './BackgroundParallax.js';
import BackgroundTransitions from './BackgroundTransitions.js';
import Platform from './Platform.js';
import JumpPlatform from './PlatformJump.js';
import PlayerOverworld from './PlayerOverworld.js';
import Creeper from './EnemyCreeper.js';
import Enderman from './EnemyEnderman.js';
import MovingPlatform from './PlatformMoving.js';
import Coin from './Coin.js';          // Could be replaced with Minecraft collectible like emeralds
import FinishLine from './FinishLine.js';
import BlockPlatform from './BlockPlatform.js';

// Define the GameSetup object literal with Minecraft-themed assets
const assets = {  
  obstacles: {
    tube: { 
      src: "/images/gamify/nether.png",
      hitbox: { widthPercentage: 0.5, heightPercentage: 0.5},
      width: 300,
      height: 300,
      scaleSize: 100,
    },
    coin: { 
      src: "/images/gamify/emerald.png" 
    },
  },
  platforms: {
    grass: { src: "/images/gamify/grass_block.png" },
    bricks: { src: "/images/gamify/stone_bricks.png" },
    block: { src: "/images/gamify/stone_block.png" }, 
    itemBlock: {
      src: "/images/gamify/chest.png",
      sizeRatio: 83.2,
      widthRatio: 0.5,
      heightRatio: 1.0,
      width: 204,
      height: 204,
      scaleSize: 80,
      speedRatio: 0.7,
      hitbox: { widthPercentage: 0.4, heightPercentage: -0.2 }
    }
  },
  backgrounds: {
    mountains: { src: "/images/gamify/taiga.png", parallaxSpeed: 0.1, moveOnKeyAction: true },
    clouds: { src: "/images/gamify/mcclouds.png", parallaxSpeed: 0.5 },
  },
  transitions: {
    loading: { src: "/images/gamify/loading.png" },
  },
  players: {
    overworld: {
      src: "/images/minecraft/sprites/steveTwo.png",
      width: 256,
      height: 256,
      scaleSize: 80,
      speedRatio: 0.7,
      idle: {
        left: { row: 1, frames: 15 },
        right: { row: 0, frames: 15 },
      },
      walk: {
        left: { row: 3, frames: 7 },
        right: { row: 2, frames: 7 },
      },
      run: {
        left: { row: 5, frames: 15 },
        right: { row: 4, frames: 15 },
      },
      jump: {
        left: { row: 11, frames: 15 },
        right: { row: 10, frames: 15 },
      },
      hitbox: { widthPercentage: 0.3, heightPercentage: 0.8 }
    },
  },
  enemies: {
    creeper: {
      src: "/images/gamify/creeper.png",
      width: 448,
      height: 452,
      scaleSize: 60,
      speedRatio: 0.7,
      xPercentage: 0.6,
      hitbox: { widthPercentage: 0.0, heightPercentage: 0.2 }
    },
    enderman: {
      src: "/images/gamify/enderman.png",
      width: 448,
      height: 452,
      scaleSize: 60,
      speedRatio: 0.7,
    },
  }
};

// Minecraft Overworld Game Level definition...
const objects = [
  { name: 'mountains', id: 'background', class: BackgroundParallax, data: assets.backgrounds.mountains },
  { name: 'clouds', id: 'background', class: BackgroundParallax, data: assets.backgrounds.clouds },
  { name: 'grass', id: 'floor', class: Platform, data: assets.platforms.grass },
  { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.block, xPercentage: 0.2, yPercentage: 0.85 },
  { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.block, xPercentage: 0.2368, yPercentage: 0.85 },
  { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.block, xPercentage: 0.2736, yPercentage: 0.85 },
  { name: 'blocks', id: 'wall', class: BlockPlatform, data: assets.platforms.block, xPercentage: 0.6, yPercentage: 1 },
  { name: 'itemBlock', id: 'jumpPlatform', class: JumpPlatform, data: assets.platforms.itemBlock, xPercentage: 0.4, yPercentage: 0.65 }, //item block is a platform
  { name: 'creeper', id: 'creeper', class: Creeper, data: assets.enemies.creeper, xPercentage: 0.5, yPercentage: 1, minPosition: 0.05 },
  { name: 'creeper', id: 'creeper', class: Creeper, data: assets.enemies.creeper, xPercentage: 0.4, yPercentage: 1, minPosition: 0.05, difficulties: ["normal", "hard", "impossible"] },
  { name: 'creeper', id: 'creeper', class: Creeper, data: assets.enemies.creeper, xPercentage: 0.3, yPercentage: 1, minPosition: 0.05, difficulties: ["normal", "hard", "impossible"] },
  { name: 'creeper', id: 'creeper', class: Creeper, data: assets.enemies.creeper, xPercentage: 0.2, yPercentage: 1, minPosition: 0.05, difficulties: ["hard", "impossible"] },
  { name: 'creeper', id: 'creeper', class: Creeper, data: assets.enemies.creeper, xPercentage: 0.1, yPercentage: 1, minPosition: 0.05, difficulties: ["impossible"] },
  { name: 'creeperSpecial', id: 'creeper', class: Creeper, data: assets.enemies.creeper, xPercentage: 0.75, yPercentage: 1, minPosition: 0.5 },
  { name: 'creeperSpecial', id: 'creeper', class: Creeper, data: assets.enemies.creeper, xPercentage: 0.95, yPercentage: 1, minPosition: 0.5, difficulties: ["hard", "impossible"] },
  { name: 'enderman', id: 'enderman', class: Enderman, data: assets.enemies.enderman, xPercentage: 0.9, minPosition: 0.5, difficulties: ["normal", "hard", "impossible"] },
  { name: 'enderman', id: 'enderman', class: Enderman, data: assets.enemies.enderman, xPercentage: 0.9, minPosition: 0.5, difficulties: ["hard", "impossible"] },
  { name: 'enderman', id: 'enderman', class: Enderman, data: assets.enemies.enderman, xPercentage: 0.9, minPosition: 0.5, difficulties: ["impossible"] },
  { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.coin, xPercentage: 0.1908, yPercentage: 0.75 },
  { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.coin, xPercentage: 0.2242, yPercentage: 0.75 },
  { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.coin, xPercentage: 0.2575, yPercentage: 0.75 },
  { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.coin, xPercentage: 0.5898, yPercentage: 0.900 },
  { name: 'player', id: 'player', class: PlayerOverworld, data: assets.players.overworld },
  { name: 'portal', id: 'finishline', class: FinishLine, data: assets.obstacles.tube, xPercentage: 0.85, yPercentage: 0.855 },
  { name: 'loading', id: 'background', class: BackgroundTransitions, data: assets.transitions.loading },
];

const GameSetterOverworld = {
  tag: 'Overworld',
  assets: assets,
  objects: objects
};

export default GameSetterOverworld;
