var Bubble = function(position) {
    this.particle = new VerletParticle2D(position.x, position.y);

    physics.addParticle(this.particle);
}

Bubble.prototype = {
    update: function() {
        this.particle.addForce(new Vec2D(randomBetween(-.1, .1), .05));
    },

    display: function(s, offX, offY) {
        push();
        translate(offX, offY);
        scale(s);
        translate(-offX, -offY);
        translate(this.particle.x, this.particle.y);
        noStroke();
        fill(255);
        ellipse(0, 0, 3, 3);
        pop();
    },

    isDead: function() {
        return this.particle.y < -10 ? true : false;
    }
}
