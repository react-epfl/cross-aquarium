var Algae = function(position, distBetweenPoints, shape, col) {
    this.position          = position;
    this.distBetweenPoints = distBetweenPoints;
    this.shape             = shape;
    this.mainCol           = col;
    this.branches          = [];
    this.scale             = 0;
    this.randTheta         = random(-PI, PI);
    this.randDist          = random(0, 1);

    this.offset            = new Vec2D(cos(this.randTheta) * this.randDist * 60,
                                       sin(this.randTheta) * this.randDist * 12);

    // this.addLeaf();
}

Algae.prototype = {
    update: function(grow) {
        if(grow) {
            this.scale += (1 - this.scale) * .025;
            for(var i = 0, l = this.branches.length; i < l; i++) {
                this.branches[i].update();
                if(i == l - 1)
                    this.branches[i].leaf.addForce(new Vec2D(random(-.1, .1), 0));
            }
        }
    },

    display: function(angle) {
        push();
        var x = this.position.x + this.offset.x,
            y = this.position.y + this.offset.y * map(mouseY, 0, height, 1, 0);
        translate(Math.cos(angle) * x - Math.sin(angle) * y,
                  Math.sin(angle) * x + Math.cos(angle) * y);
        scale(this.scale);
        for(var i = 0, l = this.branches.length; i < l; i++) {
            this.branches[i].display(this.shape, i, l);
        }
        pop();
    },

    addBranch: function(id, intro, fromId) {
        if(this.branches.length == 0) {
            this.branches.push(new Branch(this.distBetweenPoints, id, intro, this.mainCol));
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
            this.branches.push(new Branch(this.distBetweenPoints, id, intro, this.mainCol, this.branches[this.branches.length - 1].leaf));
            if(this.branches[this.branches.length - 2].branches.length > 0) {
                var spring = new VerletSpring2D(this.branches[this.branches.length - 1].leaf,
                                                this.branches[this.branches.length - 2].branches[0].leaf,
                                                this.distBetweenPoints * 1, .3);
                physics.addSpring(spring);
            }
        } else {
            for(var i = 0, l = this.branches.length; i < l; i++) {
                if(this.branches[i].id == fromId) {
                    this.branches[i].addLeaf(id, intro, this.mainCol);
                    return;
                }
            }
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
