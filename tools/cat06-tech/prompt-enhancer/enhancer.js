// enhancer.js - Prompt Enhancer
document.addEventListener('DOMContentLoaded', () => {
  const simpleIn = document.getElementById('simpleIn');
  const personaType = document.getElementById('personaType');
  const enhanceBtn = document.getElementById('enhanceBtn');
  const copyPromptBtn = document.getElementById('copyPromptBtn');
  const enhancedOut = document.getElementById('enhancedOut');

  function enhance() {
    const raw = simpleIn.value.trim() || "좋은 글 쓰는 법 알려줘";
    const p = personaType.value;

    let role = "세계 최고의 시니어 소프트웨어 아키텍트이자 기술 멘토";
    if (p === 'marketing') role = "포브스 선정 글로벌 탑티어 그로스 해킹 & 퍼포먼스 마케팅 디렉터";
    if (p === 'academic') role = "해당 분야를 선도하는 옥스퍼드/하버드 연구소의 수석 연구위원";

    const prompt = `[시스템 지시: 전문가 페르소나 지정]
당신은 ${role}입니다. 단순한 지식 나열을 넘어 실무에서 검증된 심층적인 인사이트와 실행 가능한 가이드를 제공해야 합니다.

[작업 목표]
"${raw}"에 대해 심도 있는 솔루션을 도출하십시오.

[작동 규약 및 제약 조건]
1. 사고의 사슬(Chain-of-Thought): 결론을 내리기 전 단계별 분석 논리를 먼저 전개할 것.
2. 구체적 예시: 추상적 설명 대신 실제 적용 가능한 코드/데이터/시나리오 예시를 포함할 것.
3. 잠재적 위험 및 엣지 케이스: 발생 가능한 함정(Gotcha) 및 성능 저하 요인을 사전에 짚어줄 것.
4. 요약 및 액션 아이템: 독자가 즉시 실행할 수 있는 체크리스트 3가지를 마지막에 제시할 것.

답변을 작성할 준비가 되면, 군더더기 없이 본론부터 체계적인 마크다운 포맷으로 전개해 주십시오.`;

    enhancedOut.textContent = prompt;
  }

  enhanceBtn.addEventListener('click', enhance);

  copyPromptBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(enhancedOut.textContent);
    copyPromptBtn.textContent = "복사됨!";
    setTimeout(() => copyPromptBtn.textContent = "복사", 2000);
  });

  simpleIn.value = "파이썬으로 웹 크롤러 제작하는 법";
  enhance();
});
