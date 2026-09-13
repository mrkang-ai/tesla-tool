// Horizon Coordinate Realtime Drift Simulator
document.addEventListener('DOMContentLoaded', () => {
  let isAnchored = false;
  let elapsedSec = 0;
  let timer = null;

  const rotEl = document.getElementById('rotationDist');
  const orbEl = document.getElementById('orbitDist');
  const galEl = document.getElementById('galaxyDist');
  const toggleBtn = document.getElementById('toggleAnchorBtn');

  function tick() {
    elapsedSec += 0.05;
    const rotKm = elapsedSec * 0.465; // ~465 m/s
    const orbKm = elapsedSec * 29.78; // ~29.78 km/s
    const galKm = elapsedSec * 230.0; // ~230 km/s

    rotEl.innerText = `${rotKm.toFixed(2)} km`;
    orbEl.innerText = `${orbKm.toFixed(2)} km`;
    galEl.innerText = `${galKm.toFixed(2)} km`;
  }

  toggleBtn.addEventListener('click', () => {
    isAnchored = !isAnchored;
    if (isAnchored) {
      toggleBtn.innerText = "지구 좌표계로 복귀 (재동기화)";
      toggleBtn.classList.replace('bg-cyan-500', 'bg-rose-500');
      toggleBtn.classList.replace('text-slate-950', 'text-white');
      elapsedSec = 0;
      clearInterval(timer);
      timer = setInterval(tick, 50);
    } else {
      toggleBtn.innerText = "좌표 고정 해제 (지구 탈출)";
      toggleBtn.classList.replace('bg-rose-500', 'bg-cyan-500');
      toggleBtn.classList.replace('text-white', 'text-slate-950');
      clearInterval(timer);
      rotEl.innerText = "0.00 km (지구 표면)";
      orbEl.innerText = "0.00 km (지구 동기화)";
      galEl.innerText = "0.00 km (지구 동기화)";
    }
  });
});
