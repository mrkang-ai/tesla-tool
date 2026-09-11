// zulu.js - Military Zulu Time Converter
document.addEventListener('DOMContentLoaded', () => {
  const zuluClock = document.getElementById('zuluClock');
  const kstClock = document.getElementById('kstClock');
  const phoneticReadout = document.getElementById('phoneticReadout');

  const phoneticDigits = {
    '0': 'Zero', '1': 'One', '2': 'Two', '3': 'Three', '4': 'Four',
    '5': 'Five', '6': 'Six', '7': 'Seven', '8': 'Eight', '9': 'Nine'
  };

  function update() {
    const now = new Date();

    // Zulu (UTC)
    const zuH = String(now.getUTCHours()).padStart(2, '0');
    const zuM = String(now.getUTCMinutes()).padStart(2, '0');
    const zuS = String(now.getUTCSeconds()).padStart(2, '0');
    zuluClock.textContent = `${zuH}${zuM}:${zuS} Z`;

    // Local KST (UTC+9)
    const kstH = String(now.getHours()).padStart(2, '0');
    const kstM = String(now.getMinutes()).padStart(2, '0');
    const kstS = String(now.getSeconds()).padStart(2, '0');
    kstClock.textContent = `${kstH}${kstM}:${kstS} I`;

    // Phonetic
    const str = `${kstH}${kstM}`;
    const words = str.split('').map(c => phoneticDigits[c] || c).join('-');
    phoneticReadout.textContent = `${words} Hours India (KST)`;
  }

  setInterval(update, 1000);
  update();
});
