document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // UI Elements
    const timeEl = document.getElementById('time');
    const scoreEl = document.getElementById('score');
    const comboEl = document.getElementById('combo-streak');
    const rankingListEl = document.getElementById('ranking-list');
    
    // Overlays
    const startOverlay = document.getElementById('start-overlay');
    const startBtn = document.getElementById('start-btn');
    const gameoverOverlay = document.getElementById('gameover-overlay');
    const retryBtn = document.getElementById('retry-btn');
    
    // Control Selector Buttons
    const modeKeyboardBtn = document.getElementById('mode-keyboard');
    const modeMouseBtn = document.getElementById('mode-mouse');
    const controlHint = document.getElementById('control-hint');
    
    // Leaderboard Form
    const highscoreFormContainer = document.getElementById('highscore-form-container');
    const standardScoreContainer = document.getElementById('standard-score-container');
    const finalScoreEl = document.getElementById('final-score');
    const finalScoreStandardEl = document.getElementById('final-score-standard');
    const usernameInput = document.getElementById('username-input');
    const submitScoreBtn = document.getElementById('submit-score-btn');

    // Game state
    let gameState = 'notStarted'; // notStarted, playing, gameOver
    let lastTime = 0;
    let accumulatedTime = 0;
    let score = 0;
    let comboStreak = 0;
    let controlMode = 'keyboard'; // keyboard, mouse
    let animationFrameId = null;

    // Player character properties
    const player = {
        x: 0,
        y: 0,
        width: 50,
        height: 70,
        vx: 0,
        ax: 0,
        speed: 13,
        friction: 0.84
    };

    // Control parameters
    let targetX = 0; // Target X for mouse controls
    const keysPressed = {};

    // Game parameters
    let items = [];
    let clouds = [];
    let particles = [];
    let floatingTexts = []; // Point/Combo popups

    // Spawning parameters
    let spawnTimer = 0;
    let spawnInterval = 1.1; // seconds
    let itemSpeed = 3.2;
    const initialItemSpeed = 3.2;
    const maxItemSpeed = 11.0;

    // Fever (Invincibility) state
    let isFeverMode = false;
    let feverTimer = 0;
    const feverDuration = 5.0; // seconds

    // Images asset configuration
    const images = {
        character: 'images/character.png',
        carrot: 'images/carrot.png',
        banana: 'images/banana.png',
        bread: 'images/bread.png',
        cake: 'images/cake.png',
        meat: 'images/meat.png',
        cloud_l: 'images/cloud_l.png',
        cloud_s: 'images/cloud_s.png'
    };

    const loadedImages = {};
    let imagesLoadedCount = 0;
    const imagesToLoad = Object.keys(images).length;

    // Preload assets
    for (const key in images) {
        loadedImages[key] = new Image();
        loadedImages[key].src = images[key];
        loadedImages[key].onload = () => {
            imagesLoadedCount++;
            if (imagesLoadedCount === imagesToLoad) {
                initGame();
            }
        };
    }

    const foodTypes = [
        { type: 'banana', points: 1, color: '#facc15', weight: 45 },  // Yellow
        { type: 'bread', points: 2, color: '#d97706', weight: 30 },   // Amber
        { type: 'meat', points: 5, color: '#ef4444', weight: 18 },    // Red
        { type: 'cake', points: 10, color: '#ec4899', weight: 7 }      // Pink
    ];

    // Canvas Size Setup
    function initCanvasSize() {
        canvas.width = 800;
        canvas.height = 600;
        player.x = canvas.width / 2 - player.width / 2;
        player.y = canvas.height - player.height - 20;
        targetX = player.x;
    }

    function initGame() {
        initCanvasSize();
        displayRanking();
        
        // Setup initial static drawing on canvas
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw static welcome screen decoration
        drawStaticClouds();
        ctx.drawImage(loadedImages.character, player.x, player.y, player.width, player.height);
    }

    function drawStaticClouds() {
        ctx.drawImage(loadedImages.cloud_l, 100, 80, 130, 60);
        ctx.drawImage(loadedImages.cloud_s, 500, 120, 90, 45);
        ctx.drawImage(loadedImages.cloud_l, 620, 60, 110, 50);
    }

    // Controls Selection handlers
    modeKeyboardBtn.addEventListener('click', () => {
        controlMode = 'keyboard';
        modeKeyboardBtn.className = "flex flex-col items-center justify-center p-3 rounded-xl border-2 border-primary bg-orange-50/50 dark:bg-orange-950/20 text-primary font-bold text-xs gap-1.5 transition-all cursor-pointer";
        modeMouseBtn.className = "flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-text-muted dark:text-slate-400 font-bold text-xs gap-1.5 transition-all cursor-pointer";
        
        const lang = document.documentElement.lang || 'ko';
        controlHint.textContent = lang === 'en' 
            ? "Use Arrow Keys (←, →) to move left/right. Decelerates smoothly with momentum." 
            : "방향키(←, →)를 눌러서 좌우로 이동합니다. 반대 방향을 눌러도 정지하지 않고 부드럽게 감속됩니다.";
    });

    modeMouseBtn.addEventListener('click', () => {
        controlMode = 'mouse';
        modeMouseBtn.className = "flex flex-col items-center justify-center p-3 rounded-xl border-2 border-primary bg-orange-50/50 dark:bg-orange-950/20 text-primary font-bold text-xs gap-1.5 transition-all cursor-pointer";
        modeKeyboardBtn.className = "flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-text-muted dark:text-slate-400 font-bold text-xs gap-1.5 transition-all cursor-pointer";
        
        const lang = document.documentElement.lang || 'ko';
        controlHint.textContent = lang === 'en' 
            ? "Hover/drag the mouse horizontally. The character glides smoothly to follow your cursor." 
            : "마우스 커서를 좌우로 움직여 조작합니다. 캐릭터가 포인터를 부드러운 속도로 추적하며 활공합니다.";
    });

    // Start action
    startBtn.addEventListener('click', startGame);
    retryBtn.addEventListener('click', startGame);

    function startGame() {
        gameState = 'playing';
        startOverlay.classList.add('hidden');
        gameoverOverlay.classList.add('hidden');
        canvas.parentElement.classList.remove('fever-active-border');
        
        // Reset states
        score = 0;
        comboStreak = 0;
        accumulatedTime = 0;
        spawnTimer = 0;
        spawnInterval = 1.1;
        itemSpeed = initialItemSpeed;
        isFeverMode = false;
        feverTimer = 0;
        
        items = [];
        clouds = [];
        particles = [];
        floatingTexts = [];
        
        initCanvasSize();
        updateUI();

        // Spawn initial clouds
        for (let i = 0; i < 4; i++) {
            clouds.push({
                x: Math.random() * canvas.width,
                y: Math.random() * (canvas.height * 0.4),
                width: Math.random() > 0.5 ? 120 : 80,
                height: Math.random() > 0.5 ? 60 : 40,
                speed: 0.3 + Math.random() * 0.4,
                img: Math.random() > 0.5 ? loadedImages.cloud_l : loadedImages.cloud_s
            });
        }

        lastTime = performance.now();
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(gameLoop);
    }

    // High Score Submission
    submitScoreBtn.addEventListener('click', () => {
        const name = usernameInput.value.trim();
        if (!name) return;

        const savedScore = parseInt(finalScoreEl.textContent, 10) || 0;
        saveRanking(name, savedScore);
        displayRanking();
        
        highscoreFormContainer.classList.add('hidden');
        standardScoreContainer.classList.remove('hidden');
        finalScoreStandardEl.textContent = savedScore;
    });

    usernameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            submitScoreBtn.click();
        }
    });

    function triggerGameOver() {
        gameState = 'gameOver';
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        
        // Trigger visual shake effect
        canvas.parentElement.classList.add('shake-animation');
        setTimeout(() => {
            canvas.parentElement.classList.remove('shake-animation');
        }, 500);

        // Populate final score
        finalScoreEl.textContent = score;
        finalScoreStandardEl.textContent = score;
        usernameInput.value = '';

        // Check if leaderboard qualifier
        const rankings = getRankings();
        const isHighScore = rankings.length < 10 || score > rankings[rankings.length - 1].score;

        if (isHighScore && score > 0) {
            highscoreFormContainer.classList.remove('hidden');
            standardScoreContainer.classList.add('hidden');
        } else {
            highscoreFormContainer.classList.add('hidden');
            standardScoreContainer.classList.remove('hidden');
        }

        gameoverOverlay.classList.remove('hidden');
    }

    // Core Game loop (Delta Time based)
    function gameLoop(timestamp) {
        if (gameState !== 'playing') return;

        let dt = (timestamp - lastTime) / 1000;
        lastTime = timestamp;

        // Clamp dt to avoid major simulation skips when CPU is busy
        if (dt > 0.1) dt = 0.1;

        accumulatedTime += dt;

        update(dt);
        render();

        animationFrameId = requestAnimationFrame(gameLoop);
    }

    // Physics Update loop
    function update(dt) {
        // 1. Update Time & UI
        updateUI();

        // 2. Fever mode countdown
        if (isFeverMode) {
            feverTimer -= dt;
            if (feverTimer <= 0) {
                isFeverMode = false;
                canvas.parentElement.classList.remove('fever-active-border');
            }
        }

        // 3. Move character
        if (controlMode === 'mouse') {
            // Smooth mouse follow easing
            player.x += (targetX - player.x) * 0.16;
        } else {
            // Momentum keyboard logic
            let targetVx = 0;
            if (keysPressed['ArrowLeft'] || keysPressed['Left']) targetVx = -player.speed;
            if (keysPressed['ArrowRight'] || keysPressed['Right']) targetVx = player.speed;

            player.vx += (targetVx - player.vx) * 0.18;
            player.vx *= player.friction;
            player.x += player.vx;
        }

        // Keep character in bounds
        if (player.x < 0) {
            player.x = 0;
            player.vx = 0;
        }
        if (player.x + player.width > canvas.width) {
            player.x = canvas.width - player.width;
            player.vx = 0;
        }

        // 4. Update Game Speeds and Spawning rate over time
        itemSpeed = initialItemSpeed + (accumulatedTime * 0.12);
        if (itemSpeed > maxItemSpeed) itemSpeed = maxItemSpeed;

        // Spawn interval gets tighter as time goes on
        spawnInterval = Math.max(0.35, 1.15 - (accumulatedTime * 0.015));

        // 5. Spawning items
        spawnTimer += dt;
        if (spawnTimer >= spawnInterval) {
            spawnTimer = 0;
            spawnNewItem();
        }

        // 6. Update Items
        for (let i = items.length - 1; i >= 0; i--) {
            const item = items[i];
            
            // Move item
            item.y += item.speedY * (itemSpeed / initialItemSpeed);
            
            // Zig-zag swaying logic for swaying carrots
            if (item.behavior === 'sway') {
                item.swayAngle += dt * 3.5;
                item.x = item.startX + Math.sin(item.swayAngle) * 55;
            }

            // Remove out-of-bounds items
            if (item.y > canvas.height) {
                // If a food item drops past screen, break combo streak!
                if (item.points !== 'gameover' && item.type !== 'shield') {
                    comboStreak = 0;
                }
                items.splice(i, 1);
            }
        }

        // 7. Clouds movement
        if (Math.random() < 0.005) {
            clouds.push({
                x: canvas.width,
                y: Math.random() * (canvas.height * 0.35),
                width: Math.random() > 0.5 ? 120 : 80,
                height: Math.random() > 0.5 ? 60 : 40,
                speed: 0.2 + Math.random() * 0.4,
                img: Math.random() > 0.5 ? loadedImages.cloud_l : loadedImages.cloud_s
            });
        }
        clouds.forEach(cloud => {
            cloud.x -= cloud.speed;
        });
        clouds = clouds.filter(c => c.x + c.width > 0);

        // 8. Collisions check
        checkCollisions();

        // 9. Update particles
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity || 0.15; // Gravity
            p.alpha -= p.fadeSpeed || 0.02;
            p.life -= dt;
            if (p.life <= 0 || p.alpha <= 0) {
                particles.splice(i, 1);
            }
        }

        // 10. Floating text updates
        for (let i = floatingTexts.length - 1; i >= 0; i--) {
            const ft = floatingTexts[i];
            ft.y -= ft.vy;
            ft.alpha -= 0.02;
            if (ft.alpha <= 0) {
                floatingTexts.splice(i, 1);
            }
        }
    }

    // Dynamic Spawner
    function spawnNewItem() {
        const x = Math.random() * (canvas.width - 60) + 10;
        const randomVal = Math.random();

        // Spawn tables: 42% Carrot, 45% Food, 8% Swaying Carrot, 3% Giant Carrot, 2% Shield star
        if (randomVal < 0.42) {
            // Normal falling Carrot
            items.push({
                type: 'carrot',
                behavior: 'normal',
                x: x,
                y: -50,
                width: 32,
                height: 52,
                speedY: 2.8,
                points: 'gameover',
                img: loadedImages.carrot
            });
        } else if (randomVal < 0.50) {
            // Swaying zig-zag Carrot
            items.push({
                type: 'carrot',
                behavior: 'sway',
                startX: x,
                x: x,
                y: -50,
                width: 32,
                height: 52,
                speedY: 2.3,
                swayAngle: Math.random() * Math.PI,
                points: 'gameover',
                img: loadedImages.carrot
            });
        } else if (randomVal < 0.53) {
            // Giant slow falling Carrot
            items.push({
                type: 'carrot',
                behavior: 'giant',
                x: Math.random() * (canvas.width - 100) + 10,
                y: -100,
                width: 65,
                height: 105,
                speedY: 1.5,
                points: 'gameover',
                img: loadedImages.carrot
            });
        } else if (randomVal < 0.55) {
            // Special Shield Star
            items.push({
                type: 'shield',
                behavior: 'normal',
                x: x,
                y: -40,
                width: 38,
                height: 38,
                speedY: 2.5,
                points: 'shield',
                color: '#a855f7' // Purple star
            });
        } else {
            // Food item
            const foodProto = getWeightedRandomFood();
            items.push({
                type: foodProto.type,
                behavior: 'normal',
                x: x,
                y: -45,
                width: foodProto.type === 'meat' ? 44 : 35,
                height: foodProto.type === 'meat' ? 35 : 35,
                speedY: 2.6,
                points: foodProto.points,
                color: foodProto.color,
                img: loadedImages[foodProto.type]
            });
        }
    }

    function getWeightedRandomFood() {
        const totalFoodWeight = foodTypes.reduce((sum, food) => sum + food.weight, 0);
        let random = Math.random() * totalFoodWeight;
        for (const food of foodTypes) {
            if (random < food.weight) {
                return food;
            }
            random -= food.weight;
        }
        return foodTypes[0];
    }

    // Core Collision detector
    function checkCollisions() {
        for (let i = items.length - 1; i >= 0; i--) {
            const item = items[i];

            // AABB Overlap check
            if (player.x < item.x + item.width &&
                player.x + player.width > item.x &&
                player.y < item.y + item.height &&
                player.y + player.height > item.y) {

                if (item.points === 'gameover') {
                    // Collision with Carrot!
                    if (isFeverMode) {
                        // Smash Carrot in Fever mode!
                        items.splice(i, 1);
                        score += 10;
                        createExplosion(item.x + item.width / 2, item.y + item.height / 2, '#f97316', 25);
                        createFloatingText('+10 Smash! 🔥', player.x + player.width / 2, player.y - 10, '#f97316');
                    } else {
                        // Dead
                        triggerGameOver();
                        return;
                    }
                } else if (item.points === 'shield') {
                    // Shield collected!
                    items.splice(i, 1);
                    isFeverMode = true;
                    feverTimer = feverDuration;
                    canvas.parentElement.classList.add('fever-active-border');
                    createExplosion(item.x + item.width / 2, item.y + item.height / 2, '#a855f7', 30);
                    createFloatingText('FEVER MODE! 🛡️', player.x + player.width / 2, player.y - 20, '#a855f7');
                } else {
                    // Food collected
                    items.splice(i, 1);
                    comboStreak++;

                    // Calculate score bonus with combo multiplier
                    const basePoints = item.points;
                    const multiplier = 1 + Math.floor(comboStreak / 5) * 0.5;
                    const finalPoints = Math.round(basePoints * multiplier);
                    
                    score += finalPoints;

                    // Sparkle particles
                    createExplosion(item.x + item.width / 2, item.y + item.height / 2, item.color, 12);
                    
                    // Score popup
                    const popupText = multiplier > 1 
                        ? `+${finalPoints} (Combo x${multiplier})` 
                        : `+${finalPoints}`;
                    createFloatingText(popupText, player.x + player.width / 2, player.y - 10, item.color);
                }
                updateUI();
            }
        }
    }

    // Particle effect factory
    function createExplosion(x, y, color, count) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1.0 + Math.random() * 4.5;
            particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 1.5, // slightly upward bias
                color: color,
                size: 2.5 + Math.random() * 4.0,
                alpha: 1.0,
                life: 0.4 + Math.random() * 0.4,
                gravity: 0.12,
                fadeSpeed: 0.02 + Math.random() * 0.03
            });
        }
    }

    // Popup Text factory
    function createFloatingText(text, x, y, color) {
        floatingTexts.push({
            text: text,
            x: x,
            y: y,
            vy: 1.8,
            color: color,
            alpha: 1.0
        });
    }

    // Dynamic UI synchronizer
    function updateUI() {
        scoreEl.textContent = score;
        timeEl.textContent = Math.round(accumulatedTime);
        comboEl.textContent = comboStreak;
    }

    // Render Canvas Stage
    function render() {
        // Clear screen with custom background colors
        const isDark = document.documentElement.classList.contains('dark');
        
        // Background sky gradient
        const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        if (isDark) {
            bgGrad.addColorStop(0, '#0f172a'); // deep dark slate
            bgGrad.addColorStop(1, '#1e1b4b'); // dark indigo
        } else {
            bgGrad.addColorStop(0, '#bae6fd'); // sky blue 200
            bgGrad.addColorStop(1, '#f0f9ff'); // sky blue 50
        }
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw Clouds
        clouds.forEach(cloud => {
            ctx.save();
            ctx.globalAlpha = isDark ? 0.35 : 0.75;
            ctx.drawImage(cloud.img, cloud.x, cloud.y, cloud.width, cloud.height);
            ctx.restore();
        });

        // Draw Items (Carrots, Foods, Stars)
        items.forEach(item => {
            if (item.type === 'carrot') {
                ctx.save();
                
                // Add soft warning neon glow to carrots
                ctx.shadowColor = '#f97316';
                ctx.shadowBlur = item.behavior === 'giant' ? 15 : 6;
                ctx.drawImage(item.img, item.x, item.y, item.width, item.height);
                
                ctx.restore();
            } else if (item.type === 'shield') {
                // Draw custom star for shield powerup
                ctx.save();
                ctx.shadowColor = '#a855f7';
                ctx.shadowBlur = 10;
                drawStar(ctx, item.x + item.width / 2, item.y + item.height / 2, 5, item.width / 2, item.width / 4, '#a855f7');
                ctx.restore();
            } else {
                ctx.drawImage(item.img, item.x, item.y, item.width, item.height);
            }
        });

        // Draw Player with active state glow (Fever / Shield)
        ctx.save();
        if (isFeverMode) {
            // Draw active neon glowing circular shield around player
            ctx.strokeStyle = '#a855f7';
            ctx.lineWidth = 4;
            ctx.shadowColor = '#a855f7';
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.arc(player.x + player.width / 2, player.y + player.height / 2, Math.max(player.width, player.height) / 2 + 8, 0, Math.PI * 2);
            ctx.stroke();

            // Draw glowing shield sphere
            ctx.fillStyle = 'rgba(168, 85, 247, 0.15)';
            ctx.fill();
        }
        
        ctx.drawImage(loadedImages.character, player.x, player.y, player.width, player.height);
        ctx.restore();

        // Draw explosion particles
        particles.forEach(p => {
            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        // Draw Floating texts
        ctx.save();
        ctx.textAlign = 'center';
        ctx.font = '800 14px "Plus Jakarta Sans", sans-serif';
        floatingTexts.forEach(ft => {
            ctx.globalAlpha = ft.alpha;
            ctx.fillStyle = ft.color;
            // Draw simple text outline for readability
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 3;
            ctx.strokeText(ft.text, ft.x, ft.y);
            ctx.fillText(ft.text, ft.x, ft.y);
        });
        ctx.restore();

        // Draw grass ground at bottom
        ctx.fillStyle = isDark ? '#064e3b' : '#22c55e';
        ctx.fillRect(0, canvas.height - 12, canvas.width, 12);
    }

    // Dynamic Star Drawer helper
    function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius, color) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        let step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    }

    // Key handlers
    function keyDown(e) {
        // Ignore document actions when user is typing high score name
        if (document.activeElement && document.activeElement.tagName === 'INPUT') {
            return;
        }

        keysPressed[e.key] = true;
        keysPressed[e.code] = true;

        if (e.code === 'Space') {
            e.preventDefault();
            if (gameState === 'notStarted' || gameState === 'gameOver') {
                startGame();
            }
        }
    }

    function keyUp(e) {
        // Ignore document actions when user is typing high score name
        if (document.activeElement && document.activeElement.tagName === 'INPUT') {
            return;
        }

        keysPressed[e.key] = false;
        keysPressed[e.code] = false;
    }

    // Mouse handlers
    canvas.addEventListener('mousemove', (e) => {
        if (gameState !== 'playing' || controlMode !== 'mouse') return;
        const rect = canvas.getBoundingClientRect();
        // Scale mouse X coordinate to fit internal buffer resolution (800)
        const scaleX = canvas.width / rect.width;
        const mouseX = (e.clientX - rect.left) * scaleX;
        
        targetX = mouseX - player.width / 2;
    });

    // Touch support for mobile glide
    canvas.addEventListener('touchmove', (e) => {
        if (gameState !== 'playing' || controlMode !== 'mouse') return;
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const touchX = (e.touches[0].clientX - rect.left) * scaleX;
        
        targetX = touchX - player.width / 2;
    }, { passive: false });

    // Leaderboards localStorage utilities
    function getRankings() {
        return JSON.parse(localStorage.getItem('carrotDodgerRanking')) || [];
    }

    function saveRanking(name, score) {
        let rankings = getRankings();
        rankings.push({ name, score: Math.round(score) });
        rankings.sort((a, b) => b.score - a.score);
        rankings = rankings.slice(0, 10);
        localStorage.setItem('carrotDodgerRanking', JSON.stringify(rankings));
    }

    function displayRanking() {
        rankingListEl.innerHTML = '';
        const rankings = getRankings();
        if (rankings.length === 0) {
            const lang = document.documentElement.lang || 'ko';
            rankingListEl.innerHTML = `<li class="text-center py-4 text-text-muted dark:text-slate-500 font-bold" data-lang-ko="등록된 기록이 없습니다." data-lang-en="No scores registered yet.">${lang === 'en' ? 'No scores registered yet.' : '등록된 기록이 없습니다.'}</li>`;
        } else {
            rankings.forEach((r, i) => {
                const li = document.createElement('li');
                li.className = "flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-sm";
                
                // Add highlighting for top 3
                let rankColorClass = "text-text-muted dark:text-slate-500";
                if (i === 0) rankColorClass = "text-amber-500 font-black";
                else if (i === 1) rankColorClass = "text-slate-400 font-black";
                else if (i === 2) rankColorClass = "text-amber-700 font-black";

                li.innerHTML = `
                    <div class="flex items-center gap-2">
                        <span class="${rankColorClass} w-5 text-right font-extrabold text-sm">${i + 1}</span>
                        <span class="font-extrabold text-text-main dark:text-white">${r.name}</span>
                    </div>
                    <span class="text-primary font-black text-sm">${r.score} <span class="text-[10px] text-text-muted dark:text-slate-500">pts</span></span>
                `;
                rankingListEl.appendChild(li);
            });
        }
    }

    // Language Mutation Observer
    const langObserver = new MutationObserver(() => {
        displayRanking();
    });
    langObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);
});
