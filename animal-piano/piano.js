// Animal Synthesized Piano
document.addEventListener('DOMContentLoaded', () => {
  let audioCtx = null;
  let animal = 'cat';

  const animalBtns = document.querySelectorAll('.animal-btn');
  animalBtns.forEach(b => {
    b.addEventListener('click', () => {
      animalBtns.forEach(btn => {
        btn.classList.remove('active', 'bg-amber-500', 'text-white');
        btn.classList.add('bg-slate-200', 'dark:bg-slate-700');
      });
      b.classList.add('active', 'bg-amber-500', 'text-white');
      b.classList.remove('bg-slate-200', 'dark:bg-slate-700');
      animal = b.dataset.sound;
    });
  });

  function playNote(freq) {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const t = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      if (animal === 'cat') {
        // Meow pitch glide
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq * 0.9, t);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.3, t + 0.15);
        osc.frequency.exponentialRampToValueAtTime(freq, t + 0.35);
        gain.gain.setValueAtTime(0.5, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      } else if (animal === 'dog') {
        // Bark short burst
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq * 1.4, t);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.7, t + 0.12);
        gain.gain.setValueAtTime(0.6, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      } else {
        // Quack reed sound
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      }

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.45);
    } catch(e) {}
  }

  document.querySelectorAll('.piano-key').forEach(k => {
    k.addEventListener('pointerdown', () => {
      const freq = parseFloat(k.dataset.note);
      playNote(freq);
    });
  });
});
