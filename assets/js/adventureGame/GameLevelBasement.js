// To build GameLevels, each contains GameObjects from below imports
import Background from './Background.js';
import Player from './GameEngine/Player.js';
import Npc from './GameEngine/Npc.js';
import Quiz from './Quiz.js';
import GameLevelStarWars from './GameLevelStarWars.js';

class GameLevelBasement {
  constructor(gameEnv) {
    // Values dependent on this.gameEnv.create()
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    // Background data
    const image_src_basement = path + "/images/gamify/basement.png"; // be sure to include the path
    const image_data_basement = {
        name: 'basement',
        greeting: "Where are you? Your head hurts so much. Who are these people surrounding me?",
        src: image_src_basement,
        pixels: {height: 675, width: 1200}
    };


    // Player data for Main Character
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

     // Conversation flow for Asaka
    const conversationFlowAsaka = {
      start: {
        question: "Do you remember your name?",
        answers: {
          "a. No.": "no",
          "b. Yes.": "yes"
        }
      },
      //string of possible conversaiton when chosen: no
      no: {
        question: "What do you remember?",
        answers: {
          "a. Nothing.": "nothing",
          "b. People seem to call me degen.": "degen"
        }
      },
      nothing: {
        question: "Okay. So, there would be no point in asking you how you got here, right?",
        answers: {
          "a. I suppose not.": "not",
          "b. Wait, I still want help with getting out of here. Will you tell me how to leave this place?": "help"
        }
      },
      not: {
        question: "Well then. I will leave you alone. ( Asaka stops talking to you for the rest of your time in the basement.)",
        answers: {
          "End. You have achieved bad ending six.": "badendingsix",
        }
      },
      //good ending three : youre not slow !! 
      help: {
        question: "Ah. If that's the case, I can help. Just trying ESCaping this place.",
        answers: {
          "a. That's .. okay, then. I'll figure it out somehow.": "goodendingthree",
          "b. What the skibidi is that supposed to mean? Escaping? Do you think I haven't already tried that?": "rude"
        }
      },
      //bad ending six : youre a bit slow 
      rude: {
        question: "No, not escaping ES- you know what? Nevermind. ( Asaka turns away and ignores you. )",
        answers: {
          "End. You have achieved bad ending six.": "badendingsix"
        }
      },
      degen: {
        question: "So you want to be called Degen? Alright, Degen. Do you know how you got here?",
        answers: {
          "a. No. And I don't want to be here. Help me get out.": "getout",
          "b. Of course! I entered a different dimension and it ended up bringing me here. What else could've happened?": "dimension"
        }
      },
      //good ending four : haha get it?
      getout: {
        question: "Well, just ESCape.",
        answers: {
          "What? What do you mean ESC.. ohhhh. ( Press ESC once you end this conversation. ) ": "goodendingfour",
        }
      },
      dimension: {
        question: "A different dimension? You're joking, right? ( Asaka frowns and ignore everything else you have to say, thinking you're insane. )",
        answers: {
          "a. End. You have achieved bad ending seven.": "badendingseven",
        }
      },
      //string of possible conversation when chosen: yes
      yes: {
        question: "What is it?",
        answers: {
          "a. Broski Moski": "broski",
          "b. I've heard people call me degen before, so I guess that's my name.": "name"
        }
      },
      broski: {
        question: "I seriously doubt that your name is Broski Moski. But anyhow, do you know how you got here?",
        answers: {
          "a. No.": "noidea",
          "b. Yes.": "sure"
        }
      },
      noidea: {
        question: "Well.. if that's the case.. would you like some help getting out of here?",
        answers: {
          "a. Yes. Please.": "please",
          "b. No. I don't get help from some female..": "ew"
        }
      },
      //Bad ending one : ew 
      ew: {
        question: "What a disappointment.. you're never getting out of here. ( Asaka ends the conversation. What a terrible response. )",
        answers: {
          "End. You have achieved bad ending one. ( Why did you even choose that option? )":"BadendingOne"
        }
      },
      // Good ending one : giving it a try 
      please:{
        question: "Have you tried just.. ESCaping out of the basement?",
        answers: {
          "a. No. Why would I ever try that? That's terrible information.": "terrible",
          "b. I haven't thought about that. Let me give it a try! ( When out of the conversation, press ESC. )": "endingOne"
        }
      },
      //Bad ending two : reject info 
      terrible:{
        question: "Fine. Do not accept my help. But don't say I didn't try to help. ( Asaka stops talking to you. )",
        answers: {
          "End. You have achieved bad ending two.":"BadEndingTwo"
        }
      },
      name: {
        question: "I see. So, Degen. How did you get here?",
        answers: {
          "a. I rode on a unicorn and somehow ended up here!!": "unicorn",
          "b. I'm really not sure. Could you help me get out?": "notsure"
        }
      },
      // Bad Ending Three : A unicorn?
      unicorn: {
        question: "Oh no.. I believe you're too far gone. ( Asaka turns away, disappointed to have even started a conversation with you. )",
        answers: {
          "End. You have achieved bad ending three.": "BadEndingThree"
        }
      },
      //good ending two : odd, but okay!
      notsure: {
        question: "Try ESCaping out of here. It works wonders.",
        answers: {
          "What odd advice.. but I will give it a try. ( Press ESC once out of the conversation)": "GoodEndingTwo"
        }
      },
      sure: {
        question: "Then, do you mind telling me how you got here?",
        answers: {
          "a. Truthfully, I drank a potion and I was magically teleported here.": "potion",
          "b. Okay, I lied, I don't know how I got here. Can you help me get out?": "lied"
        }
      },
      //bad ending four
      potion: {
        question: "I'm afraid you're too insane to understand the rest of my advice. ( Asaka stops talking to you, cringing as you walk away. )",
        answers: {
          "End. You have achieved bad ending four.": "BadEndingFour",
        }
      },
      //bad ending five 
      lied: {
        question: "Of course I won't, you lied to me! Why would you even lie in the first place? ( Asaka shakes her head and stops talking to you. )",
        answers: {
          "End. You have achieved bad ending five": "BadEndingFive",
        }
      },
      // Add more conversation nodes as needed
    };

    // NPC data for Asaka
    const sprite_src_asaka = path + "/images/gamify/asaka.png"; // be sure to include the path
    const sprite_greet_asaka = "You don't belong here, do you?                                                       ( Press e to interact with Asaka, click your answer and press e again to continue the interaction )";
    const sprite_data_asaka = {
        id: 'Asaka',
        greeting: sprite_greet_asaka,
        src: sprite_src_asaka,
        SCALE_FACTOR: 5,  // Adjust this based on your scaling needs
        ANIMATION_RATE: 50,
        pixels: {height: 316, width: 189},
        INIT_POSITION: { x: (width / 2), y: (height / 1.7)},
        orientation: {rows: 4, columns: 3 },
        down: {row: 0, start: 0, columns: 3 },  // This is the stationary npc, down is default 
        hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
        conversation: new Conversation(conversationFlowAsaka),
        reaction: function() {
          alert(sprite_greet_asaka);
        },
        interact: function() {
          const conversation = sprite_data_asaka.conversation;
          const question = conversation.getCurrentQuestion();
          const answers = conversation.getCurrentAnswers();
          const conversationPanel = document.getElementById('conversationPanel');
          const conversationQuestion = document.getElementById('conversationQuestion');
          const conversationAnswers = document.getElementById('conversationAnswers');

          conversationQuestion.innerText = question;
          conversationAnswers.innerHTML = '';

          answers.forEach(answer => {
            const button = document.createElement('button');
            button.innerText = answer;
            button.onclick = () => {
              conversation.answerQuestion(answer);
              conversationPanel.style.display = 'none';
            };
            conversationAnswers.appendChild(button);
          });

          conversationPanel.style.display = 'block';
        }
    };


      // NPC data for Miku
      const sprite_src_miku = path + "/images/gamify/miku.png"; // be sure to include the path
      const sprite_greet_miku = "OMG HI UWU MY NAME IS MIKU I'M SO SUPER DUPER STOKED TO MEET YOU!";
      const sprite_data_miku = {
        id: 'Miku',
        greeting: sprite_greet_miku,
        src: sprite_src_miku,
        SCALE_FACTOR: 5,  // Adjust this based on your scaling needs
        ANIMATION_RATE: 50,
        pixels: {height: 316, width: 189},
        INIT_POSITION: { x: (width / 12), y: (height / 1.8)},
        orientation: {rows: 4, columns: 3 },
        down: {row: 0, start: 0, columns: 3 },  // This is the stationary npc, down is default 
        hitbox: { widthPercentage: 0.1, heightPercentage: 0.1 },
        reaction: function() {
          alert(sprite_greet_miku);
        },
        // long interaction for when you interact with miku 
        interact: function() {
          const longText = `
            What is Vocaloid?
Vocaloid is a singing voice synthesizer software developed by Yamaha Corporation. It allows users to input melodies and lyrics, which are then "sung" by virtual singers known as Vocaloids. These voices are created using vocal samples from real singers, which are then processed and tuned to produce a synthetic, yet highly customizable, singing voice.

The software was first introduced in 2004, but it wasn’t until the release of Hatsune Miku in 2007 that Vocaloid truly exploded in popularity. Since then, it has become a massive part of internet culture, inspiring music producers, animators, and artists worldwide.

The History of Vocaloid
The first version of Vocaloid, known as Vocaloid 1, debuted in 2004 with the release of two voices: Leon and Lola, English Vocaloids created by Zero-G, and Meiko, a Japanese Vocaloid produced by Crypton Future Media.

However, it was Vocaloid 2 that truly revolutionized the software. In 2007, Crypton Future Media released Hatsune Miku, a blue-haired, twin-tailed idol who quickly became the face of Vocaloid. Her voice was provided by Saki Fujita, a Japanese voice actress. Miku’s immense popularity led to the release of more Vocaloids, including Kagamine Rin & Len and Megurine Luka.

From there, the software continued to evolve:

Vocaloid 3 (2011) introduced greater realism in voices and multiple language support.
Vocaloid 4 (2014) added new functions like growl effects and pitch control.
Vocaloid 5 (2018) improved usability, adding greater control over dynamics and vocal expression.
Crypton Future Media later moved on from Vocaloid to develop Piapro Studio, which now powers Miku and other Crypton Vocaloids.

Popular Vocaloids
While Hatsune Miku is undeniably the most famous Vocaloid, there are many other beloved Vocaloids, each with their own distinct voicebanks and fan followings. Some of the most iconic ones include:

1. Kagamine Rin & Len
Twin Vocaloids (not actual twins, just mirror images of each other).
Released in 2007 after Miku.
Known for their dynamic range, used in everything from rock to electronic music.
Famous songs: Meltdown, Kokoro, Butterfly on Your Right Shoulder.
2. Megurine Luka
Released in 2009, designed as a bilingual Vocaloid (Japanese and English).
Has a more mature, sultry voice compared to Miku and Rin/Len.
Famous songs: Just Be Friends, Luka Luka Night Fever, Double Lariat.
3. Kaito & Meiko
The first Japanese Vocaloids released before Miku.
Kaito (male, cool and soft voice) and Meiko (female, powerful and deep voice).
Not as popular at first, but gained a strong fanbase later on.
Famous songs: Cantarella (Kaito), Change Me (Meiko).
4. Gumi (Megpoid)
Created by Internet Co., Ltd. and voiced by Megumi Nakajima.
Has a natural, highly expressive voice.
Famous songs: Echo, Matryoshka, Coward Montblanc.
5. IA & ONE
IA is based on the voice of Lia, known for her angelic singing.
ONE is her "sister" Vocaloid with a more powerful sound.
Famous songs: Six Trillion Years and Overnight Story, Children Record.
Impact of Vocaloid on Music & Internet Culture
Vocaloid has had an enormous influence on both Japanese and global music culture. Some key ways it has left its mark include:

1. The Rise of Producers ("P" names)
Vocaloid allowed independent producers to create and distribute music without needing professional singers. Many famous "Vocaloid Producers" (or "P"s) emerged, including:

ryo (supercell) – Creator of World is Mine and Black Rock Shooter.
wowaka – Known for his fast-paced, emotional songs like Rolling Girl and Unhappy Refrain.
DECO*27 – A prolific producer famous for Ghost Rule and Ai Kotoba.
kemu – Known for Life Reset Button and Invisible.
2. Concerts and Live Events
Despite being a virtual character, Hatsune Miku has held real-life concerts where she appears as a hologram. These concerts, such as Miku Expo and Magical Mirai, sell out worldwide.

3. Doujin (Fan-Made) Content
Vocaloid has fueled an enormous doujin (fan-made) culture, including:

Fan art and animations
Manga and novels based on Vocaloid songs (Kagerou Project, Mikagura School Suite).
Remixes and covers, including human singers covering Vocaloid songs (known as "Utaite").
Controversies and Criticisms
Despite its success, Vocaloid isn’t without controversy:

Artificial vs. Human Singing – Some criticize Vocaloid for sounding "robotic" and lacking human emotion.
Crypton vs. Yamaha – Crypton moved away from Vocaloid software, causing some division in the community.
Plagiarism & Copyright Issues – Some songs have been stolen or used without permission.
Still, Vocaloid remains a beloved and constantly evolving part of music culture.

The Future of Vocaloid
As technology advances, Vocaloid voices are becoming more realistic. AI-based singing software like Synthesizer V and CeVIO AI are gaining traction, offering even more natural vocals. However, Vocaloid still has a loyal fanbase, and new characters and updates continue to keep the community alive.

Will Hatsune Miku and Vocaloid stay relevant? Absolutely! As long as fans and producers keep creating music, Vocaloid will remain a global phenomenon.

And that’s a long-winded dive into Vocaloid! Hope you liked it! 😆🎶
          `;
          alert(longText);
        }
      };
  

    const sprite_src_nezuko = path + "/images/gamify/nezuko.png"; // be sure to include the path
    const sprite_greet_nezuko = "I've never seen you before. Are you lost? Well, even if you are.. I don't think I'm going to help you get out of here.";
    const sprite_data_nezuko = {
      id: 'Nezuko',
      greeting: sprite_greet_nezuko,
      src: sprite_src_nezuko,
      SCALE_FACTOR: 5,  // Adjust this based on your scaling needs
      ANIMATION_RATE: 50,
      pixels: {height: 316, width: 189},
      INIT_POSITION: { x: (width / 1.3), y: (height / 1.3)},
      orientation: {rows: 4, columns: 3 },
      down: {row: 0, start: 0, columns: 3 },  // This is the stationary npc, down is default 
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
      // Linux command quiz
      quiz: { 
        title: "Nezuko's insanity Quiz",
        questions: [
          "What's 1+1?\n1. 2\n2. 78\n3. Alt + 3\n4. 34856",
          "What's 32+18?\n1. 50\n2. 60\n3. 87\n4. 14",
          "What's 24 x 12?\n1. 288\n2. 563\n3. 9735\n4. 32",
          "What's 72 / 8?\n1. 8\n2. 2\n3. 9\n4. 27",
          "What is a dinosaur's favorite food?\n1. What?\n2. Chicken\n3. People\n4. Plants",
          "What is the capital of France?\n1. London\n2. Paris\n3. Berlin\n4. Rome",
          "What is the capital of Japan?\n1. Bangkok\n2. Beijing\n3. Seoul\n4. Tokyo",
          "What is a baby kangaroo called?\n1. Joey\n2. Baby Kangaroo\n3. Kangaroo Jr.\n4. Kangaroolet",
          "What is the largest mammal in the world?\n1. Elephant\n2. Blue Whale\n3. Giraffe\n4. Human",
          "What is the largest planet in our solar system?\n1. Earth\n2. Saturn\n3. Mars\n4. Jupiter"

        ] 
      },
      reaction: function() {
        alert(sprite_greet_nezuko);
      },
      interact: function() {
        let quiz = new Quiz(); // Create a new Quiz instance
        quiz.initialize();
        quiz.correct = [1, 1, 1, 3, 3, 2, 4, 1, 2, 4]
        quiz.openPanel(sprite_data_nezuko.quiz);
      }
    }

    // List of objects defnitions for this level
    this.classes = [
      { class: Background, data: image_data_basement },
      { class: Player, data: sprite_data_degen },
      { class: Npc, data: sprite_data_asaka },
      { class: Npc, data: sprite_data_miku },
      { class: Npc, data: sprite_data_nezuko },
    ];
    
  }

}

// Conversation class for Asaka 
class Conversation {
  constructor(flow) {
    this.flow = flow;
    this.currentNode = "start";
  }

  getCurrentQuestion() {
    return this.flow[this.currentNode].question;
  }

  getCurrentAnswers() {
    return Object.keys(this.flow[this.currentNode].answers);
  }

  answerQuestion(answer) {
    const nextNode = this.flow[this.currentNode].answers[answer];
    if (nextNode) {
      this.currentNode = nextNode;
    }
  }
}

export default GameLevelBasement;