const CELL_SIZE = 10;
const INITIAL_PROBABILITY = 0.25;
const MAX_AGE = 30;

let cols;
let rows;
let grid;
let nextGrid;
let ageGrid;

let paused = false;
let generation = 0;

let speedSlider;
let speedText;

let ruleSet;
let currentRuleName;

let canvas;

let genLabel;
let stateLabel;
let rulesLabel;

function getConwayRules() {
  return {
    birth: [3],
    survive: [2, 3],
  };
}

function getAltRules() {
  return {
    birth: [3, 6],
    survive: [2, 3],
  };
}

function setup() {
  canvas = createCanvas(800, 800);
  canvas.parent("canvas-container");

  cols = floor(width / CELL_SIZE);
  rows = floor(height / CELL_SIZE);

  grid = make2DArray(cols, rows, 0);
  nextGrid = make2DArray(cols, rows, 0);
  ageGrid = make2DArray(cols, rows, 0);

  ruleSet = getConwayRules();
  currentRuleName = "Conway (B3/S23)";

  resetGrid(true);
  createUI();
  hookStatusLabels();

  frameRate(10);
}

function hookStatusLabels() {
  genLabel = select("#gen-label");
  stateLabel = select("#state-label");
  rulesLabel = select("#rules-label");
  updateStatusPanel();
}

function createUI() {
  const sliderWrapper = select("#slider-wrapper");

  speedSlider = createSlider(1, 30, 10, 1);
  speedSlider.parent(sliderWrapper);
  speedSlider.style("width", "100%");

  speedText = createP("FPS: 10");
  speedText.parent(sliderWrapper);
  speedText.style("margin", "6px 0 0");
  speedText.style("font-size", "0.8rem");
  speedText.style("opacity", "0.85");
}

function make2DArray(cols, rows, initialValue) {
  const arr = new Array(cols);
  for (let x = 0; x < cols; x++) {
    arr[x] = new Array(rows);
    for (let y = 0; y < rows; y++) {
      arr[x][y] = initialValue;
    }
  }
  return arr;
}

function resetGrid(randomize) {
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      if (randomize) {
        grid[x][y] = random() < INITIAL_PROBABILITY ? 1 : 0;
      } else {
        grid[x][y] = 0;
      }
      ageGrid[x][y] = 0;
    }
  }
  generation = 0;
  updateStatusPanel();
}

function draw() {
  background(5, 5, 18, 60);

  const simSpeed = speedSlider.value();
  frameRate(simSpeed);
  speedText.html("FPS: " + simSpeed);

  if (!paused) {
    stepSimulation();
    generation++;
  }

  drawGrid();
  updateStatusPanel();
}

function stepSimulation() {
  const newAgeGrid = make2DArray(cols, rows, 0);

  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      const state = grid[x][y];
      const neighbors = countNeighbors(x, y);

      let nextState = state;

      if (state === 0) {
        if (ruleSet.birth.includes(neighbors)) {
          nextState = 1;
          newAgeGrid[x][y] = 1;
        } else {
          nextState = 0;
          newAgeGrid[x][y] = 0;
        }
      } else {
        if (ruleSet.survive.includes(neighbors)) {
          nextState = 1;
          newAgeGrid[x][y] = ageGrid[x][y] + 1;
        } else {
          nextState = 0;
          newAgeGrid[x][y] = 0;
        }
      }

      nextGrid[x][y] = nextState;
    }
  }

  const temp = grid;
  grid = nextGrid;
  nextGrid = temp;

  ageGrid = newAgeGrid;
}

function countNeighbors(x, y) {
  let sum = 0;

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;

      const col = (x + dx + cols) % cols;
      const row = (y + dy + rows) % rows;

      sum += grid[col][row];
    }
  }

  return sum;
}

function drawGrid() {
  noStroke();

  const youngColor = color(0, 170, 255);
  const oldColor = color(255, 80, 210);
  const margin = 1;

  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      if (grid[x][y] === 1) {
        const age = ageGrid[x][y];
        const t = constrain(age / MAX_AGE, 0, 1);
        const c = lerpColor(youngColor, oldColor, t);

        fill(red(c), green(c), blue(c), 220);
        rect(
          x * CELL_SIZE + margin,
          y * CELL_SIZE + margin,
          CELL_SIZE - margin * 2,
          CELL_SIZE - margin * 2,
          3
        );
      }
    }
  }
}

function updateStatusPanel() {
  if (genLabel) {
    genLabel.html("Generación: " + nf(generation, 1, 0));
  }
  if (stateLabel) {
    stateLabel.html("Estado: " + (paused ? "Pausado" : "Reproduciendo"));
  }
  if (rulesLabel) {
    rulesLabel.html("Reglas: " + currentRuleName);
  }
}

function keyPressed() {
  if (key === " ") {
    paused = !paused;
    return false;
  }

  if (key === "r" || key === "R") {
    resetGrid(true);
  }

  if (key === "c" || key === "C") {
    resetGrid(false);
  }

  if (key === "1") {
    ruleSet = getConwayRules();
    currentRuleName = "Conway (B3/S23)";
  }

  if (key === "2") {
    ruleSet = getAltRules();
    currentRuleName = "Variante (B36/S23)";
  }
}

function mousePressed() {
  paintCellAtMouse();
}

function mouseDragged() {
  paintCellAtMouse();
}

function paintCellAtMouse() {
  const x = floor(mouseX / CELL_SIZE);
  const y = floor(mouseY / CELL_SIZE);

  if (x >= 0 && x < cols && y >= 0 && y < rows) {
    grid[x][y] = 1;
    ageGrid[x][y] = 1;
  }
}
