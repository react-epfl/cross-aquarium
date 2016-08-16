var Algae = function(position, distBetweenPoints, shape) {
    this.position          = position;
    this.distBetweenPoints = distBetweenPoints;
    this.shape             = shape;
    this.branches          = [];
    this.scale             = 0;

    this.addLeaf();
}

Algae.prototype = {
    update: function(grow) {
        if(grow) this.scale += (1 - this.scale) * .025;
        for(var i = 0, l = this.branches.length; i < l; i++) {
            this.branches[i].update();
        }
    },

    display: function() {
        strokeWeight(2);
        push();
        translate(this.position.x, this.position.y);
        scale(this.scale);
        for(var i = 0, l = this.branches.length; i < l; i++) {
            this.branches[i].display(this.shape);
        }
        pop();
    },

    addLeaf: function(index) {
        if(this.branches.length == 0) {
            this.branches.push(new Branch(this.distBetweenPoints, new Vec2D(0, 0), 0));
            this.branches[0].addLeaf(true);
        } else if(typeof index === 'undefined') {
            if(algaeKind == 0) {
                var position = new Vec2D(random(-25, 25), random(-10, 10));
                for(var i = 0, l = this.branches.length; i < l; i++) {
                    if(position.y < this.branches[i].position.y) {
                        this.branches.splice(i, 0, new Branch(this.distBetweenPoints, position, this.branches.length));
                        this.branches[i].addLeaf(true);
                        return;
                    }
                }
                this.branches.push(new Branch(this.distBetweenPoints, position, this.branches.length));
                this.branches[this.branches.length - 1].addLeaf(true);
            } else {
                this.branches[0].addLeaf(false, this.branches[0].getLastLeaf());
            }
        } else {
            for(var i = 0, l = this.branches.length; i < l; i++) {
                if(this.branches[i].id == index) {
                    this.branches[i].addLeaf(false, this.branches[i].getLastLeaf());
                    return;
                }
            }
            this.branches.push(new Branch(this.distBetweenPoints, new Vec2D(0, 0), index, this.branches[0].leaves[index]));
        }
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
