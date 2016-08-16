fish.push();
fish.translate(44, 24);
fish.fill(200, 230, 240);
fish.noStroke();
fish.beginShape();
fish.vertex(10, 0);
fish.bezierVertex(10, -20, -40, -30, -40, -20);
fish.bezierVertex(-40, -15, -16, -8, -16, 0);
fish.bezierVertex(-16, 8, -40, 15, -40, 20);
fish.bezierVertex(-40, 30, 10, 20, 10, 0);
fish.endShape();
fish.translate(-15, 0);
fish.scale(.7, .4);
fish.beginShape();
fish.vertex(10, 0);
fish.bezierVertex(10, -20, -40, -30, -40, -20);
fish.bezierVertex(-40, -15, -16, -8, -16, 0);
fish.bezierVertex(-16, 8, -40, 15, -40, 20);
fish.bezierVertex(-40, 30, 10, 20, 10, 0);
fish.endShape();
fish.pop();
for(var i = 0; i < 10; i++) {
    fish.fill(185, 125, 180, i / 20 * 255);
    fish.noStroke();
    fish.ellipse(0, 0, 30 - i * 3, 30 - i * 3);
}
fish.fill(0);
fish.ellipse(0, 0, 6, 6);
