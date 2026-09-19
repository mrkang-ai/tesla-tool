// 넵병 탈출기 & 사회생활 쿠션어 번역 엔진
document.addEventListener('DOMContentLoaded', () => {
    const rawInput = document.getElementById('raw-input');
    const outputText = document.getElementById('output-text');
    const levelSlider = document.getElementById('level-slider');
    const levelLabel = document.getElementById('level-label');
    const toneBadge = document.getElementById('tone-badge');
    const copyBtn = document.getElementById('copy-btn');
    const copyText = document.getElementById('copy-text');
    const presetButtons = document.querySelectorAll('.preset-chip');
    const nepCards = document.querySelectorAll('.nep-card');
    const nepDiagnosis = document.getElementById('nep-diagnosis');

    const levelDescriptions = {
        1: 'Lv 1. 담백 직관 (사족 없이 명확한 전달)',
        2: 'Lv 2. 실무 정중 (일상 업무 기본 매너)',
        3: 'Lv 3. 비즈니스 쿠션 (표준 권장, 원활한 협업)',
        4: 'Lv 4. 극존칭 외교관 (품격 있는 대외 커뮤니케이션)',
        5: 'Lv 5. 은은한 광기 (친절의 탈을 쓴 치명적 논리 방어)'
    };

    const translationRules = [
        {
            keywords: ['왜 제가', '제 업무', '제가 왜'],
            levels: {
                1: '해당 업무는 현재 제 R&R(업무 분장)에 포함되어 있지 않아 진행이 어렵습니다.',
                2: '말씀주신 업무는 제 담당 영역 외의 사안으로 파악되어, 해당 유관 부서 담당자분께 인계해 주시는 편이 효율적일 것 같습니다.',
                3: '보내주신 요청 확인하였습니다. 다만 현재 제가 집중하고 있는 분기 목표 과업과의 정합성 및 담당 업무 범위를 고려했을 때, 본 건은 [OO 부서]에서 주관하시는 것이 더욱 완성도 높은 결과를 낼 것으로 사료됩니다.',
                4: '노고에 깊이 감사드립니다. 요청해 주신 사안의 취지에 깊이 공감하오나, 현재 팀 내 공식 분장표 상 본 업무는 저의 전문 분야 및 관할 범위를 다소 상회하는 것으로 판단됩니다. 보다 원활한 프로젝트 추진을 위해 담당 팀으로 에스컬레이션해 주시길 정중히 요청드립니다.',
                5: '언제나 훌륭한 업무를 기획해 주셔서 감사드립니다. 다만 본 업무가 어떠한 전략적 배경으로 제 담당으로 배정되었는지 공유해 주시면, 제 업무 분장표와 비교 검토 후 대표님 및 인사팀과 함께 롤앤롤 재조정 미팅을 요청드리도록 하겠습니다.'
            }
        },
        {
            keywords: ['퇴근', '내일 하', '던지지 마'],
            levels: {
                1: '금일 업무 시간이 종료되어 내일 오전 중 확인 후 진행하겠습니다.',
                2: '금일 정규 업무 시간이 마감된 관계로, 익일 오전 출근 즉시 우선순위로 확인하여 피드백 드리겠습니다.',
                3: '급하게 전달 주신 사항 확인했습니다. 다만 금일 잔여 업무 시간 및 업무 집중도를 감안하여, 보다 꼼꼼한 검토를 위해 내일 오전 10시까지 완료하여 공유해 드려도 괜찮으실까요?',
                4: '늦은 시간까지 수고가 많으십니다. 완성도 높은 결과물 산출을 위해 금일 무리한 진행보다는 익일 첫 업무로 면밀히 검토 및 처리하여 보고드리고자 하오니 너른 양해를 부탁드립니다.',
                5: '퇴근 직전까지 회사의 성장을 위해 고심해 주셔서 눈물겹습니다. 완성도 높은 보고를 위해 야근 수당 사전 결재 기안을 올린 후 작업에 착수하려 하오니, 상신 결재 먼저 승인 부탁드립니다.'
            }
        },
        {
            keywords: ['이미', '지난주', '메일 드렸', '슬랙'],
            levels: {
                1: '해당 자료는 지난 [OO일] 메일로 기전달 드렸으니 확인 부탁드립니다.',
                2: '말씀하신 내용은 지난 [OO일 OO시]에 발송해 드린 이메일/슬랙 스레드에 첨부되어 있으니 참조해 주시기 바랍니다.',
                3: '요청 주신 내용은 앞서 [OO월 OO일자] 메일 제목 "[기안/공유]" 건으로 이미 공유해 드린 바 있습니다. 바쁘신 업무 중 놓치셨을 수 있어 관련 링크를 다시 리마인드해 드립니다.',
                4: '확인 감사드립니다. 본 안건과 관련하여 일전에 송부해 드렸던 히스토리(첨부 참조)와 기합의된 내용이 포함되어 있사오니, 사전 검토 자료로 활용해 주시면 업무에 큰 도움이 될 것으로 기대됩니다.',
                5: '혹시 바쁘신 일정으로 인해 메일함 검색 기능에 일시적 장애가 있으셨을까요? 지난 OO일 제가 정성껏 정리하여 송부드렸던 메일을 다시 포워딩해 드리오니 이번에는 꼭 필독 부탁드립니다.'
            }
        },
        {
            keywords: ['일정', '빡빡', '불가능', '못해'],
            levels: {
                1: '현재 리소스 상황상 말씀하신 마감 기한 준수는 불가능합니다.',
                2: '현재 진행 중인 다른 우선순위 프로젝트로 인해, 요청하신 기한까지 완료하기는 일정상 다소 촉박합니다.',
                3: '프로젝트의 성공적인 런칭을 위해 노력해 주심에 감사드립니다. 다만 현재 투입 가능한 가용 리소스를 시뮬레이션해 본 결과, 품질 보증을 위해 일정 조율([OO일]로 조정)이 필수적인 상황입니다.',
                4: '제안해 주신 스케줄을 면밀히 검토하였습니다. 다만 일정 내 무리한 추진은 예기치 못한 잠재 리스크를 야기할 우려가 커, 최적의 퀄리티를 담보하기 위한 일정 현실화 논의를 제안드리고자 합니다.',
                5: '기적을 창출하고자 하시는 그 열정은 존경스럽습니다. 다만 시간 왜곡 장치가 아직 발명되지 않은 현실적 한계로 인해, 물리적 일정을 초과하는 범위에 대해서는 결과물의 결함을 보장해 드릴 수 없음을 정중히 고지합니다.'
            }
        },
        {
            keywords: ['말귀', '못 알아', '천천히', '다시 읽'],
            levels: {
                1: '의도와 다르게 전달된 것 같아 핵심 사항을 다시 정리해 드립니다.',
                2: '제가 설명이 다소 미흡했던 것 같습니다. 혼선을 줄이고자 핵심 요점 3가지를 아래와 같이 재정리하여 안내드립니다.',
                3: '논의 중 관점의 차이로 인해 상호 오해가 있었던 것으로 생각됩니다. 원활한 의사결정을 위해 발제 취지와 세부 가이드라인을 다시 한번 개조식으로 명시해 드립니다.',
                4: '본 사안의 복합성으로 인해 상호 인지하신 스코프에 약간의 갭이 발생한 듯합니다. 기획 취지의 본질이 온전히 구현될 수 있도록 요약본을 첨부하오니 재고해 주시길 부탁드립니다.',
                5: '저의 천박한 문장력으로는 고견을 가지신 분께 온전히 전달하기 부족했던 것 같습니다. 초등학생도 즉시 이해할 수 있는 쉬운 용어로 다시 풀어 썼으니, 정독을 간곡히 청합니다.'
            }
        }
    ];

    function convertText() {
        const text = rawInput.value.trim();
        const level = parseInt(levelSlider.value);
        levelLabel.textContent = levelDescriptions[level];
        toneBadge.textContent = `적용 레벨 ${level}: ` + levelDescriptions[level].split(' ')[1];

        if (!text) {
            outputText.textContent = '속마음을 입력하시면 여기에 우아한 쿠션어가 생성됩니다.';
            return;
        }

        // Match against known templates
        let matched = null;
        for (const rule of translationRules) {
            if (rule.keywords.some(k => text.includes(k))) {
                matched = rule.levels[level];
                break;
            }
        }

        if (matched) {
            outputText.textContent = matched;
        } else {
            // Generic polite wrapper
            const wrappers = {
                1: `${text} (관련하여 협조 부탁드립니다.)`,
                2: `말씀해 주신 내용 잘 확인했습니다. 전달 주신 사안에 대해 다음과 같이 의견 드립니다.\n\n"${text}"\n\n원활한 업무 진행에 참고 부탁드립니다.`,
                3: `항상 수고가 많으십니다.\n\n보내주신 의견 깊이 검토하였습니다. 다만 실무적 관점에서 종합적으로 판단했을 때, "${text}" 방향으로 접근하는 것이 가장 합리적일 것으로 사료됩니다. 검토 부탁드립니다.`,
                4: `상생과 협력의 가치를 위해 늘 애써주시는 노고에 깊은 경의를 표합니다.\n\n상기 안건에 대하여 내부적으로 다각도의 시뮬레이션을 진행한 결과, "${text}"의 취지를 살려 추진하는 것이 궁극적인 조직 성과에 부합할 것으로 판단됩니다. 혜안으로 양해하여 주시길 청합니다.`,
                5: `귀하의 번뜩이는 통찰과 파괴적인 제안에 깊은 감명을 받았습니다.\n\n다만 현실 세계의 물리 법칙과 사내 규정을 준수하기 위해 "${text}"라는 지극히 상식적인 결론에 도달하였음을 널리 통촉하여 주시길 바랍니다.`
            };
            outputText.textContent = wrappers[level];
        }
    }

    rawInput.addEventListener('input', convertText);
    levelSlider.addEventListener('input', convertText);

    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            rawInput.value = btn.getAttribute('data-text');
            convertText();
        });
    });

    const shareCardBtn = document.getElementById('share-card-btn');
    if (shareCardBtn) {
        shareCardBtn.addEventListener('click', () => {
            const raw = rawInput.value.trim();
            const polished = outputText.textContent.trim();
            const level = parseInt(levelSlider.value);
            if (window.ToolBoxShare) {
                window.ToolBoxShare.openModal({
                    title: '넵병 퇴치 쿠션어 번역기',
                    subtitle: `적용 강도: ${levelDescriptions[level].split(' ')[1]}`,
                    badge: '💼 K-직장인 생존 키트',
                    metrics: [
                        { label: '원문 길이', value: `${raw.length}자`, highlight: false },
                        { label: '공손함 레벨', value: `Lv ${level}`, highlight: true }
                    ],
                    quote: `[속마음]\n"${raw}"\n\n[비즈니스 쿠션어]\n${polished}`
                });
            }
        });
    }

    copyBtn.addEventListener('click', () => {
        const text = outputText.textContent;
        navigator.clipboard.writeText(text).then(() => {
            copyText.textContent = '복사됨!';
            setTimeout(() => copyText.textContent = '복사', 1500);
        });
    });

    // Nep Diagnosis Cards
    nepCards.forEach(card => {
        card.addEventListener('click', () => {
            const nep = card.getAttribute('data-nep');
            const desc = card.querySelector('div:last-child').textContent;
            nepDiagnosis.classList.remove('hidden');
            nepDiagnosis.innerHTML = `<strong>[심리 분석 결과: "${nep}"]</strong> 당신의 현재 멘탈 상태: <span class="text-rose-600 dark:text-rose-400 font-bold">${desc}</span>. 오늘 퇴근 후 맛있는 것을 드시거나 즉시 휴식을 취하십시오.`;
        });
    });

    convertText();
});
