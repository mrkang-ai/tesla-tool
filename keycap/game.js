// Web Audio Context for Switch Sounds
let audioCtx = null;
let noiseBuffer = null;
let soundVolume = 0.7;
let currentSwitch = 'blue';
let currentLayout = 'keyboard';

// Typing Game State
let isChallengeMode = false;
let gameTimer = null;
let timeLeft = 60;
let score = 0;
let wpm = 0;
let combo = 0;
let totalKeystrokes = 0;
let correctKeystrokes = 0;
let wordsList = [];
let currentWordIndex = 0;
let challengeActive = false;

// Dynamic layout definition metadata
const layouts = {
    keyboard: [
        [
            { code: "Escape", label: "ESC", class: "key-esc" },
            { code: "Digit1", label: "1" },
            { code: "Digit2", label: "2" },
            { code: "Digit3", label: "3" },
            { code: "Digit4", label: "4" },
            { code: "Digit5", label: "5" },
            { code: "Digit6", label: "6" },
            { code: "Digit7", label: "7" },
            { code: "Digit8", label: "8" },
            { code: "Digit9", label: "9" },
            { code: "Digit0", label: "0" },
            { code: "Minus", label: "-" },
            { code: "Equal", label: "=" },
            { code: "Backspace", label: "BACKSPACE", class: "key-backspace flex-grow" }
        ],
        [
            { code: "Tab", label: "TAB", class: "key-tab" },
            { code: "KeyQ", label: "Q" },
            { code: "KeyW", label: "W" },
            { code: "KeyE", label: "E" },
            { code: "KeyR", label: "R" },
            { code: "KeyT", label: "T" },
            { code: "KeyY", label: "Y" },
            { code: "KeyU", label: "U" },
            { code: "KeyI", label: "I" },
            { code: "KeyO", label: "O" },
            { code: "KeyP", label: "P" },
            { code: "BracketLeft", label: "[" },
            { code: "BracketRight", label: "]" },
            { code: "Backslash", label: "\\", class: "key-backslash flex-grow" }
        ],
        [
            { code: "CapsLock", label: "CAPS", class: "key-caps" },
            { code: "KeyA", label: "A" },
            { code: "KeyS", label: "S" },
            { code: "KeyD", label: "D" },
            { code: "KeyF", label: "F" },
            { code: "KeyG", label: "G" },
            { code: "KeyH", label: "H" },
            { code: "KeyJ", label: "J" },
            { code: "KeyK", label: "K" },
            { code: "KeyL", label: "L" },
            { code: "Semicolon", label: ";" },
            { code: "Quote", label: "'" },
            { code: "Enter", label: "ENTER", class: "key-enter flex-grow" }
        ],
        [
            { code: "ShiftLeft", label: "SHIFT", class: "key-shift-l" },
            { code: "KeyZ", label: "Z" },
            { code: "KeyX", label: "X" },
            { code: "KeyC", label: "C" },
            { code: "KeyV", label: "V" },
            { code: "KeyB", label: "B" },
            { code: "KeyN", label: "N" },
            { code: "KeyM", label: "M" },
            { code: "Comma", label: "," },
            { code: "Period", label: "." },
            { code: "Slash", label: "/" },
            { code: "ShiftRight", label: "SHIFT", class: "key-shift-r flex-grow" }
        ],
        [
            { code: "ControlLeft", label: "CTRL", class: "key-ctrl" },
            { code: "MetaLeft", label: "WIN", class: "key-win" },
            { code: "AltLeft", label: "ALT", class: "key-alt" },
            { code: "Space", label: "", class: "key-space flex-grow" },
            { code: "AltRight", label: "ALT", class: "key-alt" },
            { code: "MetaRight", label: "WIN", class: "key-win" },
            { code: "ControlRight", label: "CTRL", class: "key-ctrl" }
        ]
    ],
    numpad: [
        [
            { code: "NumLock", label: "NUM" },
            { code: "NumpadDivide", label: "/" },
            { code: "NumpadMultiply", label: "*" },
            { code: "NumpadSubtract", label: "-" }
        ],
        [
            { code: "Numpad7", label: "7" },
            { code: "Numpad8", label: "8" },
            { code: "Numpad9", label: "9" },
            { code: "NumpadAdd", label: "+", class: "key-numpad-add" }
        ],
        [
            { code: "Numpad4", label: "4" },
            { code: "Numpad5", label: "5" },
            { code: "Numpad6", label: "6" }
        ],
        [
            { code: "Numpad1", label: "1" },
            { code: "Numpad2", label: "2" },
            { code: "Numpad3", label: "3" },
            { code: "NumpadEnter", label: "ENT", class: "key-numpad-enter" }
        ],
        [
            { code: "Numpad0", label: "0", class: "key-numpad-zero" },
            { code: "NumpadDecimal", label: "." }
        ]
    ],
    key8: [
        [
            { code: "KeyA", label: "A" },
            { code: "KeyS", label: "S" },
            { code: "KeyD", label: "D" },
            { code: "KeyF", label: "F" },
            { code: "KeyJ", label: "J" },
            { code: "KeyK", label: "K" },
            { code: "KeyL", label: "L" },
            { code: "Semicolon", label: ";" }
        ]
    ],
    key4: [
        [
            { code: "KeyS", label: "S" },
            { code: "KeyD", label: "D" },
            { code: "KeyK", label: "K" },
            { code: "KeyL", label: "L" }
        ]
    ],
    key2: [
        [
            { code: "KeyZ", label: "Z" },
            { code: "KeyX", label: "X" }
        ]
    ]
};

