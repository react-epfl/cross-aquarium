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

    display: function(s) {
        push();
        translate(map(mouseX, 0, width, width/3, 2 * width/3), map(mouseY, 0, height, height/3, 2 * height/3));
        scale(s);
        translate(-map(mouseX, 0, width, width/3, 2 * width/3), -map(mouseY, 0, height, height/3, 2 * height/3));
        translate(this.position.x, this.position.y);
        if(!zen) {
            fill(30, 255, 120);
        } else {
            fill(38, 28, 48);
        }
        noStroke();
        beginShape();
        if(this.numPoint == S_TRIANGLE) {
            for(var i = 0; i < this.numPoint; i++) {
                vertex(Math.cos(i * Math.PI * 2 / this.numPoint - Math.PI / 6) * 120,
                       Math.sin(i * Math.PI * 2 / this.numPoint - Math.PI / 6) * map(mouseY, 0, height, 24, 2));
            }
            for(var i = this.numPoint - 1; i >= 0; i--) {
                if(i != 1) {
                    var x = Math.cos(i * Math.PI * 2 / this.numPoint - Math.PI / 6) * 120,
                        y = Math.sin(i * Math.PI * 2 / this.numPoint - Math.PI / 6) * map(mouseY, 0, height, 24, 2) - this.depth
                    vertex(Math.cos(this.angle) * x - Math.sin(this.angle) * y,
                           Math.sin(this.angle) * x + Math.cos(this.angle) * y);
                }
            }
        } else {
            for(var i = 0; i < this.numPoint / 2 + 1; i++) {
                vertex(Math.cos(i * Math.PI * 2 / this.numPoint) * 120,
                       Math.sin(i * Math.PI * 2 / this.numPoint) * map(mouseY, 0, height, 24, 2));
            }
            for(var i = this.numPoint / 2; i < this.numPoint + 1; i++) {
                var x = Math.cos(i * Math.PI * 2 / this.numPoint) * 120,
                    y = Math.sin(i * Math.PI * 2 / this.numPoint) * map(mouseY, 0, height, 24, 2) - this.depth;
                vertex(Math.cos(this.angle) * x - Math.sin(this.angle) * y,
                       Math.sin(this.angle) * x + Math.cos(this.angle) * y);
            }
        }
        endShape(CLOSE);

        translate(Math.cos(this.angle - PI/2) * this.depth, Math.sin(this.angle - PI/2) * this.depth);
        rotate(this.angle);
        if(!zen) {
            fill(45, 235, 115);
        } else {
            fill(16, 84, 60);
        }
        beginShape();
        if (this.numPoint == S_TRIANGLE) {
            for(var i = 0; i < this.numPoint; i++) {
                vertex(Math.cos(i * Math.PI * 2 / this.numPoint - Math.PI / 6) * 120,
                       Math.sin(i * Math.PI * 2 / this.numPoint - Math.PI / 6) * map(mouseY, 0, height, 24, 2));
            }
        } else {
            for(var i = 0; i < this.numPoint; i++) {
                vertex(Math.cos(i * Math.PI * 2 / this.numPoint) * 120,
                       Math.sin(i * Math.PI * 2 / this.numPoint) * map(mouseY, 0, height, 24, 2));
            }
        }
        endShape(CLOSE);
        pop();

        push();
        for(var i = 0, l = this.algaes.length; i < l; i++) {
            translate(map(mouseX, 0, width, width/3, 2 * width/3), map(mouseY, 0, height, height/3, 2 * height/3));
            scale(s);
            translate(-map(mouseX, 0, width, width/3, 2 * width/3), -map(mouseY, 0, height, height/3, 2 * height/3));
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
