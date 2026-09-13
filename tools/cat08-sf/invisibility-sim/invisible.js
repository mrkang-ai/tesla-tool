// Invisibility Cloak Toggle
document.addEventListener('DOMContentLoaded', () => {
  let isCloaked = false;
  const btn = document.getElementById('toggleCloakBtn');
  const icon = document.getElementById('cloakingField');
  const status = document.getElementById('cloakStatus');
  const desc = document.getElementById('cloakDesc');
  const dot = document.getElementById('statusDot');

  btn.addEventListener('click', () => {
    isCloaked = !isCloaked;
    if (isCloaked) {
      icon.style.opacity = '0.05';
      icon.style.filter = 'blur(10px)';
      status.innerText = "✨ 완전 투명화 활성화 (투명인간) ✨";
      status.className = "text-2xl font-black text-cyan-400 mb-2";
      desc.innerText = "축하합니다! 이제 누구도 당신을 찾지 못하며, 출근길에도 투명하게 걸어 다닐 수 있습니다. (※물리적 충돌 주의)";
      dot.className = "w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee]";
      btn.innerText = "투명화 해제 (현실로 복귀)";
      btn.classList.replace('bg-cyan-600', 'bg-slate-700');
      btn.classList.replace('text-slate-950', 'text-white');
    } else {
      icon.style.opacity = '1';
      icon.style.filter = 'none';
      status.innerText = "투명화 모드 OFF (보통 인간)";
      status.className = "text-2xl font-black text-slate-300 mb-2";
      desc.innerText = "지금은 모든 사람이 당신을 볼 수 있으며, 부장님의 눈빛을 피할 수 없습니다.";
      dot.className = "w-4 h-4 rounded-full bg-slate-600";
      btn.innerText = "투명화 망토 켜기 (INVISIBILITY ON)";
      btn.classList.replace('bg-slate-700', 'bg-cyan-600');
      btn.classList.replace('text-white', 'text-slate-950');
    }
  });
});
