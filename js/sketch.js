var S_TRIANGLE = 3,
    S_SQUARE   = 4,
    S_HEXAGON  = 6,
    S_CIRCLE   = 20;

var R = 9, G = 7, B = 125,
    currentColor = {'r': 9, 'g': 7, 'b': 125};

var json,
    physics,
    step    = 0,
    rocks   = [],
    gems    = [],
    bubbles = [],
    fishes  = [],
    fishBodiesImg = [],
    fishTailsImg  = [],
    fishBodies    = [],
    fishTails     = [],
    flowfield,
    displayTree = [];

var algaeKind = 1;

function preload() {
    fishBodiesImg.push(loadImage('imgs/fish_body_1.png'));
    fishBodiesImg.push(loadImage('imgs/fish_body_2.png'));
    fishBodiesImg.push(loadImage('imgs/fish_body_3.png'));
    fishTailsImg.push(loadImage('imgs/fish_tail_1.png'));
    fishTailsImg.push(loadImage('imgs/fish_tail_2.png'));
    fishTailsImg.push(loadImage('imgs/fish_tail_3.png'));
    fishTailsImg.push(loadImage('imgs/fish_tail_4.png'));
}

var canvas, bg, halo, debug;
function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    frameRate(30);

    createGradient();

    halo = createGraphics(100, 100);
    halo.scale(1 / pixelDensity());
    for(var i = 0; i < 40; i++) {
        halo.fill(255, sin(Math.pow(i / 40, 10) + i / 40 / 10) * 255);
        halo.noStroke();
        halo.ellipse(halo.width / 2, halo.height / 2, 100 - i * 2.5, 100 - i * 2.5);
    }

    physics = new VerletPhysics2D();
    physics.addBehavior(new GravityBehavior(new Vec2D(0, -0.1)));

    flowfield = new Flowfield(20);

    // prepareDatas();

    createBasicShapes();
    createTerrain();
    createFish();
    // addFishes();
}

function createGradient() {
    bg = createGraphics(width, height);
    bg.scale(1 / pixelDensity());
    var color1   = color(0, 0, 0),
        color2   = color(40, 15, 120),
        color3   = color(currentColor.r + 10, currentColor.g + 10, currentColor.b + 10),
        color4   = color(currentColor.r, currentColor.g, currentColor.b),
        bgHeight = bg.height,
        bgWidth  = bg.width,
        horizon  = Math.floor(bgHeight / 2),
        bottom   = bgHeight - bgHeight / 3,
        amount;
    for(var i = 0; i < horizon; i++) {
        amount = map(i, 0, horizon, 0, 1);
        bg.stroke(lerpColor(color1, color2, amount));
        bg.line(0, i, bgWidth, i);
    }
    for(var i = horizon; i < bottom; i++) {
        amount = map(i, horizon, bottom, 0, 1);
        bg.stroke(lerpColor(color2, color3, amount));
        bg.line(0, i, bgWidth, i);
    }
    for(var i = bottom; i < bgHeight; i++) {
        amount = constrain(map(i, bottom, bgHeight - bgHeight / 12, 0, 1), 0, 1);
        bg.stroke(lerpColor(color3, color4, amount));
        bg.line(0, i, bgWidth, i);
    }
}

function prepareDatas() {
    console.log("Space " + json.space.name);
    console.log("created by: " + json.space.creator);
    console.log("-");
    console.log("Items: " + json.items.length);
    for(var i = 0; i < json.items.length; i++) {
        console.log(json.items[i]._type);
        console.log(json.items[i]);
    }
    console.log("-");
    console.log("Members: " + json.members.length);
    for(var i = 0; i < json.members.length; i++) {
        if(i < 10) console.log(json.members[i]);
        else console.log(json.members[i].name);
        console.log(json.members[i].metrics.contributor);
    }
}

var shapes = [];
function createBasicShapes() {
    for(var i = 0; i < 4; i++) {
        var s = createGraphics(20, 10);
        s.scale(1 / pixelDensity());
        s.translate(s.width / 2, s.height / 2);
        s.noStroke();
        s.fill(9, 182, 125);
        if(i == 0) {
            s.beginShape();
            for(var j = 0; j < S_TRIANGLE; j++) {
                s.vertex(Math.cos(j * Math.PI * 2 / S_TRIANGLE - Math.PI / 6) * s.width/2,
                         Math.sin(j * Math.PI * 2 / S_TRIANGLE - Math.PI / 6) * s.height/2);
            }
            s.endShape(CLOSE);
        } else if(i == 1) {
            s.beginShape();
            for(var j = 0; j < S_SQUARE; j++) {
                s.vertex(Math.cos(j * Math.PI * 2 / S_SQUARE) * s.width/2,
                         Math.sin(j * Math.PI * 2 / S_SQUARE) * s.height/2);
            }
            s.endShape(CLOSE);
        } else if(i == 2) {
            s.beginShape();
            for(var j = 0; j < S_HEXAGON; j++) {
                s.vertex(Math.cos(j * Math.PI * 2 / S_HEXAGON) * s.width/2,
                         Math.sin(j * Math.PI * 2 / S_HEXAGON) * s.height/2);
            }
            s.endShape(CLOSE);
        } else if(i == 3) {
            s.beginShape();
            for(var j = 0; j < S_CIRCLE; j++) {
                s.vertex(Math.cos(j * Math.PI * 2 / S_CIRCLE) * s.width/2,
                         Math.sin(j * Math.PI * 2 / S_CIRCLE) * s.height/2);
            }
            s.endShape(CLOSE);
        }
        shapes.push(s);
    }
}

