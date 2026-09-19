// ===========================================================================
// slang.js - Advanced Gen Z & Alpha Slang Translator Engine
// ===========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const inputText = document.getElementById('inputText');
  const outputText = document.getElementById('outputText');
  const swapModeBtn = document.getElementById('swapModeBtn');
  const directionLabel = document.getElementById('directionLabel');
  const inputLabel = document.getElementById('inputLabel');
  const outputLabel = document.getElementById('outputLabel');
  const copyBtn = document.getElementById('copyBtn');
  const badgeTags = document.querySelectorAll('.badge-tag');

  let mode = 'toGenz'; // 'toGenz' | 'toStd'

  // --- 1. Comprehensive Dictionary (Standard Korean <-> Gen Z & Alpha Slang) ---
  const DICTIONARY = [
    // [1] 여행, 풍경, 외출 & 재방문 (Travel & Scenic)
    { std: "다음에 또 오고 싶다", genz: "담에 무조건 재방문 각 뜸", stdFormal: "추후 재방문할 의향이 매우 큽니다." },
    { std: "다음에 또 가고 싶다", genz: "담에 무조건 재방문 각이다", stdFormal: "다음 기회에 다시 방문하고 싶습니다." },
    { std: "또 오고 싶다", genz: "재방문 각 뜸", stdFormal: "다시 찾아올 의사가 있습니다." },
    { std: "또 가고 싶다", genz: "재방문 각 잡힘", stdFormal: "다시 방문할 계획입니다." },
    { std: "집에 가고 싶다", genz: "빠른 귀가 런 각 뜸", stdFormal: "조속히 귀가하고 싶습니다." },
    { std: "쉬고 싶다", genz: "침대 다이빙 각 잡힘", stdFormal: "휴식을 취하고 싶습니다." },
    { std: "자고 싶다", genz: "기절 딥슬립 각 뜸", stdFormal: "수면을 취하고자 합니다." },
    { std: "먹고 싶다", genz: "폭풍 흡입 각 뜸", stdFormal: "섭취하고 싶습니다." },
    { std: "풍경이 정말 멋있다", genz: "뷰 폼 미쳤다", stdFormal: "경치와 조망이 매우 수려합니다." },
    { std: "경치가 정말 멋있다", genz: "감성 뷰 레전드네", stdFormal: "풍경이 대단히 아름답습니다." },
    { std: "풍경이 너무 멋있다", genz: "뷰 비주얼 찢었다", stdFormal: "전경이 압도적으로 훌륭합니다." },
    { std: "풍경이 정말 좋다", genz: "뷰 바이브 극락이네", stdFormal: "조망 환경이 대단히 좋습니다." },
    { std: "풍경이 멋있다", genz: "뷰 폼 미쳤음", stdFormal: "풍경이 근사합니다." },
    { std: "경치가 멋있다", genz: "감성 뷰 찢었음", stdFormal: "경치가 훌륭합니다." },
    { std: "풍경이 좋다", genz: "뷰 바이브 극락임", stdFormal: "풍광이 매우 좋습니다." },
    { std: "분위기가 너무 좋다", genz: "감성 바이브 찢었네", stdFormal: "주변 분위기가 대단히 우수합니다." },
    { std: "분위기 좋다", genz: "바이브 극락이네", stdFormal: "분위기가 화기애애하고 좋습니다." },
    { std: "인생 사진", genz: "인생샷", stdFormal: "완벽하게 잘 나온 기념 사진" },
    { std: "사진 찍다", genz: "인증샷 박다", stdFormal: "기념 촬영을 진행하다" },

    // [2] 맛집, 음식, 미각 (Food & Taste)
    { std: "음식이 너무 맛있다", genz: "음식 맛 폼 미쳤다", stdFormal: "음식의 풍미가 매우 훌륭합니다." },
    { std: "음식이 정말 맛있다", genz: "존맛탱 극락 감", stdFormal: "요리의 품질이 대단히 뛰어납니다." },
    { std: "너무 맛있다", genz: "존맛탱 극락임", stdFormal: "맛이 각별히 좋습니다." },
    { std: "정말 맛있다", genz: "존맛 폼 미쳤다", stdFormal: "대단히 맛있습니다." },
    { std: "완전 맛있다", genz: "미각 도파민 터짐", stdFormal: "매우 훌륭한 식사입니다." },
    { std: "맛있겠다", genz: "침샘 폭발 각", stdFormal: "대단히 먹음직스러워 보입니다." },
    { std: "맛있다", genz: "존맛탱 인정", stdFormal: "맛이 좋습니다." },
    { std: "맛있네", genz: "존맛이네", stdFormal: "훌륭한 맛입니다." },
    { std: "아이스 아메리카노", genz: "아아", stdFormal: "차가운 아메리카노 커피" },

    // [3] 칭찬, 감탄, 성과 (Praise, Excellence, Achievement)
    { std: "완전 최고다", genz: "폼 미쳤다", stdFormal: "역량과 수준이 대단히 탁월합니다." },
    { std: "정말 최고다", genz: "폼 미쳤다", stdFormal: "매우 모범적이고 훌륭합니다." },
    { std: "최고다", genz: "갓벽하다", stdFormal: "완벽에 가깝습니다." },
    { std: "최고네요", genz: "폼 미쳤네요", stdFormal: "대단히 뛰어난 실력입니다." },
    { std: "최고예요", genz: "갓벽 그 자체", stdFormal: "더할 나위 없이 훌륭합니다." },
    { std: "정말 대단하고", genz: "개쩔고", stdFormal: "매우 우수하며" },
    { std: "정말 대단하다", genz: "캐리력 미쳤다", stdFormal: "탁월한 성과를 보여주고 있습니다." },
    { std: "너무 대단하다", genz: "폼 레전드네", stdFormal: "성과가 대단히 돋보입니다." },
    { std: "대단하다", genz: "클래스 지렸다", stdFormal: "역량이 출중합니다." },
    { std: "대단하네요", genz: "캐리력 미쳤네요", stdFormal: "깊은 인상을 받았습니다." },
    { std: "멋있다", genz: "폼 미쳤음", stdFormal: "대단히 근사합니다." },
    { std: "멋지다", genz: "비주얼 갓벽함", stdFormal: "훌륭하고 당당합니다." },
    { std: "예쁘다", genz: "비주얼 찢었네", stdFormal: "외관이 대단히 수려합니다." },
    { std: "아름답다", genz: "극락 감성임", stdFormal: "대단히 아름답습니다." },
    { std: "완벽하다", genz: "갓벽 그 잡채", stdFormal: "흠잡을 데 없이 완벽합니다." },
    { std: "완벽합니다", genz: "갓벽 그 자체임", stdFormal: "완성도가 극히 높습니다." },
    { std: "대성공이다", genz: "완전 캐리함", stdFormal: "기대 이상의 대성공을 달성했습니다." },
    { std: "성공했다", genz: "하드캐리 찢었다", stdFormal: "목표를 완벽히 달성했습니다." },
    { std: "인정합니다", genz: "킹정합니다", stdFormal: "충분히 공감하고 동의합니다." },
    { std: "인정한다", genz: "ㄹㅇ 킹정", stdFormal: "전적으로 인정합니다." },

    // [4] 매력, 호감, 연애 (Charisma, Rizz & Attraction)
    { std: "매력적이었습니다", genz: "Rizz 폭발했네", stdFormal: "대단히 매력적인 모습이었습니다." },
    { std: "매력적이다", genz: "Rizz 폼 미쳤다", stdFormal: "사람을 끄는 매력이 있습니다." },
    { std: "매력이 넘친다", genz: "Rizz 폭발함", stdFormal: "호감도가 대단히 높습니다." },
    { std: "매력 쩐다", genz: "Rizz 레전드", stdFormal: "매력이 매우 뛰어납니다." },
    { std: "매력", genz: "Rizz(리즈)", stdFormal: "이성이나 대중을 끄는 매력" },
    { std: "인기 많다", genz: "인싸력 만렙", stdFormal: "대인 관계가 원만하고 인기가 높습니다." },
    { std: "인기가 많다", genz: "인싸력 폭발", stdFormal: "많은 이들에게 환영받고 있습니다." },
    { std: "친한 친구", genz: "짱친(베프)", stdFormal: "오랜 신뢰를 쌓은 절친한 친구" },

    // [5] 선 넘기, 갈등, 억지 (Boundary, Drama & Conflict)
    { std: "선을 넘지 마세요", genz: "뇌절 금지", stdFormal: "예의와 적정선을 지켜주시기 바랍니다." },
    { std: "선 넘지 마", genz: "뇌절 치지 마", stdFormal: "적당한 선에서 멈추어 주세요." },
    { std: "선 넘네", genz: "뇌절 치네", stdFormal: "정도를 지나친 행동입니다." },
    { std: "선 넘는", genz: "뇌절 치는", stdFormal: "정도를 벗어난" },
    { std: "지나치다", genz: "선 넘고 뇌절 옴", stdFormal: "사회적 상식을 초과하였습니다." },
    { std: "상관없습니다", genz: "알빠노", stdFormal: "저의 관할 및 관심 영역이 아닙니다." },
    { std: "신경 쓰지 마세요", genz: "알빠임?", stdFormal: "굳이 신경 쓰실 필요 없습니다." },
    { std: "상관없다", genz: "알빠노", stdFormal: "무관한 사안입니다." },
    { std: "신경 안 쓴다", genz: "알빠임?", stdFormal: "개의치 않습니다." },
    { std: "말도 안 되는 억측", genz: "억까", stdFormal: "근거 없는 무리한 비난이나 폄훼" },
    { std: "말도 안 되는 비난", genz: "억까", stdFormal: "비이성적인 비난" },
    { std: "과도한 칭찬", genz: "억빠", stdFormal: "객관성을 잃은 맹목적 칭찬" },
    { std: "과도하게 편들기", genz: "억빠", stdFormal: "무조건적인 편들기" },
    { std: "화가 난다", genz: "킹받네", stdFormal: "다소 답답하고 화가 납니다." },
    { std: "정말 화가 난다", genz: "극대노 각 뜸 킹받네", stdFormal: "대단히 분노스러운 상황입니다." },
    { std: "너무 화가 난다", genz: "혈압 상승 킹받네", stdFormal: "심각하게 화가 납니다." },
    { std: "짜증난다", genz: "킹받네 진짜", stdFormal: "매우 번거롭고 불쾌합니다." },
    { std: "어이없다", genz: "어쩔티비 저쩔티비", stdFormal: "매우 황당무계합니다." },
    { std: "황당하다", genz: "이게 실화냐", stdFormal: "믿기 어려울 정도로 당혹스럽습니다." },
    { std: "갑자기 분위기가 어색해졌다", genz: "갑분싸 레전드 옴", stdFormal: "순간적으로 좌중의 분위기가 얼어붙었습니다." },

    // [6] 긍정 마인드셋 & 유행어 (Mindset & Memes)
    { std: "포기하지 않는 마음", genz: "중꺾마", stdFormal: "어려움 앞에서도 굴하지 않는 강인한 의지" },
    { std: "포기하지 마세요", genz: "중꺾마 가보자고", stdFormal: "용기를 잃지 마시고 끝까지 완수하시기 바랍니다." },
    { std: "불운이지만 긍정적으로", genz: "오히려 좋아 (완전 럭키비키잖아)", stdFormal: "위기를 전화위복의 기회로 삼는 긍정적 태도" },
    { std: "긍정적으로 생각하면 오히려 좋다", genz: "완전 럭키비키잖아 🍀 오히려 좋아", stdFormal: "긍정적인 시각으로 재해석하면 도리어 유리합니다." },
    { std: "오히려 좋다", genz: "오히려 좋아 (완전 럭키비키잖아)", stdFormal: "전화위복의 좋은 상황입니다." },
    { std: "다 잘될 것이다", genz: "럭키비키하게 가보자고", stdFormal: "모든 일이 순조롭게 해결될 것입니다." },
    { std: "해봅시다", genz: "가보자고", stdFormal: "적극적으로 추진해 봅시다." },
    { std: "시작하자", genz: "가보자고", stdFormal: "업무에 착수합시다." },
    { std: "재밌다", genz: "개꿀잼 ㅋㅋㅋ", stdFormal: "대단히 흥미롭고 즐겁습니다." },
    { std: "진짜 웃기다", genz: "개웃기네 ㅋㅋㅋ", stdFormal: "대단히 유쾌하고 큰 웃음을 줍니다." },
    { std: "너무 웃기다", genz: "배꼽 탈출 ㅋㅋㅋ 찐텐 터짐", stdFormal: "매우 익살스럽고 재미있습니다." },
    { std: "멋지고 트렌디한", genz: "Skibidi 시그마 바이브", stdFormal: "대단히 세련되고 최신 유행을 선도하는" },

    // [7] 직장, 학업, 피로 (Work, Campus & Fatigue)
    { std: "피곤하고 힘들다", genz: "멘탈 바사삭 기빨림 ㄷㄷ", stdFormal: "심신이 대단히 피로한 상태입니다." },
    { std: "너무 힘들다", genz: "멘탈 탈탈 털림", stdFormal: "극심한 피로감을 느끼고 있습니다." },
    { std: "너무 피곤하다", genz: "배터리 방전됨", stdFormal: "체력이 모두 소진되었습니다." },
    { std: "퇴근하고 싶다", genz: "칼퇴 런 마렵다", stdFormal: "정시 퇴근을 희망합니다." },
    { std: "퇴근하겠습니다", genz: "칼퇴 런 때립니다", stdFormal: "금일 업무를 종료하고 퇴근하겠습니다." },
    { std: "퇴근", genz: "칼퇴 런", stdFormal: "정시 퇴근" },
    { std: "출근", genz: "출근(영혼 가출)", stdFormal: "사업장 출근" },
    { std: "야근", genz: "야근 노예 모드", stdFormal: "연장 근무" },
    { std: "망했다", genz: "나락 감", stdFormal: "치명적인 실패를 겪었습니다." },
    { std: "쉽다", genz: "날먹 각이네", stdFormal: "수월하게 해결 가능한 난이도입니다." },
    { std: "어렵다", genz: "난이도 극악 실화냐", stdFormal: "해결하기 까다로운 과제입니다." },
    { std: "감사합니다", genz: "압도적 감사 (갓 인정)", stdFormal: "진심으로 감사드립니다." },
    { std: "고맙습니다", genz: "압도적 감사", stdFormal: "감사의 뜻을 표합니다." },

    // [8] 부사 및 단독 단어 (Adverbs & Single Words)
    { std: "진짜 대박이다", genz: "ㄹㅇ 레전드 실화냐", stdFormal: "정말로 대단한 성과입니다." },
    { std: "대박이다", genz: "레전드다", stdFormal: "대단한 호재입니다." },
    { std: "진짜", genz: "ㄹㅇ", stdFormal: "실제로" },
    { std: "정말", genz: "ㄹㅇ", stdFormal: "대단히" },
    { std: "매우", genz: "개", stdFormal: "극히" },
    { std: "너무", genz: "개", stdFormal: "과도하게" },
    { std: "아주", genz: "핵", stdFormal: "상당히" },
    { std: "엄청", genz: "완전 갓", stdFormal: "대단히" },
    { std: "풍경", genz: "뷰", stdFormal: "경치" },
    { std: "경치", genz: "감성 뷰", stdFormal: "풍경" },
    { std: "분위기", genz: "바이브", stdFormal: "정취 및 분위기" },
    { std: "사진", genz: "인생샷", stdFormal: "사진" },
    { std: "식당", genz: "맛집", stdFormal: "음식점" },
    { std: "커피", genz: "생명수(아아)", stdFormal: "커피 음료" }
  ];

  // Sort dictionary by length descending so multi-word phrases match first!
  const sortedDict = [...DICTIONARY].sort((a, b) => b.std.length - a.std.length);
  const reverseDict = [...DICTIONARY].sort((a, b) => b.genz.length - a.genz.length);

  // --- 2. Translation Engine ---
  function translate() {
    let str = inputText.value;
    if (!str.trim()) {
      outputText.textContent = mode === 'toGenz' 
        ? "문장을 입력하면 Z세대 힙스터어로 찰떡 번역됩니다."
        : "신조어 문장을 입력하면 품격 있는 표준어/비즈니스어로 번역됩니다.";
      return;
    }

    if (mode === 'toGenz') {
      // 1. Phrasal & vocabulary replacements (Greedy Longest Match)
      sortedDict.forEach(item => {
        if (str.includes(item.std)) {
          str = str.replaceAll(item.std, item.genz);
        }
      });

      // 2. Sentence ending polish (Convert stiff endings into natural Gen Z talk)
      str = str.replace(/했습니다\b/g, "했음")
               .replace(/되었습니다\b/g, "됐음 ㄹㅇ")
               .replace(/입니다\b/g, "임 ㅇㅇ")
               .replace(/있습니다\b/g, "있음 ㅋㅋㅋ")
               .replace(/합시다\b/g, "가보자고")
               .replace(/좋겠다\b/g, "좋겠음 ㅋㅋㅋ")
               .replace(/같습니다\b/g, "각인 듯")
               .replace(/같다\b/g, "각 뜸");

      // 3. Natural punctuation & nuance (Never add awkward blind 'ㄹㅇ ㄷㄷ')
      const hasVibe = /ㅋㅋㅋ|ㄷㄷ|ㄹㅇ|각|미쳤|인정|럭키비키|Rizz|바이브|Skibidi|갓/.test(str);
      if (!hasVibe) {
        if (str.endsWith('.')) {
          str = str.slice(0, -1) + " ㄹㅇ ㅋㅋㅋ";
        } else {
          str += " ㄹㅇ ㅋㅋㅋ";
        }
      } else if (!str.includes('ㅋㅋㅋ') && !str.includes('ㄷㄷ') && !str.includes('!')) {
        str = str.replace(/\.$/, ' ㅋㅋㅋ');
      }

    } else {
      // --- Reverse: Z세대 슬랭 -> 어른/표준어/비즈니스어 ---
      reverseDict.forEach(item => {
        if (str.includes(item.genz)) {
          str = str.replaceAll(item.genz, item.stdFormal || item.std);
        }
      });

      // Standardize informal internet acronyms & endings
      str = str.replaceAll('ㄹㅇ', '실제로')
               .replaceAll('ㄷㄷ', '')
               .replaceAll('ㅋㅋㅋ', '')
               .replaceAll('ㅎㅎ', '')
               .replaceAll('존맛탱', '대단히 맛있는 요리')
               .replaceAll('존맛', '매우 훌륭한 맛')
               .replaceAll('개웃김', '대단히 유쾌함')
               .replaceAll('킹받네', '다소 당황스럽고 유감스럽습니다')
               .replaceAll('알빠노', '저와는 무관한 일입니다')
               .replaceAll('알빠임?', '굳이 관여할 사안이 아닙니다')
               .replaceAll('뇌절', '도를 지나친 반복 행위')
               .replaceAll('극락', '대단히 큰 만족감')
               .replaceAll('나락', '신뢰의 치명적 실추')
               .replaceAll('갓생', '모범적이고 성실한 일상')
               .replaceAll('갓벽', '흠잡을 데 없이 완벽')
               .replaceAll('재방문 각', '재방문할 의향이 충분')
               .replaceAll('각이다', '적절한 타이밍입니다')
               .replaceAll('각 뜸', '충분한 가능성이 있습니다')
               .replaceAll('칼퇴 런', '정시 퇴근')
               .replaceAll('아아', '아이스 아메리카노')
               .replace(/\.\s*\.+/g, '.')
               .replace(/\s+/g, ' ')
               .trim();

      if (!str.endsWith('.') && !str.endsWith('!') && !str.endsWith('?')) {
        str += '.';
      }
    }

    outputText.textContent = str;
  }

  // --- 3. Event Listeners ---
  inputText.addEventListener('input', translate);

  swapModeBtn.addEventListener('click', () => {
    mode = mode === 'toGenz' ? 'toStd' : 'toGenz';
    if (mode === 'toGenz') {
      directionLabel.textContent = "표준어/꼰대어 ➔ Z세대 힙스터어";
      inputLabel.textContent = "입력 문장 (표준어)";
      outputLabel.textContent = "번역 결과 (Z세대/알파어)";
      inputText.placeholder = "예: 오늘 여행 왔는데 풍경이 정말 멋있다. 다음에 또 오고 싶다.";
    } else {
      directionLabel.textContent = "Z세대 슬랭 ➔ 어른/비즈니스 표준어";
      inputLabel.textContent = "입력 문장 (Z세대 슬랭/알파어)";
      outputLabel.textContent = "번역 결과 (품격 있는 표준어/비즈니스)";
      inputText.placeholder = "예: 뷰 폼 미쳤다... 오늘 완전 럭키비키잖아. 담에 무조건 재방문 각 뜸 ㅋㅋㅋ";
    }
    translate();
  });

  // Example Badges click
  badgeTags.forEach(tag => {
    tag.addEventListener('click', () => {
      inputText.value = tag.getAttribute('data-text') || tag.textContent;
      translate();
      if (window.SoundFX && window.SoundFX.playPop) window.SoundFX.playPop();
    });
  });

  // Copy with Toast feedback
  copyBtn.addEventListener('click', () => {
    if (!outputText.textContent.trim()) return;
    navigator.clipboard.writeText(outputText.textContent).then(() => {
      copyBtn.innerHTML = '<i class="fa-solid fa-check text-green-400 mr-1"></i>복사 완료!';
      setTimeout(() => {
        copyBtn.innerHTML = '<i class="fa-regular fa-copy mr-1"></i>복사';
      }, 2000);
    });
  });

  // Initial run
  translate();
});
