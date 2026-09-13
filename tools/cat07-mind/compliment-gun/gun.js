// Compliment Gun Logic & Sound
document.addEventListener('DOMContentLoaded', () => {
  let audioCtx = null;
  let count = 0;

  const compliments = [
    "당신이 오늘 숨 쉬고 살아있는 것만으로도 온 우주의 기적입니다!",
    "어떻게 그렇게 매 순간 최선을 다할 수가 있죠? 진짜 대단해요.",
    "당신의 미소 하나면 오늘 하루 모든 피로가 싹 녹아내립니다.",
    "남들은 모를지 몰라도 당신이 남몰래 흘린 땀방울, 세상이 다 압니다!",
    "당신은 스스로 생각하는 것보다 100배는 더 지혜롭고 멋진 사람이에요.",
    "오늘 당신이 입은 옷과 분위기, 진짜 영화 주인공 같아요!",
    "포기하지 않고 여기까지 걸어온 당신, 이미 인생의 챔피언입니다.",
    "당신의 존재 자체가 누군가에게는 하루를 버티는 가장 큰 이유입니다.",
    "센스 넘치고 배려 깊은 사람... 바로 당신을 두고 하는 말이죠!",
    "앞으로 당신의 인생에 눈부신 꽃길과 대박 행운만 가득할 겁니다!"
  ];

  function playPopSound() {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440 + Math.random() * 200, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch(e) {}
  }

  const fireBtn = document.getElementById('fireBtn');
  const complimentText = document.getElementById('complimentText');
  const fireCount = document.getElementById('fireCount');

  function fire() {
    count++;
    fireCount.innerText = count;
    playPopSound();

    if (typeof confetti === 'function') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }

    fireBtn.classList.add('fire-anim');
    setTimeout(() => fireBtn.classList.remove('fire-anim'), 150);

    const rand = compliments[Math.floor(Math.random() * compliments.length)];
    complimentText.innerText = `“${rand}”`;
  }

  fireBtn.addEventListener('click', fire);

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
      e.preventDefault();
      fire();
    }
  });
});
