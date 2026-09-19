// burner.js - Year-End Budget Burner
document.addEventListener('DOMContentLoaded', () => {
  const budgetInput = document.getElementById('budgetInput');
  const itemCategory = document.getElementById('itemCategory');
  const calcBtn = document.getElementById('calcBtn');
  const cartTable = document.getElementById('cartTable');
  const totalCost = document.getElementById('totalCost');
  const diffCost = document.getElementById('diffCost');
  const memoContent = document.getElementById('memoContent');
  const copyMemoBtn = document.getElementById('copyMemoBtn');

  // Items database with realistic gov/office catalog
  const catalog = [
    { name: "32인치 4K 고해상도 듀얼 피벗 모니터", price: 680000, cat: "hardware", reason: "대용량 도면 및 정밀 데이터 검토 시 화면 가시성 확보 및 눈 피로도 경감" },
    { name: "인체공학 요추 지지 프리미엄 메쉬 체어", price: 420000, cat: "office", reason: "장시간 내근 행정 업무에 따른 거북목/요통 방지 및 직원 능률 극대화" },
    { name: "초고속 양면 고속 스캐너 및 OCR 소프트웨어", price: 540000, cat: "hardware", reason: "종이 문서 디지털 공공 아카이빙 및 페이퍼리스 스마트 오피스 구현" },
    { name: "백업용 4베이 NAS 서버 (16TB)", price: 920000, cat: "hardware", reason: "랜섬웨어 및 전산망 장애 대비 필수 공공 데이터 실시간 2중 백업망 구축" },
    { name: "소음 차단 블루투스 화상회의 전용 헤드셋 (3대)", price: 330000, cat: "hardware", reason: "다자간 비대면 원격 화상회의 시 잡음 제거를 통한 업무 집중도 향상" },
    { name: "모션 전동 높이조절 데스크 (스탠딩 책상)", price: 580000, cat: "office", reason: "장시간 좌식 업무 개선 및 집중도 제고를 위한 건강형 스마트 데스크 도입" },
    { name: "A4 프리미엄 복사용지 80g (10박스)", price: 230000, cat: "consumables", reason: "정례 민원 안내서 및 감사 대비 정밀 출력물 장기 보관용 표준 용지 확보" },
    { name: "정품 토너 카트리지 블랙/컬러 4색 풀세트", price: 480000, cat: "consumables", reason: "연말연시 대외 홍보 책자 및 결산 보고서 무중단 출력을 위한 소모품 비축" },
    { name: "산업용 블루투스 바코드/라벨 프린터", price: 210000, cat: "hardware", reason: "부서 내 고정자산 태그 전수 점검 및 내구연한 식별 바코드 부착 정비" },
    { name: "무선 버티컬 인체공학 마우스/키보드 (5세트)", price: 350000, cat: "consumables", reason: "반복 손목 터널 증후군 예방을 위한 부서원 보호 기본 보급품" },
    { name: "초음파 대용량 사무실 타워형 가습기", price: 160000, cat: "office", reason: "동절기 청사 실내 적정 습도(50%) 유지 및 전산기기 정전기 발생 억제" },
    { name: "고성능 외장 NVMe SSD 2TB (암호화 보안키 내장)", price: 270000, cat: "hardware", reason: "대외 보안 감사 대비 암호화 외장 백업 스토리지 운용" },
    { name: "고속 문서 세단기 (보안 4등급 미세절단형)", price: 390000, cat: "office", reason: "개인정보보호법 준수를 위한 폐기 대상 민원 서류 즉시 영구 파쇄" },
    { name: "멀티 탭 및 서지 보호 차단기 대량 팩", price: 75000, cat: "consumables", reason: "전열 기구 과부하 예방 및 전산 설비 낙뢰 서지 보호 안전 강화" }
  ];

  function runOptimizer() {
    const target = parseInt(budgetInput.value, 10) || 0;
    const cat = itemCategory.value;

    const filtered = catalog.filter(it => cat === 'all' || it.cat === cat || it.cat === 'consumables');
    
    // Greedy heuristic with DP approximation to get close to 0 remaining
    let currentTotal = 0;
    const selected = [];

    // Sort by price descending
    const items = [...filtered].sort((a, b) => b.price - a.price);

    for (const item of items) {
      if (currentTotal + item.price <= target) {
        // how many can we add?
        const maxQty = Math.floor((target - currentTotal) / item.price);
        const qty = Math.min(maxQty, item.cat === 'hardware' ? 2 : 5);
        if (qty > 0) {
          selected.push({ ...item, qty, subtotal: item.price * qty });
          currentTotal += item.price * qty;
        }
      }
    }

    // Fill the remainder with cheap consumables if possible
    const cheap = items.find(i => i.cat === 'consumables') || items[items.length - 1];
    if (cheap && target - currentTotal >= cheap.price) {
      const extra = Math.floor((target - currentTotal) / cheap.price);
      if (extra > 0) {
        const exist = selected.find(s => s.name === cheap.name);
        if (exist) {
          exist.qty += extra;
          exist.subtotal += cheap.price * extra;
        } else {
          selected.push({ ...cheap, qty: extra, subtotal: cheap.price * extra });
        }
        currentTotal += cheap.price * extra;
      }
    }

    const diff = target - currentTotal;

    // Render table
    cartTable.innerHTML = selected.map(s => `
      <tr class="hover:bg-slate-700/30">
        <td class="py-2 px-3 font-medium text-slate-200">
          ${s.name}
          <span class="block text-sm text-slate-400 font-normal">${s.reason.slice(0, 30)}...</span>
        </td>
        <td class="py-2 px-3 text-slate-400 font-mono">${s.price.toLocaleString()}원</td>
        <td class="py-2 px-3 font-bold text-amber-400">${s.qty}개</td>
        <td class="py-2 px-3 text-right font-mono font-bold text-slate-200">${s.subtotal.toLocaleString()}원</td>
      </tr>
    `).join('');

    totalCost.textContent = `${currentTotal.toLocaleString()} 원`;
    diffCost.textContent = `${diff.toLocaleString()} 원 (달성률: ${(currentTotal / (target || 1) * 100).toFixed(1)}%)`;

    // Generate memo
    const memo = `[품의서(사유서) 초안]

1. 추진 배경 및 목적
 - 연말을 맞아 부서 내 노후 전산/사무 인프라를 정비하고, 안전하고 능률적인 행정 환경을 조성하고자 함.
 - 잔여 불용 예산을 규정에 부합하는 공공 필수 소모성 및 고정자산 비품으로 전환 집행하여 행정 생산성을 제고함.

2. 주요 구매 목록 및 집행 계획
${selected.map((s, idx) => `  ${idx + 1}) ${s.name} x ${s.qty}개 = ₩${s.subtotal.toLocaleString()}\n     └ 용도: ${s.reason}`).join('\n')}

3. 소요 예산
 - 총 집행 금액: 금 ${currentTotal.toLocaleString()}원 (VAT 포함)
 - 예산 과목: 일반수용비 / 자산취득비

위와 같이 구매 품의하오니 재가하여 주시기 바랍니다.`;

    memoContent.textContent = memo;
  }

  document.querySelectorAll('.quick-b').forEach(btn => {
    btn.addEventListener('click', () => {
      budgetInput.value = btn.getAttribute('data-val');
      runOptimizer();
    });
  });

  calcBtn.addEventListener('click', runOptimizer);
  itemCategory.addEventListener('change', runOptimizer);

  copyMemoBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(memoContent.textContent).then(() => {
      const orig = copyMemoBtn.innerHTML;
      copyMemoBtn.innerHTML = '<i class="fa-solid fa-check text-green-400 mr-1"></i> 복사됨!';
      setTimeout(() => copyMemoBtn.innerHTML = orig, 2000);
    });
  });

  runOptimizer();
});
