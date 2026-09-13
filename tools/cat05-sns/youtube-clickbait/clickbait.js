// clickbait.js - YouTube Clickbait Generator
document.addEventListener('DOMContentLoaded', () => {
  const topicInput = document.getElementById('topicInput');
  const genTitlesBtn = document.getElementById('genTitlesBtn');
  const titlesGrid = document.getElementById('titlesGrid');

  const patterns = [
    (k) => `[충격] ${k}, 결국 터졌습니다... 업계 관계자들 전원 경악 (이 영상은 곧 삭제될 수 있습니다)`,
    (k) => `절대 ${k} 하지 마세요. 99%의 사람들이 속고 있는 소름 돋는 진실`,
    (k) => `${k}로 인생 역전했습니다. 솔직히 더 이상 혼자만 알기 아까워서 전부 공개합니다`,
    (k) => `"이걸 이제 알았다고?" 전문가들이 절대 일반인에게 알려주지 않는 ${k}의 실체 ㄷㄷ`,
    (k) => `[단독] 마침내 터진 ${k} 대참사... 이제 어떻게 해야 하나요? (눈물 주의)`,
    (k) => `${k}, 모르면 매달 100만 원씩 버리는 꼴입니다. 지금 당장 확인하세요!`,
    (k) => `제가 3년 동안 ${k} 해보고 내린 충격적인 결론... (ft. 후회막심)`,
    (k) => `세계 1위 부자들은 왜 매일 아침 ${k}을(를) 집착할까? 상위 1%의 소름 돋는 비밀`
  ];

  function render() {
    const k = topicInput.value.trim() || "비트코인";

    titlesGrid.innerHTML = patterns.map((p, idx) => {
      const title = p(k);
      return `
        <div class="p-3.5 rounded-xl bg-slate-800 border border-slate-700/80 hover:border-rose-500/50 flex items-center justify-between gap-3 transition">
          <div class="flex items-center gap-3">
            <span class="w-6 text-center font-mono font-bold text-rose-400 text-xs">#${idx + 1}</span>
            <span class="text-xs sm:text-sm font-bold text-slate-200">${title}</span>
          </div>
          <button data-text="${title}" class="copy-t-btn text-xs px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 transition whitespace-nowrap">
            복사
          </button>
        </div>
      `;
    }).join('');

    document.querySelectorAll('.copy-t-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        navigator.clipboard.writeText(btn.getAttribute('data-text'));
        btn.textContent = "복사됨!";
        setTimeout(() => btn.textContent = "복사", 2000);
      });
    });
  }

  genTitlesBtn.addEventListener('click', render);
  topicInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') render();
  });

  render();
});
