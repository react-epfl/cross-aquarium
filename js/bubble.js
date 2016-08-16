var Bubble = function(position, physics) {
    this.particle = new VerletParticle2D(position.x, position.y);

    physics.addParticle(this.particle);
}

Bubble.prototype = {
    update: function() {
        this.particle.addForce(new Vec2D(random(-.1, .1), .05));
    },

    display: function() {
        noFill();
        stroke(255);
        ellipse(this.particle.x, this.particle.y, 1, 1);
    },

    isDead: function() {
        return this.particle.y < -10 ? true : false;
    }
}
