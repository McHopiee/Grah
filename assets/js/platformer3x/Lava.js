import GamePlatformerObject from './GamePlatformerObject.js';
import GameEnv from './PlatformerEngine/GameEnv.js';
import GameControl from './PlatformerEngine/GameControl.js';

export class Lava extends GamePlatformerObject {
    constructor(data, gameEnv) {
        const canvas = document.getElementById('gameCanvas');
        const image = new window.Image();
        image.src = data.src;

        // Extract extra parameters from data if needed
        const xPercentage = data.xPercentage ?? 0;
        const yPercentage = data.yPercentage ?? 0;

        super(canvas, image, data);

        this.islandX = xPercentage * GameEnv.innerWidth;
        this.islandY = yPercentage * GameEnv.innerHeight;
        this.initialDelay = 5000; // 5 seconds delay
        this.risingSpeed = 19; // Adjust the rising speed as needed
        this.lastUpdateTime = Date.now();
        this.timeUntilRise = this.initialDelay;
        this.initialDelayElapsed = false;

        // Timer element
        this.timerElement = document.createElement('div');
        this.timerElement.style.position = 'absolute';
        this.timerElement.style.fontFamily = 'Stencil Std, fantasy';
        this.timerElement.style.fontSize = '24px';
        this.timerElement.style.color = 'white';
        this.timerElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        this.timerElement.style.padding = '10px 20px';
        this.timerElement.style.borderRadius = '10px';
        this.timerElement.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        this.timerElement.style.top = '70%';
        this.timerElement.style.left = '50%';
        this.timerElement.style.transform = 'translate(-50%, -50%)';
        this.timerElement.style.display = 'none';
        document.body.appendChild(this.timerElement);

        // Warning symbol
        this.warningSymbol = document.createElement('img');
        this.warningSymbol.src = "/platformer3x/images/platformer/sprites/alert.gif";
        this.warningSymbol.style.position = 'absolute';
        this.warningSymbol.style.top = '35%';
        this.warningSymbol.style.left = '50%';
        this.warningSymbol.style.transform = 'translate(-50%, -50%)';
        this.warningSymbol.style.display = 'none';
        document.body.appendChild(this.warningSymbol);

        this.startTimer();
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timeUntilRise -= 1000;
            if (this.timeUntilRise <= 0) {
                this.timeUntilRise = 0;
                this.initialDelayElapsed = true;
                this.warningSymbol.style.display = 'none';
                this.timerElement.style.display = 'none';
                clearInterval(this.timerInterval);
            } else if (this.timeUntilRise <= this.initialDelay) {
                this.timerElement.style.display = 'block';
                this.warningSymbol.style.display = 'block';
            }
            this.timerElement.innerText = `TIME UNTIL LAVA RISES: ${this.timeUntilRise / 1000}s`;
        }, 1000);
    }

    update() {
        if (this.initialDelayElapsed) {
            const currentTime = Date.now();
            const deltaTime = currentTime - this.lastUpdateTime;
            this.islandY -= (this.risingSpeed * deltaTime) / 1000;
            this.lastUpdateTime = currentTime;
            this.collisionChecks();
            this.size();
        }
    }

    resetTimer() {
        this.timeUntilRise = this.initialDelay;
        this.initialDelayElapsed = false;
        this.timerElement.style.display = 'none';
        this.warningSymbol.style.display = 'none';
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.startTimer();
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
    }

    size() {
        // Adjust the size and position of the lava block
        const scaledWidth = this.canvas.width * 6.4;
        const scaledHeight = this.canvas.height * 6;
        this.canvas.style.width = `${scaledWidth}px`;
        this.canvas.style.height = `${scaledHeight}px`;
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = `${this.islandX}px`;
        this.canvas.style.top = `${this.islandY}px`;
    }

    collisionAction() {
        if (this.collisionData.touchPoints.other.id === "player") {
            // Game over logic or respawn
            console.log("Player touched lava. Game over!");
            GameControl.restartLevel();
        }
    }

    destroy() {
        // Clean up DOM elements
        if (this.timerElement && this.timerElement.parentNode) {
            this.timerElement.parentNode.removeChild(this.timerElement);
        }
        if (this.warningSymbol && this.warningSymbol.parentNode) {
            this.warningSymbol.parentNode.removeChild(this.warningSymbol);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        const index = GameEnv.gameObjects.indexOf(this);
        if (index !== -1) {
            GameEnv.gameObjects.splice(index, 1);
        }
        if (this.timerInterval) clearInterval(this.timerInterval);
    }
}

export default Lava;