var Rock = function(position, depth, angle, numPoint, shape, id, intro, isByUser) {
    this.position = position;
    this.depth    = 0;
    this.newDepth = depth;
    this.angle    = angle;
    this.numPoint = numPoint;
    this.shape    = shape;
    this.algaes   = [];
    this.id       = id;
    this.isByUser = isByUser;

    this.maxNumBranches = random(7, 12);

    if(!zen) {
        if(this.numPoint == S_TRIANGLE) {
            this.destMainCol = {r: 149, g: 255, b: 135};
            this.destTopCol  = {r: 142, g: 234, b: 129};
        } else if(this.numPoint == S_SQUARE) {
            this.destMainCol = {r: 84, g: 255, b: 176};
            this.destTopCol  = {r: 80, g: 234, b: 157};
        } else if(this.numPoint == S_HEXAGON) {
            this.destMainCol = {r: 38, g: 242, b: 139};
            this.destTopCol  = {r: 40, g: 219, b: 125};
        } else if(this.numPoint == S_CIRCLE) {
            this.destMainCol = {r: 78, g: 245, b: 95};
            this.destTopCol  = {r: 80, g: 226, b: 90};
        }
    } else {
        this.destMainCol = {r: 38, g: 28, b: 48};
        this.destTopCol  = {r: 16, g: 84, b: 60};
    }

    if(intro) {
        this.mainCol = this.destMainCol;
        this.topCol  = this.destTopCol;
    } else {
        this.mainCol = {r: 255, g: 255, b: 255};
        this.topCol  = {r: 255, g: 255, b: 255};
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
        var scaleY = this.angle == Math.PI / 2 ? 24 : map(mouseY, 0, height, 24, 2);
        var offsetAngle = this.angle == Math.PI / 2 ? Math.PI / 8 : 0;
        if(this.numPoint == S_TRIANGLE) {
            for(var i = 0; i < this.numPoint; i++) {
                vertex(Math.cos(i * Math.PI * 2 / this.numPoint - Math.PI / 6) * 120,
                       Math.sin(i * Math.PI * 2 / this.numPoint - Math.PI / 6) * scaleY);
            }
            for(var i = this.numPoint - 1; i >= 0; i--) {
                if(i != 1) {
                    var x = Math.cos(i * Math.PI * 2 / this.numPoint - Math.PI / 6) * 120,
                        y = Math.sin(i * Math.PI * 2 / this.numPoint - Math.PI / 6) * scaleY - this.depth;
                    vertex(Math.cos(this.angle) * x - Math.sin(this.angle) * y,
                           Math.sin(this.angle) * x + Math.cos(this.angle) * y);
                }
            }
        } else {
            for(var i = 0; i < this.numPoint / 2 + 1; i++) {
                vertex(Math.cos(i * Math.PI * 2 / this.numPoint) * 120,
                       Math.sin(i * Math.PI * 2 / this.numPoint) * scaleY);
            }
            for(var i = this.numPoint / 2; i < this.numPoint + 1; i++) {
                var x = Math.cos(i * Math.PI * 2 / this.numPoint) * 120,
                    y = Math.sin(i * Math.PI * 2 / this.numPoint) * scaleY - this.depth;
                vertex(Math.cos(this.angle) * x - Math.sin(this.angle) * y,
                       Math.sin(this.angle) * x + Math.cos(this.angle) * y);
            }
        }
        endShape(CLOSE);

        push();
        translate(Math.cos(this.angle - PI/2) * this.depth, Math.sin(this.angle - PI/2) * this.depth);
        rotate(this.angle);
        fill(this.topCol.r, this.topCol.g, this.topCol.b);
        beginShape();
        if (this.numPoint == S_TRIANGLE) {
            for(var i = 0; i < this.numPoint; i++) {
                vertex(Math.cos(i * Math.PI * 2 / this.numPoint - Math.PI / 6) * 120,
                       Math.sin(i * Math.PI * 2 / this.numPoint - Math.PI / 6) * scaleY);
            }
        } else {
            for(var i = 0; i < this.numPoint; i++) {
                vertex(Math.cos(i * Math.PI * 2 / this.numPoint) * 120,
                       Math.sin(i * Math.PI * 2 / this.numPoint) * scaleY);
            }
        }
        endShape(CLOSE);
        if(debug) {
            stroke(255);
            ellipse(0, 0, 120, map(mouseY, 0, height, 24, 2));
            noStroke();
        }

        if(this.isByUser) {
            scale((Math.cos(step * .25) + 1) / 2 * .05 + .85);
            rotate(Math.PI);
            image(halfBubble, -halfBubble.width / 2, -halfBubble.height / 6);
        }

        pop();

        for(var i = 0, l = this.algaes.length; i < l; i++) {
            this.algaes[i].display(this.angle);
        }
        pop();

    },

    addAlgae: function() {
        var a = new Algae(new Vec2D(0, -this.newDepth), 30, this.numPoint, this.destMainCol);
        for(var i = 0, l = this.algaes.length; i < l; i++) {
            if(a.offset.y < this.algaes[i].offset.y) {
                this.algaes.splice(i, 0, a);
                return i;
            }
        }
        this.algaes.push(a);
        return this.algaes.length - 1;
    },

    addBranch: function(id, intro, isByUser, fromId) {
        if(typeof fromId !== 'undefined') {
            for(var i = 0, l = this.algaes.length; i < l; i++) {
                for(var j = 0, ll = this.algaes[i].branches.length; j < ll; j++) {
                    if(this.algaes[i].branches[j].id == fromId) {
                        this.algaes[i].addBranch(id, intro, isByUser, fromId);
                        return;
                    }
                }
            }
            console.log("there is no parent comment with the id: " + fromId);
        } else {
            for(var i = 0, l = this.algaes.length; i < l; i++) {
                if(this.algaes[i].branches.length < this.maxNumBranches) {
                    this.algaes[i].addBranch(id, intro, isByUser, fromId);
                    return;
                }
            }
            this.algaes[this.addAlgae()].addBranch(id, intro, isByUser, fromId);
            this.maxNumBranches = random(7, 12);
        }
    },

    delete: function() {
        for(var i = 0, l = this.algaes.length; i < l; i++) {
            this.algaes[i].delete();
        }
    },

    deleteComment: function(commentId) {
        for(var i = 0, l = this.algaes.length; i < l; i++) {
            if(this.algaes[i].deleteComment(commentId)) return true;
        }
        return false;
    }
}
