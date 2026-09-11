// reaction.js - Military Reaction Test
document.addEventListener('DOMContentLoaded', () => {
  const testArena = document.getElementById('testArena');
  const arenaIcon = document.getElementById('arenaIcon');
  const arenaTitle = document.getElementById('arenaTitle');
  const arenaDesc = document.getElementById('arenaDesc');
  const recentScore = document.getElementById('recentScore');
  const gradeDisplay = document.getElementById('gradeDisplay');
  const bestScore = document.getElementById('bestScore');

  let state = 'idle'; // 'idle' | 'waiting' | 'ready' | 'result'
  let startTime = 0;
  let timerId = null;
  let best = Infinity;

  function playShout() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.8, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch(e) {}
  }

  testArena.addEventListener('click', () => {
    if (state === 'idle' || state === 'result') {
      // Start waiting
      state = 'waiting';
      testArena.className = "w-full h-80 rounded-2xl bg-rose-950 border-2 border-rose-500 flex flex-col items-center justify-center p-6 text-center cursor-pointer select-none transition-colors shadow-2xl";
      arenaIcon.textContent = "⏳";
      arenaTitle.textContent = "집중... 긴장 유지...";
      arenaDesc.textContent = "초록색으로 바뀌기 전에 누르면 얼차려(부정 출발)입니다!";

      const delay = Math.floor(Math.random() * 3000) + 1800;
      timerId = setTimeout(() => {
        state = 'ready';
        startTime = performance.now();
        playShout();
        testArena.className = "w-full h-80 rounded-2xl bg-yellow-500 text-slate-950 border-2 border-yellow-300 flex flex-col items-center justify-center p-6 text-center cursor-pointer select-none transition-colors shadow-2xl";
        arenaIcon.textContent = "⚡";
        arenaTitle.textContent = "야! (지금 클릭!!!)";
        arenaDesc.textContent = "관등성명을 외치세요: 병장! 홍! 길! 동!";
      }, delay);

    } else if (state === 'waiting') {
      // Too early!
      clearTimeout(timerId);
      state = 'result';
      testArena.className = "w-full h-80 rounded-2xl bg-slate-800 border-2 border-rose-600 flex flex-col items-center justify-center p-6 text-center cursor-pointer select-none shadow-2xl";
      arenaIcon.textContent = "🚨";
      arenaTitle.textContent = "부정 출발! (동작 그만!)";
      arenaDesc.textContent = "선임이 부르지도 않았는데 반응했습니다. 다시 클릭하여 재도전하세요.";
      gradeDisplay.textContent = "얼차려 대상 (군기 불량)";
      gradeDisplay.className = "text-sm font-bold text-rose-400 mt-2 block";

    } else if (state === 'ready') {
      // Hit!
      const elapsed = Math.round(performance.now() - startTime);
      state = 'result';

      recentScore.textContent = `${elapsed} ms`;
      if (elapsed < best) {
        best = elapsed;
        bestScore.textContent = `${best} ms`;
      }

      testArena.className = "w-full h-80 rounded-2xl bg-emerald-950 border-2 border-emerald-500 flex flex-col items-center justify-center p-6 text-center cursor-pointer select-none shadow-2xl";
      arenaIcon.textContent = "🎖️";
      arenaTitle.textContent = `${elapsed} ms! 관등성명 완료!`;
      arenaDesc.textContent = "다시 측정하려면 클릭하세요.";

      if (elapsed <= 190) {
        gradeDisplay.textContent = "초음속 특급전사 (전설의 이병)";
        gradeDisplay.className = "text-sm font-bold text-emerald-400 mt-2 block";
      } else if (elapsed <= 250) {
        gradeDisplay.textContent = "군기 바짝 일병 (합격)";
        gradeDisplay.className = "text-sm font-bold text-yellow-400 mt-2 block";
      } else if (elapsed <= 330) {
        gradeDisplay.textContent = "여유로운 상병 (보통)";
        gradeDisplay.className = "text-sm font-bold text-slate-300 mt-2 block";
      } else {
        gradeDisplay.textContent = "말년 병장 (귀찮아서 굼뜸)";
        gradeDisplay.className = "text-sm font-bold text-slate-400 mt-2 block";
      }
    }
  });
});
