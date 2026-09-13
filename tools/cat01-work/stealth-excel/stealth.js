// 가짜 엑셀 몰컴 뷰어 로직
document.addEventListener('DOMContentLoaded', () => {
    const sheetTable = document.getElementById('sheet-table');
    const formulaInput = document.getElementById('formula-input');
    const activeCellId = document.getElementById('active-cell-id');
    const panicToggleBtn = document.getElementById('panic-toggle-btn');
    const panicBtnText = document.getElementById('panic-btn-text');
    const modeSwitchBtn = document.getElementById('mode-switch-btn');
    const readerDrawer = document.getElementById('reader-drawer');
    const customStealthText = document.getElementById('custom-stealth-text');
    const applyTextBtn = document.getElementById('apply-text-btn');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const excelFilename = document.getElementById('excel-filename');

    let isPanicMode = false;
    let isReaderMode = false;

    // Financial statement sample data (Emergency Mode)
    const financialData = [
        ['계정과목코드', '부서/프로젝트', '2025 실적 (천원)', '2026 3Q 목표 (천원)', '3Q 누적 실적', '달성률(%)', '전년 대비 증감', '비고 (리스크 점검)'],
        ['1010-01', '경영지원본부-총무', '142,500,000', '168,000,000', '159,420,000', '94.8%', '+11.8%', '정상 집행 완료'],
        ['1020-04', '영업1팀-국내법인', '480,200,000', '520,000,000', '538,100,000', '103.4%', '+12.0%', '수주 목표 초과 달성'],
        ['1030-02', '글로벌사업단-미주', '310,000,000', '390,000,000', '362,500,000', '92.9%', '+16.9%', '환율 변동 헷지 반영'],
        ['1040-08', 'R&D연구소-AI랩', '280,000,000', '340,000,000', '338,900,000', '99.6%', '+21.0%', '특허 4건 출원 완료'],
        ['1050-11', '플랫폼개발팀-인프라', '190,000,000', '220,000,000', '208,400,000', '94.7%', '+9.6%', 'AWS 비용 최적화 적용'],
        ['1060-03', '마케팅본부-브랜드', '220,500,000', '260,000,000', '251,300,000', '96.6%', '+13.9%', 'Q4 캠페인 예산 배정'],
        ['1070-05', '전략기획실-신사업', '150,000,000', '210,000,000', '198,700,000', '94.6%', '+32.4%', 'M&A 실사 진행 중'],
        ['1080-09', '품질보증(QA)팀', '98,000,000', '115,000,000', '114,200,000', '99.3%', '+16.5%', 'ISO 27001 심사 통과'],
        ['1090-02', 'CS고객지원본부', '135,000,000', '150,000,000', '142,800,000', '95.2%', '+5.7%', '상담 만족도 96.4점'],
        ['1100-01', '합계 (TOTAL)', '2,006,200,000', '2,373,000,000', '2,314,320,000', '97.5%', '+15.3%', '분기 결산 승인 대기']
    ];

    const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
    const rowCount = 28;

    function renderGrid() {
        let html = '<thead><tr class="bg-slate-100 border-b border-slate-300 text-slate-600">';
        html += '<th class="w-10 border-r border-slate-300 bg-slate-200 text-center py-1 text-[11px]"></th>';
        columns.forEach(col => {
            html += `<th class="border-r border-slate-300 px-3 py-1 font-bold text-center text-[11px] min-w-[110px]">${col}</th>`;
        });
        html += '</tr></thead><tbody>';

        const customText = customStealthText.value.trim();
        const sentences = customText ? customText.split(/[.!?]\s+/).filter(Boolean) : [];

        for (let r = 1; r <= rowCount; r++) {
            html += `<tr class="border-b border-slate-200 hover:bg-sky-50/40 transition-colors">`;
            html += `<td class="border-r border-slate-300 bg-slate-100 text-center text-slate-500 font-bold py-1 text-[11px] select-none">${r}</td>`;
            
            columns.forEach((col, cIdx) => {
                let cellValue = '';
                let cellStyle = 'border-r border-slate-200 px-2 py-1 text-slate-800 truncate';

                if (isPanicMode) {
                    // Emergency Financial State
                    if (r - 1 < financialData.length && cIdx < financialData[r - 1].length) {
                        cellValue = financialData[r - 1][cIdx];
                        if (r === 1) cellStyle += ' font-bold bg-slate-100 text-slate-900 text-center';
                        else if (r === financialData.length) cellStyle += ' font-bold bg-emerald-50 text-emerald-900';
                        else if (cIdx >= 2 && cIdx <= 4) cellStyle += ' text-right';
                        else if (cIdx === 5 || cIdx === 6) cellStyle += ' text-center font-semibold text-emerald-700';
                    }
                } else if (isReaderMode) {
                    // Stealth Reader Mode
                    if (cIdx === 1 && r === 2) {
                        cellValue = '[문서 제목] ' + (sentences[0] || '업무 관련 참고 아티클');
                        cellStyle += ' font-bold text-emerald-800';
                    } else if (cIdx === 1 && r > 2 && r - 3 < sentences.length) {
                        cellValue = sentences[r - 3];
                        cellStyle += ' text-slate-700 whitespace-normal';
                    } else if (cIdx === 0 && r > 2 && r - 3 < sentences.length) {
                        cellValue = `SEC-0${r - 2}`;
                        cellStyle += ' text-slate-400 text-center';
                    } else if (cIdx === 2 && r > 2 && r - 3 < sentences.length) {
                        cellValue = '참조 완료';
                        cellStyle += ' text-slate-400 text-center text-[10px]';
                    }
                } else {
                    // Normal Hybrid Mode (looks like a financial model with disguised text)
                    if (r <= financialData.length && cIdx < financialData[r - 1].length) {
                        cellValue = financialData[r - 1][cIdx];
                        if (r === 1) cellStyle += ' font-bold bg-slate-100 text-center';
                        else if (cIdx >= 2 && cIdx <= 4) cellStyle += ' text-right';
                    }
                }

                html += `<td class="${cellStyle}" data-cell="${col}${r}" onclick="selectCell('${col}${r}', '${cellValue.replace(/'/g, "\\'")}')">${cellValue}</td>`;
            });
            html += `</tr>`;
        }
        html += '</tbody>';
        sheetTable.innerHTML = html;
    }

    window.selectCell = (cellId, val) => {
        activeCellId.textContent = cellId;
        formulaInput.value = val ? (isNaN(val.replace(/,/g, '')) ? val : `=SUM(${cellId})`) : '';
    };

    function togglePanic(force) {
        isPanicMode = typeof force === 'boolean' ? force : !isPanicMode;
        if (isPanicMode) {
            panicToggleBtn.classList.replace('bg-rose-600', 'bg-emerald-600');
            panicToggleBtn.classList.replace('hover:bg-rose-700', 'hover:bg-emerald-700');
            panicBtnText.textContent = '✅ 안전 모드 복귀';
            excelFilename.textContent = '2026_Q3_경영실적_및_원가분석_최종보고서_v4.2.xlsx - Excel';
        } else {
            panicToggleBtn.classList.replace('bg-emerald-600', 'bg-rose-600');
            panicToggleBtn.classList.replace('hover:bg-emerald-700', 'hover:bg-rose-700');
            panicBtnText.textContent = '🚨 패닉 모드 (위장)';
        }
        renderGrid();
    }

    panicToggleBtn.addEventListener('click', () => togglePanic());

    // Hotkey listener: Spacebar or Escape for instant panic mode
    window.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (e.code === 'Space' || e.key === 'Escape') {
            e.preventDefault();
            togglePanic();
        }
    });

    modeSwitchBtn.addEventListener('click', () => {
        isReaderMode = !isReaderMode;
        readerDrawer.classList.toggle('hidden', !isReaderMode);
        modeSwitchBtn.querySelector('span:last-child').textContent = isReaderMode ? '일반 엑셀 모드' : '딴짓 글 읽기 모드';
        renderGrid();
    });

    applyTextBtn.addEventListener('click', () => {
        isReaderMode = true;
        isPanicMode = false;
        renderGrid();
    });

    fullscreenBtn.addEventListener('click', () => {
        const frame = document.getElementById('excel-frame');
        if (!document.fullscreenElement) {
            frame.requestFullscreen?.() || frame.webkitRequestFullscreen?.();
        } else {
            document.exitFullscreen?.();
        }
    });

    renderGrid();
});
