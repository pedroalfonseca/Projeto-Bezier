let button1 = 255;
let slider;

let actualColor = [0, 102, 153];
let listColors = [[0, 102, 153]];
let idxColor = 0;
let circles = [];
let points = [];
let curvePoints = [];
let selectedCircle = null;
let isDragging = false;

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
  buttonDel.attribute('disabled', '');

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

  slider = createSlider(0, 1000, 2);
  slider.position(sliderOffset, heigthOthers);
  slider.size(250);
  slider.value(1000);
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
    drawLines(circles);
  }

  if (cbPoints.checked()){
    for (let i = 0; i < circles.length; i++) {
      noStroke();
      fill(circles[i].color[0], circles[i].color[1], circles[i].color[2]);
      circle(circles[i].x, circles[i].y, 15);
    }
  }

}

function clearScreen(){
  circles = [];
}

function add() {
  if (listColors.length < 2) buttonDel.removeAttribute('disabled');

  const upperLimit = 220;

  r = Math.random() * upperLimit + (255 - upperLimit);
  g = Math.random() * upperLimit + (255 - upperLimit);
  b = Math.random() * upperLimit + (255 - upperLimit);

  actualColor[0] = r;
  actualColor[1] = g;
  actualColor[2] = b;

  listColors.push([r, g, b]);
  idxColor += 1;
}

function del(){
  for (let i = 0; i < circles.length; i++) {
    if(circles[i].color[0] === actualColor[0] && circles[i].color[1] === actualColor[1] && circles[i].color[2] === actualColor[2]){
      circles.splice(i, 1);
      i--;
    }
  }

  let index = listColors.findIndex((item) => {
    return JSON.stringify(item) === JSON.stringify(actualColor);
  });
  
  listColors.splice(index, 1);
  changeColor();

  if (listColors.length < 2) buttonDel.attribute('disabled', '');
}

function changeColor(){
  idxColor += 1;

  if(idxColor >= listColors.length){
    idxColor = 0;
  }

  actualColor[0] = listColors[idxColor][0];
  actualColor[1] = listColors[idxColor][1];
  actualColor[2] = listColors[idxColor][2];
}

function mousePressed() {
  let isInsideCircle = false;

  // Percorre o array de círculos e verifica se o mouse está dentro de um deles
  for (let i = 0; i < circles.length; i++) {
    const d = dist(mouseX, mouseY, circles[i].x, circles[i].y);
    if (d < 15) {
      selectedCircle = circles[i];
      isDragging = true;
      isInsideCircle = true;
      break;
    }
  }

  // Se o mouse não está dentro de um círculo, cria um novo
  if (!isInsideCircle && mouseY < 560 && mouseX > 120 && mouseY > 50) {
    let newCircle = {
      x: mouseX,
      y: mouseY,
      color: [actualColor[0], actualColor[1], actualColor[2]]
    };
    circles.push(newCircle);
  }
}

function mouseDragged() {
  if (isDragging && selectedCircle) {
    selectedCircle.x = mouseX;
    selectedCircle.y = mouseY;
  }
}

function mouseReleased() {
  selectedCircle = null;
  isDragging = false;
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

      for (i = 0; i < controls.length-1; i++) {
        aux[i] = interpolate(t, controls[i], controls[i+1]);
      }

      controls = aux;
    }
    result.push(controls[0]);
  }

  return result;
}


function objectByColor(circles) {
  const circlesByColor = {};

  for (let i = 0; i < circles.length; i++) {
    const color = circles[i].color;
    if (!circlesByColor[color]) {
      circlesByColor[color] = [];
    }
    circlesByColor[color].push(circles[i]);
  }

  return circlesByColor;
}

function drawLines(circles) {

  pointsByColor = objectByColor(circles);

  for (let color in pointsByColor) {
    let circles = pointsByColor[color];

    if (circles.length < 2) return;
    strokeWeight(4);

    for (let i = 0; i < circles.length - 1; i++) {
      const pointOrig = circles[i];
      const pointDest = circles[i + 1];

      stroke(pointOrig.color[0], pointOrig.color[1], pointOrig.color[2], 63);
      line(pointOrig.x, pointOrig.y, pointDest.x, pointDest.y);
      
    }
  }
}

function drawBezierCurve(circles) {

  pointsByColor = objectByColor(circles);

  for (let color in pointsByColor) {
    let points = pointsByColor[color];

    if (points.length < 2) return;
    strokeWeight(4);

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