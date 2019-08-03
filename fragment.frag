#version 300 es

precision mediump float;

#include "common.frag"

in vec2 out_uv;
out vec4 outColor;

uniform float time;
uniform float aspectRatio;

#define MAX_STEPS 250
#define MAX_DIST 90.0
#define SURF_DIST .004

uniform vec3 camera_pos;
uniform vec3 ship_pos;
uniform float ship_angle;

uniform vec3 obstacle1;
uniform vec3 obstacle2;
uniform vec3 obstacle3;

const vec3 corner_pos = vec3(-14.1, -2.0, -1.);
vec3 light_pos = vec3(13.5, 20.5, 8.0);

const vec3 vec_left = vec3(1.0, 0.0, 0.0);
const vec3 vec_up = vec3(0.0, 1.0, 0.0);
const vec3 vec_forward = vec3(0.0, 0.0, 1.0);

#define OBJ_EMPTY 0
#define OBJ_WALL 2
#define OBJ_FLOOR 4
#define OBJ_SHIP 3

struct object
{
    float d;
    int id;
};
    
object closest(object o1, object o2)
{
    if (o1.d < o2.d)
        return o1;
    
    return o2;
}

object wall(vec3 p)
{
    float f = sdBox(p, vec3(15.0, 25.42, 0.7));
    float h = sdBox(p + vec3(1.0, -3.0, 0.0), vec3(4.0, 3.5, 2.0));
    
    float front = opSmoothSubtraction(h, f, 0.5);
    
    float side = sdBox(p + vec3(15.0, 0.0, 7.5), vec3(0.8, 15.42, 6.8));
    
    return object(min(side, front), OBJ_WALL);
}

object ofloor(vec3 p)
{
    float f = sdBox(p, vec3(60.0, 1.0, 60.0));
    return object(f, OBJ_FLOOR);
}

object ship(vec3 p)
{
    float cap = sdCapsule(p, vec3(3.0, 1.0, 1.0), vec3(1.0), 0.6);
    float cockpit = sdSphere(p - vec3(2.5, 1.3, 1.0), .5);
    float back = sdCapsule(p, vec3(1.0, 1.0, 1.0), vec3(1.0), 0.9);
    float wings = sdBox(p - vec3(2.0, 0.8, 1.0), vec3(1.0, 0.1, 2.0));
    float wings2 = sdBox(p - vec3(1.5, 0.8, 1.0), vec3(0.4, 0.1, 3.0));
    float backHole = sdCapsule(p + vec3(0.8, 0.0, 0.0), vec3(1.0, 1.0, 1.0), vec3(1.0), 0.8);

    float f = opSmoothUnion(opSmoothUnion(opSmoothUnion(opSmoothUnion(cap, cockpit, .4), back, .4), wings, .6), wings2, .8);
    f = opSmoothSubtraction(backHole, f, .2);

    return object(f, OBJ_SHIP);
}

float obstacle(vec3 p) {
    float o = sdOctahedron(p, 3.0);
    return o;
}

object getDist(vec3 p)
{
    object ofloor = ofloor(p - vec3(0.0, 0.0, 0.0));

    const float s = .7;
    float obs1 = obstacle((p - obstacle1) * rotateY(time * 2.0));
    float obs2 = obstacle((p - obstacle2) * rotateY(time * 2.0));
    float obs3 = obstacle((p - obstacle3) * rotateY(time * 2.0));

    ofloor.d = opSmoothUnion(opSmoothUnion(opSmoothUnion(obs1, obs2, s), obs3, s), ofloor.d, s);
    
    vec3 b = (p - ship_pos);// * rotateY(ship_angle); 
    object ship = ship(b);
    
    return closest(ofloor, ship);
}

object rayMarch(vec3 ro, vec3 rd)
{
    object obj;
    obj.id = OBJ_EMPTY;
    obj.d = 0.0;
    
