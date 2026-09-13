// MBTI Clash Logic
document.addEventListener('DOMContentLoaded', () => {
  let currentScene = 'trip';

  const sceneBtns = document.querySelectorAll('.scene-btn');
  sceneBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sceneBtns.forEach(b => {
        b.classList.remove('active', 'border-pink-500', 'bg-pink-50', 'dark:bg-pink-900/30', 'text-pink-700', 'dark:text-pink-300', 'font-bold');
        b.classList.add('border-slate-300', 'dark:border-slate-600', 'font-medium');
      });
      btn.classList.add('active', 'border-pink-500', 'bg-pink-50', 'dark:bg-pink-900/30', 'text-pink-700', 'dark:text-pink-300', 'font-bold');
      currentScene = btn.dataset.scene;
    });
  });

  const simulateBtn = document.getElementById('simulateBtn');
  const resultCard = document.getElementById('resultCard');

  simulateBtn.addEventListener('click', () => {
    const a = document.getElementById('mbtiA').value;
    const b = document.getElementById('mbtiB').value;

    let diffLetters = 0;
    for(let i=0; i<4; i++) {
      if(a[i] !== b[i]) diffLetters++;
    }

    let danger = 50 + diffLetters * 12;
    if (a[2] !== b[2]) danger += 8; // T vs F clash bonus
    if (a[3] !== b[3]) danger += 10; // J vs P clash bonus
    if (danger > 98) danger = 98;
    if (danger < 25) danger = 25;

    document.getElementById('dangerScore').innerText = `${danger}%`;
    document.getElementById('nameA').innerText = a;
    document.getElementById('nameB').innerText = b;

    let titleKo = "예측불가 긴장 관계";
    let titleEn = "Unpredictable Tension";
    if (danger >= 80) {
      titleKo = "🔥 영혼의 맞다이 (대폭발 위험)";
      titleEn = "🔥 Extreme Clash (High Explosion)";
    } else if (danger >= 60) {
      titleKo = "⚡ 겉은 웃지만 속으로 욕하는 사이";
      titleEn = "⚡ Smiling Outside, Sighing Inside";
    } else {
      titleKo = "🍀 상호 보완 꿀케미 (생존 가능)";
      titleEn = "🍀 Complementary Chem (Survive)";
    }
    document.getElementById('relTitle').innerText = titleKo;

    // Reason
    let reasons = {
      trip: {
        ko: `${a}(은)는 기분 따라 예쁜 카페나 골목길을 거닐고 싶어하지만, ${b}(은)는 엑셀에 분 단위로 계획해 둔 관광지 티켓 마감 5분 전이라며 뛰라고 소리칩니다. 길을 잃었을 때 한 명은 '낭만이다'라고 하고, 한 명은 '구글맵 왜 안 보냐'고 정색합니다.`,
        en: `${a} wants to stroll around aesthetic cafes freely, while ${b} screams to sprint because the booked museum ticket expires in 5 minutes according to their excel sheet.`
      },
      team: {
        ko: `${a}(은)는 '아직 번뜩이는 콘셉트가 안 떠올랐다'며 마감 3시간 전까지 브레인스토밍을 하자고 하고, ${b}(은)는 목차와 폰트 크기 규격부터 칼같이 맞추며 오늘 밤 12시까지 1차 초안 안 넘기면 이름 뺀다고 경고합니다.`,
        en: `${a} insists on brainstorming ideas until 3 hours before deadline, while ${b} strictly demands submission of draft chapters right on schedule.`
      },
      cohabit: {
        ko: `${a}(은)는 '설거지는 내일 아침에 해도 지구 안 망한다'며 넷플릭스를 켜고, ${b}(은)는 싱크대에 컵 하나 놓여있는 걸 보고 혈압이 올라 분노의 고무장갑 세척을 시작하며 한숨을 푹푹 쉽니다.`,
        en: `${a} chills watching Netflix saying dishes can wait until tomorrow, while ${b} boils with frustration seeing a single cup in the sink and sighs loudly.`
      }
    };

    let innerAKo = a[3] === 'P' ? "아니 여행 와서 왜 군대처럼 행군을 해야 해? 좀 유연하게 살자 제발..." : "계획도 대책도 없이 대체 뭘 믿고 저러는 거지? 나 혼자 다 짊어지는 기분이야.";
    let innerBKo = b[2] === 'T' ? "비효율의 극치다. 팩트만 말했는데 왜 삐지고 감정적으로 굴지?" : "말투가 왜 저렇게 차갑고 로봇 같지? 날 존중하긴 하는 걸까...";
    let cheatKo = `서로의 성향을 '틀린 것'이 아니라 '외계 행성의 기본 설정'으로 받아들이세요. ${b[3] === 'J' ? b + '에게 일정 통제권을 맡기되 오후 2시간은 무조건 자유시간을 보장하세요.' : a + '의 감성을 칭찬해주고 마감 시한만 30분 앞당겨 알려주세요.'}`;

    document.getElementById('fightReason').innerText = reasons[currentScene].ko;
    document.getElementById('innerA').innerText = innerAKo;
    document.getElementById('innerB').innerText = innerBKo;
    document.getElementById('cheatCode').innerText = cheatKo;

    resultCard.classList.remove('hidden');
    resultCard.scrollIntoView({ behavior: 'smooth' });
  });
});
