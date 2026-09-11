// WCAG Color Contrast Checker
document.addEventListener('DOMContentLoaded', () => {
  const fgColor = document.getElementById('fgColor');
  const fgHex = document.getElementById('fgHex');
  const bgColor = document.getElementById('bgColor');
  const bgHex = document.getElementById('bgHex');
  const preview = document.getElementById('previewCard');
  const ratioEl = document.getElementById('contrastRatio');
  const aaEl = document.getElementById('passAA');
  const aaaEl = document.getElementById('passAAA');

  function hexToRgb(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const num = parseInt(hex, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  }

  function getLuminance(r, g, b) {
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  function calculate() {
    const fg = hexToRgb(fgColor.value);
    const bg = hexToRgb(bgColor.value);

    fgHex.value = fgColor.value;
    bgHex.value = bgColor.value;

    preview.style.color = fgColor.value;
    preview.style.backgroundColor = bgColor.value;

    const l1 = getLuminance(...fg);
    const l2 = getLuminance(...bg);

    const brighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    const ratio = (brighter + 0.05) / (darker + 0.05);

    ratioEl.innerText = `${ratio.toFixed(2)}:1`;

    if (ratio >= 4.5) {
      aaEl.innerText = "PASS (통과)";
      aaEl.className = "text-xl font-black text-emerald-500 mt-2";
    } else {
      aaEl.innerText = "FAIL (불합격)";
      aaEl.className = "text-xl font-black text-rose-500 mt-2";
    }

    if (ratio >= 7.0) {
      aaaEl.innerText = "PASS (통과)";
      aaaEl.className = "text-xl font-black text-emerald-500 mt-2";
    } else {
      aaaEl.innerText = "FAIL (불합격)";
      aaaEl.className = "text-xl font-black text-rose-500 mt-2";
    }
  }

  fgColor.addEventListener('input', calculate);
  bgColor.addEventListener('input', calculate);

  fgHex.addEventListener('input', () => {
    if (/^#[0-9A-F]{6}$/i.test(fgHex.value)) {
      fgColor.value = fgHex.value;
      calculate();
    }
  });

  bgHex.addEventListener('input', () => {
    if (/^#[0-9A-F]{6}$/i.test(bgHex.value)) {
      bgColor.value = bgHex.value;
      calculate();
    }
  });

  calculate();
});
