// beautifier.js - Instant JSON Beautifier
document.addEventListener('DOMContentLoaded', () => {
  const rawJsonIn = document.getElementById('rawJsonIn');
  const jsonOut = document.getElementById('jsonOut');
  const jsonStatus = document.getElementById('jsonStatus');
  const sampleJsonBtn = document.getElementById('sampleJsonBtn');
  const copyJsonBtn = document.getElementById('copyJsonBtn');

  function parse() {
    const raw = rawJsonIn.value.trim();
    if (!raw) {
      jsonOut.textContent = "";
      jsonStatus.textContent = "WAITING";
      jsonStatus.className = "text-sm px-2 py-0.5 rounded bg-slate-700 text-slate-400 font-bold font-mono";
      return;
    }

    try {
      const obj = JSON.parse(raw);
      jsonOut.textContent = JSON.stringify(obj, null, 2);
      jsonStatus.textContent = "VALID JSON ✅";
      jsonStatus.className = "text-sm px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold font-mono";
    } catch (e) {
      jsonOut.textContent = `❌ JSON 구문 오류:
${e.message}`;
      jsonStatus.textContent = "SYNTAX ERROR 🚨";
      jsonStatus.className = "text-sm px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold font-mono";
    }
  }

  rawJsonIn.addEventListener('input', parse);

  sampleJsonBtn.addEventListener('click', () => {
    rawJsonIn.value = JSON.stringify({
      project: "100 Tools",
      category: "CAT-06 AI & Tech",
      totalCount: 100,
      activeStatus: true,
      authors: ["TeslaTool", "Antigravity AI"],
      features: { responsive: true, bilingual: true, darkmode: true }
    });
    parse();
  });

  copyJsonBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(jsonOut.textContent).then(() => {
      copyJsonBtn.textContent = "복사됨!";
      setTimeout(() => copyJsonBtn.textContent = "정리된 JSON 복사", 2000);
    });
  });

  sampleJsonBtn.click();
});
