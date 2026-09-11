// rankmind.js - Military Rank Mindset Simulator
document.addEventListener('DOMContentLoaded', () => {
  const rankBtns = document.querySelectorAll('.rank-btn');
  const rankAvatar = document.getElementById('rankAvatar');
  const rankTitle = document.getElementById('rankTitle');
  const rankBadge = document.getElementById('rankBadge');
  const rankCatchphrase = document.getElementById('rankCatchphrase');
  const rankDesc = document.getElementById('rankDesc');
  const statStrict = document.getElementById('statStrict');
  const statSavvy = document.getElementById('statSavvy');
  const statFreedom = document.getElementById('statFreedom');
  const barStrict = document.getElementById('barStrict');
  const barSavvy = document.getElementById('barSavvy');
  const barFreedom = document.getElementById('barFreedom');

  const rankData = {
    private: {
      avatar: "😳",
      title: "이등병 (Private)",
      badge: "긴장도 100%",
      catchphrase: '"이병! 홍! 길! 동! 잘못 들었습니다?!"',
      desc: "숨 쉬는 것조차 선임의 눈치를 봄. 취침 시간 전까지 등받이에 등을 대지 못함. 시계가 멈춘 것 같은 영겁의 시간.",
      strict: 100, savvy: 5, freedom: 2
    },
    corporal1: {
      avatar: "😮‍💨",
      title: "일등병 (Private First Class)",
      badge: "피로도 95%",
      catchphrase: '"제가 하겠습니다! 후임들아 내 뒤로 모여라."',
      desc: "중대의 모든 실무 작업(제초, 제설, 창고정리)을 도맡아 하는 엔진. 몸은 가장 힘들지만 군 생활의 감을 완벽히 터득함.",
      strict: 75, savvy: 50, freedom: 25
    },
    corporal2: {
      avatar: "😎",
      title: "상등병 (Corporal)",
      badge: "전투력 Max",
      catchphrase: '"야, 밑에 애들 관리 똑바로 안 하냐? PX나 가자."',
      desc: "중대의 실세이자 전성기. 일을 가장 능숙하게 처리하며 선임 눈치도 안 보고 후임들을 호령하는 군 생활의 황금기.",
      strict: 40, savvy: 85, freedom: 70
    },
    sergeant: {
      avatar: "😴",
      title: "병장 (Sergeant)",
      badge: "신선 모드",
      catchphrase: '"아.. 오늘 점호 열외 아니었냐? 건드리지 마라."',
      desc: "침상과 한 몸이 되어 숨만 쉼. 떨어지는 낙엽도 피하며 오직 전역날 달력만 쳐다보는 해탈의 경지.",
      strict: 5, savvy: 99, freedom: 98
    },
    nco: {
      avatar: "💸",
      title: "전문하사 (Staff Sergeant Temptation)",
      badge: "영혼 계약",
      catchphrase: '"중대장님이 6개월만 더 하면 월급 250 준다는데..."',
      desc: "통장 잔고와 취업 현실의 공포에 굴복해 하사 계급장을 달아버린 비운의 영혼. 간부 숙소에서 맥주 마시며 후회 중.",
      strict: 50, savvy: 70, freedom: 60
    }
  };

  rankBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      rankBtns.forEach(b => {
        b.className = "rank-btn p-3 rounded-xl border border-slate-700 bg-slate-800 text-slate-400 hover:text-white text-xs font-bold transition flex flex-col items-center gap-1";
      });
      btn.className = "rank-btn p-3 rounded-xl border border-green-500 bg-green-600/20 text-green-300 text-xs font-bold transition flex flex-col items-center gap-1";

      const key = btn.getAttribute('data-rank');
      const data = rankData[key];

      rankAvatar.textContent = data.avatar;
      rankTitle.textContent = data.title;
      rankBadge.textContent = data.badge;
      rankCatchphrase.textContent = data.catchphrase;
      rankDesc.textContent = data.desc;

      statStrict.textContent = `${data.strict}%`;
      statSavvy.textContent = `${data.savvy}%`;
      statFreedom.textContent = `${data.freedom}%`;

      barStrict.style.width = `${data.strict}%`;
      barSavvy.style.width = `${data.savvy}%`;
      barFreedom.style.width = `${data.freedom}%`;
    });
  });
});
