// rider.js - Free Rider Detector
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('villainBehaviors');
  const targetName = document.getElementById('targetName');
  const targetRole = document.getElementById('targetRole');
  const diagnoseBtn = document.getElementById('diagnoseBtn');
  const villainBadge = document.getElementById('villainBadge');
  const contribScore = document.getElementById('contribScore');
  const villainType = document.getElementById('villainType');
  const profReport = document.getElementById('profReport');
  const chatNotice = document.getElementById('chatNotice');
  const copyProfBtn = document.getElementById('copyProfBtn');
  const copyChatBtn = document.getElementById('copyChatBtn');

  const behaviors = [
    { id: 1, text: "단톡방 회의 소집 공지에 24시간 넘게 1 안 사라지거나 읽씹함", penalty: 12 },
    { id: 2, text: "역할 분담 때 '저 PPT는 진짜 못해서...' 하면서 가장 쉬운 파트 유도", penalty: 10 },
    { id: 3, text: "조사해 온 자료가 네이버 블로그/나무위키 서식 그대로 복사 붙여넣기임", penalty: 15 },
    { id: 4, text: "1차 마감 직전에 '갑자기 집안에 일이 생겨서..' 상투적 핑계 투척", penalty: 12 },
    { id: 5, text: "회의 때 '다 좋아요!', '저는 상관없어요' 앵무새 답변만 반복", penalty: 8 },
    { id: 6, text: "파일 보내달라고 3번 독촉해야 카톡 텍스트 몇 줄 툭 던짐", penalty: 10 },
    { id: 7, text: "PPT 폰트가 다 깨지고 배경도 없는 기본 흰색 슬라이드 제출", penalty: 12 },
    { id: 8, text: "발표 전날 밤 연락 두절되거나 당일 아침 지각", penalty: 15 },
    { id: 9, text: "피드백을 주면 '그럼 님이 고쳐주세요' 시전", penalty: 10 },
    { id: 10, text: "최종 제출본 표지에 자기 이름 오타 났는지만 칼같이 확인함", penalty: 8 }
  ];

  container.innerHTML = behaviors.map(b => `
    <label class="flex items-start gap-2 p-2 rounded bg-slate-900/60 hover:bg-slate-900 border border-slate-700/60 cursor-pointer transition text-xs">
      <input type="checkbox" data-id="${b.id}" class="v-cb mt-0.5 rounded text-rose-500 bg-slate-800 border-slate-600">
      <span class="text-slate-300">${b.text}</span>
    </label>
  `).join('');

  // Default check top 4 for demo
  document.querySelectorAll('.v-cb').forEach((cb, idx) => {
    if (idx < 4) cb.checked = true;
  });

  function diagnose() {
    const name = targetName.value.trim() || "해당 조원";
    const role = targetRole.value.trim() || "자료 조사";

    const cbs = document.querySelectorAll('.v-cb');
    let totalPenalty = 0;
    let checkedCount = 0;

    cbs.forEach(cb => {
      if (cb.checked) {
        const id = parseInt(cb.getAttribute('data-id'), 10);
        const item = behaviors.find(b => b.id === id);
        totalPenalty += item.penalty;
        checkedCount++;
      }
    });

    const calculatedContrib = Math.max(0, 100 - totalPenalty);
    contribScore.textContent = `실질 기여도 ${calculatedContrib}%`;

    let vText = "";
    if (checkedCount >= 7) {
      vText = `[재앙급 빌런 보스] "이름 표기 삭제 및 F학점 부여 강력 권고"`;
      villainBadge.textContent = "빌런 지수: 재앙 (99%)";
      villainBadge.className = "px-3 py-1 bg-rose-600 text-white rounded-full text-xs font-bold animate-pulse";
    } else if (checkedCount >= 4) {
      vText = `[숙련된 버스 승객] "적당히 묻어가며 무임승차를 노리는 얌체형"`;
      villainBadge.textContent = "빌런 지수: 위험 (75%)";
      villainBadge.className = "px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-bold";
    } else {
      vText = `[경미한 의심] "소통 부진형 (약간의 채찍질로 교정 가능)"`;
      villainBadge.textContent = "빌런 지수: 주의 (35%)";
      villainBadge.className = "px-3 py-1 bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded-full text-xs font-bold";
    }
    villainType.textContent = vText;

    // Report for professor
    profReport.value = `[팀 프로젝트 조원별 실질 기여도 보고서]

교수님 안녕하십니까, 00분반 [팀명] 조장입니다.
공정하고 엄정한 성적 평가를 위해 프로젝트 진행 과정에서의 조원별 기여도를 객관적 증빙과 함께 보고드립니다.

1. 대상 조원: ${name} (배정 역할: ${role})
2. 산출 기여도: ${calculatedContrib}% (기준치 100% 대비)
3. 주요 사유 및 사실 관계:
 - 사전 고지된 마감 기한 미준수 및 회의 상습 불참
 - 제출된 결과물의 질적 미흡(출처 불명 및 2차 가공 부재)으로 타 조원들의 전면 재작업 발생
 - 지속적인 연락 두절로 인한 전체 일정 지연

위 사유로 인해 타 조원들의 만장일치 의견에 따라 최종 제출 보고서 및 PPT 표지에서의 기여도 차등 반영을 요청드립니다.`;

    // Chat notice
    chatNotice.textContent = `${name}님, 그동안 수고 많으셨습니다. 공지드렸던 과제 최종 취합 마감 시간이 경과하였으나 전달해주신 내용의 보완이 이루어지지 않아, 팀원들과의 상의 끝에 제출 보고서 기여도 명단에서는 제외하기로 결정하였습니다. 이 점 양해 부탁드리며, 추가 문의는 조장에게 개인톡 주시기 바랍니다.`;
  }

  diagnoseBtn.addEventListener('click', diagnose);

  copyProfBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(profReport.value);
    copyProfBtn.textContent = "복사됨!";
    setTimeout(() => copyProfBtn.textContent = "복사", 2000);
  });

  copyChatBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(chatNotice.textContent);
    copyChatBtn.textContent = "복사됨!";
    setTimeout(() => copyChatBtn.textContent = "복사", 2000);
  });

  diagnose();
});
