// hud.js - Exam Ambience HUD
document.addEventListener('DOMContentLoaded', () => {
  const timerDisplay = document.getElementById('timerDisplay');
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const noiseTicking = document.getElementById('noiseTicking');
  const noisePages = document.getElementById('noisePages');
  const tBtns = document.querySelectorAll('.t-btn');

  let remainingSec = 50 * 60;
  let isPlaying = false;
  let audioCtx = null;
  let tickInterval = null;

  function updateDisplay() {
    const m = Math.floor(remainingSec / 60);
    const s = remainingSec % 60;
    timerDisplay.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }

  setInterval(() => {
    if (remainingSec > 0) {
      remainingSec--;
      updateDisplay();
    }
  }, 1000);

  tBtns.forEach(b => {
    b.addEventListener('click', () => {
      remainingSec = parseInt(b.getAttribute('data-min'), 10) * 60;
      updateDisplay();
    });
  });

  function playTick() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (!noiseTicking.checked) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1000, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
  }

  soundToggleBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    if (isPlaying) {
      soundToggleBtn.innerHTML = '<i class="fa-solid fa-volume-xmark mr-1"></i> 소음 재생 중지';
      soundToggleBtn.className = "px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm rounded-xl transition flex items-center gap-2";
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      tickInterval = setInterval(playTick, 1000);
    } else {
      soundToggleBtn.innerHTML = '<i class="fa-solid fa-volume-high mr-1"></i> 실전 소음 재생 ON';
      soundToggleBtn.className = "px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition flex items-center gap-2";
      clearInterval(tickInterval);
    }
  });

  updateDisplay();
});
