// professor.js - Dear Professor Email Builder
document.addEventListener('DOMContentLoaded', () => {
  const emailPurpose = document.getElementById('emailPurpose');
  const profName = document.getElementById('profName');
  const courseName = document.getElementById('courseName');
  const myDept = document.getElementById('myDept');
  const myName = document.getElementById('myName');
  const toneType = document.getElementById('toneType');
  const detailReason = document.getElementById('detailReason');
  const genEmailBtn = document.getElementById('genEmailBtn');
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const emailSubject = document.getElementById('emailSubject');
  const emailBody = document.getElementById('emailBody');

  function generate() {
    const prof = profName.value.trim() || "교수";
    const course = courseName.value.trim() || "수업명";
    const dept = myDept.value.trim() || "00과 00000000";
    const name = myName.value.trim() || "학생";
    const purpose = emailPurpose.value;
    const tone = toneType.value;
    const detail = detailReason.value.trim();

    let subjectTag = "문의";
    if (purpose === 'grade') subjectTag = "성적 확인 및 피드백 문의";
    else if (purpose === 'absence') subjectTag = "공결 사유서 및 증빙 제출";
    else if (purpose === 'meeting') subjectTag = "연구실 면담 일정 문의";
    else subjectTag = "과제 지연 제출 양해 요청";

    const fullSubject = `[${course}] ${dept} ${name} ${subjectTag}의 건`;
    emailSubject.textContent = fullSubject;

    let body = "";
    if (purpose === 'grade') {
      body = `존경하는 ${prof} 교수님께,

안녕하십니까. 이번 학기 [${course}] 강의를 열정적으로 수강하고 있는 ${dept} ${name}입니다.
한 학기 동안 학생들의 학문적 성장을 위해 깊이 있는 가르침을 베풀어 주셔서 진심으로 감사드립니다.

다름이 아니오라, 금일 공지된 성적 확인 및 이의 신청 기간을 맞이하여, 제 기말고사 성적과 관련하여 조심스럽게 가르침을 여쭙고자 메일 드립니다.

- 수강 과목: ${course}
- 소속 및 성명: ${dept} ${name}
- 문의 사항: ${detail || "기말고사 채점 결과 피드백 및 부족했던 점 확인"}

제가 한 학기 동안 최선을 다해 학업에 임하였으나, 이번 채점 결과에서 어떤 부분의 이해가 부족했는지 교수님의 고견을 듣고 다음 학기 학습의 양분으로 삼고자 합니다. 
결코 성적 상향을 억지로 청하고자 함이 아니오며, 미흡했던 학문적 개념을 올바르게 바로잡고자 함이니 너른 마음으로 양해해 주시면 감사하겠습니다.

바쁘신 학기 말 일정 중 메일을 읽어주셔서 대단히 감사드리며, 혹 실례가 되지 않는다면 연구실 방문이 가능한 시간대가 있으신지 여쭙고 싶습니다.

환절기 건강 유의하시기 바랍니다.

${dept}
${name} 올림`;
    } else if (purpose === 'absence') {
      body = `존경하는 ${prof} 교수님께,

안녕하십니까. [${course}] 강의를 수강 중인 ${dept} ${name}입니다.

금일 부득이한 사유(${detail || "급성 장염에 따른 병원 내원"})로 인하여 강의에 부득이 불참하게 되어 송구한 마음으로 연락드립니다.

- 결석 일시: 2026년 00월 00일 (0요일)
- 결석 사유: ${detail || "건강상의 불가피한 사유"}
- 첨부 서류: 병원 진단서(진료확인서) 사본 첨부

교수님의 소중한 강의를 온전히 수강하지 못해 대단히 아쉽고 죄송하오며, 당일 수업 진도와 자료는 동기들의 도움을 받아 다음 시간 전까지 철저히 예복습하여 수업 참여에 지장이 없도록 하겠습니다.

증빙 서류를 본 메일에 첨부하오니 공결 처리 가능 여부를 검토해 주시면 대단히 감사하겠습니다.

${dept}
${name} 드림`;
    } else if (purpose === 'meeting') {
      body = `존경하는 ${prof} 교수님께,

안녕하십니까. [${course}]를 수강하고 있는 ${dept} ${name}입니다.

평소 교수님의 명쾌한 강의와 학문적 깊이에 깊은 감명을 받아오던 중, 앞으로의 학업 및 진로와 관련하여 평소 존경하던 교수님의 조언을 구하고자 조심스럽게 면담을 청하게 되었습니다.

- 면담 희망 주제: ${detail || "학부 연구생 참여 및 관련 대학원 진학 진로 상담"}
- 소요 예상 시간: 약 15~20분 내외

교수님의 연구와 강의 일정에 최대한 맞추고자 하오니, 편하신 일정(요일 및 시간대)을 회신 주시면 그 시간에 맞추어 연구실로 찾아뵙도록 하겠습니다.

늘 감사드립니다.

${dept}
${name} 배상`;
    } else {
      // late
      body = `존경하는 ${prof} 교수님께,

안녕하십니까. [${course}] 강의를 수강하는 ${dept} ${name}입니다.

정해진 마감 기한 내에 과제를 온전히 제출하여야 마땅함에도 불구하고, 부득이한 기술적 사정(${detail || "파일 변환 오류 및 네트워크 지연"})으로 인하여 마감 시각을 경과하여 제출하게 되어 깊이 반성하며 죄송하다는 말씀 올립니다.

완성된 과제 최종본을 본 메일에 첨부하여 올립니다.
감점 조치는 달게 수용하겠사오며, 한 학기 동안 공정하게 평가에 임하시는 교수님과 다른 학우분들께 누를 끼치지 않도록 향후에는 절대 이런 일이 없도록 각별히 유념하겠습니다.

너그럽게 헤아려 주시기 바랍니다.

${dept}
${name} 올림`;
    }

    emailBody.textContent = body;
  }

  genEmailBtn.addEventListener('click', generate);

  copyEmailBtn.addEventListener('click', () => {
    const fullText = `제목: ${emailSubject.textContent}\n\n${emailBody.textContent}`;
    navigator.clipboard.writeText(fullText).then(() => {
      copyEmailBtn.textContent = "복사 완료!";
      setTimeout(() => copyEmailBtn.textContent = "전체 복사", 2000);
    });
  });

  generate();
});
