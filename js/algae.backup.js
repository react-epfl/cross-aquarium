var Algae = function(position, numLeaves, distBetweenPoints, shape, physics) {
    this.position          = position;
    this.numLeaves         = numLeaves;
    this.distBetweenPoints = distBetweenPoints;
    this.shape             = shape;
    this.life              = 0;
    this.particles         = [];
    this.springs           = [];
    this.scale             = 0;

    var index = 0;
    for(var i = 0; i < numLeaves; i++) {
        for(var j = 0; j < 3; j++) {
            var p = new VerletParticle2D(0,  - i * this.distBetweenPoints + j * this.distBetweenPoints / 3);

            this.particles.push(p);

            physics.addParticle(p);

            if(!(i == 0 && j == 0)) {
                var prev   = this.particles[i * 3 + j - 1];
                var spring = new VerletSpring2D(p, prev, this.distBetweenPoints / 3, .3);

                // this.springs = [];

                physics.addSpring(spring);
            }
        }
    }

    this.particles[0].lock();

    this.tail = this.particles[this.particles.length - 1];
}

Algae.prototype = {
    update: function() {
        this.life++;
        if(this.life >= 60) this.scale += (1 - this.scale) * .025;
    },

    display: function() {
        noStroke();
        strokeWeight(2);
        push();
        translate(this.position.x, this.position.y);
        scale(this.scale);
        for (var i = 0, l = this.particles.length; i < l; i++) {
            var c = (Math.cos((i - this.life * .1) * Math.PI / l) + 1) / 2;
            if(i > 0) {
                noFill();
                stroke(9, 182, 125);
                line(this.particles[i - 1].x, this.particles[i - 1].y,
                     this.particles[i].x    , this.particles[i].y    );
                if(i % 3 == 2) {
                    push();
                    var dir = this.particles[i].sub(this.particles[i - 1]);
                    translate(this.particles[i].x, this.particles[i].y);
                    rotate(dir.heading() - PI/2);
                // if(i == -1) {
                    fill(c * (9   - (R + 10)) + R + 10,
                         c * (182 - (G + 10)) + G + 10,
                         c * (125 - (B + 10)) + B + 10);
                    noStroke();
                    beginShape();
                    if(this.shape == S_TRIANGLE) {
                        for (var j = 0; j < this.shape; j++) {
                            vertex(Math.cos(j * Math.PI * 2 / this.shape - Math.PI / 6) * 10,
                                   Math.sin(j * Math.PI * 2 / this.shape - Math.PI / 6) * 5);
                        }
                    } else {
                        for (var j = 0; j < this.shape; j++) {
                            vertex(Math.cos(j * Math.PI * 2 / this.shape) * 10,
                                   Math.sin(j * Math.PI * 2 / this.shape) * 5);
                        }
                    }
                    endShape(CLOSE);
                    pop();
                }
            }
        }
        pop();
    },

    addLeaf: function(index) {
        var p = new VerletParticle2D(this.position.x, this.position.y - index * this.distBetweenPoints);

        this.particles.splice(index * 3, 0, p);

        physics.addParticle(p);

        var prev   = this.particles[index * 3 + 1];
        var spring = new VerletSpring2D(p, prev, this.distBetweenPoints / 3, .3);

        // this.springs = [];

        physics.addSpring(spring);
    },

    addBranch: function(index) {

    },

    delete: function(physics) {
        for(var i = 0, l = this.particles.length; i < l; i++) {
            physics.removeParticle(this.particles[i]);
        }

        for(var i = 0, l = this.springs.length; i < l; i++) {
            physics.removeParticle(this.springs[i]);
        }
    }
}
