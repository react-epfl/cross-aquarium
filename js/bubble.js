var Bubble = function(position) {
    this.particle = new VerletParticle2D(position.x, position.y);

    physics.addParticle(this.particle);
}

Bubble.prototype = {
    update: function() {
        this.particle.addForce(new Vec2D(random(-.1, .1), .05));
    },

    display: function(s) {
        push();
        translate(map(mouseX, 0, width, width/3, 2 * width/3), map(mouseY, 0, height, height/3, 2 * height/3));
        scale(s);
        translate(-map(mouseX, 0, width, width/3, 2 * width/3), -map(mouseY, 0, height, height/3, 2 * height/3));
        translate(this.particle.x, this.particle.y);
        ellipse(0, 0, 1, 1);
        pop();
    },

    isDead: function() {
        return this.particle.y < -10 ? true : false;
    }
}
