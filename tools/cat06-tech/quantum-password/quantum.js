// quantum.js - Quantum Password Cracker Time
document.addEventListener('DOMContentLoaded', () => {
  const pwInput = document.getElementById('pwInput');
  const togglePwBtn = document.getElementById('togglePwBtn');
  const classicalTime = document.getElementById('classicalTime');
  const quantumTime = document.getElementById('quantumTime');

  togglePwBtn.addEventListener('click', () => {
    pwInput.type = pwInput.type === 'password' ? 'text' : 'password';
  });

  function calculate() {
    const pw = pwInput.value;
    const len = pw.length;

    let pool = 10; // digits
    if (/[a-z]/.test(pw)) pool += 26;
    if (/[A-Z]/.test(pw)) pool += 26;
    if (/[^a-zA-Z0-9]/.test(pw)) pool += 32;

    const combinations = Math.pow(pool, len);

    // Classical: 10^10 hashes / sec
    const secClassical = combinations / 1e10;

    // Quantum Grover: sqrt(combinations) / 1e9 ops
    const secQuantum = Math.sqrt(combinations) / 1e9;

    classicalTime.textContent = formatTime(secClassical);
    quantumTime.textContent = formatTime(secQuantum);
  }

  function formatTime(s) {
    if (s < 0.001) return "0.0001초 미만";
    if (s < 1) return `${s.toFixed(3)}초 (즉각)`;
    if (s < 60) return `${Math.round(s)}초`;
    if (s < 3600) return `${Math.round(s / 60)}분`;
    if (s < 86400) return `${Math.round(s / 3600)}시간`;
    if (s < 86400 * 365) return `${Math.round(s / 86400)}일`;
    if (s < 86400 * 365 * 1000) return `약 ${Math.round(s / (86400 * 365))}년`;
    return "수억 년 (우주 수명급)";
  }

  pwInput.addEventListener('input', calculate);
  calculate();
});
