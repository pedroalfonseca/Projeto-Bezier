let button1 = 255;
let slider;

let actualColor = [0, 102, 153];
let listColors = [[0, 102, 153]];
let idxColor = 0;
let circlesByColor = {};
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

  if (cbPoints.checked()) {
    for (const [color, points] of Object.entries(circlesByColor)) {
      for (const point of points) {
        const [r, g, b] = point.color;
        
        if (r === actualColor[0] && g === actualColor[1] && b === actualColor[2]) {
          fill(point.color);
        } else {
          fill(r, g, b, 63);
        }
  
        noStroke();
        circle(point.x, point.y, 15);
      }
    }
  }  
}

/**
 * Função que verifica se o mouse foi pressionado, usada para criar um novo ponto e lógica de movimentação do ponto
 * @returns {void}
 */
function mousePressed() {
  let isInsideCircle = false;
  let color = actualColor.join();
  
  if (circlesByColor[color]){
    // Percorre o array de pontos e verifica se o mouse está dentro de um deles
    for (let i = 0; i < circlesByColor[color].length; i++) {
      const d = dist(mouseX, mouseY, circlesByColor[color][i].x, circlesByColor[color][i].y);

      if (d < 15) {
        selectedCircle = circlesByColor[color][i];
        isDragging = true;
        isInsideCircle = true;
        break;
      }
    }
  }

  // Se o mouse não está dentro de um círculo, cria um novo
  if (!isInsideCircle && mouseY < 560 && mouseX > 120 && mouseY > 50) {
    let newCircle = {
      x: mouseX,
      y: mouseY,
      color: [actualColor[0], actualColor[1], actualColor[2]]
    };

    // Adicona o ponto novo na lista da sua cor
    const color = newCircle.color;
    if (!circlesByColor[color]) {
      circlesByColor[color] = [];
    }
    circlesByColor[color].push(newCircle);
  }
}

/**
 * Função que remove ponto de controle especifico
 * @returns {void}
 */
function doubleClicked(){
  let color = actualColor.join();
  for (let i = 0; i < circlesByColor[color].length; i++) {
    const d = dist(mouseX, mouseY, circlesByColor[color][i].x, circlesByColor[color][i].y);

    if(d < 15){
      circlesByColor[color].splice(i, 1);
      i--;
    }
  }
  
}

/**
 * Função que finaliza a movimentação do ponto
 * @returns {void}
 */
function mouseDragged() {
  if (isDragging && selectedCircle) {
    selectedCircle.x = mouseX;
    selectedCircle.y = mouseY;
  }
}

/**
 * Função que verifica se o mouse foi solto
 * @returns {void}
 */
function mouseReleased() {
  selectedCircle = null;
  isDragging = false;
}

/**
 * Função que limpa todos os elementos (curvas, pontos e segmentos) da tela
 * @returns {void}
 */
function clearScreen(){
  circlesByColor = {};
}

/**
 * Função que adiciona nova cor
 * @returns {void}
 */
function add() {
  if (listColors.length < 2) buttonDel.removeAttribute('disabled');

  // Limitando os valores para valores mais contrastantes
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

/**
 * Função que remove a cor e os elementos com a cor da tela
 * @returns {void}
 */
function del(){
  let circles = circlesByColor[actualColor.join()];
  
  for (let circle of circles) {
    const [r, g, b] = circle.color;

    if (r === actualColor[0] && g === actualColor[1] && b === actualColor[2]) {
      delete circlesByColor[circle.color];
    }
  }

  // Encontrando e removendo a cor atual
  let index = listColors.findIndex((item) => {
    return JSON.stringify(item) === JSON.stringify(actualColor);
  });
  listColors.splice(index, 1);

  // Deixa o botão indisponivel quando tem apenas uma cor e muda a cor depois da remoção
  changeColor();
  if (listColors.length < 2) buttonDel.attribute('disabled', '');
}

/**
 * Função que muda a cor
 * @returns {void}
 */
function changeColor() {
  idxColor = (idxColor + 1) % listColors.length;
  actualColor = listColors[idxColor];
}

/**
 * Função que interpola os pontos usando polinômios de Bernstein
 * @returns {Object}
 */
function interpolate(t, p0, p1) {
  return { x: (1 - t) * p0.x + t * p1.x, y: (1 - t) * p0.y + t * p1.y, color: p0.color};
}

/**
 * Função que implementa o algoritmo de De Casteljau
 * @returns {Array}
 */
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

/**
 * Função que desenha a curva de Bezier
 * @returns {void}
 */
function drawBezierCurve() {
  for (const [color, points] of Object.entries(circlesByColor)) {
    if (points.length < 2) continue;
    
    strokeWeight(4);
    // deCasteljau retorna os pontos intermediarios
    const controlPoints = deCasteljau(points, slider.value());

    // Cria do desenho da curva de Bezier onde os pontos de controle são os vertices da curva
    beginShape();
    for (const { x, y, color } of controlPoints) {
      const [r, g, b] = color;

      if (r === actualColor[0] && g === actualColor[1] && b === actualColor[2]) {
        stroke(color);
      } else {
        stroke(r, g, b, 127);
      }

      noFill();
      vertex(x, y);
    }
    endShape();
  }
}

/**
 * Função que desenha os segmentos aos pontos
 * @returns {void}
 */
function drawLines() {
  for (const [color, points] of Object.entries(circlesByColor)) {
    if (points.length < 2) continue;
    
    strokeWeight(4);

    for (let i = 0; i < points.length - 1; i++) {
      const pointOrig = points[i];
      const pointDest = points[i + 1];

      stroke(pointOrig.color[0], pointOrig.color[1], pointOrig.color[2], 63);
      line(pointOrig.x, pointOrig.y, pointDest.x, pointDest.y);
    }
  }
}