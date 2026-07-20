// Canvas & Game Context
let canvas = null;
let ctx = null;

// Game Config
const BLOCK_WIDTH = 56;
const BLOCK_HEIGHT = 20;
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 500;

// Game State
let isPlaying = false;
let score = 0;
let highScore = 0;
let combo = 0;
let energy = 100; // 0 to 100
let feverActive = false;
let feverProgress = 0; // 0 to 100
let feverEndTime = 0;

// Stairs & Player Objects
let stairs = [];
let player = {
    stepIndex: 0,
    direction: 1, // 1: Right, -1: Left
    x: 0,
    y: 0,
    drawX: 0,
    drawY: 0,
    state: 'idle', // 'idle', 'climbing', 'falling'
    jumpProgress: 0, // 0 to 1
    lastStepTime: 0
};

// Camera interpolation variables
let cameraX = 0;
let cameraY = 0;
let targetCameraX = 0;
let targetCameraY = 0;

// Particles
let particles = [];
let screenShake = 0;

// Setup game variables
function initGame() {
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_WIDTH * dpr;
    canvas.height = CANVAS_HEIGHT * dpr;
    ctx.scale(dpr, dpr);

    // Load High Score from localStorage
    highScore = localStorage.getItem('stairs_highscore') || 0;
    document.getElementById('highscore-display').textContent = highScore;

    resetState();
    requestAnimationFrame(gameLoop);
}

function resetState() {
    isPlaying = false;
    score = 0;
    combo = 0;
    energy = 100;
    feverActive = false;
    feverProgress = 0;
    particles = [];
    screenShake = 0;

    // Reset Player
    player.stepIndex = 0;
    player.direction = 1;
    player.x = CANVAS_WIDTH / 2;
    player.y = CANVAS_HEIGHT * 0.7;
    player.drawX = player.x;
    player.drawY = player.y;
    player.state = 'idle';
    player.jumpProgress = 0;

    // Build Initial Stairs
    stairs = [];
    // Base step (top surface matches player.y)
    stairs.push({
        x: player.x,
        y: player.y + 6,
        dir: 1
    });

    // Pre-generate 30 steps
    for (let i = 0; i < 30; i++) {
        generateNextStep();
    }

    // Set Camera instantly
    cameraX = player.x - CANVAS_WIDTH / 2;
    cameraY = player.y - CANVAS_HEIGHT * 0.65;
    targetCameraX = cameraX;
    targetCameraY = cameraY;

    // HUD Update
    document.getElementById('score-display').textContent = '0';
    document.getElementById('combo-display').textContent = '0';
    document.getElementById('energy-bar').style.width = '100%';
    document.getElementById('fever-bar').style.width = '0%';
    document.getElementById('fever-glow').classList.remove('active');
}

function generateNextStep() {
    const lastStep = stairs[stairs.length - 1];
    
    // Choose next direction
    let nextDir = lastStep.dir;
    
    // 45% chance to change direction
    if (Math.random() < 0.45) {
        nextDir = -nextDir;
    }

    // Bounds checking: prevent stairs from running off screen
    const relativeX = lastStep.x + (nextDir * BLOCK_WIDTH / 2);
    if (relativeX < 60) {
        nextDir = 1; // Force Right
    } else if (relativeX > CANVAS_WIDTH - 60) {
        nextDir = -1; // Force Left
    }

    stairs.push({
        x: lastStep.x + (nextDir * BLOCK_WIDTH / 2),
        y: lastStep.y - BLOCK_HEIGHT,
        dir: nextDir
    });
}

function createStepParticles(x, y, color) {
    for (let i = 0; i < 6; i++) {
        particles.push({
            x: x + (Math.random() * 20 - 10),
            y: y,
            vx: Math.random() * 4 - 2,
            vy: -Math.random() * 3 - 1,
            size: Math.random() * 3 + 2,
            color: color || '#ffffff',
            alpha: 1,
            life: 1
        });
    }
}

