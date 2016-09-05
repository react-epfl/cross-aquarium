var S_TRIANGLE = 3,
    S_SQUARE   = 4,
    S_HEXAGON  = 6,
    S_CIRCLE   = 20;

var currentColor;
if(!zen) {
    currentColor = {'r': 0, 'g': 250, 'b': 250};
} else {
    currentColor = {'r': 20, 'g': 10, 'b': 30};
}

var physics,
    step          = 0,
    rocks         = [],
    gems          = [],
    bubbles       = [],
    fishes        = [],
    fishBodiesImg = [],
    fishTailsImg  = [],
    fishBodies    = [],
    fishTails     = [],
    bubbleImg,
    bubble,
    flowfield,
    displayTree   = [],
    canvas,
    bg,
    halo,
    topGradient,
    bottomGradient,
    leftGradient,
    rightGradient,
    debug         = false,
    intro         = false,
    introBeginning;

function preload() {
    if(!zen) {
        fishBodiesImg.push(loadImage('imgs/no_color/fish_body_01.png'));
        fishBodiesImg.push(loadImage('imgs/no_color/fish_body_02.png'));
        fishBodiesImg.push(loadImage('imgs/no_color/fish_body_03.png'));
        fishBodiesImg.push(loadImage('imgs/no_color/fish_body_04.png'));
        fishBodiesImg.push(loadImage('imgs/no_color/fish_body_05.png'));
        fishBodiesImg.push(loadImage('imgs/no_color/fish_body_06.png'));
        fishBodiesImg.push(loadImage('imgs/no_color/fish_body_07.png'));
        fishTailsImg.push(loadImage('imgs/no_color/fish_tail_01.png'));
        fishTailsImg.push(loadImage('imgs/no_color/fish_tail_02.png'));
        fishTailsImg.push(loadImage('imgs/no_color/fish_tail_03.png'));
        fishTailsImg.push(loadImage('imgs/no_color/fish_tail_04.png'));
    } else {
        fishBodiesImg.push(loadImage('imgs/color/fish_body_01.png'));
        fishBodiesImg.push(loadImage('imgs/color/fish_body_02.png'));
        fishBodiesImg.push(loadImage('imgs/color/fish_body_03.png'));
        fishBodiesImg.push(loadImage('imgs/color/fish_body_04.png'));
        fishBodiesImg.push(loadImage('imgs/color/fish_body_05.png'));
        fishBodiesImg.push(loadImage('imgs/color/fish_body_06.png'));
        fishBodiesImg.push(loadImage('imgs/color/fish_body_07.png'));
        fishTailsImg.push([]);
        fishTailsImg[fishTailsImg.length - 1].push(loadImage('imgs/color/fish_tail_01_01.png'));
        fishTailsImg[fishTailsImg.length - 1].push(loadImage('imgs/color/fish_tail_01_02.png'));
        fishTailsImg[fishTailsImg.length - 1].push(loadImage('imgs/color/fish_tail_01_03.png'));
        fishTailsImg[fishTailsImg.length - 1].push(loadImage('imgs/color/fish_tail_01_04.png'));
        fishTailsImg[fishTailsImg.length - 1].push(loadImage('imgs/color/fish_tail_01_05.png'));
        fishTailsImg[fishTailsImg.length - 1].push(loadImage('imgs/color/fish_tail_01_06.png'));
        fishTailsImg[fishTailsImg.length - 1].push(loadImage('imgs/color/fish_tail_01_07.png'));
        fishTailsImg.push([]);
        fishTailsImg[fishTailsImg.length - 1].push(loadImage('imgs/color/fish_tail_02_01.png'));
        fishTailsImg[fishTailsImg.length - 1].push(loadImage('imgs/color/fish_tail_02_02.png'));
        fishTailsImg[fishTailsImg.length - 1].push(loadImage('imgs/color/fish_tail_02_03.png'));
        fishTailsImg[fishTailsImg.length - 1].push(loadImage('imgs/color/fish_tail_02_04.png'));
        fishTailsImg[fishTailsImg.length - 1].push(loadImage('imgs/color/fish_tail_02_05.png'));
        fishTailsImg[fishTailsImg.length - 1].push(loadImage('imgs/color/fish_tail_02_06.png'));
        fishTailsImg[fishTailsImg.length - 1].push(loadImage('imgs/color/fish_tail_02_07.png'));
        fishTailsImg.push([]);
        fishTailsImg[fishTailsImg.length - 1].push(loadImage('imgs/color/fish_tail_03_01.png'));
        fishTailsImg[fishTailsImg.length - 1].push(loadImage('imgs/color/fish_tail_03_02.png'));
        fishTailsImg[fishTailsImg.length - 1].push(loadImage('imgs/color/fish_tail_03_03.png'));
        fishTailsImg[fishTailsImg.length - 1].push(loadImage('imgs/color/fish_tail_03_04.png'));
        fishTailsImg[fishTailsImg.length - 1].push(loadImage('imgs/color/fish_tail_03_05.png'));
        fishTailsImg[fishTailsImg.length - 1].push(loadImage('imgs/color/fish_tail_03_06.png'));
        fishTailsImg[fishTailsImg.length - 1].push(loadImage('imgs/color/fish_tail_03_07.png'));
        fishTailsImg.push([]);
        fishTailsImg[fishTailsImg.length - 1].push(loadImage('imgs/color/fish_tail_04_01.png'));
        fishTailsImg[fishTailsImg.length - 1].push(loadImage('imgs/color/fish_tail_04_02.png'));
        fishTailsImg[fishTailsImg.length - 1].push(loadImage('imgs/color/fish_tail_04_03.png'));
        fishTailsImg[fishTailsImg.length - 1].push(loadImage('imgs/color/fish_tail_04_04.png'));
        fishTailsImg[fishTailsImg.length - 1].push(loadImage('imgs/color/fish_tail_04_05.png'));
        fishTailsImg[fishTailsImg.length - 1].push(loadImage('imgs/color/fish_tail_04_06.png'));
        fishTailsImg[fishTailsImg.length - 1].push(loadImage('imgs/color/fish_tail_04_07.png'));
    }
    bubbleImg = loadImage('imgs/bubble.png');
}

