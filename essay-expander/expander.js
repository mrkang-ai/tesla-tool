// expander.js - Academic Essay Expander
document.addEventListener('DOMContentLoaded', () => {
  const inEssay = document.getElementById('inEssay');
  const outEssay = document.getElementById('outEssay');
  const expandEssayBtn = document.getElementById('expandEssayBtn');
  const copyExpandedBtn = document.getElementById('copyExpandedBtn');
  const inCount = document.getElementById('inCount');
  const outCount = document.getElementById('outCount');

  const replacements = [
    { from: /매우 유용하다/g, to: "현대 다변화된 사회 구조 속에서 그 효용성과 실천적 가치가 대단히 높게 평가받고 있다" },
    { from: /부작용도 있다/g, to: "이에 수반되는 불가피한 역기능과 윤리적·구조적 위험 요인 역시 결코 간과할 수 없는 쟁점으로 부각되고 있다" },
    { from: /잘 감시해야 한다/g, to: "제도적 견제 장치와 다학제적 규범 마련을 통해 면밀하고도 선제적인 모니터링 체계를 확립해 나갈 필요성이 절실히 요구된다" },
    { from: /중요하다/g, to: "작금의 학문적 지평에서 그 본질적 가치와 의의가 각별히 강조되고 있다" },
    { from: /생각한다/g, to: "심도 있는 고찰을 바탕으로 논리적 귀결에 도달하고자 사료된다" },
    { from: /인공지능은/g, to: "4차 산업혁명의 핵심 동력으로 자리매김한 인공지능(Artificial Intelligence) 생태계는" }
  ];

  function expand() {
    let text = inEssay.value.trim();
    if (!text) {
      outEssay.textContent = "원본 문장을 왼쪽에 입력해 주세요.";
      return;
    }

    inCount.textContent = `${text.length}자`;

    replacements.forEach(r => {
      text = text.replace(r.from, r.to);
    });

    // Splice extra rhetorical connectors
    const sentences = text.split(/([.?!])\s+/).filter(Boolean);
    let result = "";
    for (let i = 0; i < sentences.length; i += 2) {
      let s = sentences[i];
      let p = sentences[i+1] || ".";
      if (s.length > 8) {
        result += `주지하다시피, ${s}는 사실을 우리는 거시적 안목에서 재조명할 필요가 있다${p}\n\n`;
      } else {
        result += s + p + " ";
      }
    }

    outEssay.textContent = result.trim();
    outCount.textContent = `${outEssay.textContent.length}자 (+${Math.round((outEssay.textContent.length / (inEssay.value.length || 1)) * 100)}%)`;
  }

  expandEssayBtn.addEventListener('click', expand);

  copyExpandedBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(outEssay.textContent);
    copyExpandedBtn.innerHTML = '<i class="fa-solid fa-check text-green-400 mr-1"></i>복사됨!';
    setTimeout(() => copyExpandedBtn.innerHTML = '<i class="fa-regular fa-copy mr-1"></i>복사하기', 2000);
  });

  // sample
  inEssay.value = "인공지능은 매우 유용하다. 하지만 부작용도 있다. 그러므로 우리는 잘 감시해야 한다.";
  expand();
});
