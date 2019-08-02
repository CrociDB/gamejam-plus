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

// Coroutine
const co = (f) => {
    let g = f();

    const next = () => {
        let result = g.next();
        if (!result.done) {
            setTimeout(next, result.value * 1000);
        }
    };

    next();
};
