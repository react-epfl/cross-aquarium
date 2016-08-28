var Branch = function(distBetweenPoints, id, intro, col, leaf) {
    this.distBetweenPoints = distBetweenPoints;
    this.id                = id;
    this.leaves            = [];
    this.springs           = [];

    this.rand = random(-10, 10);

    if(!zen) {
        this.destMainCol = {r: col.r + 20, g: col.g + 20, b: col.b + 20};
        this.leafW       = 28;
        this.leafH       = 12;
    } else {
        this.destMainCol = {r: 32, g: 145, b: 85};
        this.leafW       = 15;
        this.leafH       = 6;
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
    },

    display: function(shape, iii, lll) {
        push();
        var index = 0;
        for(var i = 0, l = this.springs.length; i < l; i++) {
            noFill();
            stroke(this.mainCol.r - 10, this.mainCol.g - 10, this.mainCol.b - 10);
            line(this.springs[i].a.x, this.springs[i].a.y,
                 this.springs[i].b.x, this.springs[i].b.y);
            if(i % 3 == 2) {
                push();
                var dir = this.springs[i].b.sub(this.springs[i].a);
                translate(this.leaves[index].x, this.leaves[index].y);
                rotate(dir.heading() - PI/2);
                translate(zen ? 0 : iii % 2 == 0 ? this.leafW : -this.leafW, 0);
                if(!zen) {
                    fill((Math.cos(-step * .1 + iii * (Math.PI / lll)) + 1) / 2 * (currentColor.r - this.mainCol.r) + this.mainCol.r,
                         (Math.cos(-step * .1 + iii * (Math.PI / lll)) + 1) / 2 * (currentColor.g - this.mainCol.g) + this.mainCol.g,
                         (Math.cos(-step * .1 + iii * (Math.PI / lll)) + 1) / 2 * (currentColor.b - this.mainCol.b) + this.mainCol.b);
                } else {
                    fill((Math.cos(-step * .1 + iii * (Math.PI / lll)) + 1) / 2 * (this.mainCol.r + 50 - this.mainCol.r) + this.mainCol.r,
                         (Math.cos(-step * .1 + iii * (Math.PI / lll)) + 1) / 2 * (this.mainCol.g + 50 - this.mainCol.g) + this.mainCol.g,
                         (Math.cos(-step * .1 + iii * (Math.PI / lll)) + 1) / 2 * (this.mainCol.b + 50 - this.mainCol.b) + this.mainCol.b);
                }
                noStroke();
                beginShape();
                if (shape == S_TRIANGLE) {
                    for(var i = 0; i < shape; i++) {
                        vertex(Math.cos(i * Math.PI * 2 / shape - Math.PI / 6) * this.leafW,
                               Math.sin(i * Math.PI * 2 / shape - Math.PI / 6) * map(mouseY, 0, height, this.leafH, 2));
                    }
                } else {
                    for(var i = 0; i < shape; i++) {
                        vertex(Math.cos(i * Math.PI * 2 / shape) * this.leafW,
                               Math.sin(i * Math.PI * 2 / shape) * map(mouseY, 0, height, this.leafH, 2));
                    }
                }
                endShape(CLOSE);
                // image(shape, -shape.width/2, -shape.height/2);
                pop();
                index++;
            }
        }
        pop();
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

                var spring = new VerletSpring2D(p, prev, this.distBetweenPoints / (zen ? 1.5 : 3), .3);

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
