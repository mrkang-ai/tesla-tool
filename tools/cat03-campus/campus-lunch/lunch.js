// lunch.js - Campus Lunch Roulette
document.addEventListener('DOMContentLoaded', () => {
  const balanceInput = document.getElementById('balanceInput');
  const spinBtn = document.getElementById('spinBtn');
  const rouletteWheel = document.getElementById('rouletteWheel');
  const selectedMenuName = document.getElementById('selectedMenuName');
  const selectedMenuDesc = document.getElementById('selectedMenuDesc');
  const qbBtns = document.querySelectorAll('.qb-btn');

  const menuPool = [
    // Low (< 5000)
    { name: "편의점 삼각김밥 2개 + 컵라면", price: 3400, icon: "🍙", tier: "low", loc: "GS25 / CU", desc: "극강의 가성비. 잔액을 아껴 저녁 약속에 투자하세요." },
    { name: "학식 기본 라면 + 공깃밥", price: 3800, icon: "🍜", tier: "low", loc: "학생식당 라면 코너", desc: "국물까지 싹 비우면 의외로 든든한 학식 효자 메뉴." },
    { name: "편의점 혜자 도시락", price: 4800, icon: "🍱", tier: "low", loc: "교내 편의점", desc: "단백질 섭취 가능. 전자레인지 2분 조리 필수." },

    // Mid (5000 ~ 9000)
    { name: "학식 바삭 치즈 돈까스", price: 6500, icon: "🥩", tier: "mid", loc: "학생회관 2층 양식당", desc: "실패 확률 0%. 시험 기간 멘탈 회복 1순위 메뉴." },
    { name: "후문 제육볶음 백반", price: 7500, icon: "🥘", tier: "mid", loc: "대학가 후문 밥집", desc: "밥과 찌개 무한 리필! 탄수화물 폭격 가능." },
    { name: "학식 순두부찌개 & 계란말이", price: 5900, icon: "🍲", tier: "mid", loc: "학생식당 뚝배기 코너", desc: "얼큰하고 든든하게 속 채우는 한국인 국룰." },

    // High (> 9000)
    { name: "후문 마라탕 (고기 2번 추가)", price: 12500, icon: "🌶️", tier: "high", loc: "마라공방 후문점", desc: "스트레스 극상 해소! 옥수수면과 분모자 파티." },
    { name: "수제 수제버거 & 감자튀김 세트", price: 11000, icon: "🍔", tier: "high", loc: "정문 수제버거집", desc: "오늘 시험 잘 본 당신을 위한 미국식 플렉스." }
  ];

  qbBtns.forEach(b => {
    b.addEventListener('click', () => {
      balanceInput.value = b.getAttribute('data-val');
    });
  });

  let spinning = false;
  spinBtn.addEventListener('click', () => {
    if (spinning) return;
    spinning = true;
    rouletteWheel.style.transform = `rotate(${Math.floor(Math.random() * 1440 + 720)}deg)`;

    const budget = parseInt(balanceInput.value, 10) || 5000;
    const affordable = menuPool.filter(m => m.price <= budget);
    const chosen = affordable.length ? affordable[Math.floor(Math.random() * affordable.length)] : menuPool[0];

    setTimeout(() => {
      rouletteWheel.textContent = chosen.icon;
      selectedMenuName.textContent = chosen.name;
      selectedMenuDesc.textContent = `가격: ₩${chosen.price.toLocaleString()} / 위치: ${chosen.loc} / ${chosen.desc}`;
      spinning = false;
    }, 1000);
  });
});
