// 실시간 연봉 시급화, 응가 머니 & 데스크 스탠드바이(StandBy) 로직
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

    // StandBy Overlay Elements
    const openStandbyBtn = document.getElementById('open-standby-btn');
    const closeStandbyBtn = document.getElementById('close-standby-btn');
    const standbyOverlay = document.getElementById('standby-overlay');
    const standbyHud = document.getElementById('standby-hud');
    const standbyAmount = document.getElementById('standby-amount');
    const standbyRate = document.getElementById('standby-rate');
    const standbyProgressBadge = document.getElementById('standby-progress-badge');
    const standbyCountdownSub = document.getElementById('standby-countdown-sub');
    const standbyBar = document.getElementById('standby-bar');
    const standbyToggleWidgetBtn = document.getElementById('standby-toggle-widget-btn');
    const standbyWidgetLabel = document.getElementById('standby-widget-label');
    const standbyFsBtn = document.getElementById('standby-fs-btn');
    const standbyFsIcon = document.getElementById('standby-fs-icon');
    const standbyCalendarBox = document.getElementById('standby-calendar-box');
    const standbyClockBox = document.getElementById('standby-clock-box');
    const standbyMonthTitle = document.getElementById('standby-month-title');
    const standbyYearLabel = document.getElementById('standby-year-label');
    const standbyDaysGrid = document.getElementById('standby-days-grid');
    const standbyDigitalClock = document.getElementById('standby-digital-clock');
    const standbyRemainTime = document.getElementById('standby-remain-time');
    const standbyWakelockLabel = document.getElementById('standby-wakelock-label');

    let isPooping = false;
    let poopSeconds = 0;
    let poopInterval = null;

    let isStandByActive = false;
    let standbyRightMode = 'calendar'; // 'calendar' | 'clock'
    let wakeLock = null;
    let hudTimeout = null;
    let showCents = false; // true = with decimals, false = integer like reference photo

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

        if (standbyRate) {
            standbyRate.textContent = `초당 ₩${secondRate.toFixed(2)}`;
        }
    }

    function calculateWorkProgress(now) {
        const [sH, sM] = workStart.value.split(':').map(Number);
        const [eH, eM] = workEnd.value.split(':').map(Number);

        const startTime = new Date(now);
        startTime.setHours(sH, sM, 0, 0);

        const endTime = new Date(now);
        endTime.setHours(eH, eM, 0, 0);

        const totalWorkMs = Math.max(1000, endTime - startTime);
        const elapsedMs = Math.max(0, Math.min(totalWorkMs, now - startTime));
        const progressPct = Math.min(100, Math.max(0, (elapsedMs / totalWorkMs) * 100));

        const remainMs = Math.max(0, endTime - now);
        const remainSec = Math.floor(remainMs / 1000);
        const rHours = Math.floor(remainSec / 3600);
        const rMins = Math.floor((remainSec % 3600) / 60);
        const rSecs = remainSec % 60;

        return {
            startTime,
            endTime,
            diffMs: now - startTime,
            progressPct,
            remainMs,
            remainText: `${rHours}시간 ${rMins}분 ${rSecs}초`,
            remainShort: `${rHours.toString().padStart(2, '0')}:${rMins.toString().padStart(2, '0')}:${rSecs.toString().padStart(2, '0')}`
        };
    }

    function updateLiveTicker() {
        const { secondRate } = getRates();
        const now = new Date();
        const { diffMs, progressPct, remainMs, remainText, remainShort } = calculateWorkProgress(now);

        let earned = 0;
        if (diffMs <= 0) {
            earnedToday.textContent = '0.00 (출근 전)';
            if (isStandByActive && standbyAmount) {
                standbyAmount.textContent = '0';
            }
        } else {
            const workedSec = diffMs / 1000;
            earned = workedSec * secondRate;
            earnedToday.textContent = earned.toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            
            if (isStandByActive && standbyAmount) {
                if (showCents) {
                    standbyAmount.textContent = earned.toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                } else {
                    // Reference photo shows clean integer: ₩146,409
                    standbyAmount.textContent = Math.floor(earned).toLocaleString('ko-KR');
                }
            }
        }

        // Update Standby details
        if (isStandByActive) {
            if (standbyProgressBadge) {
                standbyProgressBadge.textContent = diffMs <= 0 ? '출근 전' : `근무 ${Math.round(progressPct)}%`;
            }
            if (standbyCountdownSub) {
                standbyCountdownSub.textContent = remainMs <= 0 ? '🎉 퇴근 완료' : `퇴근까지 ${remainShort}`;
            }
            if (standbyBar) {
                standbyBar.style.width = `${progressPct}%`;
            }

            // If clock mode is visible
            if (standbyRightMode === 'clock') {
                if (standbyDigitalClock) {
                    const h = now.getHours().toString().padStart(2, '0');
                    const m = now.getMinutes().toString().padStart(2, '0');
                    const s = now.getSeconds().toString().padStart(2, '0');
                    standbyDigitalClock.textContent = `${h}:${m}:${s}`;
                }
                if (standbyRemainTime) {
                    standbyRemainTime.textContent = remainMs <= 0 ? '🎉 수고하셨습니다! 퇴근!' : remainText;
                }
            }
        }

        requestAnimationFrame(updateLiveTicker);
    }

    // =========================================================================
    // StandBy Ambient Mode: Calendar Generator (Matches Reference Image)
    // =========================================================================
    function renderStandbyCalendar() {
        if (!standbyDaysGrid) return;
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth(); // 0-indexed
        const todayDate = now.getDate();

        if (standbyMonthTitle) {
            standbyMonthTitle.textContent = `${month + 1}월`;
        }
        if (standbyYearLabel) {
            standbyYearLabel.textContent = `${year}`;
        }

        const firstDayIndex = new Date(year, month, 1).getDay(); // 0=Sun, 6=Sat
        const totalDays = new Date(year, month + 1, 0).getDate();

        let html = '';

        // Empty cells before day 1
        for (let i = 0; i < firstDayIndex; i++) {
            html += '<div class="py-1"></div>';
        }

        // Days of month
        for (let day = 1; day <= totalDays; day++) {
            const dayCol = (firstDayIndex + day - 1) % 7;
            const isToday = day === todayDate;

            let colorClass = 'text-slate-200';
            if (dayCol === 0) colorClass = 'text-rose-400/90'; // Sunday
            else if (dayCol === 6) colorClass = 'text-sky-400/90'; // Saturday

            if (isToday) {
                // Highlight circle matching uploaded image
                html += `
                    <div class="flex items-center justify-center py-0.5">
                        <span class="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full border-2 border-white bg-white/20 text-white font-black shadow-[0_0_12px_rgba(255,255,255,0.4)]">
                            ${day}
                        </span>
                    </div>
                `;
            } else {
                html += `
                    <div class="flex items-center justify-center py-0.5">
                        <span class="${colorClass} font-semibold hover:text-white transition-colors">
                            ${day}
                        </span>
                    </div>
                `;
            }
        }

        standbyDaysGrid.innerHTML = html;
    }

    // =========================================================================
    // Screen Wake Lock API (Prevents screen from turning off on desk stand)
    // =========================================================================
    async function requestWakeLock() {
        if ('wakeLock' in navigator) {
            try {
                wakeLock = await navigator.wakeLock.request('screen');
                if (standbyWakelockLabel) {
                    standbyWakelockLabel.textContent = '화면 켜짐 유지 (Wake Lock ON)';
                }
                wakeLock.addEventListener('release', () => {
                    wakeLock = null;
                });
            } catch (err) {
                console.warn('[StandBy] WakeLock request error:', err);
                if (standbyWakelockLabel) {
                    standbyWakelockLabel.textContent = '화면 유지 미지원 기기';
                }
            }
        } else {
            if (standbyWakelockLabel) {
                standbyWakelockLabel.textContent = '화면 유지 API 미지원';
            }
        }
    }

    function releaseWakeLock() {
        if (wakeLock) {
            wakeLock.release().catch(() => {});
            wakeLock = null;
        }
    }

    // =========================================================================
    // HUD Visibility & Interaction
    // =========================================================================
    function showHud() {
        if (!standbyHud) return;
        standbyHud.classList.remove('opacity-0', 'pointer-events-none');
        standbyHud.classList.add('opacity-100');

        clearTimeout(hudTimeout);
        hudTimeout = setTimeout(() => {
            hideHud();
        }, 4000);
    }

    function hideHud() {
        if (!standbyHud) return;
        clearTimeout(hudTimeout);
        standbyHud.classList.remove('opacity-100');
        standbyHud.classList.add('opacity-0', 'pointer-events-none');
    }

    function toggleHud() {
        if (!standbyHud) return;
        if (standbyHud.classList.contains('opacity-0')) {
            showHud();
        } else {
            hideHud();
        }
    }

    function toggleStandbyWidget() {
        if (standbyRightMode === 'calendar') {
            standbyRightMode = 'clock';
            standbyCalendarBox.classList.add('hidden');
            standbyClockBox.classList.remove('hidden');
            standbyWidgetLabel.textContent = '달력 보기 모드';
        } else {
            standbyRightMode = 'calendar';
            standbyClockBox.classList.add('hidden');
            standbyCalendarBox.classList.remove('hidden');
            standbyWidgetLabel.textContent = '시계 & 퇴근 모드';
            renderStandbyCalendar();
        }
    }

    async function toggleFullscreen() {
        try {
            if (!document.fullscreenElement && !document.webkitFullscreenElement) {
                if (standbyOverlay.requestFullscreen) {
                    await standbyOverlay.requestFullscreen();
                } else if (standbyOverlay.webkitRequestFullscreen) {
                    await standbyOverlay.webkitRequestFullscreen();
                }
                if (standbyFsIcon) standbyFsIcon.textContent = 'fullscreen_exit';
            } else {
                if (document.exitFullscreen) {
                    await document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    await document.webkitExitFullscreen();
                }
                if (standbyFsIcon) standbyFsIcon.textContent = 'fullscreen';
            }
        } catch (e) {
            console.warn('[StandBy] Fullscreen toggle error:', e);
        }
    }

    function openStandby() {
        if (!standbyOverlay) return;
        isStandByActive = true;
        standbyOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        window.scrollTo(0, 0);

        renderStandbyCalendar();
        updateRateDisplays();
        requestWakeLock();
        showHud();

        // Auto request fullscreen if user interacted (works on Android / Desktop)
        toggleFullscreen();
    }

    function closeStandby() {
        if (!standbyOverlay) return;
        isStandByActive = false;
        standbyOverlay.classList.add('hidden');
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        releaseWakeLock();
        clearTimeout(hudTimeout);

        if (document.fullscreenElement || document.webkitFullscreenElement) {
            if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
            else if (document.webkitExitFullscreen) document.webkitExitFullscreen().catch(() => {});
        }
    }

    // StandBy Event Listeners (both click and touchend for mobile zero-delay)
    if (openStandbyBtn) {
        const handleOpen = (e) => {
            if (e && e.type === 'touchend') e.preventDefault();
            openStandby();
        };
        openStandbyBtn.addEventListener('click', handleOpen);
        openStandbyBtn.addEventListener('touchend', handleOpen);
    }
    if (closeStandbyBtn) {
        const handleClose = (e) => {
            if (e && e.type === 'touchend') e.preventDefault();
            closeStandby();
        };
        closeStandbyBtn.addEventListener('click', handleClose);
        closeStandbyBtn.addEventListener('touchend', handleClose);
    }
    if (standbyToggleWidgetBtn) {
        const handleToggleWidget = (e) => {
            if (e && e.type === 'touchend') e.preventDefault();
            e.stopPropagation();
            toggleStandbyWidget();
            showHud();
        };
        standbyToggleWidgetBtn.addEventListener('click', handleToggleWidget);
        standbyToggleWidgetBtn.addEventListener('touchend', handleToggleWidget);
    }
    if (standbyFsBtn) {
        const handleToggleFs = (e) => {
            if (e && e.type === 'touchend') e.preventDefault();
            e.stopPropagation();
            toggleFullscreen();
            showHud();
        };
        standbyFsBtn.addEventListener('click', handleToggleFs);
        standbyFsBtn.addEventListener('touchend', handleToggleFs);
    }

    // Tap on standby overlay to reveal/hide HUD
    if (standbyOverlay) {
        standbyOverlay.addEventListener('click', (e) => {
            if (e.target.closest('#standby-hud')) return;
            toggleHud();
        });

        // Tap amount to toggle cents/integers
        if (standbyAmount) {
            standbyAmount.addEventListener('click', (e) => {
                e.stopPropagation();
                showCents = !showCents;
                showHud();
            });
        }

        // Tap right calendar or clock box to switch widget
        if (standbyCalendarBox) {
            standbyCalendarBox.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleStandbyWidget();
                showHud();
            });
        }
        if (standbyClockBox) {
            standbyClockBox.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleStandbyWidget();
                showHud();
            });
        }
    }

    // Keyboard ESC to close
    document.addEventListener('keydown', (e) => {
        if (isStandByActive && e.key === 'Escape') {
            closeStandby();
        }
    });

    // Re-acquire wake lock if tab visibility changes
    document.addEventListener('visibilitychange', () => {
        if (isStandByActive && document.visibilityState === 'visible') {
            requestWakeLock();
        }
    });

    // Salary Input Listeners
    salaryInput.addEventListener('input', updateRateDisplays);
    salaryChips.forEach(chip => {
        chip.addEventListener('click', () => {
            salaryInput.value = chip.getAttribute('data-sal');
            updateRateDisplays();
        });
    });

    // Poop Money Logic
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

    // Salary Receipt Share Card Handler
    const salaryShareCardBtn = document.getElementById('salary-share-card-btn');
    if (salaryShareCardBtn) {
        salaryShareCardBtn.addEventListener('click', () => {
            const earnedStr = earnedToday.textContent.trim();
            const earnedNum = parseFloat(earnedStr.replace(/,/g, '')) || 0;
            const coffees = (earnedNum / 4500).toFixed(1);
            const { secondRate, hourlyRate } = getRates();

            if (window.ToolBoxShare) {
                window.ToolBoxShare.openModal({
                    title: '초정밀 실시간 연봉 초시계',
                    subtitle: '오늘의 실시간 획득 급여 & 커피값 영수증',
                    badge: '💸 실시간 금융 치료',
                    metrics: [
                        { label: '오늘 번 돈', value: `₩ ${earnedStr}`, highlight: true },
                        { label: '초당 단가', value: `₩ ${secondRate.toFixed(2)}/초`, highlight: false },
                        { label: '통상 시급', value: `₩ ${Math.round(hourlyRate).toLocaleString()}/시`, highlight: false }
                    ],
                    quote: `☕ 오늘 현재 아메리카노 약 ${coffees}잔 적립 완료!\n숨만 쉬어도 1초마다 통장에 돈이 꽂히고 있습니다. 노동의 고통을 실시간 금융 숫자로 치유하세요.`
                });
            }
        });
    }

    updateRateDisplays();
    updateLiveTicker();
});
