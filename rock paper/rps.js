let agents = [];
let sparks = [];
let types = ["rock", "paper", "scissors"];
let eliminationMode = true;
let moveMode = 1;

let emojiSize = 22;

function setup() {
    createCanvas(windowWidth, windowHeight);
    textAlign(CENTER, CENTER);
    textSize(emojiSize);
    resetSystem();
}

function draw() {
    background(30);

    for (let a of agents) {
        if (a) a.update();
    }
    for (let a of agents) {
        if (a) a.show();
    }

    for (let i = agents.length - 1; i >= 0; i--) {
        for (let j = i - 1; j >= 0; j--) {
            let a = agents[i];
            let b = agents[j];
            if (a && b && a.pos.dist(b.pos) < 14) {
                resolveCollision(a, b);
            }
        }
    }

    for (let i = sparks.length - 1; i >= 0; i--) {
        sparks[i].update();
        sparks[i].show();
        if (sparks[i].isDead()) sparks.splice(i, 1);
    }

    displayStats();
    displayInstructions();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
    if (key === 'r') resetSystem();
    if (key === 'e') eliminationMode = !eliminationMode;
    if (key >= '1' && key <= '4') moveMode = int(key);
}

function resetSystem() {
    agents = [];
    for (let t of types) {
        for (let i = 0; i < 50; i++) {
            agents.push(new Agent(t));
        }
    }
}

function resolveCollision(a, b) {
    const rules = {
        rock: "scissors",
        paper: "rock",
        scissors: "paper"
    };
    if (a.type === b.type) return;
    if (rules[a.type] === b.type) {
        handleWin(a, b);
    } else if (rules[b.type] === a.type) {
        handleWin(b, a);
    }
}

function handleWin(winner, loser) {
    if (!agents.includes(winner) || !agents.includes(loser)) return;

    if (eliminationMode) {
        let index = agents.indexOf(loser);
        if (index !== -1) agents.splice(index, 1);
    } else {
        loser.type = winner.type;
        loser.wins = 0;
        loser.mutated = false;
        loser.setEmoji();
    }

    winner.wins++;
    if (winner.wins >= 3) winner.mutate();

    for (let i = 0; i < 16; i++) {
        sparks.push(new Spark(winner.pos.copy()));
    }
}

function displayStats() {
    let counts = { rock: 0, paper: 0, scissors: 0 };
    for (let a of agents) counts[a.type]++;

    noStroke();
    fill(255);
    textAlign(LEFT, TOP);
    textSize(16);

    text(`🪨 Rock: ${counts.rock}`, 10, 10);
    text(`📄 Paper: ${counts.paper}`, 10, 30);
    text(`✂️ Scissors: ${counts.scissors}`, 10, 50);

    textAlign(CENTER, CENTER);
    textSize(emojiSize);
}

function displayInstructions() {
    noStroke();
    fill(255);
    textAlign(LEFT, BOTTOM);
    textSize(14);

    text(
        `Pulsa R para reiniciar | Pulsa E para cambiar modo: ${eliminationMode ? "Eliminar" : "Transformar"}`,
        10, height - 40
    );
    text(`Modo de movimiento: ${moveMode} (${getMoveModeName()})`, 10, height - 20);

    textAlign(CENTER, CENTER);
    textSize(emojiSize);
}

function getMoveModeName() {
    switch (moveMode) {
        case 1: return "Aleatorio";
        case 2: return "Noise";
        case 3: return "Turbulencia";
        case 4: return "Persecución";
        default: return "";
    }
}

class Agent {
    constructor(type) {
        this.type = type;
        this.pos = createVector(random(width), random(height));
        this.vel = p5.Vector.random2D();
        this.acc = createVector();
        this.wins = 0;
        this.mutated = false;
        this.setEmoji();
    }

    setEmoji() {
        if (this.type === "rock") this.emoji = "🪨";
        else if (this.type === "paper") this.emoji = "📄";
        else this.emoji = "✂️";
    }

    update() {
        switch (moveMode) {
            case 1:
                this.acc = p5.Vector.random2D().mult(0.2);
                break;
            case 2: {
                let angle = noise(this.pos.x * 0.01, this.pos.y * 0.01) * TWO_PI * 2;
                this.acc = p5.Vector.fromAngle(angle).mult(0.2);
                break;
            }
            case 3:
                this.acc = p5.Vector.random2D().mult(random(0.05, 0.3));
                break;
            case 4:
                if (agents.length > 1) {
                    let target;
                    do {
                        target = random(agents);
                    } while (target === this && agents.length > 1);

                    if (target && target !== this) {
                        this.acc = p5.Vector.sub(target.pos, this.pos).setMag(0.2);
                    } else {
                        this.acc = p5.Vector.random2D().mult(0.2);
                    }
                } else {
                    this.acc = p5.Vector.random2D().mult(0.2);
                }
                break;
        }

        this.vel.add(this.acc);
        this.vel.limit(this.mutated ? 3 : 2);
        this.pos.add(this.vel);
        this.edges();
    }

    show() {
        if (this.mutated) {
            noFill();
            stroke(255, 255, 0);
            strokeWeight(2);
            circle(this.pos.x, this.pos.y, emojiSize + 10);
        }

        noStroke();
        fill(255);
        text(this.emoji, this.pos.x, this.pos.y + 1);
    }

    edges() {
        if (this.pos.x < 0) this.pos.x = width;
        if (this.pos.x > width) this.pos.x = 0;
        if (this.pos.y < 0) this.pos.y = height;
        if (this.pos.y > height) this.pos.y = 0;
    }

    mutate() {
        this.vel.mult(1.5);
        this.mutated = true;
    }
}

class Spark {
    constructor(pos) {
        this.pos = pos;
        this.vel = p5.Vector.random2D().mult(random(1, 3));
        this.lifespan = 200;
    }

    update() {
        this.pos.add(this.vel);
        this.lifespan -= 6;
    }

    show() {
        noStroke();
        fill(255, this.lifespan);
        circle(this.pos.x, this.pos.y, 4);
    }

    isDead() {
        return this.lifespan <= 0;
    }
}
