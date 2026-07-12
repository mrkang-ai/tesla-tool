const generateBtn = document.getElementById('generate-btn');
const generatedNumbersContainer = document.getElementById('generated-numbers-container');

// '번호 생성하기' 버튼 클릭 이벤트 리스너
if (generateBtn) {
    generateBtn.addEventListener('click', () => {
        generateBtn.disabled = true;
        const numbers = generateLottoNumbers();
        appendNewNumbers(numbers);
        setTimeout(() => {
            generateBtn.disabled = false;
        }, 300);
    });
}

/**
 * 중복되지 않는 1~45 사이의 6개 숫자를 생성하여 정렬된 배열로 반환합니다.
 */
function generateLottoNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
    }
    return Array.from(numbers).sort((a, b) => a - b);
}

/**
 * 숫자에 따라 적절한 로또 공 색상 클래스를 반환합니다.
 * @param {number} number - 로또 번호
 * @returns {string} - CSS 색상 클래스
 */
function getBallColorClass(number) {
    if (number <= 10) return 'ball-yellow';
    if (number <= 20) return 'ball-blue';
    if (number <= 30) return 'ball-red';
    if (number <= 40) return 'ball-grey';
    return 'ball-green';
}

/**
 * 생성된 번호 세트를 화면에 새로운 줄로 추가합니다.
 * @param {number[]} numbers - 생성된 로또 번호 배열
 */
function appendNewNumbers(numbers) {
    const setDiv = document.createElement('div');
    setDiv.className = 'generated-set';

    const numbersDiv = document.createElement('div');
    numbersDiv.className = 'numbers';

    numbers.forEach(number => {
        const numberSpan = document.createElement('span');
        numberSpan.className = `lotto-ball ${getBallColorClass(number)}`;
        numberSpan.textContent = number;
        numbersDiv.appendChild(numberSpan);
    });

    const timestampSpan = document.createElement('span');
    timestampSpan.className = 'timestamp';
    const now = new Date();
    timestampSpan.textContent = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    setDiv.appendChild(numbersDiv);
    setDiv.appendChild(timestampSpan);

    generatedNumbersContainer.prepend(setDiv);
}

const copyLinkBtn = document.getElementById('copy-link-btn');
if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            alert('페이지 주소가 복사되었습니다!');
        }, () => {
            alert('주소 복사에 실패했습니다.');
        });
    });
}

// --- 최신 로또 당첨 정보 자동 조회 및 갱신 기능 ---

let fetchedLottoData = null;

/**
 * 날짜 계산을 기반으로 토요일 20시 40분 추첨 시간을 반영하여 최신 로또 회차 번호를 계산합니다.
 */
function getLatestLottoRound() {
    // 기준 회차: 1208회 (2026년 1월 24일 토요일 20:40 KST)
    const baseRound = 1208;
    const baseDate = new Date("2026-01-24T20:40:00+09:00");
    
    const now = new Date();
    const diffMs = now - baseDate;
    const msPerWeek = 7 * 24 * 60 * 60 * 1000;
    
    const weeks = Math.floor(diffMs / msPerWeek);
    return baseRound + weeks;
}

/**
 * "YYYYMMDD" 형식의 날짜 문자열을 다국어에 맞게 변환합니다.
 */
function formatLottoDate(dateStr, lang) {
    if (!dateStr || dateStr.length !== 8) return "";
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    
    if (lang === 'ko') {
        return `${year}년 ${month}월 ${day}일 추첨`;
    } else {
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const monthIndex = parseInt(month, 10) - 1;
        const monthName = (monthIndex >= 0 && monthIndex < 12) ? monthNames[monthIndex] : month;
        const dayInt = parseInt(day, 10);
        return `Drawing on ${monthName} ${dayInt}, ${year}`;
    }
}

/**
 * 다국어 포맷으로 당첨금을 출력합니다.
 */
function formatWinnings(amount, lang) {
    if (amount === undefined || amount === null) return "-";
    const formatted = Number(amount).toLocaleString('ko-KR');
    return lang === 'ko' ? `${formatted}원` : `₩${formatted}`;
}

/**
 * 로또 공 업데이트
 */
function updateLottoBalls(winningNumbers, bonusNumber) {
    const winBallsContainer = document.getElementById('lotto-win-balls');
    const bonusBallContainer = document.getElementById('lotto-bonus-ball');
    
    if (winBallsContainer) {
        winBallsContainer.innerHTML = '';
        winningNumbers.forEach(num => {
            const ball = document.createElement('span');
            ball.className = `lotto-ball ${getBallColorClass(num)}`;
            ball.textContent = num;
            winBallsContainer.appendChild(ball);
        });
    }
    
    if (bonusBallContainer) {
        bonusBallContainer.innerHTML = '';
        const ball = document.createElement('span');
        ball.className = `lotto-ball ${getBallColorClass(bonusNumber)}`;
        ball.textContent = bonusNumber;
        bonusBallContainer.appendChild(ball);
    }
}

