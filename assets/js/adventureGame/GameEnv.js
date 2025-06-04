class GameEnv {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.innerWidth = 0;
    this.innerHeight = 0;
    this.top = 0;
    this.bottom = 0;

    this.path = '';
    this.gameControl = null;
    this.gameObjects = [];
  }

  /**
   * Initialize after DOM is ready, returns Promise<boolean>
   */
  async initWhenReady() {
    if (document.readyState === 'loading') {
      await new Promise(resolve => {
        document.addEventListener('DOMContentLoaded', resolve, { once: true });
      });
    }
    return this.create();
  }

  create() {
    const canvasFound = this.setCanvas();
    if (!canvasFound) {
      console.error('GameEnv.create aborted: canvas not found.');
      return false;
    }

    this.setTop();
    this.setBottom();
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight - this.top - this.bottom;
    this.size();

    return true;
  }

  setCanvas() {
    this.canvas = document.getElementById('gameCanvas');
    if (!this.canvas) {
      console.error("GameEnv Error: No canvas element with id 'gameCanvas' found.");
      this.ctx = null;
      return false;
    }
    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) {
      console.error("GameEnv Error: 2D context not available on the canvas.");
      return false;
    }
    return true;
  }

  setTop() {
    const header = document.querySelector('header');
    this.top = header ? header.offsetHeight : 0;
  }

  setBottom() {
    const footer = document.querySelector('footer');
    this.bottom = footer ? footer.offsetHeight : 0;
  }

  size() {
    if (!this.canvas) return;
    this.canvas.width = this.innerWidth;
    this.canvas.height = this.innerHeight;
    Object.assign(this.canvas.style, {
      width: `${this.innerWidth}px`,
      height: `${this.innerHeight}px`,
      position: 'absolute',
      left: '0px',
      top: `${this.top}px`
    });
  }

  resize() {
    this.create();
  }

  clear() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.innerWidth, this.innerHeight);
    }
  }
}

export default GameEnv;
