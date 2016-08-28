var Fish = function(position, maxSpeed, maxForce, body, tail, id) {
    this.position     = position;
    this.angle        = 0;
    this.previousAngle= 0;
    this.acceleration = new Vec2D();
    this.velocity     = Vec2D.randomVector();
    this.maxSpeed     = maxSpeed;
    this.initialMaxSpeed = maxSpeed;
    this.maxForce     = maxForce;
    this.body         = body;
    this.tail         = tail;
    this.id           = id;
    this.theta        = 0;
    this.life         = random(1000);
}

Fish.prototype = {
    step: function(fishes, flowfield) {
        // this.maxSpeed = map(this.position.y, height - 500, height - 100, 6.0, 1.0);
        // this.maxSpeed = constrain(this.maxSpeed, 1.0, 6.0);
        this.flock(fishes, flowfield);
        this.update();
        this.checkBorders();
        // this.life += map(this.velocity.magnitude(), 0, this.maxSpeed, .1, 1);
        this.life++;
    },

    flock: function(fishes, flowfield) {
        var sep = this.separate(fishes),
            ali = this.align(fishes),
            coh = this.cohesion(fishes),
            fol = this.follow(flowfield),
            wan = this.wander();

        sep.scaleSelf(2.0);
        ali.scaleSelf(((Math.cos(step * .01) + 1) / 2));
        coh.scaleSelf(((Math.cos(step * .01) + 1) / 2));
        fol.scaleSelf(0.5);
        wan.scaleSelf(0.75);

        this.acceleration.addSelf(sep);
        this.acceleration.addSelf(ali);
        this.acceleration.addSelf(coh);
        this.acceleration.addSelf(fol);
        this.acceleration.addSelf(wan);
    },

    update: function() {
        // this.maxSpeed = map(mouseX, 0, width, 3, 10);
        this.velocity.addSelf(this.acceleration);
        this.velocity.limit(this.maxSpeed);

        this.position.addSelf(this.velocity);

        this.acceleration.clear();

        this.maxSpeed += (this.initialMaxSpeed - this.maxSpeed) * .05;

        // this.angle += (this.velocity.heading() - this.angle) * .1;
        this.previousAngle = this.angle;
        this.angle = this.velocity.heading();
    },

    wander: function() {
        var wanderR = 25;
        var wanderD = 80;
        var change  = .3;
        this.theta += random(-change,change);

        var target = this.velocity.copy();
        target.normalize();
        target.scaleSelf(wanderD);
        target.addSelf(this.position);

        var h = this.velocity.heading();

        var offset = new Vec2D(wanderR * cos(this.theta + h), wanderR * sin(this.theta + h));
        target.addSelf(offset);

        return this.steer(target, false);
    },

    seek: function(target) {
        this.maxSpeed = this.initialMaxSpeed * 2;
        this.acceleration.addSelf(this.steer(target, false).scaleSelf(1.5));
    },

    arrive: function(target) {
        this.acceleration.addSelf(this.steer(target, true));
    },

    steer: function(target, slowdown) {
        var steer   = new Vec2D(),
            desired = target.sub(this.position),
            d       = desired.magnitude();

        if(d > 0) {
            desired.normalize();

            if(slowdown && d < 100.0) desired.scaleSelf(this.maxSpeed * d / 100.0);
            else desired.scaleSelf(this.maxSpeed);

            steer = desired.sub(this.velocity).limit(this.maxForce);
        }

        return steer;
    },

    checkBorders: function() {
        // if(this.position.x < -50) this.position.x = width + 50;
        // else if(this.position.x > width + 50) this.position.x = -50;
        if(this.position.x < 50) {
            var steer = new Vec2D(this.maxSpeed, this.velocity.x);
            steer.normalize();
            steer.scaleSelf(this.maxSpeed);
            steer.subSelf(this.velocity);
            steer.limit(this.maxForce);
            this.acceleration.addSelf(steer.scaleSelf(2.0));
        } else if(this.position.x > width - 50) {
            var steer = new Vec2D(-this.maxSpeed, this.velocity.x);
            steer.normalize();
            steer.scaleSelf(this.maxSpeed);
            steer.subSelf(this.velocity);
            steer.limit(this.maxForce);
            this.acceleration.addSelf(steer.scaleSelf(2.0));
        }
        if(this.position.y < 10) {
            var steer = new Vec2D(this.velocity.x, this.maxSpeed);
            steer.normalize();
            steer.scaleSelf(this.maxSpeed);
            steer.subSelf(this.velocity);
            steer.limit(this.maxForce);
            this.acceleration.addSelf(steer.scaleSelf(2.0));
        } else if(this.position.y > height - height/6) {
            var steer = new Vec2D(this.velocity.x, -this.maxSpeed);
            steer.normalize();
            steer.scaleSelf(this.maxSpeed);
            steer.subSelf(this.velocity);
            steer.limit(this.maxForce);
            this.acceleration.addSelf(steer.scaleSelf(2.0));
        }
    },

    follow: function(flowfield) {
        var steer = flowfield.lookup(this.position);
        steer.scaleSelf(this.maxSpeed);
        steer.subSelf(this.velocity);
        steer.limit(this.maxForce);

        return steer;
    },

    separate: function(fishes) {
        var desiredSeparation = 50.0,
            steer             = new Vec2D(),
            count             = 0;

        for(var i = 0; i < fishes.length; i++) {
            var other = fishes[i],
                d     = this.position.distanceTo(other.position);

            if(d > 0 && d < desiredSeparation) {
                var diff = this.position.sub(other.position);
                diff.normalizeTo(1.0/d);
                steer.addSelf(diff);
                count++;
            }
        }

        if(count > 0) {
            steer.scaleSelf(1.0/count);
        }

        if(steer.magnitude() > 0) {
            steer.normalizeTo(this.maxSpeed);
            steer.subSelf(this.velocity);
            steer.limit(this.maxForce);
        }

        return steer;
    },

    align: function(fishes) {
        var neighborDistance = 75.0,
            steer            = new Vec2D(),
            count            = 0;

        for(var i = 0; i < fishes.length; i++) {
            var other = fishes[i],
                d     = this.position.distanceTo(other.position);

            if(d > 0 && d < neighborDistance) {
                steer.addSelf(other.velocity);
                count++;
            }
        }

        if(count > 0) {
            steer.scaleSelf(1.0/count);
        }

        if(steer.magnitude() > 0) {
            steer.normalizeTo(this.maxSpeed);
            steer.subSelf(this.velocity);
            steer.limit(this.maxForce);
        }

        return steer;
    },

    cohesion: function(fishes) {
        var neighborDistance = 75.0,
            sum              = new Vec2D(),
            count            = 0;

        for(var i = 0; i < fishes.length; i++) {
            var other = fishes[i],
                d     = this.position.distanceTo(other.position);

            if(d > 0 && d < neighborDistance) {
                sum.addSelf(other.position);
                count++;
            }
        }

        if(count > 0) {
            sum.scaleSelf(1.0/count);
            return this.steer(sum, false);
        }

        return sum;
    },

    display: function(s, n) {
        push();
        translate(map(mouseX, 0, width, width/3, 2 * width/3), map(mouseY, 0, height, height/3, 2 * height/3));
        scale(s);
        translate(-map(mouseX, 0, width, width/3, 2 * width/3), -map(mouseY, 0, height, height/3, 2 * height/3));
        translate(this.position.x, this.position.y);
        rotate(this.angle);
        scale(constrain(map(n, 0, 500, .7, .5), .5, .7));
        push();
        switch(this.body) {
            case 0:
                push();
                translate(fishBodies[this.body].width / 8, fishBodies[this.body].height / 4);
                rotate(cos(this.life * 1) * PI / map(this.velocity.magnitude(), 0, this.maxSpeed, 100, 10) - PI/3);
                scale(.7);
                if(!zen) {
                    image(fishTails[this.tail], -fishTails[this.tail].width, -fishTails[this.tail].height / 2);
                } else {
                    image(fishTails[this.tail][this.body], -fishTails[this.tail][this.body].width, -fishTails[this.tail][this.body].height / 2);
                }
                pop();
                push();
                translate(fishBodies[this.body].width / 8, -fishBodies[this.body].height / 4);
                rotate(sin(this.life * 1) * PI / map(this.velocity.magnitude(), 0, this.maxSpeed, 100, 10) + PI/3);
                scale(.7);
                if(!zen) {
                    image(fishTails[this.tail], -fishTails[this.tail].width, -fishTails[this.tail].height / 2);
                } else {
                    image(fishTails[this.tail][this.body], -fishTails[this.tail][this.body].width, -fishTails[this.tail][this.body].height / 2);
                }
                pop();
                break;

            case 1:
                push();
                translate(0, fishBodies[this.body].height / 4);
                rotate(cos(this.life * 1) * PI / map(this.velocity.magnitude(), 0, this.maxSpeed, 100, 10) - PI/3);
                if(!zen) {
                    image(fishTails[this.tail], -fishTails[this.tail].width, -fishTails[this.tail].height / 2);
                } else {
                    image(fishTails[this.tail][this.body], -fishTails[this.tail][this.body].width, -fishTails[this.tail][this.body].height / 2);
                }
                pop();
                push();
                translate(0, -fishBodies[this.body].height / 4);
                rotate(sin(this.life * 1) * PI / map(this.velocity.magnitude(), 0, this.maxSpeed, 100, 10) + PI/3);
                if(!zen) {
                    image(fishTails[this.tail], -fishTails[this.tail].width, -fishTails[this.tail].height / 2);
                } else {
                    image(fishTails[this.tail][this.body], -fishTails[this.tail][this.body].width, -fishTails[this.tail][this.body].height / 2);
                }
                pop();
                break;

            case 2:
                push();
                rotate(cos(this.life * 1) * PI / map(this.velocity.magnitude(), 0, this.maxSpeed, 100, 10));
                if(!zen) {
                    image(fishTails[this.tail], -fishTails[this.tail].width, -fishTails[this.tail].height / 2);
                } else {
                    image(fishTails[this.tail][this.body], -fishTails[this.tail][this.body].width, -fishTails[this.tail][this.body].height / 2);
                }
                pop();
                break;

            case 3:
                push();
                translate(fishBodies[this.body].width / 12, fishBodies[this.body].height / 4);
                rotate(cos(this.life * 1) * PI / map(this.velocity.magnitude(), 0, this.maxSpeed, 100, 10) - PI/10);
                if(!zen) {
                    image(fishTails[this.tail], -fishTails[this.tail].width, -fishTails[this.tail].height / 2);
                } else {
                    image(fishTails[this.tail][this.body], -fishTails[this.tail][this.body].width, -fishTails[this.tail][this.body].height / 2);
                }
                pop();
                push();
                translate(fishBodies[this.body].width / 12, -fishBodies[this.body].height / 4);
                rotate(-cos(this.life * 1) * PI / map(this.velocity.magnitude(), 0, this.maxSpeed, 100, 10) + PI/10);
                if(!zen) {
                    image(fishTails[this.tail], -fishTails[this.tail].width, -fishTails[this.tail].height / 2);
                } else {
                    image(fishTails[this.tail][this.body], -fishTails[this.tail][this.body].width, -fishTails[this.tail][this.body].height / 2);
                }
                pop();
                push();
                translate(-fishBodies[this.body].width / 2, 0);
                rotate(sin(this.life * 1) * PI / map(this.velocity.magnitude(), 0, this.maxSpeed, 100, 10));
                if(!zen) {
                    image(fishTails[this.tail], -fishTails[this.tail].width, -fishTails[this.tail].height / 2);
                } else {
                    image(fishTails[this.tail][this.body], -fishTails[this.tail][this.body].width, -fishTails[this.tail][this.body].height / 2);
                }
                pop();
                break;

            case 4:
                push();
                translate(-fishBodies[this.body].width / 12, fishBodies[this.body].height / 2.8);
                rotate(cos(this.life * 1) * PI / map(this.velocity.magnitude(), 0, this.maxSpeed, 100, 10) - PI/10);
                if(!zen) {
                    image(fishTails[this.tail], -fishTails[this.tail].width, -fishTails[this.tail].height / 2);
                } else {
                    image(fishTails[this.tail][this.body], -fishTails[this.tail][this.body].width, -fishTails[this.tail][this.body].height / 2);
                }
                pop();
                push();
                translate(-fishBodies[this.body].width / 12, -fishBodies[this.body].height / 2.8);
                rotate(-cos(this.life * 1) * PI / map(this.velocity.magnitude(), 0, this.maxSpeed, 100, 10) + PI/10);
                if(!zen) {
                    image(fishTails[this.tail], -fishTails[this.tail].width, -fishTails[this.tail].height / 2);
                } else {
                    image(fishTails[this.tail][this.body], -fishTails[this.tail][this.body].width, -fishTails[this.tail][this.body].height / 2);
                }
                pop();
                push();
                translate(-fishBodies[this.body].width / 2, 0);
                rotate(sin(this.life * 1) * PI / map(this.velocity.magnitude(), 0, this.maxSpeed, 100, 10));
                if(!zen) {
                    image(fishTails[this.tail], -fishTails[this.tail].width, -fishTails[this.tail].height / 2);
                } else {
                    image(fishTails[this.tail][this.body], -fishTails[this.tail][this.body].width, -fishTails[this.tail][this.body].height / 2);
                }
                pop();
                break;

            case 5:
                push();
                translate(-fishBodies[this.body].width / 12, fishBodies[this.body].height / 2.8);
                rotate(cos(this.life * 1) * PI / map(this.velocity.magnitude(), 0, this.maxSpeed, 100, 10) - PI/5);
                if(!zen) {
                    image(fishTails[this.tail], -fishTails[this.tail].width, -fishTails[this.tail].height / 2);
                } else {
                    image(fishTails[this.tail][this.body], -fishTails[this.tail][this.body].width, -fishTails[this.tail][this.body].height / 2);
                }
                pop();
                push();
                translate(-fishBodies[this.body].width / 12, -fishBodies[this.body].height / 2.8);
                rotate(-cos(this.life * 1) * PI / map(this.velocity.magnitude(), 0, this.maxSpeed, 100, 10) + PI/5);
                if(!zen) {
                    image(fishTails[this.tail], -fishTails[this.tail].width, -fishTails[this.tail].height / 2);
                } else {
                    image(fishTails[this.tail][this.body], -fishTails[this.tail][this.body].width, -fishTails[this.tail][this.body].height / 2);
                }
                pop();
                push();
                translate(-fishBodies[this.body].width / 2, 0);
                rotate(sin(this.life * 1) * PI / map(this.velocity.magnitude(), 0, this.maxSpeed, 100, 10));
                if(!zen) {
                    image(fishTails[this.tail], -fishTails[this.tail].width, -fishTails[this.tail].height / 2);
                } else {
                    image(fishTails[this.tail][this.body], -fishTails[this.tail][this.body].width, -fishTails[this.tail][this.body].height / 2);
                }
                pop();
                break;

            case 6:
                push();
                translate(fishBodies[this.body].width / 12, fishBodies[this.body].height / 2);
                rotate(cos(this.life * 1) * PI / map(this.velocity.magnitude(), 0, this.maxSpeed, 100, 10) - PI/5);
                if(!zen) {
                    image(fishTails[this.tail], -fishTails[this.tail].width, -fishTails[this.tail].height / 2);
                } else {
                    image(fishTails[this.tail][this.body], -fishTails[this.tail][this.body].width, -fishTails[this.tail][this.body].height / 2);
                }
                pop();
                push();
                translate(fishBodies[this.body].width / 12, -fishBodies[this.body].height / 2);
                rotate(-cos(this.life * 1) * PI / map(this.velocity.magnitude(), 0, this.maxSpeed, 100, 10) + PI/5);
                if(!zen) {
                    image(fishTails[this.tail], -fishTails[this.tail].width, -fishTails[this.tail].height / 2);
                } else {
                    image(fishTails[this.tail][this.body], -fishTails[this.tail][this.body].width, -fishTails[this.tail][this.body].height / 2);
                }
                pop();
                push();
                translate(-fishBodies[this.body].width / 2, 0);
                rotate(sin(this.life * 1) * PI / map(this.velocity.magnitude(), 0, this.maxSpeed, 100, 10));
                if(!zen) {
                    image(fishTails[this.tail], -fishTails[this.tail].width, -fishTails[this.tail].height / 2);
                } else {
                    image(fishTails[this.tail][this.body], -fishTails[this.tail][this.body].width, -fishTails[this.tail][this.body].height / 2);
                }
                pop();
                break;
        }
        pop();
        image(fishBodies[this.body], -fishBodies[this.body].width / 2, -fishBodies[this.body].height / 2);
        pop();
    },

    delete: function() {

    }
}
