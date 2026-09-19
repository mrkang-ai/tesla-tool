// gpa.js - GPA Recovery Simulator
document.addEventListener('DOMContentLoaded', () => {
  const currentGpa = document.getElementById('currentGpa');
  const currentCredits = document.getElementById('currentCredits');
  const gradCredits = document.getElementById('gradCredits');
  const futureGpaSlider = document.getElementById('futureGpaSlider');
  const futureGpaVal = document.getElementById('futureGpaVal');
  const retakeList = document.getElementById('retakeList');
  const addRetakeBtn = document.getElementById('addRetakeBtn');
  const calcGpaBtn = document.getElementById('calcGpaBtn');
  const finalGpaDisplay = document.getElementById('finalGpaDisplay');
  const gpaComment = document.getElementById('gpaComment');
  const m1 = document.getElementById('m1');
  const m2 = document.getElementById('m2');
  const m3 = document.getElementById('m3');

  let retakes = [
    { name: "선형대수학", credit: 3, oldG: 0.0, newG: 4.5 },
    { name: "운영체제", credit: 3, oldG: 1.5, newG: 4.0 }
  ];

  function renderRetakes() {
    retakeList.innerHTML = retakes.map((r, idx) => `
      <div class="flex items-center gap-2 bg-slate-900/60 p-2 rounded border border-slate-700 text-sm">
        <input type="text" value="${r.name}" data-idx="${idx}" class="r-name flex-1 bg-slate-800 rounded px-2 py-1 text-slate-200">
        <span class="text-slate-400 text-sm">${r.credit}학점</span>
        <div class="flex items-center gap-1 font-mono">
          <span class="text-rose-400 font-bold">${r.oldG.toFixed(1)}</span>
          <span class="text-slate-500">→</span>
          <span class="text-cyan-400 font-bold">${r.newG.toFixed(1)}</span>
        </div>
        <button data-idx="${idx}" class="del-r text-slate-500 hover:text-rose-400 px-1"><i class="fa-solid fa-xmark"></i></button>
      </div>
    `).join('');

    document.querySelectorAll('.del-r').forEach(b => {
      b.addEventListener('click', (e) => {
        const idx = parseInt(b.getAttribute('data-idx'), 10);
        retakes.splice(idx, 1);
        renderRetakes();
        calculate();
      });
    });
  }

  addRetakeBtn.addEventListener('click', () => {
    retakes.push({ name: "교양과목", credit: 3, oldG: 1.0, newG: 4.5 });
    renderRetakes();
    calculate();
  });

  futureGpaSlider.addEventListener('input', () => {
    futureGpaVal.textContent = parseFloat(futureGpaSlider.value).toFixed(2);
    calculate();
  });

  function calculate() {
    const curG = parseFloat(currentGpa.value) || 0;
    const curC = parseInt(currentCredits.value, 10) || 0;
    const gradC = parseInt(gradCredits.value, 10) || 130;
    const futG = parseFloat(futureGpaSlider.value) || 4.0;

    let currentTotalPts = curG * curC;

    // Apply retake deltas
    retakes.forEach(r => {
      const delta = (r.newG - r.oldG) * r.credit;
      currentTotalPts += delta;
    });

    const remainingCredits = Math.max(0, gradC - curC);
    const futurePts = remainingCredits * futG;

    const finalGpa = (currentTotalPts + futurePts) / gradC;
    const formatted = Math.min(4.5, Math.max(0, finalGpa)).toFixed(2);

    finalGpaDisplay.textContent = formatted;

    if (finalGpa >= 3.75) {
      gpaComment.innerHTML = "🏆 <b>상위 10% 우등 졸업 및 성적 장학금권</b> 진입 성공!";
      m1.querySelector('span:last-child').className = "text-sm font-bold text-emerald-400";
      m2.querySelector('span:last-child').className = "text-sm font-bold text-emerald-400";
      m3.querySelector('span:last-child').className = "text-sm font-bold text-emerald-400";
      m3.querySelector('span:last-child').textContent = "장학금 유력 👑";
    } else if (finalGpa >= 3.0) {
      gpaComment.innerHTML = "🎯 <b>대기업/공기업 공채 서류 프리패스권(3.0 이상)</b> 안착 완료!";
      m1.querySelector('span:last-child').className = "text-sm font-bold text-emerald-400";
      m2.querySelector('span:last-child').className = "text-sm font-bold text-emerald-400";
      m3.querySelector('span:last-child').className = "text-sm font-bold text-yellow-400";
      m3.querySelector('span:last-child').textContent = "근접 (+0.3필요)";
    } else {
      gpaComment.innerHTML = "⚠️ 아직 3.0 미만입니다. 남은 학기 재수강 과목을 1~2개 더 추가하세요!";
      m1.querySelector('span:last-child').className = "text-sm font-bold text-emerald-400";
      m2.querySelector('span:last-child').className = "text-sm font-bold text-rose-400";
      m2.querySelector('span:last-child').textContent = "미달 위험 🚨";
      m3.querySelector('span:last-child').className = "text-sm font-bold text-slate-500";
      m3.querySelector('span:last-child').textContent = "불가";
    }
  }

  currentGpa.addEventListener('input', calculate);
  currentCredits.addEventListener('input', calculate);
  gradCredits.addEventListener('input', calculate);
  calcGpaBtn.addEventListener('click', calculate);

  renderRetakes();
  calculate();
});
