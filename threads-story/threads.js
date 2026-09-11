// threads.js - Threads Viral Storyteller
document.addEventListener('DOMContentLoaded', () => {
  const threadIn = document.getElementById('threadIn');
  const convertThreadBtn = document.getElementById('convertThreadBtn');
  const copyThreadBtn = document.getElementById('copyThreadBtn');
  const threadOut = document.getElementById('threadOut');

  function convert() {
    const raw = threadIn.value.trim();
    if (!raw) {
      threadOut.textContent = "내용을 입력하세요.";
      return;
    }

    const story = `오늘 문득 든 생각입니다.\n\n${raw}\n\n사실 예전의 저였다면 그냥 지나쳤을 일인데\n가만히 곱씹어 보니 꽤 많은 생각이 들더라고요.\n\n우리는 어쩌면 너무 앞만 보고 달리느라\n정작 중요한 것들을 놓치고 있는 건 아닐까요?\n\n완벽하지 않아도 괜찮습니다.\n그냥 오늘 하루도 묵묵히 버텨낸 나 자신을\n조금은 안아줘도 되는 날인 것 같아요.\n\n스친 여러분의 오늘은 어떠셨나요? 💭`;

    threadOut.textContent = story;
  }

  convertThreadBtn.addEventListener('click', convert);

  copyThreadBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(threadOut.textContent);
    copyThreadBtn.textContent = "복사됨!";
    setTimeout(() => copyThreadBtn.textContent = "복사", 2000);
  });

  threadIn.value = "오늘 퇴근길 지하철에서 문득 주위를 둘러봤는데 다들 지쳐 보였다.";
  convert();
});
