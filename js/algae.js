var Algae = function(position, distBetweenPoints, shape, col) {
    this.position          = position;
    this.distBetweenPoints = distBetweenPoints;
    this.shape             = shape;
    this.mainCol           = col;
    this.branches          = [];
    this.scale             = 0;

    // this.addLeaf();
}

Algae.prototype = {
    update: function(grow) {
        if(grow) {
            this.scale += (1 - this.scale) * .025;
            for(var i = 0, l = this.branches.length; i < l; i++) {
                this.branches[i].update();
                if(i == l - 1)
                    this.branches[i].getLastLeaf().addForce(new Vec2D(random(-.1, .1), 0));
            }
        }
    },

    display: function() {
        push();
        translate(this.position.x, this.position.y);
        scale(this.scale);
        for(var i = 0, l = this.branches.length; i < l; i++) {
            this.branches[i].display(this.shape);
        }
        pop();
    },

    addBranch: function(id, fromId) {
        if(this.branches.length == 0) {
            this.branches.push(new Branch(this.distBetweenPoints, id, this.mainCol));
            this.branches[0].createLeaf(true);
        } else if(typeof fromId === 'undefined') {
            // if(algaeKind == 0) {
            //     var position = new Vec2D(random(-25, 25), random(-10, 10));
            //     for(var i = 0, l = this.branches.length; i < l; i++) {
            //         if(position.y < this.branches[i].position.y) {
            //             this.branches.splice(i, 0, new Branch(this.distBetweenPoints, position, this.branches.length));
            //             this.branches[i].addLeaf(true);
            //             return;
            //         }
            //     }
            //     this.branches.push(new Branch(this.distBetweenPoints, position, this.branches.length));
            //     this.branches[this.branches.length - 1].addLeaf(true);
            // }
            this.branches.push(new Branch(this.distBetweenPoints, id, this.mainCol, this.branches[this.branches.length - 1].getLastLeaf()));
        } else {
            for(var i = 0, l = this.branches.length; i < l; i++) {
                if(this.branches[i].id == fromId) {
                    this.branches.push(new Branch(this.distBetweenPoints, id, this.mainCol, this.branches[i].getLastLeaf()));
                    return;
                }
            }
            this.branches.push(new Branch(this.distBetweenPoints, id, this.mainCol, this.branches[this.branches.length - 1].getLastLeaf()));
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
