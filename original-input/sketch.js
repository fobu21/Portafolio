let balls = [];
let score = 0;
let lives = 3;

let spawnEvery = 90;
let lastSpawn = 0;
let minVy = 1.25;
let maxVy = 2.2;
let maxBalls = 14;

let mic, fft;
let micReady = false;

let ampThreshold = 0.045;
let stableNeeded = 6;
let stableCount = 0;
let lastDetected = "none";
let lastFreq = 0;
let lastAmp = 0;

let cooldownMs = 450;
let lastTriggerAt = 0;

let flashT = 0;
let flashRGB = [255, 255, 255];

function setup() {
    createCanvas(windowWidth, windowHeight);

    mic = new p5.AudioIn();
    fft = new p5.FFT(0.9, 1024);

    mic.start(
        () => {
            micReady = true;
            fft.setInput(mic);
        },
        () => {
            micReady = false;
        }
    );

    for (let i = 0; i < 6; i++) spawnBall();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    background(11, 13, 18);

    updateDifficulty();
    updateGame();
    drawGame();

    handleMicInput();
    drawMicUI();
}

function updateDifficulty() {
    const t = frameCount;

    spawnEvery = floor(constrain(map(t, 0, 60 * 60, 95, 60), 95, 60));
    minVy = constrain(map(t, 0, 60 * 60, 1.2, 1.9), 1.2, 1.9);
    maxVy = constrain(map(t, 0, 60 * 60, 2.1, 2.8), 2.1, 2.8);
    maxBalls = floor(constrain(map(t, 0, 60 * 60, 12, 18), 12, 18));
}

function updateGame() {
    if (frameCount - lastSpawn > spawnEvery && balls.length < maxBalls) {
        spawnBall();
        lastSpawn = frameCount;
    }

    for (let i = balls.length - 1; i >= 0; i--) {
        const b = balls[i];
        b.y += b.vy;
        b.x += b.vx;

        if (b.x < b.r || b.x > width - b.r) b.vx *= -1;

        if (b.y > height + b.r) {
            balls.splice(i, 1);
            lives--;
            if (lives <= 0) {
                lives = 3;
                score = 0;
                balls = [];
                lastSpawn = frameCount;
            }
        }
    }
}

function drawGame() {
    noStroke();
    textSize(18);
    fill(232, 238, 252);
    text(`Score: ${score}`, 20, 32);
    text(`Lives: ${lives}`, 20, 56);

    textSize(13);
    fill(170, 180, 210);
    text(`Micrófono: ROJO 150–450Hz | VERDE 450–900Hz | AZUL 900–2500Hz`, 20, 82);

    for (const b of balls) {
        fill(b.col[0], b.col[1], b.col[2]);
        circle(b.x, b.y, b.r * 2);
    }

    stroke(255, 255, 255, 25);
    line(0, height - 1, width, height - 1);
    noStroke();

    drawFlash();
}

function spawnBall() {
    const palette = [
        { name: "red", rgb: [255, 80, 92] },
        { name: "green", rgb: [72, 232, 156] },
        { name: "blue", rgb: [86, 164, 255] },
    ];
    const p = random(palette);
    balls.push({
        x: random(30, width - 30),
        y: random(-120, -30),
        vx: random(-0.8, 0.8),
        vy: random(minVy, maxVy),
        r: random(14, 22),
        type: p.name,
        col: p.rgb,
    });
}

function triggerColor(colorName) {
    let removed = 0;
    for (let i = balls.length - 1; i >= 0; i--) {
        if (balls[i].type === colorName) {
            balls.splice(i, 1);
            removed++;
        }
    }
    score += removed * 10;
    flashColor(colorName);
}

function flashColor(name) {
    flashT = 10;
    flashRGB =
        name === "red" ? [255, 80, 92] :
            name === "green" ? [72, 232, 156] :
                name === "blue" ? [86, 164, 255] :
                    [255, 255, 255];
}

function drawFlash() {
    if (flashT > 0) {
        noStroke();
        fill(flashRGB[0], flashRGB[1], flashRGB[2], 18);
        rect(0, 0, width, height);
        flashT--;
    }
}

function handleMicInput() {
    if (!micReady) {
        lastDetected = "no mic";
        stableCount = 0;
        lastAmp = 0;
        lastFreq = 0;
        return;
    }

    const amp = mic.getLevel();
    lastAmp = amp;

    const spectrum = fft.analyze();
    const binHz = (sampleRate() / 2) / spectrum.length;

    let maxVal = 0;
    let maxIdx = 0;
    for (let i = 2; i < spectrum.length; i++) {
        if (spectrum[i] > maxVal) {
            maxVal = spectrum[i];
            maxIdx = i;
        }
    }

    const freq = maxIdx * binHz;
    lastFreq = freq;

    let detected = "none";
    if (amp > ampThreshold && freq > 100) {
        if (freq >= 150 && freq < 450) detected = "red";
        else if (freq >= 450 && freq < 900) detected = "green";
        else if (freq >= 900 && freq < 2500) detected = "blue";
    }

    if (detected === lastDetected) stableCount++;
    else stableCount = 0;
    lastDetected = detected;

    const now = millis();
    const canFire = now - lastTriggerAt > cooldownMs;

    if (detected !== "none" && stableCount >= stableNeeded && canFire) {
        triggerColor(detected);
        lastTriggerAt = now;
        stableCount = 0;
    }
}

function drawMicUI() {
    const panelW = min(280, width - 28);
    const panelH = 230;
    const panelX = width - panelW - 14;
    const panelY = 14;

    noStroke();
    fill(255, 255, 255, 10);
    rect(panelX, panelY, panelW, panelH, 14);

    fill(232, 238, 252);
    textSize(13);
    text(`Mic: ${micReady ? "ON" : "OFF"}`, panelX + 14, panelY + 26);

    fill(170, 180, 210);
    text(`Amp: ${lastAmp.toFixed(3)} (umbral ${ampThreshold})`, panelX + 14, panelY + 48);
    text(`Freq: ${lastFreq ? lastFreq.toFixed(0) + " Hz" : "-"}`, panelX + 14, panelY + 68);

    fill(232, 238, 252);
    text(`Detected: ${String(lastDetected).toUpperCase()}`, panelX + 14, panelY + 90);

    const msLeft = max(0, cooldownMs - (millis() - lastTriggerAt));
    fill(170, 180, 210);
    text(`Cooldown: ${msLeft.toFixed(0)} ms`, panelX + 14, panelY + 110);

    fill(170, 180, 210);
    text(`Bolas: ${balls.length}/${maxBalls}`, panelX + 14, panelY + 130);

    const barX = panelX + 14;
    const barY = panelY + 150;
    const barW = panelW - 28;
    const barH = 14;

    noStroke();
    fill(255, 255, 255, 10);
    rect(barX, barY, barW, barH, 8);
    fill(232, 238, 252, 180);
    rect(barX, barY, constrain(map(lastAmp, 0, 0.35, 0, barW), 0, barW), barH, 8);

    if (!micReady) {
        fill(255, 180, 120);
        textSize(12);
        text(`Permite el micrófono en el navegador`, panelX + 14, panelY + 190);
    }
}
