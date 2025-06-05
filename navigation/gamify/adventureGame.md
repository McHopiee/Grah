---
layout: base
title: Adventure Game
permalink: /gamify/adventureGame
---

<style>
  /* Ensure the game canvas fills the screen properly */
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    overflow: hidden;
    background: #000; /* black background for better contrast */
  }

  #gameContainer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  #gameCanvas {
    display: block;
    width: 100%;
    height: 100%;
    background: #111; /* fallback background */
  }

  /* Optional: style for dropdown and conversation panel */
  .promptDropDown {
    position: absolute;
    top: 10px;
    left: 10px;
  }
</style>

<div id="gameContainer">
  <div id="promptDropDown" class="promptDropDown" style="z-index: 9999"></div>
  <canvas id="gameCanvas"></canvas>
</div>

<div id="conversationPanel" style="display: none; position: absolute; top: 20%; left: 20%; width: 60%; background: rgba(0, 0, 0, 0.8); color: white; padding: 20px; border-radius: 10px;">
  <p id="conversationQuestion"></p>
  <div id="conversationAnswers"></div>
</div>

<div style="position: fixed; bottom: 10px; left: 10px; z-index: 10000;">
  <button id="switchToRPG">Switch to RPG</button>
  <button id="switchToPlatformer">Switch to Platformer</button>
</div>

<script type="module">
  document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
      console.error('No canvas found!');
      return;
    }

    import('{{site.baseurl}}/assets/js/adventureGame/GameControl.js')
      .then(({ default: GameControl }) => {
        window.gameControl = new GameControl("{{site.baseurl}}");
        window.gameControl.start();

        // Global function to start the platformer
        window.startPlatformerLevel = function(levelClasses) {
          if (!window.gameControl) {
            console.error('GameControl is not initialized yet.');
            return;
          }
          window.gameControl.platformerLevels = levelClasses;
          window.gameControl.isPlatformerActive = true;
          window.gameControl.currentLevelIndex = 0;
          window.gameControl.transitionToLevel();
        };

        // Button handlers
        const btnRPG = document.getElementById('switchToRPG');
        const btnPlatformer = document.getElementById('switchToPlatformer');

        if (btnRPG && btnPlatformer) {
          btnRPG.addEventListener('click', () => {
            window.gameControl.switchToRPG();
          });
          btnPlatformer.addEventListener('click', () => {
            window.gameControl.switchToPlatformer();
          });
        }

        // Custom events
        window.addEventListener('loadPlatformer', () => {
          window.gameControl.switchToPlatformer();
        });
        window.addEventListener('loadRPG', () => {
          window.gameControl.switchToRPG();
        });
      })
      .catch(err => {
        console.error('Failed to load GameControl.js:', err);
      });
  });
</script>
