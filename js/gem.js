var Gem = function(position) {
    this.position = position;
    this.rand     = Math.random() * Math.PI * 2;
    this.depth    = 0;
    this.newDepth = 30;

    var min  = -1,
        max  = -1;
    for(var i = 0; i < 5; i++) {
        var x = Math.cos(i * Math.PI * 2 / 5 + this.rand) * 20;
        if(min == -1) {
            min = x;
            this.min = i;
            max = x;
            this.max = i;
        } else {
            if(x < min) {
                min = x;
                this.min = i;
            }
            if(x > max) {
                max = x;
                this.max = i;
            }
        }
    }
    if(this.max > this.min) this.max -= 5;
}

Gem.prototype = {
    update: function() {
        this.depth += (this.newDepth - this.depth) * .05;
    },

    display: function() {
        push();
        translate(this.position.x, this.position.y - map(mouseY, 0, height, 0, height / 24));
        if(!zen) {
            // fill(148, 10, 194);
            fill(230);
        } else {
            fill(6, 60, 114);
        }
        noStroke();
        beginShape();
        for(var i = this.max; i <= this.min; i++) {
            vertex(Math.cos(i * Math.PI * 2 / 5 + this.rand) * 20,
                   Math.sin(i * Math.PI * 2 / 5 + this.rand) * map(mouseY, 0, height, 8, 2));
        }
        for(var i = this.min; i <= 5 + this.max; i++) {
            vertex(Math.cos(i * Math.PI * 2 / 5 + this.rand) * 20,
                   Math.sin(i * Math.PI * 2 / 5 + this.rand) * map(mouseY, 0, height, 8, 2) - this.depth);
        }
        endShape(CLOSE);
        if(!zen) {
            // fill(198, 24, 255);
            fill(255);
        } else {
            fill(20, 120, 210);
        }
        noStroke();
        beginShape();
        for(var i = 0; i < 5; i++) {
            vertex(Math.cos(i * Math.PI * 2 / 5 + this.rand) * 20,
                   Math.sin(i * Math.PI * 2 / 5 + this.rand) * map(mouseY, 0, height, 8, 2) - this.depth);
        }
        endShape(CLOSE);
        pop();
    }
}
