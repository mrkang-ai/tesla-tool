// Time Machine Boarding Pass
document.addEventListener('DOMContentLoaded', () => {
  const nameInput = document.getElementById('travelerName');
  const targetSelect = document.getElementById('timeTarget');
  const issueBtn = document.getElementById('issueBtn');
  const passName = document.getElementById('passName');
  const passDest = document.getElementById('passDest');

  issueBtn.addEventListener('click', () => {
    passName.innerText = nameInput.value.trim() || "시간 여행자";
    passDest.innerText = targetSelect.options[targetSelect.selectedIndex].text;
  });
});
