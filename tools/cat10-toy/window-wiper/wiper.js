/**
 * Steamy Glass Window Wiper Cleaner Engine
 * Multi-Theme Background Gallery, Custom Photo Upload, ASMR Sound FX,
 * Rain Ambient BGM, Realistic Trickling Water Droplets, Brushes & Stamps,
 * and PNG Screenshot Art Export.
 */

(function () {
  'use strict';

  // Preset Scenery Themes
  const THEMES = [
    {
      id: 'rainy_city',
      name: '비 내리는 서울 야경',
      icon: '🌧️',
      desc: '네온사인이 비에 번지는 감성적인 도시의 밤',
      url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1200&auto=format&fit=crop&q=80'
    },
    {
      id: 'cafe_winter',
      name: '아늑한 겨울 카페',
      icon: '☕',
      desc: '따스한 조명과 모락모락 김이 피어오르는 카페 창가',
      url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&auto=format&fit=crop&q=80'
    },
    {
      id: 'snow_cabin',
      name: '눈 내리는 오두막 숲',
      icon: '❄️',
      desc: '흰 눈이 소복소복 쌓이는 고요한 자작나무 숲',
      url: 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?w=1200&auto=format&fit=crop&q=80'
    },
    {
      id: 'aurora_night',
      name: '신비로운 오로라 밤하늘',
      icon: '🌌',
      desc: '보랏빛 오로라와 쏟아질 듯한 은하수',
      url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200&auto=format&fit=crop&q=80'
    },
    {
      id: 'window_puppy',
      name: '창밖 구경 댕댕이',
      icon: '🐶',
      desc: '호기심 가득한 눈으로 창밖을 바라보는 강아지',
      url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=1200&auto=format&fit=crop&q=80'
    },
    {
      id: 'window_cat',
      name: '창가의 고양이',
      icon: '🐱',
      desc: '빗방울을 응시하는 포근하고 평화로운 고양이',
      url: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=1200&auto=format&fit=crop&q=80'
    },
    {
      id: 'cherry_blossom',
      name: '햇살 가득 봄 벚꽃',
      icon: '🌸',
      desc: '봄바람에 흩날리는 따스한 분홍빛 벚꽃 풍경',
      url: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=1200&auto=format&fit=crop&q=80'
    }
  ];

  // Tool Definitions
  const TOOLS = {
    finger: { name: '손가락', size: 28, icon: '👆' },
    pen: { name: '가는 펜 (낙서용)', size: 12, icon: '✏️' },
    palm: { name: '손바닥', size: 70, icon: '🖐️' },
    squeegee: { name: '스퀴지 와이퍼', size: 110, icon: '🧽' },
    heart: { name: '하트 스탬프', size: 50, icon: '❤️' },
    star: { name: '별 스탬프', size: 50, icon: '⭐' },
    paw: { name: '발자국 스탬프', size: 45, icon: '🐾' }
  };

  // State
  let currentThemeIndex = 0;
  let customImageUrl = null;
  let currentTool = 'finger';
  let brushSize = 28;
  let fogOpacity = 0.88; // 0.65, 0.88, 0.96
  let soundEnabled = true;
  let rainBgmEnabled = false;

  let canvas, ctx;
  let windowContainer;
  let isDrawing = false;
  let lastX = -1, lastY = -1;
  let lastWipeSoundTime = 0;
  let cleanPercent = 0;
  let activeTrickles = [];
  let trickleAnimId = null;

  // Web Audio Context & Nodes
  let audioCtx = null;
  let rainSource = null;
  let rainGain = null;

  document.addEventListener('DOMContentLoaded', initWiperApp);

  function initWiperApp() {
    canvas = document.getElementById('fogCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    windowContainer = document.getElementById('windowContainer');

    renderThemeSelector();
    setupCanvas();
    setupControls();
    setupAudioUnlock();
    startTrickleLoop();
  }

  // --- Audio Synthesis Engine ---
  function getAudioCtx() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function setupAudioUnlock() {
    const unlock = () => {
      getAudioCtx();
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('touchstart', unlock);
    };
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('touchstart', unlock, { once: true });
  }

  // Squeak / Glass Rub Friction ASMR Sound
  function playWipeSqueak(speed = 1.0) {
    if (!soundEnabled) return;
    const now = Date.now();
    if (now - lastWipeSoundTime < 65) return; // limit frequency
    lastWipeSoundTime = now;

    try {
      getAudioCtx();
      if (!audioCtx) return;
      const t = audioCtx.currentTime;

      // Resonant friction squeak with slight randomized pitch
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      osc.type = Math.random() > 0.4 ? 'triangle' : 'sine';
      const baseFreq = 1400 + Math.random() * 1100;
      osc.frequency.setValueAtTime(baseFreq, t);
      osc.frequency.linearRampToValueAtTime(baseFreq * (0.85 + Math.random() * 0.3), t + 0.07);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(baseFreq, t);
      filter.Q.value = 6;

      const vol = Math.min(0.12, 0.04 + speed * 0.03);
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(t);
      osc.stop(t + 0.09);
    } catch (_) {}
  }

  // Warm Breath Whoosh ("하아~ 💨")
  function playBreathSound() {
    if (!soundEnabled) return;
    try {
      getAudioCtx();
      if (!audioCtx) return;
      const t = audioCtx.currentTime;

      const bufferSize = Math.floor(audioCtx.sampleRate * 0.85);
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(420, t);
      filter.frequency.linearRampToValueAtTime(680, t + 0.35);
      filter.frequency.linearRampToValueAtTime(280, t + 0.85);
      filter.Q.value = 2.2;

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.25, t + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.85);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      noise.start(t);
      noise.stop(t + 0.9);
    } catch (_) {}
  }

  // Stamp / Water Drop Plop Sound
  function playStampPlop() {
    if (!soundEnabled) return;
    try {
      getAudioCtx();
      if (!audioCtx) return;
      const t = audioCtx.currentTime;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, t);
      osc.frequency.exponentialRampToValueAtTime(240, t + 0.12);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.13);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(t);
      osc.stop(t + 0.14);
    } catch (_) {}
  }

  // Rain Ambience Loop (Procedural Pink Noise)
  function toggleRainBgm() {
    getAudioCtx();
    if (!audioCtx) return;

    rainBgmEnabled = !rainBgmEnabled;
    const btn = document.getElementById('rainBgmBtn');
    if (btn) {
      if (rainBgmEnabled) {
        btn.classList.add('bg-sky-600', 'text-white', 'border-sky-400');
        btn.classList.remove('bg-slate-800', 'text-slate-300');
        btn.innerHTML = '<i class="fa-solid fa-cloud-showers-heavy text-sky-200"></i><span>빗소리 BGM ON</span>';
        startRainAmbience();
      } else {
        btn.classList.remove('bg-sky-600', 'text-white', 'border-sky-400');
        btn.classList.add('bg-slate-800', 'text-slate-300');
        btn.innerHTML = '<i class="fa-solid fa-cloud-rain text-slate-400"></i><span>빗소리 BGM OFF</span>';
        stopRainAmbience();
      }
    }
  }

  function startRainAmbience() {
    if (rainSource) return;
    const bufferSize = audioCtx.sampleRate * 2.5;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.1;
      b6 = white * 0.115926;
    }

    rainSource = audioCtx.createBufferSource();
    rainSource.buffer = buffer;
    rainSource.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1200;

    rainGain = audioCtx.createGain();
    rainGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    rainGain.gain.linearRampToValueAtTime(0.045, audioCtx.currentTime + 1.2);

    rainSource.connect(filter);
    filter.connect(rainGain);
    rainGain.connect(audioCtx.destination);

    rainSource.start();
  }

  function stopRainAmbience() {
    if (!rainSource) return;
    try {
      rainGain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
      setTimeout(() => {
        if (rainSource) {
          rainSource.stop();
          rainSource.disconnect();
          rainSource = null;
        }
      }, 700);
    } catch (_) {
      rainSource = null;
    }
  }

  // --- Canvas Setup & Realistic Fog Rendering ---
  function setupCanvas() {
    resizeCanvas();
    window.addEventListener('resize', debounce(resizeCanvas, 150));

    // Pointer events on canvas
    canvas.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    // Touch events for mobile compatibility
    canvas.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) {
        const t = e.touches[0];
        handlePointerDown(t);
      }
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault(); // Stop mobile scroll
      if (e.touches && e.touches[0]) {
        const t = e.touches[0];
        handlePointerMove(t);
      }
    }, { passive: false });

    canvas.addEventListener('touchend', handlePointerUp, { passive: false });
  }

  function resizeCanvas() {
    if (!canvas || !canvas.parentElement) return;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = Math.floor(rect.width);
    canvas.height = Math.floor(rect.height);
    applyFog(false);
  }

  // Apply Photorealistic Steamy Fog Overlay
  function applyFog(animated = false) {
    if (!ctx || !canvas) return;

    if (animated) {
      playBreathSound();
      animateWarmBreath();
      return;
    }

    ctx.save();
    ctx.globalCompositeOperation = 'source-over';

    // Frosted glass gradient tone
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, `rgba(215, 230, 248, ${fogOpacity})`);
    grad.addColorStop(0.5, `rgba(225, 238, 252, ${fogOpacity * 1.02})`);
    grad.addColorStop(1, `rgba(205, 222, 242, ${fogOpacity * 0.98})`);

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle grain / condensation texture
    drawFineCondensationGrain();
    ctx.restore();

    updateProgressUI(0);
  }

  // Fine condensation grain particles for tactile frosted look
  function drawFineCondensationGrain() {
    const grainCount = Math.floor((canvas.width * canvas.height) / 180);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    for (let i = 0; i < grainCount; i++) {
      const gx = Math.random() * canvas.width;
      const gy = Math.random() * canvas.height;
      const gr = Math.random() * 1.8 + 0.5;
      ctx.beginPath();
      ctx.arc(gx, gy, gr, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Breathing Fog Animation ("하아~"하고 김이 차오르는 애니메이션)
  function animateWarmBreath() {
    const start = Date.now();
    const duration = 650;
    const startW = canvas.width;
    const startH = canvas.height;

    function step() {
      const progress = Math.min(1, (Date.now() - start) / duration);
      // Soft radial bloom expanding from center
      const currentRadius = (Math.hypot(startW, startH) / 2) * Math.sin(progress * Math.PI * 0.5);

      ctx.save();
      ctx.globalCompositeOperation = 'source-over';

      const radGrad = ctx.createRadialGradient(
        startW / 2, startH * 0.55, 0,
        startW / 2, startH * 0.55, Math.max(1, currentRadius)
      );
      radGrad.addColorStop(0, `rgba(230, 242, 255, ${fogOpacity * 0.98})`);
      radGrad.addColorStop(0.7, `rgba(220, 235, 252, ${fogOpacity * 0.85})`);
      radGrad.addColorStop(1, `rgba(215, 230, 248, ${fogOpacity * 0.4})`);

      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, startW, startH);
      ctx.restore();

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        applyFog(false);
      }
    }
    requestAnimationFrame(step);
  }

  // Clear Entire Window (고무 와이퍼로 전체 닦기)
  function clearAllFog() {
    if (!ctx || !canvas) return;
    playWipeSqueak(2.5);

    // Fast wipe transition from top to bottom
    const start = Date.now();
    const duration = 380;
    const h = canvas.height;

    function wipeDown() {
      const progress = Math.min(1, (Date.now() - start) / duration);
      const wipeY = h * progress;

      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 1)';
      ctx.fillRect(0, 0, canvas.width, wipeY);
      ctx.restore();

      if (progress < 1) {
        requestAnimationFrame(wipeDown);
      } else {
        updateProgressUI(100);
      }
    }
    requestAnimationFrame(wipeDown);
  }

  // --- Wiping & Doodling Mechanics ---
  function handlePointerDown(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    lastX = x;
    lastY = y;

    if (['heart', 'star', 'paw'].includes(currentTool)) {
      stampShape(x, y, currentTool);
      isDrawing = false;
      return;
    }

    wipeAt(x, y, brushSize);
    playWipeSqueak(1.0);
  }

  function handlePointerMove(e) {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const dx = x - lastX;
    const dy = y - lastY;
    const dist = Math.hypot(dx, dy);
    const speed = Math.min(3, dist / 12);

    // Smooth continuous interpolation between last point and current point
    const steps = Math.max(1, Math.floor(dist / 4));
    for (let i = 0; i <= steps; i++) {
      const ix = lastX + (dx * i) / steps;
      const iy = lastY + (dy * i) / steps;
      wipeAt(ix, iy, brushSize);
    }

    lastX = x;
    lastY = y;

    playWipeSqueak(speed);
  }

  function handlePointerUp() {
    if (isDrawing) {
      isDrawing = false;
      lastX = -1;
      lastY = -1;
      calculateCleanProgress();
    }
  }

  // Render Transparent Stroke with Soft Glass Edge
  function wipeAt(x, y, size) {
    if (!ctx) return;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';

    // Radial gradient eraser for realistic soft moisture edge
    const grad = ctx.createRadialGradient(x, y, size * 0.45, x, y, size);
    grad.addColorStop(0, 'rgba(0, 0, 0, 1)');
    grad.addColorStop(0.8, 'rgba(0, 0, 0, 0.95)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Stamp Shapes (Heart, Star, Paw)
  function stampShape(x, y, shape) {
    if (!ctx) return;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.translate(x, y);

    const s = brushSize * 1.3;

    if (shape === 'heart') {
      ctx.beginPath();
      const topCurveHeight = s * 0.3;
      ctx.moveTo(0, topCurveHeight);
      // top left curve
      ctx.bezierCurveTo(-s / 2, -topCurveHeight, -s, topCurveHeight / 3, 0, s);
      // top right curve
      ctx.bezierCurveTo(s, topCurveHeight / 3, s / 2, -topCurveHeight, 0, topCurveHeight);
      ctx.fill();
    } else if (shape === 'star') {
      ctx.beginPath();
      const points = 5;
      const outer = s;
      const inner = s * 0.45;
      for (let i = 0; i < points * 2; i++) {
        const r = i % 2 === 0 ? outer : inner;
        const angle = (i * Math.PI) / points - Math.PI / 2;
        const px = Math.cos(angle) * r;
        const py = Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
    } else if (shape === 'paw') {
      // Main pad
      ctx.beginPath();
      ctx.ellipse(0, s * 0.2, s * 0.5, s * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();
      // 4 toe pads
      const toes = [
        { x: -s * 0.42, y: -s * 0.25, rx: s * 0.16, ry: s * 0.22, rot: -0.35 },
        { x: -s * 0.15, y: -s * 0.45, rx: s * 0.16, ry: s * 0.24, rot: -0.1 },
        { x: s * 0.15, y: -s * 0.45, rx: s * 0.16, ry: s * 0.24, rot: 0.1 },
        { x: s * 0.42, y: -s * 0.25, rx: s * 0.16, ry: s * 0.22, rot: 0.35 }
      ];
      toes.forEach(t => {
        ctx.beginPath();
        ctx.ellipse(t.x, t.y, t.rx, t.ry, t.rot, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    ctx.restore();
    playStampPlop();
    calculateCleanProgress();
  }

  // --- Trickling Water Droplets Physics ---
  function spawnTrickle() {
    if (!canvas) return;
    const count = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < count; i++) {
      activeTrickles.push({
        x: Math.random() * (canvas.width - 60) + 30,
        y: Math.random() * 60 + 10,
        vy: Math.random() * 1.8 + 1.2,
        vx: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 3.5 + 2.5,
        maxDist: Math.random() * (canvas.height * 0.7) + canvas.height * 0.2,
        traveled: 0
      });
    }
  }

  function startTrickleLoop() {
    function updateTrickles() {
      if (activeTrickles.length > 0 && ctx) {
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';

        for (let i = activeTrickles.length - 1; i >= 0; i--) {
          const drop = activeTrickles[i];
          drop.y += drop.vy;
          drop.x += (Math.random() - 0.5) * 0.6; // subtle natural meander
          drop.traveled += drop.vy;

          // Clear narrow bead line
          ctx.beginPath();
          ctx.arc(drop.x, drop.y, drop.size, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
          ctx.fill();

          if (drop.traveled >= drop.maxDist || drop.y >= canvas.height) {
            activeTrickles.splice(i, 1);
          }
        }
        ctx.restore();
      }
      trickleAnimId = requestAnimationFrame(updateTrickles);
    }
    trickleAnimId = requestAnimationFrame(updateTrickles);
  }

  // --- Clean Progress Calculation ---
  function calculateCleanProgress() {
    if (!ctx || !canvas) return;
    try {
      // Downsample grid calculation for 60fps performance
      const sampleStep = 18;
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      let clearedCount = 0;
      let totalCount = 0;

      for (let y = 0; y < canvas.height; y += sampleStep) {
        for (let x = 0; x < canvas.width; x += sampleStep) {
          totalCount++;
          const idx = (y * canvas.width + x) * 4;
          const alpha = data[idx + 3];
          if (alpha < 60) {
            clearedCount++;
          }
        }
      }

      const pct = Math.round((clearedCount / Math.max(1, totalCount)) * 100);
      updateProgressUI(pct);
    } catch (_) {}
  }

  function updateProgressUI(pct) {
    cleanPercent = pct;
    const progressEl = document.getElementById('cleanProgressText');
    const progressBar = document.getElementById('cleanProgressBar');
    const badge = document.getElementById('sparkleBadge');

    if (progressEl) progressEl.innerText = `${pct}%`;
    if (progressBar) progressBar.style.width = `${pct}%`;

    if (badge) {
      if (pct >= 90) {
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    }
  }

  // --- Theme Management ---
  function renderThemeSelector() {
    const container = document.getElementById('themeListContainer');
    if (!container) return;

    container.innerHTML = '';
    THEMES.forEach((theme, index) => {
      const btn = document.createElement('button');
      const isSelected = index === currentThemeIndex && !customImageUrl;
      btn.className = `theme-btn px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all active:scale-95 shrink-0 ${
        isSelected
          ? 'bg-sky-600 text-white border-sky-400 shadow-md ring-1 ring-sky-300'
          : 'bg-slate-900/80 text-slate-300 border-slate-700/80 hover:bg-slate-800'
      }`;
      btn.innerHTML = `<span>${theme.icon}</span><span>${theme.name}</span>`;
      btn.addEventListener('click', () => switchTheme(index));
      container.appendChild(btn);
    });

    // Custom Upload Button
    const customBtn = document.createElement('button');
    const isCustom = !!customImageUrl;
    customBtn.className = `theme-btn px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all active:scale-95 shrink-0 ${
      isCustom
        ? 'bg-indigo-600 text-white border-indigo-400 shadow-md ring-1 ring-indigo-300'
        : 'bg-slate-900/80 text-indigo-300 border-indigo-900/60 hover:bg-slate-800'
    }`;
    customBtn.innerHTML = '<span>🖼️</span><span>내 사진 업로드</span>';
    customBtn.addEventListener('click', () => {
      const fileInput = document.getElementById('customPhotoInput');
      if (fileInput) fileInput.click();
    });
    container.appendChild(customBtn);

    applyThemeBackground();
  }

  function switchTheme(index) {
    currentThemeIndex = index;
    customImageUrl = null;
    renderThemeSelector();
    applyThemeBackground();
  }

  function applyThemeBackground() {
    if (!windowContainer) return;
    const url = customImageUrl || THEMES[currentThemeIndex].url;
    windowContainer.style.backgroundImage = `url('${url}')`;

    const descEl = document.getElementById('currentThemeDesc');
    if (descEl) {
      descEl.innerText = customImageUrl
        ? '내 사진이 창밖 풍경으로 적용되었습니다.'
        : THEMES[currentThemeIndex].desc;
    }
  }

  // --- Export My Window Art as PNG ---
  function exportWindowSnapshot() {
    if (!canvas || !windowContainer) return;

    const bgUrl = customImageUrl || THEMES[currentThemeIndex].url;
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const expCtx = exportCanvas.getContext('2d');

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // 1. Draw background image with cover fit
      drawImageCover(expCtx, img, 0, 0, exportCanvas.width, exportCanvas.height);
      // 2. Composite fog & wiped strokes
      expCtx.drawImage(canvas, 0, 0);

      // Download
      exportCanvas.toBlob(blob => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `window-art-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 1000);
      }, 'image/png');
    };

    img.onerror = () => {
      // Fallback: download canvas alone if CORS prevents remote image capture
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.download = `window-art-${Date.now()}.png`;
      a.href = url;
      a.click();
    };

    img.src = bgUrl;
  }

  function drawImageCover(ctx, img, x, y, w, h) {
    const imgRatio = img.width / img.height;
    const targetRatio = w / h;
    let sWidth, sHeight, sx, sy;

    if (imgRatio > targetRatio) {
      sHeight = img.height;
      sWidth = img.height * targetRatio;
      sx = (img.width - sWidth) / 2;
      sy = 0;
    } else {
      sWidth = img.width;
      sHeight = img.width / targetRatio;
      sx = 0;
      sy = (img.height - sHeight) / 2;
    }
    ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, w, h);
  }

  // --- UI Control Event Listeners ---
  function setupControls() {
    // 1. Re-fog & Breath Button
    const refogBtn = document.getElementById('refogBtn');
    if (refogBtn) {
      refogBtn.addEventListener('click', () => applyFog(true));
    }

    // 2. Clear All Button
    const clearAllBtn = document.getElementById('clearAllBtn');
    if (clearAllBtn) {
      clearAllBtn.addEventListener('click', clearAllFog);
    }

    // 3. Trickle Rain Drop Button
    const trickleBtn = document.getElementById('trickleBtn');
    if (trickleBtn) {
      trickleBtn.addEventListener('click', spawnTrickle);
    }

    // 4. Rain BGM Button
    const rainBgmBtn = document.getElementById('rainBgmBtn');
    if (rainBgmBtn) {
      rainBgmBtn.addEventListener('click', toggleRainBgm);
    }

    // 5. Sound Squeak FX Toggle
    const soundFxBtn = document.getElementById('soundFxBtn');
    if (soundFxBtn) {
      soundFxBtn.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        soundFxBtn.classList.toggle('text-emerald-400', soundEnabled);
        soundFxBtn.classList.toggle('text-slate-500', !soundEnabled);
      });
    }

    // 6. Tools & Stamp Buttons
    document.querySelectorAll('[data-wiper-tool]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-wiper-tool]').forEach(b => {
          b.classList.remove('bg-sky-600', 'text-white', 'border-sky-400');
          b.classList.add('bg-slate-900', 'text-slate-300');
        });
        btn.classList.add('bg-sky-600', 'text-white', 'border-sky-400');
        btn.classList.remove('bg-slate-900', 'text-slate-300');

        currentTool = btn.dataset.wiperTool;
        if (TOOLS[currentTool]) {
          brushSize = TOOLS[currentTool].size;
          const slider = document.getElementById('brushSizeSlider');
          if (slider) slider.value = brushSize;
          const valEl = document.getElementById('brushSizeVal');
          if (valEl) valEl.innerText = `${brushSize}px`;
        }
      });
    });

    // 7. Brush Size Slider
    const brushSlider = document.getElementById('brushSizeSlider');
    if (brushSlider) {
      brushSlider.addEventListener('input', (e) => {
        brushSize = parseInt(e.target.value, 10);
        const valEl = document.getElementById('brushSizeVal');
        if (valEl) valEl.innerText = `${brushSize}px`;
      });
    }

    // 8. Fog Opacity Selectors
    document.querySelectorAll('[data-fog-density]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-fog-density]').forEach(b => {
          b.classList.remove('bg-slate-700', 'text-white');
          b.classList.add('bg-slate-800', 'text-slate-400');
        });
        btn.classList.add('bg-slate-700', 'text-white');
        btn.classList.remove('bg-slate-800', 'text-slate-400');

        fogOpacity = parseFloat(btn.dataset.fogDensity);
        applyFog(false);
      });
    });

    // 9. Custom Photo File Input
    const fileInput = document.getElementById('customPhotoInput');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          customImageUrl = event.target.result;
          renderThemeSelector();
          applyThemeBackground();
        };
        reader.readAsDataURL(file);
      });
    }

    // 10. Save Snapshot Button
    const saveBtn = document.getElementById('saveSnapshotBtn');
    if (saveBtn) {
      saveBtn.addEventListener('click', exportWindowSnapshot);
    }
  }

  function debounce(fn, ms) {
    let timer = null;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), ms);
    };
  }

})();