// Action Handlers: Climb or Turn
function handleAction(action) {
    if (!isPlaying) return;
    if (player.state === 'falling') return;

    const nextStep = stairs[player.stepIndex + 1];
    let success = false;

    // Rule:
    // - 'left' steps left (nextStep.dir === -1)
    // - 'right' steps right (nextStep.dir === 1)
    if (action === 'left') {
        if (nextStep.dir === -1) {
            player.direction = -1;
            success = true;
        }
    } else if (action === 'right') {
        if (nextStep.dir === 1) {
            player.direction = 1;
            success = true;
        }
    }

    if (success) {
        // Step Up
        player.stepIndex++;
        player.x = nextStep.x;
        player.y = nextStep.y - 6; // stand offset
        player.state = 'climbing';
        player.jumpProgress = 0;
        player.lastStepTime = Date.now();

        // Increment Score
        const points = feverActive ? 2 : 1;
        score += points;
        document.getElementById('score-display').textContent = score;

        // Combo system
        combo++;
        document.getElementById('combo-display').textContent = combo;

        // Fever buildup
        if (!feverActive) {
            feverProgress = Math.min(100, feverProgress + 3.5);
            document.getElementById('fever-bar').style.width = `${feverProgress}%`;
            if (feverProgress >= 100) {
                triggerFever();
            }
        }

        // Add energy
        const energyReward = Math.max(3, 8 - (score * 0.005));
        energy = Math.min(100, energy + energyReward);

        // Visual effects
        screenShake = feverActive ? 6 : 2;
        const stairColor = feverActive ? `hsl(${(score * 12) % 360}, 100%, 65%)` : '#cbd5e1';
        createStepParticles(player.x, player.y + 6, stairColor);

        // Generate more steps to keep buffer full
        generateNextStep();
    } else {
        triggerGameOver();
    }
}

function triggerFever() {
    feverActive = true;
    feverEndTime = Date.now() + 4500; // 4.5 seconds
    document.getElementById('fever-glow').classList.add('active');
    document.getElementById('fever-bar').style.backgroundColor = '#8b5cf6';
    
    // Visual fireworks particles
    for (let i = 0; i < 20; i++) {
        particles.push({
            x: player.x,
            y: player.y - 30,
            vx: Math.random() * 8 - 4,
            vy: Math.random() * -8 - 2,
            size: Math.random() * 4 + 2,
            color: `hsl(${Math.random() * 360}, 100%, 60%)`,
            alpha: 1,
            life: 1.5
        });
    }
}

function triggerGameOver() {
    player.state = 'falling';
    isPlaying = false;
    screenShake = 15;

    // Fall animation particles
    createStepParticles(player.drawX, player.drawY, '#f43f5e');

    // Show Game Over Overlay after brief delay
    setTimeout(() => {
        document.getElementById('final-score').textContent = score;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('stairs_highscore', highScore);
            document.getElementById('highscore-display').textContent = highScore;
        }
        document.getElementById('best-score').textContent = highScore;
        
        const overlay = document.getElementById('gameover-overlay');
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'auto';
    }, 600);
}

// MAIN RENDER LOOP (60fps)
function gameLoop() {
    updateState();
    renderGame();
    requestAnimationFrame(gameLoop);
}

function updateState() {
    if (!canvas) return;

    // 1. Draining Energy (Timer bar)
    if (isPlaying && player.state !== 'falling') {
        // Drain speed increases with score
        const drainRate = 0.15 + (score * 0.0006);
        energy = Math.max(0, energy - drainRate);
        document.getElementById('energy-bar').style.width = `${energy}%`;

        if (energy <= 0) {
            triggerGameOver();
        }
    }

    // 2. Fever expiration check
    if (feverActive) {
        const timeRemaining = feverEndTime - Date.now();
        if (timeRemaining <= 0) {
            feverActive = false;
            feverProgress = 0;
            document.getElementById('fever-glow').classList.remove('active');
            document.getElementById('fever-bar').style.backgroundColor = '#8b5cf6';
            document.getElementById('fever-bar').style.width = '0%';
        } else {
            // Deplete fever progress bar matching remaining duration
            feverProgress = (timeRemaining / 4500) * 100;
            document.getElementById('fever-bar').style.width = `${feverProgress}%`;
        }
    }

    // 3. Player Position Interpolation (climbing jumps)
    if (player.state === 'climbing') {
        player.jumpProgress += 0.25; // 4 frames animation speed
        if (player.jumpProgress >= 1) {
            player.state = 'idle';
            player.drawX = player.x;
            player.drawY = player.y;
        } else {
            // Calculate parabole jump path
            const prevStep = stairs[player.stepIndex - 1];
            player.drawX = prevStep.x + (player.x - prevStep.x) * player.jumpProgress;
            
            // Parabole offset
            const jumpHeight = -10;
            const linearY = prevStep.y - 6 + (player.y - (prevStep.y - 6)) * player.jumpProgress;
            const parabolicOffset = jumpHeight * 4 * player.jumpProgress * (1 - player.jumpProgress);
            player.drawY = linearY + parabolicOffset;
        }
    } else if (player.state === 'falling') {
        player.drawY += 8; // Drop fast
    } else {
        player.drawX = player.x;
        player.drawY = player.y;
    }

    // 4. Smooth Camera Scrolling (lerp)
    if (player.state !== 'falling') {
        targetCameraX = player.drawX - CANVAS_WIDTH / 2;
        targetCameraY = player.drawY - CANVAS_HEIGHT * 0.65;
    }
    cameraX += (targetCameraX - cameraX) * 0.12;
    cameraY += (targetCameraY - cameraY) * 0.12;

    // 5. Screen shake decay
    if (screenShake > 0) {
        screenShake *= 0.85;
        if (screenShake < 0.2) screenShake = 0;
    }

    // 6. Particle Updates
    particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.04;
        if (p.alpha <= 0) {
            particles.splice(idx, 1);
        }
    });
}

