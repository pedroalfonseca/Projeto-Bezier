let button1 = 255;
let slider;

let actualColor = [128,0,0]
let circles = [];

function setup() {
  createCanvas(1024, 768)

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

  //Create CheckBox
  cpCheck = createCheckbox('Control Point');
  cpCheck.position(285, 705);
  cpCheck.size(250)

  pcCheck = createCheckbox('control traverses');
  pcCheck.position(435, 705);

  pcCheck = createCheckbox('Curves');
  pcCheck.position(595, 705);

  slider = createSlider(0, 100, 2);
  slider.position(745, 705);
  slider.size(250)
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
  fill(actualColor[0], actualColor[1], actualColor[2])
  rect(25, 25, 50, 50)

  // Draw all circles
  for (let i = 0; i < circles.length; i++) {
    fill(actualColor[0], actualColor[1], actualColor[2]);
    circle(circles[i][0], circles[i][1], 15);
  }
}

function clearScreen(){
  // function to clear the screen
}

function add(){
  pass
}

function del(){
  // function to delete
}

function mousePressed() {
  if (mouseY < 690 && mouseX > 65 && mouseY > 65) { 
    circles.push([mouseX, mouseY]);
  }
}
