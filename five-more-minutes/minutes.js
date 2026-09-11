// 5 More Minutes Logic
document.addEventListener('DOMContentLoaded', () => {
  const snoozeSlider = document.getElementById('snoozeMinutes');
  const snoozeDisplay = document.getElementById('snoozeDisplay');
  const normalCommute = document.getElementById('normalCommute');
  const transport = document.getElementById('transport');

  const lateProbEl = document.getElementById('lateProb');
  const costLossEl = document.getElementById('costLoss');
  const survivalTierEl = document.getElementById('survivalTier');
  const actionGuideEl = document.getElementById('actionGuide');

  function calculate() {
    const mins = parseInt(snoozeSlider.value, 10);
    snoozeDisplay.innerText = `${mins}분`;

    const commute = parseInt(normalCommute.value, 10);
    const mode = transport.value;

    let prob = Math.min(100, Math.round((mins / 45) * 100));
    if (commute > 60) prob = Math.min(100, prob + 15);
    if (mins === 0) prob = 0;

    lateProbEl.innerText = `${prob}%`;

    let cost = 0;
    if (mode === 'taxi') {
      if (mins > 0) cost = 8000 + mins * 700 + (commute > 60 ? 12000 : 4000);
    }
    costLossEl.innerText = cost > 0 ? `${cost.toLocaleString()}원` : "0원 (대중교통)";

    let tier = "평화로운 아침";
    let guide = "상쾌하게 커피 한 잔 마시며 여유롭게 출근할 수 있는 승리자입니다.";

    if (mins >= 40) {
      tier = "🚨 비상사태 (영혼 가출)";
      guide = "머리 감기 포기! 모자 푹 눌러쓰고 마스크 착용. 팀장님께 '지하철 신호 대기 지연' 핑계 카톡을 지금 미리 작성하십시오.";
    } else if (mins >= 25) {
      tier = "🏃‍♂️ 전력질주 모드";
      guide = "양치하면서 바지 입기 스킬 발동. 아침 식사는 탕비실 카누 1포로 대체하고 에스컬레이터 두 칸씩 뛰어야 합니다.";
    } else if (mins >= 10) {
      tier = "⚡ 물세수 3초컷";
      guide = "샤워 시간 3분 단축 필요. 머리는 대충 수건으로만 털고 엘리베이터가 바로 오길 기도하십시오.";
    }

    survivalTierEl.innerText = tier;
    actionGuideEl.innerText = guide;
  }

  snoozeSlider.addEventListener('input', calculate);
  normalCommute.addEventListener('change', calculate);
  transport.addEventListener('change', calculate);

  calculate();
});
