// audit.js - Self-Audit Checklist & Defense Builder
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('checklistContainer');
  const riskBar = document.getElementById('riskBar');
  const riskScore = document.getElementById('riskScore');
  const riskBadge = document.getElementById('riskBadge');
  const riskDesc = document.getElementById('riskDesc');
  const checkAllBtn = document.getElementById('checkAllBtn');

  const defenseCategory = document.getElementById('defenseCategory');
  const defenseDetails = document.getElementById('defenseDetails');
  const buildDefenseBtn = document.getElementById('buildDefenseBtn');
  const defenseOutput = document.getElementById('defenseOutput');
  const copyDefenseBtn = document.getElementById('copyDefenseBtn');

  const checklist = [
    { id: 1, title: "법인카드 23시 이후 심야 또는 자택 인근 결제 내역 없음", weight: 12, safe: true },
    { id: 2, title: "주말/공휴일 법카 집행 시 사전 품의서 및 비상근무 증빙 구비", weight: 10, safe: true },
    { id: 3, title: "동일 업체 대상 동일 품목 분할 수의계약(쪼개기 발주) 없음", weight: 15, safe: true },
    { id: 4, title: "관외 출장 시 대중교통 승차권(영수증) 또는 유류비 톨게이트 전표 일치", weight: 8, safe: true },
    { id: 5, title: "재택근무 및 유연근무 시간 중 사적 외출 및 대리 태그 없음", weight: 10, safe: true },
    { id: 6, title: "업무추진비 집행 시 상대방 소속·성명 등 집행목적 명확 기재", weight: 10, safe: true },
    { id: 7, title: "보조금 정산 시 세금계산서 및 통장 이체증 전수 일치", weight: 12, safe: true },
    { id: 8, title: "공용 차량 사적 이용(퇴근 후 자택 운행 등) 기록 일체 없음", weight: 8, safe: true },
    { id: 9, title: "물품 수령 검수 시 납품 사진 및 시리얼 넘버 장부 등재 완료", weight: 7, safe: true },
    { id: 10, title: "강의료·원고료 수령 시 외부강의 겸직 사전 신고 완료", weight: 6, safe: true },
    { id: 11, title: "회의 참석비/자문료 지급 대상자의 실제 서명 원본 보관", weight: 7, safe: true },
    { id: 12, title: "정보공개 청구 비공개 결정 시 법적 조항 및 구체 사유 명시", weight: 5, safe: true }
  ];

  // Render items
  container.innerHTML = checklist.map(item => `
    <label class="flex items-start gap-2.5 p-2 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-700/60 cursor-pointer transition">
      <input type="checkbox" data-id="${item.id}" checked class="audit-cb mt-0.5 rounded text-rose-600 focus:ring-rose-500 bg-slate-800 border-slate-600">
      <div class="flex-1">
        <span class="text-slate-200 font-medium">${item.id}. ${item.title}</span>
        <span class="block text-sm text-slate-500">배점 가중치: ${item.weight}pt</span>
      </div>
    </label>
  `).join('');

  function updateRisk() {
    const checkboxes = document.querySelectorAll('.audit-cb');
    let violatedScore = 0;
    
    checkboxes.forEach(cb => {
      const id = parseInt(cb.getAttribute('data-id'), 10);
      const item = checklist.find(c => c.id === id);
      if (!cb.checked) {
        violatedScore += item.weight;
      }
    });

    // Score is 0 to 100
    riskScore.textContent = `${violatedScore} / 100 pt`;
    riskBar.style.width = `${violatedScore}%`;

    if (violatedScore === 0) {
      riskBar.className = "bg-emerald-500 h-full transition-all duration-500";
      riskBadge.className = "px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-sm font-bold";
      riskBadge.textContent = "완벽 (청렴도 1등급)";
      riskDesc.textContent = "모든 법적·행정적 규정을 철저히 준수하고 있습니다. 감사관도 칭찬하고 지나갈 수준입니다.";
    } else if (violatedScore <= 25) {
      riskBar.className = "bg-yellow-500 h-full transition-all duration-500";
      riskBadge.className = "px-3 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full text-sm font-bold";
      riskBadge.textContent = "주의 (구두 경고 위험)";
      riskDesc.textContent = "경미한 서류 미비가 존재합니다. 사전 영수증 첨부 및 지출결의서 보완을 권장합니다.";
    } else if (violatedScore <= 50) {
      riskBar.className = "bg-orange-500 h-full transition-all duration-500";
      riskBadge.className = "px-3 py-1 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full text-sm font-bold";
      riskBadge.textContent = "경고 (문책/시정 요구)";
      riskDesc.textContent = "감사 적발 시 '주의' 또는 '시정' 처분이 예상됩니다. 소명 사유서를 즉시 미리 준비하십시오.";
    } else {
      riskBar.className = "bg-rose-500 h-full transition-all duration-500";
      riskBadge.className = "px-3 py-1 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-full text-sm font-bold";
      riskBadge.textContent = "위기 (감사원 출두 각)";
      riskDesc.textContent = "중대한 회계/복무 위반 소지가 높습니다. 즉각적인 전수조사 및 환수/정정 조치가 시급합니다!";
    }
  }

  container.addEventListener('change', updateRisk);

  let allChecked = true;
  checkAllBtn.addEventListener('click', () => {
    allChecked = !allChecked;
    document.querySelectorAll('.audit-cb').forEach(cb => cb.checked = allChecked);
    checkAllBtn.textContent = allChecked ? "모두 해제" : "모두 체크";
    updateRisk();
  });

  // Defense statement builder
  const defenseTemplates = {
    card_weekend: (det) => `[자체 감사 문답서(소명서) 초안]

■ 건 명: 주말/공휴일 업무추진비(법인카드) 집행 건에 관한 소명

1. 집행 경위:
당해 집행 건은 ${det || "갑작스러운 기상 특보에 따른 비상근무 체제 가동"}으로 인하여 상황실 근무 요원 및 현장 지원 인력의 긴급 급식 제공 목적으로 집행되었습니다.

2. 불가피성:
주말 중 청사 인근 지정 식당이 대다수 휴무 상태였으며, 신속한 현장 대응 유지를 위해 부득이 관내 영업 중인 식음료점을 이용하였습니다.

3. 증빙 조치:
당일 비상소집 명부 및 상황 보고서 사본을 첨부하오니 사적 유용이 일체 없었음을 혜량하여 주시기 바랍니다.`,

    travel_overlap: (det) => `[자체 감사 문답서(소명서) 초안]

■ 건 명: 관내 출장여비 및 식대 중복 집행 의심 건 소명

1. 사실 관계:
관내 출장 시간(4시간 미만) 중 부득이하게 외부 협력기관과의 긴급 대책 간담회가 연계되어 업무추진비로 식사가 제공되었습니다.

2. 조치 사항:
여비 지급 규정 제00조에 따라 제공된 식대 상당액을 자진 반납(환수 조치 완료, 세입세출외현금 영수증 첨부)하였으며, 고의적 부당 수령 의도가 전혀 없었음을 소명합니다.`,

    contract_split: (det) => `[자체 감사 문답서(소명서) 초안]

■ 건 명: 물품 구매 수의계약 분할 발주 의혹 건에 관한 소명

1. 분할 사유:
당해 사업은 당초 상반기 수요 예측에 따른 1차 집행 이후, 예기치 못한 제도 개편에 따라 ${det || "하반기 긴급 추가 수요가 발생"}하여 별도 품의된 건입니다.

2. 법적 검토:
수의계약 한도액 회피를 위한 고의적 쪼개기 발주가 아니며, 시기별 예산 배정 시점의 차이에서 비롯된 정당한 분리 집행이었음을 증명합니다.`,

    work_overtime: (det) => `[자체 감사 문답서(소명서) 초안]

■ 건 명: 초과근무 시간 중 청사 이탈 의혹 건에 관한 소명

1. 경위 설명:
당일 19시~20시 사이의 청사 외출 내역은 단순 사적 용무가 아니며, ${det || "야간 현장 시설물 안전 점검 및 야간 근무자 비상 물품 수급"}을 위한 공무상 이동이었습니다.

2. 보충 증빙:
현장 점검 사진 및 업무 일지를 추가 증빙으로 제출합니다.`
  };

  function buildDefense() {
    const key = defenseCategory.value;
    const det = defenseDetails.value.trim();
    defenseOutput.value = defenseTemplates[key](det);
  }

  buildDefenseBtn.addEventListener('click', buildDefense);

  copyDefenseBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(defenseOutput.value).then(() => {
      copyDefenseBtn.textContent = "복사됨!";
      setTimeout(() => copyDefenseBtn.textContent = "복사", 2000);
    });
  });

  // initial build
  buildDefense();
  updateRisk();
});
