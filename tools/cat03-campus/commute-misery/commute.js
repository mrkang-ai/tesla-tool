// commute.js - Commute Misery Index
document.addEventListener('DOMContentLoaded', () => {
  const oneWayMin = document.getElementById('oneWayMin');
  const daysPerWeek = document.getElementById('daysPerWeek');
  const lineDifficulty = document.getElementById('lineDifficulty');
  const transfers = document.getElementById('transfers');
  const calcCommuteBtn = document.getElementById('calcCommuteBtn');
  const wastedHours = document.getElementById('wastedHours');
  const wastedDesc = document.getElementById('wastedDesc');
  const rentAdvice = document.getElementById('rentAdvice');

  function calculate() {
    const minOne = parseInt(oneWayMin.value, 10) || 60;
    const days = parseInt(daysPerWeek.value, 10) || 4;
    const mult = parseFloat(lineDifficulty.value) || 1.0;
    const tf = parseInt(transfers.value, 10) || 1;

    // 16 weeks in a semester
    const totalMin = minOne * 2 * days * 16;
    const hours = Math.round(totalMin / 60);

    wastedHours.textContent = `${hours} 시간`;

    wastedDesc.innerHTML = `✈️ 유럽 왕복 비행기를 <b>${(hours / 24).toFixed(1)}일 동안 연속 탑승</b>한 것과 같으며, 전공 서적 5권을 완독할 시간입니다.`;

    const miseryScore = Math.round((hours * mult) + (tf * 15));
    if (miseryScore >= 250) {
      rentAdvice.innerHTML = `🚨 <b>고통 지수 ${miseryScore}점 (한계 초과):</b> 통학 때문에 학점이 떨어지는 중입니다. 즉시 기숙사 추가 모집을 넣거나 보증금 대출을 알아보세요.`;
    } else {
      rentAdvice.innerHTML = `✅ <b>고통 지수 ${miseryScore}점 (인내 가능):</b> 에어팟 노이즈 캔슬링과 유튜브 영상 저장으로 버텨볼 만한 거리입니다.`;
    }
  }

  calcCommuteBtn.addEventListener('click', calculate);
  oneWayMin.addEventListener('input', calculate);

  calculate();
});
