// Apocalypse Survival Calculator Logic
document.addEventListener('DOMContentLoaded', () => {
  const scenario = document.getElementById('scenario');
  const speed = document.getElementById('runningSpeed');
  const food = document.getElementById('foodStock');
  const btn = document.getElementById('calcBtn');
  const daysEl = document.getElementById('daysCount');
  const causeEl = document.getElementById('causeDeath');

  function calculate() {
    const sc = scenario.value;
    const sp = parseInt(speed.value, 10);
    const fd = parseInt(food.value, 10);

    let days = fd;
    if (sp <= 13) days += 10;
    else if (sp >= 20) days = Math.max(1, Math.floor(days * 0.4));

    let cause = "평화롭게 구호 부대를 만나 생존 성공!";
    if (days < 5) {
      cause = "사망 원인: 식량 부족으로 첫날 밖으로 뛰쳐나갔다가 30분 만에 최초 감염자 됨.";
    } else if (days < 20) {
      cause = "사망 원인: 편의점에서 생수 챙기다 유리창 깨는 소리에 몰려든 무리에게 습격당함.";
    } else {
      cause = "생존 비결: 방구석 히키코모리 모드로 문을 걸어 잠그고 컵라면만 먹어서 생존!";
    }

    daysEl.innerText = `${days}일`;
    causeEl.innerText = cause;
  }

  btn.addEventListener('click', calculate);
});
