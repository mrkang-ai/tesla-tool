// regex.js - Visual Regex Sandbox
document.addEventListener('DOMContentLoaded', () => {
  const regexPattern = document.getElementById('regexPattern');
  const regexFlags = document.getElementById('regexFlags');
  const testString = document.getElementById('testString');
  const highlightBox = document.getElementById('highlightBox');
  const matchCount = document.getElementById('matchCount');

  function match() {
    const p = regexPattern.value;
    const f = regexFlags.value;
    const str = testString.value;

    try {
      const reg = new RegExp(p, f);
      const matches = str.match(reg);
      matchCount.textContent = matches ? `${matches.length}개 일치` : "0개 일치";

      // Highlight
      const highlighted = str.replace(reg, m => `<mark class="bg-yellow-400 text-slate-950 font-bold px-0.5 rounded">${m}</mark>`);
      highlightBox.innerHTML = highlighted;
    } catch (e) {
      matchCount.textContent = "문법 오류 ❌";
      highlightBox.textContent = e.message;
    }
  }

  regexPattern.addEventListener('input', match);
  regexFlags.addEventListener('input', match);
  testString.addEventListener('input', match);

  match();
});
