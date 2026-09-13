// Mosquito Zap Web Audio & High Pitch Frequency
document.addEventListener('DOMContentLoaded', () => {
  let audioCtx = null;
  let zapCount = 0;
  let ultraOsc = null;
  let isUltraOn = false;

  const zapBtn = document.getElementById('zapBtn');
  const ultraBtn = document.getElementById('ultraBtn');
  const moIcon = document.getElementById('buzzingMosquito');
  const zapCountEl = document.getElementById('zapCount');

  function initAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  function playZapSound() {
    initAudio();
    const t = audioCtx.currentTime;
    const bufferSize = audioCtx.sampleRate * 0.12;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 3000;

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.8, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    noise.start(t);
  }

  zapBtn.addEventListener('click', () => {
    zapCount++;
    zapCountEl.innerText = zapCount;
    playZapSound();
    moIcon.innerText = "💥";
    setTimeout(() => { moIcon.innerText = "🦟"; }, 300);
  });

  moIcon.addEventListener('click', () => {
    zapBtn.click();
  });

  ultraBtn.addEventListener('click', () => {
    initAudio();
    isUltraOn = !isUltraOn;
    if (isUltraOn) {
      ultraOsc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      ultraOsc.type = 'sine';
      ultraOsc.frequency.value = 17400; // 17.4kHz mosquito frequency
      gain.gain.value = 0.05;
      ultraOsc.connect(gain);
      gain.connect(audioCtx.destination);
      ultraOsc.start();
      ultraBtn.innerText = "초음파 정지 (STOP)";
      ultraBtn.classList.replace('bg-slate-700', 'bg-emerald-600');
    } else {
      if (ultraOsc) { ultraOsc.stop(); ultraOsc.disconnect(); ultraOsc = null; }
      ultraBtn.innerHTML = '<i class="fa-solid fa-wave-square"></i> 17.4kHz 초음파 재생';
      ultraBtn.classList.replace('bg-emerald-600', 'bg-slate-700');
    }
  });
});
