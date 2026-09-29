// Realistic Bubble Wrap ASMR Sound & Visual Engine
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('bubbleGrid');
  const counter = document.getElementById('popCounter');
  const comboDisplay = document.getElementById('comboDisplay');
  const stressDisplay = document.getElementById('stressDisplay');
  const resetBtn = document.getElementById('resetBubblesBtn');
  const popAllBtn = document.getElementById('popAllBtn');
  const volumeSlider = document.getElementById('volumeSlider');
  const muteBtn = document.getElementById('muteBtn');
  const dragToggle = document.getElementById('dragToggle');
  const board = document.getElementById('bubbleBoard');

  // Audio Context & Nodes
  let audioCtx = null;
  let masterGain = null;
  let isMuted = false;
  let volume = 0.8;

  // Options
  let currentTheme = 'classic'; // classic, neon, candy, pink
  let currentSoundMode = 'real'; // real, crystal, squeak
  let currentSize = 'standard'; // mini (84), standard (54), jumbo (24)
  let isDragEnabled = true;

  // State
  let poppedCount = 0;
  let comboCount = 0;
  let comboTimeout = null;
  let isPointerDown = false;
  let totalInSheet = 54;
  let poppedInSheet = 0;

  // Candy pastel colors palette
  const candyColors = [
    { base: 'rgba(244, 114, 182, 0.65)', dark: 'rgba(190, 24, 93, 0.75)' }, // Pink
    { base: 'rgba(56, 189, 248, 0.65)', dark: 'rgba(3, 105, 161, 0.75)' },  // Sky
    { base: 'rgba(74, 222, 128, 0.65)', dark: 'rgba(21, 128, 61, 0.75)' },  // Green
    { base: 'rgba(250, 204, 21, 0.65)', dark: 'rgba(161, 98, 7, 0.75)' },   // Yellow
    { base: 'rgba(192, 132, 252, 0.65)', dark: 'rgba(109, 40, 217, 0.75)' }, // Purple
    { base: 'rgba(251, 146, 60, 0.65)', dark: 'rgba(194, 65, 12, 0.75)' }   // Orange
  ];

  // Initialize Web Audio
  function initAudio() {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioCtxClass();
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(isMuted ? 0 : volume, audioCtx.currentTime);
      masterGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Pre-generate noise buffer for tactile plastic snap
  let ruptureNoiseBuffer = null;
  function getNoiseBuffer() {
    if (!audioCtx) initAudio();
    if (!ruptureNoiseBuffer && audioCtx) {
      const bufLen = Math.floor(audioCtx.sampleRate * 0.05); // 50ms
      ruptureNoiseBuffer = audioCtx.createBuffer(1, bufLen, audioCtx.sampleRate);
      const data = ruptureNoiseBuffer.getChannelData(0);
      for (let i = 0; i < bufLen; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufLen * 0.22));
      }
    }
    return ruptureNoiseBuffer;
  }

  // Realistic Acoustic Bubble Wrap Pop Synthesis
  function playRealPop(pitchMultiplier = 1.0) {
    initAudio();
    if (!audioCtx || isMuted) return;

    const now = audioCtx.currentTime;

    // Acoustic parameters tuned to air-filled polyethylene capsules
    let snapFreq = 2900;
    let cavityStart = 640;
    let duration = 0.046;
    let thumpFreq = 135;

    if (currentSize === 'mini') {
      snapFreq = 4100;
      cavityStart = 830;
      duration = 0.034;
      thumpFreq = 180;
    } else if (currentSize === 'jumbo') {
      snapFreq = 1950;
      cavityStart = 440;
      duration = 0.068;
      thumpFreq = 90;
    }

    // Micro pitch variation (±9%)
    const pitch = pitchMultiplier * (0.92 + Math.random() * 0.16);
    const dur = duration * (0.9 + Math.random() * 0.2);

    // Layer 1: Plastic rupture snap (Noise impulse via Bandpass)
    const noiseBuf = getNoiseBuffer();
    if (noiseBuf) {
      const noiseSrc = audioCtx.createBufferSource();
      noiseSrc.buffer = noiseBuf;

      const snapFilter = audioCtx.createBiquadFilter();
      snapFilter.type = 'bandpass';
      snapFilter.frequency.setValueAtTime(snapFreq * pitch, now);
      snapFilter.Q.setValueAtTime(3.4, now);

      const snapGain = audioCtx.createGain();
      snapGain.gain.setValueAtTime(0.85, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + dur * 0.45);

      noiseSrc.connect(snapFilter);
      snapFilter.connect(snapGain);
      snapGain.connect(masterGain);
      noiseSrc.start(now);
      noiseSrc.stop(now + dur * 0.5);
    }

    // Layer 2: Air cavity decompression ("뽁" / "퐁" resonant body)
    const cavityOsc = audioCtx.createOscillator();
    const cavityGain = audioCtx.createGain();
    cavityOsc.type = 'triangle';

    const startF = cavityStart * pitch;
    const endF = Math.max(45, startF * 0.24);
    cavityOsc.frequency.setValueAtTime(startF, now);
    cavityOsc.frequency.exponentialRampToValueAtTime(endF, now + dur);

    cavityGain.gain.setValueAtTime(0.72, now);
    cavityGain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    cavityOsc.connect(cavityGain);
    cavityGain.connect(masterGain);
    cavityOsc.start(now);
    cavityOsc.stop(now + dur + 0.01);

    // Layer 3: Physical sub-bass displacement thump ("퍽" punch)
    const thumpOsc = audioCtx.createOscillator();
    const thumpGain = audioCtx.createGain();
    thumpOsc.type = 'sine';
    thumpOsc.frequency.setValueAtTime(thumpFreq * pitch, now);
    thumpOsc.frequency.exponentialRampToValueAtTime(28, now + dur * 0.75);

    thumpGain.gain.setValueAtTime(0.55, now);
    thumpGain.gain.exponentialRampToValueAtTime(0.001, now + dur * 0.75);

    thumpOsc.connect(thumpGain);
    thumpGain.connect(masterGain);
    thumpOsc.start(now);
    thumpOsc.stop(now + dur * 0.8);

    // Natural 4% chance of double-snap
    if (Math.random() < 0.04) {
      setTimeout(() => {
        playRealPop(pitchMultiplier * 1.18);
      }, 16);
    }
  }

  // Crystal Pop (Clear, musical waterdrop pop)
  function playCrystalPop(pitchMultiplier = 1.0) {
    initAudio();
    if (!audioCtx || isMuted) return;

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    let baseFreq = currentSize === 'mini' ? 1200 : (currentSize === 'jumbo' ? 620 : 880);
    baseFreq *= pitchMultiplier * (0.94 + Math.random() * 0.12);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq * 0.65, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.4, now + 0.02);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.85, now + 0.07);

    gain.gain.setValueAtTime(0.65, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);

    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  // Squeak Toy Pop (Rubber squeak ASMR)
  function playSqueakPop(pitchMultiplier = 1.0) {
    initAudio();
    if (!audioCtx || isMuted) return;

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    let baseFreq = currentSize === 'mini' ? 1450 : (currentSize === 'jumbo' ? 750 : 1050);
    baseFreq *= pitchMultiplier * (0.95 + Math.random() * 0.1);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.8, now + 0.03);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.95, now + 0.065);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(now);
    osc.stop(now + 0.075);
  }

  function playPop(pitchMultiplier = 1.0) {
    if (currentSoundMode === 'crystal') playCrystalPop(pitchMultiplier);
    else if (currentSoundMode === 'squeak') playSqueakPop(pitchMultiplier);
    else playRealPop(pitchMultiplier);
  }

  // Haptic feedback for mobile devices
  function triggerHaptic() {
    try {
      if (navigator.vibrate) {
        navigator.vibrate(currentSize === 'jumbo' ? 22 : 12);
      }
    } catch (e) {}
  }

  // Visual Burst Ripple Effect
  function createBurstRipple(bubble) {
    const ring = document.createElement('div');
    ring.className = 'pop-sparkle-ring';
    bubble.appendChild(ring);
    setTimeout(() => ring.remove(), 300);
  }

  // Pop a single bubble
  function popBubble(bubble) {
    if (!bubble || bubble.classList.contains('bubble-popped')) return;

    bubble.classList.add('bubble-popped');
    poppedCount++;
    poppedInSheet++;
    counter.innerText = poppedCount.toLocaleString();

    // Combo system
    comboCount++;
    if (comboDisplay) {
      comboDisplay.innerText = comboCount > 1 ? `🔥 ${comboCount} COMBO!` : '';
      comboDisplay.classList.remove('opacity-0', 'scale-90');
      comboDisplay.classList.add('opacity-100', 'scale-105');
    }

    clearTimeout(comboTimeout);
    comboTimeout = setTimeout(() => {
      comboCount = 0;
      if (comboDisplay) {
        comboDisplay.classList.add('opacity-0', 'scale-90');
        comboDisplay.classList.remove('opacity-100', 'scale-105');
      }
    }, 750);

    // Stress relief calculation
    if (stressDisplay) {
      const relieved = Math.min(100, Math.floor(poppedCount * 0.6));
      stressDisplay.innerText = `-${relieved}%`;
    }

    // Sound with combo pitch rise
    const pitchBonus = Math.min(0.4, comboCount * 0.015);
    playPop(1.0 + pitchBonus);
    triggerHaptic();
    createBurstRipple(bubble);

    // Check if entire sheet is popped
    if (poppedInSheet >= totalInSheet) {
      setTimeout(() => {
        showSheetCompleteBanner();
      }, 250);
    }
  }

  function showSheetCompleteBanner() {
    if (comboDisplay) {
      comboDisplay.innerText = '🎊 뽁뽁이 완판! 올 클리어! 🎊';
      comboDisplay.classList.remove('opacity-0');
      comboDisplay.classList.add('opacity-100', 'text-yellow-300');
    }
    // Auto refill after 1.2s if user keeps going
    setTimeout(() => {
      createBubbles();
    }, 1200);
  }

  // Create Bubbles according to size and theme
  function createBubbles() {
    grid.innerHTML = '';
    poppedInSheet = 0;

    let cols = 'grid-cols-6 sm:grid-cols-9';
    let bubbleSizeClass = 'w-11 h-11 sm:w-13 sm:h-13';
    let count = 54;

    if (currentSize === 'mini') {
      cols = 'grid-cols-7 sm:grid-cols-12';
      bubbleSizeClass = 'w-8 h-8 sm:w-9 sm:h-9';
      count = 84;
    } else if (currentSize === 'jumbo') {
      cols = 'grid-cols-4 sm:grid-cols-6';
      bubbleSizeClass = 'w-16 h-16 sm:w-20 sm:h-20';
      count = 24;
    }

    totalInSheet = count;
    grid.className = `grid ${cols} gap-2.5 sm:gap-3.5 justify-items-center items-center py-2`;

    // Apply board theme class
    board.className = `bubble-board w-full rounded-3xl p-5 sm:p-7 shadow-2xl theme-${currentTheme}`;

    for (let i = 0; i < count; i++) {
      const bubble = document.createElement('div');
      bubble.className = `bubble-item ${bubbleSizeClass}`;
      bubble.setAttribute('role', 'button');
      bubble.setAttribute('aria-label', '뽁뽁이 에어캡');

      // Theme candy specific inline styling
      if (currentTheme === 'candy') {
        const c = candyColors[i % candyColors.length];
        bubble.style.background = `radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.95) 0%, ${c.base} 35%, ${c.dark} 100%)`;
      }

      // Pointer event handlers
      bubble.addEventListener('pointerdown', (e) => {
        initAudio();
        popBubble(bubble);
      });

      bubble.addEventListener('click', (e) => {
        initAudio();
        popBubble(bubble);
      });

      bubble.addEventListener('pointerenter', (e) => {
        if (isPointerDown && isDragEnabled) {
          popBubble(bubble);
        }
      });

      grid.appendChild(bubble);
    }
  }

  // Global Pointer Drag Support
  window.addEventListener('pointerdown', (e) => {
    isPointerDown = true;
  });

  window.addEventListener('pointerup', () => {
    isPointerDown = false;
  });

  window.addEventListener('pointercancel', () => {
    isPointerDown = false;
  });

  // Touch move drag detection across elements
  grid.addEventListener('touchmove', (e) => {
    if (!isDragEnabled) return;
    const touch = e.touches[0];
    if (!touch) return;
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const bubble = el ? el.closest('.bubble-item') : null;
    if (bubble && !bubble.classList.contains('bubble-popped')) {
      popBubble(bubble);
    }
  }, { passive: true });

  // Pop all bubbles in sequence
  function popAllBubbles() {
    initAudio();
    const unpopped = Array.from(grid.querySelectorAll('.bubble-item:not(.bubble-popped)'));
    if (unpopped.length === 0) {
      createBubbles();
      return;
    }
    unpopped.forEach((bubble, idx) => {
      setTimeout(() => {
        popBubble(bubble);
      }, idx * 25);
    });
  }

  // Reset sheet button
  resetBtn.addEventListener('click', () => {
    createBubbles();
  });

  // Pop all button
  if (popAllBtn) {
    popAllBtn.addEventListener('click', () => {
      popAllBubbles();
    });
  }

  // Volume slider & mute
  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      volume = parseFloat(e.target.value);
      if (masterGain && !isMuted) {
        masterGain.gain.setValueAtTime(volume, audioCtx.currentTime);
      }
    });
  }

  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      if (masterGain) {
        masterGain.gain.setValueAtTime(isMuted ? 0 : volume, audioCtx.currentTime);
      }
      muteBtn.innerHTML = isMuted 
        ? '<i class="fa-solid fa-volume-xmark text-rose-400"></i>' 
        : '<i class="fa-solid fa-volume-high text-cyan-300"></i>';
    });
  }

  // Drag mode toggle
  if (dragToggle) {
    dragToggle.addEventListener('click', () => {
      isDragEnabled = !isDragEnabled;
      dragToggle.classList.toggle('bg-cyan-600', isDragEnabled);
      dragToggle.classList.toggle('text-white', isDragEnabled);
      dragToggle.classList.toggle('bg-slate-800', !isDragEnabled);
      dragToggle.classList.toggle('text-slate-400', !isDragEnabled);
    });
  }

  // Theme selector buttons
  const themeBtns = document.querySelectorAll('[data-bubble-theme]');
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      themeBtns.forEach(b => b.classList.remove('ring-2', 'ring-cyan-400', 'bg-slate-700'));
      btn.classList.add('ring-2', 'ring-cyan-400', 'bg-slate-700');
      currentTheme = btn.getAttribute('data-bubble-theme');
      createBubbles();
    });
  });

  // Sound mode selector buttons
  const soundBtns = document.querySelectorAll('[data-sound-mode]');
  soundBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      soundBtns.forEach(b => b.classList.remove('bg-cyan-600', 'text-white'));
      soundBtns.forEach(b => b.classList.add('bg-slate-800', 'text-slate-300'));
      btn.classList.remove('bg-slate-800', 'text-slate-300');
      btn.classList.add('bg-cyan-600', 'text-white');
      currentSoundMode = btn.getAttribute('data-sound-mode');
      playPop(1.0);
    });
  });

  // Size selector buttons
  const sizeBtns = document.querySelectorAll('[data-bubble-size]');
  sizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sizeBtns.forEach(b => b.classList.remove('bg-cyan-600', 'text-white'));
      sizeBtns.forEach(b => b.classList.add('bg-slate-800', 'text-slate-300'));
      btn.classList.remove('bg-slate-800', 'text-slate-300');
      btn.classList.add('bg-cyan-600', 'text-white');
      currentSize = btn.getAttribute('data-bubble-size');
      createBubbles();
    });
  });

  // Initialize
  createBubbles();
});
