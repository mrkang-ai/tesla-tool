// Global Timezone Planner
document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('hourSlider');
  const sliderDisp = document.getElementById('sliderDisplay');

  const timeSeoul = document.getElementById('timeSeoul');
  const badgeSeoul = document.getElementById('badgeSeoul');

  const timeSF = document.getElementById('timeSF');
  const badgeSF = document.getElementById('badgeSF');

  const timeLondon = document.getElementById('timeLondon');
  const badgeLondon = document.getElementById('badgeLondon');

  function update() {
    const h = parseInt(slider.value, 10);
    const ampm = h >= 12 ? '오후' : '오전';
    const dispH = h % 12 === 0 ? 12 : h % 12;
    sliderDisp.innerText = `${ampm} ${dispH.toString().padStart(2, '0')}:00 (${h}:00)`;

    // Seoul
    timeSeoul.innerText = `${h.toString().padStart(2, '0')}:00`;
    setBadge(badgeSeoul, h);

    // SF (UTC-7 vs Seoul UTC+9 = -16 hours)
    let sfH = h - 16;
    let sfDay = "";
    if (sfH < 0) { sfH += 24; sfDay = " (전날)"; }
    timeSF.innerText = `${sfH.toString().padStart(2, '0')}:00${sfDay}`;
    setBadge(badgeSF, sfH);

    // London (UTC+1 vs Seoul UTC+9 = -8 hours)
    let lonH = h - 8;
    let lonDay = "";
    if (lonH < 0) { lonH += 24; lonDay = " (전날)"; }
    timeLondon.innerText = `${lonH.toString().padStart(2, '0')}:00${lonDay}`;
    setBadge(badgeLondon, lonH);
  }

  function setBadge(el, hour) {
    if (hour >= 9 && hour <= 18) {
      el.innerText = "🟢 업무 시간";
      el.className = "text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300";
    } else if ((hour >= 7 && hour < 9) || (hour > 18 && hour <= 21)) {
      el.innerText = "🟡 출퇴근/식사";
      el.className = "text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";
    } else {
      el.innerText = "🔴 취침/심야";
      el.className = "text-[11px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300";
    }
  }

  slider.addEventListener('input', update);
  update();
});
