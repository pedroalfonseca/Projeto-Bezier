let button1 = 255;
let slider;

let actualColor = [128,0,0];
let listColors = [[128,0,0]];
let idxColor = 0;
let circles = [];
let points = [];

function setup() {
  createCanvas(1024, 768);

  //Create Buttons
  buttonClear = createButton('Clear');
  buttonClear.size(70, 30);
  buttonClear.position(30, 700);
  buttonClear.mousePressed(clearScreen);

  buttonAdd = createButton('Add');
  buttonAdd.size(70, 30);
  buttonAdd.position(115, 700);
  buttonAdd.mousePressed(add);

  buttonDel = createButton('Del');
  buttonDel.size(70, 30);
  buttonDel.position(200, 700);
  buttonDel.mousePressed(del);

  buttonColor = createButton('Change Color');
  buttonColor.size(70, 50);
  buttonColor.position(25, 100);
  buttonColor.mousePressed(changeColor);

  //Create CheckBox
  cpCheck = createCheckbox('Control Point');
  cpCheck.position(285, 705);
  cpCheck.size(250);

  pcCheck = createCheckbox('control traverses');
  pcCheck.position(435, 705);

  pcCheck = createCheckbox('Curves');
  pcCheck.position(595, 705);

  slider = createSlider(0, 100, 2);
  slider.position(745, 705);
  slider.size(250);
}

function draw() {
  background(235);

  //Text on the side of Slider
  fill(0, 102, 153);
  textAlign(CENTER);
  textSize(25);
  text(`${slider.value()}`, 705, 725);

  //Rect that shows the actual color
  noStroke();
  fill(actualColor[0], actualColor[1], actualColor[2]);
  rect(25, 25, 70, 70);

  for (let i = 0; i < circles.length; i++) {
    fill(circles[i].color[0], circles[i].color[1], circles[i].color[2]);
    circle(circles[i].x, circles[i].y, 15);
  }

  //
  drawBezierCurve(circles);
  drawLines(circles);

}

function clearScreen(){
  console.log("Clear Screen");
  circles = [];
}

function add(){
  r = Math.random() * 255;
  g = Math.random() * 255;
  b = Math.random() * 255;

  actualColor[0] = r;
  actualColor[1] = g;
  actualColor[2] = b;

  listColors.push([r, g, b]);
  idxColor += 1;
  console.log(listColors);
  
}

function del(){

  for (let i = 0; i < circles.length; i++) {
    if(circles[i][2][0] === actualColor[0] && circles[i][2][1] === actualColor[1] && circles[i][2][2] === actualColor[2]){
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
  console.log(listColors[idxColor])
  actualColor[0] = listColors[idxColor][0];
  actualColor[1] = listColors[idxColor][1];
  actualColor[2] = listColors[idxColor][2];
}

function mousePressed() {
  if ((mouseY < 690) && (mouseX > 85 && mouseY > 150)) { 

    let newCircle = {
      x: mouseX,
      y: mouseY,
      color: [actualColor[0], actualColor[1], actualColor[2]]
    };
    circles.push(newCircle);
  }
}

function interpolate(t, p0, p1) {
  return { x: (1 - t) * p0.x + t * p1.x, y: (1 - t) * p0.y + t * p1.y };
}

  
function deCasteljau(points, nEvaluations) {

  if (points === undefined || points.length < 1) return [];
  
  result = [];
  start = points[0];
  
  for (let t = 0; t <= 1; t += 1 / nEvaluations) {
    controls = points;

    while(controls.length > 1){
      aux = [];

      for (i = 0; i < controls.length - 1; i++) {
        aux[i] = interpolate(t, controls[i], controls[i + 1]);
      }

      controls = aux;
    }
    
    result.push(controls[0]);
  }

  return result;
}

function drawBezierCurve(circles) {
  if (circles.length < 2) return;

  noFill();
  strokeWeight(2);
  stroke(0);

  let curvePoints = deCasteljau(circles, slider.value()); //altear o 1000 para o valor do input
  beginShape();
  for (let i = 0; i < curvePoints.length; i++) {
    vertex(curvePoints[i].x, curvePoints[i].y);
  }
  endShape();
}

function drawLines(circles) {
  if (circles.length < 2) return;
  strokeWeight(2);
  stroke(actualColor[0], actualColor[1], actualColor[2], 63);
  for (let i = 0; i < circles.length - 1; i++) {
    pointOrig = circles[i]
    pointDest = circles[i + 1]
    line(pointOrig.x, pointOrig.y, pointDest.x, pointDest.y);
  }
}


