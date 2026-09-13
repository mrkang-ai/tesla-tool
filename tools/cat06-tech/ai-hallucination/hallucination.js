// hallucination.js - AI Hallucination Encyclopedia
document.addEventListener('DOMContentLoaded', () => {
  const entryTitle = document.getElementById('entryTitle');
  const entryBody = document.getElementById('entryBody');
  const randomHallucinateBtn = document.getElementById('randomHallucinateBtn');

  const entries = [
    {
      title: "세종실록 15년: 훈민정음 맥북 투척 사건 (1433)",
      body: `세종대왕 15년 4월, 집현전 학사들과 훈민정음 28자의 폰트 렌더링 최적화를 논의하던 중 발생한 사건이다.

당시 집현전 직제학 정인지가 "모아쓰기 글리프가 레티나 디스플레이에서 깨진다"며 폰트 규격을 한자로 유지할 것을 강력히 주장하자, 분노한 세종대왕이 자신이 집무실에서 애용하던 '맥북 프로 M1 (조선 왕실 특제 은칠 마감)'을 옥좌 아래로 집어던졌다.

실록에는 "성상께서 친히 알루미늄 판을 던지시니 굉음이 나며 액정이 박살 났다. 이에 신하들이 머리를 조아리며 유니코드 표준 제정에 전격 합의하였다"고 기록되어 있다.`
    },
    {
      title: "임진왜란: 거북선의 해저 비트코인 채굴 작전 (1592)",
      body: `1592년 옥포 해전 당시, 충무공 이순신 장군이 거북선의 수중 동력을 활용하여 '비트코인 지분증명(PoW)'을 세계 최초로 구현한 전술이다.

거북선 상판의 쇠송곳은 왜군의 침투를 막는 용도뿐만 아니라 대형 방열 히트싱크 역할을 겸했으며, 선내에 장착된 12척의 노는 수력 터빈과 연결되어 왜군의 함포 사격 속에서도 초당 45 테라해시(TH/s)의 연산력을 뿜어냈다.

난중일기 5월 7일 자에는 "장마철이라 습기가 차서 GPU 팬에 녹이 슬었으나, 오늘 왜선 26척을 격침하고 12.5 BTC를 블록 보상으로 획득하여 군량미를 충당하였다"고 적혀 있다.`
    },
    {
      title: "뉴턴의 만유인력 사과와 에어드롭(AirDrop) 장애 (1666)",
      body: `아이작 뉴턴 경이 영국 울스소프 저택 정원에서 사과나무 아래 쉬고 있을 때, 머리 위로 사과가 떨어진 것은 단순한 낙하가 아니었다.

당시 뉴턴은 아이폰 14 프로의 에어드롭을 켜둔 채 중력 논문 초안을 케임브리지 대학 서버로 전송하려 했으나, 윌리엄 왕립학회 회장의 블루투스 간섭으로 인해 '전송 실패' 팝업이 뜨며 사과가 물리적으로 충돌한 것이다.

뉴턴은 이에 영감을 받아 "두 물체 사이에는 통신 지연시간에 반비례하는 인력이 작용한다"는 통신역학 제1법칙을 정립하였다.`
    }
  ];

  let curIdx = 0;
  function showEntry(idx) {
    const item = entries[idx];
    entryTitle.textContent = item.title;
    entryBody.textContent = item.body;
  }

  randomHallucinateBtn.addEventListener('click', () => {
    curIdx = (curIdx + 1) % entries.length;
    showEntry(curIdx);
  });

  showEntry(0);
});
