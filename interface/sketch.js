let slider;
let actualColor = [0, 102, 153];
let circlesByColor = {};

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
  buttonAdd = createButton('Add');
  buttonAdd.size(70, 30);
  buttonAdd.position(buttonOffset, heigthButton);
  buttonAdd.mousePressed(add);

  buttonDel = createButton('Del');
  buttonDel.size(70, 30);
  buttonDel.position(buttonOffset + 100, heigthButton);
  buttonDel.mousePressed(del);
  buttonDel.attribute('disabled', '');

  buttonClear = createButton('Clear');
  buttonClear.size(70, 30);
  buttonClear.position(buttonOffset + 200, heigthButton);
  buttonClear.mousePressed(clearScreen);

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

  // Define o tamanho do retângulo
  const rectWidth = 960;
  const rectHeight = 50;

  // Define a posição do retângulo
  const rectX = (windowWidth - rectWidth) / 2;
  const rectY = 580;

  // Desenha o retângulo com margem inferior
  noStroke();
  fill(255);
  rect(rectX, rectY, rectWidth, rectHeight, 15);

  // Formata texto do Slider
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

  // Chama as funções ao habilitar o checkbox
  cbCurves.checked() ? drawBezierCurve() : null;
  cbTraverses.checked() ? drawLines() : null;
  cbPoints.checked() ? drawPoints() : null;
}