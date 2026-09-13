// QR Code Client-side Decoder
document.addEventListener('DOMContentLoaded', () => {
  const uploadBtn = document.getElementById('uploadBtn');
  const fileInput = document.getElementById('qrFileInput');
  const resultBox = document.getElementById('resultBox');
  const qrContent = document.getElementById('qrContent');
  const copyBtn = document.getElementById('copyScanBtn');

  uploadBtn.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
      const img = new Image();
      img.onload = function() {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        if (typeof jsQR !== 'undefined') {
          const code = jsQR(imgData.data, imgData.width, imgData.height);
          if (code) {
            qrContent.innerText = code.data;
            resultBox.classList.remove('hidden');
          } else {
            alert("QR 코드를 인식하지 못했습니다. 더 선명한 이미지를 선택해주세요.");
          }
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(qrContent.innerText);
    copyBtn.innerText = "복사 완료!";
    setTimeout(() => { copyBtn.innerText = "내용 복사"; }, 1200);
  });
});
