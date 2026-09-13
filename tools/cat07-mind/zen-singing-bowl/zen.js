// Web Audio Singing Bowl & Ambient Generator
document.addEventListener('DOMContentLoaded', () => {
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  // 432Hz Singing Bowl strike with harmonics (432Hz, 864Hz, 1296Hz)
  function strikeBowl() {
    initAudio();
    const t = audioCtx.currentTime;
    const freqs = [432, 432 * 2.76, 432 * 5.4, 432 * 8.9];
    const gains = [0.6, 0.25, 0.1, 0.04];
    const decays = [8.5, 6.0, 4.0, 2.5];

    freqs.forEach((f, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t);

      // Subtle warm pitch vibrato
      const lfo = audioCtx.createOscillator();
      const lfoGain = audioCtx.createGain();
      lfo.frequency.value = 4.5;
      lfoGain.gain.value = 1.2;
      lfo.connect(osc.frequency);
      lfo.start(t);
      lfo.stop(t + decays[i]);

      gain.gain.setValueAtTime(gains[i], t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + decays[i]);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(t);
      osc.stop(t + decays[i]);
    });
  }

  const bowlBtn = document.getElementById('bowlBtn');
  bowlBtn.addEventListener('click', strikeBowl);

  // Rain White Noise Loop
  let rainSource = null;
  let rainGain = null;
  let isRainOn = false;
  const rainToggle = document.getElementById('rainToggle');
  const rainVol = document.getElementById('rainVol');

  function startRain() {
    initAudio();
    const bufferSize = audioCtx.sampleRate * 2;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + (0.02 * white)) / 1.02; // Pink-ish noise
      lastOut = data[i];
      data[i] *= 3.5;
    }
    rainSource = audioCtx.createBufferSource();
    rainSource.buffer = buffer;
    rainSource.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;

    rainGain = audioCtx.createGain();
    rainGain.gain.value = parseFloat(rainVol.value) * 0.4;

    rainSource.connect(filter);
    filter.connect(rainGain);
    rainGain.connect(audioCtx.destination);
    rainSource.start();
  }

  rainToggle.addEventListener('click', () => {
    isRainOn = !isRainOn;
    if (isRainOn) {
      startRain();
      rainToggle.innerText = 'ON';
      rainToggle.classList.replace('bg-slate-700', 'bg-cyan-600');
    } else {
      if (rainSource) { rainSource.stop(); rainSource.disconnect(); }
      rainToggle.innerText = 'OFF';
      rainToggle.classList.replace('bg-cyan-600', 'bg-slate-700');
    }
  });

  rainVol.addEventListener('input', () => {
    if (rainGain) rainGain.gain.value = parseFloat(rainVol.value) * 0.4;
  });

  // Fireplace Sound
  let fireTimer = null;
  let isFireOn = false;
  const fireToggle = document.getElementById('fireToggle');
  const fireVol = document.getElementById('fireVol');

  function triggerFireCrackle() {
    if (!isFireOn) return;
    initAudio();
    const t = audioCtx.currentTime;
    const bufferSize = audioCtx.sampleRate * 0.04;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 2500 + Math.random() * 2000;

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(parseFloat(fireVol.value) * (0.2 + Math.random() * 0.3), t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    noise.start(t);

    fireTimer = setTimeout(triggerFireCrackle, 50 + Math.random() * 300);
  }

  fireToggle.addEventListener('click', () => {
    isFireOn = !isFireOn;
    if (isFireOn) {
      triggerFireCrackle();
      fireToggle.innerText = 'ON';
      fireToggle.classList.replace('bg-slate-700', 'bg-orange-600');
    } else {
      clearTimeout(fireTimer);
      fireToggle.innerText = 'OFF';
      fireToggle.classList.replace('bg-orange-600', 'bg-slate-700');
    }
  });
});
