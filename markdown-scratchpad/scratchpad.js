// Markdown Scratchpad Realtime Renderer
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('mdInput');
  const preview = document.getElementById('mdPreview');
  const countEl = document.getElementById('charCount');

  const sample = `# 환영합니다! TossGPT 마크다운 패드 🚀

간단한 메모와 문서를 실시간으로 서식화해보세요.

### 주요 기능
- **GitHub Flavored Markdown (GFM)** 지원
- 실시간 글자 수 카운팅
- 코드 블록 및 인라인 스타일

\`\`\`javascript
function helloWorld() {
  console.log("Hello from Markdown!");
}
\`\`\`

> "생각을 정리하는 가장 좋은 방법은 기록하는 것입니다."
`;

  input.value = sample;

  function render() {
    const raw = input.value;
    countEl.innerText = `${raw.length}자`;
    if (typeof marked !== 'undefined') {
      preview.innerHTML = marked.parse(raw);
    } else {
      preview.innerText = raw;
    }
  }

  input.addEventListener('input', render);
  render();
});
