// Invisible Cow Audio Game
document.addEventListener('DOMContentLoaded', () => {
  const arena = document.getElementById('cowArena');
  const radar = document.getElementById('soundRadar');
  const foundCow = document.getElementById('foundCow');
  const startBtn = document.getElementById('startCowBtn');

  let audioCtx = null;
  let cowX = 0;
  let cowY = 0;
  let isPlaying = false;
  let lastMooTime = 0;

  function spawnCow() {
    const rect = arena.getBoundingClientRect();
    cowX = Math.random() * (rect.width - 60) + 30;
    cowY = Math.random() * (rect.height - 60) + 30;
    foundCow.classList.add('hidden');
    radar.innerText = "소리를 들으며 숨은 소를 찾아보세요...";
  }

  function playMoo(pitch, volume) {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const t = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(pitch, t);
      osc.frequency.linearRampToValueAtTime(pitch * 0.85, t + 0.2);

      gain.gain.setValueAtTime(volume, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.26);
    } catch(e) {}
  }

  startBtn.addEventListener('click', () => {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    isPlaying = true;
    spawnCow();
    startBtn.innerText = "게임 재시작 (소 위치 변경)";
  });

  arena.addEventListener('pointermove', (e) => {
    if (!isPlaying) return;
    const rect = arena.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const dist = Math.hypot(x - cowX, y - cowY);
    const maxDist = Math.hypot(rect.width, rect.height);
    const closeness = Math.max(0, 1 - (dist / maxDist)); // 0.0 to 1.0

    const now = Date.now();
    const interval = Math.max(150, (1 - closeness) * 900);

    if (now - lastMooTime > interval) {
      lastMooTime = now;
      const pitch = 120 + closeness * 280;
      const vol = Math.min(0.8, 0.1 + closeness * 0.7);
      playMoo(pitch, vol);

      if (dist < 40) {
        radar.innerText = "🔥 바로 앞입니다! 클릭하세요!";
      } else if (dist < 120) {
        radar.innerText = "음메~!! (매우 가까움)";
      } else {
        radar.innerText = "음메... (멀리 있음)";
      }
    }
  });

  arena.addEventListener('pointerdown', (e) => {
    if (!isPlaying) return;
    const rect = arena.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const dist = Math.hypot(x - cowX, y - cowY);
    if (dist < 50) {
      foundCow.style.left = `${cowX - 35}px`;
      foundCow.style.top = `${cowY - 35}px`;
      foundCow.classList.remove('hidden');
      radar.innerText = "🎉 축하합니다! 숨어있던 소를 찾았습니다!";
      isPlaying = false;
    }
  });
});
