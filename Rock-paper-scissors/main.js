const startBtn = document.getElementById('start-btn');
const choicesContainer = document.getElementById('choices-container');
const choiceBtns = document.querySelectorAll('.choice-btn');
const userChoiceElem = document.getElementById('user-choice');
const computerChoiceElem = document.getElementById('computer-choice');
const resultTextElem = document.getElementById('result-text');
const gameHintElem = document.getElementById('game-hint');

const playerCard = document.getElementById('player-card');
const computerCard = document.getElementById('computer-card');

const totalRoundsElem = document.getElementById('total-rounds');
const winCountElem = document.getElementById('win-count');
const winPercentageElem = document.getElementById('win-percentage');
const historyLogElem = document.getElementById('history-log');

const choiceKeys = ['rock', 'scissors', 'paper'];
const choiceMap = {
    rock: '✊',
    scissors: '✌️',
    paper: '✋'
};

let totalRounds = 0;
let winCount = 0;

let gameState = 'READY'; // READY, PLAYING, RESULT
let shuffleInterval = null;
let computerCurrentChoice = 'rock';

// Load initial statistics from localStorage
function initStats() {
    const savedRounds = localStorage.getItem('rps_total_rounds');
    const savedWins = localStorage.getItem('rps_win_count');
    const savedHistory = localStorage.getItem('rps_history_logs');

    if (savedRounds) totalRounds = parseInt(savedRounds, 10);
    if (savedWins) winCount = parseInt(savedWins, 10);

    updateStatsDisplay();

    if (savedHistory) {
        historyLogElem.innerHTML = savedHistory;
    }
}

function updateStatsDisplay() {
    const winPercentage = totalRounds > 0 ? ((winCount / totalRounds) * 100).toFixed(1) : 0;
    totalRoundsElem.textContent = totalRounds;
    winCountElem.textContent = winCount;
    winPercentageElem.textContent = winPercentage;
}

// Start game shuffling
function startGame() {
    if (gameState === 'PLAYING') return;

    gameState = 'PLAYING';

    // Clear previous highlights
    resetCardStyles();

    // Reset hands view
    userChoiceElem.textContent = '❔';
    computerChoiceElem.textContent = '✊';

    // Remove text transitions
    userChoiceElem.classList.remove('scale-110');
    computerChoiceElem.classList.remove('scale-110');

    // Update result status text
    updateStatusText();

    // Start shuffling animation
    let index = 0;
    shuffleInterval = setInterval(() => {
        index = (index + 1) % choiceKeys.length;
        computerCurrentChoice = choiceKeys[index];
        computerChoiceElem.textContent = choiceMap[computerCurrentChoice];
    }, 60);

    // Apply active styles to computer card (glowing)
    computerCard.classList.add('ring-4', 'ring-primary/40', 'animate-pulse');

    // Enable choices row
    choicesContainer.classList.remove('opacity-40', 'pointer-events-none');

    // Update start button status (disabled during play)
    startBtn.disabled = true;
    startBtn.classList.add('opacity-50', 'cursor-not-allowed');
    updateStartButtonLabel();
}

// Handle player choice click
function makeChoice(userChoice) {
    if (gameState !== 'PLAYING') return;

    gameState = 'RESULT';

    // Stop shuffling immediately
    clearInterval(shuffleInterval);

    // Disable choices row
    choicesContainer.classList.add('opacity-40', 'pointer-events-none');

    // Set user hand
    userChoiceElem.textContent = choiceMap[userChoice];

    // Compute result
    const result = getResult(userChoice, computerCurrentChoice);

    // Highlight outcomes
    applyOutcomeHighlights(result);

    // Update round stats
    totalRounds++;
    if (result === 'win') {
        winCount++;
    }

    localStorage.setItem('rps_total_rounds', totalRounds);
    localStorage.setItem('rps_win_count', winCount);

    updateStatsDisplay();
    addHistoryLog(userChoice, computerCurrentChoice, result);

    // Re-enable start button for next round
    startBtn.disabled = false;
    startBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    updateStartButtonLabel();
}

