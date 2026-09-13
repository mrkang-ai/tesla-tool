// morse.js - Morse Code Translator & Beeper
document.addEventListener('DOMContentLoaded', () => {
  const morseInput = document.getElementById('morseInput');
  const morseOutput = document.getElementById('morseOutput');
  const playMorseBtn = document.getElementById('playMorseBtn');
  const lamp = document.getElementById('lamp');
  const copyMorseBtn = document.getElementById('copyMorseBtn');

  const MORSE_MAP = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..',
    '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
    '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----',
    ' ': '/'
  };

  function translate() {
    const text = morseInput.value.toUpperCase();
    const encoded = text.split('').map(ch => MORSE_MAP[ch] || ch).join(' ');
    morseOutput.textContent = encoded;
  }

  morseInput.addEventListener('input', translate);

  let isPlaying = false;
  async function playSound() {
    if (isPlaying) return;
    isPlaying = true;

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();

      const code = morseOutput.textContent;
      const dotMs = 80;
      const dashMs = dotMs * 3;

      for (let i = 0; i < code.length; i++) {
        const symbol = code[i];
        if (symbol === '.' || symbol === '-') {
          const dur = symbol === '.' ? dotMs : dashMs;

          // Lamp ON
          lamp.className = "w-12 h-12 rounded-full bg-emerald-400 border-2 border-emerald-300 shadow-[0_0_20px_#10b981] flex items-center justify-center text-xs font-bold text-slate-950";
          lamp.textContent = "ON";

          // Sound
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(800, ctx.currentTime);
          gain.gain.setValueAtTime(0.3, ctx.currentTime);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();

          await new Promise(r => setTimeout(r, dur));

          osc.stop();
          // Lamp OFF
          lamp.className = "w-12 h-12 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center text-xs font-bold text-slate-500";
          lamp.textContent = "OFF";

          // inter-element space
          await new Promise(r => setTimeout(r, dotMs));
        } else if (symbol === ' ') {
          await new Promise(r => setTimeout(r, dotMs * 2));
        } else if (symbol === '/') {
          await new Promise(r => setTimeout(r, dotMs * 6));
        }
      }
    } catch(e) {
      console.log(e);
    }

    isPlaying = false;
  }

  playMorseBtn.addEventListener('click', playSound);

  copyMorseBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(morseOutput.textContent);
    copyMorseBtn.textContent = "복사됨!";
    setTimeout(() => copyMorseBtn.innerHTML = '<i class="fa-regular fa-copy mr-1"></i>복사', 2000);
  });

  morseInput.value = "SOS WE NEED BACKUP";
  translate();
});