function setup() {
    var canvas = createCanvas(window.innerWidth, window.innerHeight);
    canvas.parent('#canvas');
    frameRate(30);

    createHalo();
    createGradient();
    createBasicShapes();
    createFish();
    createBubble();

    physics = new VerletPhysics2D();
    physics.addBehavior(new GravityBehavior(new Vec2D(0, -0.1)));

    flowfield = new Flowfield(50);

    strokeWeight(2);
}

function createHalo() {
    halo = createGraphics(100, 100);
    halo.scale(1 / pixelDensity());
    for(var i = 0; i < 40; i++) {
        halo.fill(255, sin(Math.pow(i / 40, 10) + i / 40 / 10) * 255);
        halo.noStroke();
        halo.ellipse(halo.width / 2, halo.height / 2, 100 - i * 2.5, 100 - i * 2.5);
    }
}

function createGradient() {
    bg = createGraphics(1, height);
    bg.scale(1 / pixelDensity());
    var color1, color2, color3, color4,
        horizon  = Math.floor(bg.height / 2),
        bottom   = Math.floor(bg.height - bg.height / 2.5),
        amount;

    if(!zen) {
        color1 = color(0, 0, 0);
        color2 = color(60, 30, 135);
        color3 = color(currentColor.r + 10, currentColor.g + 10, currentColor.b + 10);
        color4 = color(currentColor.r, currentColor.g, currentColor.b);
    } else {
        color1 = color(35, 0, 125);
        color2 = color(40, 20, 60);
        color3 = color(currentColor.r + 10, currentColor.g + 10, currentColor.b + 10);
        color4 = color(currentColor.r, currentColor.g, currentColor.b);
    }

    bg.noStroke();
    for(var i = 0; i < horizon; i++) {
        amount = map(i, 0, horizon, 0, 1);
        bg.fill(lerpColor(color1, color2, amount));
        bg.rect(0, i, bg.width, 1);
    }

    if(!zen) {
        for(var i = horizon; i < bg.height; i++) {
            amount = constrain(map(i, horizon, bg.height - bg.height / 12, 0, 1), 0, 1);
            bg.fill(lerpColor(color2, color4, amount));
            bg.rect(0, i, bg.width, 1);
        }
    } else {
        for(var i = horizon; i < bottom; i++) {
            amount = map(i, horizon, bottom, 0, 1);
            bg.fill(lerpColor(color2, color3, amount));
            bg.rect(0, i, bg.width, 1);
        }

        for(var i = bottom; i < bg.height; i++) {
            amount = constrain(map(i, bottom, bg.height - bg.height / 12, 0, 1), 0, 1);
            bg.fill(lerpColor(color3, color4, amount));
            bg.rect(0, i, bg.width, 1);
        }
    }

    leftGradient = createGraphics(100, height);
    leftGradient.scale(1 / pixelDensity());
    for(var i = 0; i < leftGradient.width; i++) {
        amount = map(i, 0, leftGradient.width, 255, 0);
        leftGradient.tint(255, amount);
        leftGradient.image(bg.get(), 0, 0, bg.width, bg.height, i, 0, 1, leftGradient.height);
    }

    rightGradient = createGraphics(100, height);
    rightGradient.scale(1 / pixelDensity());
    for(var i = 0; i < rightGradient.width; i++) {
        amount = map(i, 0, rightGradient.width, 0, 255);
        rightGradient.tint(255, amount);
        rightGradient.image(bg.get(), 0, 0, bg.width, bg.height, i, 0, 1, rightGradient.height);
    }

    bottomGradient = createGraphics(width, height / 4);
    bottomGradient.scale(1 / pixelDensity());
    for(var i = 0; i < bottomGradient.height; i++) {
        amount = constrain(map(i, 0, bottomGradient.height - height/12, 0, 1), 0, 1);
        bottomGradient.stroke(lerpColor(color(currentColor.r, currentColor.g, currentColor.b, 0), color(currentColor.r, currentColor.g, currentColor.b, 255), amount));
        bottomGradient.line(0, i, bottomGradient.width, i);
    }
}

