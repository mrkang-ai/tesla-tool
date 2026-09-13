const textInput = document.getElementById('text-input');
const countCharIncludeSpace = document.getElementById('count-char-include-space');
const countCharExcludeSpace = document.getElementById('count-char-exclude-space');
const countWords = document.getElementById('count-words');
const countLines = document.getElementById('count-lines');
const countBytesUtf8 = document.getElementById('count-bytes-utf8');
const countBytesEuckr = document.getElementById('count-bytes-euckr');

// Buttons
const resetBtn = document.getElementById('reset-btn');
const copyBtn = document.getElementById('copy-btn');
const upperBtn = document.getElementById('upper-btn');
const lowerBtn = document.getElementById('lower-btn');
const trimBtn = document.getElementById('trim-btn');

function getByteLength(str, encoding) {
    if (encoding === 'utf8') {
        return new Blob([str]).size;
    } else {
        // EUC-KR approximation: Korean characters are 2 bytes, others are 1 byte
        let bytes = 0;
        for (let i = 0; i < str.length; i++) {
            const code = str.charCodeAt(i);
            if (code > 127) {
                bytes += 2;
            } else {
                bytes += 1;
            }
        }
        return bytes;
    }
}

function updateCounts() {
    const text = textInput ? textInput.value : '';

    // 1. Characters including space
    if (countCharIncludeSpace) countCharIncludeSpace.textContent = text.length.toLocaleString();

    // 2. Characters excluding space
    if (countCharExcludeSpace) countCharExcludeSpace.textContent = text.replace(/\s/g, '').length.toLocaleString();

    // 3. Words
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    if (countWords) countWords.textContent = words.length.toLocaleString();
    
    // 4. Lines
    const lines = text.split('\n');
    if (countLines) countLines.textContent = text.length === 0 ? '0' : lines.length.toLocaleString();

    // 5. Bytes
    if (countBytesUtf8) countBytesUtf8.textContent = getByteLength(text, 'utf8').toLocaleString();
    if (countBytesEuckr) countBytesEuckr.textContent = getByteLength(text, 'euckr').toLocaleString();
}

function resetAll() {
    if (textInput) textInput.value = '';
    updateCounts();
}

function copyText() {
    if (!textInput || !textInput.value) return;
    navigator.clipboard.writeText(textInput.value).then(() => {
        const lang = document.documentElement.lang || 'ko';
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = `<span class="material-symbols-outlined text-sm">done</span> <span>${lang === 'en' ? 'Copied!' : '복사됨!'}</span>`;
        setTimeout(() => {
            if (copyBtn) copyBtn.innerHTML = originalText;
        }, 1500);
    });
}

function convertUpper() {
    if (textInput) {
        textInput.value = textInput.value.toUpperCase();
        updateCounts();
    }
}

function convertLower() {
    if (textInput) {
        textInput.value = textInput.value.toLowerCase();
        updateCounts();
    }
}

function trimSpaces() {
    if (textInput) {
        textInput.value = textInput.value.replace(/\s+/g, ' ').trim();
        updateCounts();
    }
}

// Bind event listeners
if (textInput) textInput.addEventListener('input', updateCounts);
if (resetBtn) resetBtn.addEventListener('click', resetAll);
if (copyBtn) copyBtn.addEventListener('click', copyText);
if (upperBtn) upperBtn.addEventListener('click', convertUpper);
if (lowerBtn) lowerBtn.addEventListener('click', convertLower);
if (trimBtn) trimBtn.addEventListener('click', trimSpaces);

// Run initial count
updateCounts();
