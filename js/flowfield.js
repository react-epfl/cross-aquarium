var Flowfield = function(resolution) {
    this.field      = [];
    this.resolution = resolution;
    this.cols       = width/this.resolution;
    this.rows       = height/this.resolution;
    this.zoff       = 0.0;
    for(var i = 0; i < this.cols; i++) {
        var column = [];
        for(var j = 0; j < this.rows; j++) {
            column.push(new Vec2D());
        }
        this.field.push(column);
    }
    this.update();
}

Flowfield.prototype = {
    update: function() {
        var xoff = 0.0;
        for(var i = 0; i < this.cols; i++) {
            var yoff = 0.0;
            for(var j = 0; j < this.rows; j++) {
                var theta = remap(simplexNoise.noise(xoff, yoff, this.zoff), 0, 1, 0, Math.PI * 2);
                this.field[i][j] = Vec2D.fromTheta(theta);
                yoff += 0.05;
            }
            xoff += 0.05;
        }
        this.zoff += .001;
    },

    display: function() {
        for (var i = 0; i < this.cols; i++) {
            for (var j = 0; j < this.rows; j++) {
                this.drawVector(this.field[i][j], i * this.resolution, j * this.resolution, this.resolution - 2);
            }
        }
    },

    drawVector: function(v, x, y, s) {
        push();
        translate(x, y);
        noFill();
        stroke(255, 150);
        rotate(v.heading());
        var len = v.magnitude() * s;
        line(0, 0, len, 0);
        line(len, 0, len - 4, 2);
        line(len, 0, len - 4, -2);
        pop();
    },

    lookup: function(v) {
        var col = Math.floor(clamp(v.x / this.resolution, 0, this.cols - 1));
        var row = Math.floor(clamp(v.y / this.resolution, 0, this.rows - 1));
        var vec;
        if(typeof this.field[col][row] == 'undefined') {
            vec = new Vec2D(0, 0);
        } else {
            vec = this.field[col][row].copy();
        }
        return vec;
    }
}
