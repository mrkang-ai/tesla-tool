// 영수증 N빵 분할 & 송금 독촉장 로직
document.addEventListener('DOMContentLoaded', () => {
    const totalAmount = document.getElementById('total-amount');
    const peopleCount = document.getElementById('people-count');
    const roundOption = document.getElementById('round-option');
    const nonDrinkers = document.getElementById('non-drinkers');
    const accountInfo = document.getElementById('account-info');

    const dispTotal = document.getElementById('disp-total');
    const dispNormalPer = document.getElementById('disp-normal-per');
    const dispNonDrinkerPer = document.getElementById('disp-non-drinker-per');
    const dispAccount = document.getElementById('disp-account');

    const toneBtns = document.querySelectorAll('.tone-btn');
    const chaserOutput = document.getElementById('chaser-output');
    const copyChaserBtn = document.getElementById('copy-chaser-btn');
    const copyChaserText = document.getElementById('copy-chaser-text');

    let currentTone = 'polite';

    function calculate() {
        const total = parseFloat(totalAmount.value) || 0;
        const count = parseInt(peopleCount.value) || 1;
        const nonCount = Math.min(count, parseInt(nonDrinkers.value) || 0);
        const roundUnit = parseInt(roundOption.value) || 1;

        const alcoholTotal = nonCount > 0 ? 24000 : 0;
        const foodTotal = Math.max(0, total - alcoholTotal);

        const foodPerPerson = foodTotal / count;
        const drinkersCount = Math.max(1, count - nonCount);
        const alcoholPerPerson = alcoholTotal / drinkersCount;

        let normalPer = foodPerPerson + alcoholPerPerson;
        let nonPer = foodPerPerson;

        // Round up
        if (roundUnit > 1) {
            normalPer = Math.ceil(normalPer / roundUnit) * roundUnit;
            nonPer = Math.ceil(nonPer / roundUnit) * roundUnit;
        } else {
            normalPer = Math.round(normalPer);
            nonPer = Math.round(nonPer);
        }

        dispTotal.textContent = `₩ ${total.toLocaleString()}`;
        dispNormalPer.textContent = `₩ ${normalPer.toLocaleString()}`;
        dispNonDrinkerPer.textContent = nonCount > 0 ? `₩ ${nonPer.toLocaleString()}` : '-';
        dispAccount.textContent = accountInfo.value;

        generateMessage(normalPer, nonPer, nonCount);
    }

    function generateMessage(normalPer, nonPer, nonCount) {
        const acc = accountInfo.value;
        const templates = {
            polite: `[정산 안내 드려요 ☕]\n오늘 함께해 주셔서 감사했습니다! 즐거운 시간이었어요.\n\n정산 금액은 다음과 같습니다:\n- 일반 참석자: ${normalPer.toLocaleString()}원${nonCount > 0 ? `\n- 비음주 참석자: ${nonPer.toLocaleString()}원` : ''}\n\n계좌번호: ${acc}\n편하실 때 송금 부탁드리겠습니다. 좋은 하루 보내세요! 😊`,
            firm: `[회식 정산 공지]\n오늘 결제 총액 정산 내역 공유합니다.\n\n- 송금액: ${normalPer.toLocaleString()}원${nonCount > 0 ? ` (비음주자: ${nonPer.toLocaleString()}원)` : ''}\n- 입금처: ${acc}\n\n총무 카드 결제일이 임박하여 오늘 중 입금 확인 부탁드립니다. 감사합니다.`,
            funny: `[🚨 긴급 삥뜯기 공지 🚨]\n오늘 먹고 마신 자, 돈을 뱉어낼 시간입니다!\n\n- 납부액: 딱 ${normalPer.toLocaleString()}원 (100원 단위 절사 완료)${nonCount > 0 ? `\n- 술 안 마신 착한 사람: ${nonPer.toLocaleString()}원` : ''}\n- 돈 보낼 곳: ${acc}\n\n안 보내시면 카톡방 상단에 박제됩니다 🏃💨 입금 확인 시 하트 날려드림!`
        };

        chaserOutput.value = templates[currentTone];
    }

    [totalAmount, peopleCount, roundOption, nonDrinkers, accountInfo].forEach(el => {
        el.addEventListener('input', calculate);
    });

    toneBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            toneBtns.forEach(b => {
                b.classList.remove('active', 'bg-primary', 'text-white');
                b.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-300');
            });
            btn.classList.add('active', 'bg-primary', 'text-white');
            btn.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-300');
            currentTone = btn.getAttribute('data-tone');
            calculate();
        });
    });

    copyChaserBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(chaserOutput.value).then(() => {
            copyChaserText.textContent = '복사 완료!';
            setTimeout(() => copyChaserText.textContent = '메시지 복사', 1500);
        });
    });

    calculate();
});
