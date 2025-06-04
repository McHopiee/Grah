// GameSetHills.js Key objective is to define objects for a GameLevel
import GameSet from './GameSet.js';
// To build GameLevels, each contains GameObjects from below imports
import BackgroundPlat from './PlatformerEngine/BackgroundPlat.js'

// Define the assets
const assets = {  
  backgrounds: {
    end: { src: "/images/platformer/backgrounds/game_over.png" },
  },
};

// Hills Game Level definition...
const objects = [
  // GameObject(s), the order is important to z-index...
  { 
    name: 'end', 
    id: 'background', 
    get class() { 
      return BackgroundPlat; 
    }, 
    data: assets.backgrounds.end 
  },
];

const GameSetterEnd = {
  tag: 'End',
  assets: assets,
  objects: objects
};

export default GameSetterEnd;
