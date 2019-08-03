// Input manager

const BLINK_THRESHOLD = 200;

class Input {
    constructor(canvas) {
        this.canvas = canvas;

        this.keys = {};
        this.mouse = {
            x: 0,
            y: 0,
            dx: 0,
            dy: 0
        }

        this.space = false;
        this.blink = 0;
        this.lastSpace = 0;

        canvas.addEventListener("click", this.lockPointer.bind(this));
        
        document.addEventListener("keydown", this.keydown.bind(this));   
        document.addEventListener("keyup", this.keyup.bind(this));
        document.addEventListener("mousemove", this.mousemove.bind(this));
    }
    
    lockPointer(e) {
        this.canvas.requestPointerLock();
    }

    mousemove(e) {
        if (document.pointerLockElement !== this.canvas) return;

        this.mouse.x += e.movementX;
        this.mouse.y += e.movementY;
        this.mouse.dx = e.movementX;
        this.mouse.dy = e.movementY;
    }

    keydown(k) {
        this.keys[k.keyCode] = true;
    }

    keyup(k) {
        this.keys[k.keyCode] = false;

        this.space = k.keyCode == Input.SPACE;
    }

    key(k) {
        return this.keys[k];
    }

    update(time) {
        this.blink = 0;
        if (this.space) {
            if (time - this.lastSpace < BLINK_THRESHOLD && this.lastSpace != 0) {
                this.blink = 2;
                this.lastSpace = 0;
            } else {
                this.lastSpace = time;
                console.log("lastSpace now", this.lastSpace);
            }
        } else {
            if (time - this.lastSpace > BLINK_THRESHOLD && this.lastSpace != 0) {
                this.blink = 1;
                this.lastSpace = 0;
            }
        }

        this.space = false;
    }
}

Input.LEFT = 37;
Input.UP = 38;
Input.RIGHT = 39;
Input.DOWN = 40;
Input.SPACE = 32;

Input.A = 65;
Input.D = 68;
Input.W = 87;
Input.S = 83;