// Fortune Cookie Web Audio & Logic
document.addEventListener('DOMContentLoaded', () => {
  let audioCtx = null;

  function playCrackSound() {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      // Noise burst for crunchy crack
      const bufferSize = audioCtx.sampleRate * 0.15;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 1200;

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.6, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start();
    } catch(e) {}
  }

  const fortunes = [
    "지금 누워있지 말고 일어나는 순간 오늘 하루의 80%는 성공입니다.",
    "완벽한 타이밍이란 없습니다. 덜덜 떨리더라도 일단 저지르는 놈이 이깁니다.",
    "당신을 힘들게 하는 그 인간은 당신 인생의 주연이 아니라 스쳐가는 엑스트라 3번입니다.",
    "통장 잔고와 몸무게는 생각보다 당신의 게으름에 솔직합니다. 오늘은 덜 먹고 더 움직이세요.",
    "남들의 인정보다 중요한 건 오늘 밤 당신이 마주할 편안한 베개입니다.",
    "지금 보내지 않은 그 카톡 답장은 내일 더 큰 후폭풍으로 돌아옵니다. 10초 만에 보내세요.",
    "걱정해서 걱정이 없어지면 걱정이 없겠네. 딱 10분만 멍때리고 잊으세요.",
    "오늘은 커피 3잔 대신 따뜻한 물 한 컵을 먼저 마셔야 위장이 버팁니다.",
    "세상은 당신에게 그렇게 관심이 없습니다. 그러니 눈치 보지 말고 뻔뻔하게 사세요.",
    "일단 시작하면 어떻게든 끝납니다. 제일 힘든 건 책상 앞에 엉덩이 붙이기입니다."
  ];

  const colors = ["민트 그린", "로얄 블루", "따스한 앰버", "네온 핑크", "올리브 그린", "딥 바이올렛", "크림 아이보리"];

  const cookieBtn = document.getElementById('cookieBtn');
  const cookieIcon = document.getElementById('cookieIcon');
  const clickPrompt = document.getElementById('clickPrompt');
  const paperBox = document.getElementById('paperBox');
  const fortuneText = document.getElementById('fortuneText');
  const luckyNums = document.getElementById('luckyNums');
  const luckyColor = document.getElementById('luckyColor');
  const resetBtn = document.getElementById('resetBtn');

  cookieBtn.addEventListener('click', () => {
    if (paperBox.classList.contains('hidden')) {
      playCrackSound();
      cookieIcon.classList.add('animate-crack');
      cookieIcon.innerText = "✨🥠✨";
      clickPrompt.classList.add('hidden');

      const randFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
      fortuneText.innerText = `“${randFortune}”`;

      // 6 lucky numbers
      const nums = [];
      while(nums.length < 6) {
        const n = Math.floor(Math.random() * 45) + 1;
        if(!nums.includes(n)) nums.push(n);
      }
      nums.sort((a,b)=>a-b);
      luckyNums.innerText = nums.join(', ');
      luckyColor.innerText = colors[Math.floor(Math.random() * colors.length)];

      setTimeout(() => {
        paperBox.classList.remove('hidden');
        resetBtn.classList.remove('hidden');
      }, 200);
    }
  });

  resetBtn.addEventListener('click', () => {
    cookieIcon.innerText = "🥠";
    clickPrompt.classList.remove('hidden');
    paperBox.classList.add('hidden');
    resetBtn.classList.add('hidden');
  });
});
