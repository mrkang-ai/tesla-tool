// Memento Mori Calculation
document.addEventListener('DOMContentLoaded', () => {
  const birthInput = document.getElementById('birthDate');
  const targetAgeInput = document.getElementById('targetAge');

  const livedDaysEl = document.getElementById('livedDays');
  const livedPercentEl = document.getElementById('livedPercent');
  const leftDaysEl = document.getElementById('leftDays');
  const leftWeeksEl = document.getElementById('leftWeeks');
  const mealsLeftEl = document.getElementById('mealsLeft');
  const currentAgeText = document.getElementById('currentAgeText');
  const targetAgeText = document.getElementById('targetAgeText');
  const lifeBar = document.getElementById('lifeBar');

  function calculate() {
    const bDate = new Date(birthInput.value);
    const now = new Date();
    const targetAge = parseInt(targetAgeInput.value, 10) || 85;

    if (isNaN(bDate.getTime())) return;

    const diffMs = now - bDate;
    const livedDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
    const totalDays = Math.floor(targetAge * 365.25);
    const leftDays = Math.max(0, totalDays - livedDays);

    const percent = Math.min(100, Math.max(0, (livedDays / totalDays) * 100));
    const ageYears = (livedDays / 365.25).toFixed(1);

    livedDaysEl.innerText = `${livedDays.toLocaleString()}일`;
    livedPercentEl.innerText = `인생의 ${percent.toFixed(1)}% 경과`;

    leftDaysEl.innerText = `${leftDays.toLocaleString()}일`;
    leftWeeksEl.innerText = `약 ${Math.floor(leftDays / 7).toLocaleString()}번의 주말`;

    mealsLeftEl.innerText = `${(leftDays * 3).toLocaleString()}끼`;

    currentAgeText.innerText = `현재 만 ${ageYears}세`;
    targetAgeText.innerText = `${targetAge}세 (종착역)`;
    lifeBar.style.width = `${percent}%`;
  }

  birthInput.addEventListener('change', calculate);
  targetAgeInput.addEventListener('input', calculate);

  calculate();
});