// Keyboard bindings fallback for laptop numeric row
const fallbackNumpadMap = {
    "Digit1": "Numpad1", "Digit2": "Numpad2", "Digit3": "Numpad3",
    "Digit4": "Numpad4", "Digit5": "Numpad5", "Digit6": "Numpad6",
    "Digit7": "Numpad7", "Digit8": "Numpad8", "Digit9": "Numpad9",
    "Digit0": "Numpad0", "Minus": "NumpadSubtract", "Equal": "NumpadAdd",
    "Slash": "NumpadDivide", "KeyX": "NumpadMultiply", "KeyZ": "NumLock"
};

// Bilingual Word Lists for full QWERTY keyboard
const koWords = [
    "도구모음", "사다리", "가위바위보", "원판돌리기", "당근피하기", "생성기", "로또번호",
    "개인정보", "약관", "소개", "사이트맵", "컴퓨터", "마우스", "키보드", "기계식", "타건음",
    "청축", "갈축", "적축", "스위치", "키캡", "사운드", "볼륨", "테마", "연습", "과학",
    "조약돌", "서치콘솔", "클라우드", "웹서버", "블로그", "포스팅", "에이전트", "인공지능",
    "애플리케이션", "프로그래밍", "자바스크립트", "스타일", "하우징", "윤활", "키압", "접점"
];

const enWords = [
    "toolbox", "ladder", "rock", "paper", "scissors", "roulette", "carrot", "dodger",
    "generator", "lotto", "privacy", "terms", "about", "sitemap", "computer", "mouse",
    "keyboard", "mechanical", "switch", "keycap", "volume", "theme", "practice", "science",
    "thock", "clack", "clicky", "tactile", "linear", "audio", "frequency", "oscillator",
    "filter", "context", "buffer", "ripple", "rainbow", "cyberpunk", "sakura", "lavender"
];

// Initialize Audio Context on first interaction
function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const bufferSize = audioCtx.sampleRate * 0.1;
        noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// Sound synthesis filters
