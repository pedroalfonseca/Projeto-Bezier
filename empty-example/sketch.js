let button1 = 255;
let slider;

let actualColor = [0, 102, 153];
let listColors = [[0, 102, 153]];
let idxColor = 0;
let circles = [];
let points = [];
let curvePoints = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  window.scrollTo(0, 0);
  document.body.style.overflow = 'hidden';

  // Define largura total do conjunto de inputs
  const totalWidth = 920;

  // Auxila centralização dos inputs horizontalmente
  const buttonOffset = (windowWidth - totalWidth) / 2;
  const checkboxOffset = buttonOffset + 280;
  const sliderOffset = checkboxOffset + 380;

  // Altura dos inputs 
  const heigthButton = 590;
  const heigthOthers = heigthButton + 5;

  // Define a posição dos botões
  buttonClear = createButton('Clear');
  buttonClear.size(70, 30);
  buttonClear.position(buttonOffset, heigthButton);
  buttonClear.mousePressed(clearScreen);

  buttonAdd = createButton('Add');
  buttonAdd.size(70, 30);
  buttonAdd.position(buttonOffset + 100, heigthButton);
  buttonAdd.mousePressed(add);

  buttonDel = createButton('Del');
  buttonDel.size(70, 30);
  buttonDel.position(buttonOffset + 200, heigthButton);
  buttonDel.mousePressed(del);

  buttonColor = createButton('Change Color');
  buttonColor.size(70, 50);
  buttonColor.position(25, 100);
  buttonColor.mousePressed(changeColor);

  cbPoints = createCheckbox('Control Point', true);
  cbPoints.position(checkboxOffset, heigthOthers);

  cbTraverses = createCheckbox('Control Traverses', true);
  cbTraverses.position(checkboxOffset + 120, heigthOthers);

  cbCurves = createCheckbox('Curves', true);
  cbCurves.position(checkboxOffset + 265, heigthOthers);

  slider = createSlider(0, 100, 2);
  slider.position(sliderOffset, heigthOthers);
  slider.size(250);
  slider.value(100);
}

function draw() {
  background(51);

  // define o tamanho do retângulo
  const rectWidth = 960;
  const rectHeight = 50;

  // Define a posição do retângulo
  const rectX = (windowWidth - rectWidth) / 2;
  const rectY = 580;

  // Desenha o retângulo com margem inferior
  noStroke();
  fill(255);
  rect(rectX, rectY, rectWidth, rectHeight, 15);

  // texto do Slider
  fill(0, 102, 153);
  textAlign(CENTER);
  textSize(18);
  text(`${slider.value()}`, ((windowWidth - 940) / 2) + 650, 612);

  // Quadrado com a cor atual
  c = color('rgba(255,255,255, 0.3)');
  stroke(c);
  strokeWeight(1);
  fill(actualColor[0], actualColor[1], actualColor[2]);
  rect(25, 25, 70, 70);


  if (cbCurves.checked()){
    drawBezierCurve(circles);
  }

  if (cbTraverses.checked()){
    drawLinesByColor(circles);
  }

  if (cbPoints.checked()){
    for (let i = 0; i < circles.length; i++) {
      noStroke();
      fill(circles[i].color[0], circles[i].color[1], circles[i].color[2]);
      circle(circles[i].x, circles[i].y, 15);

      if(mouseIsPressed && dist(mouseX, mouseY, circles[i].x, circles[i].y) <= 15){
        circles[i].x = mouseX;
        circles[i].y = mouseY;
      }
    }
  }

}

function clearScreen(){
  console.log("Clear Screen");
  circles = [];
}

function add() {
  const upperLimit = 220;

  r = Math.random() * upperLimit + (255 - upperLimit);
  g = Math.random() * upperLimit + (255 - upperLimit);
  b = Math.random() * upperLimit + (255 - upperLimit);

  actualColor[0] = r;
  actualColor[1] = g;
  actualColor[2] = b;

  listColors.push([r, g, b]);
  idxColor += 1;
  console.log(listColors);
}


function del(){
  for (let i = 0; i < circles.length; i++) {
    if(circles[i].color[0] === actualColor[0] && circles[i].color[1] === actualColor[1] && circles[i].color[2] === actualColor[2]){
      circles.splice(i, 1);
      i--;
    }
  }

  listColors.pop(actualColor)
  changeColor()
}

function changeColor(){
  console.log("Lista de cores: ", listColors)
  idxColor += 1;

  if(idxColor >= listColors.length){
    idxColor = 0;
  }

  actualColor[0] = listColors[idxColor][0];
  actualColor[1] = listColors[idxColor][1];
  actualColor[2] = listColors[idxColor][2];
}

function mousePressed() {
  if ((mouseY < 560) && (mouseX > 120 && mouseY > 50)) { 

    let newCircle = {
      x: mouseX,
      y: mouseY,
      color: [actualColor[0], actualColor[1], actualColor[2]]
    };
    circles.push(newCircle);
  }
}

function interpolate(t, p0, p1) {
  return { x: (1 - t) * p0.x + t * p1.x, y: (1 - t) * p0.y + t * p1.y, color: p0.color};
}

function deCasteljau(points, nEvaluations) {

  if (points === undefined || points.length < 1) return [];
  result = [];
  
  for (let t = 0; t <= 1; t += 1 / nEvaluations) {
    controls = points;

    while(controls.length > 1){
      aux = [];

      for (i = 0; i < controls.length - 1; i++) {
        if (controls[i].color.every((cor, index) => cor === controls[i+1].color[index])) {
          aux[i] = interpolate(t, controls[i], controls[i+1]);
        } else {
          break;
        }
      }

      controls = aux;
    }
    result.push(controls[0]);
  }

  return result;
}


function drawBezierCurve(circles) {
  if (circles.length < 2) return;

  strokeWeight(2);
  let pointsByColor = {};

  for (let i = 0; i < circles.length; i++) {
    let c = circles[i].color.join();
    if (pointsByColor[c]) {
      pointsByColor[c].push(circles[i]);
    } else {
      pointsByColor[c] = [circles[i]];
    }
  }

  for (let color in pointsByColor) {
    let points = pointsByColor[color];

    let result_cast = deCasteljau(points, slider.value());
    beginShape();
    for (let i = 0; i < result_cast.length; i++) {
      stroke(result_cast[i].color);
      noFill();
      vertex(result_cast[i].x, result_cast[i].y);
    }
    endShape();
  }
}

function drawLinesByColor(circles) {
  if (circles.length < 2) return;
  strokeWeight(2);

  const circlesByColor = {};
  for (let i = 0; i < circles.length; i++) {
    const color = circles[i].color;
    if (!circlesByColor[color]) {
      circlesByColor[color] = [];
    }
    circlesByColor[color].push(circles[i]);
  }

  for (const color in circlesByColor) {
    drawLines(circlesByColor[color]);
  }
}

function drawLines(circles) {
  for (let i = 0; i < circles.length - 1; i++) {
    const pointOrig = circles[i];
    const pointDest = circles[i + 1];
    if (pointOrig.color.every((cor, index) => cor === pointDest.color[index])) {
      stroke(pointOrig.color[0], pointOrig.color[1], pointOrig.color[2], 63);
      line(pointOrig.x, pointOrig.y, pointDest.x, pointDest.y);
    }
  }
}
