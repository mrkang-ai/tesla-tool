// Cursor Dodger Escape Logic
document.addEventListener('DOMContentLoaded', () => {
  const arena = document.getElementById('gameArena');
  const btn = document.getElementById('dodgerBtn');

  function moveButton() {
    const arenaRect = arena.getBoundingClientRect();
    const btnW = btn.offsetWidth;
    const btnH = btn.offsetHeight;

    const maxX = arenaRect.width - btnW - 20;
    const maxY = arenaRect.height - btnH - 20;

    const randX = Math.max(10, Math.random() * maxX);
    const randY = Math.max(10, Math.random() * maxY);

    btn.style.left = `${randX}px`;
    btn.style.top = `${randY}px`;
  }

  btn.addEventListener('mouseenter', () => {
    moveButton();
  });

  btn.addEventListener('click', () => {
    alert("🎉 대단합니다! 당신의 순발력은 세계 상위 0.001%입니다!");
  });

  moveButton();
});
