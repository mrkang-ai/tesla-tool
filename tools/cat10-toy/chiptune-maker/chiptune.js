/**
 * 8-Bit Chiptune Web Audio Synthesizer Studio
 * Authentic NES Ricoh 2A03 / Arcade Pulse & Noise Synthesis
 * Enhanced Laser Pew-Pew, Crunchy Sub-Bass Explosion, CRT Oscilloscope, and WAV Export
 */

(function () {
  'use strict';

  let audioCtx = null;
  let masterGain = null;
  let masterAnalyser = null;
  let isOscilloscopeRunning = false;
  let lastPlayedSound = 'laser'; // default for export

  // Audio Context & Graph Initializer
  function getAudioCtx() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
        masterGain = audioCtx.createGain();
        masterGain.gain.setValueAtTime(0.85, audioCtx.currentTime);

        masterAnalyser = audioCtx.createAnalyser();
        masterAnalyser.fftSize = 1024;
        masterAnalyser.smoothingTimeConstant = 0.65;

        masterGain.connect(masterAnalyser);
        masterAnalyser.connect(audioCtx.destination);
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // --- Sound Generation Functions (Supports both live and offline rendering) ---

  // 1. Coin (🪙 코인 획득 - B5 -> E6 Dual Square Arpeggio)
  function buildCoin(ctx, dest, t = 0, p = {}) {
    const pitchMul = p.pitch ? p.pitch / 1000 : 1.0;
    const durMul = p.dur ? p.dur : 1.0;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';

    // B5 (987.77Hz) -> E6 (1318.51Hz)
    osc.frequency.setValueAtTime(987.77 * pitchMul, t);
    osc.frequency.setValueAtTime(1318.51 * pitchMul, t + 0.075 * durMul);

    gain.gain.setValueAtTime(0.45, t);
    gain.gain.setValueAtTime(0.45, t + 0.075 * durMul);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.38 * durMul);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(t);
    osc.stop(t + 0.39 * durMul);
  }

  // 2. Jump (🍄 점프 사운드 - Ascending Square Chirp)
  function buildJump(ctx, dest, t = 0, p = {}) {
    const pitchMul = p.pitch ? p.pitch / 300 : 1.0;
    const durMul = p.dur ? p.dur : 1.0;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';

    const startFreq = 140 * pitchMul;
    const endFreq = 580 * pitchMul;
    osc.frequency.setValueAtTime(startFreq, t);
    osc.frequency.exponentialRampToValueAtTime(endFreq, t + 0.16 * durMul);

    gain.gain.setValueAtTime(0.45, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.17 * durMul);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(t);
    osc.stop(t + 0.18 * durMul);
  }

  // 3. Laser (🔫 8비트 아케이드 레이저 - Authentic Sci-Fi Pew-Pew)
  function buildLaser(ctx, dest, t = 0, p = {}) {
    const pitchMul = p.pitch ? p.pitch / 1200 : 1.0;
    const durMul = p.dur ? p.dur : 1.0;
    const variant = p.variant || 'arcade'; // 'arcade', 'plasma', 'alien'

    if (variant === 'plasma') {
      // Fast High-Energy Plasma Pulse
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(2800 * pitchMul, t);
      osc.frequency.exponentialRampToValueAtTime(220 * pitchMul, t + 0.11 * durMul);

      const filter = ctx.createBiquadFilter();
      filter.type = 'peaking';
      filter.frequency.setValueAtTime(1800, t);
      filter.Q.value = 5;
      filter.gain.value = 10;

      gain.gain.setValueAtTime(0.6, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12 * durMul);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(dest);
      osc.start(t);
      osc.stop(t + 0.13 * durMul);
      return;
    }

    if (variant === 'alien') {
      // Stepped Descending Arpeggio Ray
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      const steps = [2400, 1800, 1350, 1000, 750, 500, 350, 200];
      const stepDur = 0.02 * durMul;
      steps.forEach((f, idx) => {
        osc.frequency.setValueAtTime(f * pitchMul, t + idx * stepDur);
      });
      gain.gain.setValueAtTime(0.55, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + steps.length * stepDur + 0.02);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(t);
      osc.stop(t + steps.length * stepDur + 0.03);
      return;
    }

    // Default: Classic Arcade Pew-Pew (Square wave + Dual Slope Envelope + Resonant Bandpass + Attack Click)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'square'; // True 8-bit pulse
    osc.frequency.setValueAtTime(2400 * pitchMul, t);
    osc.frequency.exponentialRampToValueAtTime(750 * pitchMul, t + 0.035 * durMul);
    osc.frequency.exponentialRampToValueAtTime(110 * pitchMul, t + 0.16 * durMul);

    // Resonant bandpass sweep adds piercing sci-fi body
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3200 * pitchMul, t);
    filter.frequency.exponentialRampToValueAtTime(380 * pitchMul, t + 0.16 * durMul);
    filter.Q.value = 3.8;

    gain.gain.setValueAtTime(0.65, t);
    gain.gain.setValueAtTime(0.55, t + 0.04 * durMul);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.17 * durMul);

    // Initial attack zap click (sharp 15ms transient)
    const click = ctx.createOscillator();
    const clickGain = ctx.createGain();
    click.type = 'sawtooth';
    click.frequency.setValueAtTime(3600 * pitchMul, t);
    click.frequency.exponentialRampToValueAtTime(500 * pitchMul, t + 0.02 * durMul);

    clickGain.gain.setValueAtTime(0.4, t);
    clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.025 * durMul);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    click.connect(clickGain);
    clickGain.connect(dest);

    osc.start(t);
    osc.stop(t + 0.18 * durMul);
    click.start(t);
    click.stop(t + 0.03 * durMul);
  }

  // 4. Boom (💥 8비트 리얼 폭발 - Quantized Bitcrushed LFSR Noise + Resonant Drop + Sub-Bass Punch)
  function buildBoom(ctx, dest, t = 0, p = {}) {
    const sampleRate = ctx.sampleRate || 44100;
    const durMul = p.dur ? p.dur : 1.0;
    const duration = Math.max(0.25, 0.55 * durMul);
    const crunchAmount = p.crunch !== undefined ? p.crunch : 0.8;
    const variant = p.variant || 'kaboom'; // 'kaboom', 'heavy', 'metal'

    // 1. Bitcrushed Downsampled Pseudo-Random Noise Buffer (NES 4-bit Style)
    const bufferSize = Math.floor(sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const chData = buffer.getChannelData(0);

    // Downsampling factor: 7500Hz effective clock for retro crunchy grit
    const downsample = Math.max(1, Math.floor(sampleRate / (variant === 'metal' ? 12000 : 7000)));
    let lastVal = 0;
    for (let i = 0; i < bufferSize; i++) {
      if (i % downsample === 0) {
        const raw = Math.random() * 2 - 1;
        // Quantize to 16 discrete levels (4-bit DAC like NES/Game Boy noise channel)
        lastVal = Math.round(raw * 8) / 8;
      }
      chData[i] = lastVal;
    }

    const noiseSrc = ctx.createBufferSource();
    noiseSrc.buffer = buffer;

    // 2. WaveShaper Distortion (Cabinet Overdrive Saturation)
    const shaper = ctx.createWaveShaper();
    const curve = new Float32Array(256);
    const drive = 1.0 + crunchAmount * 3.5;
    for (let i = 0; i < 256; i++) {
      const x = (i * 2) / 256 - 1;
      curve[i] = Math.tanh(x * drive);
    }
    shaper.curve = curve;

    // 3. Resonant Lowpass Filter Sweep (High crack -> low resonant rumble)
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    const startFilter = variant === 'heavy' ? 1600 : 2500;
    filter.frequency.setValueAtTime(startFilter, t);
    filter.frequency.exponentialRampToValueAtTime(750, t + 0.08 * durMul);
    filter.frequency.exponentialRampToValueAtTime(75, t + duration);
    filter.Q.value = 4.2;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.85, t);
    noiseGain.gain.setValueAtTime(0.75, t + 0.08 * durMul);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    noiseSrc.connect(shaper);
    shaper.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(dest);

    // 4. Sub-Bass Body Rumble (Low Pitch Drop for Cabinet-Shaking Impact)
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'triangle';

    const subStartFreq = variant === 'heavy' ? 120 : 150;
    const subEndFreq = 26;
    subOsc.frequency.setValueAtTime(subStartFreq, t);
    subOsc.frequency.exponentialRampToValueAtTime(subEndFreq, t + duration * 0.7);

    subGain.gain.setValueAtTime(0.75, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + duration * 0.75);

    subOsc.connect(subGain);
    subGain.connect(dest);

    noiseSrc.start(t);
    noiseSrc.stop(t + duration);
    subOsc.start(t);
    subOsc.stop(t + duration * 0.8);
  }

  // 5. Power-Up (⚡ 파워업 - 4-Note Major Arpeggio)
  function buildPowerup(ctx, dest, t = 0, p = {}) {
    const pitchMul = p.pitch ? p.pitch / 600 : 1.0;
    const durMul = p.dur ? p.dur : 1.0;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const noteDur = 0.065 * durMul;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq * pitchMul, t + idx * noteDur);

      gain.gain.setValueAtTime(0.4, t + idx * noteDur);
      gain.gain.exponentialRampToValueAtTime(0.001, t + (idx + 1) * noteDur + 0.05);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(t + idx * noteDur);
      osc.stop(t + (idx + 1) * noteDur + 0.06);
    });
  }

  // 6. Game Over (💀 게임오버 - Melancholy Descending Minor)
  function buildGameOver(ctx, dest, t = 0, p = {}) {
    const pitchMul = p.pitch ? p.pitch / 300 : 1.0;
    const durMul = p.dur ? p.dur : 1.0;

    const notes = [329.63, 261.63, 220.00, 185.00]; // E4, C4, A3, F#3
    const noteDur = 0.13 * durMul;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq * pitchMul, t + idx * noteDur);

      gain.gain.setValueAtTime(0.45, t + idx * noteDur);
      gain.gain.exponentialRampToValueAtTime(0.001, t + (idx + 1) * noteDur + 0.04);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(t + idx * noteDur);
      osc.stop(t + (idx + 1) * noteDur + 0.05);
    });
  }

  // 7. Hit / Hurt (🎯 피격/데미지 - Crunchy Fast Noise Bite)
  function buildHit(ctx, dest, t = 0, p = {}) {
    const pitchMul = p.pitch ? p.pitch / 250 : 1.0;
    const durMul = p.dur ? p.dur : 1.0;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(260 * pitchMul, t);
    osc.frequency.exponentialRampToValueAtTime(55 * pitchMul, t + 0.12 * durMul);

    gain.gain.setValueAtTime(0.6, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.13 * durMul);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(t);
    osc.stop(t + 0.14 * durMul);
  }

  // 8. 1-UP / Victory (🏆 1UP 클리어 - High Energy Fanfare)
  function buildOneUp(ctx, dest, t = 0, p = {}) {
    const pitchMul = p.pitch ? p.pitch / 800 : 1.0;
    const durMul = p.dur ? p.dur : 1.0;

    const notes = [659.25, 783.99, 1318.51, 1046.50, 1174.66, 1567.98]; // E5, G5, E6, C6, D6, G6
    const noteDur = 0.06 * durMul;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq * pitchMul, t + idx * noteDur);

      gain.gain.setValueAtTime(0.38, t + idx * noteDur);
      gain.gain.exponentialRampToValueAtTime(0.001, t + (idx + 1) * noteDur + 0.08);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(t + idx * noteDur);
      osc.stop(t + (idx + 1) * noteDur + 0.09);
    });
  }

  // Registry of all 8-bit sound builders
  const SOUND_BUILDERS = {
    coin: buildCoin,
    jump: buildJump,
    laser: buildLaser,
    boom: buildBoom,
    powerup: buildPowerup,
    gameover: buildGameOver,
    hit: buildHit,
    oneup: buildOneUp
  };

  // Play live sound through master audio graph
  function playSound(type, params = {}) {
    const ctx = getAudioCtx();
    if (!ctx) return;

    lastPlayedSound = type;
    const builder = SOUND_BUILDERS[type];
    if (builder) {
      builder(ctx, masterGain, ctx.currentTime, params);
      triggerVisualPulse(type);
    }
  }

  // Visual pulse on played button
  function triggerVisualPulse(type) {
    const btn = document.querySelector(`.synth-btn[data-type="${type}"]`);
    if (btn) {
      btn.classList.add('ring-2', 'ring-emerald-400', 'scale-95');
      setTimeout(() => {
        btn.classList.remove('ring-2', 'ring-emerald-400', 'scale-95');
      }, 140);
    }
  }

  // --- WAV File Export ---
  async function exportToWav(type, params = {}) {
    const builder = SOUND_BUILDERS[type] || buildLaser;
    const sampleRate = 44100;
    const durMul = params.dur ? params.dur : 1.0;
    const renderDur = type === 'boom' ? 0.65 * durMul : (type === 'oneup' ? 0.55 * durMul : 0.45 * durMul);

    const offlineCtx = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, Math.ceil(sampleRate * renderDur), sampleRate);
    const dest = offlineCtx.destination;

    builder(offlineCtx, dest, 0, params);

    const renderedBuffer = await offlineCtx.startRendering();
    const channelData = renderedBuffer.getChannelData(0);

    // Build standard 16-bit PCM WAV container
    const wavBytes = new Uint8Array(44 + channelData.length * 2);
    const view = new DataView(wavBytes.buffer);

    function writeString(offset, str) {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    }

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + channelData.length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // Linear PCM
    view.setUint16(22, 1, true); // Mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true); // Byte rate
    view.setUint16(32, 2, true); // Block align
    view.setUint16(34, 16, true); // 16-bit
    writeString(36, 'data');
    view.setUint32(40, channelData.length * 2, true);

    let offset = 44;
    for (let i = 0; i < channelData.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, channelData[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }

    const blob = new Blob([view], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `chiptune-${type}-${Date.now()}.wav`;
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1000);
  }

  // --- Real-Time Retro CRT Oscilloscope ---
  function initOscilloscope() {
    const canvas = document.getElementById('oscilloscopeCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * (window.devicePixelRatio || 1);
      canvas.height = rect.height * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const bufferLength = masterAnalyser ? masterAnalyser.fftSize : 512;
    const dataArray = new Uint8Array(bufferLength);

    function draw() {
      requestAnimationFrame(draw);

      const w = canvas.getBoundingClientRect().width;
      const h = canvas.getBoundingClientRect().height;

      // Dark phosphor CRT background
      ctx.fillStyle = 'rgba(10, 15, 29, 0.4)';
      ctx.fillRect(0, 0, w, h);

      // CRT Scanline Grid
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.08)';
      ctx.lineWidth = 1;
      const gridSpacing = 20;
      for (let x = 0; x < w; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Center zero line
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.18)';
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();

      if (masterAnalyser) {
        masterAnalyser.getByteTimeDomainData(dataArray);
      } else {
        for (let i = 0; i < dataArray.length; i++) dataArray[i] = 128;
      }

      // Waveform phosphor neon trace
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#10b981'; // Phosphor green
      ctx.shadowColor = '#34d399';
      ctx.shadowBlur = 8;
      ctx.beginPath();

      const sliceWidth = w / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * h) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        x += sliceWidth;
      }

      ctx.lineTo(w, h / 2);
      ctx.stroke();
      ctx.shadowBlur = 0; // reset
    }

    if (!isOscilloscopeRunning) {
      isOscilloscopeRunning = true;
      draw();
    }
  }

  // --- UI Event Bindings & Studio Controls ---
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Preset Buttons
    document.querySelectorAll('.synth-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        const variant = btn.dataset.variant || null;
        const params = variant ? { variant } : {};
        playSound(type, params);
      });
    });

    // 2. Laser Variant Selector Buttons
    document.querySelectorAll('[data-laser-variant]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-laser-variant]').forEach(b => {
          b.classList.remove('bg-purple-600', 'text-white', 'border-purple-400');
          b.classList.add('bg-slate-800', 'text-slate-300');
        });
        btn.classList.add('bg-purple-600', 'text-white', 'border-purple-400');
        btn.classList.remove('bg-slate-800', 'text-slate-300');

        playSound('laser', { variant: btn.dataset.laserVariant });
      });
    });

    // 3. Boom Variant Selector Buttons
    document.querySelectorAll('[data-boom-variant]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-boom-variant]').forEach(b => {
          b.classList.remove('bg-rose-600', 'text-white', 'border-rose-400');
          b.classList.add('bg-slate-800', 'text-slate-300');
        });
        btn.classList.add('bg-rose-600', 'text-white', 'border-rose-400');
        btn.classList.remove('bg-slate-800', 'text-slate-300');

        playSound('boom', { variant: btn.dataset.boomVariant });
      });
    });

    // 4. Custom Parameter Sliders
    const pitchSlider = document.getElementById('customPitch');
    const durSlider = document.getElementById('customDur');
    const crunchSlider = document.getElementById('customCrunch');
    const testCustomBtn = document.getElementById('testCustomBtn');
    const exportWavBtn = document.getElementById('exportWavBtn');
    const randomSfxBtn = document.getElementById('randomSfxBtn');

    function getCustomParams() {
      return {
        pitch: pitchSlider ? parseFloat(pitchSlider.value) : 1000,
        dur: durSlider ? parseFloat(durSlider.value) : 1.0,
        crunch: crunchSlider ? parseFloat(crunchSlider.value) : 0.8
      };
    }

    if (testCustomBtn) {
      testCustomBtn.addEventListener('click', () => {
        const soundSelect = document.getElementById('customSoundSelect');
        const selectedType = soundSelect ? soundSelect.value : lastPlayedSound;
        playSound(selectedType, getCustomParams());
      });
    }

    // 5. Random SFX Generator (SFXR Style)
    if (randomSfxBtn) {
      randomSfxBtn.addEventListener('click', () => {
        const soundTypes = ['laser', 'boom', 'coin', 'jump', 'powerup', 'hit'];
        const randomType = soundTypes[Math.floor(Math.random() * soundTypes.length)];
        
        // Randomize sliders
        if (pitchSlider) {
          const randPitch = Math.floor(Math.random() * 2400) + 150;
          pitchSlider.value = randPitch;
          const valEl = document.getElementById('pitchVal');
          if (valEl) valEl.innerText = `${randPitch}Hz`;
        }
        if (durSlider) {
          const randDur = +(Math.random() * 1.5 + 0.4).toFixed(2);
          durSlider.value = randDur;
          const valEl = document.getElementById('durVal');
          if (valEl) valEl.innerText = `${randDur}x`;
        }
        if (crunchSlider) {
          const randCrunch = +(Math.random()).toFixed(2);
          crunchSlider.value = randCrunch;
          const valEl = document.getElementById('crunchVal');
          if (valEl) valEl.innerText = `${Math.round(randCrunch * 100)}%`;
        }

        const soundSelect = document.getElementById('customSoundSelect');
        if (soundSelect) soundSelect.value = randomType;

        playSound(randomType, getCustomParams());
      });
    }

    // 6. WAV Download Button
    if (exportWavBtn) {
      exportWavBtn.addEventListener('click', () => {
        const soundSelect = document.getElementById('customSoundSelect');
        const selectedType = soundSelect ? soundSelect.value : lastPlayedSound;
        exportToWav(selectedType, getCustomParams());
      });
    }

    // 7. Slider Value Labels
    if (pitchSlider) {
      pitchSlider.addEventListener('input', (e) => {
        const el = document.getElementById('pitchVal');
        if (el) el.innerText = `${e.target.value}Hz`;
      });
    }
    if (durSlider) {
      durSlider.addEventListener('input', (e) => {
        const el = document.getElementById('durVal');
        if (el) el.innerText = `${e.target.value}x`;
      });
    }
    if (crunchSlider) {
      crunchSlider.addEventListener('input', (e) => {
        const el = document.getElementById('crunchVal');
        if (el) el.innerText = `${Math.round(e.target.value * 100)}%`;
      });
    }

    // 8. Keyboard Shortcuts (1-8 keys)
    window.addEventListener('keydown', (e) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;

      const KEY_MAP = {
        '1': 'coin',
        '2': 'jump',
        '3': 'laser',
        '4': 'boom',
        '5': 'powerup',
        '6': 'gameover',
        '7': 'hit',
        '8': 'oneup'
      };

      const soundType = KEY_MAP[e.key];
      if (soundType) {
        e.preventDefault();
        playSound(soundType);
      }
    });

    // Start Oscilloscope
    initOscilloscope();
  });

})();
