// Animal Synthesized & Real Sampled Orchestra Piano Engine
document.addEventListener('DOMContentLoaded', () => {
  let audioCtx = null;
  let currentAnimal = 'cat';
  let octaveShift = 0; // -1, 0, 1
  const audioBuffers = {};
  let activeDemoTimeouts = [];

  const ANIMAL_INFO = {
    cat: { name: '야옹이 오케스트라', icon: '🐱', sound: '야옹~🎶', hint: '도레미파솔에 맞춰 귀여운 고양이 울음소리가 울려 퍼집니다!' },
    dog: { name: '댕댕이 오케스트라', icon: '🐶', sound: '멍멍!🎵', hint: '도레미파솔에 맞춰 활기찬 강아지 짖는 소리가 울려 퍼집니다!' },
    duck: { name: '오리 오케스트라', icon: '🦆', sound: '꽥꽥!✨', hint: '도레미파솔에 맞춰 깜찍한 오리 꽥꽥 소리가 울려 퍼집니다!' },
    frog: { name: '개구리 오케스트라', icon: '🐸', sound: '개굴!🌿', hint: '도레미파솔에 맞춰 통통 튀는 개구리 울음소리가 울려 퍼집니다!' },
    cow: { name: '젖소 오케스트라', icon: '🐮', sound: '음메~🌾', hint: '도레미파솔에 맞춰 구수한 암소 음메 소리가 울려 퍼집니다!' },
    sheep: { name: '아기양 오케스트라', icon: '🐑', sound: '메에~☁️', hint: '도레미파솔에 맞춰 포근한 아기양 메에 소리가 울려 퍼집니다!' },
    pig: { name: '꿀꿀이 오케스트라', icon: '🐷', sound: '꿀꿀!🍎', hint: '도레미파솔에 맞춰 사랑스러운 돼지 꿀꿀 소리가 울려 퍼집니다!' },
    rooster: { name: '꼬꼬댁 오케스트라', icon: '🐓', sound: '꼬끼오!☀️', hint: '도레미파솔에 맞춰 힘찬 수탉 꼬끼오 소리가 울려 퍼집니다!' }
  };

  const DEMO_SONGS = {
    airplane: [
      { note: 329.63, dur: 360 }, { note: 293.66, dur: 360 }, { note: 261.63, dur: 360 }, { note: 293.66, dur: 360 },
      { note: 329.63, dur: 360 }, { note: 329.63, dur: 360 }, { note: 329.63, dur: 700 },
      { note: 293.66, dur: 360 }, { note: 293.66, dur: 360 }, { note: 293.66, dur: 700 },
      { note: 329.63, dur: 360 }, { note: 392.00, dur: 360 }, { note: 392.00, dur: 700 },
      { note: 329.63, dur: 360 }, { note: 293.66, dur: 360 }, { note: 261.63, dur: 360 }, { note: 293.66, dur: 360 },
      { note: 329.63, dur: 360 }, { note: 329.63, dur: 360 }, { note: 329.63, dur: 360 }, { note: 329.63, dur: 360 },
      { note: 293.66, dur: 360 }, { note: 293.66, dur: 360 }, { note: 329.63, dur: 360 }, { note: 293.66, dur: 360 }, { note: 261.63, dur: 800 }
    ],
    star: [
      { note: 261.63, dur: 380 }, { note: 261.63, dur: 380 }, { note: 392.00, dur: 380 }, { note: 392.00, dur: 380 },
      { note: 440.00, dur: 380 }, { note: 440.00, dur: 380 }, { note: 392.00, dur: 760 },
      { note: 349.23, dur: 380 }, { note: 349.23, dur: 380 }, { note: 329.63, dur: 380 }, { note: 329.63, dur: 380 },
      { note: 293.66, dur: 380 }, { note: 293.66, dur: 380 }, { note: 261.63, dur: 760 }
    ],
    bear: [
      { note: 261.63, dur: 360 }, { note: 261.63, dur: 360 }, { note: 261.63, dur: 360 }, { note: 261.63, dur: 360 }, { note: 261.63, dur: 360 },
      { note: 329.63, dur: 360 }, { note: 392.00, dur: 360 }, { note: 392.00, dur: 360 }, { note: 329.63, dur: 360 }, { note: 261.63, dur: 700 },
      { note: 392.00, dur: 360 }, { note: 392.00, dur: 360 }, { note: 329.63, dur: 360 }, { note: 392.00, dur: 360 }, { note: 392.00, dur: 360 }, { note: 329.63, dur: 360 },
      { note: 261.63, dur: 360 }, { note: 261.63, dur: 360 }, { note: 261.63, dur: 700 }
    ]
  };

  function getAudioCtx() {
    if (!audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) audioCtx = new AudioCtx();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function trimBuffer(ctx, buf) {
    const ch = buf.getChannelData(0);
    let start = 0;
    for (let i = 0; i < ch.length; i++) {
      if (Math.abs(ch[i]) > 0.02) {
        start = Math.max(0, i - Math.floor(buf.sampleRate * 0.008));
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

  async function loadAnimalBuffer(animalKey) {
    if (audioBuffers[animalKey]) return audioBuffers[animalKey];
    getAudioCtx();
    try {
      let arrayBuf = null;
      if (window.ANIMAL_AUDIO_DATA && window.ANIMAL_AUDIO_DATA[animalKey]) {
        const b64 = window.ANIMAL_AUDIO_DATA[animalKey].split(',')[1];
        const binary = atob(b64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        arrayBuf = bytes.buffer;
      } else {
        const res = await fetch(`./sounds/${animalKey}.mp3`);
        arrayBuf = await res.arrayBuffer();
      }
      if (arrayBuf) {
        const decoded = await audioCtx.decodeAudioData(arrayBuf);
        audioBuffers[animalKey] = trimBuffer(audioCtx, decoded);
        return audioBuffers[animalKey];
      }
    } catch(err) {
      console.warn('[AnimalPiano] Failed to load buffer for', animalKey, err);
    }
    return null;
  }

  async function preloadAllAnimals() {
    getAudioCtx();
    const keys = Object.keys(ANIMAL_INFO);
    for (const k of keys) {
      if (!audioBuffers[k]) {
        await loadAnimalBuffer(k);
      }
    }
  }

  // Fallback procedural sound if buffers are still decoding
  function playSynthesizedFallback(freq) {
    try {
      getAudioCtx();
      const t = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq * 0.9, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.25, t + 0.15);
      osc.frequency.exponentialRampToValueAtTime(freq, t + 0.35);
      gain.gain.setValueAtTime(0.5, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.45);
    } catch(e) {}
  }

  function triggerVisualFeedback(keyEl) {
    if (keyEl) {
      keyEl.classList.add('is-pressed');
      setTimeout(() => keyEl.classList.remove('is-pressed'), 200);
    }

    const avatar = document.getElementById('animal-avatar');
    if (avatar) {
      avatar.classList.add('scale-125', '-rotate-6');
      setTimeout(() => avatar.classList.remove('scale-125', '-rotate-6'), 180);
    }

    const bubble = document.getElementById('animal-bubble');
    if (bubble) {
      bubble.textContent = ANIMAL_INFO[currentAnimal].sound;
      bubble.classList.remove('opacity-0', 'translate-y-1');
      bubble.classList.add('opacity-100', 'translate-y-0');
      clearTimeout(bubble._timer);
      bubble._timer = setTimeout(() => {
        bubble.classList.remove('opacity-100', 'translate-y-0');
        bubble.classList.add('opacity-0', 'translate-y-1');
      }, 700);
    }
  }

  function playNote(freq, keyEl) {
    getAudioCtx();
    const mult = Math.pow(2, octaveShift);
    const targetFreq = freq * mult;
    const baseFreq = 261.63; // C4 root
    const rate = targetFreq / baseFreq;

    const buf = audioBuffers[currentAnimal];
    if (buf) {
      try {
        const now = audioCtx.currentTime;
        const src = audioCtx.createBufferSource();
        src.buffer = buf;
        src.playbackRate.value = rate;

        const gain = audioCtx.createGain();
        const maxDuration = Math.min(buf.duration / rate, 1.4);
        gain.gain.setValueAtTime(0.85, now);
        gain.gain.setValueAtTime(0.85, now + Math.max(0.1, maxDuration - 0.12));
        gain.gain.linearRampToValueAtTime(0.001, now + maxDuration);

        src.connect(gain);
        gain.connect(audioCtx.destination);
        src.start(now);
        src.stop(now + maxDuration);
      } catch(e) {
        console.warn('[AnimalPiano] Play error:', e);
      }
    } else {
      playSynthesizedFallback(targetFreq);
    }

    triggerVisualFeedback(keyEl);
  }

  // Animal Selector Buttons
  const animalBtns = document.querySelectorAll('.animal-btn');
  animalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      animalBtns.forEach(b => {
        b.classList.remove('active', 'bg-amber-500', 'text-white', 'shadow-lg', 'scale-105');
        b.classList.add('bg-white', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-200');
      });
      btn.classList.add('active', 'bg-amber-500', 'text-white', 'shadow-lg', 'scale-105');
      btn.classList.remove('bg-white', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-200');

      currentAnimal = btn.dataset.sound || 'cat';
      loadAnimalBuffer(currentAnimal);

      // Update banner UI
      const info = ANIMAL_INFO[currentAnimal] || ANIMAL_INFO.cat;
      const avatarEl = document.getElementById('animal-avatar');
      const nameEl = document.getElementById('animal-name');
      const hintEl = document.getElementById('animal-hint');
      if (avatarEl) avatarEl.textContent = info.icon;
      if (nameEl) nameEl.textContent = info.name;
      if (hintEl) hintEl.textContent = info.hint;

      // Play short intro preview of chosen animal
      playNote(261.63, null);
    });
  });

  // Octave Controller
  const octaveBtns = document.querySelectorAll('.octave-btn');
  octaveBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      octaveBtns.forEach(b => {
        b.classList.remove('active', 'bg-amber-500', 'text-white', 'font-black');
        b.classList.add('bg-slate-100', 'dark:bg-slate-700', 'text-slate-600', 'dark:text-slate-300', 'font-bold');
      });
      btn.classList.add('active', 'bg-amber-500', 'text-white', 'font-black');
      btn.classList.remove('bg-slate-100', 'dark:bg-slate-700', 'text-slate-600', 'dark:text-slate-300', 'font-bold');

      octaveShift = parseInt(btn.dataset.octave || '0', 10);
    });
  });

  // Piano Key Press Events (Pointer Events for Touch & Mouse)
  const pianoKeys = document.querySelectorAll('.piano-key');
  pianoKeys.forEach(k => {
    k.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      const freq = parseFloat(k.dataset.note);
      playNote(freq, k);
    });
  });

  // Keyboard Shortcuts (PC Desktop)
  const keyMap = {
    // White Keys
    'KeyA': 261.63, 'Digit1': 261.63,
    'KeyS': 293.66, 'Digit2': 293.66,
    'KeyD': 329.63, 'Digit3': 329.63,
    'KeyF': 349.23, 'Digit4': 349.23,
    'KeyG': 392.00, 'Digit5': 392.00,
    'KeyH': 440.00, 'Digit6': 440.00,
    'KeyJ': 493.88, 'Digit7': 493.88,
    'KeyK': 523.25, 'Digit8': 523.25,
    // Black Keys
    'KeyW': 277.18,
    'KeyE': 311.13,
    'KeyT': 369.99,
    'KeyY': 415.30,
    'KeyU': 466.16
  };

  const activeKeysPressed = new Set();
  window.addEventListener('keydown', (e) => {
    if (e.repeat || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    const freq = keyMap[e.code];
    if (freq && !activeKeysPressed.has(e.code)) {
      activeKeysPressed.add(e.code);
      const targetBtn = Array.from(pianoKeys).find(k => Math.abs(parseFloat(k.dataset.note) - freq) < 0.1);
      playNote(freq, targetBtn);
    }
  });

  window.addEventListener('keyup', (e) => {
    activeKeysPressed.delete(e.code);
  });

  // Demo Song Auto-Player
  function stopDemoSongs() {
    activeDemoTimeouts.forEach(t => clearTimeout(t));
    activeDemoTimeouts = [];
    const stopBtn = document.getElementById('stop-song-btn');
    if (stopBtn) stopBtn.classList.add('hidden');
  }

  function playSong(songKey) {
    stopDemoSongs();
    const song = DEMO_SONGS[songKey];
    if (!song) return;

    const stopBtn = document.getElementById('stop-song-btn');
    if (stopBtn) stopBtn.classList.remove('hidden');

    let accumulatedTime = 0;
    song.forEach((item, idx) => {
      const timer = setTimeout(() => {
        const targetBtn = Array.from(pianoKeys).find(k => Math.abs(parseFloat(k.dataset.note) - item.note) < 0.1);
        playNote(item.note, targetBtn);
        if (idx === song.length - 1) {
          const finishTimer = setTimeout(() => stopDemoSongs(), item.dur + 200);
          activeDemoTimeouts.push(finishTimer);
        }
      }, accumulatedTime);
      activeDemoTimeouts.push(timer);
      accumulatedTime += item.dur;
    });
  }

  const demoBtns = document.querySelectorAll('.demo-song-btn');
  demoBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const song = btn.dataset.song;
      playSong(song);
    });
  });

  const stopBtn = document.getElementById('stop-song-btn');
  if (stopBtn) {
    stopBtn.addEventListener('click', stopDemoSongs);
  }

  // Preload initial buffers in idle time
  if (window.requestIdleCallback) {
    window.requestIdleCallback(() => preloadAllAnimals());
  } else {
    setTimeout(preloadAllAnimals, 300);
  }
});
