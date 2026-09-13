// Teleport Drift Calculator
document.addEventListener('DOMContentLoaded', () => {
  const distSelect = document.getElementById('jumpDistance');
  const calcBtn = document.getElementById('calcDriftBtn');
  const statusEl = document.getElementById('landingStatus');
  const detailEl = document.getElementById('driftDetail');

  calcBtn.addEventListener('click', () => {
    const dist = parseInt(distSelect.value, 10);
    if (dist <= 10) {
      statusEl.innerText = "🟢 안전 착륙 가능 (오차 0.002mm)";
      statusEl.className = "text-2xl font-black text-emerald-400 my-2";
      detailEl.innerText = "단거리 점프는 지구 자전 오차가 거의 없어 옷깃 하나 상하지 않고 안전하게 이동합니다.";
    } else if (dist <= 1000) {
      statusEl.innerText = "🟡 경미한 찰과상 (오차 12cm)";
      statusEl.className = "text-2xl font-black text-amber-400 my-2";
      detailEl.innerText = "지구 표면 곡률로 인해 바닥에서 12cm 허공에 착지하여 엉덩방아를 찧을 수 있습니다.";
    } else {
      statusEl.innerText = "🔴 대참사: 대기권 밖 사출 or 지반 매몰";
      statusEl.className = "text-2xl font-black text-rose-500 my-2";
      detailEl.innerText = "지구 반대편과의 위도 자전 속도 차이로 인해 시속 1,600km의 속도로 지면에 내리꽂힙니다.";
    }
  });
});
