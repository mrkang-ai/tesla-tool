// camo.js - Tactical Camo Generator
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('camoCanvas');
  const ctx = canvas.getContext('2d');
  const camoType = document.getElementById('camoType');
  const camoScale = document.getElementById('camoScale');
  const randomizeBtn = document.getElementById('randomizeBtn');
  const downloadPngBtn = document.getElementById('downloadPngBtn');

  const PALETTES = {
    digital: ['#2f3e2b', '#485641', '#6f7864', '#1f251c', '#8a8878'], // Granite pixel
    woodland: ['#2d3b2d', '#4c5c36', '#685038', '#1c1b18'],           // Classic
    desert: ['#c2b280', '#e0d5b7', '#a68a68', '#856447'],             // Desert
    navy: ['#1c2833', '#2e4053', '#5d6d7e', '#aeb6bf']                // Navy
  };

  function generate() {
    const type = camoType.value;
    const palette = PALETTES[type] || PALETTES.digital;
    const size = parseInt(camoScale.value, 10);

    const w = canvas.width;
    const h = canvas.height;

    // Fill base
    ctx.fillStyle = palette[0];
    ctx.fillRect(0, 0, w, h);

    if (type === 'digital' || type === 'navy') {
      // Pixel grid algorithm
      const cols = Math.ceil(w / size);
      const rows = Math.ceil(h / size);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const colorIdx = Math.floor(Math.random() * palette.length);
          ctx.fillStyle = palette[colorIdx];
          ctx.fillRect(c * size, r * size, size, size);
        }
      }
    } else {
      // Blobby organic woodland algorithm
      for (let p = 1; p < palette.length; p++) {
        ctx.fillStyle = palette[p];
        for (let i = 0; i < 24; i++) {
          ctx.beginPath();
          const rx = Math.random() * w;
          const ry = Math.random() * h;
          const rw = (Math.random() * 80 + 40) * (size / 16);
          const rh = (Math.random() * 60 + 30) * (size / 16);
          ctx.ellipse(rx, ry, rw, rh, Math.random() * Math.PI, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  randomizeBtn.addEventListener('click', generate);
  camoType.addEventListener('change', generate);
  camoScale.addEventListener('input', generate);

  downloadPngBtn.addEventListener('click', () => {
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `camo_pattern_${camoType.value}.png`;
    a.click();
  });

  generate();
});
