import GameSet from './GameSet.js';
import BackgroundPlat from './PlatformerEngine/BackgroundPlat.js';

// Define the assets
const assets = {
    backgrounds: {
        start: { src: "/images/platformer/backgrounds/home.png" },
    },
};

// Hills Game Level definition...
const objects = [
    {
        name: 'start',
        id: 'background',
        // Instead of directly referencing the class, use a getter function
        get class() {
            return BackgroundPlat;
        },
        data: assets.backgrounds.start
    },
];

const GameSetterStart = {
    tag: 'Start',
    assets: assets,
    objects: objects
};

export default GameSetterStart;
