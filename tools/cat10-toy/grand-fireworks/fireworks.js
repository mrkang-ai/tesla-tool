// Grand Fireworks Celebration Particle & Sound
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('fireworksCanvas');
  const ctx = canvas.getContext('2d');
  let audioCtx = null;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const particles = [];
  const colors = ["#fbbf24", "#f43f5e", "#a855f7", "#38bdf8", "#34d399", "#ffffff"];

  class FireworkParticle {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 2;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.color = color;
      this.life = 1.0;
      this.decay = Math.random() * 0.02 + 0.01;
      this.radius = Math.random() * 3 + 2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.08; // gravity
      this.life -= this.decay;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.life);
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function playBoomSound() {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const t = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, t);
      osc.frequency.exponentialRampToValueAtTime(30, t + 0.3);

      gain.gain.setValueAtTime(0.6, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.36);
    } catch(e) {}
  }

  function launchBoom(x, y) {
    playBoomSound();
    const count = 70 + Math.floor(Math.random() * 30);
    const col = colors[Math.floor(Math.random() * colors.length)];
    for (let i = 0; i < count; i++) {
      particles.push(new FireworkParticle(x, y, col));
    }
  }

  canvas.addEventListener('pointerdown', (e) => {
    launchBoom(e.clientX, e.clientY);
  });

  // Auto trigger
  setInterval(() => {
    const rx = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
    const ry = Math.random() * canvas.height * 0.5 + canvas.height * 0.1;
    launchBoom(rx, ry);
  }, 900);

  function loop() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw();
      if (p.life <= 0) particles.splice(i, 1);
    }

    requestAnimationFrame(loop);
  }
  loop();

  // Launch confetti celebration
  if (typeof confetti === 'function') {
    setTimeout(() => {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    }, 500);
  }
});
