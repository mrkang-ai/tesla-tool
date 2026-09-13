// Indecision Terminator Coin Flip & Sound
document.addEventListener('DOMContentLoaded', () => {
  const coin = document.getElementById('coinContainer');
  const coinFace = document.getElementById('coinFace');
  const tossBtn = document.getElementById('tossBtn');
  const choiceA = document.getElementById('choiceA');
  const choiceB = document.getElementById('choiceB');
  const decisionResult = document.getElementById('decisionResult');
  const winningText = document.getElementById('winningText');

  let audioCtx = null;
  let isFlipping = false;

  function playTossSound() {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1600, audioCtx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch(e) {}
  }

  function playCatchSound() {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch(e) {}
  }

  function flip() {
    if (isFlipping) return;
    isFlipping = true;
    decisionResult.classList.add('hidden');
    playTossSound();

    coin.classList.remove('flipping');
    void coin.offsetWidth; // trigger reflow
    coin.classList.add('flipping');

    setTimeout(() => {
      const isA = Math.random() < 0.5;
      const textA = choiceA.value.trim() || "앞면 A";
      const textB = choiceB.value.trim() || "뒷면 B";

      if (isA) {
        coinFace.innerText = "앞면";
        winningText.innerText = `👉 ${textA}`;
      } else {
        coinFace.innerText = "뒷면";
        winningText.innerText = `👉 ${textB}`;
      }

      playCatchSound();
      decisionResult.classList.remove('hidden');
      isFlipping = false;
    }, 1200);
  }

  tossBtn.addEventListener('click', flip);
  coin.addEventListener('click', flip);

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
      e.preventDefault();
      flip();
    }
  });
});
