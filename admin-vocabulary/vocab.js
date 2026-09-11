// 행정용어 순화 사전 로직
document.addEventListener('DOMContentLoaded', () => {
    const vocabSearch = document.getElementById('vocab-search');
    const vocabGrid = document.getElementById('vocab-grid');
    const bulkInput = document.getElementById('bulk-input');
    const bulkReplaceBtn = document.getElementById('bulk-replace-btn');
    const bulkOutput = document.getElementById('bulk-output');

    const dictionary = [
        { orig: '명기하다', plain: '분명히 적다 / 기록하다', ex: '본 규정에 명기된 사항' },
        { orig: '시달하다', plain: '알리다 / 내려보내다', ex: '지침을 하급 기관에 시달함' },
        { orig: '불입하다', plain: '납입하다 / 내다', ex: '공과금을 기한 내 불입' },
        { orig: '공람', plain: '돌려봄 / 같이 봄', ex: '직원 공람 후 편철' },
        { orig: '양지하다', plain: '이해하다 / 알아두다', ex: '널리 양지하여 주시기 바랍니다' },
        { orig: '상기', plain: '위의 / 앞서 언급한', ex: '상기 안건에 대하여' },
        { orig: '차개', plain: '다음 / 그 후', ex: '차개 일정에 반영' },
        { orig: '계류하다', plain: '처리하지 않고 두다', ex: '의안이 국회에 계류 중' },
        { orig: '개전의 정', plain: '뉘우치는 태도', ex: '개전의 정이 뚜렷함' },
        { orig: '추념하다', plain: '기억하고 생각하다', ex: '선열의 넋을 추념' },
        { orig: '착수하다', plain: '시작하다', ex: '공사에 즉시 착수' },
        { orig: '상신하다', plain: '올려 보고하다', ex: '결재 서류를 상신' },
        { orig: '시건장치', plain: '자물쇠 / 잠금장치', ex: '비상구 시건장치 확인' },
        { orig: '절취선', plain: '자르는 선', ex: '절취선을 따라 자르시오' },
        { orig: '부기하다', plain: '덧붙여 적다', ex: '비고란에 특기사항 부기' }
    ];

    function renderCards(filter = '') {
        vocabGrid.innerHTML = '';
        const q = filter.trim().toLowerCase();

        const filtered = dictionary.filter(item => 
            !q || item.orig.includes(q) || item.plain.includes(q) || item.ex.includes(q)
        );

        if (filtered.length === 0) {
            vocabGrid.innerHTML = '<div class="col-span-full text-center p-6 text-xs text-slate-400">일치하는 순화어가 없습니다.</div>';
            return;
        }

        filtered.forEach(item => {
            const card = document.createElement('div');
            card.className = 'p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between gap-2';
            card.innerHTML = `
                <div>
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-black text-rose-500 line-through">${item.orig}</span>
                        <span class="material-symbols-outlined text-xs text-slate-400">arrow_forward</span>
                        <span class="text-xs font-black text-emerald-600 dark:text-emerald-400">${item.plain}</span>
                    </div>
                    <div class="text-[11px] text-slate-400 mt-1 italic">예: "${item.ex}"</div>
                </div>
            `;
            vocabGrid.appendChild(card);
        });
    }

    vocabSearch.addEventListener('input', (e) => {
        renderCards(e.target.value);
    });

    bulkReplaceBtn.addEventListener('click', () => {
        let text = bulkInput.value;
        dictionary.forEach(item => {
            const target = item.plain.split('/')[0].trim();
            text = text.replace(new RegExp(item.orig, 'g'), target);
        });
        bulkOutput.textContent = text;
    });

    renderCards();
});
