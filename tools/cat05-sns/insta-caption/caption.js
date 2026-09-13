// caption.js - Instagram Caption Generator
document.addEventListener('DOMContentLoaded', () => {
  const moodSelect = document.getElementById('moodSelect');
  const placeInput = document.getElementById('placeInput');
  const genCaptionBtn = document.getElementById('genCaptionBtn');
  const copyCaptionBtn = document.getElementById('copyCaptionBtn');
  const captionOutput = document.getElementById('captionOutput');

  const templates = {
    rainy: (pl) => `비 내리는 소리가 조용히 골목을 채우던 오후.\n유리창에 맺힌 온기와 쌉싸름한 커피 한 잔.\n\n우리가 무심코 지나쳐온 수많은 계절 속에서\n가장 다정했던 어떤 찰나에 머무르며.\n\n☕️ 🕯️ 🌫️\n#daily #mood #${pl.replace(/\s+/g, '')} #rainyafternoon`,
    hip: (pl) => `거칠게 다듬어진 콘크리트 틈새로 스며드는 빛.\n과장되지 않은 정직한 플레이트와 음악의 결.\n\n말을 아끼게 만드는 공간이 주는 무게감.\n우리는 오늘도 각자의 온도로 흐른다.\n\n🏴 🎧 ☕️\n#aesthetic #minimalism #${pl.replace(/\s+/g, '')} #record`,
    dawn: (pl) => `모두가 잠든 새벽 3시 17분.\n귓가를 맴도는 잔잔한 로파이 비트와 푸른빛 어둠.\n\n복잡했던 낮의 소음들이 가라앉고 비로소 마주하는 온전한 나.\n천천히, 깊어지는 밤.\n\n🌙 🌃 🎧\n#dawn #midnightthoughts #${pl.replace(/\s+/g, '')} #blue`,
    weekend: (pl) => `오후 세 시의 따뜻한 볕 한 줌.\n서두를 필요 없는 나른한 걸음과 바람의 냄새.\n\n주말이 주는 가장 큰 선물은\n시간을 낭비해도 죄책감이 없다는 것.\n\n🌿 🥐 ☕️\n#weekendvibes #slowlife #${pl.replace(/\s+/g, '')} #saturday`
  };

  function generate() {
    const mood = moodSelect.value;
    const pl = placeInput.value.trim() || "어느오후";
    captionOutput.textContent = templates[mood](pl);
  }

  genCaptionBtn.addEventListener('click', generate);

  copyCaptionBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(captionOutput.textContent);
    copyCaptionBtn.textContent = "복사됨!";
    setTimeout(() => copyCaptionBtn.textContent = "복사", 2000);
  });

  generate();
});
