// caffeine.js - Caffeine Limit Calculator
document.addEventListener('DOMContentLoaded', () => {
  const drinkList = document.getElementById('drinkList');
  const userWeight = document.getElementById('userWeight');
  const resetDrinkBtn = document.getElementById('resetDrinkBtn');
  const totalCaffeineDisplay = document.getElementById('totalCaffeineDisplay');
  const caffeineBar = document.getElementById('caffeineBar');
  const dangerZoneBadge = document.getElementById('dangerZoneBadge');
  const symptomText = document.getElementById('symptomText');
  const peakHours = document.getElementById('peakHours');
  const decayTime = document.getElementById('decayTime');

  const drinks = [
    { name: "스누피 더 진한 커피우유 (악마의 음료)", mg: 237, count: 1 },
    { name: "몬스터 에너지 (355ml)", mg: 100, count: 0 },
    { name: "아이스 아메리카노 (톨/기본 2샷)", mg: 150, count: 0 },
    { name: "핫식스 (250ml)", mg: 60, count: 0 },
    { name: "박카스 F", mg: 30, count: 0 },
    { name: "녹차 / 홍차 (1잔)", mg: 35, count: 0 }
  ];

  function renderDrinks() {
    drinkList.innerHTML = drinks.map((d, idx) => `
      <div class="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs">
        <div>
          <span class="font-semibold text-slate-200 block">${d.name}</span>
          <span class="text-[10px] text-amber-400 font-mono">${d.mg} mg</span>
        </div>
        <div class="flex items-center gap-2">
          <button data-idx="${idx}" class="minus-btn w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold">-</button>
          <span class="w-6 text-center font-mono font-bold text-yellow-300">${d.count}</span>
          <button data-idx="${idx}" class="plus-btn w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold">+</button>
        </div>
      </div>
    `).join('');

    document.querySelectorAll('.plus-btn').forEach(b => {
      b.addEventListener('click', () => {
        const idx = parseInt(b.getAttribute('data-idx'), 10);
        drinks[idx].count++;
        renderDrinks();
        update();
      });
    });

    document.querySelectorAll('.minus-btn').forEach(b => {
      b.addEventListener('click', () => {
        const idx = parseInt(b.getAttribute('data-idx'), 10);
        if (drinks[idx].count > 0) {
          drinks[idx].count--;
          renderDrinks();
          update();
        }
      });
    });
  }

  function update() {
    let totalMg = drinks.reduce((acc, cur) => acc + cur.mg * cur.count, 0);
    const weight = parseInt(userWeight.value, 10) || 60;
    const maxSafe = weight * 6; // ~360-400mg

    totalCaffeineDisplay.textContent = `${totalMg} mg`;

    const percent = Math.min(100, Math.round((totalMg / 500) * 100));
    caffeineBar.style.width = `${percent}%`;

    // Half life calculation: 5 hours
    const now = new Date();
    const halfDate = new Date(now.getTime() + 5 * 3600 * 1000);
    decayTime.textContent = `${String(halfDate.getHours()).padStart(2,'0')}:${String(halfDate.getMinutes()).padStart(2,'0')}`;

    if (totalMg <= 200) {
      caffeineBar.className = "bg-emerald-500 h-full transition-all duration-300";
      dangerZoneBadge.className = "px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold";
      dangerZoneBadge.textContent = "상태: 안전 각성존";
      symptomText.textContent = "• 집중력과 두뇌 회전이 쾌적하게 유지되는 이상적인 벼락치기 구간입니다.";
      peakHours.textContent = "약 3~4 시간";
    } else if (totalMg <= 400) {
      caffeineBar.className = "bg-yellow-500 h-full transition-all duration-300";
      dangerZoneBadge.className = "px-3 py-1 bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded-full text-xs font-bold";
      dangerZoneBadge.textContent = "상태: 주의 각성존";
      symptomText.textContent = "• 경미한 심박수 증가와 가벼운 이뇨 작용이 시작됩니다. 물을 충분히 섭취하세요.";
      peakHours.textContent = "약 5~6 시간";
    } else if (totalMg <= 600) {
      caffeineBar.className = "bg-orange-500 h-full transition-all duration-300";
      dangerZoneBadge.className = "px-3 py-1 bg-orange-500/20 text-orange-300 border border-orange-500/30 rounded-full text-xs font-bold";
      dangerZoneBadge.textContent = "상태: 위험 (손떨림 구간)";
      symptomText.textContent = "• 손떨림, 동공 확대, 안구 건조, 두통 및 위산 역류 위험이 있습니다. 추가 카페인 섭취를 즉시 멈추세요!";
      peakHours.textContent = "약 7~8 시간";
    } else {
      caffeineBar.className = "bg-rose-500 h-full transition-all duration-300";
      dangerZoneBadge.className = "px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full text-xs font-bold animate-pulse";
      dangerZoneBadge.textContent = "상태: 심장 폭주 (즉시 중단)";
      symptomText.textContent = "• 극심한 심장 두근거림 및 공황 불안 유발 가능! 시험 망치기 직전입니다. 즉시 물 1리터를 마시고 휴식을 취하십시오.";
      peakHours.textContent = "10시간 이상 지속";
    }
  }

  resetDrinkBtn.addEventListener('click', () => {
    drinks.forEach(d => d.count = 0);
    renderDrinks();
    update();
  });

  userWeight.addEventListener('input', update);

  renderDrinks();
  update();
});
