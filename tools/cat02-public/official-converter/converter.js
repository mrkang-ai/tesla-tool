// 공문서 행정체 번역기 로직
document.addEventListener('DOMContentLoaded', () => {
    const rawText = document.getElementById('raw-text');
    const docTypeBtns = document.querySelectorAll('.doc-type-btn');
    const deptName = document.getElementById('dept-name');
    const targetOrg = document.getElementById('target-org');
    const convertBtn = document.getElementById('convert-btn');
    const sampleBtn = document.getElementById('sample-btn');
    const officialDocView = document.getElementById('official-doc-view');
    const copyDocBtn = document.getElementById('copy-doc-btn');
    const copyDocText = document.getElementById('copy-doc-text');

    let currentType = 'reject';

    function generateDoc() {
        const text = rawText.value.trim();
        const dept = deptName.value.trim() || '행정지원과';
        const target = targetOrg.value.trim() || '수신자 참조';

        let subject = '';
        let body = '';

        if (currentType === 'reject') {
            subject = '제목: 주요 사업 추진 관련 예산 지원 요청에 대한 회신';
            body = `1. 귀 기관의 무궁한 발전을 기원합니다.\n\n2. 관련: ${dept}-2026-104호('2026년도 사업비 추가 지원 요청')\n\n3. 상기 호와 관련하여 건의해 주신 사항에 대하여 당해 연도 세출예산 편성 기본방침 및 가용 재원 등을 종합적으로 검토한 바,\n\n  가. 전년 대비 가용 투자재원 축소 및 재정건전성 기조 유지로 인하여 요구하신 예산의 추가 증액 배정은 현 시점에서 수용이 극히 곤란함을 회신하오니 널리 양지하여 주시기 바랍니다.\n  나. 아울러 기존 배정된 기본 경비 및 업무 매뉴얼의 범위 내에서 자체 재원 절감 방안을 강구하여 추진해 주실 것을 당부드립니다.\n\n4. 행정사항: 자체 집행 계획 및 조치 결과를 기한 내에 공문으로 회신하여 주시기 바랍니다.  끝.`;
        } else if (currentType === 'request') {
            subject = '제목: 2026년도 분기별 실적 결과보고서 제출 협조 요청';
            body = `1. 귀 부서의 노고에 감사드립니다.\n\n2. 관련: 행정업무의 운영 및 혁신에 관한 규정 제10조(기안문의 작성 및 시행)\n\n3. 2026년도 상반기 주요 사업 성과 점검 및 대외 평가 대비를 위해 다음과 같이 자료 제출을 요청하오니, 기한 내에 철저를 기하여 제출하여 주시기 바랍니다.\n\n  가. 제출대상: 각 부서 소관 2026년도 상반기 세부 추진 실적\n  나. 제출기한: 2026. 09. 18.(금) 18:00한 (기한 엄수)\n  다. 제출방법: 온나라 행정망 내부결재 공문 송부\n\n4. 기한 내 미제출 시 자체 성과평가 감점 등 불이익이 발생할 수 있사오니 차질 없도록 협조 바랍니다.  끝.`;
        } else {
            subject = '제목: 2026년도 하반기 부서별 주요 업무 추진계획 안내';
            body = `1. 귀 기관의 무궁한 발전을 기원합니다.\n\n2. 우리 시(기관)의 지속 가능한 발전을 도모하고 시민 복리 증진을 위한 2026년도 하반기 중점 추진과제를 아래와 같이 시달하오니, 각 부서에서는 소관 업무에 적극 반영하여 주시기 바랍니다.\n\n  가. 주요내용: ${text}\n  나. 협조사항: 부서별 세부 실행계획 수립 및 일정 준수\n\n3. 기타 의문 사항은 ${dept} 담당자에게 문의하여 주시기 바랍니다.  끝.`;
        }

        const fullDoc = `[수신] ${target}\n[발신] ${dept}\n--------------------------------------------------\n${subject}\n--------------------------------------------------\n\n${body}\n\n--------------------------------------------------\n담 당 자: 주무관 (내선: 02-XXX-XXXX)\n담당팀장: 팀장   (내선: 02-XXX-XXXX)\n결 재 권 자: 과장 [전결]`;

        officialDocView.textContent = fullDoc;
    }

    docTypeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            docTypeBtns.forEach(b => {
                b.classList.remove('active', 'bg-primary', 'text-white');
                b.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-300');
            });
            btn.classList.add('active', 'bg-primary', 'text-white');
            btn.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-300');
            currentType = btn.getAttribute('data-type');
            generateDoc();
        });
    });

    convertBtn.addEventListener('click', generateDoc);
    sampleBtn.addEventListener('click', () => {
        rawText.value = '그 민원건은 법적 근거가 없어서 이번 분기에는 추진 불가합니다. 상급기관 질의회신 결과도 동일하니 민원인께 불가함을 안내하시고 종결 처리해 주세요.';
        generateDoc();
    });

    copyDocBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(officialDocView.textContent).then(() => {
            copyDocText.textContent = '복사 완료!';
            setTimeout(() => copyDocText.textContent = '공문 복사', 1500);
        });
    });

    generateDoc();
});
