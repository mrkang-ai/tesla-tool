// shorts.js - Shorts Script Condenser
document.addEventListener('DOMContentLoaded', () => {
  const shortTopic = document.getElementById('shortTopic');
  const shortPoints = document.getElementById('shortPoints');
  const buildShortBtn = document.getElementById('buildShortBtn');
  const copyScriptBtn = document.getElementById('copyScriptBtn');
  const scriptContent = document.getElementById('scriptContent');

  function generate() {
    const topic = shortTopic.value.trim() || "이 비밀";
    const rawLines = shortPoints.value.split('\n').map(s => s.trim()).filter(Boolean);
    const bullets = rawLines.length ? rawLines : ["첫 번째 핵심 팁", "두 번째 꿀팁", "세 번째 필수 수칙"];

    const script = `[0~3초: 극강의 후킹 Hook]
"아직도 ${topic}, 이렇게 하고 계신 분 없죠? 10명 중 9명이 모르는 30초 꿀팁, 바로 알려드립니다!"

[4~22초: 핵심 3포인트]
${bullets.map((b, i) => `👉 포인트 ${i+1}: ${b}`).join('\n')}

[23~30초: 댓글 유도 CTA]
"여러분은 몇 번까지 지키고 계셨나요? 
더 좋은 꿀팁이 있다면 지금 바로 댓글로 남겨주세요! 저장해두고 두고두고 보세요!"`;

    scriptContent.textContent = script;
  }

  buildShortBtn.addEventListener('click', generate);

  copyScriptBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(scriptContent.textContent);
    copyScriptBtn.textContent = "복사됨!";
    setTimeout(() => copyScriptBtn.textContent = "대본 복사", 2000);
  });

  generate();
});
