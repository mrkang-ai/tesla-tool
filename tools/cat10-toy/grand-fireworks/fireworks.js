/**
 * Grand Fireworks Celebration Engine - 100 Tools Finale
 * Hyper-Realistic Acoustic Audio (Launch Whistle, Sub-Bass Mortar Boom, Brocade Crackles),
 * Multi-Pattern Rocket Physics (Willow, Chrysanthemum, Ring, Heart, Crackler),
 * Continuous Auto Festival Show & Grand Finale Barrage.
 */

(function () {
  'use strict';

  let canvas, ctx;
  let audioCtx = null;
  let masterGain = null;
  let isSoundEnabled = true;
  let masterVolume = 0.85;

  // Firework State
  const rockets = [];
  const particles = [];
  const stars = [];

  let isAutoShowActive = true;
  let autoShowTimer = null;
  let autoIntervalMs = 750; // default interval
  let isFinaleActive = false;

  // Color Palettes
  const PALETTES = [
    { name: 'gold', colors: ['#ffd700', '#f59e0b', '#fbbf24', '#fffbeb', '#fde68a'] },
    { name: 'ruby_violet', colors: ['#f43f5e', '#ec4899', '#a855f7', '#d946ef', '#ffffff'] },
    { name: 'ocean_emerald', colors: ['#38bdf8', '#06b6d4', '#10b981', '#34d399', '#e0f2fe'] },
    { name: 'rainbow', colors: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'] },
    { name: 'silver_blue', colors: ['#e2e8f0', '#93c5fd', '#60a5fa', '#38bdf8', '#ffffff'] }
  ];

  // Shell Patterns
  const SHELL_TYPES = ['chrysanthemum', 'willow', 'ring', 'heart', 'crackle'];

  document.addEventListener('DOMContentLoaded', initFireworksApp);

  function initFireworksApp() {
    canvas = document.getElementById('fireworksCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    initStars();
    setupEventListeners();
    setupAudioContext();
    startAutoShow();
    loop();
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // Background Twinkling Stars
  function initStars() {
    stars.length = 0;
    const count = Math.min(120, Math.floor((canvas.width * canvas.height) / 8000));
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * (canvas.height * 0.7),
        r: Math.random() * 1.4 + 0.4,
        alpha: Math.random() * 0.7 + 0.2,
        twinkleSpeed: Math.random() * 0.03 + 0.01
      });
    }
  }

  // --- Web Audio Acoustic Fireworks Sound Engine ---
  function setupAudioContext() {
    const unlock = () => {
      getAudioCtx();
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('touchstart', unlock);
    };
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('touchstart', unlock, { once: true });
  }

  function getAudioCtx() {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
        masterGain = audioCtx.createGain();
        masterGain.gain.setValueAtTime(masterVolume, audioCtx.currentTime);
        masterGain.connect(audioCtx.destination);
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // 1. Launch Rocket Whistle / Ascent ("쉬이이익---!")
  function playLaunchWhistle(duration = 0.55) {
    if (!isSoundEnabled) return;
    try {
      getAudioCtx();
      if (!audioCtx) return;
      const t = audioCtx.currentTime;

      // Pitch sweep rising upwards
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320 + Math.random() * 80, t);
      osc.frequency.exponentialRampToValueAtTime(1450 + Math.random() * 250, t + duration);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(750, t);
      filter.frequency.exponentialRampToValueAtTime(1800, t + duration);
      filter.Q.value = 4.2;

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.09 * masterVolume, t + duration * 0.6);
      gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      osc.start(t);
      osc.stop(t + duration + 0.05);
    } catch (_) {}
  }

  // 2. Realistic Explosive Boom ("펑! 콰아앙---!")
  function playRealisticBoom(shellType = 'chrysanthemum', intensity = 1.0) {
    if (!isSoundEnabled) return;
    try {
      getAudioCtx();
      if (!audioCtx) return;
      const t = audioCtx.currentTime;
      const sampleRate = audioCtx.sampleRate;

      // Duration of rolling echo
      const boomDur = shellType === 'willow' ? 1.6 : 1.35;

      // A. Explosive Crack & Atmospheric Rolling Noise
      const buffer = audioCtx.createBuffer(1, Math.floor(sampleRate * boomDur), sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < buffer.length; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      // Resonant Lowpass Sweep for the physical atmospheric roll
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      const initialCutoff = shellType === 'crackle' ? 2400 : 1800;
      filter.frequency.setValueAtTime(initialCutoff, t);
      filter.frequency.exponentialRampToValueAtTime(55, t + boomDur);
      filter.Q.value = 3.6;

      const noiseGain = audioCtx.createGain();
      const nVol = Math.min(1.0, 0.85 * intensity * masterVolume);
      noiseGain.gain.setValueAtTime(nVol, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + boomDur);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(masterGain);

      noise.start(t);
      noise.stop(t + boomDur);

      // B. Sub-Bass Chest Thump ("쿵-!")
      const sub = audioCtx.createOscillator();
      const subGain = audioCtx.createGain();
      sub.type = 'triangle';
      const subStart = 90 + Math.random() * 25;
      sub.frequency.setValueAtTime(subStart, t);
      sub.frequency.exponentialRampToValueAtTime(22, t + 0.65);

      const subVol = Math.min(1.0, 0.95 * intensity * masterVolume);
      subGain.gain.setValueAtTime(subVol, t);
      subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.72);

      sub.connect(subGain);
      subGain.connect(masterGain);

      sub.start(t);
      sub.stop(t + 0.75);

      // C. Secondary Sparkle Crackles ("타타타닥! 타닥!")
      const crackleCount = shellType === 'crackle' ? 24 : (shellType === 'willow' ? 14 : 7);
      for (let i = 0; i < crackleCount; i++) {
        const crackTime = t + 0.22 + Math.random() * 0.75;
        const crackOsc = audioCtx.createOscillator();
        const crackGain = audioCtx.createGain();
        crackOsc.type = 'triangle';
        crackOsc.frequency.setValueAtTime(1600 + Math.random() * 2200, crackTime);

        const cVol = (0.08 + Math.random() * 0.12) * masterVolume;
        crackGain.gain.setValueAtTime(cVol, crackTime);
        crackGain.gain.exponentialRampToValueAtTime(0.001, crackTime + 0.035);

        crackOsc.connect(crackGain);
        crackGain.connect(masterGain);
        crackOsc.start(crackTime);
        crackOsc.stop(crackTime + 0.04);
      }

    } catch (_) {}
  }

  // --- Particle & Physics System ---

  // Rising Rocket
  class Rocket {
    constructor(startX, startY, targetX, targetY, palette, shellType) {
      this.x = startX;
      this.y = startY;
      this.targetX = targetX;
      this.targetY = targetY;
      this.palette = palette;
      this.shellType = shellType;

      const dist = Math.hypot(targetX - startX, targetY - startY);
      const angle = Math.atan2(targetY - startY, targetX - startX);
      const speed = Math.min(17, Math.max(11, dist / 38));

      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.trail = [];
      this.alive = true;

      // Play ascent whistle
      const ascentTime = Math.max(0.3, dist / (speed * 60));
      playLaunchWhistle(ascentTime);
    }

    update() {
      this.trail.push({ x: this.x, y: this.y, alpha: 1.0 });
      if (this.trail.length > 8) this.trail.shift();

      this.x += this.vx;
      this.y += this.vy;

      // Reached apex or target altitude
      if (this.y <= this.targetY || (this.vy > 0 && this.y >= this.targetY)) {
        this.alive = false;
        explode(this.x, this.y, this.palette, this.shellType);
      }
    }

    draw() {
      // Draw tail trail
      ctx.save();
      for (let i = 0; i < this.trail.length; i++) {
        const t = this.trail[i];
        const ratio = i / this.trail.length;
        ctx.fillStyle = `rgba(255, 215, 0, ${ratio * 0.6})`;
        ctx.beginPath();
        ctx.arc(t.x, t.y, ratio * 2.2 + 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Glowing Rocket Head
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Exploded Firework Spark
  class SparkParticle {
    constructor(x, y, vx, vy, color, shellType) {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.color = color;
      this.shellType = shellType;

      this.life = 1.0;
      this.gravity = shellType === 'willow' ? 0.055 : 0.075;
      this.friction = shellType === 'willow' ? 0.965 : 0.94;
      this.decay = shellType === 'willow' ? 0.009 : (shellType === 'crackle' ? 0.022 : 0.014 + Math.random() * 0.008);
      this.radius = shellType === 'willow' ? 2.2 : (Math.random() * 2.5 + 1.8);
      this.flicker = Math.random() > 0.4;
      this.trail = [];
    }

    update() {
      if (this.trail.length < 5 && this.life > 0.4) {
        this.trail.push({ x: this.x, y: this.y, alpha: this.life });
      } else if (this.trail.length > 0) {
        this.trail.shift();
      }

      this.vx *= this.friction;
      this.vy *= this.friction;
      this.vy += this.gravity;

      this.x += this.vx;
      this.y += this.vy;
      this.life -= this.decay;
    }

    draw() {
      ctx.save();
      const alpha = Math.max(0, this.life);
      const isVisible = !this.flicker || Math.random() > 0.15;

      if (isVisible) {
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Subtle trails for willow
      if (this.shellType === 'willow' && this.trail.length > 1) {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        for (let i = 0; i < this.trail.length; i++) {
          const pt = this.trail[i];
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  // --- Explosion Generation ---
  function explode(x, y, palette, shellType) {
    playRealisticBoom(shellType, 1.0);

    const colors = palette.colors;
    const count = shellType === 'willow' ? 120 : (shellType === 'chrysanthemum' ? 100 : 80);

    if (shellType === 'ring') {
      // Ring / Saturn Donut Burst
      const ringRadiusSpeed = Math.random() * 3 + 5;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const vx = Math.cos(angle) * ringRadiusSpeed;
        const vy = Math.sin(angle) * ringRadiusSpeed;
        const col = colors[i % colors.length];
        particles.push(new SparkParticle(x, y, vx, vy, col, shellType));
      }
    } else if (shellType === 'heart') {
      // Romantic Heart Burst
      for (let i = 0; i < count; i++) {
        const t = (i / count) * Math.PI * 2;
        // Parametric heart formula
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        const speed = 0.42;
        const vx = hx * speed + (Math.random() - 0.5) * 0.6;
        const vy = hy * speed + (Math.random() - 0.5) * 0.6;
        const col = colors[i % colors.length];
        particles.push(new SparkParticle(x, y, vx, vy, col, shellType));
      }
    } else if (shellType === 'willow') {
      // Long Drooping Golden Willow
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6.5 + 1.5;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed - 1.2;
        const col = colors[Math.floor(Math.random() * colors.length)];
        particles.push(new SparkParticle(x, y, vx, vy, col, shellType));
      }
    } else {
      // Classic Chrysanthemum / Crackle Spherical Burst
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 7.5 + 2.0;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        const col = colors[Math.floor(Math.random() * colors.length)];
        particles.push(new SparkParticle(x, y, vx, vy, col, shellType));
      }
    }

    // Flash background illumination momentarily
    drawSkyFlash(x, y, colors[0]);
  }

  let flashAlpha = 0;
  let flashColor = '#ffd700';

  function drawSkyFlash(x, y, color) {
    flashAlpha = 0.16;
    flashColor = color;
  }

  // Launch a new firework rocket
  function launchFirework(targetX, targetY, options = {}) {
    const startX = options.startX !== undefined ? options.startX : canvas.width * 0.5 + (Math.random() - 0.5) * (canvas.width * 0.6);
    const startY = canvas.height + 10;

    const tX = targetX !== undefined ? targetX : Math.random() * (canvas.width * 0.75) + canvas.width * 0.12;
    const tY = targetY !== undefined ? targetY : Math.random() * (canvas.height * 0.45) + canvas.height * 0.12;

    const palette = options.palette || PALETTES[Math.floor(Math.random() * PALETTES.length)];
    const shellType = options.shellType || SHELL_TYPES[Math.floor(Math.random() * SHELL_TYPES.length)];

    rockets.push(new Rocket(startX, startY, tX, tY, palette, shellType));
  }

  // Grand Finale Barrage (100호 기념 대규모 연속 폭격)
  function triggerGrandFinale() {
    if (isFinaleActive) return;
    isFinaleActive = true;

    const finaleBtn = document.getElementById('finaleBtn');
    if (finaleBtn) {
      finaleBtn.classList.add('animate-bounce', 'ring-4', 'ring-amber-400');
      finaleBtn.disabled = true;
    }

    let launched = 0;
    const totalToLaunch = 32;

    const finaleInterval = setInterval(() => {
      const rx = Math.random() * (canvas.width * 0.8) + canvas.width * 0.1;
      const ry = Math.random() * (canvas.height * 0.5) + canvas.height * 0.1;
      launchFirework(rx, ry, {
        palette: PALETTES[Math.floor(Math.random() * PALETTES.length)],
        shellType: SHELL_TYPES[Math.floor(Math.random() * SHELL_TYPES.length)]
      });
      launched++;

      if (launched >= totalToLaunch) {
        clearInterval(finaleInterval);
        setTimeout(() => {
          isFinaleActive = false;
          if (finaleBtn) {
            finaleBtn.classList.remove('animate-bounce', 'ring-4', 'ring-amber-400');
            finaleBtn.disabled = false;
          }
        }, 3000);
      }
    }, 130);
  }

  // --- Auto Show Management ---
  function startAutoShow() {
    stopAutoShow();
    isAutoShowActive = true;
    autoShowTimer = setInterval(() => {
      if (!isFinaleActive) {
        launchFirework();
      }
    }, autoIntervalMs);

    const toggleBtn = document.getElementById('autoShowToggleBtn');
    if (toggleBtn) {
      toggleBtn.classList.add('bg-amber-600', 'text-white', 'border-amber-400');
      toggleBtn.classList.remove('bg-slate-800', 'text-slate-300');
      toggleBtn.innerHTML = '<i class="fa-solid fa-play"></i><span>자동 쇼 ON</span>';
    }
  }

  function stopAutoShow() {
    isAutoShowActive = false;
    if (autoShowTimer) {
      clearInterval(autoShowTimer);
      autoShowTimer = null;
    }
    const toggleBtn = document.getElementById('autoShowToggleBtn');
    if (toggleBtn) {
      toggleBtn.classList.remove('bg-amber-600', 'text-white', 'border-amber-400');
      toggleBtn.classList.add('bg-slate-800', 'text-slate-300');
      toggleBtn.innerHTML = '<i class="fa-solid fa-pause"></i><span>자동 쇼 일시정지</span>';
    }
  }

  function toggleAutoShow() {
    if (isAutoShowActive) stopAutoShow();
    else startAutoShow();
  }

  // --- Main Animation Loop ---
  function loop() {
    // Dark sky with light trail fade
    ctx.fillStyle = 'rgba(5, 7, 18, 0.22)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Sky Flash
    if (flashAlpha > 0.005) {
      ctx.fillStyle = flashColor;
      ctx.globalAlpha = flashAlpha;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1.0;
      flashAlpha *= 0.82;
    }

    // Twinkling background stars
    drawStars();

    // Update and draw rockets
    for (let i = rockets.length - 1; i >= 0; i--) {
      const r = rockets[i];
      r.update();
      r.draw();
      if (!r.alive) rockets.splice(i, 1);
    }

    // Update and draw explosion particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw();
      if (p.life <= 0) particles.splice(i, 1);
    }

    requestAnimationFrame(loop);
  }

  function drawStars() {
    ctx.save();
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      s.alpha += Math.sin(Date.now() * s.twinkleSpeed) * 0.01;
      const a = Math.max(0.1, Math.min(0.85, s.alpha));
      ctx.fillStyle = `rgba(255, 255, 255, ${a})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // --- UI Event Listeners ---
  function setupEventListeners() {
    // Canvas Click / Tap to Launch at Cursor
    if (canvas) {
      canvas.addEventListener('pointerdown', (e) => {
        // Prevent click if clicking on top banner / buttons
        if (e.target.closest('#controlPanel') || e.target.closest('a')) return;
        launchFirework(e.clientX, e.clientY);
      });
    }

    // Grand Finale Button
    const finaleBtn = document.getElementById('finaleBtn');
    if (finaleBtn) {
      finaleBtn.addEventListener('click', triggerGrandFinale);
    }

    // Auto Show Toggle
    const autoShowBtn = document.getElementById('autoShowToggleBtn');
    if (autoShowBtn) {
      autoShowBtn.addEventListener('click', toggleAutoShow);
    }

    // Sound Toggle
    const soundToggleBtn = document.getElementById('soundToggleBtn');
    if (soundToggleBtn) {
      soundToggleBtn.addEventListener('click', () => {
        isSoundEnabled = !isSoundEnabled;
        soundToggleBtn.classList.toggle('text-emerald-400', isSoundEnabled);
        soundToggleBtn.classList.toggle('text-slate-500', !isSoundEnabled);
      });
    }

    // Auto Show Speed Buttons
    document.querySelectorAll('[data-show-speed]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-show-speed]').forEach(b => {
          b.classList.remove('bg-amber-600', 'text-white');
          b.classList.add('bg-slate-800', 'text-slate-300');
        });
        btn.classList.add('bg-amber-600', 'text-white');
        btn.classList.remove('bg-slate-800', 'text-slate-300');

        autoIntervalMs = parseInt(btn.dataset.showSpeed, 10);
        if (isAutoShowActive) {
          startAutoShow(); // restart interval
        }
      });
    });

    // Volume Slider
    const volSlider = document.getElementById('fireworksVol');
    if (volSlider) {
      volSlider.addEventListener('input', (e) => {
        masterVolume = parseFloat(e.target.value) / 100;
        if (masterGain && audioCtx) {
          masterGain.gain.setValueAtTime(masterVolume, audioCtx.currentTime);
        }
      });
    }
  }

})();
