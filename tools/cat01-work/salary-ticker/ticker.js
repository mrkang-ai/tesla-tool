// 실시간 연봉 시급화 및 응가 머니 로직
document.addEventListener('DOMContentLoaded', () => {
    const salaryInput = document.getElementById('salary-input');
    const workStart = document.getElementById('work-start');
    const workEnd = document.getElementById('work-end');
    const earnedToday = document.getElementById('earned-today');
    const rateSec = document.getElementById('rate-sec');
    const rateMin = document.getElementById('rate-min');
    const rateHour = document.getElementById('rate-hour');
    const rateDay = document.getElementById('rate-day');
    const salaryChips = document.querySelectorAll('.salary-chip');

    const poopBtn = document.getElementById('poop-btn');
    const poopBtnText = document.getElementById('poop-btn-text');
    const poopMoney = document.getElementById('poop-money');
    const poopTimer = document.getElementById('poop-timer');

    let isPooping = false;
    let poopSeconds = 0;
    let poopInterval = null;

    function getRates() {
        const salary = parseFloat(salaryInput.value) || 0;
        const hourlyRate = salary / 12 / 209;
        const secondRate = hourlyRate / 3600;
        const minuteRate = hourlyRate / 60;
        const dailyRate = hourlyRate * 8;
        return { secondRate, minuteRate, hourlyRate, dailyRate };
    }

    function updateRateDisplays() {
        const { secondRate, minuteRate, hourlyRate, dailyRate } = getRates();
        rateSec.textContent = `₩ ${secondRate.toFixed(2)} / 초`;
        rateMin.textContent = `₩ ${Math.round(minuteRate).toLocaleString()} / 분`;
        rateHour.textContent = `₩ ${Math.round(hourlyRate).toLocaleString()} / 시`;
        rateDay.textContent = `₩ ${Math.round(dailyRate).toLocaleString()} / 일`;
    }

    function updateLiveTicker() {
        const { secondRate } = getRates();
        const now = new Date();
        const [sH, sM] = workStart.value.split(':').map(Number);
        const startTime = new Date();
        startTime.setHours(sH, sM, 0, 0);

        const diffMs = now - startTime;
        if (diffMs <= 0) {
            earnedToday.textContent = '0.00 (출근 전)';
        } else {
            const workedSec = diffMs / 1000;
            const earned = workedSec * secondRate;
            earnedToday.textContent = earned.toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
        requestAnimationFrame(updateLiveTicker);
    }

    salaryInput.addEventListener('input', updateRateDisplays);
    salaryChips.forEach(chip => {
        chip.addEventListener('click', () => {
            salaryInput.value = chip.getAttribute('data-sal');
            updateRateDisplays();
        });
    });

    function playFlushSound() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 1.2);
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 1.2);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 1.2);
        } catch (e) {}
    }

    poopBtn.addEventListener('click', () => {
        isPooping = !isPooping;
        if (isPooping) {
            poopBtn.classList.replace('bg-amber-500', 'bg-rose-600');
            poopBtn.classList.replace('hover:bg-amber-600', 'hover:bg-rose-700');
            poopBtnText.textContent = '볼일 완료 (자리 복귀)';
            poopSeconds = 0;
            poopInterval = setInterval(() => {
                poopSeconds++;
                const { secondRate } = getRates();
                const currentPoopMoney = poopSeconds * secondRate;
                poopMoney.textContent = `₩ ${Math.round(currentPoopMoney).toLocaleString()}`;
                const mins = Math.floor(poopSeconds / 60).toString().padStart(2, '0');
                const secs = (poopSeconds % 60).toString().padStart(2, '0');
                poopTimer.textContent = `${mins}:${secs}`;
            }, 1000);
        } else {
            clearInterval(poopInterval);
            playFlushSound();
            poopBtn.classList.replace('bg-rose-600', 'bg-amber-500');
            poopBtn.classList.replace('hover:bg-rose-700', 'hover:bg-amber-600');
            poopBtnText.textContent = '화장실 출발!';
            alert(`쾌변 축하합니다! 🎉\n이번 화장실 타임 동안 회사가 회원님께 지불한 금액은 총 ${poopMoney.textContent} 입니다!`);
        }
    });

    updateRateDisplays();
    updateLiveTicker();
});
