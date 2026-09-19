// bell.js - 17:59 Closing Bell Defense Timer
document.addEventListener('DOMContentLoaded', () => {
  const currentTimeDisplay = document.getElementById('currentTimeDisplay');
  const countdownBadge = document.getElementById('countdownBadge');
  const breatheText = document.getElementById('breatheText');
  const simBtn = document.getElementById('simBtn');
  const testBellBtn = document.getElementById('testBellBtn');
  const dialogueCards = document.querySelectorAll('.dialogue-card');
  const toast = document.getElementById('toast');

  let simulatedTime = null;
  let fanfarePlayed = false;

  // Web Audio fanfare
  function playFanfare() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();

      const notes = [
        { f: 523.25, t: 0.0, d: 0.15 }, // C5
        { f: 523.25, t: 0.18, d: 0.15 }, // C5
        { f: 523.25, t: 0.36, d: 0.15 }, // C5
        { f: 659.25, t: 0.54, d: 0.35 }, // E5
        { f: 783.99, t: 0.95, d: 0.55 }, // G5
        { f: 1046.50, t: 1.55, d: 0.8 }  // C6
      ];

      notes.forEach(n => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = n.f;

        gain.gain.setValueAtTime(0.4, ctx.currentTime + n.t);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + n.t + n.d);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + n.t);
        osc.stop(ctx.currentTime + n.t + n.d);
      });
    } catch (e) {
      console.log("Audio failed:", e);
    }
  }

  testBellBtn.addEventListener('click', playFanfare);

  // Breathing text cycle
  let breatheStep = 0;
  setInterval(() => {
    breatheStep = (breatheStep + 1) % 4;
    if (breatheStep === 0) breatheText.textContent = "들숨 (Inhale) 4초";
    else if (breatheStep === 1) breatheText.textContent = "멈춤 (Hold) 4초";
    else if (breatheStep === 2) breatheText.textContent = "날숨 (Exhale) 4초";
    else breatheText.textContent = "휴식 (Relax) 4초";
  }, 2000);

  function updateClock() {
    let now = new Date();
    if (simulatedTime) {
      simulatedTime.setSeconds(simulatedTime.getSeconds() + 1);
      now = simulatedTime;
    }

    const h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();

    currentTimeDisplay.textContent = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;

    // Target 18:00
    const targetSec = 18 * 3600;
    const currentSec = h * 3600 + m * 60 + s;
    const diff = targetSec - currentSec;

    if (diff > 0 && diff <= 600) {
      const minLeft = Math.floor(diff / 60);
      const secLeft = diff % 60;
      countdownBadge.className = "inline-block mt-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-sm font-bold border border-rose-500/30 animate-pulse";
      countdownBadge.textContent = `🚨 마감 ${minLeft}분 ${secLeft}초 전! (최대 방어 태세)`;
    } else if (diff <= 0) {
      countdownBadge.className = "inline-block mt-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-bold border border-emerald-500/30";
      countdownBadge.textContent = "🎉 18:00 정시 셧다운 완료! 칼퇴 성공!";
      if (!fanfarePlayed) {
        playFanfare();
        fanfarePlayed = true;
      }
    } else {
      countdownBadge.textContent = "평화로운 업무 시간입니다.";
      countdownBadge.className = "inline-block mt-2 px-3 py-1 rounded-full bg-slate-700 text-slate-300 text-sm";
    }
  }

  setInterval(updateClock, 1000);
  updateClock();

  simBtn.addEventListener('click', () => {
    fanfarePlayed = false;
    simulatedTime = new Date();
    simulatedTime.setHours(17, 59, 50);
    updateClock();
  });

  dialogueCards.forEach(card => {
    card.addEventListener('click', () => {
      const text = card.getAttribute('data-text');
      navigator.clipboard.writeText(text);

      // TTS if supported
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'ko-KR';
        utter.rate = 1.05;
        window.speechSynthesis.speak(utter);
      }

      toast.classList.remove('hidden');
      setTimeout(() => toast.classList.add('hidden'), 2500);
    });
  });
});
