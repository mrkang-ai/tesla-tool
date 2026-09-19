// evasion.js - Congressional Hearing Evasion Generator
document.addEventListener('DOMContentLoaded', () => {
  const questionInput = document.getElementById('questionInput');
  const presetQBtn = document.getElementById('presetQBtn');
  const stratBtns = document.querySelectorAll('.strat-btn');
  const evadeBtn = document.getElementById('evadeBtn');
  const evasionText = document.getElementById('evasionText');
  const copyAnswerBtn = document.getElementById('copyAnswerBtn');
  const gavelBtn = document.getElementById('gavelBtn');

  let currentStrat = 'investigation';

  const presets = [
    "증인! 2024년도 특별활동비 5억 원을 영수증 없이 집행한 의혹에 대해 국민 앞에 소명하십시오!",
    "작년 11월 4일 대외비 문건이 언론에 유출되기 직전, 특정 언론사 기자와 통화하신 사실이 있습니까, 없습니까?!",
    "부서 산하 공공기관 채용 과정에서 장관님 친인척이 단독 서류 합격한 배경이 무엇입니까?",
    "예산 불용액 30억을 막판에 토너와 사무용품으로 전액 털어버린 관행, 부끄럽지 않습니까?"
  ];

  let qIdx = 0;
  presetQBtn.addEventListener('click', () => {
    qIdx = (qIdx + 1) % presets.length;
    questionInput.value = presets[qIdx];
  });

  stratBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      stratBtns.forEach(b => {
        b.className = "strat-btn p-3 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-400 hover:text-slate-200 text-sm font-bold transition flex flex-col items-center gap-1.5";
      });
      btn.className = "strat-btn p-3 rounded-xl border border-rose-500 bg-rose-500/20 text-rose-300 text-sm font-bold transition flex flex-col items-center gap-1.5";
      currentStrat = btn.getAttribute('data-strat');
      generateAnswer();
    });
  });

  // Sound generator for gavel using Web Audio API
  function playGavel() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();

      const strikeTimes = [0, 0.4, 0.8];
      strikeTimes.forEach(t => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, ctx.currentTime + t);
        osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + t + 0.15);

        gain.gain.setValueAtTime(1.0, ctx.currentTime + t);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + t);
        osc.stop(ctx.currentTime + t + 0.35);
      });
    } catch (e) {
      console.log("Audio not allowed yet:", e);
    }
  }

  gavelBtn.addEventListener('click', playGavel);

  function generateAnswer() {
    const q = questionInput.value.trim();

    let ans = "";
    if (currentStrat === 'investigation') {
      ans = `존경하는 의원님의 질의에 엄중한 마음으로 답변드리겠습니다.

현재 해당 사안에 대해서는 수사기관의 엄정한 사실 확인 및 조사가 진행 중에 있습니다.
피의사실 공표 금지 및 재판의 공정성 원칙상, 제가 이 자리에서 예단을 불러일으킬 수 있는 구체적 언급을 하는 것은 적절치 못함을 혜량하여 주시기 바랍니다.

결코 사적인 의도나 위법 행위는 없었으며, 수사 결과가 나오는 대로 투명하게 설명해 올리겠습니다.`;
    } else if (currentStrat === 'amnesia') {
      ans = `의원님께서 지적하신 날짜가 이미 수년 전의 일이라, 저로서도 당시의 구체적인 통화 경위나 오찬 참석 여부에 대해 현재 정확히 기억이 나지 않는 실정입니다.

하지만 제가 공직 생활 30년을 걸고 말씀드리건대, 국가와 국민의 공익을 훼손하거나 절차를 어기며 사익을 편취한 기억은 단연코 없습니다.

다시 한번 꼼꼼히 당시 일정표와 비서실 기록을 대조 확인해 보겠습니다.`;
    } else if (currentStrat === 'written') {
      ans = `의원님께서 지적해주신 통계 수치와 예산 항목의 세부 데이터는 대단히 엄밀한 팩트 체크가 필요한 전문 영역입니다.

제가 지금 불완전한 구두 답변으로 혼선을 드리기보다는, 산하 부서의 정밀 회계 감사 전표를 취합하여 금일 중으로 의원실에 상세한 설명 자료를 첨부한 '서면 보고'로 대신할 수 있도록 너른 양해를 부탁드립니다.`;
    } else {
      // Review
      ans = `의원님의 깊이 있는 문제의식과 지적의 취지에 전적으로 공감합니다.

지적해 주신 사안은 단순한 일회성 시정으로 끝날 문제가 아니며, 유관 부처 및 민간 전문가 자문위원들과 긴밀한 협의를 거쳐 제도 전반의 근본적 패러다임 개선을 위한 '종합 검토'에 즉각 착수하도록 하겠습니다.`;
    }

    evasionText.textContent = ans;
  }

  evadeBtn.addEventListener('click', () => {
    generateAnswer();
    playGavel();
  });

  copyAnswerBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(evasionText.textContent).then(() => {
      copyAnswerBtn.innerHTML = '<i class="fa-solid fa-check text-green-400 mr-1"></i> 복사됨!';
      setTimeout(() => copyAnswerBtn.innerHTML = '<i class="fa-regular fa-copy mr-1"></i> 답변 복사', 2000);
    });
  });

  generateAnswer();
});
