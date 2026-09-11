// T vs F Switcher Logic
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('situationInput');
  const convertBtn = document.getElementById('convertBtn');
  const tResponse = document.getElementById('tResponse');
  const fResponse = document.getElementById('fResponse');
  const sampleBtns = document.querySelectorAll('.sample-btn');

  sampleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      input.value = btn.dataset.text;
      convert();
    });
  });

  function convert() {
    const txt = input.value.trim();
    if (!txt) return;

    if (txt.includes('사고') || txt.includes('차')) {
      tResponse.innerText = "1. 대물/대인 보험 접수번호 나왔어?\n2. 블랙박스 영상 확보했어?\n3. 과실 비율 몇 대 몇 예상한대?\n차 수리비 자차 처리할 건지 확인해봐.";
      fResponse.innerText = "헐 세상에ㅠㅠㅠㅠㅠ 너 어디 다친 데는 없어??? 진짜 너무 놀랐겠다ㅠㅠㅠ 손 덜덜 떨리지 않아? 일단 아무것도 신경 쓰지 말고 병원부터 가서 누워있어 ㅠㅠㅠ 몸이 제일 중요해!";
    } else if (txt.includes('아파') || txt.includes('감기') || txt.includes('열')) {
      tResponse.innerText = "체온 몇 도인데? 38도 넘으면 타이레놀 말고 이부프로펜 계열 교차복용하고 내일 아침 이비인후과 가서 수액 맞아. 병원비 실비 청구 서류 떼오고.";
      fResponse.innerText = "아이고 어떡해ㅠㅠㅠㅠ 요새 감기 진짜 독하다던데 밥은 먹었어? 따뜻한 물 많이 마시고 전기장판 켜고 푹 자야 해ㅠㅠ 대신 아파줄 수도 없고 진짜 맘 찢어진다...";
    } else if (txt.includes('머리') || txt.includes('미용실') || txt.includes('우울')) {
      tResponse.innerText = "기분 전환에 미용실 방문은 시간 및 비용 대비 효용성이 낮음. 얼마 들었어? 망했으면 다른 샵 가서 복구 펌 알아봐.";
      fResponse.innerText = "왜 무슨 일 있었어?? 왜 우울했어 말해봐ㅠㅠ 머리 자른 거 사진 보내줘! 너한테 완전 찰떡일 것 같은데 속상해하지 마ㅠㅠㅠ 주말에 맛있는 거 먹으러 가자!";
    } else {
      tResponse.innerText = `[원인 분석 및 해결 플랜]\n1. 발생 원인: 통제 가능한 요인인지 확인\n2. 다음 스텝: 감정 빼고 가장 효율적인 조치 1순위 실행\n3. 재발 방지: 프로세스 매뉴얼화 권장.`;
      fResponse.innerText = `진짜 너무 속상했겠다ㅠㅠㅠㅠ 듣기만 해도 내가 다 화나고 눈물 나려고 해... 너 잘못 하나도 없어 진짜로ㅠㅠ 오늘 밤엔 아무 생각 하지 말고 좋아하는 거 보면서 힐링해 토닥토닥!`;
    }
  }

  convertBtn.addEventListener('click', convert);
});
