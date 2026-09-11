// Korean Age & Zodiac Calculator
document.addEventListener('DOMContentLoaded', () => {
  const birthInput = document.getElementById('birthDate');
  const manAgeEl = document.getElementById('resManAge');
  const zodiacEl = document.getElementById('resZodiac');
  const constellEl = document.getElementById('resConstell');
  const livedDaysEl = document.getElementById('resLivedDays');

  const animals = ["원숭이띠", "닭띠", "개띠", "돼지띠", "쥐띠", "소띠", "호랑이띠", "토끼띠", "용띠", "뱀띠", "말띠", "양띠"];

  function update() {
    const bDate = new Date(birthInput.value);
    const now = new Date();
    if (isNaN(bDate.getTime())) return;

    // Legal Man-Age
    let age = now.getFullYear() - bDate.getFullYear();
    const m = now.getMonth() - bDate.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < bDate.getDate())) {
      age--;
    }
    manAgeEl.innerText = `만 ${age}세`;

    // Zodiac
    const year = bDate.getFullYear();
    zodiacEl.innerText = animals[year % 12];

    // Constellation
    const month = bDate.getMonth() + 1;
    const day = bDate.getDate();
    constellEl.innerText = getConstellation(month, day);

    // Lived Days
    const diff = now - bDate;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    livedDaysEl.innerText = `${days.toLocaleString()}일`;
  }

  function getConstellation(m, d) {
    if ((m==1 && d>=20) || (m==2 && d<=18)) return "물병자리";
    if ((m==2 && d>=19) || (m==3 && d<=20)) return "물고기자리";
    if ((m==3 && d>=21) || (m==4 && d<=19)) return "양자리";
    if ((m==4 && d>=20) || (m==5 && d<=20)) return "황소자리";
    if ((m==5 && d>=21) || (m==6 && d<=21)) return "쌍둥이자리";
    if ((m==6 && d>=22) || (m==7 && d<=22)) return "게자리";
    if ((m==7 && d>=23) || (m==8 && d<=22)) return "사자자리";
    if ((m==8 && d>=23) || (m==9 && d<=22)) return "처녀자리";
    if ((m==9 && d>=23) || (m==10 && d<=22)) return "천칭자리";
    if ((m==10 && d>=23) || (m==11 && d<=22)) return "전갈자리";
    if ((m==11 && d>=23) || (m==12 && d<=21)) return "사수자리";
    return "염소자리";
  }

  birthInput.addEventListener('change', update);
  update();
});
