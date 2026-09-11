// mre.js - MRE Timer
document.addEventListener('DOMContentLoaded', () => {
  const mreClock = document.getElementById('mreClock');
  const pullCordBtn = document.getElementById('pullCordBtn');
  const steamContainer = document.getElementById('steamContainer');
  const mreStatus = document.getElementById('mreStatus');

  let remainingSec = 600; // 10 minutes
  let isCooking = false;
  let timerId = null;

  function playHissing() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();

      // White noise buffer
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1200;
      filter.Q.value = 3;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.2, ctx.currentTime);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();

      setTimeout(() => noise.stop(), 5000);
    } catch(e) {}
  }

  pullCordBtn.addEventListener('click', () => {
    if (!isCooking) {
      isCooking = true;
      steamContainer.classList.remove('hidden');
      pullCordBtn.textContent = "가열 중... (보글보글)";
      pullCordBtn.className = "px-8 py-3.5 bg-slate-700 text-slate-300 font-bold rounded-xl text-sm";
      mreStatus.textContent = "♨️ 발열팩이 부풀어 오르고 있습니다! 증기 배출구에 손을 대지 마세요.";

      playHissing();

      timerId = setInterval(() => {
        if (remainingSec > 0) {
          remainingSec--;
          const m = Math.floor(remainingSec / 60);
          const s = remainingSec % 60;
          mreClock.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
        } else {
          clearInterval(timerId);
          mreClock.textContent = "00:00 (조리 완료)";
          mreStatus.textContent = "🎉 완성되었습니다! 볶음밥에 참기름과 양념장을 넣고 비벼 드세요!";
        }
      }, 1000);
    }
  });
});
