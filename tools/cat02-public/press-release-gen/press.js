// press.js - Official Press Release Generator
document.addEventListener('DOMContentLoaded', () => {
  const embargoType = document.getElementById('embargoType');
  const deptName = document.getElementById('deptName');
  const projectName = document.getElementById('projectName');
  const toneStyle = document.getElementById('toneStyle');
  const keyPoints = document.getElementById('keyPoints');
  const contactPerson = document.getElementById('contactPerson');
  const contactTel = document.getElementById('contactTel');
  const generateBtn = document.getElementById('generateBtn');
  const sampleBtn = document.getElementById('sampleBtn');
  const copyBtn = document.getElementById('copyBtn');
  const printBtn = document.getElementById('printBtn');

  const docBadge = document.getElementById('docBadge');
  const docDate = document.getElementById('docDate');
  const docDept = document.getElementById('docDept');
  const docOfficer = document.getElementById('docOfficer');
  const docPhone = document.getElementById('docPhone');
  const outputContent = document.getElementById('outputContent');

  const grandModifiers = [
    "새로운 지평을 열고 미래 도약의 발판을 마련",
    "선도적 패러다임 대전환을 본격 천명",
    "초격차 경쟁력 확보를 향한 전사적 총력전",
    "지속 가능한 혁신 생태계의 대대적 구축"
  ];

  const warmModifiers = [
    "국민의 일상 속 체감형 변화와 온기 확산",
    "사회적 약자를 보듬는 따뜻하고 촘촘한 동반자",
    "국민 눈높이에 맞춘 소통과 포용의 행정 구현",
    "민생 안정의 든든한 버팀목 역할 톡톡"
  ];

  const emergencyModifiers = [
    "한 치의 오차 없는 무관용 원칙과 촘촘한 안전망",
    "선제적·능동적 총력 대응 체계 즉각 가동",
    "위기 요인을 발본색원하고 근본적 체질 개선 단행",
    "빈틈없는 현장 점검과 24시간 상시 감시망 가동"
  ];

  function generate() {
    const proj = projectName.value.trim() || "디지털 행정 혁신 계획";
    const dept = deptName.value.trim() || "혁신행정과";
    const officer = contactPerson.value.trim() || "담당 사무관";
    const phone = contactTel.value.trim() || "02-1234-5678";
    const tone = toneStyle.value;

    let subMod = grandModifiers[0];
    if (tone === 'warm') subMod = warmModifiers[0];
    if (tone === 'emergency') subMod = emergencyModifiers[0];

    // Header badge
    const today = new Date();
    const dateStr = `${today.getFullYear()}. ${String(today.getMonth()+1).padStart(2,'0')}. ${String(today.getDate()).padStart(2,'0')}.`;
    docDate.textContent = dateStr;
    docDept.textContent = dept;
    docOfficer.textContent = officer;
    docPhone.textContent = phone;

    if (embargoType.value === '즉시') {
      docBadge.textContent = "배포 즉시 보도하여 주시기 바랍니다.";
    } else if (embargoType.value === '조간') {
      docBadge.textContent = `엠바고: ${dateStr} 석간(12:00) 이후 보도 가능`;
    } else {
      docBadge.textContent = `보도 시점 지정: ${dateStr} 06:00 이후`;
    }

    // Parse bullets
    const rawLines = keyPoints.value.split('\n').map(s => s.trim()).filter(Boolean);
    const bullets = rawLines.length ? rawLines : [
      "스마트 자동화 플랫폼 전면 도입으로 처리 시간 대폭 단축",
      "취약계층 맞춤형 밀착 지원 서비스 신설",
      "분기별 정례 모니터링 및 민관 합동 자문단 상시 운영"
    ];

    const bulletHtml = bullets.map(b => `<li class="pl-1"><b>ㅇ</b> ${b}</li>`).join('');

    const html = `
      <div class="text-center my-4">
        <p class="text-sm font-sans text-blue-800 tracking-wider font-semibold mb-1">[ 보도자료 ]</p>
        <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
          "${proj}" 본격 시동...<br/>${subMod}
        </h2>
        <p class="text-sm font-sans text-slate-500 mt-2">
          - 행정 역량 총결집으로 국민 신뢰 회복 및 일하는 방식 근본적 혁신 선도 -
        </p>
      </div>

      <div class="bg-slate-50 border-y border-slate-200 py-3 px-4 my-3 text-sm sm:text-sm font-sans text-slate-700">
        <b>[핵심 요약]</b> ${dept}은(는) 12일, 급변하는 대내외 행정 환경에 선제적으로 부응하고 행정 서비스의 일대 도약을 이루기 위하여 <b>「${proj}」</b>을(를) 전격 확정·시행한다고 밝혔다.
      </div>

      <div class="space-y-3 text-sm sm:text-sm">
        <div>
          <h3 class="font-bold text-slate-900 text-sm mb-1 font-sans">□ 추진 배경 및 필요성</h3>
          <p class="text-slate-700 indent-2">
            그간 제기되어 온 현장의 다양한 목소리와 구조적 한계를 근본적으로 타개하고자, 유관 부서 간 유기적 협업과 심도 있는 의견 수렴을 거쳐 이번 종합 대책을 수립하였다. 특히 관행적 업무 방식을 과감히 탈피하고 실효성 있는 성과 창출에 방점을 두었다.
          </p>
        </div>

        <div>
          <h3 class="font-bold text-slate-900 text-sm mb-1 font-sans">□ 주요 추진 과제</h3>
          <ul class="space-y-1.5 text-slate-800">
            ${bulletHtml}
          </ul>
        </div>

        <div>
          <h3 class="font-bold text-slate-900 text-sm mb-1 font-sans">□ 향후 계획 및 기대 효과</h3>
          <p class="text-slate-700 indent-2">
            ${dept} 관계자는 "이번 종합 대책 추진을 통해 단순한 제도 개선을 넘어 가시적이고 체감할 수 있는 획기적 성과가 도출될 것"이라며, "앞으로도 현장 밀착형 피드백을 지속 반영하여 차질 없이 완수하겠다"고 강조했다.
          </p>
        </div>
      </div>

      <div class="text-right text-sm text-slate-400 font-sans mt-4">
        &lt;끝&gt;
      </div>
    `;

    outputContent.innerHTML = html;
  }

  generateBtn.addEventListener('click', generate);

  sampleBtn.addEventListener('click', () => {
    projectName.value = "차세대 클라우드 민원 인공지능 어시스턴트 도입 계획";
    deptName.value = "공공데이터혁신본부 스마트행정기획과";
    keyPoints.value = "복잡한 서식 자동완성 알고리즘 탑재로 민원 작성 시간 70% 단축\n어르신 및 시각장애인을 위한 음성 대화형 민원 접수 창구 개설\n365일 24시간 실시간 무중단 심사 체계 가동";
    contactPerson.value = "이민우 사무관";
    contactTel.value = "044-205-3030";
    generate();
  });

  copyBtn.addEventListener('click', () => {
    const text = outputContent.innerText;
    navigator.clipboard.writeText(text).then(() => {
      const original = copyBtn.innerHTML;
      copyBtn.innerHTML = '<i class="fa-solid fa-check text-green-400"></i> 복사 완료!';
      setTimeout(() => copyBtn.innerHTML = original, 2000);
    });
  });

  printBtn.addEventListener('click', () => {
    window.print();
  });

  // initial generate
  generate();
});
