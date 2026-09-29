// Vintage Mechanical Typewriter Web Audio ASMR Engine
document.addEventListener('DOMContentLoaded', () => {
  let audioCtx = null;
  const audioBuffers = {};
  let isSoundEnabled = true;
  let isBellEnabled = true;
  let masterVolume = 0.85;
  let activeAutoTypingTimer = null;
  let soundPlayedInCurrentEvent = false;

  const textarea = document.getElementById('typewriterArea');
  const volumeSlider = document.getElementById('volumeSlider');
  const bellToggleBtn = document.getElementById('bellToggleBtn');
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const copyBtn = document.getElementById('copyBtn');
  const clearBtn = document.getElementById('clearBtn');
  const autoTypeBtn = document.getElementById('autoTypeBtn');
  const charCountEl = document.getElementById('charCount');
  const lineCountEl = document.getElementById('lineCount');
  const carriageIndicator = document.getElementById('carriageIndicator');

  const SAMPLE_QUOTES = [
    "There is nothing to writing. All you do is sit down at a typewriter and bleed. - Ernest Hemingway",
    "It is only with the heart that one can see rightly; what is essential is invisible to the eye. - Antoine de Saint-Exupéry",
    "별 하나에 추억과, 별 하나에 사랑과, 별 하나에 쓸쓸함과, 별 하나에 동경과, 별 하나에 시와, 별 하나에 어머니, 어머니. - 윤동주 <별 헤는 밤>",
    "죽는 날까지 하늘을 우러러 한 점 부끄럼이 없기를, 잎새에 이는 바람에도 나는 괴로워했다. - 윤동주 <서시>",
    "The typewriter is an instrument of music that records thought in cold, permanent steel."
  ];

  function getAudioContext() {
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
      if (Math.abs(ch[i]) > 0.015) {
        start = Math.max(0, i - Math.floor(buf.sampleRate * 0.005));
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

  async function loadBuffer(key, fallbackUrl) {
    if (audioBuffers[key]) return audioBuffers[key];
    getAudioContext();
    try {
      let arrayBuf = null;
      if (window.TYPEWRITER_AUDIO_DATA && window.TYPEWRITER_AUDIO_DATA[key]) {
        const b64 = window.TYPEWRITER_AUDIO_DATA[key].split(',')[1];
        const binary = atob(b64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        arrayBuf = bytes.buffer;
      } else {
        const res = await fetch(fallbackUrl || `./sounds/${key}.wav`);
        arrayBuf = await res.arrayBuffer();
      }
      if (arrayBuf) {
        const decoded = await audioCtx.decodeAudioData(arrayBuf);
        audioBuffers[key] = trimBuffer(audioCtx, decoded);
        return audioBuffers[key];
      }
    } catch(err) {
      console.warn('[Typewriter] Load error for', key, err);
    }
    return null;
  }

  async function preloadAllSounds() {
    getAudioContext();
    const soundKeys = ['key', 'key2', 'space', 'delete', 'enter', 'bell'];
    for (const k of soundKeys) {
      await loadBuffer(k);
    }
  }

  function playSample(bufKey, pitchVar = 0.03, volumeScale = 1.0) {
    if (!isSoundEnabled) return;
    getAudioContext();
    const buf = audioBuffers[bufKey];
    if (!buf) {
      // Fallback synthetic click if not decoded yet
      playSyntheticClick(bufKey);
      return;
    }

    try {
      const now = audioCtx.currentTime;
      const src = audioCtx.createBufferSource();
      src.buffer = buf;
      // Organic pitch micro-randomization (+- pitchVar)
      const randomPitch = 1.0 + (Math.random() * 2 - 1) * pitchVar;
      src.playbackRate.value = Math.max(0.5, randomPitch);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(masterVolume * volumeScale, now);

      src.connect(gain);
      gain.connect(audioCtx.destination);
      src.start(now);
    } catch(e) {
      console.warn('[Typewriter] Audio play error:', e);
    }
  }

  function playSyntheticClick(type) {
    try {
      getAudioContext();
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      if (type === 'bell') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2100, now);
        gain.gain.setValueAtTime(0.4 * masterVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 1.2);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(type === 'space' ? 180 : 380 + Math.random() * 100, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.04);
        gain.gain.setValueAtTime(0.6 * masterVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      }
    } catch(e) {}
  }

  function playKeyStrike() {
    // Randomize between key.wav and key2.wav for ultra-realistic typewriter texture
    const key = Math.random() > 0.5 ? 'key' : 'key2';
    playSample(key, 0.035, 1.0);
    triggerCarriageShake();
  }

  function playSpaceBar() {
    playSample('space', 0.02, 1.05);
    triggerCarriageShake();
  }

  function playBackspace() {
    playSample('delete', 0.025, 0.95);
  }

  function playCarriageReturn() {
    // Play carriage sliding return mechanism
    playSample('enter', 0.015, 1.0);
    // Ring the iconic vintage brass bell if enabled
    if (isBellEnabled) {
      setTimeout(() => {
        playSample('bell', 0.01, 0.85);
        triggerBellGlow();
      }, 50);
    }
    triggerCarriageSlide();
  }

  function triggerMarginBellIfNeeded(currentLineText) {
    if (!isBellEnabled) return;
    // Real typewriters ring a warning bell ~5-8 characters before line margin (around 60 chars)
    if (currentLineText && currentLineText.length === 60) {
      playSample('bell', 0.01, 0.65);
      triggerBellGlow();
    }
  }

  // Visual effects
  function triggerCarriageShake() {
    const paper = document.getElementById('typewriterPaper');
    if (paper) {
      paper.classList.add('typewriter-shake');
      setTimeout(() => paper.classList.remove('typewriter-shake'), 60);
    }
  }

  function triggerCarriageSlide() {
    const paper = document.getElementById('typewriterPaper');
    if (paper) {
      paper.classList.add('typewriter-slide');
      setTimeout(() => paper.classList.remove('typewriter-slide'), 350);
    }
  }

  function triggerBellGlow() {
    const bellIcon = document.getElementById('bellIcon');
    if (bellIcon) {
      bellIcon.classList.add('scale-150', 'text-amber-500');
      setTimeout(() => bellIcon.classList.remove('scale-150', 'text-amber-500'), 400);
    }
  }

  function highlightVirtualKey(char) {
    if (!char) return;
    const lower = char.toLowerCase();
    const btn = document.querySelector(`.vk-key[data-char="${lower}"]`) ||
                document.querySelector(`.vk-key[data-key="${lower}"]`);
    if (btn) {
      btn.classList.add('is-pressed');
      setTimeout(() => btn.classList.remove('is-pressed'), 120);
    }
  }

  function updateCarriageAndStats() {
    if (!textarea) return;
    const text = textarea.value;
    const totalChars = text.length;
    const lines = text.split('\n');
    const totalLines = lines.length;
    const currentLine = lines[lines.length - 1] || '';
    const currentCol = currentLine.length;

    if (charCountEl) charCountEl.textContent = totalChars.toLocaleString();
    if (lineCountEl) lineCountEl.textContent = totalLines.toLocaleString();

    // Carriage position indicator (0% to 100% across the margin ruler)
    if (carriageIndicator) {
      const maxCol = 70;
      const pct = Math.min(100, Math.round((currentCol / maxCol) * 100));
      carriageIndicator.style.left = `${pct}%`;
    }

    return currentLine;
  }

  // Textarea Typing Event Listeners
  if (textarea) {
    textarea.addEventListener('keydown', (e) => {
      soundPlayedInCurrentEvent = true;
      if (e.key === 'Enter') {
        playCarriageReturn();
        highlightVirtualKey('enter');
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        playBackspace();
        highlightVirtualKey('backspace');
      } else if (e.key === ' ' || e.code === 'Space') {
        playSpaceBar();
        highlightVirtualKey('space');
      } else if (!e.ctrlKey && !e.metaKey && !e.altKey && e.key.length === 1) {
        playKeyStrike();
        highlightVirtualKey(e.key);
      }
    });

    textarea.addEventListener('input', (e) => {
      // Handle mobile soft keyboards where keydown events can be suppressed or Unidentified
      if (!soundPlayedInCurrentEvent) {
        if (e.inputType === 'deleteContentBackward' || e.inputType === 'deleteContentForward') {
          playBackspace();
          highlightVirtualKey('backspace');
        } else if (e.inputType === 'insertLineBreak') {
          playCarriageReturn();
          highlightVirtualKey('enter');
        } else if (e.data === ' ') {
          playSpaceBar();
          highlightVirtualKey('space');
        } else if (e.data) {
          playKeyStrike();
          highlightVirtualKey(e.data[e.data.length - 1]);
        }
      }
      soundPlayedInCurrentEvent = false;

      const currentLine = updateCarriageAndStats();
      triggerMarginBellIfNeeded(currentLine);
    });

    textarea.addEventListener('keyup', () => {
      soundPlayedInCurrentEvent = false;
      updateCarriageAndStats();
    });

    textarea.addEventListener('click', updateCarriageAndStats);
  }

  // Interactive Virtual Keyboard Keys
  const virtualKeys = document.querySelectorAll('.vk-key');
  virtualKeys.forEach(vk => {
    let lastTime = 0;
    const handlePress = (e) => {
      const now = Date.now();
      if (now - lastTime < 100) return;
      lastTime = now;
      if (e && e.cancelable) e.preventDefault();

      vk.classList.add('is-pressed');
      setTimeout(() => vk.classList.remove('is-pressed'), 120);

      const action = vk.dataset.action;
      const char = vk.dataset.char;

      if (action === 'enter') {
        playCarriageReturn();
        if (textarea) {
          textarea.value += '\n';
          textarea.scrollTop = textarea.scrollHeight;
        }
      } else if (action === 'backspace') {
        playBackspace();
        if (textarea && textarea.value.length > 0) {
          textarea.value = textarea.value.slice(0, -1);
        }
      } else if (action === 'space') {
        playSpaceBar();
        if (textarea) textarea.value += ' ';
      } else if (char) {
        playKeyStrike();
        if (textarea) {
          textarea.value += char;
          textarea.scrollTop = textarea.scrollHeight;
        }
      }

      const currentLine = updateCarriageAndStats();
      triggerMarginBellIfNeeded(currentLine);
    };

    vk.addEventListener('pointerdown', handlePress);
    vk.addEventListener('click', handlePress);
  });

  // Sound Volume Slider
  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      masterVolume = parseFloat(e.target.value) / 100;
      isSoundEnabled = masterVolume > 0;
      updateSoundUI();
    });
  }

  // Sound Toggle Button
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      isSoundEnabled = !isSoundEnabled;
      if (isSoundEnabled && masterVolume === 0) masterVolume = 0.85;
      if (volumeSlider) volumeSlider.value = isSoundEnabled ? Math.round(masterVolume * 100) : 0;
      updateSoundUI();
      if (isSoundEnabled) playKeyStrike();
    });
  }

  function updateSoundUI() {
    const icon = document.getElementById('soundIcon');
    if (icon) {
      icon.textContent = isSoundEnabled ? (masterVolume > 0.5 ? 'volume_up' : 'volume_down') : 'volume_off';
    }
    if (soundToggleBtn) {
      soundToggleBtn.title = isSoundEnabled ? '사운드 음소거' : '사운드 켜기';
    }
  }

  // Bell Toggle Button
  if (bellToggleBtn) {
    bellToggleBtn.addEventListener('click', () => {
      isBellEnabled = !isBellEnabled;
      bellToggleBtn.classList.toggle('active', isBellEnabled);
      const label = document.getElementById('bellLabel');
      if (label) label.textContent = isBellEnabled ? '마진 종소리 켜짐' : '마진 종소리 꺼짐';
      if (isBellEnabled) playSample('bell', 0.01, 0.85);
    });
  }

  // Action: Copy Text
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      if (!textarea || !textarea.value) return;
      try {
        await navigator.clipboard.writeText(textarea.value);
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<span class="material-symbols-outlined text-sm">check</span> 복사 완료!';
        copyBtn.classList.add('bg-emerald-500', 'text-white');
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
          copyBtn.classList.remove('bg-emerald-500', 'text-white');
        }, 1500);
      } catch(e) {}
    });
  }

  // Action: New Paper (Clear)
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (textarea && textarea.value.length > 0) {
        if (confirm('종이를 새로 끼우시겠습니까? (작성 중인 내용이 지워집니다)')) {
          textarea.value = '';
          updateCarriageAndStats();
          playCarriageReturn();
        }
      }
    });
  }

  // Action: Auto ASMR Typing Demo
  if (autoTypeBtn) {
    autoTypeBtn.addEventListener('click', () => {
      if (activeAutoTypingTimer) {
        clearTimeout(activeAutoTypingTimer);
        activeAutoTypingTimer = null;
        autoTypeBtn.innerHTML = '<span class="material-symbols-outlined text-sm">play_arrow</span> ASMR 자동 타이핑';
        autoTypeBtn.classList.remove('bg-amber-600', 'text-white');
        return;
      }

      const randomQuote = SAMPLE_QUOTES[Math.floor(Math.random() * SAMPLE_QUOTES.length)];
      if (textarea.value.length > 0 && !textarea.value.endsWith('\n\n')) {
        textarea.value += '\n\n';
      }

      autoTypeBtn.innerHTML = '<span class="material-symbols-outlined text-sm">stop</span> 타이핑 중지';
      autoTypeBtn.classList.add('bg-amber-600', 'text-white');

      let charIdx = 0;
      const typeNextChar = () => {
        if (charIdx >= randomQuote.length) {
          playCarriageReturn();
          autoTypeBtn.innerHTML = '<span class="material-symbols-outlined text-sm">play_arrow</span> ASMR 자동 타이핑';
          autoTypeBtn.classList.remove('bg-amber-600', 'text-white');
          activeAutoTypingTimer = null;
          return;
        }

        const ch = randomQuote[charIdx++];
        if (ch === ' ') {
          playSpaceBar();
          highlightVirtualKey('space');
        } else if (ch === '\n') {
          playCarriageReturn();
          highlightVirtualKey('enter');
        } else {
          playKeyStrike();
          highlightVirtualKey(ch);
        }

        textarea.value += ch;
        textarea.scrollTop = textarea.scrollHeight;
        const currentLine = updateCarriageAndStats();
        triggerMarginBellIfNeeded(currentLine);

        // Organic typewriter typing cadence (between 70ms and 190ms per character)
        const delay = ch === ' ' ? 160 : (ch === ',' || ch === '.' ? 320 : 80 + Math.random() * 80);
        activeAutoTypingTimer = setTimeout(typeNextChar, delay);
      };

      typeNextChar();
    });
  }

  // Preload sounds during idle
  if (window.requestIdleCallback) {
    window.requestIdleCallback(() => preloadAllSounds());
  } else {
    setTimeout(preloadAllSounds, 300);
  }

  updateCarriageAndStats();
});