    for (int i = 0; i < MAX_STEPS; i++)
    {
        vec3 p = ro + rd * obj.d;
        object o = getDist(p);
        
        obj.d += o.d;
        obj.id = o.id;
        
        if (obj.d > MAX_DIST || o.d < SURF_DIST) break;
    }
    
    return obj;
}

vec3 getNormal(vec3 p)
{
    object o = getDist(p);
    vec2 e = vec2(0.01, 0.0);
    
    vec3 n = o.d - vec3(
        getDist(p - e.xyy).d,
        getDist(p - e.yxy).d,
        getDist(p - e.yyx).d);
    
	return normalize(n);
}

vec2 triplanar_map(vec3 p, vec3 o, vec3 normal)
{
    if (abs(dot(normal, vec_up)) > .8)
    {
        return p.xz - o.xz;
    }
    else if (abs(dot(normal, vec_left)) > .8)
    {
        return p.yz - o.yz;
    }
    else
    {
        return p.xy - o.xy;
    }
}

vec3 lighting(vec3 n, vec3 rd, vec3 pos, float spec_power)
{
    vec3 light_dir = normalize(light_pos - pos);
    float light_intensity = 0.6;
    
    vec3 refd = reflect(rd, n);
    float diff = max(0.0, dot(light_dir, n));
    float spec = pow(max(0.0, dot(refd, light_dir)), spec_power);
    float rim = (1.0 - max(0.0, dot(-n, rd)));
    
    vec3 l = vec3(diff, spec, rim);
    
    return l * .8 + (l * light_intensity * 2.0); 
}

float ambientOcclusion(vec3 p, vec3 n)
{
	float stepSize = 0.005;
	float t = stepSize;
	float oc = 0.0;
	for(int i = 0; i < 10; ++i)
	{
		object obj = getDist(p + n * t);
		oc += t - obj.d;
		t += float(i * i) * stepSize;
	}

	return 1.0 - clamp(oc * 0.2, 0.0, 1.0);
}

float getVisibility(vec3 p0, vec3 p1, float k)
{
	vec3 rd = normalize(p1 - p0);
	float t = 10.0 * SURF_DIST;
	float maxt = length(p1 - p0);
	float f = 1.0;
	while(t < maxt)
	{
		object o = getDist(p0 + rd * t);

		if(o.d < SURF_DIST)
			return 0.0;

		f = min(f, k * o.d / t);

		t += o.d;
	}

	return f;
}

vec3 texture_floor(vec2 uv)
{
    vec2 iuv = floor(uv * 10.0);
    float v = float(mod(iuv.x + iuv.y, 2.0) <= 0.01);
    vec3 col = vec3(0.4 + 0.5 * v) * fbm(uv * 15.5) * vec3(0.75, 0.68, 0.591);
    return col;
}

vec3 texture_ship(vec2 uv)
{
    uv.x *= .8;
    
    float no = noise(vec2(1.2, 2.4) + uv * 6.);

    float n0 = .6 + .4 * smoothstep(
        .24,
        0.55,
        fbm(vec2(uv.x * 10., uv.y * 30.) + vec2(15.0, 10.0)));
    uv += no;
    float n1 = fbm(vec2(uv.x * 5., uv.y * 20.) + vec2(2.0, 2.0));
    float n2 = smoothstep(
        1.0,
        0.3,
        fbm(vec2(uv.x * 1., uv.y * 10.)));
    
    vec3 col = n0 * n1 * n2 * vec3(0.82, 0.48, 0.28);
    return col;
}

vec3 texture_wall(vec2 uv)
{
    vec2 iuv = floor(uv * 10.0);
    
    vec3 col = clamp(smoothstep(0.14, 0.65, noise(uv * 10.4) * fbm(uv * 18.0)) + .9, 0.0, 1.0) * vec3(0.5);
    return col;
}