function playNoise(ctx, dest, gainVal, duration, cutoff, filterType = 'lowpass') {
    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.setValueAtTime(cutoff, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(gainVal, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    source.start(ctx.currentTime);
    source.stop(ctx.currentTime + duration);
}

function playOscillator(ctx, dest, type, freq, gainVal, duration) {
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(gainVal, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
}

function playSwitchSound(type) {
    if (!audioCtx) return;
    
    const dest = audioCtx.destination;
    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(soundVolume, audioCtx.currentTime);
    masterGain.connect(dest);

    if (type === 'blue') {
        playOscillator(audioCtx, masterGain, 'triangle', 3400, 0.12, 0.005);
        playNoise(audioCtx, masterGain, 0.10, 0.006, 4500, 'highpass');
        playOscillator(audioCtx, masterGain, 'triangle', 720, 0.35, 0.025);
        playNoise(audioCtx, masterGain, 0.28, 0.025, 1200, 'bandpass');
    } 
    else if (type === 'brown') {
        playOscillator(audioCtx, masterGain, 'triangle', 2200, 0.03, 0.005);
        playNoise(audioCtx, masterGain, 0.02, 0.005, 2800, 'highpass');
        playOscillator(audioCtx, masterGain, 'triangle', 580, 0.22, 0.03);
        playNoise(audioCtx, masterGain, 0.18, 0.030, 950, 'bandpass');
    } 
    else if (type === 'red') {
        playOscillator(audioCtx, masterGain, 'sine', 115, 0.65, 0.045);
        playOscillator(audioCtx, masterGain, 'sine', 230, 0.25, 0.035);
        playNoise(audioCtx, masterGain, 0.45, 0.035, 280, 'lowpass');
    }
}

// Render selected keyboard layout
function renderKeyboard(layoutType) {
    const frame = document.getElementById('keyboard-frame');
    frame.innerHTML = '';

    // Clear layout classes
    frame.classList.remove('layout-numpad', 'layout-row-only');

    if (layoutType === 'keyboard') {
        frame.style.minWidth = '760px';
        frame.style.maxWidth = '850px';
    } else if (layoutType === 'numpad') {
        frame.style.minWidth = 'unset';
        frame.style.maxWidth = 'max-content';
        frame.classList.add('layout-numpad');
    } else {
        // key2, key4, key8
        frame.style.minWidth = 'unset';
        frame.style.maxWidth = 'max-content';
        frame.classList.add('layout-row-only');
    }

    const rows = layouts[layoutType];
    rows.forEach(row => {
        let rowDiv = frame;
        if (layoutType !== 'numpad') {
            rowDiv = document.createElement('div');
            rowDiv.className = 'key-row flex gap-1 mb-1';
            frame.appendChild(rowDiv);
        }

        row.forEach(keyMeta => {
            const keyEl = document.createElement('div');
            keyEl.className = `key ${keyMeta.class || ''}`;
            keyEl.setAttribute('data-key', keyMeta.code);
            
            const span = document.createElement('span');
            span.textContent = keyMeta.label;
            keyEl.appendChild(span);

            rowDiv.appendChild(keyEl);
        });
    });

    // Re-bind mouse handlers for virtual keys
    document.querySelectorAll('.key').forEach(keyEl => {
        keyEl.addEventListener('mousedown', () => {
            initAudio();
            keyEl.classList.add('active');
            playSwitchSound(currentSwitch);
            triggerRGBRipple(keyEl);

            if (isChallengeMode && challengeActive) {
                totalKeystrokes++;
            }
        });
        keyEl.addEventListener('mouseup', () => {
            keyEl.classList.remove('active');
        });
        keyEl.addEventListener('mouseleave', () => {
            keyEl.classList.remove('active');
        });
    });
}

function triggerRGBRipple(keyElement) {
    const mode = document.getElementById('rgb-mode').value;
    if (mode === 'off') return;

    if (mode === 'ripple') {
        keyElement.classList.remove('rgb-ripple-active');
        void keyElement.offsetWidth;
        
        const randomHue = Math.floor(Math.random() * 360);
        keyElement.style.setProperty('--ripple-color', `hsla(${randomHue}, 100%, 65%, 0.8)`);
        keyElement.classList.add('rgb-ripple-active');
        
        setTimeout(() => {
            keyElement.classList.remove('rgb-ripple-active');
        }, 350);
    }
}

// Setup customizer inputs
function setupCustomizer() {
    // 1. Switch Type selectors
    const switches = {
        'blue': document.getElementById('switch-blue'),
        'brown': document.getElementById('switch-brown'),
        'red': document.getElementById('switch-red')
    };

    Object.keys(switches).forEach(key => {
        switches[key].addEventListener('click', () => {
            initAudio();
            currentSwitch = key;
            Object.keys(switches).forEach(k => {
                switches[k].className = "py-2 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-text-muted dark:text-slate-300 transition-all";
            });
            switches[key].className = "py-2 text-xs font-bold rounded-lg border border-sky-200 dark:border-sky-900 bg-sky-50 dark:bg-sky-950/40 text-primary transition-all";
            playSwitchSound(currentSwitch);
        });
    });

    // 2. Keyboard Layout Selector
    const layoutSelector = document.getElementById('keyboard-layout');
    layoutSelector.addEventListener('change', (e) => {
        currentLayout = e.target.value;
        renderKeyboard(currentLayout);
        if (isChallengeMode) {
            resetChallenge();
        }
    });

    // 3. Volume
    const volumeVal = document.getElementById('volume-val');
    const volumeSlider = document.getElementById('volume-slider');
    volumeSlider.addEventListener('input', (e) => {
        soundVolume = e.target.value / 100;
        volumeVal.textContent = `${e.target.value}%`;
    });

    // 4. Keycap Theme
    const keycapTheme = document.getElementById('keycap-theme');
    const keyboardFrame = document.getElementById('keyboard-frame');
    keycapTheme.addEventListener('change', (e) => {
        keyboardFrame.className = `relative p-4 rounded-2xl bg-[#2d3748] dark:bg-[#111827] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-[6px] border-[#4a5568] dark:border-[#374151] select-none ${e.target.value === 'retro' ? 'theme-retro' : 'theme-' + e.target.value}`;
        // Re-inject layout grid classes if needed
        if (currentLayout === 'numpad') {
            keyboardFrame.classList.add('layout-numpad');
        } else if (currentLayout !== 'keyboard') {
            keyboardFrame.classList.add('layout-row-only');
        }
    });

    // 5. RGB Backlight Mode
    const rgbMode = document.getElementById('rgb-mode');
    rgbMode.addEventListener('change', (e) => {
        keyboardFrame.classList.remove('rgb-glow-solid', 'rgb-rainbow-wave');
        if (e.target.value === 'glow') {
            keyboardFrame.classList.add('rgb-glow-solid');
            document.querySelectorAll('.key').forEach(k => {
                k.style.setProperty('--rgb-color', '#0ea5e9');
            });
        } else if (e.target.value === 'rainbow') {
            keyboardFrame.classList.add('rgb-rainbow-wave');
        }
    });
}

// Bind event listeners for physical keys
function setupKeyboardListeners() {
    window.addEventListener('keydown', (e) => {
        let code = e.code;
        
        // Laptop keyboard fallback support for Numpad
        if (currentLayout === 'numpad') {
            if (fallbackNumpadMap[code]) {
                code = fallbackNumpadMap[code];
            }
        }

        const activeEl = document.activeElement;
        const isInput = activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA';
        
        if (!isInput && (code === 'Space' || code === 'Tab' || code === 'Backspace' || code === 'Slash' || code === 'Escape')) {
            e.preventDefault();
        }

        initAudio();
        
        const keyEl = document.querySelector(`.key[data-key="${code}"]`);
        if (keyEl) {
            keyEl.classList.add('active');
            playSwitchSound(currentSwitch);
            triggerRGBRipple(keyEl);
            
            if (isChallengeMode && challengeActive) {
                totalKeystrokes++;
            }
        }
    });

    window.addEventListener('keyup', (e) => {
        let code = e.code;
        if (currentLayout === 'numpad') {
            if (fallbackNumpadMap[code]) {
                code = fallbackNumpadMap[code];
            }
        }
        const keyEl = document.querySelector(`.key[data-key="${code}"]`);
        if (keyEl) {
            keyEl.classList.remove('active');
        }
    });
}

// Typing Speed Practice Loop
function setupTypingChallenge() {
    const modeFreeBtn = document.getElementById('mode-free');
    const modePracticeBtn = document.getElementById('mode-practice');
    const freePlayBox = document.getElementById('free-play-box');
    const practiceBox = document.getElementById('practice-box');
    const wordInput = document.getElementById('word-input');
    const restartBtn = document.getElementById('restart-btn');

    modeFreeBtn.addEventListener('click', () => {
        isChallengeMode = false;
        challengeActive = false;
        clearInterval(gameTimer);
        freePlayBox.classList.remove('hidden');
        practiceBox.classList.add('hidden');

        modeFreeBtn.className = "px-4 py-2 rounded-xl text-xs font-extrabold bg-primary text-white shadow-md transition-all select-none";
        modePracticeBtn.className = "px-4 py-2 rounded-xl text-xs font-extrabold bg-slate-100 dark:bg-slate-800 text-text-muted dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all select-none";
    });

    modePracticeBtn.addEventListener('click', () => {
        isChallengeMode = true;
        freePlayBox.classList.add('hidden');
        practiceBox.classList.remove('hidden');

        modePracticeBtn.className = "px-4 py-2 rounded-xl text-xs font-extrabold bg-primary text-white shadow-md transition-all select-none";
        modeFreeBtn.className = "px-4 py-2 rounded-xl text-xs font-extrabold bg-slate-100 dark:bg-slate-800 text-text-muted dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all select-none";

        resetChallenge();
    });

    wordInput.addEventListener('keydown', (e) => {
        if (!challengeActive) {
            startChallenge();
        }

        if (e.code === 'Space' || e.code === 'Enter') {
            e.preventDefault();
            checkWord();
        }
    });

    restartBtn.addEventListener('click', () => {
        resetChallenge();
    });
}

function resetChallenge() {
    clearInterval(gameTimer);
    challengeActive = false;
    timeLeft = 60;
    score = 0;
    wpm = 0;
    combo = 0;
    totalKeystrokes = 0;
    correctKeystrokes = 0;
    currentWordIndex = 0;

    const wordInput = document.getElementById('word-input');
    wordInput.value = '';
    wordInput.disabled = false;

    document.getElementById('wpm-display').textContent = '0';
    document.getElementById('acc-display').textContent = '100%';
    document.getElementById('timer-display').textContent = '60s';
    document.getElementById('combo-display').textContent = '0';

    // Generates training values based on current active keyboard layout
    generateCustomTrainingWords();
    renderWords();
}

function generateCustomTrainingWords() {
    if (currentLayout === 'keyboard') {
        const currentLang = document.documentElement.lang || 'ko';
        const sourceList = currentLang === 'ko' ? koWords : enWords;
        wordsList = [...sourceList].sort(() => 0.5 - Math.random()).slice(0, 30);
    } else {
        // Numpad, 8-key, 4-key, 2-key
        // Generate random training codes consisting ONLY of keys in the current layout
        const keyCodes = [];
        layouts[currentLayout].forEach(row => {
            row.forEach(key => {
                if (key.code !== 'Space' && key.code !== 'Backspace' && key.code !== 'Escape' && key.code !== 'NumLock' && key.code !== 'NumpadEnter') {
                    keyCodes.push(key.label);
                }
            });
        });

        wordsList = [];
        for (let w = 0; w < 30; w++) {
            // Generate a random 4-letter string matching layout
            let wordLength = currentLayout === 'numpad' ? 5 : 4;
            let tempStr = "";
            for (let c = 0; c < wordLength; c++) {
                const randChar = keyCodes[Math.floor(Math.random() * keyCodes.length)];
                tempStr += randChar;
            }
            wordsList.push(tempStr.toLowerCase());
        }
    }
}

function startChallenge() {
    challengeActive = true;
    gameTimer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer-display').textContent = `${timeLeft}s`;

        if (timeLeft < 60) {
            const timePassed = (60 - timeLeft) / 60;
            wpm = Math.round((correctKeystrokes / 5) / timePassed);
            document.getElementById('wpm-display').textContent = wpm;
        }

        if (totalKeystrokes > 0) {
            const acc = Math.round((correctKeystrokes / totalKeystrokes) * 100);
            document.getElementById('acc-display').textContent = `${acc}%`;
        }

        if (timeLeft <= 0) {
            endChallenge();
        }
    }, 1000);
}

function renderWords() {
    const line = document.getElementById('word-challenge-line');
    line.innerHTML = '';
    
    wordsList.forEach((word, idx) => {
        const span = document.createElement('span');
        span.textContent = word;
        if (idx === currentWordIndex) {
            span.className = 'word-current';
        } else if (idx < currentWordIndex) {
            span.className = 'word-correct';
        }
        line.appendChild(span);
    });
}

function checkWord() {
    const wordInput = document.getElementById('word-input');
    const typed = wordInput.value.trim().toLowerCase();
    if (!typed) return;

    const target = wordsList[currentWordIndex].toLowerCase();
    const isCorrect = typed === target;

    if (isCorrect) {
        combo++;
        correctKeystrokes += target.length + 1;
        totalKeystrokes += target.length + 1;
    } else {
        combo = 0;
        totalKeystrokes += typed.length + 1;
    }

    document.getElementById('combo-display').textContent = combo;
    currentWordIndex++;
    wordInput.value = '';

    if (currentWordIndex >= wordsList.length) {
        endChallenge();
    } else {
        renderWords();
    }
}

function endChallenge() {
    clearInterval(gameTimer);
    challengeActive = false;
    document.getElementById('word-input').disabled = true;
    
    const accuracy = totalKeystrokes > 0 ? Math.round((correctKeystrokes / totalKeystrokes) * 100) : 100;
    
    const lang = document.documentElement.lang || 'ko';
    const alertMsg = lang === 'ko' 
        ? `🎉 타건 연습 완료!\n평균 타수: ${wpm} WPM\n정확도: ${accuracy}%\n최대 콤보: ${combo}`
        : `🎉 Challenge Complete!\nTyping Speed: ${wpm} WPM\nAccuracy: ${accuracy}%\nMax Combo: ${combo}`;
        
    alert(alertMsg);
}

// DOM Init hook
document.addEventListener('DOMContentLoaded', () => {
    // Initial Render of QWERTY Keyboard
    renderKeyboard('keyboard');
    
    setupCustomizer();
    setupKeyboardListeners();
    setupTypingChallenge();
    
    const observer = new MutationObserver(() => {
        if (isChallengeMode) {
            resetChallenge();
        }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
});
