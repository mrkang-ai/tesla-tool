// deadline.js - Assignment Deadline Panic HUD
document.addEventListener('DOMContentLoaded', () => {
  const countdownClock = document.getElementById('countdownClock');
  const add5Min = document.getElementById('add5Min');
  const set10Min = document.getElementById('set10Min');
  const set1Min = document.getElementById('set1Min');
  const panicToggleBtn = document.getElementById('panicToggleBtn');
  const calmBtn = document.getElementById('calmBtn');
  const pageBody = document.getElementById('pageBody');

  let remainingMs = 10 * 60 * 1000;
  let isRunning = true;
  let isPanic = false;
  let lastTime = performance.now();

  function tick(now) {
    const delta = now - lastTime;
    lastTime = now;

    if (isRunning && remainingMs > 0) {
      remainingMs -= delta;
      if (remainingMs <= 0) remainingMs = 0;
    }

    const totalSec = Math.floor(remainingMs / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    const msTenth = Math.floor((remainingMs % 1000) / 100);

    countdownClock.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${msTenth}`;

    if (remainingMs === 0) {
      countdownClock.textContent = "00:00:00.0 (DEADLINE END)";
      countdownClock.className = "text-5xl sm:text-7xl font-mono font-black text-rose-500 animate-bounce";
    }

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  add5Min.addEventListener('click', () => remainingMs += 5 * 60 * 1000);
  set10Min.addEventListener('click', () => remainingMs = 10 * 60 * 1000);
  set1Min.addEventListener('click', () => remainingMs = 60 * 1000);

  panicToggleBtn.addEventListener('click', () => {
    isPanic = !isPanic;
    if (isPanic) {
      pageBody.classList.add('screen-shake');
      panicToggleBtn.textContent = "패닉 모드 OFF";
      panicToggleBtn.className = "px-6 py-3 bg-slate-700 text-white font-bold rounded-xl text-sm transition";
      playHeartbeat();
    } else {
      pageBody.classList.remove('screen-shake');
      panicToggleBtn.textContent = "패닉 아드레날린 모드 ON";
      panicToggleBtn.className = "px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl text-sm transition";
    }
  });

  calmBtn.addEventListener('click', () => {
    isPanic = false;
    pageBody.classList.remove('screen-shake');
    panicToggleBtn.textContent = "패닉 아드레날린 모드 ON";
    panicToggleBtn.className = "px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl text-sm transition";
    alert("심호흡을 크게 세 번 하세요. 과제는 이미 당신이 할 수 있는 최선에 도달했습니다.");
  });

  // Heartbeat sound
  function playHeartbeat() {
    if (!isPanic) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(80, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.8, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);

      setTimeout(playHeartbeat, 600);
    } catch(e) {}
  }
});