function getResult(user, computer) {
    if (user === computer) return 'draw';
    if (
        (user === 'rock' && computer === 'scissors') ||
        (user === 'scissors' && computer === 'paper') ||
        (user === 'paper' && computer === 'rock')
    ) {
        return 'win';
    }
    return 'lose';
}

function resetCardStyles() {
    playerCard.className = "flex flex-col items-center justify-center p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 min-h-[200px] transition-all duration-300";
    computerCard.className = "flex flex-col items-center justify-center p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 min-h-[200px] transition-all duration-300";
    computerCard.classList.remove('ring-4', 'ring-primary/40', 'animate-pulse');
}

function applyOutcomeHighlights(result) {
    resetCardStyles();
    
    // Scale up both hand symbols for impact
    userChoiceElem.classList.add('scale-110');
    computerChoiceElem.classList.add('scale-110');

    if (result === 'win') {
        // Player Wins: Green glow on player, dimmed computer
        playerCard.classList.add('border-emerald-500', 'bg-emerald-50/30', 'dark:bg-emerald-950/20', 'ring-4', 'ring-emerald-500/30', 'scale-105');
        computerCard.classList.add('opacity-60');
    } else if (result === 'lose') {
        // Player Loses: Red border on player, green glow on computer
        playerCard.classList.add('border-rose-500', 'bg-rose-50/30', 'dark:bg-rose-950/20', 'ring-4', 'ring-rose-500/30');
        computerCard.classList.add('border-emerald-500', 'bg-emerald-50/30', 'dark:bg-emerald-950/20', 'ring-4', 'ring-emerald-500/30', 'scale-105');
    } else {
        // Draw: Amber borders on both
        playerCard.classList.add('border-amber-400', 'bg-amber-50/20', 'dark:bg-amber-950/10');
        computerCard.classList.add('border-amber-400', 'bg-amber-50/20', 'dark:bg-amber-950/10');
    }

    updateStatusText(result);
}

function updateStatusText(result) {
    const lang = document.documentElement.lang || 'ko';

    if (gameState === 'READY') {
        resultTextElem.textContent = lang === 'en' ? 'Waiting...' : '대기 중...';
        resultTextElem.className = "text-xl font-black mt-4 text-text-muted dark:text-slate-500 leading-tight min-h-[32px]";
    } else if (gameState === 'PLAYING') {
        resultTextElem.textContent = lang === 'en' ? 'Choose Now!' : '지금 선택하세요!';
        resultTextElem.className = "text-xl font-black mt-4 text-primary animate-pulse leading-tight min-h-[32px]";
    } else if (gameState === 'RESULT') {
        if (result === 'win') {
            resultTextElem.textContent = lang === 'en' ? 'YOU WIN! 🎉' : '승리했습니다! 🎉';
            resultTextElem.className = "text-2xl font-black mt-4 text-emerald-500 leading-tight min-h-[32px]";
        } else if (result === 'lose') {
            resultTextElem.textContent = lang === 'en' ? 'YOU LOSE... 😢' : '패배했습니다... 😢';
            resultTextElem.className = "text-2xl font-black mt-4 text-rose-500 leading-tight min-h-[32px]";
        } else {
            resultTextElem.textContent = lang === 'en' ? 'DRAW! 🤝' : '무승부! 🤝';
            resultTextElem.className = "text-2xl font-black mt-4 text-amber-500 leading-tight min-h-[32px]";
        }
    }
}

function updateStartButtonLabel() {
    const lang = document.documentElement.lang || 'ko';
    const labelSpan = startBtn.querySelector('span:not(.material-symbols-outlined)');
    const iconSpan = startBtn.querySelector('.material-symbols-outlined');

    if (gameState === 'PLAYING') {
        labelSpan.textContent = lang === 'en' ? 'Fighting...' : '대결 중...';
        iconSpan.textContent = 'sports_kabaddi';
    } else if (gameState === 'RESULT') {
        labelSpan.textContent = lang === 'en' ? 'Play Again 🔄' : '다시 대결하기 🔄';
        iconSpan.textContent = 'replay';
    } else {
        labelSpan.textContent = lang === 'en' ? 'Start Game' : '게임 시작';
        iconSpan.textContent = 'play_circle';
    }
}

