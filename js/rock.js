var Rock = function(position, depth, angle, numPoint, shape, id) {
    this.position = position;
    this.depth    = 0;
    this.newDepth = depth;
    this.angle    = angle;
    this.numPoint = numPoint;
    this.shape    = shape;
    this.algaes   = [];
    this.id       = id;

    this.mainCol = {r: 255, g: 255, b: 255};
    this.topCol  = {r: 255, g: 255, b: 255};

    if(!zen) {
        if(this.numPoint == S_TRIANGLE) {
            this.destMainCol = {r: 31, g: 255, b: 135};
            this.destTopCol  = {r: 29, g: 242, b: 129};
        } else if(this.numPoint == S_SQUARE) {
            this.destMainCol = {r: 39, g: 242, b: 127};
            this.destTopCol  = {r: 37, g: 229, b: 120};
        } else if(this.numPoint == S_HEXAGON) {
            this.destMainCol = {r: 38, g: 242, b: 139};
            this.destTopCol  = {r: 35, g: 225, b: 128};
        } else if(this.numPoint == S_CIRCLE) {
            this.destMainCol = {r: 32, g: 229, b: 118}; // 78
            this.destTopCol  = {r: 30, g: 217, b: 111};
        }
    } else {
        this.destMainCol = {r: 38, g: 28, b: 48};
        this.destTopCol  = {r: 16, g: 84, b: 60};
    }
}

Rock.prototype = {
    update: function() {
        this.depth += (this.newDepth - this.depth) * .05;

        this.mainCol.r += (this.destMainCol.r - this.mainCol.r) * .025;
        this.mainCol.g += (this.destMainCol.g - this.mainCol.g) * .025;
        this.mainCol.b += (this.destMainCol.b - this.mainCol.b) * .025;

        this.topCol.r  += (this.destTopCol.r - this.topCol.r) * .025;
        this.topCol.g  += (this.destTopCol.g - this.topCol.g) * .025;
        this.topCol.b  += (this.destTopCol.b - this.topCol.b) * .025;

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
        fill(this.mainCol.r, this.mainCol.g, this.mainCol.b);
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
        fill(this.topCol.r, this.topCol.g, this.topCol.b);
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
        this.algaes.push(new Algae(new Vec2D(x, y), 30, this.numPoint, this.destMainCol));
    },

    addBranch: function(id, fromId) {
        this.algaes[0].addBranch(id, fromId);
    },

    delete: function() {
        for(var i = 0, l = this.algaes.length; i < l; i++) {
            this.algaes[i].delete();
        }
    }
}
