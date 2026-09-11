// blackhole.js - Dopamine Black Hole
document.addEventListener('DOMContentLoaded', () => {
  const blackholeArena = document.getElementById('blackholeArena');
  const holeDot = document.getElementById('holeDot');
  const holeStatus = document.getElementById('holeStatus');
  const timerSec = document.getElementById('timerSec');
  const startHoleBtn = document.getElementById('startHoleBtn');

  let running = false;
  let elapsed = 0;
  let timerId = null;

  startHoleBtn.addEventListener('click', () => {
    if (!running) {
      running = true;
      elapsed = 0;
      startHoleBtn.classList.add('hidden');
      holeDot.className = "w-16 h-16 rounded-full bg-indigo-950 border border-indigo-500/40 shadow-[0_0_60px_#6366f1] transition-all duration-1000 mb-4 animate-pulse";
      holeStatus.textContent = "아무것도 건드리지 마세요. 뇌를 완전히 비웁니다.";
      holeStatus.className = "text-xl font-mono text-slate-400";

      timerId = setInterval(() => {
        elapsed++;
        const m = Math.floor(elapsed / 60);
        const s = elapsed % 60;
        timerSec.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
      }, 1000);
    }
  });

  // If user moves mouse or keys inside arena, warning
  blackholeArena.addEventListener('mousemove', () => {
    if (running && elapsed > 2) {
      holeStatus.textContent = "⚠️ 움직임 감지! 손을 떼고 온전히 호흡에 집중하세요.";
      setTimeout(() => {
        if (running) holeStatus.textContent = "아무것도 건드리지 마세요. 뇌를 완전히 비웁니다.";
      }, 2000);
    }
  });
});
