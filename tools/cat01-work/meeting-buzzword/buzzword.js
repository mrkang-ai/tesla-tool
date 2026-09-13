// 회의록 버즈워드 추출기 로직
document.addEventListener('DOMContentLoaded', () => {
    const meetingText = document.getElementById('meeting-text');
    const analyzeBtn = document.getElementById('analyze-btn');
    const sampleBtn = document.getElementById('sample-btn');
    const emailProb = document.getElementById('email-prob');
    const emailVerdict = document.getElementById('email-verdict');
    const buzzwordChips = document.getElementById('buzzword-chips');
    const actionItems = document.getElementById('action-items');

    const buzzwordsList = [
        '아젠다', '싱크', '얼라인', '캐치업', '팔로업', '딥다이브', '킥오프', '인사이트',
        '핏', '애자일', '피벗', '바운더리', '블락커', '밸류', '레버리지', '스케일업',
        '스코프', '마일스톤', '온보딩', '오프보딩', '페인포인트', '탑다운', '바텀업'
    ];

    function analyze() {
        const text = meetingText.value.trim();
        if (!text) return;

        const counts = {};
        let totalHits = 0;

        buzzwordsList.forEach(w => {
            const regex = new RegExp(w, 'gi');
            const matches = text.match(regex);
            if (matches) {
                counts[w] = matches.length;
                totalHits += matches.length;
            }
        });

        // Probability of "Could have been an email"
        const wordCount = text.split(/\s+/).length;
        const buzzDensity = (totalHits / Math.max(1, wordCount)) * 100;
        let prob = Math.min(99, Math.max(15, Math.round(50 + buzzDensity * 4)));
        if (totalHits === 0) prob = 25;

        emailProb.textContent = `${prob}%`;

        if (prob >= 80) {
            emailVerdict.textContent = '🚨 "굳이 모여서 소중한 시간을 낭비한 전형적인 영혼 탈곡 회의"';
            emailVerdict.className = 'text-xs font-bold text-rose-600 dark:text-rose-400 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200';
        } else if (prob >= 50) {
            emailVerdict.textContent = '⚠️ "슬랙 스레드 몇 개로 충분히 합의 가능했던 미팅"';
            emailVerdict.className = 'text-xs font-bold text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200';
        } else {
            emailVerdict.textContent = '✅ "실질적인 논의가 오간 나름 유익한 회의"';
            emailVerdict.className = 'text-xs font-bold text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200';
        }

        // Render buzzword chips
        buzzwordChips.innerHTML = '';
        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
        if (sorted.length === 0) {
            buzzwordChips.innerHTML = '<span class="text-xs text-slate-400">감지된 허세 버즈워드가 없습니다. 훌륭하고 담백한 회의입니다!</span>';
        } else {
            sorted.forEach(([w, count]) => {
                const chip = document.createElement('span');
                chip.className = 'px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300 text-xs font-bold flex items-center gap-1';
                chip.innerHTML = `<span>#${w}</span> <span class="text-[10px] bg-purple-200 dark:bg-purple-800 px-1 rounded font-mono">${count}회</span>`;
                buzzwordChips.appendChild(chip);
            });
        }

        // Extract 3 bullet action items
        const sentences = text.split(/[.!?\n]+/).map(s => s.trim()).filter(s => s.length > 5);
        actionItems.innerHTML = '';
        const items = sentences.slice(0, 3);
        if (items.length === 0) {
            actionItems.innerHTML = '<li>할 일이 명확하지 않거나 아무도 책임지지 않는 회의입니다.</li>';
        } else {
            items.forEach((it, idx) => {
                const li = document.createElement('li');
                li.textContent = `[과업 ${idx + 1}] ${it}`;
                actionItems.appendChild(li);
            });
        }
    }

    analyzeBtn.addEventListener('click', analyze);
    sampleBtn.addEventListener('click', () => {
        meetingText.value = '오늘 마케팅 킥오프에서는 각 파트별 아젠다와 R&R 싱크를 맞췄습니다. 유저 인사이트를 바탕으로 온보딩 퍼널을 딥다이브 해보니 페인포인트가 심각합니다. 다음 주까지 프로덕트팀과 캐치업해서 얼라인을 완료하고 피벗 전략을 팔로업해 주세요.';
        analyze();
    });

    analyze();
});
