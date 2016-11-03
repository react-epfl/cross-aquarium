var Branch = function(distBetweenPoints, id, score, intro, col, isByCurrentUser, leaf) {
    this.distBetweenPoints = distBetweenPoints;
    this.id                = id;
    this.springs           = [];
    this.leaf              = null;
    this.branches          = [];
    this.isByCurrentUser   = isByCurrentUser;
    this.score             = typeof score !== 'undefined' ? score : 0;

    if(!zen) {
        this.destMainCol = {r: col.r + 20, g: col.g + 20, b: col.b + 20};
        this.leafW       = 28;
        this.leafH       = 10;
    } else {
        this.destMainCol = {r: 32, g: 145, b: 85};
        this.leafW       = 15;
        this.leafH       = 5;
    }

    if(intro) {
        this.mainCol = this.destMainCol;
    } else {
        this.mainCol = {r: 255, g: 255, b: 255};
    }

    if(typeof leaf !== 'undefined') {
        this.createLeaf(false, leaf);
    }
}

Branch.prototype = {
    update: function() {
        this.mainCol.r += (this.destMainCol.r - this.mainCol.r) * .025;
        this.mainCol.g += (this.destMainCol.g - this.mainCol.g) * .025;
        this.mainCol.b += (this.destMainCol.b - this.mainCol.b) * .025;

        if(this.branches.length > 0)
            this.branches[this.branches.length - 1].leaf.addForce(new Vec2D(randomBetween(-.1, .1), 0));
    },

    display: function(shape, iii, lll, displayLeaf) {
        var index = 0;
        for(var i = 0, l = this.springs.length; i < l; i++) {
            noFill();
            stroke(this.mainCol.r - 10, this.mainCol.g - 10, this.mainCol.b - 10);
            line(this.springs[i].a.x, this.springs[i].a.y,
                 this.springs[i].b.x, this.springs[i].b.y);
            if(i == l - 1 && typeof displayLeaf === 'undefined') {
                push();
                var dir = this.springs[i].b.sub(this.springs[i].a);
                translate(this.leaf.x, this.leaf.y);
                rotate(dir.heading() + PI/2);
                scale(clamp(remap(this.score, minScoreComment, maxScoreComment, .5, 1.5), .5, 1.5));
                var factor = (Math.cos(-frame * .1 + iii * (Math.PI / lll)) + 1) / 2;
                if(!zen) {
                    translate(iii % 2 == 0 ? this.leafW : -this.leafW, 0);
                    fill(factor * (currentColor.r - this.mainCol.r) + this.mainCol.r,
                         factor * (currentColor.g - this.mainCol.g) + this.mainCol.g,
                         factor * (currentColor.b - this.mainCol.b) + this.mainCol.b);
                } else {
                    fill(factor * (this.mainCol.r + 50 - this.mainCol.r) + this.mainCol.r,
                         factor * (this.mainCol.g + 50 - this.mainCol.g) + this.mainCol.g,
                         factor * (this.mainCol.b + 50 - this.mainCol.b) + this.mainCol.b);
                }
                noStroke();
                beginShape();
                var scaleY = remap(mouseY, 0, height, this.leafH, 2);
                if (shape == S_TRIANGLE) {
                    if(!zen) {
                        translate(iii % 2 == 0 ? -this.leafW / 5 : this.leafW / 5, scaleY / 3);
                    }
                    for(var i = 0; i < shape; i++) {
                        vertex(Math.cos(i * Math.PI * 2 / shape - Math.PI / 6) * this.leafW,
                               Math.sin(i * Math.PI * 2 / shape - Math.PI / 6) * scaleY);
                    }
                } else {
                    for(var i = 0; i < shape; i++) {
                        vertex(Math.cos(i * Math.PI * 2 / shape) * this.leafW,
                               Math.sin(i * Math.PI * 2 / shape) * scaleY);
                    }
                }
                endShape(CLOSE);
                if(this.isByCurrentUser && isSessionPrivate) {
                    scale((Math.cos(frame * .25) + 1) / 2 * .1 + .5);
                    image(bubble, -bubble.width / 2, -bubble.height / 2);
                }
                pop();
                index++;
            }
        }

        if(debug) {
            stroke(255, 0, 0);
            for(var i = 0, l = this.springs.length; i < l; i++) {
                line(this.springs[i].a.x, this.springs[i].a.y,
                     this.springs[i].b.x, this.springs[i].b.y);
            }
        }

        for(var i = 0, l = this.branches.length; i < l; i++) {
            if(i == 0) this.branches[i].display(shape, i, lll, true);
            else this.branches[i].display(shape, iii + i, lll);
        }
    },

    createLeaf: function(locked, fromLeaf) {
        for(var i = typeof fromLeaf === 'undefined' ? 0 : 1; i <= 3; i++) {
            var p = new VerletParticle2D(0, -i * (this.distBetweenPoints / (zen ? 1.5 : 3)));

            physics.addParticle(p);

            if(i == 0 && locked) p.lock();

            if(i != 0) {
                var prev;
                if(typeof fromLeaf !== 'undefined' && i == 1) {
                    prev = fromLeaf;
                } else {
                    prev = physics.particles[physics.particles.length - 2];
                }

                var spring = new VerletSpring2D(prev, p, this.distBetweenPoints / (zen ? 1.5 : 3), .3);

                physics.addSpring(spring);

                this.springs.push(spring);

                if(i == 3) {
                    this.leaf = p;
                }
            }
        }
    },

    addLeaf: function(id, score, intro, mainCol, isByCurrentUser) {
        var prev;
        if(this.branches.length > 0) {
            prev = this.branches[this.branches.length - 1].leaf;
        } else {
            prev = this.leaf;
            this.branches.push(new Branch(this.distBetweenPoints, id, score, intro, mainCol, isByCurrentUser, prev));
            prev = this.branches[this.branches.length - 1].leaf;
        }
        this.branches.push(new Branch(this.distBetweenPoints, id, score, intro, mainCol, isByCurrentUser, prev));
    },

    delete: function() {
        for(var i = 0, l = this.branches.length; i < l; i++) {
            this.branches[i].delete();
            this.branches[i] = null;
        }

        for(var i = this.springs.length - 1; i > 0; i--) {
            var s = this.springs.splice(i, 1);
            physics.removeSpringElements(s);
            s = null;
            this.lead = null;
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
                    this.branches[i + 1].lock();
                }
                var b = this.branches.splice(i, 1);
                b = null;
                return false;
            }
        }

        if(this.id == commentId) {
            for(var i = 0, l = this.branches.length; i < l; i++) {
                this.branches[i].delete();
            }
            for(var i = this.springs.length - 1; i > 0; i--) {
                var s = this.springs.splice(i, 1);
                physics.removeSpringElements(s);
                s = null;
            }
            this.leaf = null;
            return true;
        }

        return false;
    },

    changeCommentScore: function(comment) {
        for(var i = 0, l = this.branches.length; i < l; i++) {
            if(this.branches[i].changeCommentScore(comment)) return true;
        }

        if(this.id == comment._id) {
            this.score = typeof comment.voteScore !== 'undefined' ? comment.voteScore : 0;
            return true;
        }

        return false;
    }
}
