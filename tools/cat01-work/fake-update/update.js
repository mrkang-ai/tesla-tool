// 가짜 업데이트 화면 로직
document.addEventListener('DOMContentLoaded', () => {
    const osCards = document.querySelectorAll('.os-card');
    const startPctInput = document.getElementById('start-pct');
    const launchBtn = document.getElementById('launch-btn');
    const overlay = document.getElementById('fullscreen-overlay');
    const winSim = document.getElementById('win-sim');
    const macSim = document.getElementById('mac-sim');
    const winPct = document.getElementById('win-pct');
    const macProgressBar = document.getElementById('mac-progress-bar');
    const macRemainMin = document.getElementById('mac-remain-min');

    let selectedOS = 'win';
    let currentPct = 17;
    let updateTimer = null;

    osCards.forEach(card => {
        card.addEventListener('click', () => {
            osCards.forEach(c => {
                c.classList.remove('active', 'border-primary', 'bg-sky-50/40');
                c.classList.add('border-slate-200', 'dark:border-slate-700');
            });
            card.classList.add('active', 'border-primary', 'bg-sky-50/40');
            card.classList.remove('border-slate-200', 'dark:border-slate-700');
            selectedOS = card.getAttribute('data-os');
        });
    });

    function startSimulation() {
        currentPct = parseInt(startPctInput.value) || 17;
        winPct.textContent = currentPct;
        macProgressBar.style.width = `${currentPct}%`;
        macRemainMin.textContent = Math.max(5, Math.round((100 - currentPct) * 0.4));

        if (selectedOS === 'win') {
            winSim.classList.remove('hidden');
            macSim.classList.add('hidden');
        } else {
            macSim.classList.remove('hidden');
            winSim.classList.add('hidden');
        }

        overlay.classList.remove('hidden');

        // Request fullscreen
        if (overlay.requestFullscreen) {
            overlay.requestFullscreen().catch(() => {});
        }

        // Very slow increment (1% every 30 seconds)
        if (updateTimer) clearInterval(updateTimer);
        updateTimer = setInterval(() => {
            if (currentPct < 99) {
                currentPct++;
                winPct.textContent = currentPct;
                macProgressBar.style.width = `${currentPct}%`;
                macRemainMin.textContent = Math.max(2, Math.round((100 - currentPct) * 0.4));
            }
        }, 30000);
    }

    function stopSimulation() {
        if (updateTimer) clearInterval(updateTimer);
        overlay.classList.add('hidden');
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
        }
    }

    launchBtn.addEventListener('click', startSimulation);

    overlay.addEventListener('dblclick', stopSimulation);
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            stopSimulation();
        }
    });
});
