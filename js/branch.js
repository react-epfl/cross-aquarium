var Branch = function(distBetweenPoints, position, id, leaf) {
    this.distBetweenPoints = distBetweenPoints;
    this.position          = position;
    this.id                = id;
    this.leaves            = [];
    this.springs           = [];

    this.randomB           = random(255);

    if(typeof leaf !== 'undefined') {
        this.addLeaf(false, leaf);
    }
}

Branch.prototype = {
    update: function() {
        this.getLastLeaf().addForce(new Vec2D(random(-.1, .1), 0));
    },

    display: function(shape) {
        push();
        translate(this.position.x, this.position.y);
        noFill();
        stroke(9, 182, 125);
        var index = 0;
        for(var i = 0, l = this.springs.length; i < l; i++) {
            line(this.springs[i].a.x, this.springs[i].a.y,
                 this.springs[i].b.x, this.springs[i].b.y);
            if(i % 3 == 2) {
                push();
                var dir = this.springs[i].b.sub(this.springs[i].a);
                translate(this.leaves[index].x, this.leaves[index].y);
                rotate(dir.heading() - PI/2);
                image(shape, -shape.width/2, -shape.height/2);
                pop();
                index++;
            }
        }
        pop();
    },

    addLeaf: function(locked, fromLeaf) {
        for(var i = typeof fromLeaf === 'undefined' ? 0 : 1; i <= 3; i++) {
            var p = new VerletParticle2D(0, -i * (this.distBetweenPoints / 3));

            physics.addParticle(p);

            if(i == 0 && locked) p.lock();

            if(i != 0) {
                var prev;
                if(typeof fromLeaf !== 'undefined' && i == 1) {
                    prev = fromLeaf;
                } else {
                    prev = physics.particles[physics.particles.length - 2];
                }

                var spring = new VerletSpring2D(p, prev, this.distBetweenPoints / 3, .3);

                physics.addSpring(spring);

                this.springs.push(spring);

                if(i == 3) {
                    this.leaves.push(p);
                }
            }
        }
    },

    getLastLeaf: function() {
        return this.leaves[this.leaves.length - 1];
    }
}
