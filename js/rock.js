var Rock = function(position, depth, angle, numPoint, shape) {
    this.position = position;
    this.depth    = 0;
    this.newDepth = depth;
    this.angle    = angle;
    this.numPoint = numPoint;
    this.shape    = shape;
    this.algaes   = [];
}

Rock.prototype = {
    update: function() {
        this.depth += (this.newDepth - this.depth) * .05;
        for(var i = 0, l = this.algaes.length; i < l; i++) {
            this.algaes[i].update(this.depth >= this.newDepth - 1);
        }
    },

    display: function(index, last) {
        push();
        translate(width/2, height/2);
        scale(map(index, 0, last, .6, 1));
        translate(-width/2, -height/2);
        translate(this.position.x, this.position.y);
        rotate(this.angle);
        fill(R, G, B);
        noStroke();
        beginShape();
        if(this.numPoint == S_TRIANGLE) {
            for(var i = 0; i < this.numPoint; i++) {
                vertex(Math.cos(i * Math.PI * 2 / this.numPoint - Math.PI / 6) * 60,
                       Math.sin(i * Math.PI * 2 / this.numPoint - Math.PI / 6) * 24);
            }
            for(var i = this.numPoint - 1; i >= 0; i--) {
                if(i != 1) {
                    vertex(Math.cos(i * Math.PI * 2 / this.numPoint - Math.PI / 6) * 60,
                           Math.sin(i * Math.PI * 2 / this.numPoint - Math.PI / 6) * 24 - this.depth);
                }
            }
        } else {
            for(var i = 0; i < this.numPoint / 2 + 1; i++) {
                vertex(Math.cos(i * Math.PI * 2 / this.numPoint) * 60,
                       Math.sin(i * Math.PI * 2 / this.numPoint) * 24);
            }
            for(var i = this.numPoint / 2; i < this.numPoint + 1; i++) {
                vertex(Math.cos(i * Math.PI * 2 / this.numPoint) * 60,
                       Math.sin(i * Math.PI * 2 / this.numPoint) * 24 - this.depth);
            }
        }
        endShape(CLOSE);

        translate(0, -this.depth);
        fill(R + 15, G + 10, B + 20);
        beginShape();
        if (this.numPoint == S_TRIANGLE) {
            for(var i = 0; i < this.numPoint; i++) {
                vertex(Math.cos(i * Math.PI * 2 / this.numPoint - Math.PI / 6) * 60,
                       Math.sin(i * Math.PI * 2 / this.numPoint - Math.PI / 6) * 24);
            }
        } else {
            for(var i = 0; i < this.numPoint; i++) {
                vertex(Math.cos(i * Math.PI * 2 / this.numPoint) * 60,
                       Math.sin(i * Math.PI * 2 / this.numPoint) * 24);
            }
        }
        endShape(CLOSE);

        pop();

        push();
        for(var i = 0, l = this.algaes.length; i < l; i++) {
            translate(width/2, height/2);
            scale(map(index, 0, last, .6, 1));
            translate(-width/2, -height/2);
            this.algaes[i].display();
        }
        pop();
    },

    addAlgae: function() {
        var x = this.position.x + Math.cos(this.angle - Math.PI / 2) * this.newDepth,
            y = this.position.y + Math.sin(this.angle - Math.PI / 2) * this.newDepth;
        this.algaes.push(new Algae(new Vec2D(x, y), 30, this.shape));
    },

    addLeaf: function(index) {
        this.algaes[0].addLeaf(index);
    },

    delete: function() {
        for(var i = 0, l = this.algaes.length; i < l; i++) {
            this.algaes[i].delete();
        }
    }
}
