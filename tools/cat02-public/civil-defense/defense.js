// 악성 민원 방어 스크립트 로직
document.addEventListener('DOMContentLoaded', () => {
    const typeBtns = document.querySelectorAll('.type-btn');
    const scriptTitle = document.getElementById('script-title');
    const scriptContainer = document.getElementById('script-container');
    const copyScriptBtn = document.getElementById('copy-script-btn');
    const copyScriptText = document.getElementById('copy-script-text');
    const beepBtn = document.getElementById('beep-btn');

    const breatheCircle = document.getElementById('breathe-circle');
    const breatheInstruction = document.getElementById('breathe-instruction');
    const breatheToggleBtn = document.getElementById('breathe-toggle-btn');

    const scripts = {
        verbal: {
            title: '폭언/욕설/고성방가 대응 3단계 표준 매뉴얼',
            steps: [
                { stage: '1단계: 경고 및 진정 유도', text: '"선생님, 지금 사용하시는 거친 언행과 욕설은 산업안전보건법 및 공무원 보호 규정에 위배됩니다. 원활한 상담을 위해 차분하게 말씀해 주시기를 정중히 부탁드립니다."' },
                { stage: '2단계: 녹음 고지', text: '"계속해서 폭언과 고성을 지속하실 경우 본 통화는 녹음되며, 통화 내용이 향후 법적 증빙 자료로 활용될 수 있음을 공식 고지합니다."' },
                { stage: '3단계: 단호한 통화 종료', text: '"거듭된 경고에도 불구하고 폭언을 중단하지 않으시므로 부득이하게 본 통화를 종료하겠습니다. 차후 차분하신 상태에서 다시 연락 주시기 바랍니다." (즉시 통화 종료 후 상급자 보고)' }
            ]
        },
        repeat: {
            title: '동일 사안 억지 반복/업무방해 대응 매뉴얼',
            steps: [
                { stage: '1단계: 종결 사안 명시', text: '"선생님께서 질의하신 사안은 지난 O월 O일자 공문(문서번호 XXX)으로 공식적인 행정 처분 결과와 법적 근거를 이미 3회 이상 상세히 안내해 드렸습니다."' },
                { stage: '2단계: 행정 종결 고지', text: '"민원 처리에 관한 법률 제23조(반복 및 중복 민원의 처리)에 따라 이미 종결된 동일 사안에 대해서는 추가적인 구두 답변이 제한됨을 양해해 주시기 바랍니다."' },
                { stage: '3단계: 정식 서면 이의신청 안내', text: '"결과에 이의가 있으실 경우 구두 항의가 아닌 행정심판 또는 행정소송 등 법령에 정해진 공식 쟁송 절차를 밟아 주시기 바라며, 통화를 종료하겠습니다."' }
            ]
        },
        threat: {
            title: '감사청구/직권남용 고소 협박 대응 매뉴얼',
            steps: [
                { stage: '1단계: 원칙과 규정 고지', text: '"선생님, 본 업무 처리는 관련 법령 및 부서 사무분장 규정에 의거하여 적법하고 투명하게 집행되고 있습니다."' },
                { stage: '2단계: 권리 행사 공식 안내', text: '"저희 기관의 행정 처분에 위법·부당한 점이 있다고 판단되실 경우, 국민권익위원회 또는 감사관실에 정식으로 감사 청구를 접수하실 권리가 보장되어 있습니다. 공식 창구를 이용해 주시면 감사에 성실히 임하겠습니다."' },
                { stage: '3단계: 협박 언행에 대한 경고', text: '"다만, 정당한 직무 집행에 대해 감사를 빌미로 담당자에게 심리적 위력을 가하거나 협박하는 행위는 공무집행방해에 해당할 수 있음을 엄숙히 안내드립니다."' }
            ]
        },
        privacy: {
            title: '사적 정보 요구 / 스토킹성 민원 대응 매뉴얼',
            steps: [
                { stage: '1단계: 개인정보 보호법 고지', text: '"개인정보 보호법 및 정보공개법에 따라 공무원의 성명과 직급 외에 사적인 주민등록번호, 연락처, 거주지 등은 비공개 대상 정보입니다."' },
                { stage: '2단계: 사적 질문 차단', text: '"업무와 무관한 담당자 개인의 신상에 관한 질의에는 답변드릴 수 없사오니, 민원 안건의 본론에 대해서만 말씀해 주시기 바랍니다."' },
                { stage: '3단계: 위협 시 경찰 신고 고지', text: '"담당자의 신변에 위협을 가하거나 퇴근길 미행 등 스토킹성 행위를 암시하시는 경우, 즉시 경찰서 및 법무팀에 통보하여 법적 신변보호 조치를 취할 예정입니다."' }
            ]
        }
    };

    function renderScript(type) {
        const data = scripts[type];
        scriptTitle.textContent = data.title;
        scriptContainer.innerHTML = '';

        data.steps.forEach(s => {
            const box = document.createElement('div');
            box.className = 'p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col gap-1';
            box.innerHTML = `
                <span class="text-xs font-black text-rose-600 dark:text-rose-400">${s.stage}</span>
                <p class="text-xs leading-relaxed text-slate-800 dark:text-slate-200 font-medium font-sans select-all">${s.text}</p>
            `;
            scriptContainer.appendChild(box);
        });
    }

    typeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            typeBtns.forEach(b => {
                b.classList.remove('active', 'bg-primary', 'text-white');
                b.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-300');
            });
            btn.classList.add('active', 'bg-primary', 'text-white');
            btn.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-300');
            renderScript(btn.getAttribute('data-type'));
        });
    });

    copyScriptBtn.addEventListener('click', () => {
        const allText = Array.from(scriptContainer.querySelectorAll('p')).map(p => p.textContent).join('\n\n');
        navigator.clipboard.writeText(allText).then(() => {
            copyScriptText.textContent = '복사 완료!';
            setTimeout(() => copyScriptText.textContent = '스크립트 복사', 1500);
        });
    });

    // Recording Beeper Sound
    beepBtn.addEventListener('click', () => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1000, ctx.currentTime);
            gain.gain.setValueAtTime(0.25, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.8);
            alert('"[안내] 산업안전보건법에 의거하여 지금부터 모든 통화 내용이 녹음됩니다. 삐---"');
        } catch (e) {}
    });

    // 4-7-8 Breathing Loop
    let breathingInterval = null;
    let isBreathing = false;

    function startBreathing() {
        let phase = 0; // 0: inhale (4s), 1: hold (7s), 2: exhale (8s)
        const runCycle = () => {
            if (phase === 0) {
                breatheCircle.textContent = '들숨';
                breatheCircle.style.transform = 'scale(1.35)';
                breatheInstruction.textContent = '코로 숨을 천천히 4초간 들이마십니다...';
                setTimeout(() => { if (isBreathing) { phase = 1; runCycle(); } }, 4000);
            } else if (phase === 1) {
                breatheCircle.textContent = '정지';
                breatheInstruction.textContent = '숨을 멈추고 7초간 유지하세요...';
                setTimeout(() => { if (isBreathing) { phase = 2; runCycle(); } }, 7000);
            } else {
                breatheCircle.textContent = '날숨';
                breatheCircle.style.transform = 'scale(1)';
                breatheInstruction.textContent = '입으로 8초 동안 천천히 후- 내쉽니다...';
                setTimeout(() => { if (isBreathing) { phase = 0; runCycle(); } }, 8000);
            }
        };
        runCycle();
    }

    breatheToggleBtn.addEventListener('click', () => {
        isBreathing = !isBreathing;
        if (isBreathing) {
            breatheToggleBtn.textContent = '호흡 종료';
            breatheToggleBtn.classList.replace('bg-teal-600', 'bg-rose-600');
            startBreathing();
        } else {
            breatheToggleBtn.textContent = '호흡 가이드 시작';
            breatheToggleBtn.classList.replace('bg-rose-600', 'bg-teal-600');
            breatheCircle.style.transform = 'scale(1)';
            breatheCircle.textContent = '대기';
            breatheInstruction.textContent = '4초 들이마시고, 7초 멈추고, 8초 내쉬세요.';
        }
    });

    renderScript('verbal');
});
