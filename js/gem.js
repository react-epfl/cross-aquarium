var Gem = function(id, position) {
    this.id       = id;
    this.position = position;
    this.rand     = -Math.PI/2; //Math.random() * Math.PI * 2;
    this.depth    = 0;
    this.newDepth = 30;
    this.scale    = 0;
    this.springs  = [];

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

    for(var i = 0; i <= 3; i++) {
        var p = new VerletParticle2D(0, -i * 50);

        physics.addParticle(p);

        if(i == 0) p.lock();
        else {
            var prev   = physics.particles[physics.particles.length - 2];
            var spring = new VerletSpring2D(p, prev, 50, .1);

            physics.addSpring(spring);

            this.springs.push(spring);

            if(i == 3) {
                this.gem = p;
            }
        }
    }
}

Gem.prototype = {
    update: function() {
        this.depth += (this.newDepth - this.depth) * .05;
        this.scale += (1 - this.scale) * .025;
        this.gem.addForce(new Vec2D(randomBetween(-.1, .1), 0));
    },

    display: function(s, offX, offY) {
        push();
        translate(offX, offY);
        scale(s);
        translate(-offX, -offY);
        translate(this.position.x, this.position.y);
        scale(this.scale);
        for(var i = 0, l = this.springs.length; i < l; i++) {
            noFill();
            if(!zen) {
                stroke(118, 55, 172);
            } else {
                stroke(230);
            }
            line(this.springs[i].a.x, this.springs[i].a.y,
                 this.springs[i].b.x, this.springs[i].b.y);
            if(i % 3 == 2) {
                push();
                var dir = this.springs[i].b.sub(this.springs[i].a);
                translate(this.gem.x, this.gem.y);
                rotate(dir.heading() - PI/2);
                if(!zen) {
                    fill(137, 64, 200);
                } else {
                    fill(230);
                }
                noStroke();
                beginShape();
                for(var i = this.max + 1; i <= this.min - 1; i++) {
                    vertex(Math.cos(i * Math.PI * 2 / 5 + this.rand) * 10,
                           Math.sin(i * Math.PI * 2 / 5 + this.rand) * remap(mouseY, 0, height, 4, 2) + this.depth / 2.5);
                }
                for(var i = this.min; i <= 5 + this.max; i++) {
                    vertex(Math.cos(i * Math.PI * 2 / 5 + this.rand) * 20,
                           Math.sin(i * Math.PI * 2 / 5 + this.rand) * remap(mouseY, 0, height, 6, 2));
                }
                endShape(CLOSE);
                beginShape();
                for(var i = this.max; i <= this.min; i++) {
                    vertex(Math.cos(i * Math.PI * 2 / 5 + this.rand) * 20,
                           Math.sin(i * Math.PI * 2 / 5 + this.rand) * remap(mouseY, 0, height, 6, 2));
                }
                for(var i = this.min; i <= 5 + this.max; i++) {
                    vertex(Math.cos(i * Math.PI * 2 / 5 + this.rand) * 10,
                           Math.sin(i * Math.PI * 2 / 5 + this.rand) * remap(mouseY, 0, height, 4, 2) - this.depth / 2.5);
                }
                endShape(CLOSE);
                noFill();
                if(!zen) {
                    stroke(123, 57, 179);
                } else {
                    stroke(255);
                }
                beginShape();
                for(var i = this.max; i <= this.min; i++) {
                    vertex(Math.cos(i * Math.PI * 2 / 5 + this.rand) * 20,
                           Math.sin(i * Math.PI * 2 / 5 + this.rand) * remap(mouseY, 0, height, 6, 2));
                }
                endShape();
                if(!zen) {
                    fill(123, 57, 179);
                } else {
                    fill(255);
                }
                noStroke();
                beginShape();
                for(var i = 0; i < 5; i++) {
                    vertex(Math.cos(i * Math.PI * 2 / 5 + this.rand) * 10,
                           Math.sin(i * Math.PI * 2 / 5 + this.rand) * remap(mouseY, 0, height, 4, 2) - this.depth / 2.5);
                }
                endShape(CLOSE);
                pop();
            }
        }
        pop();
    },

    delete: function() {
        for(var i = this.springs.length - 1; i > 0; i--) {
            var s = this.springs.splice(i, 1);
            physics.removeSpringElements(s);
            s = null;
        }
    }
}
