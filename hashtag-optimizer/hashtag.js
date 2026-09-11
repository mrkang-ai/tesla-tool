// hashtag.js - Instagram Hashtag Optimizer
document.addEventListener('DOMContentLoaded', () => {
  const nicheCategory = document.getElementById('nicheCategory');
  const subKeyword = document.getElementById('subKeyword');
  const optimizeBtn = document.getElementById('optimizeBtn');
  const copyTagsBtn = document.getElementById('copyTagsBtn');
  const tagsList = document.getElementById('tagsList');

  const DB = {
    cafe: {
      mega: ["#카페스타그램", "#디저트그램", "#커피타임"],
      mid: ["#신상카페투어", "#핸드드립커피", "#성수동카페", "#주말카페", "#카페인충전"],
      niche: ["#필터커피맛집", "#골목카페", "#로스터리카페추천", "#조용한카페찾기"]
    },
    fashion: {
      mega: ["#오오티디", "#데일리룩", "#패션스타그램"],
      mid: ["#출근룩코디", "#미니멀룩", "#스트릿패션", "#오늘의코디", "#봄코디추천"],
      niche: ["#체형커버코디", "#모던클래식룩", "#무채색코디", "#20대남자코디"]
    },
    fitness: {
      mega: ["#오운완", "#헬스타그램", "#운동하는직장인"],
      mid: ["#득근득근", "#바디체크", "#웨이트트레이닝", "#하체운동", "#헬스루틴"],
      niche: ["#아침공복유산소", "#3대운동기록", "#단백질식단공유", "#직장인헬스러"]
    },
    travel: {
      mega: ["#여행스타그램", "#국내여행지추천", "#주말나들이"],
      mid: ["#감성숙소추천", "#힐링여행지", "#드라이브코스", "#가족여행추천", "#인생샷스팟"],
      niche: ["#숨은명소찾기", "#한옥숙소스테이", "#뚜벅이여행코스", "#숲속감성스테이"]
    },
    dev: {
      mega: ["#개발자그램", "#코딩스타그램", "#직장인스타그램"],
      mid: ["#개발자일상", "#데스크셋업", "#맥북프로", "#스타트업라이프", "#재택근무일기"],
      niche: ["#프론트엔드개발자", "#클린코드작성", "#사이드프로젝트기록", "#개발자책상"]
    }
  };

  function render() {
    const cat = nicheCategory.value;
    const data = DB[cat];

    const all = [...data.mega, ...data.mid, ...data.niche];

    tagsList.innerHTML = all.map((t, idx) => {
      let badge = "대형";
      let color = "bg-rose-500/20 text-rose-300 border-rose-500/30";
      if (idx >= 3 && idx < 8) {
        badge = "중형";
        color = "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      } else if (idx >= 8) {
        badge = "틈새";
        color = "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      }

      return `
        <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200">
          <span class="font-bold">${t}</span>
          <span class="text-[9px] px-1.5 py-0.2 rounded border ${color}">${badge}</span>
        </span>
      `;
    }).join('');
  }

  optimizeBtn.addEventListener('click', render);
  nicheCategory.addEventListener('change', render);

  copyTagsBtn.addEventListener('click', () => {
    const cat = nicheCategory.value;
    const data = DB[cat];
    const str = [...data.mega, ...data.mid, ...data.niche].join(' ');
    navigator.clipboard.writeText(str).then(() => {
      copyTagsBtn.textContent = "복사 완료!";
      setTimeout(() => copyTagsBtn.textContent = "해시태그 12종 일괄 복사", 2000);
    });
  });

  render();
});
