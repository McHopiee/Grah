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
    import GameControl from '{{site.baseurl}}/assets/js/adventureGame/GameControl.js';
    const path = "{{site.baseurl}}";
    new GameControl(path).start();
</script>
