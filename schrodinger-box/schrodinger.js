// Schrödinger's Cat Quantum Collapse
document.addEventListener('DOMContentLoaded', () => {
  let isOpened = false;
  const btn = document.getElementById('openBoxBtn');
  const box = document.getElementById('boxVisual');
  const state = document.getElementById('catState');
  const desc = document.getElementById('catDesc');

  btn.addEventListener('click', () => {
    if (!isOpened) {
      isOpened = true;
      const isAlive = Math.random() > 0.5;
      if (isAlive) {
        box.innerText = "😺";
        state.innerText = "🎉 축하합니다! 고양이가 살아서 골골송을 부릅니다!";
        state.className = "text-2xl font-black text-emerald-400 mb-2";
        desc.innerText = "원자가 붕괴하지 않아 독가스 밸브가 열리지 않았습니다. 파동함수가 '생존' 상태로 수렴했습니다.";
      } else {
        box.innerText = "👻";
        state.innerText = "💀 안타깝습니다! 고양이가 유령이 되었습니다...";
        state.className = "text-2xl font-black text-rose-400 mb-2";
        desc.innerText = "방사성 붕괴가 발생했습니다. 파동함수가 '소멸' 상태로 수렴했습니다.";
      }
      btn.innerText = "상자 다시 닫기 (새로운 중첩 생성)";
    } else {
      isOpened = false;
      box.innerText = "📦";
      state.innerText = "상태: 양자 중첩 (살아있음 + 죽어있음)";
      state.className = "text-2xl font-black text-indigo-300 mb-2";
      desc.innerText = "상자 안의 방사성 원소가 붕괴했는지 여부는 관측되기 전까지 확정되지 않습니다.";
      btn.innerText = "상자 열어서 관측하기 (관측자 효과)";
    }
  });
});
