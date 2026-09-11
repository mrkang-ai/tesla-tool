// viral.js - Viral Potential Tester
document.addEventListener('DOMContentLoaded', () => {
  const viralIn = document.getElementById('viralIn');
  const testViralBtn = document.getElementById('testViralBtn');
  const rageScore = document.getElementById('rageScore');
  const rageBadge = document.getElementById('rageBadge');
  const rageDesc = document.getElementById('rageDesc');

  const triggers = [
    { word: "솔직히", pt: 15 },
    { word: "노력 안", pt: 25 },
    { word: "반박 시", pt: 20 },
    { word: "팩트", pt: 15 },
    { word: "충격", pt: 20 },
    { word: "개극혐", pt: 25 },
    { word: "이해 불가", pt: 20 },
    { word: "거지", pt: 30 }
  ];

  function evaluate() {
    const text = viralIn.value;
    let score = 20;

    triggers.forEach(t => {
      if (text.includes(t.word)) score += t.pt;
    });

    if (text.length > 80) score += 10;
    score = Math.min(99, Math.max(10, score));

    rageScore.textContent = `${score} pt`;

    if (score >= 75) {
      rageBadge.textContent = "위험: 댓글창 난투극 확정 (Ragebait)";
      rageBadge.className = "inline-block px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full text-xs font-bold font-mono animate-pulse";
      rageDesc.textContent = "• 대중의 분노 버튼을 정확히 누르는 킬러 키워드가 다수 포착되었습니다. 조회수 대폭발과 인신공격을 동시에 각오해야 합니다.";
    } else if (score >= 45) {
      rageBadge.textContent = "보통: 흥미 유발 및 건전한 토론";
      rageBadge.className = "inline-block px-3 py-1 bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded-full text-xs font-bold font-mono";
      rageDesc.textContent = "• 적당한 도파민 자극과 대화 참여를 유도하는 이상적인 바이럴 포스팅입니다.";
    } else {
      rageBadge.textContent = "순한맛: 평화로운 힐링 일기";
      rageBadge.className = "inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold font-mono";
      rageDesc.textContent = "• 갈등 없는 청정 구역입니다. 악플 걱정 없이 안심하고 올리셔도 좋습니다.";
    }
  }

  testViralBtn.addEventListener('click', evaluate);
  viralIn.addEventListener('input', evaluate);

  evaluate();
});
