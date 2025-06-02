---
layout: base
title: Adventure Game
permalink: /gamify/adventureGame
---

<div id="gameContainer">
    <div id="promptDropDown" class="promptDropDown" style="z-index: 9999"></div>
    <canvas id='gameCanvas'></canvas>
</div>

<!-- Add this HTML to your game HTML file -->
<div id="conversationPanel" style="display: none; position: absolute; top: 20%; left: 20%; width: 60%; background: rgba(0, 0, 0, 0.8); color: white; padding: 20px; border-radius: 10px;">
  <p id="conversationQuestion"></p>
  <div id="conversationAnswers"></div>
</div>

<script type="module">
    import GameLevelBasement from "{{site.baseurl}}/assets/js/adventureGame/GameLevelBasement.js";
    import GameLevelMC from "{{site.baseurl}}/assets/js/adventureGame/GameLevelMC.js";
    import { pythonURI, javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';
    const path = "{{site.baseurl}}";
    new GameControl(path).start();

    const gameLevelClasses = [GameLevelBasement, GameLevelMC];

    const environment = {
        path:"{{site.baseurl}}",
        pythonURI: pythonURI,
        javaURI: javaURI,
        fetchOptions: fetchOptions,
        gameContainer: document.getElementById("gameContainer"),
        gameCanvas: document.getElementById("gameCanvas"),
        gameLevelClasses: gameLevelClasses

    }
    // Launch Adventure Game
    Game.main(environment);
</script>
