let mic;
let amp;
let fft;

let smoothedLevel = 0;
let hueBase = 200;
let audioStarted = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  colorMode(HSB, 360, 100, 100, 100);
  strokeCap(ROUND);
  noFill();

  mic = new p5.AudioIn();
  amp = new p5.Amplitude();
  amp.smooth(0.9);
  fft = new p5.FFT(0.85, 64);

  updateStatus(false);
}

function startAudioContext() {
  if (!audioStarted) {
    let ctx = getAudioContext();
    if (ctx.state !== "running") ctx.resume();
    mic.start(() => {
      amp.setInput(mic);
      fft.setInput(mic);
    });
    audioStarted = true;
    updateStatus(true);
  }
}

function mousePressed() { startAudioContext(); }
function touchStarted() { startAudioContext(); }
function windowResized() { resizeCanvas(windowWidth, windowHeight); }

function draw() {
  background(230, 15, 4, 10);

  if (!audioStarted) {
    push();
    textAlign(CENTER, CENTER);
    fill(210, 5, 90);
    noStroke();
    textSize(16);
    text("Haz clic o toca para activar el micrófono.", width / 2, height / 2);
    pop();
    return;
  }

  let level = amp.getLevel();
  smoothedLevel = lerp(smoothedLevel, level, 0.1);

  fft.analyze();
  let mid = fft.getEnergy("mid");
  let high = fft.getEnergy("treble");

  hueBase = map(high, 0, 255, 190, 300, true);

  let trunkLength = map(smoothedLevel, 0, 0.25, height * 0.15, height * 0.32, true);
  let depth = floor(map(smoothedLevel, 0, 0.25, 6, 10, true));
  let angleSpread = map(mid, 0, 255, 10, 35, true);

  push();
  translate(width / 2, height * 0.95);
  drawBranch(trunkLength,0, depth, 0, angleSpread);
  pop();

  updateUIBar(smoothedLevel);
}

function drawBranch(len, angle, depth, gen, angleSpread) {
  if (depth <= 0 || len < 2) return;

  push();
  rotate(angle);

  let x2 = 0;
  let y2 = -len;

  strokeWeight(map(depth, 1, 10, 1, 5));
  stroke((hueBase + gen * 10) % 360, 70, 100, 95);

  line(0, 0, x2, y2);
  translate(x2, y2);

  let nextLen = len * 0.72;
  let a = angleSpread;

  if (gen === 0) a *= 0.3;
  if (gen === 1) a *= 0.55;

  drawBranch(nextLen, a, depth - 1, gen + 1, angleSpread);
  drawBranch(nextLen, -a, depth - 1, gen + 1, angleSpread);

  pop();
}

function updateUIBar(level) {
  const barFill = document.getElementById("ui-bar-fill");
  const barValue = document.getElementById("ui-bar-value");
  if (!barFill || !barValue) return;

  let norm = constrain(map(level, 0, 0.15, 0, 1), 0, 1);
  barFill.style.width = (norm * 100).toFixed(1) + "%";
  barValue.textContent = level.toFixed(3);
}

function updateStatus(active) {
  const dot = document.getElementById("status-dot");
  const text = document.getElementById("status-text");
  if (!dot || !text) return;

  if (active) {
    dot.style.background = "#22c55e";
    dot.style.boxShadow = "0 0 10px rgba(34, 197, 94, 0.9)";
    text.textContent = "Micrófono activo — el fractal escucha.";
  } else {
    dot.style.background = "#f97316";
    dot.style.boxShadow = "0 0 10px rgba(249, 115, 22, 0.8)";
    text.textContent = "Haz clic o toca para activar el audio.";
  }
}
