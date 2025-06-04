---
layout: base
title: Adventure Game
permalink: /gamify/adventureGame
---

<div id="gameContainer">
  <div id="promptDropDown" class="promptDropDown" style="z-index: 9999"></div>
  <canvas id="gameCanvas"></canvas>
</div>

<div id="conversationPanel" style="display: none; position: absolute; top: 20%; left: 20%; width: 60%; background: rgba(0, 0, 0, 0.8); color: white; padding: 20px; border-radius: 10px;">
  <p id="conversationQuestion"></p>
  <div id="conversationAnswers"></div>
</div>

<!-- Optional buttons to trigger switching modes (you can remove if you use events elsewhere) -->
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

        // Add platformer loader global function here
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

        // Custom event listeners
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
