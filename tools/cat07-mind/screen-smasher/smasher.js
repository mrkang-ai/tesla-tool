// Screen Smasher Web Audio & Canvas Cracks
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('glassCanvas');
  const ctx = canvas.getContext('2d');
  const smashCountEl = document.getElementById('smashCount');
  const screenHpEl = document.getElementById('screenHp');
  const repairBtn = document.getElementById('repairBtn');

  let audioCtx = null;
  let hits = 0;
  let hp = 100;

  function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth - 24;
    canvas.height = Math.min(520, window.innerHeight * 0.6);
    drawBackground();
  }

  function drawBackground() {
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Fake error message / office desktop window inside canvas
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(canvas.width/2 - 180, canvas.height/2 - 90, 360, 180);
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 2;
    ctx.strokeRect(canvas.width/2 - 180, canvas.height/2 - 90, 360, 180);

    ctx.fillStyle = "#3b82f6";
    ctx.fillRect(canvas.width/2 - 180, canvas.height/2 - 90, 360, 30);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("CRITICAL SYSTEM ERROR 0x80004005", canvas.width/2 - 165, canvas.height/2 - 70);

    ctx.fillStyle = "#e2e8f0";
    ctx.font = "14px sans-serif";
    ctx.fillText("당신의 기획서가 부장님에 의해 반려되었습니다.", canvas.width/2 - 150, canvas.height/2 - 20);
    ctx.font = "14px sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("(클릭하여 분노를 모니터에 표출하십시오)", canvas.width/2 - 120, canvas.height/2 + 20);
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function playSmashSound() {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.12);

      // Glass shatter noise
      const bufferSize = audioCtx.sampleRate * 0.15;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for(let i=0; i<bufferSize; i++) data[i] = Math.random()*2 - 1;

      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 3500;

      const noiseGain = audioCtx.createGain();
      noiseGain.gain.setValueAtTime(0.7, audioCtx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(audioCtx.destination);

      gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);

      osc.start();
      noise.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch(e) {}
  }

  function drawCrack(x, y) {
    const rays = 8 + Math.floor(Math.random() * 8);
    const radius = 50 + Math.random() * 70;

    ctx.save();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
    ctx.shadowColor = "#ffffff";
    ctx.shadowBlur = 4;
    ctx.lineWidth = 1.5;

    for (let i = 0; i < rays; i++) {
      const angle = (Math.PI * 2 / rays) * i + (Math.random() - 0.5) * 0.5;
      let currX = x;
      let currY = y;
      const segments = 4 + Math.floor(Math.random() * 4);
      const segLen = radius / segments;

      ctx.beginPath();
      ctx.moveTo(currX, currY);

      for (let s = 0; s < segments; s++) {
        const segAngle = angle + (Math.random() - 0.5) * 0.6;
        currX += Math.cos(segAngle) * segLen;
        currY += Math.sin(segAngle) * segLen;
        ctx.lineTo(currX, currY);
      }
      ctx.stroke();
    }

    // Concentric spiderweb rings
    const rings = 2 + Math.floor(Math.random() * 3);
    for (let r = 1; r <= rings; r++) {
      ctx.beginPath();
      const ringRad = (radius / (rings + 1)) * r;
      ctx.arc(x, y, ringRad, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Black puncture hole in center
    ctx.beginPath();
    ctx.fillStyle = "#000000";
    ctx.arc(x, y, 7 + Math.random() * 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  canvas.addEventListener('pointerdown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    hits++;
    hp = Math.max(0, hp - 4);
    smashCountEl.innerText = hits;
    screenHpEl.innerText = `${hp}%`;

    playSmashSound();
    drawCrack(x, y);
  });

  repairBtn.addEventListener('click', () => {
    hits = 0;
    hp = 100;
    smashCountEl.innerText = 0;
    screenHpEl.innerText = "100%";
    drawBackground();
  });
});
