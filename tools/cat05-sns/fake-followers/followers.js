// followers.js - Fake 1M Follower Simulator
document.addEventListener('DOMContentLoaded', () => {
  const toggleStormBtn = document.getElementById('toggleStormBtn');
  const followerCount = document.getElementById('followerCount');
  const likeCount = document.getElementById('likeCount');
  const streamList = document.getElementById('streamList');

  let isStorming = false;
  let intervalId = null;

  let followers = 1024800;
  let likes = 8940210;

  const users = ["jenniekim", "elon_musk", "mrbeast", "taylorswift", "bts_official", "zendaya", "ronaldo", "leomessi"];
  const comments = [
    "OMG visual is insane 🔥🔥🔥",
    "진짜 폼 미쳤다 ㄷㄷㄷㄷ",
    "How can someone be this pretty??",
    "다음 콘텐츠 언제 올라와요 현기증 남 ㅠㅠ",
    "Queen / King behavior 👑",
    "Love from New York 🗽❤️"
  ];

  function playPop() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch(e) {}
  }

  function addNotification() {
    followers += Math.floor(Math.random() * 5) + 1;
    likes += Math.floor(Math.random() * 20) + 5;

    followerCount.textContent = followers.toLocaleString();
    likeCount.textContent = likes.toLocaleString();

    const u = users[Math.floor(Math.random() * users.length)];
    const isComment = Math.random() > 0.5;
    const msg = isComment ? comments[Math.floor(Math.random() * comments.length)] : "회원님의 사진을 좋아합니다. ❤️";

    const item = document.createElement('div');
    item.className = "p-2.5 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-between text-sm animate-slide-in";
    item.innerHTML = `
      <div class="flex items-center gap-2">
        <div class="w-7 h-7 rounded-full bg-pink-600 flex items-center justify-center font-bold text-sm text-white">
          ${u[0].toUpperCase()}
        </div>
        <div>
          <span class="font-bold text-white">@${u}</span>
          <span class="text-slate-300 ml-1">${msg}</span>
        </div>
      </div>
      <span class="text-sm text-slate-500">방금 전</span>
    `;

    streamList.appendChild(item);
    if (streamList.children.length > 10) {
      streamList.removeChild(streamList.firstChild);
    }

    playPop();
  }

  toggleStormBtn.addEventListener('click', () => {
    isStorming = !isStorming;
    if (isStorming) {
      toggleStormBtn.textContent = "도파민 폭풍 중지 STOP";
      toggleStormBtn.className = "px-5 py-2.5 bg-slate-700 text-white font-bold text-sm rounded-xl";
      intervalId = setInterval(addNotification, 180);
    } else {
      toggleStormBtn.textContent = "도파민 폭풍 가동 START";
      toggleStormBtn.className = "px-5 py-2.5 bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white font-black text-sm rounded-xl shadow-lg";
      clearInterval(intervalId);
    }
  });
});
