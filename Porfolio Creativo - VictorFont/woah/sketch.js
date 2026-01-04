let osc;
let filter;
let reverb;
let audioOn = false;

let targetFreq = 200;
let currentFreq = 200;
let targetAmp = 0;
let currentAmp = 0;
let targetCutoff = 800;
let currentCutoff = 800;
let targetPan = 0;
let currentPan = 0;

let sensSlider, pitchMinSlider, pitchMaxSlider, brightSlider;
let statusLabel, startBtn;
let sensValLabel, pitchMinValLabel, pitchMaxValLabel, brightValLabel;

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);

    osc = new p5.Oscillator('sawtooth');
    filter = new p5.LowPass();
    reverb = new p5.Reverb();

    osc.disconnect();
    osc.connect(filter);

    osc.freq(currentFreq);
    osc.amp(0);
    filter.freq(currentCutoff);
    filter.res(12);

    reverb.process(filter, 2.5, 0.25);

    startBtn = select('#startBtn');
    statusLabel = select('#statusLabel');

    sensSlider = select('#sensSlider');
    pitchMinSlider = select('#pitchMinSlider');
    pitchMaxSlider = select('#pitchMaxSlider');
    brightSlider = select('#brightSlider');

    sensValLabel = select('#sensVal');
    pitchMinValLabel = select('#pitchMinVal');
    pitchMaxValLabel = select('#pitchMaxVal');
    brightValLabel = select('#brightVal');

    startBtn.mousePressed(toggleAudio);

    sensSlider.input(updateLabels);
    pitchMinSlider.input(updateLabels);
    pitchMaxSlider.input(updateLabels);
    brightSlider.input(updateLabels);

    updateLabels();

    document.body.addEventListener(
        'touchmove',
        function (e) {
            e.preventDefault();
        },
        { passive: false }
    );
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

async function toggleAudio() {
    if (!audioOn) {
        let ctx = getAudioContext();
        if (ctx.state !== 'running') {
            await ctx.resume();
        }

        if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
            try {
                await DeviceMotionEvent.requestPermission();
            } catch (e) { }
        }

        osc.start();
        audioOn = true;
        startBtn.html('■ Parar sonido');
        startBtn.removeClass('off');
        statusLabel.html('Sonido ACTIVO – mueve el móvil como una groan tube');
    } else {
        osc.amp(0, 0.2);
        audioOn = false;
        startBtn.html('▶ Activar sonido');
        startBtn.addClass('off');
        statusLabel.html('Audio parado');
    }
}

function updateLabels() {
    const sens = parseFloat(sensSlider.elt.value);
    const pitchMin = parseFloat(pitchMinSlider.elt.value);
    const pitchMax = parseFloat(pitchMaxSlider.elt.value);
    const bright = parseFloat(brightSlider.elt.value);

    sensValLabel.html(sens.toFixed(1) + 'x');
    pitchMinValLabel.html(pitchMin + 'Hz');
    pitchMaxValLabel.html(pitchMax + 'Hz');
    brightValLabel.html(bright.toFixed(2) + 'x');
}

function draw() {
    background(0);

    let ax = accelerationX || 0;
    let ay = accelerationY || 0;
    let az = accelerationZ || 0;

    let mag = sqrt(ax * ax + ay * ay + az * az);

    const sens = parseFloat(sensSlider.elt.value);
    const pitchMin = parseFloat(pitchMinSlider.elt.value);
    const pitchMax = parseFloat(pitchMaxSlider.elt.value);
    const bright = parseFloat(brightSlider.elt.value);

    let mappedFreq = map(ay * sens, -20, 20, pitchMax, pitchMin);
    mappedFreq = constrain(mappedFreq, pitchMin, pitchMax);
    targetFreq = mappedFreq;

    let mappedAmp = map(mag * sens, 0, 40, 0, 0.9);
    mappedAmp = constrain(mappedAmp, 0, 0.9);
    targetAmp = mappedAmp;

    let baseCutoff = map(mag, 0, 40, 300, 8000);
    baseCutoff = constrain(baseCutoff, 200, 12000);
    targetCutoff = constrain(baseCutoff * bright, 200, 12000);

    let mappedPan = map(ax, -20, 20, -1, 1);
    mappedPan = constrain(mappedPan, -1, 1);
    targetPan = mappedPan;

    const smoothFactor = 0.1;

    currentFreq = lerp(currentFreq, targetFreq, smoothFactor);
    currentAmp = lerp(currentAmp, targetAmp, smoothFactor);
    currentCutoff = lerp(currentCutoff, targetCutoff, smoothFactor);
    currentPan = lerp(currentPan, targetPan, smoothFactor);

    if (audioOn) {
        osc.freq(currentFreq);
        osc.amp(currentAmp, 0.05);
        filter.freq(currentCutoff);
        osc.pan(currentPan);
    }

    noStroke();

    let intensityNorm = constrain(map(mag, 0, 40, 0, 1), 0, 1);

    let hueR = map(currentFreq, pitchMin, pitchMax, 150, 255);
    let hueG = map(intensityNorm, 0, 1, 80, 255);
    let alpha = map(currentAmp, 0, 0.9, 40, 255);

    fill(hueR, hueG, 80, alpha);
    let barHeight = intensityNorm * height;
    rect(width / 3, height - barHeight, width / 3, barHeight);

    let yPitch = map(currentFreq, pitchMin, pitchMax, height * 0.8, height * 0.2);
    let circleSize = map(currentAmp, 0, 0.9, 20, 120);

    fill(255, 255, 255, 200);
    ellipse(width * 0.5 + currentPan * 80, yPitch, circleSize, circleSize);

    fill(255);
    textSize(12);
    textAlign(LEFT, TOP);
    text(
        'ax: ' +
        nf(ax, 1, 2) +
        '   ay: ' +
        nf(ay, 1, 2) +
        '   az: ' +
        nf(az, 1, 2) +
        '\nmag: ' +
        nf(mag, 1, 2) +
        '\nfreq: ' +
        nf(currentFreq, 1, 1) +
        ' Hz' +
        '\namp: ' +
        nf(currentAmp, 0, 2) +
        '\ncutoff: ' +
        nf(currentCutoff, 1, 0) +
        ' Hz' +
        '\npan: ' +
        nf(currentPan, 0, 2),
        10,
        10
    );
}
