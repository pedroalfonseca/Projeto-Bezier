let button1 = 255;
let slider;

let actualColor = [128,0,0];
let listColors = [[128,0,0]];
let idxColor = 0;
let circles = [];
let points = [];
let curvePoints = [];

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

  ptCheck = createCheckbox('control traverses');
  ptCheck.position(435, 705);

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


  if (pcCheck.checked()){
    drawBezierCurve(circles);
  }

  if (ptCheck.checked()){
    drawLines(circles);
  }

  if (cpCheck.checked()){
    for (let i = 0; i < circles.length; i++) {
      fill(circles[i].color[0], circles[i].color[1], circles[i].color[2]);
      circle(circles[i].x, circles[i].y, 15);

      if(mouseIsPressed && dist(mouseX, mouseY, circles[i].x, circles[i].y) <= 50){
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
    stroke(0);
    noFill();

    let result_cast = deCasteljau(points, slider.value());
    beginShape();
    for (let i = 0; i < result_cast.length; i++) {
      vertex(result_cast[i].x, result_cast[i].y);
    }
    endShape();
  }
}


function drawLines(circles) {
  if (circles.length < 2) return;
  strokeWeight(2);
  for (let i = 0; i < circles.length - 1; i++) {
    pointOrig = circles[i]
    pointDest = circles[i + 1]
    if (pointOrig.color.every((cor, index) => cor === pointDest.color[index])) {
      stroke(pointOrig.color[0], pointOrig.color[1], pointOrig.color[2]);
      line(pointOrig.x, pointOrig.y, pointDest.x, pointDest.y);
    }
  }
}
