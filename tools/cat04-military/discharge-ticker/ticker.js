// ticker.js - Military Discharge Ticker
document.addEventListener('DOMContentLoaded', () => {
  const percentDisplay = document.getElementById('percentDisplay');
  const progressBar = document.getElementById('progressBar');
  const daysLeft = document.getElementById('daysLeft');
  const mealsLeft = document.getElementById('mealsLeft');
  const guardLeft = document.getElementById('guardLeft');
  const rankBadge = document.getElementById('rankBadge');
  const branchType = document.getElementById('branchType');
  const enlistDate = document.getElementById('enlistDate');
  const dischargeDate = document.getElementById('dischargeDate');

  // Default dates: enlisted 10 months ago, 18 months total
  const now = new Date();
  const defStart = new Date(now.getFullYear(), now.getMonth() - 10, now.getDate());
  const defEnd = new Date(defStart.getFullYear(), defStart.getMonth() + 18, defStart.getDate());

  enlistDate.value = defStart.toISOString().split('T')[0];
  dischargeDate.value = defEnd.toISOString().split('T')[0];

  function autoCalcEnd() {
    const months = parseInt(branchType.value, 10);
    const s = new Date(enlistDate.value);
    if (!isNaN(s.getTime())) {
      const e = new Date(s.getFullYear(), s.getMonth() + months, s.getDate() - 1);
      dischargeDate.value = e.toISOString().split('T')[0];
    }
  }

  branchType.addEventListener('change', autoCalcEnd);
  enlistDate.addEventListener('change', autoCalcEnd);

  function update() {
    const start = new Date(enlistDate.value + "T00:00:00").getTime();
    const end = new Date(dischargeDate.value + "T23:59:59").getTime();
    const current = Date.now();

    const totalMs = end - start;
    const passedMs = current - start;

    let percent = (passedMs / totalMs) * 100;
    if (percent < 0) percent = 0;
    if (percent > 100) percent = 100;

    percentDisplay.textContent = `${percent.toFixed(7)}%`;
    progressBar.style.width = `${Math.min(100, Math.max(0, percent))}%`;

    const remainingMs = Math.max(0, end - current);
    const dLeft = Math.ceil(remainingMs / (1000 * 3600 * 24));
    daysLeft.textContent = `${dLeft} 일`;
    mealsLeft.textContent = `${dLeft * 3} 끼`;
    guardLeft.textContent = `약 ${Math.round(dLeft / 4.5)} 회`;

    if (percent >= 100) {
      rankBadge.textContent = "전역 축하합니다! (예비역 병장)";
      rankBadge.className = "px-3 py-1 bg-emerald-500 text-slate-950 font-bold rounded-full text-xs font-mono animate-bounce";
    } else if (percent >= 75) {
      rankBadge.textContent = "계급: 병장 (말년 모드)";
      rankBadge.className = "px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold font-mono";
    } else if (percent >= 45) {
      rankBadge.textContent = "계급: 상병 (에이스 & 실세)";
      rankBadge.className = "px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-xs font-bold font-mono";
    } else if (percent >= 15) {
      rankBadge.textContent = "계급: 일병 (체력 소모 최대)";
      rankBadge.className = "px-3 py-1 bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded-full text-xs font-bold font-mono";
    } else {
      rankBadge.textContent = "계급: 이등병 (군기 바짝)";
      rankBadge.className = "px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full text-xs font-bold font-mono";
    }

    requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
});
