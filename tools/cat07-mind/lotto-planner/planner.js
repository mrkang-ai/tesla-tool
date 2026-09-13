// Lotto Jackpot Planner Logic
document.addEventListener('DOMContentLoaded', () => {
  const TOTAL_NET = 14.1; // 14.1 Billion KRW

  const reInput = document.getElementById('realEstate');
  const famInput = document.getElementById('family');
  const carInput = document.getElementById('car');
  const trvInput = document.getElementById('travel');

  const reVal = document.getElementById('realEstateVal');
  const famVal = document.getElementById('familyVal');
  const carVal = document.getElementById('carVal');
  const trvVal = document.getElementById('travelVal');
  const remEl = document.getElementById('remainingBudget');

  function update() {
    const re = parseFloat(reInput.value);
    const fam = parseFloat(famInput.value);
    const car = parseFloat(carInput.value);
    const trv = parseFloat(trvInput.value);

    reVal.innerText = `${re}억 원`;
    famVal.innerText = `${fam.toFixed(1)}억 원`;
    carVal.innerText = `${car.toFixed(1)}억 원`;
    trvVal.innerText = `${trv.toFixed(1)}억 원`;

    const spent = re + fam + car + trv;
    const remaining = TOTAL_NET - spent;

    if (remaining < 0) {
      remEl.innerText = `⚠️ 파산! ${Math.abs(remaining).toFixed(1)}억 원 초과 지출`;
      remEl.className = "text-xl font-mono font-black text-rose-200 animate-pulse";
    } else {
      remEl.innerText = `${remaining.toFixed(1)}억 원 (안전자산 예금 & 배당주)`;
      remEl.className = "text-xl font-mono font-black text-white";
    }
  }

  [reInput, famInput, carInput, trvInput].forEach(inp => inp.addEventListener('input', update));
  update();
});
