// Foggy Window Wiper Canvas
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('fogCanvas');
  const ctx = canvas.getContext('2d');
  const refogBtn = document.getElementById('refogBtn');

  function resize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    applyFog();
  }

  function applyFog() {
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(220, 235, 252, 0.94)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  window.addEventListener('resize', resize);
  resize();

  let isDrawing = false;

  function wipe(x, y) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.fill();
  }

  canvas.addEventListener('pointerdown', (e) => {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    wipe(e.clientX - rect.left, e.clientY - rect.top);
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    wipe(e.clientX - rect.left, e.clientY - rect.top);
  });

  window.addEventListener('pointerup', () => { isDrawing = false; });

  refogBtn.addEventListener('click', applyFog);
});
