// sanitize.js - Hate Sanitizer
document.addEventListener('DOMContentLoaded', () => {
  const hateIn = document.getElementById('hateIn');
  const sanitizedOut = document.getElementById('sanitizedOut');

  const replacements = [
    { from: /개노잼/g, to: "너무나 매력적이고 흥미진진" },
    { from: /때려쳐라/g, to: "평생 작품을 만들어주세요" },
    { from: /이딴 걸/g, to: "이토록 소중한 것을" },
    { from: /극혐/g, to: "극도로 치명적인 매력" },
    { from: /ㅉㅉ/g, to: "박수를 짝짝 보냅니다" }
  ];

  function sanitize() {
    let str = hateIn.value.trim();
    if (!str) {
      sanitizedOut.textContent = "정화할 악플을 왼쪽에 입력해주세요.";
      return;
    }

    replacements.forEach(r => { str = str.replace(r.from, r.to); });

    sanitizedOut.textContent = `🌸 "${str} (당신의 반짝이는 재능에 질투가 나서 서툴게나마 사랑을 고백합니다! 💖)"`;
  }

  hateIn.addEventListener('input', sanitize);
  hateIn.value = "이딴 걸 영상이라고 올렸냐? 개노잼이니까 때려쳐라 ㅉㅉ";
  sanitize();
});