function updateGameHint() {
    const lang = document.documentElement.lang || 'ko';
    if (gameState === 'READY') {
        gameHintElem.textContent = lang === 'en' ? 'Click Start Game to begin shuffling.' : '시작 버튼을 누르면 컴퓨터가 흔들기 시작합니다.';
    } else if (gameState === 'PLAYING') {
        gameHintElem.textContent = lang === 'en' ? 'Choose rock, paper, or scissors instantly!' : '컴퓨터가 흔들고 있습니다! 모양을 즉시 클릭하세요!';
    } else {
        gameHintElem.textContent = lang === 'en' ? 'Click Play Again to trigger next round.' : '다시 대결하기를 눌러 다음 판을 진행하세요.';
    }
}

function addHistoryLog(user, computer, result) {
    const lang = document.documentElement.lang || 'ko';
    const logItem = document.createElement('div');
    logItem.className = "flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/5";

    let badge = '';
    if (result === 'win') {
        badge = `<span class="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs px-2.5 py-1 rounded-full uppercase font-bold" data-lang-ko="승리" data-lang-en="WIN">${lang === 'en' ? 'WIN' : '승리'}</span>`;
    } else if (result === 'lose') {
        badge = `<span class="bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-xs px-2.5 py-1 rounded-full uppercase font-bold" data-lang-ko="패배" data-lang-en="LOSE">${lang === 'en' ? 'LOSE' : '패배'}</span>`;
    } else {
        badge = `<span class="bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 text-xs px-2.5 py-1 rounded-full uppercase font-bold" data-lang-ko="무승부" data-lang-en="DRAW">${lang === 'en' ? 'DRAW' : '무승부'}</span>`;
    }

    const roundText = lang === 'en' ? `Round ${totalRounds}` : `제 ${totalRounds}회`;
    const vsText = lang === 'en' ? `You: ${choiceMap[user]} vs Computer: ${choiceMap[computer]}` : `나: ${choiceMap[user]} vs 컴퓨터: ${choiceMap[computer]}`;

    logItem.innerHTML = `
        <div class="flex items-center gap-3">
            <span class="text-xs text-text-muted dark:text-slate-500 font-bold">${roundText}</span>
            <span class="text-text-main dark:text-white">${vsText}</span>
        </div>
        ${badge}
    `;

    historyLogElem.prepend(logItem);

    // Save history logs html
    localStorage.setItem('rps_history_logs', historyLogElem.innerHTML);
}

// Bind Button click event listener
if (startBtn) {
    startBtn.addEventListener('click', startGame);
}

choiceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const choice = btn.dataset.choice;
        makeChoice(choice);
    });
});

// Watch language updates
function updateLanguageDisplay() {
    updateStatusText();
    updateStartButtonLabel();
    updateGameHint();
    
    // Refresh history log badges and text dynamically
    const lang = document.documentElement.lang || 'ko';
    const items = historyLogElem.querySelectorAll('div');
    items.forEach((item, index) => {
        const badge = item.querySelector('span:last-child');
        const roundSpan = item.querySelector('span:first-child');
        const textSpan = item.querySelector('div > span:last-child');

        // We can reconstruct or translate simply since we know the order
        const roundNum = items.length - index;
        if (roundSpan) {
            roundSpan.textContent = lang === 'en' ? `Round ${roundNum}` : `제 ${roundNum}회`;
        }

        if (badge) {
            if (badge.classList.contains('text-emerald-600')) {
                badge.textContent = lang === 'en' ? 'WIN' : '승리';
            } else if (badge.classList.contains('text-rose-600')) {
                badge.textContent = lang === 'en' ? 'LOSE' : '패배';
            } else {
                badge.textContent = lang === 'en' ? 'DRAW' : '무승부';
            }
        }
    });
}

// Initialize MutationObserver to watch language attribute switches
const langObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'lang') {
            updateLanguageDisplay();
        }
    });
});
langObserver.observe(document.documentElement, { attributes: true });

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    initStats();
    updateLanguageDisplay();
});
