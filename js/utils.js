/* toxiclibs */
var  VerletPhysics2D    = toxi.physics2d.VerletPhysics2D,
     VerletParticle2D   = toxi.physics2d.VerletParticle2D,
     VerletSpring2D     = toxi.physics2d.VerletSpring2D,
     GravityBehavior    = toxi.physics2d.behaviors.GravityBehavior,
     Vec2D              = toxi.geom.Vec2D,
     Rect               = toxi.geom.Rect,
     simplexNoise       = toxi.math.noise.simplexNoise;

var remap = function(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1 == 0 ? 1 : high1 - low1);
};

var clamp = function(value, min, max) {
    return Math.min(Math.max(value, min), max);
};

var randomBetween = function(min, max) {
    return Math.random() * (max - min) + min;
}
