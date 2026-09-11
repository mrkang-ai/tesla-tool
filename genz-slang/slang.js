// slang.js - Gen Z & Alpha Slang Translator
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

  const dictionary = [
    { std: "완전 최고다", genz: "폼 미쳤다" },
    { std: "정말 대단하고", genz: "개쩔고" },
    { std: "매력", genz: "Rizz(리즈)" },
    { std: "매력적이었습니다", genz: "Rizz 폭발했네" },
    { std: "선 넘네", genz: "뇌절 치네" },
    { std: "선을 넘지 마세요", genz: "뇌절 금지" },
    { std: "상관없습니다", genz: "알빠노" },
    { std: "신경 쓰지 마세요", genz: "알빠임?" },
    { std: "포기하지 않는 마음", genz: "중꺾마" },
    { std: "불운이지만 긍정적으로", genz: "오히려 좋아 (럭키비키잖아)" },
    { std: "말도 안 되는 억측", genz: "억까" },
    { std: "과도한 칭찬", genz: "억빠" },
    { std: "진짜 웃기다", genz: "개웃기네 ㅋㅋㅋ" },
    { std: "멋지고 트렌디한", genz: "Skibidi 시그마" },
    { std: "진짜", genz: "ㄹㅇ 실화냐" }
  ];

  function translate() {
    let str = inputText.value;
    if (!str.trim()) {
      outputText.textContent = "문장을 입력하면 번역됩니다.";
      return;
    }

    if (mode === 'toGenz') {
      dictionary.forEach(d => {
        str = str.replaceAll(d.std, d.genz);
      });
      // add some youth punctuation if none
      if (!str.includes('ㄷㄷ') && !str.includes('ㅋㅋ')) {
        str += " ㄹㅇ ㄷㄷ";
      }
    } else {
      dictionary.forEach(d => {
        str = str.replaceAll(d.genz, d.std);
      });
      str = str.replaceAll('ㄷㄷ', '').replaceAll('ㄹㅇ', '정말로').replaceAll('ㅋㅋㅋ', '');
    }

    outputText.textContent = str;
  }

  inputText.addEventListener('input', translate);

  swapModeBtn.addEventListener('click', () => {
    mode = mode === 'toGenz' ? 'toStd' : 'toGenz';
    if (mode === 'toGenz') {
      directionLabel.textContent = "표준어/꼰대어 ➔ Z세대 힙스터어";
      inputLabel.textContent = "입력 문장 (표준어)";
      outputLabel.textContent = "번역 결과 (Z세대/알파어)";
    } else {
      directionLabel.textContent = "Z세대 슬랭 ➔ 어른/표준어 번역";
      inputLabel.textContent = "입력 문장 (Z세대 슬랭)";
      outputLabel.textContent = "번역 결과 (표준어/비즈니스)";
    }
    translate();
  });

  badgeTags.forEach(tag => {
    tag.addEventListener('click', () => {
      inputText.value = tag.textContent;
      translate();
    });
  });

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(outputText.textContent);
    copyBtn.innerHTML = '<i class="fa-solid fa-check text-green-400 mr-1"></i>복사됨!';
    setTimeout(() => copyBtn.innerHTML = '<i class="fa-regular fa-copy mr-1"></i>복사', 2000);
  });

  translate();
});
