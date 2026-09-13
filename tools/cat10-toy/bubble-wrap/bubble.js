// Bubble Wrap Web Audio Pop Sound
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('bubbleGrid');
  const counter = document.getElementById('popCounter');
  const resetBtn = document.getElementById('resetBubblesBtn');

  let audioCtx = null;
  let poppedCount = 0;

  function playPopSound() {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      const freq = 600 + Math.random() * 400;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.7, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.07);
    } catch(e) {}
  }

  function createBubbles() {
    grid.innerHTML = "";
    for (let i = 0; i < 48; i++) {
      const bubble = document.createElement('div');
      bubble.className = "w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-gradient-to-tr from-cyan-600 via-sky-400 to-cyan-200 shadow-[0_4px_10px_rgba(6,182,212,0.4)] cursor-pointer transition-transform hover:scale-105 active:scale-95";

      bubble.addEventListener('pointerdown', () => {
        if (!bubble.classList.contains('bubble-popped')) {
          bubble.classList.add('bubble-popped');
          poppedCount++;
          counter.innerText = poppedCount;
          playPopSound();
        }
      });
      grid.appendChild(bubble);
    }
  }

  resetBtn.addEventListener('click', () => {
    createBubbles();
  });

  createBubbles();
});
