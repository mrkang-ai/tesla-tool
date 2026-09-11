// Universal & Korean Unit Converter
document.addEventListener('DOMContentLoaded', () => {
  const pyungInput = document.getElementById('areaPyung');
  const m2Input = document.getElementById('areaM2');
  const fbText = document.getElementById('footballText');

  pyungInput.addEventListener('input', () => {
    const p = parseFloat(pyungInput.value) || 0;
    const m2 = p * 3.305785;
    m2Input.value = m2.toFixed(1);
    updateFootball(m2);
  });

  m2Input.addEventListener('input', () => {
    const m2 = parseFloat(m2Input.value) || 0;
    const p = m2 / 3.305785;
    pyungInput.value = p.toFixed(1);
    updateFootball(m2);
  });

  function updateFootball(m2) {
    const ratio = m2 / 7140;
    fbText.innerText = `⚽ 국제 축구장 규격(7,140㎡)의 약 ${ratio.toFixed(3)}배 크기입니다.`;
  }
});
