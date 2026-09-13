// Ephemeral Minimal Scratchpad
document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.getElementById('noteContent');
  const saveStatus = document.getElementById('saveStatus');
  const textLength = document.getElementById('textLength');
  const downloadBtn = document.getElementById('downloadBtn');
  const clearBtn = document.getElementById('clearBtn');

  const STORAGE_KEY = "tossgpt_ephemeral_note";

  // Load saved
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    textarea.value = saved;
    textLength.innerText = saved.length;
  }

  let timeout = null;
  textarea.addEventListener('input', () => {
    saveStatus.innerText = "저장 중...";
    textLength.innerText = textarea.value.length;

    clearTimeout(timeout);
    timeout = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, textarea.value);
      saveStatus.innerText = "자동 저장됨";
    }, 400);
  });

  downloadBtn.addEventListener('click', () => {
    const text = textarea.value;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `memo_${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
  });

  clearBtn.addEventListener('click', () => {
    if (confirm("정말로 메모를 모두 지우시겠습니까?")) {
      textarea.value = "";
      localStorage.removeItem(STORAGE_KEY);
      textLength.innerText = 0;
      saveStatus.innerText = "비워짐";
    }
  });
});