function createTerrain() {
    if(rocks.length > 0) {
        for(var i = 0, l = rocks.length; i < l; i++) {
            rocks[i].delete();
        }
    }

    rocks = [];
    // for(var i = 0; i < 8; i++) {
    //     var rand = Math.floor(constrain(random(4), 0, 3));
    //     addRock(random(0, width), height - height/12, random(50, 400), random(-PI/10, PI/10), rand, shapes[rand]);
    // }

    // addRock(width/2, height-height/12, 300, 0, 2);
}

function createFish() {
    for(var i = 0; i < fishBodiesImg.length; i++) {
        var fishBody = createGraphics(50, 32);
        fishBody.scale(1 / pixelDensity());
        fishBody.translate(fishBody.width/2, fishBody.height/2);
        fishBody.rotate(PI);
        fishBody.push();
        fishBody.image(fishBodiesImg[i], -fishBody.width/2, -fishBody.height/2, fishBody.width, fishBody.height);
        fishBody.pop();
        fishBodies.push(fishBody);
    }
    for(var i = 0; i < fishTailsImg.length; i++) {
        var fishTail = createGraphics(70, 48);
        fishTail.scale(1 / pixelDensity());
        fishTail.translate(fishTail.width/2, fishTail.height/2);
        fishTail.rotate(PI);
        fishTail.push();
        fishTail.image(fishTailsImg[i], -fishTail.width/2, -fishTail.height/2, fishTail.width, fishTail.height);
        fishTail.pop();
        fishTails.push(fishTail);
    }
}

function addFishes() {
    var scale = constrain(map(50, 1, 300, .8, .5), .5, .8);

    for(var i = 0; i < 50; i++) {
        fishes.push(new Fish(new Vec2D(width/2, -50), 6.0, 0.1, fishBodies[0], undefined, scale));
    }
}

function update() {
    R += (currentColor.r - R) * .1;
    G += (currentColor.g - G) * .1;
    B += (currentColor.b - B) * .1;

    physics.update();

    if(random() < .05) {
        bubbles.push(new Bubble(new Vec2D(random(width/6, width - width/6), random(height - height/3, height - height/12)), physics));
    }

    for(var i = bubbles.length - 1; i >= 0; i--) {
        bubbles[i].update();
        if(bubbles[i].isDead()) {
            physics.removeParticle(bubbles[i].particle);
            bubbles.splice(i, 1);
        }
    }

    for(var i = 0, l = rocks.length; i < l; i++) {
        rocks[i].update();
    }

    // flowfield.update();

    var t = touchIsDown;
    for(var i = 0, l = fishes.length; i < l; i++) {
        fishes[i].step(fishes, flowfield);
        if(t) fishes[i].seek(new Vec2D(touchX, touchY));
    }

    step++;
}

var intro = false, introBeginning;
function draw() {
    update();

    image(bg, 0, 0);
    // background(0);

    if(intro && step - introBeginning <= 120) {
        var offset = map(step - introBeginning, 0, 120, 3, 0);
        translate(random(-offset, offset), random(-offset, offset));
        if(step - introBeginning == 120) intro = false;
    }

    for(var i = 0, l = bubbles.length; i < l; i++) {
        bubbles[i].display();
    }

    for(var i = 0, l = rocks.length; i < l; i++) {
        rocks[i].display(i, rocks.length);
        for(var j = 0, ll = displayTree[i].length; j < ll; j++) {
            displayTree[i][j].display(i, rocks.length);
        }
    }

    // for(var i = 0; i < fishes.length; i++) {
    //     fishes[i].display();
    // }

    // if(debug) flowfield.display();

    if(touchIsDown) {
        image(halo, touchX - halo.width/2, touchY - halo.height/2);
    }

    fill(255);
    noStroke();
    text(Math.floor(frameRate()) + "fps", 5, 40);
}

function addRock(x, y, h, a, kind) {
    var r;
    switch(kind) {
        case 0:
            r = new Rock(new Vec2D(x, y), h, a, S_TRIANGLE, shapes[kind]);
            break;

        case 1:
            r = new Rock(new Vec2D(x, y), h, a, S_SQUARE, shapes[kind]);
            break;

        case 2:
            r = new Rock(new Vec2D(x, y), h, a, S_HEXAGON, shapes[kind]);
            break;

        case 3:
            r = new Rock(new Vec2D(x, y), h, a, S_CIRCLE, shapes[kind]);
            break;

        default:
            break;
    }
    rocks.push(r);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mouseDragged() {
    // bubbles.push(new Bubble(new Vec2D(mouseX, mouseY), physics));
}

function keyPressed() {
    if(key == ' ') {
        debug = true;
    }
}

function keyReleased() {
    if(key == ' ') {
        debug = false;
    }
}
