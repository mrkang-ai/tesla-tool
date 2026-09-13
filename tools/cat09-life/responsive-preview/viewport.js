// Responsive Viewport Tester
document.addEventListener('DOMContentLoaded', () => {
  const frame = document.getElementById('previewFrame');
  const widthEl = document.getElementById('currWidth');
  const btns = document.querySelectorAll('.device-btn');

  btns.forEach(b => {
    b.addEventListener('click', () => {
      btns.forEach(btn => {
        btn.classList.remove('active', 'bg-blue-600', 'text-white');
        btn.classList.add('bg-slate-200', 'dark:bg-slate-700');
      });
      b.classList.add('active', 'bg-blue-600', 'text-white');
      b.classList.remove('bg-slate-200', 'dark:bg-slate-700');

      const w = b.dataset.w;
      frame.style.width = `${w}px`;
      widthEl.innerText = `${w}px`;
    });
  });
});
