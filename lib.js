let lerp = (a, b, t) => (1 - t) * a + t * b;

// Vector3

class Vec3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(b) {
        return new Vec3(this.x + b.x, this.y + b.y, this.z + b.z);
    }

    sub(b) {
        return new Vec3(this.x - b.x, this.y - b.y, this.z - b.z);
    }

    mulv(b) {
        return new Vec3(this.x * b.x, this.y * b.y, this.z * b.z);
    }

    muls(b) {
        return new Vec3(this.x * b, this.y * b, this.z * b);
    }

    divs(b) {
        return this.muls(1 / b);
    }

    get inv() {
        return this.muls(-1);
    }

    get length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    get norm() {
        return this.divs(this.length);
    }

    cross(b) {
        return new Vec3(
            this.y * b.z - this.z * b.y,
            this.z * b.x - this.x * b.z,
            this.x * b.y - this.y * b.x)
    }
}

Vec3.lerp = (a, b, t) => new Vec3(
    lerp(a.x, b.x, t),
    lerp(a.y, b.y, t),
    lerp(a.z, b.z, t));

Vec3.right = new Vec3(1, 0, 0);
Vec3.up = new Vec3(0, 1, 0);
Vec3.forward = new Vec3(0, 0, 1);

// Input manager

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
    }

    key(k) {
        return this.keys[k];
    }
}

Input.LEFT = 37;
Input.UP = 38;
Input.RIGHT = 39;
Input.DOWN = 40;

Input.A = 65;
Input.D = 68;
Input.W = 87;
Input.S = 83;
