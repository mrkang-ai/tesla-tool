// SETI Alien Signal Generator
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('setiCanvas');
  const ctx = canvas.getContext('2d');
  const transmitBtn = document.getElementById('transmitBtn');
  const signalMode = document.getElementById('signalMode');

  let audioCtx = null;
  let isTransmitting = false;
  let osc = null;
  let gain = null;
  let animId = null;

  function resize() {
    canvas.width = canvas.parentElement.clientWidth - 48;
    canvas.height = 190;
  }
  window.addEventListener('resize', resize);
  resize();

  function drawWave() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 2;
    ctx.beginPath();

    const t = Date.now() * 0.005;
    for (let x = 0; x < canvas.width; x++) {
      const y = canvas.height / 2 + Math.sin(x * 0.05 + t) * 35 * (isTransmitting ? 1.5 : 0.2) + (Math.random() - 0.5) * (isTransmitting ? 15 : 4);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    animId = requestAnimationFrame(drawWave);
  }
  drawWave();

  function startAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    osc = audioCtx.createOscillator();
    gain = audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(440, audioCtx.currentTime);

    // Alien modulation
    const lfo = audioCtx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 6;
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.value = 80;

    lfo.connect(osc.frequency);
    lfo.start();

    gain.gain.value = 0.3;
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
  }

  function stopAudio() {
    if (osc) {
      osc.stop();
      osc.disconnect();
      osc = null;
    }
  }

  transmitBtn.addEventListener('click', () => {
    isTransmitting = !isTransmitting;
    if (isTransmitting) {
      startAudio();
      transmitBtn.classList.replace('bg-emerald-600', 'bg-rose-600');
      transmitBtn.classList.replace('hover:bg-emerald-500', 'hover:bg-rose-500');
      transmitBtn.classList.add('text-white');
      transmitBtn.innerHTML = '<i class="fa-solid fa-stop"></i> <span>송출 중단</span>';
    } else {
      stopAudio();
      transmitBtn.classList.replace('bg-rose-600', 'bg-emerald-600');
      transmitBtn.classList.replace('hover:bg-rose-500', 'hover:bg-emerald-500');
      transmitBtn.classList.remove('text-white');
      transmitBtn.innerHTML = '<i class="fa-solid fa-tower-broadcast"></i> <span>심우주로 신호 송출 시작 (Web Audio)</span>';
    }
  });
});
