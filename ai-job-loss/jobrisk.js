// jobrisk.js - AI Job Replacement Risk Meter
document.addEventListener('DOMContentLoaded', () => {
  const jobSelect = document.getElementById('jobSelect');
  const calcJobBtn = document.getElementById('calcJobBtn');
  const jobRiskScore = document.getElementById('jobRiskScore');
  const jobRiskBadge = document.getElementById('jobRiskBadge');
  const jobAdvice = document.getElementById('jobAdvice');

  const DATA = {
    data_entry: { score: 95, badge: "멸종 위험도 99% (즉시 전환 필요)", advice: "단순 타이핑 및 장부 정리는 이미 AI가 수초 만에 수행합니다. 데이터 분석 및 기획 역량으로 피봇하세요." },
    translator: { score: 85, badge: "극도로 위험 (기계번역 독점)", advice: "단순 직역은 끝났습니다. 문화적 맥락을 살리는 초벌 검수자 및 로컬라이징 디렉터로 진화해야 합니다." },
    coder: { score: 58, badge: "중간 위험 (코파일럿 공존)", advice: "단순 코딩은 AI가 대체합니다. 아키텍처 설계, 보안 검증, 비즈니스 요구사항 해석 능력이 핵심 경쟁력입니다." },
    lawyer: { score: 45, badge: "부분 자동화 (보조 툴 활용)", advice: "판례 검색은 AI가 돕고, 최종 법정 변론과 의뢰인과의 인간적 교감은 인간 변호사가 독점합니다." },
    doctor: { score: 25, badge: "안전 (면허 규제 & 신체 접촉)", advice: "진단 보조는 AI가 맡지만 수술, 환자 라포 형성, 법적 책임은 인간 의사의 고유 영역입니다." },
    plumber: { score: 8, badge: "철통 안전 (물리적 손재주 1위)", advice: "복잡한 배관 현장과 좁은 싱크대 밑을 기어들어가는 휴머노이드 로봇은 30년 뒤에도 상용화되기 어렵습니다. 안심하세요." },
    artist: { score: 15, badge: "안전 (인간 고유의 영혼)", advice: "생성형 AI가 이미지를 그릴 수 있어도, 무대 위 인간의 땀방울과 호흡을 대체할 순 없습니다." }
  };

  function update() {
    const k = jobSelect.value;
    const item = DATA[k];

    jobRiskScore.textContent = `${item.score}%`;
    jobRiskBadge.textContent = item.badge;
    jobAdvice.textContent = item.advice;

    if (item.score >= 70) {
      jobRiskScore.className = "text-5xl sm:text-6xl font-black font-mono text-rose-400 my-2";
      jobRiskBadge.className = "inline-block px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full text-xs font-bold font-mono animate-pulse";
    } else if (item.score >= 40) {
      jobRiskScore.className = "text-5xl sm:text-6xl font-black font-mono text-yellow-400 my-2";
      jobRiskBadge.className = "inline-block px-3 py-1 bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded-full text-xs font-bold font-mono";
    } else {
      jobRiskScore.className = "text-5xl sm:text-6xl font-black font-mono text-emerald-400 my-2";
      jobRiskBadge.className = "inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold font-mono";
    }
  }

  calcJobBtn.addEventListener('click', update);
  jobSelect.addEventListener('change', update);

  update();
});
