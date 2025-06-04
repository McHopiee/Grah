import GameEnv from './PlatformerEngine/GameEnv.js';

class GamePlatformerObject {
    constructor(canvas, image, data = {}) { // Default data to an empty object
        if (!canvas || typeof canvas.getContext !== "function") {
            throw new Error('GamePlatformerObject: Provided canvas is invalid or not found.');
        }

        this.x = data.x ?? 0;
        this.y = data.y ?? 0;
        this.frame = 0;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.image = image;
        this.width = image.width || 0;
        this.height = image.height || 0;
        this.collisionWidth = 0;
        this.collisionHeight = 0;
        this.aspect_ratio = this.width && this.height ? (this.width / this.height) : 1;
        this.speedRatio = data.speedRatio ?? 0;
        this.speed = GameEnv.gameSpeed * this.speedRatio;
        this.invert = true;
        this.collisionData = {};
        this.jsonifiedElement = '';
        this.shouldBeSynced = false;
        this.hitbox = data.hitbox ?? {};

        // Add this object to the game object array
        GameEnv.gameObjects.push(this); 
    }

    serialize() {
        this.logElement();
    }

    logElement() {
        const jsonifiedElement = this.stringifyElement();
        if (JSON.stringify(jsonifiedElement) !== JSON.stringify(this.jsonifiedElement)) {
            this.jsonifiedElement = jsonifiedElement;
            if (this.shouldBeSynced && !GameEnv.inTransition) {
                Socket.sendData("update", this.jsonifiedElement);
            }
        }
    }

    stringifyElement() {
        const element = this.canvas;
        if (element && element.id) {
            return {
                id: element.id,
                width: element.width,
                height: element.height,
                style: element.style.cssText,
                position: {
                    left: element.style.left,
                    top: element.style.top
                },
                filter: element.style.filter,
                tag: GameEnv.currentLevel?.tag,
                x: this.x / GameEnv.innerWidth,
                y: (this.y - GameEnv.top) / (GameEnv.bottom - GameEnv.top),
                frameY: this.frameY
            };
        }
        return {};
    }

    getX() {
        return this.x;
    }

    setX(x) {
        this.x = Math.max(0, x);
    }

    getY() {
        return this.y;
    }

    setY(y) {
        if (y < GameEnv.top) {
            y = GameEnv.top;
        }
        if (y > GameEnv.bottom) {
            y = GameEnv.bottom;
        }
        this.y = y;
    }

    updateInfo(json) {
        if (json.id === this.canvas.id) {
            console.log("runs", json.width, json.height);
            this.canvas.width = json.width;
            this.canvas.height = json.height;
            this.canvas.style.filter = json.filter;
            this.frameY = json.frameY;
            return true;
        }
        return false;
    }

    destroy() {
        const index = GameEnv.gameObjects.indexOf(this);
        if (index !== -1) {
            if (this.canvas?.parentNode) {
                this.canvas.parentNode.removeChild(this.canvas);
            }
            GameEnv.gameObjects.splice(index, 1);
        }
    }

    collisionAction() {
        // Default: do nothing
    }

    floorAction() {
        // Default: do nothing
    }

    collisionChecks() {
        for (const gameObj of GameEnv.gameObjects) {
            if (this !== gameObj) {
                this.isCollision(gameObj);
                if (this.collisionData.hit) {
                    this.collisionAction();
                }
                if (this.collisionData.atFloor) {
                    this.floorAction();
                }
            }
        }
    }

    isCollision(other) {
        const thisRect = this.canvas.getBoundingClientRect();
        const otherRect = other.canvas.getBoundingClientRect();

        const thisCenterX = (thisRect.left + thisRect.right) / 2;
        const otherCenterX = (otherRect.left + otherRect.right) / 2;

        const thisRectWidth = thisRect.right - thisRect.left;
        const thisRectLeftNew = otherCenterX - thisRectWidth / 2;

        const widthPercentage = this.hitbox.widthPercentage ?? 0.0;
        const heightPercentage = this.hitbox.heightPercentage ?? 0.0;

        const widthReduction = thisRect.width * widthPercentage;
        const heightReduction = thisRect.height * heightPercentage;

        const thisLeft = thisRect.left + widthReduction;
        const thisTop = thisRect.top + heightReduction;
        const thisRight = thisRect.right - widthReduction;
        const thisBottom = thisRect.bottom;

        const tolerance = 10;
        const onTopofOther = Math.abs(thisBottom - otherRect.top) <= tolerance;

        this.collisionData = {
            newX: thisRectLeftNew,
            hit: (
                thisLeft < otherRect.right &&
                thisRight > otherRect.left &&
                thisTop < otherRect.bottom &&
                thisBottom > otherRect.top
            ),
            atFloor: (GameEnv.bottom <= this.y),
            touchPoints: {
                this: {
                    id: this.canvas.id,
                    top: thisRect.bottom > otherRect.top,
                    bottom: (thisRect.bottom <= otherRect.top) && !(Math.abs(thisRect.bottom - otherRect.bottom) <= GameEnv.gravity),
                    left: thisCenterX > otherCenterX,
                    right: thisCenterX < otherCenterX,
                    onTopofOther: onTopofOther
                },
                other: {
                    id: other.canvas.id,
                    top: thisRect.bottom < otherRect.top,
                    bottom: (thisRect.bottom >= otherRect.top) && !(Math.abs(thisRect.bottom - otherRect.bottom) <= GameEnv.gravity),
                    left: thisCenterX < otherCenterX, 
                    right: thisCenterX > otherCenterX,
                },
            },
        };
    }
}

export default GamePlatformerObject;
