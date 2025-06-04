import Character from "./Character.js";

class Npc extends Character {
    constructor(data = null, gameEnv = null) {
        super(data, gameEnv);
        this.interact = data?.interact; // Interact function
        this.currentQuestionIndex = 0;
        this.alertTimeout = null;
        this.bindInteractKeyListeners();
    }

    update() {
        this.draw();
    }

    bindInteractKeyListeners() {
        addEventListener('keydown', this.handleKeyDown.bind(this));
        addEventListener('keyup', this.handleKeyUp.bind(this));
    }

    handleKeyDown({ key }) {
        if (key === 'e' || key === 'u') {
            this.handleKeyInteract();
        }
    }

    handleKeyUp({ key }) {
        if (key === 'e' || key === 'u') {
            if (this.alertTimeout) {
                clearTimeout(this.alertTimeout);
                this.alertTimeout = null;
            }
        }
    }

    handleKeyInteract() {
        if (!this.gameEnv || !this.gameEnv.gameObjects) return;

        const players = this.gameEnv.gameObjects.filter(
            obj =>
                obj.state &&
                Array.isArray(obj.state.collisionEvents) &&
                obj.state.collisionEvents.includes(this.spriteData.id)
        );
        const hasInteract = typeof this.interact === "function";

        if (players.length > 0 && hasInteract) {
            this.interact();
        }
    }
}

export default Npc;
