let lerp = (a, b, t) => (1 - t) * a + t * b;
var toHalf = (function() {

    var floatView = new Float32Array(1);
    var int32View = new Int32Array(floatView.buffer);
 
    /* This method is faster than the OpenEXR implementation (very often
     * used, eg. in Ogre), with the additional benefit of rounding, inspired
     * by James Tursa?s half-precision code. */
    return function toHalf(val) {
 
      floatView[0] = val;
      var x = int32View[0];
 
      var bits = (x >> 16) & 0x8000; /* Get the sign */
      var m = (x >> 12) & 0x07ff; /* Keep one extra bit for rounding */
      var e = (x >> 23) & 0xff; /* Using int is faster here */
 
      /* If zero, or denormal, or exponent underflows too much for a denormal
       * half, return signed zero. */
      if (e < 103) {
        return bits;
      }
 
      /* If NaN, return NaN. If Inf or exponent overflow, return Inf. */
      if (e > 142) {
        bits |= 0x7c00;
        /* If exponent was 0xff and one mantissa bit was set, it means NaN,
         * not Inf, so make sure we set one mantissa bit too. */
        bits |= ((e == 255) ? 0 : 1) && (x & 0x007fffff);
        return bits;
      }
 
      /* If exponent underflows but not too much, return a denormal */
      if (e < 113) {
        m |= 0x0800;
        /* Extra rounding may overflow and set mantissa to 0 and exponent
         * to 1, which is OK. */
        bits |= (m >> (114 - e)) + ((m >> (113 - e)) & 1);
        return bits;
      }
 
      bits |= ((e - 112) << 10) | (m >> 1);
      /* Extra rounding. An overflow will set mantissa to 0 and increment
       * the exponent, which is OK. */
      bits += m & 1;
      return bits;
    };
 
 }());

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
