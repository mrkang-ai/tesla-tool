// guard.js - Fair Night Guard Allocator
document.addEventListener('DOMContentLoaded', () => {
  const guardMembers = document.getElementById('guardMembers');
  const drawShiftBtn = document.getElementById('drawShiftBtn');
  const copyShiftBtn = document.getElementById('copyShiftBtn');
  const shiftTbody = document.getElementById('shiftTbody');

  const slots = [
    { num: "1초번", time: "22:00 ~ 23:30", tier: "꿀", color: "text-emerald-400" },
    { num: "2초번", time: "23:30 ~ 01:00", tier: "보통", color: "text-blue-400" },
    { num: "3초번 (헬)", time: "01:00 ~ 02:30", tier: "극악", color: "text-rose-400" },
    { num: "4초번 (헬)", time: "02:30 ~ 04:00", tier: "지옥", color: "text-rose-500" },
    { num: "5초번", time: "04:00 ~ 05:30", tier: "피곤", color: "text-amber-400" },
    { num: "말번", time: "05:30 ~ 06:30", tier: "꿀", color: "text-emerald-400" }
  ];

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function generate() {
    const list = guardMembers.value.split('\n').map(s => s.trim()).filter(Boolean);
    if (list.length < 6) {
      alert("최소 6명 이상의 인원을 입력해주세요.");
      return;
    }

    const shuffled = shuffle(list);

    shiftTbody.innerHTML = slots.map((s, idx) => {
      const person = shuffled[idx % shuffled.length];
      return `
        <tr class="hover:bg-slate-700/30">
          <td class="py-2.5 px-3 font-bold text-slate-300">${s.num}</td>
          <td class="py-2.5 px-3 text-slate-400">${s.time}</td>
          <td class="py-2.5 px-3 font-bold text-indigo-300">${person}</td>
          <td class="py-2.5 px-3 text-right font-bold ${s.color}">${s.tier}</td>
        </tr>
      `;
    }).join('');
  }

  drawShiftBtn.addEventListener('click', generate);

  copyShiftBtn.addEventListener('click', () => {
    let out = "[오늘 밤 불침번 명령서]\n";
    document.querySelectorAll('#shiftTbody tr').forEach(tr => {
      const tds = tr.querySelectorAll('td');
      out += `${tds[0].innerText} (${tds[1].innerText}): ${tds[2].innerText}\n`;
    });
    navigator.clipboard.writeText(out).then(() => {
      copyShiftBtn.textContent = "복사됨!";
      setTimeout(() => copyShiftBtn.textContent = "근무표 복사", 2000);
    });
  });

  generate();
});
