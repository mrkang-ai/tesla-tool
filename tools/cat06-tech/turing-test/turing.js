// turing.js - Blind Turing Test
document.addEventListener('DOMContentLoaded', () => {
  const textA = document.getElementById('textA');
  const textB = document.getElementById('textB');
  const cardA = document.getElementById('cardA');
  const cardB = document.getElementById('cardB');
  const quizQuestion = document.getElementById('quizQuestion');
  const scoreTracker = document.getElementById('scoreTracker');

  const questions = [
    {
      q: '"비 오는 월요일 아침, 출근길에 대한 솔직한 심정은?"',
      human: "아 진짜 양말 다 젖음 ㅡㅡ 지하철 에어컨 냄새랑 축축한 우산 비닐 소리 때문에 출근도 전에 퇴근 마려움 실화냐",
      ai: "비 내리는 월요일 출근길은 젖은 노면과 높은 습도로 인해 통근자들에게 신체적·정신적 피로감을 유발하는 대표적인 스트레스 요인입니다. 따뜻한 차 한 잔으로 마음을 달래는 것을 추천합니다.",
      aiIsA: false
    },
    {
      q: '"인공지능이 인간을 지배할 가능성에 대해 어떻게 생각하나요?"',
      human: "지배는 모르겠고 일단 제 엑셀 수식이나 안 틀리고 똑바로 썼으면 좋겠네요. 칼퇴나 시켜줬으면.",
      ai: "초지능(AGI)의 출현 가능성은 학계에서 활발히 논의되는 주제입니다. 아시모프의 원칙과 안전 규약이 엄격히 준수된다면 공존 생태계가 구축될 것입니다.",
      aiIsA: false
    }
  ];

  let current = 0;
  let correct = 0;
  let total = 0;

  function loadQ(idx) {
    const item = questions[idx % questions.length];
    quizQuestion.textContent = item.q;

    if (item.aiIsA) {
      textA.textContent = item.ai;
      textB.textContent = item.human;
    } else {
      textA.textContent = item.human;
      textB.textContent = item.ai;
    }
  }

  function handleGuess(guessedA) {
    const item = questions[current % questions.length];
    const isCorrect = (guessedA && item.aiIsA) || (!guessedA && !item.aiIsA);

    total++;
    if (isCorrect) correct++;

    scoreTracker.textContent = `정답률: ${correct} / ${total} (${Math.round((correct / total) * 100)}%)`;

    alert(isCorrect ? "🎉 정답입니다! AI 특유의 정갈한 문체를 정확히 간파하셨습니다." : "❌ 땡! 깜빡 속으셨습니다. AI가 쓴 글이었습니다.");

    current++;
    loadQ(current);
  }

  cardA.addEventListener('click', () => handleGuess(true));
  cardB.addEventListener('click', () => handleGuess(false));

  loadQ(0);
});
