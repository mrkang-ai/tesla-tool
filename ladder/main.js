document.addEventListener('DOMContentLoaded', () => {
    // Setup inputs and adjusters
    const playerCountInput = document.getElementById('player-count');
    const btnCountDec = document.getElementById('btn-count-dec');
    const btnCountInc = document.getElementById('btn-count-inc');
    const playersDiv = document.getElementById('players');
    const resultsDiv = document.getElementById('results');
    const setupDiv = document.getElementById('setup');
    const startGameBtn = document.getElementById('start-game');
    
    // Active game container and canvas
    const gameContainer = document.getElementById('game-container');
    const canvas = document.getElementById('ladder-canvas');
    const ctx = canvas.getContext('2d');
    const resultPanel = document.getElementById('result-panel');
    const resultDisplay = document.getElementById('result-display');
    const resetGameBtn = document.getElementById('reset-game');
    const toggleRungsBtn = document.getElementById('toggle-rungs');
    const runAllBtn = document.getElementById('run-all-btn');

    // Presets
    const presetCoffee = document.getElementById('preset-coffee');
    const presetLunch = document.getElementById('preset-lunch');
    const presetOrder = document.getElementById('preset-order');

    // Game state variables
    let numPlayers = 4;
    let players = [];
    let results = [];
    let rungs = []; // Array of { col: index, y: coord }
    let paths = []; // Precalculated waypoints for each player
    let areRungsVisible = true;
    let animatedPlayers = []; // Track players currently animating: { index, currentSegment, segmentProgress, pathCoords, color, isDone }
    let isGameRunning = false;
    let finishedPlayerMap = {}; // Maps playerIndex -> ending colIndex

    // Neon/Pastel color palette for paths
    const pathColors = [
        '#ef4444', // Red
        '#3b82f6', // Blue
        '#10b981', // Emerald
        '#f59e0b', // Amber
        '#8b5cf6', // Violet
        '#ec4899', // Pink
        '#06b6d4', // Cyan
        '#14b8a6', // Teal
        '#f97316', // Orange
        '#84cc16', // Lime
        '#a855f7', // Purple
        '#6366f1'  // Indigo
    ];

    // Get color for player
    function getPlayerColor(index) {
        return pathColors[index % pathColors.length];
    }

    // Adjuster buttons
    if (btnCountDec) {
        btnCountDec.addEventListener('click', () => {
            let val = parseInt(playerCountInput.value, 10);
            if (val > 2) {
                playerCountInput.value = val - 1;
                numPlayers = val - 1;
                updateInputFields();
            }
        });
    }

    if (btnCountInc) {
        btnCountInc.addEventListener('click', () => {
            let val = parseInt(playerCountInput.value, 10);
            if (val < 12) {
                playerCountInput.value = val + 1;
                numPlayers = val + 1;
                updateInputFields();
            }
        });
    }

    if (playerCountInput) {
        playerCountInput.addEventListener('change', () => {
            let val = parseInt(playerCountInput.value, 10);
            if (isNaN(val) || val < 2) val = 2;
            if (val > 12) val = 12;
            playerCountInput.value = val;
            numPlayers = val;
            updateInputFields();
        });
    }

    // Dynamic field population
    function updateInputFields() {
        // Backup current inputs
        const currentPlayers = Array.from(playersDiv.querySelectorAll('input')).map(inp => inp.value);
        const currentResults = Array.from(resultsDiv.querySelectorAll('input')).map(inp => inp.value);

        playersDiv.innerHTML = '';
        resultsDiv.innerHTML = '';

        const lang = document.documentElement.lang || 'ko';

        for (let i = 1; i <= numPlayers; i++) {
            // Player field
            const pDiv = document.createElement('div');
            pDiv.className = "flex items-center gap-2";
            
            const pInput = document.createElement('input');
            pInput.type = 'text';
            pInput.className = "form-input flex-1 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-text-main dark:text-white focus:border-primary focus:ring-primary";
            
            const defaultPlayerName = lang === 'en' ? `Player ${i}` : `참가자 ${i}`;
            pInput.value = currentPlayers[i - 1] || defaultPlayerName;
            pInput.placeholder = defaultPlayerName;
            pDiv.appendChild(pInput);
            playersDiv.appendChild(pDiv);

            // Result field
            const rDiv = document.createElement('div');
            rDiv.className = "flex items-center gap-2";

            const rInput = document.createElement('input');
            rInput.type = 'text';
            rInput.className = "form-input flex-1 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-text-main dark:text-white focus:border-primary focus:ring-primary";
            
            const defaultResultName = lang === 'en' ? `Result ${i}` : `결과 ${i}`;
            rInput.value = currentResults[i - 1] || defaultResultName;
            rInput.placeholder = defaultResultName;
            rDiv.appendChild(rInput);
            resultsDiv.appendChild(rDiv);
        }
    }

    // Presets Click Handlers
    if (presetCoffee) {
        presetCoffee.addEventListener('click', () => {
            numPlayers = 4;
            playerCountInput.value = 4;
            updateInputFields();

            const pInputs = playersDiv.querySelectorAll('input');
            const rInputs = resultsDiv.querySelectorAll('input');
            const lang = document.documentElement.lang || 'ko';

            pInputs.forEach((inp, idx) => {
                inp.value = lang === 'en' ? `Player ${idx + 1}` : `참가자 ${idx + 1}`;
            });

            // Make 1 Coffee loser
            rInputs.forEach((inp, idx) => {
                if (idx === 3) {
                    inp.value = lang === 'en' ? 'Coffee Penalty! ☕' : '커피 쏘기! ☕';
                } else {
                    inp.value = lang === 'en' ? 'Pass' : '통과';
                }
            });
        });
    }

    if (presetLunch) {
        presetLunch.addEventListener('click', () => {
            numPlayers = 4;
            playerCountInput.value = 4;
            updateInputFields();

            const pInputs = playersDiv.querySelectorAll('input');
            const rInputs = resultsDiv.querySelectorAll('input');
            const lang = document.documentElement.lang || 'ko';

            pInputs.forEach((inp, idx) => {
                inp.value = lang === 'en' ? `Player ${idx + 1}` : `참가자 ${idx + 1}`;
            });

            // Make 1 Lunch loser
            rInputs.forEach((inp, idx) => {
                if (idx === 0) {
                    inp.value = lang === 'en' ? 'Buy Lunch! 🍲' : '점심 사기! 🍲';
                } else {
                    inp.value = lang === 'en' ? 'Pass' : '통과';
                }
            });
        });
    }

    if (presetOrder) {
        presetOrder.addEventListener('click', () => {
            numPlayers = 3;
            playerCountInput.value = 3;
            updateInputFields();

            const pInputs = playersDiv.querySelectorAll('input');
            const rInputs = resultsDiv.querySelectorAll('input');
            const lang = document.documentElement.lang || 'ko';

            pInputs.forEach((inp, idx) => {
                inp.value = lang === 'en' ? `Player ${idx + 1}` : `참가자 ${idx + 1}`;
            });

            rInputs.forEach((inp, idx) => {
                if (idx === 0) inp.value = lang === 'en' ? '1st 🥇' : '1등 🥇';
                else if (idx === 1) inp.value = lang === 'en' ? '2nd 🥈' : '2등 🥈';
                else inp.value = lang === 'en' ? '3rd 🥉' : '3등 🥉';
            });
        });
    }

    // Geometry Helpers
    function getX(colIndex) {
        return 60 + colIndex * 120;
    }

    // Generate Rungs randomly
    function generateLadder() {
        rungs = [];
        const minHeight = 90;
        const maxHeight = 450;
        const deltaY = 30; // Min space between rungs

        // Place rungs between adjacent poles
        for (let col = 0; col < numPlayers - 1; col++) {
            // Place 2 to 4 random rungs per column space
            const rungCount = Math.floor(Math.random() * 3) + 2;
            for (let r = 0; r < rungCount; r++) {
                let attempts = 0;
                let found = false;
                while (attempts < 50 && !found) {
                    const y = Math.floor(Math.random() * (maxHeight - minHeight)) + minHeight;
                    
                    // Enforce vertical separation on own column and neighbor columns
                    const tooClose = rungs.some(rung => {
                        const sameCol = (rung.col === col);
                        const neighborCol = (rung.col === col - 1 || rung.col === col + 1);
                        if (sameCol && Math.abs(rung.y - y) < deltaY) return true;
                        if (neighborCol && Math.abs(rung.y - y) < 15) return true;
                        return false;
                    });

                    if (!tooClose) {
                        rungs.push({ col: col, y: y });
                        found = true;
                    }
                    attempts++;
                }
            }
        }

        // Sort rungs vertically
        rungs.sort((a, b) => a.y - b.y);
    }

    // Precalculate paths for each player
    function precalculatePaths() {
        paths = [];
        for (let p = 0; p < numPlayers; p++) {
            let col = p;
            let y = 80;
            const waypoints = [{ col: col, x: getX(col), y: y }];

            // Traverse downwards
            while (y < 470) {
                // Check if there is a rung at this exact y level connecting current column
                const leftRung = rungs.find(r => r.y === y && r.col === col - 1);
                const rightRung = rungs.find(r => r.y === y && r.col === col);

                if (leftRung) {
                    waypoints.push({ col: col, x: getX(col), y: y });
                    col = col - 1;
                    waypoints.push({ col: col, x: getX(col), y: y });
                } else if (rightRung) {
                    waypoints.push({ col: col, x: getX(col), y: y });
                    col = col + 1;
                    waypoints.push({ col: col, x: getX(col), y: y });
                }
                y++;
            }
            waypoints.push({ col: col, x: getX(col), y: 470 });
            paths.push(waypoints);
        }
    }

    // Draw the static elements onto canvas
    function drawBoard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const isDark = document.documentElement.classList.contains('dark');

        // Draw poles
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.strokeStyle = isDark ? '#334155' : '#cbd5e1'; // slate-600 / slate-300

        for (let i = 0; i < numPlayers; i++) {
            ctx.beginPath();
            ctx.moveTo(getX(i), 80);
            ctx.lineTo(getX(i), 470);
            ctx.stroke();
        }

        // Draw horizontal rungs if visible
        if (areRungsVisible) {
            ctx.lineWidth = 4;
            ctx.strokeStyle = isDark ? '#475569' : '#94a3b8'; // slate-500 / slate-400
            rungs.forEach(rung => {
                ctx.beginPath();
                ctx.moveTo(getX(rung.col), rung.y);
                ctx.lineTo(getX(rung.col + 1), rung.y);
                ctx.stroke();
            });
        }

        // Draw Results cards at bottom
        results.forEach((result, i) => {
            const cx = getX(i);
            const cy = 505;

            // Draw pill rect
            ctx.shadowBlur = 0;
            ctx.fillStyle = isDark ? '#1e293b' : '#f1f5f9';
            ctx.strokeStyle = isDark ? '#334155' : '#cbd5e1';
            ctx.lineWidth = 1.5;

            drawRoundedRect(ctx, cx - 45, cy - 18, 90, 36, 12, true, true);

            // Draw text
            ctx.fillStyle = isDark ? '#f0f9ff' : '#0f172a';
            ctx.font = '700 13px "Plus Jakarta Sans", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Truncate long results
            let displayResult = result;
            if (result.length > 7) {
                displayResult = result.substring(0, 6) + '..';
            }
            ctx.fillText(displayResult, cx, cy);
        });

        // Draw player avatar badges at top
        players.forEach((player, i) => {
            const cx = getX(i);
            const cy = 45;

            // Check if player has finished or is animating to highlight
            const isAnimating = animatedPlayers.some(p => p.index === i && !p.isDone);
            const isFinished = finishedPlayerMap[i] !== undefined;

            ctx.shadowBlur = 0;

            // Badge circle
            ctx.beginPath();
            ctx.arc(cx, cy, 24, 0, Math.PI * 2);
            ctx.fillStyle = isFinished || isAnimating ? getPlayerColor(i) : (isDark ? '#1e293b' : '#f8fafc');
            ctx.fill();

            // Border glow
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = isFinished || isAnimating ? getPlayerColor(i) : (isDark ? '#334155' : '#e2e8f0');
            ctx.stroke();

            // Text / Initials
            ctx.fillStyle = isFinished || isAnimating ? '#ffffff' : (isDark ? '#f0f9ff' : '#0f172a');
            ctx.font = '800 12px "Plus Jakarta Sans", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            let initials = player.substring(0, 3);
            ctx.fillText(initials, cx, cy);
        });
    }

    // Rounded rectangle helper
    function drawRoundedRect(ctx, x, y, width, height, radius, fill, stroke) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        if (fill) ctx.fill();
        if (stroke) ctx.stroke();
    }

    // Pre-calculated path coordinates draw loop
    function drawActivePaths() {
        animatedPlayers.forEach(p => {
            if (p.pathCoords.length < 2) return;

            ctx.shadowBlur = 8;
            ctx.shadowColor = p.color;
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 5;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            ctx.beginPath();
            ctx.moveTo(p.pathCoords[0].x, p.pathCoords[0].y);
            for (let k = 1; k < p.pathCoords.length; k++) {
                ctx.lineTo(p.pathCoords[k].x, p.pathCoords[k].y);
            }
            ctx.stroke();

            // Draw glowing head dot
            if (!p.isDone) {
                const head = p.pathCoords[p.pathCoords.length - 1];
                ctx.beginPath();
                ctx.arc(head.x, head.y, 6, 0, Math.PI * 2);
                ctx.fillStyle = '#ffffff';
                ctx.fill();
            }
        });
        
        // Reset shadow
        ctx.shadowBlur = 0;
    }

    // Setup Game Arena
    startGameBtn.addEventListener('click', () => {
        const pInputs = playersDiv.querySelectorAll('input');
        const rInputs = resultsDiv.querySelectorAll('input');

        players = Array.from(pInputs).map(input => input.value.trim() || input.placeholder);
        results = Array.from(rInputs).map(input => input.value.trim() || input.placeholder);

        // Transition views
        setupDiv.style.display = 'none';
        gameContainer.style.display = 'flex';

        // Render Canvas Dimensions
        canvas.width = numPlayers * 120;
        canvas.height = 550;

        // Reset state
        animatedPlayers = [];
        finishedPlayerMap = {};
        isGameRunning = false;
        resultPanel.classList.add('hidden');
        resultDisplay.innerHTML = '';

        generateLadder();
        precalculatePaths();
        drawBoard();

        // Preset "Show Rungs" label
        areRungsVisible = true;
        toggleRungsBtn.querySelector('span:last-child').textContent = document.documentElement.lang === 'en' ? 'Hide Rungs' : '사다리 감추기';
        toggleRungsBtn.querySelector('.material-symbols-outlined').textContent = 'visibility_off';
    });

    // Reset Game trigger
    resetGameBtn.addEventListener('click', () => {
        setupDiv.style.display = 'block';
        gameContainer.style.display = 'none';
        isGameRunning = false;
        animatedPlayers = [];
    });

    // Toggle Rungs visibility
    toggleRungsBtn.addEventListener('click', () => {
        areRungsVisible = !areRungsVisible;
        const lang = document.documentElement.lang || 'ko';
        
        const label = toggleRungsBtn.querySelector('span:last-child');
        const icon = toggleRungsBtn.querySelector('.material-symbols-outlined');

        if (areRungsVisible) {
            label.textContent = lang === 'en' ? 'Hide Rungs' : '사다리 감추기';
            icon.textContent = 'visibility_off';
        } else {
            label.textContent = lang === 'en' ? 'Show Rungs' : '사다리 보이기';
            icon.textContent = 'visibility';
        }
        drawBoard();
        drawActivePaths();
    });

    // Run All Paths Simultaneously
    runAllBtn.addEventListener('click', () => {
        if (isGameRunning) return;

        // Reset
        animatedPlayers = [];
        finishedPlayerMap = {};
        resultDisplay.innerHTML = '';
        resultPanel.classList.add('hidden');

        // Populate animations for all players
        for (let i = 0; i < numPlayers; i++) {
            animatedPlayers.push(createPlayerAnimationObject(i));
        }

        runAnimationLoop();
    });

    function createPlayerAnimationObject(pIndex) {
        const waypoints = paths[pIndex];
        return {
            index: pIndex,
            waypoints: waypoints,
            color: getPlayerColor(pIndex),
            isDone: false,
            currentSegment: 0,
            segmentProgress: 0, // progress along current segment (0 to 1)
            pathCoords: [{ x: waypoints[0].x, y: waypoints[0].y }]
        };
    }

    // Core Animation loop
    function runAnimationLoop() {
        isGameRunning = true;
        
        // Disable actions during animation
        runAllBtn.disabled = true;
        runAllBtn.classList.add('opacity-50', 'cursor-not-allowed');

        const speed = 4.5; // Pixels per frame along segment

        const loop = () => {
            let allDone = true;

            animatedPlayers.forEach(p => {
                if (p.isDone) return;
                allDone = false;

                const startNode = p.waypoints[p.currentSegment];
                const endNode = p.waypoints[p.currentSegment + 1];

                if (!endNode) {
                    p.isDone = true;
                    finishedPlayerMap[p.index] = startNode.col;
                    appendSingleResult(p.index, startNode.col);
                    return;
                }

                // Distance between startNode and endNode
                const dx = endNode.x - startNode.x;
                const dy = endNode.y - startNode.y;
                const dist = Math.hypot(dx, dy);

                // Increment progress
                p.segmentProgress += speed / dist;

                if (p.segmentProgress >= 1) {
                    // Snap to end of segment
                    p.pathCoords.push({ x: endNode.x, y: endNode.y });
                    p.currentSegment++;
                    p.segmentProgress = 0;
                } else {
                    // Interpolate coordinate
                    const cx = startNode.x + dx * p.segmentProgress;
                    const cy = startNode.y + dy * p.segmentProgress;
                    
                    // Draw continuous lines nicely by replacing or appending
                    if (p.pathCoords.length > p.currentSegment + 1) {
                        p.pathCoords[p.pathCoords.length - 1] = { x: cx, y: cy };
                    } else {
                        p.pathCoords.push({ x: cx, y: cy });
                    }
                }
            });

            // Redraw everything
            drawBoard();
            drawActivePaths();

            if (!allDone) {
                requestAnimationFrame(loop);
            } else {
                // Completed!
                isGameRunning = false;
                runAllBtn.disabled = false;
                runAllBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                resultPanel.classList.remove('hidden');
            }
        };

        requestAnimationFrame(loop);
    }

    // Run path for a single player
    function runPath(pIndex) {
        if (isGameRunning) return;

        // Check if already completed and animated
        if (finishedPlayerMap[pIndex] !== undefined) return;

        // Add player to active animations list
        const pAnimObj = createPlayerAnimationObject(pIndex);
        animatedPlayers.push(pAnimObj);

        runAnimationLoop();
    }

    // Append a result card
    function appendSingleResult(playerIdx, endColIdx) {
        const pName = players[playerIdx];
        const rName = results[endColIdx];

        const card = document.createElement('div');
        card.className = "flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-sm";

        card.innerHTML = `
            <div class="flex items-center gap-2">
                <span class="w-3.5 h-3.5 rounded-full" style="background-color: ${getPlayerColor(playerIdx)}"></span>
                <span class="text-text-muted dark:text-slate-400 font-bold">${pName}</span>
            </div>
            <span class="text-primary font-extrabold ml-2">${rName}</span>
        `;
        resultDisplay.appendChild(card);
    }

    // Canvas Mouse Click Column Headers Listener
    canvas.addEventListener('click', (e) => {
        if (isGameRunning) return;

        const rect = canvas.getBoundingClientRect();
        // Scale coordinates matching real buffer size
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        // Check if header circle clicked
        for (let i = 0; i < numPlayers; i++) {
            const cx = getX(i);
            const cy = 45;
            const dist = Math.hypot(x - cx, y - cy);
            if (dist <= 30) {
                runPath(i);
                break;
            }
        }
    });

    // Handle language switch redraws
    const langObserver = new MutationObserver(() => {
        updateInputFields();
        drawBoard();
    });
    langObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

    // Initial input generation
    updateInputFields();
});