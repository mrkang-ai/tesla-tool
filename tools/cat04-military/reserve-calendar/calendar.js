// calendar.js - Reserve 40yo Exemption Timeline
document.addEventListener('DOMContentLoaded', () => {
  const birthYear = document.getElementById('birthYear');
  const dischargeYear = document.getElementById('dischargeYear');
  const timelineContainer = document.getElementById('timelineContainer');

  function render() {
    const bYear = parseInt(birthYear.value, 10) || 1998;
    const dYear = parseInt(dischargeYear.value, 10) || 2020;
    const nowYear = new Date().getFullYear();

    const endReserveYear = dYear + 8; // 8 years reserve
    const endCivilYear = bYear + 40;  // 40 years old civil defense complete

    const steps = [
      {
        title: "1~4년차: 동원훈련 / 동미참",
        years: `${dYear + 1}년 ~ ${dYear + 4}년`,
        desc: "2박 3일 입영 훈련 또는 출퇴근 32시간 (전투복 & 군화 필수)",
        status: nowYear > dYear + 4 ? "완료 ✅" : "진행 중 🔥",
        color: nowYear > dYear + 4 ? "border-slate-700 bg-slate-900/60 text-slate-400" : "border-emerald-500 bg-emerald-950/30 text-emerald-300"
      },
      {
        title: "5~6년차: 기본훈련 & 전후반기 작계",
        years: `${dYear + 5}년 ~ ${dYear + 6}년`,
        desc: "기본훈련 8시간 + 동네 뒷산 작계훈련 12시간 (동원 해제)",
        status: nowYear > dYear + 6 ? "완료 ✅" : "대기/진행 중",
        color: nowYear > dYear + 6 ? "border-slate-700 bg-slate-900/60 text-slate-400" : "border-blue-500 bg-blue-950/30 text-blue-300"
      },
      {
        title: "7~8년차: 예비군 편성 대기",
        years: `${dYear + 7}년 ~ ${dYear + 8}년`,
        desc: "훈련 시간 0시간! 예비군 소집 점검만 받는 사실상의 꿀휴식기",
        status: nowYear > dYear + 8 ? "완료 ✅" : "대기",
        color: "border-slate-700 bg-slate-900/60 text-slate-300"
      },
      {
        title: "민방위 편입: 사이버 교육",
        years: `${endReserveYear + 1}년 ~ ${endCivilYear}년`,
        desc: "스마트폰으로 동영상 시청 및 객관식 퀴즈 풀면 1시간 만에 끝",
        status: nowYear >= endCivilYear ? "완료 ✅" : "진행 예정",
        color: "border-yellow-500/50 bg-slate-900/60 text-yellow-300"
      },
      {
        title: "👑 만 40세 12월 31일: 대한민국 국방 의무 완전 졸업!",
        years: `${endCivilYear}년 12월 31일`,
        desc: "군번도, 소집도 영원히 끝! 진정한 자유인으로 거듭나는 날.",
        status: nowYear >= endCivilYear ? "자유인 🎉" : `D-${endCivilYear - nowYear}년`,
        color: "border-emerald-500 bg-emerald-900/40 text-emerald-200 font-bold"
      }
    ];

    timelineContainer.innerHTML = steps.map(s => `
      <div class="p-4 rounded-xl border ${s.color} flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-sm">
        <div>
          <span class="font-bold text-sm block">${s.title}</span>
          <span class="text-sm text-slate-400 font-mono">${s.years}</span>
          <p class="text-slate-300 mt-1">${s.desc}</p>
        </div>
        <span class="px-3 py-1 rounded-full bg-slate-800 text-sm font-mono font-bold self-end sm:self-auto border border-slate-700">
          ${s.status}
        </span>
      </div>
    `).join('');
  }

  birthYear.addEventListener('input', render);
  dischargeYear.addEventListener('input', render);

  render();
});
