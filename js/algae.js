var Algae = function(position, offset, distBetweenPoints, shape, col) {
    this.position          = position;
    this.distBetweenPoints = distBetweenPoints;
    this.shape             = shape;
    this.mainCol           = col;
    this.branches          = [];
    this.scale             = 0;
    this.randTheta         = randomBetween(-PI, PI);
    this.randDist          = randomBetween(0, 1);

    this.offset            = new Vec2D(Math.cos(this.randTheta) * this.randDist * offset / 2,
                                       Math.sin(this.randTheta) * this.randDist * offset / 2 / 5);

    // this.addLeaf();
}

Algae.prototype = {
    update: function(grow) {
        if(grow) {
            this.scale += (1 - this.scale) * .025;
            for(var i = 0, l = this.branches.length; i < l; i++) {
                this.branches[i].update();
                if(i == l - 1)
                    this.branches[i].leaf.addForce(new Vec2D(randomBetween(-.1, .1), 0));
            }
        }
    },

    display: function(angle) {
        push();
        var x = this.position.x + this.offset.x,
            y = this.position.y + this.offset.y * remap(mouseY, 0, height, 1, 0);
        translate(Math.cos(angle) * x - Math.sin(angle) * y,
                  Math.sin(angle) * x + Math.cos(angle) * y);
        scale(this.scale);
        for(var i = 0, l = this.branches.length; i < l; i++) {
            this.branches[i].display(this.shape, i, l);
        }
        pop();
    },

    addBranch: function(id, score, intro, isByUser, fromId) {
        if(this.branches.length == 0) {
            this.branches.push(new Branch(this.distBetweenPoints, id, score, intro, this.mainCol, isByUser));
            this.branches[0].createLeaf(true);
        } else if(typeof fromId === 'undefined') {
            this.branches.push(new Branch(this.distBetweenPoints, id, score, intro, this.mainCol, isByUser, this.branches[this.branches.length - 1].leaf));
            if(this.branches[this.branches.length - 2].branches.length > 0) {
                var spring = new VerletSpring2D(this.branches[this.branches.length - 1].leaf,
                                                this.branches[this.branches.length - 2].branches[0].leaf,
                                                this.distBetweenPoints * 1, .3);
                physics.addSpring(spring);
            }
        } else {
            for(var i = 0, l = this.branches.length; i < l; i++) {
                if(this.branches[i].id == fromId) {
                    this.branches[i].addLeaf(id, score, intro, this.mainCol, isByUser);
                    return;
                }
            }
        }
    },

    delete: function() {
        for(var i = 0, l = this.branches.length; i < l; i++) {
            this.branches[i].delete();
            this.branches[i] = null;
        }
    },

    deleteComment: function(commentId) {
        for(var i = 0, l = this.branches.length; i < l; i++) {
            if(this.branches[i].deleteComment(commentId)) {
                if(i != 0 && i != l - 1) {
                    this.branches[i + 1].springs[0].a = this.branches[i - 1].leaf;
                }
                if(i == 0) {
                    this.branches[i + 1].springs[0].a.x = 0;
                    this.branches[i + 1].springs[0].a.y = 0;
                    this.branches[i + 1].springs[0].a.lock();
                }
                var b = this.branches.splice(i, 1);
                b = null;
                return true;
            }
        }
        return false;
    },

    changeCommentScore: function(comment) {
        for(var i = 0, l = this.branches.length; i < l; i++) {
            if(this.branches[i].changeCommentScore(commentId)) return true;
        }
        return false;
    }
}
