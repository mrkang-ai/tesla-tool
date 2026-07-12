document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');
    const spinBtn = document.getElementById('spin-btn');
    const addOptionBtn = document.getElementById('add-option-btn');
    const optionsContainer = document.getElementById('options-container');
    const winnerBanner = document.getElementById('winner-banner');
    const winnerText = document.getElementById('winner-text');
    const durationSlider = document.getElementById('duration-slider');
    const durationDisplay = document.getElementById('duration-display');
    const soundToggle = document.getElementById('sound-toggle');

    // Preset elements
    const presetLunchBtn = document.getElementById('preset-lunch');
    const presetPenaltyBtn = document.getElementById('preset-penalty');
    const presetTruthBtn = document.getElementById('preset-truth');

    // Default wedge colors
    const colors = [
        '#8b5cf6', // Purple
        '#3b82f6', // Blue
        '#06b6d4', // Cyan
        '#10b981', // Emerald
        '#eab308', // Amber
        '#f97316', // Orange
        '#ec4899', // Pink
        '#6366f1'  // Indigo
    ];

    // Presets localized
    const presets = {
        ko: {
            lunch: ['짜장면', '김치찌개', '돈까스', '초밥', '제육볶음', '햄버거'],
            penalty: ['5천원 내기', '커피 사기', '꿀밤 맞기', '통과', '청소하기', '댄스 추기'],
            truth: ['진실 이야기', '러브 라인', '첫사랑 폭로', '비밀 폭로', '매력 발산', '벌칙 수행']
        },
        en: {
            lunch: ['Pizza', 'Burger', 'Sushi', 'Salad', 'Pasta', 'Taco'],
            penalty: ['Pay $5', 'Buy Coffee', 'Free Pass', 'Do 10 Pushups', 'Clean Up', 'Sing a Song'],
            truth: ['First Love', 'Secret Share', 'Dance Solo', 'Imitate Someone', 'Do a Dare', 'Free Pass']
        }
    };

    let options = [];
    let currentPresetType = 'lunch';

    // Physics state variables
    let startAngle = 0;
    let spinAngleStart = 0;
    let spinTime = 0;
    let spinTimeTotal = 4000; // in milliseconds
    let isSpinning = false;
    let animationFrameId = null;

    // Confetti state
    let confettis = [];
    let confettiFrameId = null;

    // Sound generation helper using Web Audio API
    function playTickSound() {
        if (!soundToggle.checked) return;
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            osc.type = 'sine';
            // Play a high-pitched wooden tick
            osc.frequency.setValueAtTime(650, audioCtx.currentTime);
            gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);

            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + 0.04);
        } catch (e) {
            console.error('AudioContext tick error:', e);
        }
    }

    function playWinSound() {
        if (!soundToggle.checked) return;
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const playBeep = (freq, delay, duration) => {
                const osc = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);
                gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime + delay);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + delay + duration);
                osc.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                osc.start(audioCtx.currentTime + delay);
                osc.stop(audioCtx.currentTime + delay + duration);
            };

            // Uplifting arpeggio chime on win
            playBeep(523.25, 0, 0.15); // C5
            playBeep(659.25, 0.08, 0.15); // E5
            playBeep(783.99, 0.16, 0.15); // G5
            playBeep(1046.50, 0.24, 0.35); // C6
        } catch (e) {
            console.error('AudioContext win error:', e);
        }
    }

    // Confetti Particle Class
    class ConfettiParticle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 3;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed - 1.5;
            this.size = Math.random() * 6 + 5;
            this.color = `hsl(${Math.random() * 360}, 100%, 65%)`;
            this.alpha = 1.0;
            this.decay = Math.random() * 0.015 + 0.015;
            this.gravity = 0.14;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += this.gravity;
            this.alpha -= this.decay;
        }

        draw(c) {
            c.save();
            c.globalAlpha = this.alpha;
            c.fillStyle = this.color;
            c.beginPath();
            c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            c.fill();
            c.restore();
        }
    }

    // Initialize resolution
    function initCanvasResolution() {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = 500 * dpr;
        canvas.height = 500 * dpr;
        ctx.scale(dpr, dpr);
    }

    // Render option wedges on the wheel
    function drawWheel() {
        const numOptions = options.length;
        if (numOptions === 0) return;

        const outsideRadius = 230;
        const textRadius = 155;
        const insideRadius = 40;
        const centerX = 250;
        const centerY = 250;

        ctx.clearRect(0, 0, 500, 500);

        // Draw shadow ring underneath
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(centerX, centerY, outsideRadius, 0, Math.PI * 2);
        ctx.fillStyle = document.documentElement.classList.contains('dark') ? '#1e293b' : '#f8fafc';
        ctx.fill();
        ctx.restore();

        const arc = Math.PI * 2 / numOptions;

        for (let i = 0; i < numOptions; i++) {
            const angle = startAngle + i * arc;
            ctx.fillStyle = colors[i % colors.length];

            // Draw pie slice
            ctx.beginPath();
            ctx.arc(centerX, centerY, outsideRadius, angle, angle + arc, false);
            ctx.arc(centerX, centerY, insideRadius, angle + arc, angle, true);
            ctx.fill();

            // Draw sector divider lines
            ctx.strokeStyle = document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff';
            ctx.lineWidth = 2.5;
            ctx.stroke();

            // Draw text
            ctx.save();
            ctx.fillStyle = '#ffffff';
            // Thick text stroke shadow for readability
            ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
            ctx.shadowBlur = 4;

            ctx.translate(centerX + Math.cos(angle + arc / 2) * textRadius,
                          centerY + Math.sin(angle + arc / 2) * textRadius);
            ctx.rotate(angle + arc / 2 + Math.PI / 2);
            
            ctx.textAlign = 'center';
            ctx.font = '800 13.5px "Plus Jakarta Sans", sans-serif';
            
            // Truncate long text
            let text = options[i];
            if (text.length > 8) {
                text = text.substring(0, 7) + '...';
            }
            ctx.fillText(text, 0, 0);
            ctx.restore();
        }

        // Draw center spindle circle
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
        ctx.shadowBlur = 6;
        ctx.fillStyle = document.documentElement.classList.contains('dark') ? '#334155' : '#ffffff';
        ctx.beginPath();
        ctx.arc(centerX, centerY, insideRadius + 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    let lastIndexUnderPointer = -1;

    // Spin animation loop (Quadratic out easing)
    function rotateWheel(timestamp) {
        if (!isSpinning) return;

        if (!spinTimeStart) spinTimeStart = timestamp;
        const elapsed = timestamp - spinTimeStart;

        // Calculate current rotation speed based on cubic ease out
        const progress = Math.min(elapsed / spinTimeTotal, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3); // Cubic ease out

        const currentAngle = startAngle + (spinAngleStart * (1 - easeOut));
        startAngle = currentAngle % (Math.PI * 2);

        // Tick sounds based on segment wedges passing pointer (top center = 1.5 * Math.PI)
        const arc = Math.PI * 2 / options.length;
        let normalizedAngle = (1.5 * Math.PI - startAngle) % (Math.PI * 2);
        if (normalizedAngle < 0) normalizedAngle += Math.PI * 2;
        const currentIndexUnderPointer = Math.floor(normalizedAngle / arc);

        if (currentIndexUnderPointer !== lastIndexUnderPointer) {
            if (lastIndexUnderPointer !== -1 && progress < 0.96) {
                playTickSound();
            }
            lastIndexUnderPointer = currentIndexUnderPointer;
        }

        drawWheel();

        if (progress < 1) {
            animationFrameId = requestAnimationFrame(rotateWheel);
        } else {
            // Spin completed
            isSpinning = false;
            spinBtn.disabled = false;
            
            const winnerIdx = currentIndexUnderPointer;
            const winner = options[winnerIdx];
            
            showWinner(winner);
        }
    }

    // Display winner banner and trigger confetti
    function showWinner(name) {
        winnerText.textContent = name;
        winnerBanner.classList.remove('hidden');

        playWinSound();

        // Spawn confetti particles at wheel center
        confettis = [];
        for (let i = 0; i < 90; i++) {
            confettis.push(new ConfettiParticle(250, 250));
        }

        if (confettiFrameId) cancelAnimationFrame(confettiFrameId);
        animateConfetti();
    }

    function animateConfetti() {
        let activeParticles = false;
        
        // Draw confetti overlay on canvas
        drawWheel();

        confettis.forEach(particle => {
            particle.update();
            if (particle.alpha > 0) {
                particle.draw(ctx);
                activeParticles = true;
            }
        });

        if (activeParticles) {
            confettiFrameId = requestAnimationFrame(animateConfetti);
        } else {
            drawWheel(); // Final clean state redraw
        }
    }

    // Start spin action
    function startSpin() {
        if (isSpinning || options.length < 2) return;

        winnerBanner.classList.add('hidden');
        if (confettiFrameId) cancelAnimationFrame(confettiFrameId);
        
        isSpinning = true;
        spinBtn.disabled = true;

        spinTimeStart = null;
        // Total rotation: 6 to 12 full circles + randomized ending offset
        spinAngleStart = (Math.random() * 5 + 6) * Math.PI * 2; 
        
        // Duration slider config loading
        spinTimeTotal = parseFloat(durationSlider.value) * 1000;

        animationFrameId = requestAnimationFrame(rotateWheel);
    }

    // Synchronize inputs array with DOM fields
    function renderOptionsList() {
        optionsContainer.innerHTML = '';
        
        options.forEach((opt, idx) => {
            const row = document.createElement('div');
            row.className = 'flex items-center gap-2 group';

            // Color tag
            const colorIndicator = document.createElement('div');
            colorIndicator.className = 'w-4 h-9 rounded-lg flex-shrink-0';
            colorIndicator.style.backgroundColor = colors[idx % colors.length];

            // Input element
            const input = document.createElement('input');
            input.type = 'text';
            input.value = opt;
            input.className = 'w-full h-9 px-3 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-text-main dark:text-white focus:border-purple-500 focus:ring-purple-500';
            
            // Update options list dynamically as typed
            input.addEventListener('input', (e) => {
                options[idx] = e.target.value;
                drawWheel();
            });

            // Delete button
            const delBtn = document.createElement('button');
            delBtn.className = 'w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-950/20 text-text-muted hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 flex items-center justify-center transition-all cursor-pointer';
            delBtn.innerHTML = '<span class="material-symbols-outlined text-base">delete</span>';
            
            if (options.length <= 2) {
                delBtn.disabled = true;
                delBtn.classList.add('opacity-40', 'cursor-not-allowed');
            }

            delBtn.addEventListener('click', () => {
                if (options.length <= 2) return;
                options.splice(idx, 1);
                renderOptionsList();
                drawWheel();
            });

            row.appendChild(colorIndicator);
            row.appendChild(input);
            row.appendChild(delBtn);

            optionsContainer.appendChild(row);
        });

        // Limit maximum inputs to 20
        if (options.length >= 20) {
            addOptionBtn.disabled = true;
            addOptionBtn.classList.add('opacity-40', 'cursor-not-allowed');
        } else {
            addOptionBtn.disabled = false;
            addOptionBtn.classList.remove('opacity-40', 'cursor-not-allowed');
        }
    }

    // Preset loader helper
    function loadPreset(type) {
        const lang = document.documentElement.lang || 'ko';
        currentPresetType = type;

        // Reset preset buttons highlight
        [presetLunchBtn, presetPenaltyBtn, presetTruthBtn].forEach(btn => btn.classList.remove('preset-active'));
        
        if (type === 'lunch') {
            options = [...presets[lang].lunch];
            presetLunchBtn.classList.add('preset-active');
        } else if (type === 'penalty') {
            options = [...presets[lang].penalty];
            presetPenaltyBtn.classList.add('preset-active');
        } else if (type === 'truth') {
            options = [...presets[lang].truth];
            presetTruthBtn.classList.add('preset-active');
        }

        renderOptionsList();
        drawWheel();
    }

    // Add option Wedge
    addOptionBtn.addEventListener('click', () => {
        if (options.length >= 20) return;
        const lang = document.documentElement.lang || 'ko';
        const defaultName = lang === 'ko' ? `항목 ${options.length + 1}` : `Item ${options.length + 1}`;
        options.push(defaultName);
        renderOptionsList();
        drawWheel();
    });

    // Spin speed duration handler
    durationSlider.addEventListener('input', (e) => {
        durationDisplay.textContent = e.target.value + 's';
    });

    // Preset button links
    presetLunchBtn.addEventListener('click', () => loadPreset('lunch'));
    presetPenaltyBtn.addEventListener('click', () => loadPreset('penalty'));
    presetTruthBtn.addEventListener('click', () => loadPreset('truth'));

    // Center button triggers
    spinBtn.addEventListener('click', startSpin);

    // Watch for system language toggles
    const langObserver = new MutationObserver(() => {
        loadPreset(currentPresetType);
    });
    langObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

    // Initialize
    initCanvasResolution();
    loadPreset('lunch');

    // Handle system Dark Mode toggles
    const themeObserver = new MutationObserver(() => {
        drawWheel();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
});
