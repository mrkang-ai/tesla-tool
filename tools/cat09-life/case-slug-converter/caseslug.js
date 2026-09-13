// Case & Slug Converter
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('sourceText');
  const resCamel = document.getElementById('resCamel');
  const resSnake = document.getElementById('resSnake');
  const resKebab = document.getElementById('resKebab');

  function convert() {
    const raw = input.value.trim();
    if (!raw) return;

    // Split words by space, underscore, hyphen, or camel
    const words = raw
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[_-]+/g, ' ')
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    // camelCase
    const camel = words.map((w, i) => i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)).join('');
    // snake_case
    const snake = words.join('_');
    // kebab-case
    const kebab = words.join('-');

    resCamel.innerText = camel;
    resSnake.innerText = snake;
    resKebab.innerText = kebab;
  }

  input.addEventListener('input', convert);

  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const text = document.getElementById(targetId).innerText;
      navigator.clipboard.writeText(text);
      btn.innerText = "완료!";
      setTimeout(() => btn.innerText = "복사", 1200);
    });
  });

  convert();
});
