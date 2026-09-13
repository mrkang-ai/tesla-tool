// apology.js - Influencer Apology Generator
document.addEventListener('DOMContentLoaded', () => {
  const creatorName = document.getElementById('creatorName');
  const incidentType = document.getElementById('incidentType');
  const apologyBody = document.getElementById('apologyBody');
  const copyApologyBtn = document.getElementById('copyApologyBtn');

  function generate() {
    const name = creatorName.value.trim() || "크리에이터";
    const incident = incidentType.value.trim() || "불미스러운 사안";

    const text = `안녕하십니까, ${name}입니다.

먼저 저를 믿고 응원해 주셨던 많은 구독자분들과 팬분들께 머리 숙여 진심으로 사죄의 말씀을 올립니다.

최근 불거진 [${incident}]과 관련하여 저의 미숙하고 안일했던 대처로 인해 큰 실망과 상처를 안겨드렸습니다. 어떠한 변명의 여지도 없으며, 모든 것은 온전히 저의 부족함과 불찰에서 비롯된 일입니다.

처음 사건을 접했을 당시, 두려운 마음에 상황을 회피하고자 했던 제 자신이 너무나도 부끄럽고 후회스럽습니다. 여러분께서 보내주신 따끔한 질책과 비판을 겸허히 수용하며 뼈저리게 반성하고 있습니다.

피해를 입으신 모든 분들께 직접 찾아뵙고 사과를 드리며 할 수 있는 모든 책임을 다하겠습니다. 또한 향후 예정되어 있던 모든 활동을 전면 중단하고 자숙의 시간을 갖도록 하겠습니다.

다시 한번 고개 숙여 깊이 사과드립니다.

${name} 배상`;

    apologyBody.textContent = text;
  }

  creatorName.addEventListener('input', generate);
  incidentType.addEventListener('input', generate);

  copyApologyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(apologyBody.textContent).then(() => {
      copyApologyBtn.textContent = "복사됨!";
      setTimeout(() => copyApologyBtn.textContent = "사과문 복사", 2000);
    });
  });

  generate();
});
