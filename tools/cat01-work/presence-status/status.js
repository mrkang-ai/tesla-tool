// 슬랙/잔디 상태메시지 생성기 로직
document.addEventListener('DOMContentLoaded', () => {
    const catBtns = document.querySelectorAll('.status-cat-btn');
    const returnTimeInput = document.getElementById('return-time');
    const container = document.getElementById('status-cards-container');

    let currentCat = 'focus';

    const presets = {
        focus: [
            { emoji: '🎧', text: 'Q3 핵심 전략 기획서 집중 드래프팅 중 (~{TIME} 복귀, 긴급은 전화)' },
            { emoji: '💻', text: '코어 아키텍처 리팩토링 및 테스트 코드 작성 중 (방해 금지 모드)' },
            { emoji: '🚀', text: '스프린트 마감 릴리즈 배포 준비 중 (DM 확인이 늦어질 수 있습니다)' },
            { emoji: '🔒', text: '임원 보고용 슬라이드 최종 덱 점검 중 (긴급 문의는 슬랙 멘션)' }
        ],
        data: [
            { emoji: '📊', text: '2026 분기 결산 데이터 파이프라인 배치 러닝 중 (~{TIME})' },
            { emoji: '⚡', text: 'AWS 대규모 인프라 부하 테스트 모니터링 중 (확인 지연)' },
            { emoji: '📈', text: '유저 코호트 LTV 통계 추출 쿼리 실행 중' },
            { emoji: '🗄️', text: '데이터베이스 마이그레이션 모니터링 중 (~{TIME} 이후 응답 가능)' }
        ],
        client: [
            { emoji: '🤝', text: '주요 클라이언트사 전략 파트너십 오프라인 미팅 중 (~{TIME})' },
            { emoji: '🏢', text: '고객사 현장 실사 및 비즈니스 미팅 외근 중 (복귀 {TIME})' },
            { emoji: '📞', text: '해외 지사 및 투자사 긴급 컨퍼런스 콜 참여 중' },
            { emoji: '🚗', text: '정부 유관기관 미팅 이동 중 (유선 연락 부탁드립니다)' }
        ],
        health: [
            { emoji: '🏥', text: '정기 종합검진 및 진료로 인한 자리비움 (~{TIME} 복귀)' },
            { emoji: '💊', text: '컨디션 난조로 인한 리프레시 휴식 중 (업무 복귀 시 확인하겠습니다)' },
            { emoji: '🦷', text: '치과 긴급 진료 중 (~{TIME})' },
            { emoji: '🌿', text: '고농도 집중을 위한 마인드풀니스 브레이크 (15분 뒤 복귀)' }
        ]
    };

    function renderCards() {
        const time = returnTimeInput.value || '16:00';
        const list = presets[currentCat];
        container.innerHTML = '';

        list.forEach((item, idx) => {
            const formatted = item.text.replace(/{TIME}/g, time);
            const card = document.createElement('div');
            card.className = 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-4';
            card.innerHTML = `
                <div class="flex items-center gap-3">
                    <span class="text-2xl">${item.emoji}</span>
                    <div>
                        <div class="text-sm font-bold text-slate-900 dark:text-white font-mono">${item.emoji} ${formatted}</div>
                        <div class="text-sm text-slate-400 mt-0.5">슬랙 / 잔디 원클릭 프로필 상태 적용</div>
                    </div>
                </div>
                <button class="copy-status-btn px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white text-sm font-bold text-slate-700 dark:text-slate-300 transition-all flex items-center gap-1 cursor-pointer flex-shrink-0">
                    <span class="material-symbols-outlined text-sm">content_copy</span>
                    <span>복사</span>
                </button>
            `;

            const btn = card.querySelector('.copy-status-btn');
            btn.addEventListener('click', () => {
                navigator.clipboard.writeText(`${item.emoji} ${formatted}`).then(() => {
                    btn.querySelector('span:last-child').textContent = '복사됨!';
                    btn.classList.add('bg-emerald-600', 'text-white');
                    setTimeout(() => {
                        btn.querySelector('span:last-child').textContent = '복사';
                        btn.classList.remove('bg-emerald-600', 'text-white');
                    }, 1500);
                });
            });

            container.appendChild(card);
        });
    }

    catBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            catBtns.forEach(b => {
                b.classList.remove('active', 'bg-primary', 'text-white');
                b.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-300');
            });
            btn.classList.add('active', 'bg-primary', 'text-white');
            btn.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-300');
            currentCat = btn.getAttribute('data-cat');
            renderCards();
        });
    });

    returnTimeInput.addEventListener('input', renderCards);
    renderCards();
});
