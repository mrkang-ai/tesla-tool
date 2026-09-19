// 칼퇴 카운트다운 & 핑계 생성 & 가짜 전화 로직
document.addEventListener('DOMContentLoaded', () => {
    const targetTimeInput = document.getElementById('target-time');
    const hoursLeft = document.getElementById('hours-left');
    const minsLeft = document.getElementById('mins-left');
    const secsLeft = document.getElementById('secs-left');
    const msLeft = document.getElementById('ms-left');
    const workPct = document.getElementById('work-pct');
    const progressFill = document.getElementById('progress-fill');

    const genExcuseBtn = document.getElementById('gen-excuse-btn');
    const copyExcuseBtn = document.getElementById('copy-excuse-btn');
    const excuseTitle = document.getElementById('excuse-title');
    const excuseBody = document.getElementById('excuse-body');
    const excuseCatBtns = document.querySelectorAll('.excuse-cat-btn');

    const triggerCallBtn = document.getElementById('trigger-call-btn');
    const callBtnText = document.getElementById('call-btn-text');
    const fakeCallerName = document.getElementById('fake-caller-name');
    const callDelay = document.getElementById('call-delay');
    const incomingCallModal = document.getElementById('incoming-call-modal');
    const modalCallerName = document.getElementById('modal-caller-name');
    const rejectCallBtn = document.getElementById('reject-call-btn');
    const acceptCallBtn = document.getElementById('accept-call-btn');

    let currentCat = 'medical';

    const excuses = {
        medical: [
            { title: '🚨 정형외과 도수치료 및 주사 예약', body: '팀장님, 지난주부터 허리 통증이 악화되어 오늘 18시 30분에 병원 야간 진료 예약이 잡혀 있습니다. 당일 취소 시 위약금이 발생하여 부득이 정시 퇴근하고자 합니다. 내일 일찍 출근하여 잔여 업무 챙기겠습니다!' },
            { title: '🦷 치과 신경치료 마취 대기', body: '치과 임플란트 및 신경치료 2차 진료가 18시 40분으로 예약되어 있어 지금 출발해야 진료를 받을 수 있습니다. 진료 후 메신저 확인하겠습니다!' },
            { title: '💊 내과 위내시경 전날 사전 금식', body: '내일 아침 건강검진 위내시경 일정으로 인해 오늘 19시부터 금식 및 사전 장세척 약 복용이 예정되어 있어 서둘러 귀가해야 할 것 같습니다.' }
        ],
        home: [
            { title: '🔧 본가 수도관 누수 및 배관공 방문', body: '본가 화장실 배관에서 누수가 발생해 기사님이 19시에 방문하시기로 했습니다. 가족들이 부재중이라 제가 직접 문을 열어드려야 하는 긴급 상황입니다.' },
            { title: '📦 신선식품 대형 택배 문앞 방치', body: '부모님께서 생물 전복과 고기를 택배로 보내주셨는데 문앞에 배송되었다고 연락이 왔습니다. 날씨로 인해 상할 우려가 있어 빠르게 귀가하고자 합니다.' },
            { title: '🚚 동생 이사 가구 배치 지원', body: '오늘 동생이 원룸 이사하는 날인데 대형 가구 반입 시 사람이 부족하여 19시까지 가기로 약속되어 있습니다. 양해 부탁드립니다.' }
        ],
        appointment: [
            { title: '🎂 어머니 환갑 기념 가족 식사', body: '오늘 어머니 환갑 기념으로 가족들이 오랜만에 한자리에 모이는 식사 자리가 19시에 예약되어 있어 늦으면 안 되는 자리입니다. 내일 최선을 다해 업무 보답하겠습니다.' },
            { title: '💍 대학 동기 청첩장 모임', body: '지방에서 올라온 15년 지기 절친의 청첩장 모임 약속이 강남역에서 18시 40분에 잡혀 있습니다. 정시 퇴근 승인 부탁드립니다.' }
        ],
        emergency: [
            { title: '🔥 전자기기 충전기 과열 알림', body: '홈 IoT 센서에서 멀티탭 이상 과열 경고 알림이 휴대폰으로 수신되어 화재 예방을 위해 긴급히 귀가하여 차단기를 점검해야 할 것 같습니다.' },
            { title: '🚗 차량 주차 차단기 오작동 민원', body: '아파트 지하주차장 이중주차 차량 출차 문제로 경비실에서 긴급 호출이 와서 바로 이동해야 하는 상황입니다.' }
        ]
    };

    function updateClock() {
        const now = new Date();
        const [tH, tM] = targetTimeInput.value.split(':').map(Number);
        const target = new Date();
        target.setHours(tH, tM, 0, 0);

        let diff = target - now;
        if (diff <= 0) {
            hoursLeft.textContent = '00';
            minsLeft.textContent = '00';
            secsLeft.textContent = '00';
            msLeft.textContent = '000';
            workPct.textContent = '100% (칼퇴 달성!)';
            progressFill.style.width = '100%';
        } else {
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            const ms = diff % 1000;

            hoursLeft.textContent = h.toString().padStart(2, '0');
            minsLeft.textContent = m.toString().padStart(2, '0');
            secsLeft.textContent = s.toString().padStart(2, '0');
            msLeft.textContent = ms.toString().padStart(3, '0');

            // 9am to target time progress
            const start = new Date();
            start.setHours(9, 0, 0, 0);
            const totalWork = target - start;
            const worked = now - start;
            const pct = Math.min(100, Math.max(0, Math.round((worked / totalWork) * 100)));
            workPct.textContent = `${pct}%`;
            progressFill.style.width = `${pct}%`;
        }
        requestAnimationFrame(updateClock);
    }

    function pickRandomExcuse() {
        const list = excuses[currentCat];
        const random = list[Math.floor(Math.random() * list.length)];
        excuseTitle.textContent = random.title;
        excuseBody.textContent = `"${random.body}"`;
    }

    excuseCatBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            excuseCatBtns.forEach(b => {
                b.classList.remove('active', 'bg-primary', 'text-white');
                b.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-300');
            });
            btn.classList.add('active', 'bg-primary', 'text-white');
            btn.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-300');
            currentCat = btn.getAttribute('data-cat');
            pickRandomExcuse();
        });
    });

    genExcuseBtn.addEventListener('click', pickRandomExcuse);

    copyExcuseBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(excuseBody.textContent).then(() => {
            copyExcuseBtn.querySelector('span:last-child').textContent = '복사 완료!';
            setTimeout(() => copyExcuseBtn.querySelector('span:last-child').textContent = '멘트 복사', 1500);
        });
    });

    // Authentic Smartphone Ringtone Synthesizer (Realistic Marimba / Opening Style)
    let ringInterval = null;
    let currentAudioCtx = null;

    function playRingtone() {
        stopRingtone();
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            currentAudioCtx = new AudioContext();

            const playNote = (freq, startTime, duration = 0.22) => {
                if (!currentAudioCtx || currentAudioCtx.state === 'closed') return;
                const now = startTime;

                // 1. Fundamental tone (warm sine wave)
                const osc = currentAudioCtx.createOscillator();
                const gain = currentAudioCtx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now);

                // Natural Acoustic Strike & Exponential Decay
                gain.gain.setValueAtTime(0.0001, now);
                gain.gain.linearRampToValueAtTime(0.32, now + 0.008);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

                osc.connect(gain);
                gain.connect(currentAudioCtx.destination);
                osc.start(now);
                osc.stop(now + duration);

                // 2. High harmonic mallet chime overtone (crisp wooden marimba strike)
                const overtone = currentAudioCtx.createOscillator();
                const overtoneGain = currentAudioCtx.createGain();
                overtone.type = 'triangle';
                overtone.frequency.setValueAtTime(freq * 3, now);

                overtoneGain.gain.setValueAtTime(0.0001, now);
                overtoneGain.gain.linearRampToValueAtTime(0.07, now + 0.004);
                overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

                overtone.connect(overtoneGain);
                overtoneGain.connect(currentAudioCtx.destination);
                overtone.start(now);
                overtone.stop(now + 0.06);
            };

            const ringPattern = () => {
                if (!currentAudioCtx || currentAudioCtx.state === 'closed') return;
                const t = currentAudioCtx.currentTime;

                // Iconic cheerful smartphone marimba melody:
                // A5 (880), C#6 (1109), E6 (1319), A6 (1760), G#6 (1661), E6 (1319), C#6 (1109), D6 (1175), E6 (1319)
                const melody = [
                    { f: 880.00,  offset: 0.00, d: 0.18 },
                    { f: 1108.73, offset: 0.14, d: 0.18 },
                    { f: 1318.51, offset: 0.28, d: 0.22 },
                    { f: 1760.00, offset: 0.44, d: 0.25 },
                    { f: 1661.22, offset: 0.64, d: 0.22 },
                    { f: 1318.51, offset: 0.82, d: 0.22 },
                    { f: 1108.73, offset: 1.02, d: 0.18 },
                    { f: 1174.66, offset: 1.18, d: 0.20 },
                    { f: 1318.51, offset: 1.38, d: 0.45 },
                ];

                melody.forEach(note => {
                    playNote(note.f, t + note.offset, note.d);
                });
            };

            ringPattern();
            ringInterval = setInterval(ringPattern, 2600);
        } catch (e) {
            console.warn('Ringtone audio error:', e);
        }
    }

    function stopRingtone() {
        if (ringInterval) {
            clearInterval(ringInterval);
            ringInterval = null;
        }
        if (currentAudioCtx) {
            currentAudioCtx.close().catch(() => {});
            currentAudioCtx = null;
        }
    }

    triggerCallBtn.addEventListener('click', () => {
        const delay = parseInt(callDelay.value);
        callBtnText.textContent = `${delay}초 후 전화 벨소리가 울립니다...`;
        triggerCallBtn.classList.replace('bg-emerald-600', 'bg-amber-600');

        setTimeout(() => {
            modalCallerName.textContent = fakeCallerName.value || '어머니 (긴급)';
            incomingCallModal.classList.remove('hidden');
            playRingtone();
            callBtnText.textContent = '가짜 전화 발신 예약';
            triggerCallBtn.classList.replace('bg-amber-600', 'bg-emerald-600');
        }, delay * 1000);
    });

    const endCall = () => {
        stopRingtone();
        incomingCallModal.classList.add('hidden');
    };

    rejectCallBtn.addEventListener('click', endCall);
    acceptCallBtn.addEventListener('click', () => {
        stopRingtone();
        alert('"여보세요? 네 어머니! 아 지금 퇴근하고 바로 출발해요! 네 금방 가요!"\n\n(상사를 향해 살짝 목례 후 가방을 챙겨 칼퇴하세요!)');
        incomingCallModal.classList.add('hidden');
    });

    updateClock();
    pickRandomExcuse();
});
