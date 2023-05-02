let button1 = 255;
let slider;

let actualColor = [128,0,0];
let listColors = [[128,0,0]];
let idxColor = 0;
let circles = [];

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
    fill(circles[i][2][0], circles[i][2][1], circles[i][2][2]);
    circle(circles[i][0], circles[i][1], 15);
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
    circles.push([mouseX, mouseY, [actualColor[0], actualColor[1], actualColor[2]]]);
    console.log(circles)
  }
}