function renderGame() {
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.save();
    
    // Screen Shake effect transformation
    if (screenShake > 0) {
        const dx = (Math.random() - 0.5) * screenShake;
        const dy = (Math.random() - 0.5) * screenShake;
        ctx.translate(dx, dy);
    }

    // Offset camera viewport
    ctx.translate(-cameraX, -cameraY);

    // Draw Stairs (in reverse order for correct 3D depth perception)
    for (let idx = stairs.length - 1; idx >= 0; idx--) {
        const step = stairs[idx];
        // Draw only visible steps on screen
        if (step.y - cameraY > -50 && step.y - cameraY < CANVAS_HEIGHT + 100) {
            drawStairBlock(step.x, step.y, idx);
        }
    }

    // Draw Character
    if (player.drawY - cameraY < CANVAS_HEIGHT + 100) {
        drawCharacter(player.drawX, player.drawY, player.direction);
    }

    // Draw Particles
    particles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });

    ctx.restore();
}

function drawStairBlock(x, y, idx) {
    ctx.save();

    const step = stairs[idx];
    const dir = step.dir; // 1: Right, -1: Left

    // Determine colors
    let topColor = '#38bdf8';      // Sky blue top
    let frontColor = '#0284c7';    // Dark blue front
    let sideColor = '#0369a1';     // Shaded side

    if (feverActive) {
        const hue = (idx * 15 + score * 4) % 360;
        topColor = `hsl(${hue}, 95%, 60%)`;
        frontColor = `hsl(${hue}, 95%, 40%)`;
        sideColor = `hsl(${hue}, 95%, 30%)`;
    } else {
        // High contrast alternating colors for readability
        if (idx % 2 === 0) {
            topColor = '#818cf8';  // Indigo top
            frontColor = '#4f46e5'; // Indigo front
            sideColor = '#3730a3';  // Indigo side
        } else {
            topColor = '#38bdf8';  // Sky blue top
            frontColor = '#0284c7'; // Sky blue front
            sideColor = '#0369a1';  // Sky blue side
        }
    }

    // Set up a clean drop shadow for depth
    ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 4;

    // Draw front face of the block
    ctx.fillStyle = frontColor;
    ctx.fillRect(x - BLOCK_WIDTH / 2, y, BLOCK_WIDTH, BLOCK_HEIGHT);

    // Disable drop shadow for top and side faces
    ctx.shadowColor = 'transparent';

    // Draw top surface polygon (skewed in the step direction!)
    // If dir is 1, skew right (shift top points right by 8px).
    // If dir is -1, skew left (shift top points left by 8px).
    const skew = dir * 8;
    ctx.fillStyle = topColor;
    ctx.beginPath();
    ctx.moveTo(x - BLOCK_WIDTH / 2, y);
    ctx.lineTo(x - BLOCK_WIDTH / 2 + skew, y - 6);
    ctx.lineTo(x + BLOCK_WIDTH / 2 + skew, y - 6);
    ctx.lineTo(x + BLOCK_WIDTH / 2, y);
    ctx.closePath();
    ctx.fill();

    // Draw side facet (on the trailing edge)
    // If dir is 1, the side face is on the right side.
    // If dir is -1, the side face is on the left side.
    ctx.fillStyle = sideColor;
    ctx.beginPath();
    if (dir === 1) {
        ctx.moveTo(x + BLOCK_WIDTH / 2, y);
        ctx.lineTo(x + BLOCK_WIDTH / 2 + skew, y - 6);
        ctx.lineTo(x + BLOCK_WIDTH / 2 + skew, y + BLOCK_HEIGHT - 6);
        ctx.lineTo(x + BLOCK_WIDTH / 2, y + BLOCK_HEIGHT);
    } else {
        ctx.moveTo(x - BLOCK_WIDTH / 2, y);
        ctx.lineTo(x - BLOCK_WIDTH / 2 + skew, y - 6);
        ctx.lineTo(x - BLOCK_WIDTH / 2 + skew, y + BLOCK_HEIGHT - 6);
        ctx.lineTo(x - BLOCK_WIDTH / 2, y + BLOCK_HEIGHT);
    }
    ctx.closePath();
    ctx.fill();

    // Add a neat glowing border on the top landing edge for maximum readability!
    ctx.strokeStyle = feverActive ? '#ffffff' : (idx % 2 === 0 ? '#c7d2fe' : '#e0f2fe');
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x - BLOCK_WIDTH / 2 + skew, y - 6);
    ctx.lineTo(x + BLOCK_WIDTH / 2 + skew, y - 6);
    ctx.stroke();

    ctx.restore();
}

