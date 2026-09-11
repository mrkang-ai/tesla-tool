// Multiverse ID Card Generator
document.addEventListener('DOMContentLoaded', () => {
  const jobs = [
    { title: "은하계 솜사탕 유기농 제조 기술자", trait: "설탕을 만지면 반중력으로 둥둥 뜸.", emoji: "🍭", sal: "월 620만 크레딧" },
    { title: "우주 고양이 수면 유도 테라피스트", trait: "외계 묘족의 골골송 주파수를 완벽 모사함.", emoji: "🐱", sal: "월 480만 크레딧" },
    { title: "블랙홀 근처 시공간 왜곡 배달 기사", trait: "주문 3초 전에 이미 음식을 배달 완료함.", emoji: "🚀", sal: "월 950만 크레딧" },
    { title: "화성 옥수수밭 전문 허수아비 로봇 지휘관", trait: "모래폭풍이 불면 자동으로 춤을 춤.", emoji: "🌽", sal: "월 350만 크레딧" },
    { title: "외계어 욕설 감정 및 순화 전문가", trait: "7개 은하계의 패드립을 평화롭게 변환.", emoji: "✨", sal: "월 700만 크레딧" }
  ];

  const nameInput = document.getElementById('userName');
  const genBtn = document.getElementById('generateBtn');
  const cardName = document.getElementById('cardName');
  const cardJob = document.getElementById('cardJob');
  const cardTrait = document.getElementById('cardTrait');
  const cardSalary = document.getElementById('cardSalary');
  const avatarBox = document.getElementById('avatarBox');
  const universeTag = document.getElementById('universeTag');

  genBtn.addEventListener('click', () => {
    const name = nameInput.value.trim() || "차원 방랑자";
    const randJob = jobs[Math.floor(Math.random() * jobs.length)];
    const dimNum = Math.floor(Math.random() * 9000) + 1000;

    cardName.innerText = name;
    cardJob.innerText = randJob.title;
    cardTrait.innerText = randJob.trait;
    cardSalary.innerText = randJob.sal;
    avatarBox.innerText = randJob.emoji;
    universeTag.innerText = `지구-#${dimNum} 차원`;
  });
});
