// adjuster.js - Report Page Magic Adjuster
document.addEventListener('DOMContentLoaded', () => {
  const modeCompress = document.getElementById('modeCompress');
  const modeExpand = document.getElementById('modeExpand');
  const inputText = document.getElementById('inputText');
  const processBtn = document.getElementById('processBtn');
  const sampleBtn = document.getElementById('sampleBtn');
  const outputContainer = document.getElementById('outputContainer');
  const copyOutBtn = document.getElementById('copyOutBtn');
  const charCountIn = document.getElementById('charCountIn');
  const charCountOut = document.getElementById('charCountOut');
  const diffRate = document.getElementById('diffRate');
  const hwpTip = document.getElementById('hwpTip');

  let currentMode = 'compress'; // 'compress' | 'expand'

  modeCompress.addEventListener('click', () => {
    currentMode = 'compress';
    modeCompress.className = "flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 bg-indigo-600 text-white";
    modeExpand.className = "flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 text-slate-400 hover:text-white";
    hwpTip.innerHTML = "• 자간 줄이기: <kbd class='px-1 bg-slate-800 rounded border border-slate-600 text-slate-200'>Alt + Shift + N</kbd> (1%씩 축소) / 장평 줄이기: <kbd class='px-1 bg-slate-800 rounded border border-slate-600 text-slate-200'>Alt + Shift + J</kbd>";
    process();
  });

  modeExpand.addEventListener('click', () => {
    currentMode = 'expand';
    modeExpand.className = "flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 bg-indigo-600 text-white";
    modeCompress.className = "flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 text-slate-400 hover:text-white";
    hwpTip.innerHTML = "• 자간 늘리기: <kbd class='px-1 bg-slate-800 rounded border border-slate-600 text-slate-200'>Alt + Shift + W</kbd> (1%씩 확대) / 줄간격 늘리기: <kbd class='px-1 bg-slate-800 rounded border border-slate-600 text-slate-200'>Alt + Shift + T</kbd>";
    process();
  });

  // Replacement Dictionaries
  const compressRules = [
    { from: /수행하고자 하는 바입니다/g, to: "추진함" },
    { from: /진행하도록 하겠습니다/g, to: "시행 예정" },
    { from: /다양한 의견을 적극적으로 수렴하여/g, to: "의견 수렴 후" },
    { from: /원활한 업무 수행을 도모하기 위하여/g, to: "업무 효율화를 위해" },
    { from: /철저하고 빈틈없이 준비하여/g, to: "만전 기함" },
    { from: /가시적인 성과를 도출할 수 있도록/g, to: "성과 제고 목적" },
    { from: /지속적으로 모니터링을 실시함/g, to: "상시 점검" },
    { from: /대단히 중요한 사항으로 판단됩니다/g, to: "핵심 과제임" },
    { from: /~에 관하여/g, to: "~관련" },
    { from: /~을/를 통한/g, to: "~기반" }
  ];

  const expandRules = [
    { from: /추진함/g, to: "선제적이고 전사적인 총력을 다해 강력히 추진하고자 함" },
    { from: /검토 중/g, to: "다각적인 실효성 분석 및 제반 여건을 면밀하게 종합 검토 중에 있음" },
    { from: /개선함/g, to: "근본적인 구조적 문제점을 해소하고 획기적인 패러다임 전환을 통해 일대 혁신을 도모함" },
    { from: /완료/g, to: "관계 부서 간 유기적 협의를 거쳐 차질 없이 완벽하게 마무리 완료" },
    { from: /도입/g, to: "글로벌 표준 및 선진 모범 사례를 적극 벤치마킹하여 전격 도입" },
    { from: /지원함/g, to: "수혜자 중심의 맞춤형 밀착 지원 체계를 촘촘하게 구축하여 적극 지원함" },
    { from: /필요함/g, to: "작금의 급변하는 대내외 행정 환경에 비추어 볼 때 시급하고도 불가피한 필수 조치로 판단됨" }
  ];

  function process() {
    let text = inputText.value.trim();
    if (!text) {
      outputContainer.textContent = "변환할 텍스트를 왼쪽에 입력해주세요.";
      return;
    }

    let result = text;

    if (currentMode === 'compress') {
      // Apply compression rules
      compressRules.forEach(r => { result = result.replace(r.from, r.to); });

      // Convert paragraphs into bullets if multi-line
      const lines = result.split('\n').filter(Boolean);
      result = lines.map(line => {
        line = line.replace(/^[\-\•\*\ㅇ]\s*/, '');
        return `ㅇ ${line}`;
      }).join('\n');
    } else {
      // Expand mode
      expandRules.forEach(r => { result = result.replace(r.from, r.to); });

      // Add elaborate administrative rhetorical padding
      const sentences = result.split(/([.?!])\s+/).filter(Boolean);
      let expanded = "";
      for (let i = 0; i < sentences.length; i += 2) {
        let s = sentences[i];
        let punct = sentences[i+1] || ".";
        if (s.length > 5) {
          s = "주지하다시피 " + s + ", 이에 수반되는 종합적인 기대 효과 역시 대단히 클 것으로 사료됨";
        }
        expanded += s + punct + "\n\n";
      }
      result = expanded.trim();
    }

    outputContainer.textContent = result;

    // Stats
    const inLen = text.length;
    const outLen = result.length;
    charCountIn.textContent = `${inLen}자 / ${text.split(/\s+/).length}단어`;
    charCountOut.textContent = `${outLen}자`;
    
    const diff = ((outLen - inLen) / (inLen || 1) * 100).toFixed(1);
    if (diff > 0) {
      diffRate.className = "text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold";
      diffRate.textContent = `+${diff}% 증폭`;
    } else {
      diffRate.className = "text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold";
      diffRate.textContent = `${diff}% 압축`;
    }
  }

  sampleBtn.addEventListener('click', () => {
    inputText.value = `원활한 업무 수행을 도모하기 위하여 다양한 의견을 적극적으로 수렴하여 신규 데이터 분석 시스템을 전격 도입하고 지속적으로 모니터링을 실시함. 이는 조직 내 협업 증진을 위해 대단히 중요한 사항으로 판단됩니다.`;
    process();
  });

  inputText.addEventListener('input', () => {
    const inLen = inputText.value.trim().length;
    charCountIn.textContent = `${inLen}자 / ${inputText.value.trim().split(/\s+/).length}단어`;
  });

  processBtn.addEventListener('click', process);

  copyOutBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(outputContainer.textContent).then(() => {
      copyOutBtn.innerHTML = '<i class="fa-solid fa-check mr-1 text-green-400"></i> 복사 완료!';
      setTimeout(() => copyOutBtn.innerHTML = '<i class="fa-regular fa-copy mr-1"></i> 결과 텍스트 복사', 2000);
    });
  });

  // initial sample
  sampleBtn.click();
});
