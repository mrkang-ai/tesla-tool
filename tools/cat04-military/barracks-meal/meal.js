// meal.js - Barracks Meal & PX Run Predictor
document.addEventListener('DOMContentLoaded', () => {
  const menuItemsList = document.getElementById('menuItemsList');
  const predictBtn = document.getElementById('predictBtn');
  const escapeRateDisplay = document.getElementById('escapeRateDisplay');
  const escapeComment = document.getElementById('escapeComment');
  const alertBadge = document.getElementById('alertBadge');

  const meals = [
    { name: "조기순살튀김 (조순튀)", penalty: 35, desc: "바위처럼 딱딱한 가시 덩어리" },
    { name: "해물비빔소스 (해빔소)", penalty: 40, desc: "비린내의 극치, 뚜껑 따기도 싫음" },
    { name: "된장국 (똥국)", penalty: 20, desc: "풀만 둥둥 떠다니는 정체불명 국물" },
    { name: "명태살 탕수", penalty: 25, desc: "고기 탕수육인 줄 알고 펐다가 낭패" },
    { name: "비엔나 소시지 야채볶음 (쏘야)", penalty: -30, desc: "배식대 오픈런 부르는 갓메뉴" },
    { name: "군대리아 햄버거 세트", penalty: -15, desc: "패티에 딸기잼 듬뿍, 호불호 갈림" },
    { name: "돼지 김치찌개 (고기 듬뿍)", penalty: -25, desc: "밥 두 공기 순삭 가능" }
  ];

  menuItemsList.innerHTML = meals.map((m, idx) => `
    <label class="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-700/80 cursor-pointer hover:bg-slate-900/80">
      <div class="flex items-center gap-2">
        <input type="checkbox" data-idx="${idx}" ${idx < 3 ? 'checked' : ''} class="m-cb rounded text-orange-500 bg-slate-800 border-slate-600">
        <span class="text-slate-200 font-medium">${m.name}</span>
      </div>
      <span class="text-[10px] text-slate-400 font-mono">${m.penalty > 0 ? `탈주 +${m.penalty}%` : `인기 ${m.penalty}%`}</span>
    </label>
  `).join('');

  function calc() {
    const cbs = document.querySelectorAll('.m-cb');
    let baseRate = 20; // 20% default baseline

    cbs.forEach(cb => {
      if (cb.checked) {
        const idx = parseInt(cb.getAttribute('data-idx'), 10);
        baseRate += meals[idx].penalty;
      }
    });

    const finalRate = Math.min(99, Math.max(5, baseRate));
    escapeRateDisplay.textContent = `${finalRate}%`;

    if (finalRate >= 70) {
      alertBadge.textContent = "🚨 PX 전자레인지 대전쟁 경보";
      alertBadge.className = "px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full text-xs font-bold font-mono animate-pulse";
      escapeComment.innerHTML = `🚨 <b>탈주율 ${finalRate}%:</b> 당직사관도 식당 포기하고 PX에서 컵라면 물 받는 중!`;
    } else if (finalRate >= 40) {
      alertBadge.textContent = "⚠️ PX 대기 보통";
      alertBadge.className = "px-3 py-1 bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded-full text-xs font-bold font-mono";
      escapeComment.innerHTML = `⚠️ <b>탈주율 ${finalRate}%:</b> 짬밥 절반 먹고 부족해서 맛다시 비비는 인원 급증.`;
    } else {
      alertBadge.textContent = "✅ 잔반 제로 평화의 날";
      alertBadge.className = "px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold font-mono";
      escapeComment.innerHTML = `✅ <b>탈주율 ${finalRate}%:</b> 쏘야/제육 등장으로 취사병 칭찬 폭발, PX 한산함.`;
    }
  }

  predictBtn.addEventListener('click', calc);
  document.querySelectorAll('.m-cb').forEach(c => c.addEventListener('change', calc));

  calc();
});