function drawCharacter(x, y, dir) {
    ctx.save();
    ctx.translate(x, y);

    // Apply facing direction scale flip
    ctx.scale(dir, 1);

    // 1. Draw Leg base
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-4, -4, 3, 4);
    ctx.fillRect(1, -4, 3, 4);

    // 2. Draw rounded body (Runner outfit)
    ctx.fillStyle = feverActive ? '#8b5cf6' : '#ef4444'; // Red shirt / Purple on Fever
    ctx.beginPath();
    ctx.roundRect(-6, -16, 12, 12, 3);
    ctx.fill();

    // 3. Draw head
    ctx.fillStyle = '#fbcfe8'; // Skin tone
    ctx.beginPath();
    ctx.arc(0, -21, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // 4. Draw cap with visor facing direction
    ctx.fillStyle = '#0ea5e9'; // Blue cap
    ctx.beginPath();
    ctx.arc(0, -22, 5, Math.PI, 0); // cap dome
    ctx.fill();
    // visor projection
    ctx.fillRect(0, -23, 7, 2);

    // 5. Draw running arms
    ctx.fillStyle = '#fbcfe8';
    ctx.fillRect(-2, -12, 5, 2);

    ctx.restore();
}

function startGame() {
    resetState();
    isPlaying = true;
    document.getElementById('start-overlay').style.opacity = '0';
    document.getElementById('start-overlay').style.pointerEvents = 'none';
    document.getElementById('gameover-overlay').style.opacity = '0';
    document.getElementById('gameover-overlay').style.pointerEvents = 'none';
}

// Map keyboard shortcuts and touch handlers
function bindEvents() {
    // Desktop Keys
    window.addEventListener('keydown', (e) => {
        if (!isPlaying && (e.code === 'Enter' || e.code === 'Space')) {
            e.preventDefault();
            startGame();
            return;
        }

        if (e.code === 'KeyZ' || e.code === 'ArrowLeft') {
            e.preventDefault();
            handleAction('left');
        } else if (e.code === 'KeyX' || e.code === 'ArrowRight' || e.code === 'Space') {
            e.preventDefault();
            handleAction('right');
        }
    });

    // Touch Buttons
    document.getElementById('ctrl-turn').addEventListener('click', () => handleAction('left'));
    document.getElementById('ctrl-climb').addEventListener('click', () => handleAction('right'));

    // Start/Restart Buttons
    document.getElementById('start-btn').addEventListener('click', startGame);
    document.getElementById('restart-btn').addEventListener('click', startGame);
}

// Run setup on document load
document.addEventListener('DOMContentLoaded', () => {
    initGame();
    bindEvents();
});
