// Download Time Calculator
document.addEventListener('DOMContentLoaded', () => {
  const gbInput = document.getElementById('fileGb');
  const speedSelect = document.getElementById('netSpeed');
  const etaTime = document.getElementById('etaTime');
  const etaMetaphor = document.getElementById('etaMetaphor');

  function calculate() {
    const gb = parseFloat(gbInput.value) || 0;
    const mbps = parseFloat(speedSelect.value);

    // 1 Byte = 8 bits. Real throughput ~85% due to TCP overhead
    const mBps = (mbps / 8) * 0.85;
    const totalMB = gb * 1024;
    const seconds = totalMB / mBps;

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    let timeStr = "";
    if (mins >= 60) {
      const hrs = Math.floor(mins / 60);
      const remainMins = mins % 60;
      timeStr = `${hrs}시간 ${remainMins}분`;
    } else {
      timeStr = `${mins}분 ${secs}초`;
    }

    etaTime.innerText = timeStr;

    if (seconds < 60) {
      etaMetaphor.innerText = "⚡ 눈 깜짝할 사이에 끝납니다! 기지개 한 번 켜세요.";
    } else if (seconds < 1200) {
      etaMetaphor.innerText = "☕ 커피 한 잔 내리고 유튜브 쇼츠 몇 개 보면 완료됩니다.";
    } else {
      etaMetaphor.innerText = "🍱 편안하게 밥 먹고 오거나 다른 게임 한 판 하고 오세요.";
    }
  }

  gbInput.addEventListener('input', calculate);
  speedSelect.addEventListener('change', calculate);
  calculate();
});
