import Background from './Background.js';
import Npc from './Npc.js';
import Player from './Player.js';

class GameLevelFinale {
  /**
   * Properties and methods to define a game level
   * @param {*} gameEnv - The active game environment
   */
  constructor(gameEnv) {
    // Dependencies to support game level creation
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    // Background data
    const image_src_finale = path + "/images/gamify/finale.jpg"; // be sure to include the path
    const image_data_finale = {
        id: 'Finale',
        src: image_src_finale,
        pixels: {height: 692, width: 1154},
    };


    // Player Data for Octopus
    const sprite_src_degen = path + "/images/gamify/degen.png"; // be sure to include the path
    const DEGEN_SCALE_FACTOR = 7;
    const sprite_data_degen = {
        id: 'Degen',
        greeting: "I don't remember my name..but I remember a lot of people around me used to call me degen. I guess that's what I'll be called for now.",
        src: sprite_src_degen,
        SCALE_FACTOR: DEGEN_SCALE_FACTOR,  // Adjust this based on your scaling needs
        STEP_FACTOR: 250,
        ANIMATION_RATE: 20,
        INIT_POSITION: { x: 0, y: height - (height/DEGEN_SCALE_FACTOR) }, 
        pixels: {height: 600, width: 520},
        orientation: {rows: 4, columns: 4 },
        down: {row: 0, start: 0, columns: 4 },
        downRight: {row: 1, start: 0, columns: 4, rotate: Math.PI/16 },
        downLeft: {row: 2, start: 0, columns: 4, rotate: -Math.PI/16 },
        left: {row: 2, start: 0, columns: 4 },
        right: {row: 1, start: 0, columns: 4 },
        up: {row: 3, start: 0, columns: 4 },
        upLeft: {row: 2, start: 0, columns: 4, rotate: Math.PI/16 },
        upRight: {row: 1, start: 0, columns: 4, rotate: -Math.PI/16 },
        hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
        keypress: { up: 87, left: 65, down: 83, right: 68 } // W, A, S, D
    };

    // NPC Data for Arceus
    const sprite_src_arceus = path + "/images/gamify/arceus.png"; // be sure to include the path
    const sprite_greet_arceus = "Welcome to the end.";
    const sprite_data_arceus = {
        id: 'Arceus',
        greeting: sprite_greet_arceus,
        src: sprite_src_arceus,
        SCALE_FACTOR: 2,  // Adjust this based on your scaling needs
        ANIMATION_RATE: 45,
        pixels: {height: 70, width: 180},
        INIT_POSITION: { x: (width / 2.4), y: (height / 2.3)},
        orientation: {rows: 1, columns: 4 },
        down: {row: 0, start: 0, columns: 4 },  // This is the stationary npc, down is default 
        hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
        reaction: function() {
          alert(sprite_greet_arceus);
        },
        /* Interact function
    *  This function is called when the player interacts with the NPC
    *  It congratulates the player for finishing the game
    */
        interact: function() {
          alert("You have reached the end. You managed to get yourself out of your head and into the real world. Welcome back. ( You have completed the game. Thank you for playing. )");
  }
};

    // List of classes and supporting definitions to create the game level
    this.classes = [
      { class: Background, data: image_data_finale },
      { class: Player, data: sprite_data_degen },
      { class: Npc, data: sprite_data_arceus },
    ];

    //button hack 
    const BGbutton = document.createElement('button'); // create the button 
    BGbutton.innerText = "Easter Egg";
    BGbutton.style.position = "absolute";
    BGbutton.style.top = "10px"; 
    BGbutton.style.right = "10px"; // top and right makes it so the button is on the top right
    BGbutton.style.zIndex = "1000"; // should be on top of the other things 
    BGbutton.style.backgroundColor = "white";
    BGbutton.style.border = "2px solid black";
    BGbutton.style.borderRadius = "5px";
    BGbutton.style.padding = "10px";
    BGbutton.style.cursor = "pointer"; // button styling thingamajigs 

    // event listener, when button is clicked it changes the bg 
    const alternate_background = path + "/images/gamify/spacee.jpg"; // path to the alternate background image
    let currentBackground = image_src_finale; // default background
    BGbutton.addEventListener('click', () => {
      currentBackground = currentBackground === image_src_finale ? alternate_background : image_src_finale;
      image_data_finale.src = currentBackground;
      console.log("Background changed to: " + currentBackground);
    });

    document.body.appendChild(BGbutton); 
  }
}

export default GameLevelFinale;