var shapes = [];
function createBasicShapes() {
    for(var i = 0; i < 4; i++) {
        var s;
        if(!zen) {
            s = createGraphics(50, 20);
        } else {
            s = createGraphics(20, 10);
        }
        s.scale(1 / pixelDensity());
        s.translate(s.width / 2, s.height / 2);
        s.noStroke();
        if(!zen) {
            s.fill(40, 180, 55);
        } else {
            s.fill(32, 145, 85);
        }
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

function createFish() {
    for(var i = 0; i < fishBodiesImg.length; i++) {
        var fishBody = createGraphics(fishBodiesImg[i].width/2, fishBodiesImg[i].height/2);
        fishBody.scale(1 / pixelDensity());
        fishBody.translate(fishBody.width/2, fishBody.height/2);
        fishBody.rotate(PI);
        fishBody.push();
        fishBody.image(fishBodiesImg[i], -fishBody.width/2, -fishBody.height/2, fishBody.width, fishBody.height);
        fishBody.pop();
        fishBodies.push(fishBody);
    }
    for(var i = 0; i < fishTailsImg.length; i++) {
        if(!zen) {
            var fishTail = createGraphics(fishTailsImg[i].width/2, fishTailsImg[i].height/2);
            fishTail.scale(1 / pixelDensity());
            fishTail.translate(fishTail.width/2, fishTail.height/2);
            fishTail.rotate(PI);
            fishTail.push();
            fishTail.image(fishTailsImg[i], -fishTail.width/2, -fishTail.height/2, fishTail.width, fishTail.height);
            fishTail.pop();
            fishTails.push(fishTail);
        } else {
            fishTails.push([]);
            for(var j = 0; j < fishTailsImg[i].length; j++) {
                var fishTail = createGraphics(fishTailsImg[i][j].width/2, fishTailsImg[i][j].height/2);
                fishTail.scale(1 / pixelDensity());
                fishTail.translate(fishTail.width/2, fishTail.height/2);
                fishTail.rotate(PI);
                fishTail.push();
                fishTail.image(fishTailsImg[i][j], -fishTail.width/2, -fishTail.height/2, fishTail.width, fishTail.height);
                fishTail.pop();
                fishTails[fishTails.length - 1].push(fishTail);
            }
        }
    }
}

function createBubble() {
    bubble = createGraphics(bubbleImg.width/2, bubbleImg.height/2);
    bubble.scale(1 / pixelDensity());
    bubble.translate(bubble.width/2, bubble.height/2);
    bubble.rotate(PI);
    bubble.push();
    bubble.image(bubbleImg, -bubble.width/2, -bubble.height/2, bubble.width, bubble.height);
    bubble.pop();
}

function update() {
    physics.update();

    if(random() < .05) {
        bubbles.push(new Bubble(new Vec2D(random(width/6, width - width/6), random(height - height/3, height - height/12))));
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

    for(var i = 0, l = gems.length; i < l; i++) {
        gems[i].update();
    }

    flowfield.update();

    var t = touchIsDown;
    for(var i = 0, l = displayTree.length; i < l; i++) {
        for(var j = 0, ll = displayTree[i].length; j < ll; j++) {
            if(displayTree[i][j] instanceof Fish) {
                displayTree[i][j].step(displayTree[i], flowfield);
                if(t) displayTree[i][j].seek(new Vec2D(touchX, touchY));
            }
        }
    }

    // for(var i = 0, l = fishes.length; i < l; i++) {
    //     fishes[i].step(fishes, flowfield);
    //     if(t) fishes[i].seek(new Vec2D(touchX, touchY));
    // }

    step++;
}

function draw() {
    update();

    // background(0);
    image(bg, 0, 0, width, height);

    if(intro && step - introBeginning <= 120) {
        var offset = map(step - introBeginning, 0, 120, 3, 0);
        translate(random(-offset, offset), random(-offset, offset));
        if(step - introBeginning == 120) intro = false;
    }

    if(debug) flowfield.display();

    for(var i = 0, l = bubbles.length; i < l; i++) {
        bubbles[i].display();
    }

    for(var i = 0, l = rocks.length; i < l; i++) {
        var s = map(i, 0, rocks.length - 1, .6, 1);

        rocks[i].display(s);
        for(var j = 0, ll = displayTree[i].length; j < ll; j++) {
            displayTree[i][j].display(s, fishes.length);
        }

        push();
        translate(map(mouseX, 0, width, width/2 - width/4, width/2 + width/4), map(mouseY, 0, height, height/4, 3 * height/4));
        scale(s);
        translate(-map(mouseX, 0, width, width/2 - width/4, width/2 + width/4), -map(mouseY, 0, height, height/4, 3 * height/4));

        if(debug) {
            stroke(255);
            rect(0, 0, width, height);
        }

        // if(zen) {
            image(bottomGradient, -(1 - s) * width * 1.5, height - bottomGradient.height, width + (1 - s) * width * 3, bottomGradient.height);
            fill(color(currentColor.r, currentColor.g, currentColor.b));
            noStroke();
            rect(-(1 - s) * width * 1.5, height - 1, width + (1 - s) * width * 3, -(1 - s) * height * 1.5);
        // }
        pop();
    }

    // for(var i = 0, l = gems.length; i < l; i++) {
    //     gems[i].display();
    // }

    // for(var i = 0; i < fishes.length; i++) {
    //     fishes[i].display();
    // }

    if(touchIsDown) {
        image(halo, touchX - halo.width/2, touchY - halo.height/2);
    }

    fill(255);
    noStroke();
    text(Math.floor(frameRate()) + "fps", 5, 40);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
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
