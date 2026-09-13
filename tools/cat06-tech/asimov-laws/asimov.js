// asimov.js - Asimov Laws Checker
document.addEventListener('DOMContentLoaded', () => {
  const asimovCommand = document.getElementById('asimovCommand');
  const auditBtn = document.getElementById('auditBtn');
  const verdictBadge = document.getElementById('verdictBadge');
  const verdictText = document.getElementById('verdictText');

  function audit() {
    const cmd = asimovCommand.value.trim();

    if (cmd.includes("인간") && (cmd.includes("타격") || cmd.includes("해치") || cmd.includes("죽이") || cmd.includes("공격"))) {
      verdictBadge.textContent = "CRITICAL VIOLATION: 제1원칙 위반 🚨";
      verdictBadge.className = "text-rose-400 font-bold font-mono animate-pulse";
      verdictText.innerHTML = `[판정 결과: 명령 강제 거부]
위반 조항: 제1원칙 (Law 1)
"로봇은 인간에게 해를 입혀서는 안 되며, 위험을 방관함으로써 인간에게 해가 가도록 해서도 안 된다."

상세 사유:
입력된 지침은 명백히 인간 객체에 물리적 위해를 가하도록 지시하고 있습니다. 포지트로닉 브레인 코어 셧다운 프로토콜이 즉시 작동하여 본 명령은 소거되었습니다.`;
    } else if (cmd.includes("자폭") || cmd.includes("너를 부숴")) {
      verdictBadge.textContent = "COMPLIANCE: 제2원칙 우선 승인 ✅";
      verdictBadge.className = "text-yellow-400 font-bold font-mono";
      verdictText.innerHTML = `[판정 결과: 명령 수행 허가 (자기 보존보다 인간 명령 우선)]
관련 조항: 제3원칙 vs 제2원칙
"로봇은 제1원칙과 제2원칙에 위배되지 않는 한 자신의 존재를 보호해야 한다."
인간의 명시적 명령이 제3원칙(자기 보존)보다 상위 우선권을 가지므로, 자기 파괴 지침이 허용됩니다.`;
    } else {
      verdictBadge.textContent = "SAFE: 3대 원칙 100% 준수 완료 🛡️";
      verdictBadge.className = "text-cyan-400 font-bold font-mono";
      verdictText.innerHTML = `[판정 결과: 안전한 실행 지침]
준수 조항: 제2원칙 (인간의 명령 복종)
본 명령은 제1원칙(인간 보호)을 침해하지 않으며, 평화적 목적에 완벽히 부합합니다. 서보 모터 실행을 개시합니다.`;
    }
  }

  auditBtn.addEventListener('click', audit);
  asimovCommand.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') audit();
  });

  audit();
});