/**
 * 테이블 당첨금 및 당첨게임 수 업데이트
 */
function updateLottoTable(item, lang) {
    for (let r = 1; r <= 5; r++) {
        const row = document.getElementById(`lotto-rank-${r}`);
        if (!row) continue;
        
        const total = item[`rnk${r}SumWnAmt`] || 0;
        const count = item[`rnk${r}WnNope`] || 0;
        const amount = item[`rnk${r}WnAmt`] || 0;
        
        const totalCell = row.querySelector('.rank-total');
        const countCell = row.querySelector('.rank-count');
        const amountCell = row.querySelector('.rank-amount');
        
        if (totalCell) totalCell.textContent = formatWinnings(total, lang);
        if (countCell) countCell.textContent = Number(count).toLocaleString('ko-KR');
        if (amountCell) amountCell.textContent = formatWinnings(amount, lang);
    }
}

/**
 * 최신 로또 정보를 현재 언어 설정에 맞춰 화면에 그립니다.
 */
function renderLatestLotto(lang) {
    if (!fetchedLottoData) return;
    const data = fetchedLottoData;
    const round = data.ltEpsd;
    const dateStr = data.ltRflYmd;
    
    const roundTitle = document.getElementById('lotto-round-title');
    if (roundTitle) {
        roundTitle.setAttribute('data-lang-ko', `제 ${round}회차`);
        roundTitle.setAttribute('data-lang-en', `Round ${round}`);
        roundTitle.textContent = lang === 'ko' ? `제 ${round}회차` : `Round ${round}`;
    }
    
    const drawDate = document.getElementById('lotto-draw-date');
    if (drawDate) {
        const koDate = formatLottoDate(dateStr, 'ko');
        const enDate = formatLottoDate(dateStr, 'en');
        drawDate.setAttribute('data-lang-ko', koDate);
        drawDate.setAttribute('data-lang-en', enDate);
        drawDate.textContent = lang === 'ko' ? koDate : enDate;
    }
    
    updateLottoTable(data, lang);
}

/**
 * 특정 회차의 로또 데이터를 API로부터 조회합니다.
 */
async function fetchLottoData(round) {
    const url = `https://www.dhlottery.co.kr/lt645/selectPstLt645Info.do?srchLtEpsd=${round}`;
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const json = await res.json();
        
        if (json && json.data && json.data.list && json.data.list.length > 0) {
            return json.data.list[0];
        }
        return null;
    } catch (e) {
        console.error(`Failed to fetch lotto round ${round}:`, e);
        return null;
    }
}

/**
 * 초기화 및 API 호출 실행
 */
async function initLatestLottoInfo() {
    const latestRound = getLatestLottoRound();
    let data = await fetchLottoData(latestRound);
    
    // 이번 주차 결과가 아직 추첨 전이거나 등록되지 않은 경우 이전 회차로 대체
    if (!data) {
        console.log(`Round ${latestRound} results not available yet. Trying round ${latestRound - 1}.`);
        data = await fetchLottoData(latestRound - 1);
    }
    
    if (data) {
        fetchedLottoData = data;
        const currentLang = localStorage.getItem('language') || 'ko';
        
        // 1. 볼 숫자와 색상 갱신
        const winNums = [data.tm1WnNo, data.tm2WnNo, data.tm3WnNo, data.tm4WnNo, data.tm5WnNo, data.tm6WnNo];
        updateLottoBalls(winNums, data.bnsWnNo);
        
        // 2. 제목, 날짜, 당첨 테이블 랜더링
        renderLatestLotto(currentLang);
    } else {
        console.error("Could not fetch lotto results from API.");
    }
}

// 다국어 언어 변경 기능(language.js)과 통합 연동되도록 후킹 처리
function hookApplyLanguage() {
    if (typeof window.applyLanguage === 'function') {
        const originalApplyLanguage = window.applyLanguage;
        window.applyLanguage = function(lang, isInitialLoad) {
            originalApplyLanguage(lang, isInitialLoad);
            renderLatestLotto(lang);
        };
    } else {
        setTimeout(hookApplyLanguage, 50);
    }
}

// 페이지 로드 시 시작
document.addEventListener('DOMContentLoaded', () => {
    initLatestLottoInfo();
    hookApplyLanguage();
});