vec3 render_wall(object o, vec3 p, vec3 rd, vec3 normal)
{
    float shadow = getVisibility(p, light_pos, 240.0);
    vec2 uv = triplanar_map(p, vec3(0.0, 0.0, 0.0), normal);
    uv = mod(uv * 0.02 + 0.5, 1.0);
    vec3 t = texture_wall(uv) * vec3(0.905, 0.854, 0.684);

    vec3 l = lighting(normal, rd, p, 55.0);
    float spec_map = clamp(smoothstep(0.43, 0.52, fbm(uv * 20.0)), 0.0, 1.0);
    vec3 spec = spec_map * l.g * .00002 * t * .2 * shadow;

    float ao = ambientOcclusion(p, normal);

    return ao * ((t * .5) + (l.r * t * shadow * .8) + spec + (l.b * .1 * spec_map * shadow));
}

vec3 render(object o, vec3 p, vec3 ro, vec3 rd, vec2 suv)
{
    vec3 normal = getNormal(p);
    
    float shadow = getVisibility(p, light_pos, 40.0);
    
    vec3 color = vec3(0.0);
    float vl = 1.0;
    
    if (o.id == OBJ_EMPTY || o.d > MAX_DIST)
    {
        vl = 0.1;
        color = vec3(0.4) + mix(vec3(0.0, 0.2, 0.0), vec3(0.2, 0.5, 0.6), clamp(suv.y * 5.0 - 1.5, 0.0, 1.0));
    }
    else if (o.id == OBJ_FLOOR)
    {
        vec2 uv = triplanar_map(p, vec3(0.0, 0.0, 0.0), normal);
        uv = fract(uv * 0.028 + 0.2);
        vec3 t = texture_floor(uv);
        
    	vec3 l = lighting(normal, rd, p, 55.0);
        float spec_map = clamp(smoothstep(0.43, 0.52, fbm(uv * 20.0)), 0.0, 1.0);
        vec3 spec = spec_map * l.g * .000002 * t * .2 * shadow;
        
        
        // Reflection
        vec3 r = reflect(rd, normal);
        vec3 _or = p + normal * SURF_DIST * 2.0;
        object _o = rayMarch(_or, normalize(r));
        vec3 _p = _or + r * _o.d;
        vec3 _normal = getNormal(_p);
        vec3 ref = vec3(0.0);
        if (_o.d < MAX_DIST) ref = render_wall(_o, _p, r, _normal);
        
        t += ref * .35;
        
        float ao = ambientOcclusion(p, normal);
        
        color = ao * ((t * .5) + (l.r * t * shadow * .8) + spec + (l.b * .1 * spec_map * shadow));
    }
    else if (o.id == OBJ_WALL)
    {
        color = render_wall(o, p, rd, normal);
    }
    else if (o.id == OBJ_SHIP)
    {
        vl = 0.2;
        
    	vec3 l = lighting(normal, rd, p, 4.0);
        vec2 uv = fract(triplanar_map(p * rotateY(ship_angle), ship_pos * rotateY(ship_angle), normal) * 0.1 + 0.5);
        vec3 t = texture_ship(uv);
        float ao = ambientOcclusion(p, normal);
        color = (ao * t * .5) + (t * l.r * shadow) + (l.g * .2 * shadow);
    }
    
    return color;
}		

/* Main Image */

vec4 color(vec2 uv)
{
    vec3 ro = camera_pos;
    
	vec3 rd = normalize(vec3(uv.x - 0.80, uv.y - 0.3, 1.0));
    
    rd = (viewMatrix(ship_pos, ro, vec_up) * vec4(rd, 1.0)).xyz;
    
    object o = rayMarch(ro, rd);
    vec3 p = ro + rd * o.d;
    
    vec3 r = render(o, p, ro, rd, uv);

    vec2 guv = uv + noise(vec2(time)) + noise(vec2(uv));
    float h = hash12(guv)*0.3+0.7;
    vec3 col = r;

    return vec4(col * 1.3,1.0);
}




void main() 
{
    vec2 uv = out_uv * vec2(aspectRatio, 1.0);

    outColor = color(uv);
}
