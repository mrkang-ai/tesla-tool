/**
 * Invisible Cow Audio Game Engine
 * Authentic Real Cow Mooing with Distance-based Urgency, Mobile Touch & Haptics
 */

(function () {
  'use strict';

  // Game Configuration & State
  let audioCtx = null;
  let cowBuffer = null;
  let isAudioLoading = false;

  let isPlaying = false;
  let cowX = 0;
  let cowY = 0;
  let lastMooTime = 0;
  let currentCloseness = 0;
  let currentDist = 9999;
  let currentPointerX = -1;
  let currentPointerY = -1;

  let gameStartTime = 0;
  let timerInterval = null;
  let clickCount = 0;
  let currentDifficulty = 'normal'; // 'easy' (60px), 'normal' (40px), 'hard' (25px)
  let soundMode = 'cow'; // 'cow' (리얼 암소), 'moo_short' (숏 펀치)
  let masterVolume = 0.85;

  const DIFFICULTY_SETTINGS = {
    easy: { radius: 65, label: '쉬움 (반경 65px)', hintMultiplier: 1.15 },
    normal: { radius: 42, label: '보통 (반경 42px)', hintMultiplier: 1.0 },
    hard: { radius: 25, label: '어려움 (반경 25px)', hintMultiplier: 0.85 }
  };

  // DOM Elements
  let arena, radarText, tempBar, tempFill, foundCow, startBtn, arenaOverlay;
  let timerDisplay, clicksDisplay, bestTimeDisplay;
  let victoryModal, victoryTime, victoryClicks, victoryRank, nextRoundBtn;
  let volSlider, volValText, diffSelect;

  document.addEventListener('DOMContentLoaded', initGame);

  function initGame() {
    arena = document.getElementById('cowArena');
    radarText = document.getElementById('soundRadar');
    tempBar = document.getElementById('tempBar');
    tempFill = document.getElementById('tempFill');
    foundCow = document.getElementById('foundCow');
    startBtn = document.getElementById('startCowBtn');
    arenaOverlay = document.getElementById('arenaOverlay');

    timerDisplay = document.getElementById('cowTimer');
    clicksDisplay = document.getElementById('cowClicks');
    bestTimeDisplay = document.getElementById('cowBestTime');

    victoryModal = document.getElementById('victoryModal');
    victoryTime = document.getElementById('victoryTime');
    victoryClicks = document.getElementById('victoryClicks');
    victoryRank = document.getElementById('victoryRank');
    nextRoundBtn = document.getElementById('nextRoundBtn');

    volSlider = document.getElementById('cowVolSlider');
    volValText = document.getElementById('cowVolVal');
    diffSelect = document.getElementById('cowDiffSelect');

    loadBestScore();
    setupEventListeners();

    // Proactively preload audio data
    preloadAudio();
  }

  // Audio Context & Buffer Loader
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

  async function preloadAudio() {
    if (cowBuffer || isAudioLoading) return;
    isAudioLoading = true;
    try {
      getAudioCtx();
      let arrayBuf = null;

      // 1. Try embedded Base64 data URI (0ms latency, 100% offline)
      if (window.COW_AUDIO_DATA && window.COW_AUDIO_DATA.cow) {
        const b64 = window.COW_AUDIO_DATA.cow.split(',')[1];
        const binary = atob(b64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        arrayBuf = bytes.buffer;
      } else {
        // 2. Fallback to local sounds directory
        const res = await fetch('./sounds/cow.mp3');
        arrayBuf = await res.arrayBuffer();
      }

      if (arrayBuf && audioCtx) {
        const decoded = await audioCtx.decodeAudioData(arrayBuf);
        cowBuffer = trimBufferLeadingSilence(audioCtx, decoded);
      }
    } catch (err) {
      console.warn('[InvisibleCow] Audio load note:', err);
    } finally {
      isAudioLoading = false;
    }
  }

  // Remove leading silence to make audio attack immediate
  function trimBufferLeadingSilence(ctx, buf) {
    const ch = buf.getChannelData(0);
    let start = 0;
    const threshold = 0.015;
    for (let i = 0; i < ch.length; i++) {
      if (Math.abs(ch[i]) > threshold) {
        start = Math.max(0, i - Math.floor(buf.sampleRate * 0.01));
        break;
      }
    }
    if (start === 0) return buf;
    const trimmed = ctx.createBuffer(buf.numberOfChannels, buf.length - start, buf.sampleRate);
    for (let c = 0; c < buf.numberOfChannels; c++) {
      trimmed.getChannelData(c).set(buf.getChannelData(c).subarray(start));
    }
    return trimmed;
  }

  // Play proximity cow moo with dynamic pitch, volume, and envelope
  function playProximityMoo(closeness) {
    try {
      getAudioCtx();
      if (!audioCtx) return;

      const now = audioCtx.currentTime;

      // If buffer is ready, play real cow sample!
      if (cowBuffer) {
        const src = audioCtx.createBufferSource();
        const gain = audioCtx.createGain();
        src.buffer = cowBuffer;

        // Pitch modulation: 0.82 (distant relaxed cow) -> 1.42 (urgent high-pitched cow)
        const rate = 0.82 + closeness * 0.60;
        src.playbackRate.setValueAtTime(rate, now);

        // Volume: gentle whisper (0.15) -> loud resounding moo (1.0) * masterVolume
        const vol = (0.16 + Math.pow(closeness, 1.2) * 0.84) * masterVolume;
        
        // Duration: far cries linger slightly (0.55s), near cries are punchy & fast (0.24s)
        const dur = Math.max(0.22, 0.52 - closeness * 0.28);

        gain.gain.setValueAtTime(vol, now);
        // Smooth exponential fade-out to prevent clicks
        gain.gain.setValueAtTime(vol, now + dur * 0.65);
        gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

        src.connect(gain);
        gain.connect(audioCtx.destination);

        src.start(now);
        src.stop(now + dur + 0.05);
      } else {
        // Fallback procedural acoustic formant cow synthesizer if buffer is loading
        playProceduralCowMoo(closeness, now);
      }

      // Haptic feedback on mobile when close
      if (closeness > 0.80 && navigator.vibrate) {
        try {
          const vibeDur = closeness > 0.95 ? 45 : 25;
          navigator.vibrate(vibeDur);
        } catch (_) {}
      }

      // Visual Radar Ping Ripple at cursor/touch
      spawnRadarRipple(currentPointerX, currentPointerY, closeness);

    } catch (e) {
      console.warn('[InvisibleCow] playProximityMoo error:', e);
    }
  }

  // Procedural acoustic fallback with vowel-like dual resonance
  function playProceduralCowMoo(closeness, t) {
    const baseFreq = 95 + closeness * 90;
    const osc = audioCtx.createOscillator();
    const filter = audioCtx.createBiquadFilter();
    const gain = audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(baseFreq, t);
    osc.frequency.linearRampToValueAtTime(baseFreq * 0.9, t + 0.3);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450 + closeness * 200, t);
    filter.Q.value = 3.5;

    const vol = (0.2 + closeness * 0.6) * masterVolume;
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(t);
    osc.stop(t + 0.36);
  }

  // Victory Sound: Glorious Triumphant Cow Moo + Major Fanfare Chords
  function playVictorySound() {
    try {
      getAudioCtx();
      if (!audioCtx) return;

      const now = audioCtx.currentTime;

      // 1. Full 2-second real cow moo at 100% volume
      if (cowBuffer) {
        const cowSrc = audioCtx.createBufferSource();
        const cowGain = audioCtx.createGain();
        cowSrc.buffer = cowBuffer;
        cowSrc.playbackRate.setValueAtTime(1.05, now);

        const vol = Math.min(1.0, masterVolume * 1.15);
        cowGain.gain.setValueAtTime(vol, now);
        cowGain.gain.setValueAtTime(vol, now + 1.4);
        cowGain.gain.exponentialRampToValueAtTime(0.001, now + 1.9);

        cowSrc.connect(cowGain);
        cowGain.connect(audioCtx.destination);
        cowSrc.start(now);
      }

      // 2. Celebratory Major Arpeggio Fanfare (C5 -> E5 -> G5 -> C6)
      const chord = [523.25, 659.25, 783.99, 1046.50];
      chord.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const chordGain = audioCtx.createGain();

        const noteTime = now + 0.12 + idx * 0.10;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);

        chordGain.gain.setValueAtTime(0.28 * masterVolume, noteTime);
        chordGain.gain.exponentialRampToValueAtTime(0.001, noteTime + 1.4);

        osc.connect(chordGain);
        chordGain.connect(audioCtx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 1.5);
      });

      // 3. Victory Shimmer / Chime
      const chime = audioCtx.createOscillator();
      const chimeGain = audioCtx.createGain();
      chime.type = 'sine';
      chime.frequency.setValueAtTime(1567.98, now + 0.45); // G6
      chimeGain.gain.setValueAtTime(0.18 * masterVolume, now + 0.45);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
      chime.connect(chimeGain);
      chimeGain.connect(audioCtx.destination);
      chime.start(now + 0.45);
      chime.stop(now + 1.85);

    } catch (e) {
      console.warn('[InvisibleCow] Victory audio error:', e);
    }
  }

  // Visual Radar Ripple Effect
  function spawnRadarRipple(x, y, closeness) {
    if (!arena || x < 0 || y < 0) return;
    const ripple = document.createElement('div');
    ripple.className = 'cow-radar-ripple pointer-events-none absolute rounded-full border-2 transition-all';
    
    // Choose color based on closeness
    let borderColor = 'rgba(56, 189, 248, 0.55)'; // Sky blue
    let glowColor = 'rgba(56, 189, 248, 0.25)';
    if (closeness > 0.85) {
      borderColor = 'rgba(239, 68, 68, 0.85)'; // Red hot
      glowColor = 'rgba(239, 68, 68, 0.4)';
    } else if (closeness > 0.65) {
      borderColor = 'rgba(249, 115, 22, 0.75)'; // Orange
      glowColor = 'rgba(249, 115, 22, 0.3)';
    } else if (closeness > 0.40) {
      borderColor = 'rgba(234, 179, 8, 0.65)'; // Amber
      glowColor = 'rgba(234, 179, 8, 0.25)';
    }

    const startSize = 20;
    const endSize = 100 + closeness * 80;

    ripple.style.width = `${startSize}px`;
    ripple.style.height = `${startSize}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.transform = 'translate(-50%, -50%) scale(0.5)';
    ripple.style.borderColor = borderColor;
    ripple.style.boxShadow = `0 0 15px ${glowColor}`;
    ripple.style.opacity = '0.9';

    arena.appendChild(ripple);

    // Animate expand and fade
    requestAnimationFrame(() => {
      ripple.style.transition = 'transform 0.45s ease-out, opacity 0.45s ease-out';
      ripple.style.transform = `translate(-50%, -50%) scale(${endSize / startSize})`;
      ripple.style.opacity = '0';
    });

    setTimeout(() => {
      if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
    }, 480);
  }

  // Confetti Particle Explosion
  function fireConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#10b981', '#38bdf8', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444', '#facc15'];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 80,
        y: canvas.height * 0.45,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.8) * 15 - 4,
        size: Math.random() * 8 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        gravity: 0.35,
        opacity: 1
      });
    }

    let frame = 0;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach(p => {
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        p.opacity -= 0.012;

        if (p.opacity > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
        }
      });

      frame++;
      if (alive && frame < 120) {
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    requestAnimationFrame(animate);
  }

  // Spawn Cow randomly in the arena
  function spawnCow() {
    const rect = arena.getBoundingClientRect();
    const margin = 45;
    const maxX = Math.max(margin * 2, rect.width - margin);
    const maxY = Math.max(margin * 2, rect.height - margin);

    cowX = Math.floor(margin + Math.random() * (maxX - margin * 2));
    cowY = Math.floor(margin + Math.random() * (maxY - margin * 2));

    if (foundCow) {
      foundCow.classList.add('hidden');
      foundCow.classList.remove('cow-found-anim');
      foundCow.style.opacity = '0';
    }

    currentCloseness = 0;
    currentDist = 9999;
    clickCount = 0;
    updateClicksUI();

    if (radarText) {
      radarText.innerHTML = '<span class="text-slate-400">화면 위를 터치하거나 마우스를 움직여 <span class="text-emerald-400 font-bold">"음메~"</span> 소리를 따라가세요!</span>';
    }
    if (tempFill) {
      tempFill.style.width = '0%';
      tempFill.className = 'h-full transition-all duration-150 rounded-full bg-slate-700';
    }

    startTimer();
  }

  // Timer Management
  function startTimer() {
    clearInterval(timerInterval);
    gameStartTime = Date.now();
    updateTimerUI();
    timerInterval = setInterval(updateTimerUI, 100);
  }

  function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  function updateTimerUI() {
    if (!timerDisplay) return;
    const elapsed = (Date.now() - gameStartTime) / 1000;
    timerDisplay.innerText = `${elapsed.toFixed(1)}s`;
  }

  function updateClicksUI() {
    if (clicksDisplay) {
      clicksDisplay.innerText = `${clickCount}회`;
    }
  }

  function loadBestScore() {
    const best = localStorage.getItem('invisible_cow_best_time');
    if (bestTimeDisplay) {
      bestTimeDisplay.innerText = best ? `${parseFloat(best).toFixed(1)}s` : '--.-s';
    }
  }

  function saveBestScore(seconds) {
    const prev = localStorage.getItem('invisible_cow_best_time');
    if (!prev || seconds < parseFloat(prev)) {
      localStorage.setItem('invisible_cow_best_time', seconds.toString());
      loadBestScore();
      return true;
    }
    return false;
  }

  // Start / Restart Game
  async function startGame() {
    getAudioCtx();
    await preloadAudio();

    isPlaying = true;
    if (arenaOverlay) {
      arenaOverlay.classList.add('hidden');
    }
    if (startBtn) {
      startBtn.innerHTML = '<i class="fa-solid fa-rotate-right mr-1.5"></i>새 게임 시작 (소 위치 재배치)';
      startBtn.classList.replace('bg-emerald-600', 'bg-slate-700');
      startBtn.classList.replace('hover:bg-emerald-500', 'hover:bg-slate-600');
    }

    spawnCow();
  }

  // Pointer & Touch Move Tracking
  function handlePointerMove(clientX, clientY) {
    if (!isPlaying || !arena) return;

    const rect = arena.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, clientY - rect.top));

    currentPointerX = x;
    currentPointerY = y;

    const dist = Math.hypot(x - cowX, y - cowY);
    currentDist = dist;

    const maxDist = Math.hypot(rect.width, rect.height) * (DIFFICULTY_SETTINGS[currentDifficulty]?.hintMultiplier || 1.0);
    // Non-linear closeness curve: rewards getting closer with rapid rise
    const linearRatio = Math.max(0, 1 - (dist / maxDist));
    const closeness = Math.pow(linearRatio, 1.25);
    currentCloseness = closeness;

    // Update Radar Temperature Bar & Text
    updateRadarUI(closeness, dist);

    // Audio Frequency Interval Calculation
    // Far: 1100ms interval -> Hot: 150ms interval
    const interval = Math.max(140, Math.min(1150, 1150 - closeness * 1000));
    const now = Date.now();

    if (now - lastMooTime >= interval) {
      lastMooTime = now;
      playProximityMoo(closeness);
    }
  }

  // Update UI Elements with Status Feedback
  function updateRadarUI(closeness, dist) {
    if (!radarText) return;

    let msg = '';
    let barColor = 'bg-sky-500';

    if (dist < DIFFICULTY_SETTINGS[currentDifficulty].radius) {
      msg = '🚨 <span class="text-rose-400 font-extrabold animate-pulse">바로 발 밑에 있습니다! 지금 즉시 클릭(터치)하세요!</span>';
      barColor = 'bg-gradient-to-r from-orange-500 to-rose-500 animate-pulse';
    } else if (dist < 80) {
      msg = '🔥 <span class="text-orange-400 font-bold">초근접! 음메! 음메! (엄청나게 뜨겁습니다!)</span>';
      barColor = 'bg-gradient-to-r from-amber-500 to-orange-500';
    } else if (dist < 150) {
      msg = '♨️ <span class="text-amber-300 font-semibold">가까워지고 있습니다! 음메~ (따뜻함!)</span>';
      barColor = 'bg-amber-400';
    } else if (dist < 260) {
      msg = '🌤️ <span class="text-emerald-300">미지근함... 음메~ 소리가 선명해집니다</span>';
      barColor = 'bg-emerald-400';
    } else if (dist < 420) {
      msg = '❄️ <span class="text-sky-300">쌀쌀함... 먼 곳에서 음메... 소리가 들립니다</span>';
      barColor = 'bg-sky-400';
    } else {
      msg = '🧊 <span class="text-slate-400">꽁꽁 얼어붙음... 소가 너무 멀리 있습니다</span>';
      barColor = 'bg-slate-600';
    }

    radarText.innerHTML = msg;

    if (tempFill) {
      const pct = Math.min(100, Math.round(closeness * 100));
      tempFill.style.width = `${pct}%`;
      tempFill.className = `h-full transition-all duration-150 rounded-full ${barColor}`;
    }
  }

  // Check if click was on target
  function handlePointerClick(clientX, clientY) {
    if (!isPlaying || !arena) return;

    clickCount++;
    updateClicksUI();

    const rect = arena.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const dist = Math.hypot(x - cowX, y - cowY);
    const radius = DIFFICULTY_SETTINGS[currentDifficulty].radius;

    // Found cow!
    if (dist <= radius) {
      handleCowFound();
    } else {
      // Missed click feedback
      spawnMissFeedback(x, y);
    }
  }

  // Miss click ripple feedback
  function spawnMissFeedback(x, y) {
    const miss = document.createElement('div');
    miss.className = 'absolute pointer-events-none text-xs font-mono text-slate-500 transition-all duration-300';
    miss.style.left = `${x}px`;
    miss.style.top = `${y}px`;
    miss.style.transform = 'translate(-50%, -50%)';
    miss.innerText = '빗나감!';
    arena.appendChild(miss);

    requestAnimationFrame(() => {
      miss.style.transform = 'translate(-50%, -100%) scale(1.1)';
      miss.style.opacity = '0';
    });

    setTimeout(() => {
      if (miss.parentNode) miss.parentNode.removeChild(miss);
    }, 350);
  }

  // Victory Handler
  function handleCowFound() {
    isPlaying = false;
    stopTimer();

    const elapsed = ((Date.now() - gameStartTime) / 1000).toFixed(1);
    const isNewRecord = saveBestScore(parseFloat(elapsed));

    // Reveal Cow with rich animation
    if (foundCow) {
      foundCow.style.left = `${cowX}px`;
      foundCow.style.top = `${cowY}px`;
      foundCow.style.transform = 'translate(-50%, -50%)';
      foundCow.classList.remove('hidden');
      foundCow.classList.add('cow-found-anim');
      foundCow.style.opacity = '1';
    }

    if (radarText) {
      radarText.innerHTML = '🎉 <span class="text-emerald-300 font-black text-base">축하합니다! 숨어있던 소를 찾아냈습니다!</span>';
    }

    // Play triumphant cow moo and fanfare
    playVictorySound();
    fireConfetti();

    // Show Victory Modal / Card
    setTimeout(() => {
      showVictoryModal(elapsed, clickCount, isNewRecord);
    }, 700);
  }

  // Determine Rank
  function calculateRank(seconds, clicks) {
    const sec = parseFloat(seconds);
    if (sec <= 6.0 && clicks <= 2) return { badge: '👑 SSS등급', title: '초감각 청각의 신', desc: '놀라운 직관력과 청력으로 눈 깜짝할 사이에 소를 찾아냈습니다!' };
    if (sec <= 10.0 && clicks <= 4) return { badge: '🌟 S등급', title: '음향 레이더 마스터', desc: '미세한 음메 소리의 변화를 정확하게 간파했습니다!' };
    if (sec <= 18.0 && clicks <= 7) return { badge: '🥇 A등급', title: '베테랑 카우보이', desc: '침착하고 정확한 방향 추적으로 완벽하게 승리했습니다!' };
    if (sec <= 30.0) return { badge: '🥈 B등급', title: '노련한 탐색가', desc: '집중력을 잃지 않고 끝까지 소리를 쫓아 성공했습니다!' };
    return { badge: '🥉 C등급', title: '근성의 사운드 헌터', desc: '포기하지 않는 끈기로 보이지 않는 소를 발견했습니다!' };
  }

  function showVictoryModal(seconds, clicks, isNewRecord) {
    if (!victoryModal) return;

    if (victoryTime) victoryTime.innerText = `${seconds}초`;
    if (victoryClicks) victoryClicks.innerText = `${clicks}회`;

    const rank = calculateRank(seconds, clicks);
    if (victoryRank) {
      victoryRank.innerHTML = `
        <div class="text-2xl font-black text-amber-300 mb-1">${rank.badge}</div>
        <div class="text-sm font-bold text-white mb-0.5">${rank.title}</div>
        <div class="text-xs text-slate-400">${rank.desc}</div>
        ${isNewRecord ? '<div class="mt-2 text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-700/60 py-1 px-2.5 rounded-full inline-block">✨ 역대 최고 기록 달성!</div>' : ''}
      `;
    }

    victoryModal.classList.remove('hidden');
    victoryModal.classList.add('flex');
  }

  function closeVictoryModal() {
    if (!victoryModal) return;
    victoryModal.classList.add('hidden');
    victoryModal.classList.remove('flex');
  }

  // Setup Event Listeners
  function setupEventListeners() {
    // Start / Restart Buttons
    if (startBtn) {
      startBtn.addEventListener('click', (e) => {
        e.preventDefault();
        startGame();
      });
    }

    if (nextRoundBtn) {
      nextRoundBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeVictoryModal();
        startGame();
      });
    }

    // Modal Close Backdrop
    if (victoryModal) {
      victoryModal.addEventListener('click', (e) => {
        if (e.target === victoryModal) {
          closeVictoryModal();
        }
      });
    }

    // Arena Click to Start if not yet started
    if (arenaOverlay) {
      arenaOverlay.addEventListener('click', (e) => {
        e.preventDefault();
        startGame();
      });
    }

    // Pointer Events on Arena (handles mouse & pen)
    if (arena) {
      arena.addEventListener('pointermove', (e) => {
        if (e.pointerType === 'mouse' || e.pointerType === 'pen') {
          handlePointerMove(e.clientX, e.clientY);
        }
      });

      arena.addEventListener('pointerdown', (e) => {
        if (!isPlaying) {
          startGame();
          return;
        }
        if (e.pointerType === 'mouse' || e.pointerType === 'pen') {
          handlePointerClick(e.clientX, e.clientY);
        }
      });

      // Mobile Touch Specific Events with smooth touch dragging
      arena.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches[0]) {
          const t = e.touches[0];
          if (!isPlaying) {
            startGame();
          } else {
            handlePointerMove(t.clientX, t.clientY);
          }
        }
      }, { passive: false });

      arena.addEventListener('touchmove', (e) => {
        e.preventDefault(); // Prevents page scroll during gameplay
        if (e.touches && e.touches[0]) {
          const t = e.touches[0];
          handlePointerMove(t.clientX, t.clientY);
        }
      }, { passive: false });

      arena.addEventListener('touchend', (e) => {
        if (!isPlaying) return;
        if (e.changedTouches && e.changedTouches[0]) {
          const t = e.changedTouches[0];
          handlePointerClick(t.clientX, t.clientY);
        }
      }, { passive: false });

      arena.addEventListener('pointerleave', () => {
        if (isPlaying && radarText) {
          radarText.innerHTML = '<span class="text-slate-500">마우스나 손가락을 경기장 안으로 이동하세요...</span>';
        }
      });
    }

    // Volume Slider
    if (volSlider) {
      volSlider.addEventListener('input', (e) => {
        masterVolume = parseFloat(e.target.value) / 100;
        if (volValText) volValText.innerText = `${e.target.value}%`;
      });
    }

    // Difficulty Selector
    if (diffSelect) {
      diffSelect.addEventListener('change', (e) => {
        currentDifficulty = e.target.value;
        if (isPlaying) {
          // Restart with new difficulty
          startGame();
        }
      });
    }

    // Sound Mode Selector Buttons if present
    document.querySelectorAll('[data-sound-mode]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-sound-mode]').forEach(b => b.classList.remove('active-mode', 'bg-emerald-600', 'text-slate-950'));
        btn.classList.add('active-mode', 'bg-emerald-600', 'text-slate-950');
        soundMode = btn.dataset.soundMode;
      });
    });

    // Window Resize Recalibration
    window.addEventListener('resize', () => {
      if (isPlaying && arena) {
        const rect = arena.getBoundingClientRect();
        cowX = Math.min(cowX, rect.width - 40);
        cowY = Math.min(cowY, rect.height - 40);
      }
    });
  }

})();
