// seating.js - Protocol Seating Simulator
document.addEventListener('DOMContentLoaded', () => {
  const vipsContainer = document.getElementById('vipsContainer');
  const addVipBtn = document.getElementById('addVipBtn');
  const presetBtn = document.getElementById('presetBtn');
  const sceneTabs = document.querySelectorAll('.scene-tab');
  const diagramSvg = document.getElementById('diagramSvg');
  const exportSvgBtn = document.getElementById('exportSvgBtn');
  const ruleText = document.getElementById('ruleText');

  let currentScene = 'car'; // 'car' | 'table' | 'photo'

  let vips = [
    { rank: 1, name: "기관장 (청장/장관)" },
    { rank: 2, name: "외빈 귀빈 (VIP)" },
    { rank: 3, name: "기획조정실장" },
    { rank: 4, name: "수행 비서관" }
  ];

  function renderVipInputs() {
    vipsContainer.innerHTML = vips.map((v, i) => `
      <div class="flex items-center gap-2">
        <span class="w-6 text-center text-sm font-bold ${i === 0 ? 'text-amber-400' : 'text-slate-400'}">#${i + 1}</span>
        <input type="text" value="${v.name}" data-idx="${i}" class="vip-in flex-1 bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500">
        ${vips.length > 2 ? `<button data-idx="${i}" class="del-vip text-slate-500 hover:text-rose-400 text-sm px-1"><i class="fa-solid fa-xmark"></i></button>` : ''}
      </div>
    `).join('');

    document.querySelectorAll('.vip-in').forEach(input => {
      input.addEventListener('input', (e) => {
        const idx = parseInt(e.target.getAttribute('data-idx'), 10);
        vips[idx].name = e.target.value;
        draw();
      });
    });

    document.querySelectorAll('.del-vip').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        vips.splice(idx, 1);
        renderVipInputs();
        draw();
      });
    });
  }

  addVipBtn.addEventListener('click', () => {
    if (vips.length >= 8) {
      alert("최대 8명까지 배치 가능합니다.");
      return;
    }
    vips.push({ rank: vips.length + 1, name: `참석자 ${vips.length + 1}` });
    renderVipInputs();
    draw();
  });

  presetBtn.addEventListener('click', () => {
    vips = [
      { rank: 1, name: "기관장 (청장/장관)" },
      { rank: 2, name: "외빈 귀빈 (VIP)" },
      { rank: 3, name: "기획조정실장" },
      { rank: 4, name: "수행 비서관" }
    ];
    renderVipInputs();
    draw();
  });

  sceneTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      sceneTabs.forEach(t => {
        t.className = "scene-tab px-4 py-2 rounded-xl text-sm font-bold border border-slate-700 transition flex items-center gap-2 bg-slate-800 text-slate-400 hover:text-white";
      });
      tab.className = "scene-tab px-4 py-2 rounded-xl text-sm font-bold border border-purple-500 transition flex items-center gap-2 bg-purple-600 text-white";
      currentScene = tab.getAttribute('data-scene');

      if (currentScene === 'car') {
        ruleText.innerHTML = "• <b>차량 상석</b>: 운전기사가 있을 때 뒷좌석 우측(1위) → 뒷좌석 좌측(2위) → 조수석(3위) → 뒷좌석 중앙(4위)";
      } else if (currentScene === 'table') {
        ruleText.innerHTML = "• <b>테이블 상석</b>: 출입문에서 가장 먼 중앙(1위)을 기준으로 우측(2위)과 좌측(3위) 지그재그 교차 배치";
      } else {
        ruleText.innerHTML = "• <b>단상 촬영</b>: 주빈을 중앙(1위)에 모시고, 주빈의 오른쪽(바라볼 때 왼쪽, 2위), 주빈의 왼쪽(3위) 순서 교차";
      }
      draw();
    });
  });

  function draw() {
    if (currentScene === 'car') {
      drawCar();
    } else if (currentScene === 'table') {
      drawTable();
    } else {
      drawPhoto();
    }
  }

  function drawCar() {
    const p1 = vips[0]?.name || "1위 상석";
    const p2 = vips[1]?.name || "2위 차석";
    const p3 = vips[2]?.name || "3위";
    const p4 = vips[3]?.name || "4위";

    diagramSvg.innerHTML = `
      <!-- Car Outline -->
      <rect x="70" y="30" width="360" height="300" rx="40" fill="#1e293b" stroke="#475569" stroke-width="3"/>
      <!-- Windshield -->
      <path d="M 120 70 L 380 70 L 360 110 L 140 110 Z" fill="#334155"/>
      <text x="250" y="52" fill="#94a3b8" font-size="12" text-anchor="middle" font-weight="bold">▲ 차량 전면 (진행 방향)</text>

      <!-- Front Seats -->
      <!-- Driver Left (Korean style driver on Left) -->
      <g transform="translate(130, 125)">
        <rect width="90" height="60" rx="10" fill="#0f172a" stroke="#64748b" stroke-width="1.5"/>
        <text x="45" y="30" fill="#94a3b8" font-size="11" text-anchor="middle" font-weight="bold">운전기사</text>
        <text x="45" y="46" fill="#64748b" font-size="9" text-anchor="middle">(운전석)</text>
      </g>

      <!-- Front Passenger (Right seat) = Rank #3 -->
      <g transform="translate(280, 125)">
        <rect width="90" height="60" rx="10" fill="#312e81" stroke="#818cf8" stroke-width="2"/>
        <text x="45" y="24" fill="#c7d2fe" font-size="10" text-anchor="middle" font-weight="bold">#3위</text>
        <text x="45" y="44" fill="#ffffff" font-size="11" text-anchor="middle" font-weight="bold">${truncate(p3, 7)}</text>
      </g>

      <!-- Rear Seats -->
      <!-- Rear Left = Rank #2 -->
      <g transform="translate(100, 220)">
        <rect width="90" height="70" rx="10" fill="#1e1b4b" stroke="#a78bfa" stroke-width="2"/>
        <text x="45" y="26" fill="#c4b5fd" font-size="11" text-anchor="middle" font-weight="bold">#2위 차석</text>
        <text x="45" y="48" fill="#ffffff" font-size="12" text-anchor="middle" font-weight="bold">${truncate(p2, 7)}</text>
      </g>

      <!-- Rear Middle = Rank #4 -->
      <g transform="translate(205, 230)">
        <rect width="90" height="60" rx="10" fill="#0f172a" stroke="#475569" stroke-width="1"/>
        <text x="45" y="24" fill="#94a3b8" font-size="10" text-anchor="middle">#4위 (최하석)</text>
        <text x="45" y="44" fill="#cbd5e1" font-size="11" text-anchor="middle">${truncate(p4, 7)}</text>
      </g>

      <!-- Rear Right = Rank #1 (BEST SEAT) -->
      <g transform="translate(310, 220)">
        <rect width="90" height="70" rx="10" fill="#4c1d95" stroke="#f59e0b" stroke-width="3"/>
        <text x="45" y="24" fill="#fbbf24" font-size="11" text-anchor="middle" font-weight="bold">👑 #1위 최고 상석</text>
        <text x="45" y="48" fill="#ffffff" font-size="12" text-anchor="middle" font-weight="bold">${truncate(p1, 7)}</text>
      </g>
    `;
  }

  function drawTable() {
    diagramSvg.innerHTML = `
      <!-- Room border -->
      <rect x="20" y="20" width="460" height="320" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>
      <text x="250" y="45" fill="#94a3b8" font-size="12" text-anchor="middle" font-weight="bold">회의실 (스크린 / 헤드보드 방향)</text>
      <line x1="120" y1="55" x2="380" y2="55" stroke="#64748b" stroke-width="3" stroke-dasharray="6,4"/>

      <!-- Long Table -->
      <rect x="70" y="140" width="360" height="70" rx="12" fill="#1e293b" stroke="#64748b" stroke-width="2"/>
      <text x="250" y="180" fill="#94a3b8" font-size="13" text-anchor="middle" font-weight="bold">CONFERENCE TABLE</text>

      <!-- Head Seats: Top row facing bottom -->
      <!-- 1st Rank (Center) -->
      <g transform="translate(210, 75)">
        <rect width="80" height="50" rx="8" fill="#581c87" stroke="#f59e0b" stroke-width="2.5"/>
        <text x="40" y="20" fill="#fbbf24" font-size="10" text-anchor="middle" font-weight="bold">👑 1위 주빈</text>
        <text x="40" y="38" fill="#ffffff" font-size="11" text-anchor="middle" font-weight="bold">${truncate(vips[0]?.name || "주빈", 6)}</text>
      </g>

      <!-- 2nd Rank (Right of 1st from his perspective = viewer's right) -->
      <g transform="translate(305, 75)">
        <rect width="80" height="50" rx="8" fill="#312e81" stroke="#818cf8" stroke-width="1.5"/>
        <text x="40" y="20" fill="#a5b4fc" font-size="10" text-anchor="middle" font-weight="bold">#2위</text>
        <text x="40" y="38" fill="#ffffff" font-size="11" text-anchor="middle">${truncate(vips[1]?.name || "2위", 6)}</text>
      </g>

      <!-- 3rd Rank (Left of 1st) -->
      <g transform="translate(115, 75)">
        <rect width="80" height="50" rx="8" fill="#312e81" stroke="#818cf8" stroke-width="1.5"/>
        <text x="40" y="20" fill="#a5b4fc" font-size="10" text-anchor="middle" font-weight="bold">#3위</text>
        <text x="40" y="38" fill="#ffffff" font-size="11" text-anchor="middle">${truncate(vips[2]?.name || "3위", 6)}</text>
      </g>

      <!-- Bottom Row Seats -->
      <g transform="translate(210, 225)">
        <rect width="80" height="50" rx="8" fill="#1e293b" stroke="#64748b" stroke-width="1"/>
        <text x="40" y="20" fill="#cbd5e1" font-size="10" text-anchor="middle">#4위</text>
        <text x="40" y="38" fill="#ffffff" font-size="11" text-anchor="middle">${truncate(vips[3]?.name || "4위", 6)}</text>
      </g>

      <text x="250" y="315" fill="#64748b" font-size="11" text-anchor="middle">▼ 출입문 (가장 먼 중앙이 상석)</text>
    `;
  }

  function drawPhoto() {
    const total = vips.length;
    // Calculate slots for single line photo stage
    const slotW = 75;
    const startX = 250 - (total * slotW) / 2;

    // Pattern: Center is #1. Then #2 right, #3 left, #4 right, #5 left...
    let orderedIndices = [];
    orderedIndices.push(0); // #1
    for (let i = 1; i < total; i++) {
      if (i % 2 === 1) orderedIndices.push(i); // right
      else orderedIndices.unshift(i); // left
    }

    let rects = orderedIndices.map((vipIdx, slotIdx) => {
      const v = vips[vipIdx];
      const isTop = vipIdx === 0;
      const x = startX + slotIdx * slotW;
      const y = 140;

      return `
        <g transform="translate(${x}, ${y})">
          <circle cx="32" cy="15" r="14" fill="${isTop ? '#f59e0b' : '#6366f1'}"/>
          <rect x="2" y="35" width="60" height="65" rx="6" fill="${isTop ? '#4c1d95' : '#1e293b'}" stroke="${isTop ? '#f59e0b' : '#64748b'}" stroke-width="${isTop ? '2' : '1'}"/>
          <text x="32" y="55" fill="${isTop ? '#fbbf24' : '#a5b4fc'}" font-size="10" text-anchor="middle" font-weight="bold">#${vipIdx + 1}</text>
          <text x="32" y="78" fill="#ffffff" font-size="10" text-anchor="middle" font-weight="bold">${truncate(v.name, 5)}</text>
        </g>
      `;
    }).join('');

    diagramSvg.innerHTML = `
      <rect x="15" y="20" width="470" height="320" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>
      <text x="250" y="50" fill="#cbd5e1" font-size="14" text-anchor="middle" font-weight="bold">기념촬영 단상 (VIP Photo Lineup)</text>
      <text x="250" y="70" fill="#64748b" font-size="11" text-anchor="middle">중앙 주빈 기준 우측(2위) / 좌측(3위) 교차</text>

      ${rects}

      <!-- Photographer Camera -->
      <g transform="translate(230, 275)">
        <rect x="0" y="5" width="40" height="25" rx="4" fill="#475569"/>
        <circle cx="20" cy="17" r="7" fill="#0f172a" stroke="#94a3b8" stroke-width="2"/>
        <text x="20" y="42" fill="#94a3b8" font-size="9" text-anchor="middle">촬영 카메라</text>
      </g>
    `;
  }

  function truncate(str, max) {
    if (!str) return "";
    return str.length > max ? str.slice(0, max) + '..' : str;
  }

  exportSvgBtn.addEventListener('click', () => {
    const svgData = new XMLSerializer().serializeToString(diagramSvg);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `protocol_seating_${currentScene}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  });

  renderVipInputs();
  draw();
});
