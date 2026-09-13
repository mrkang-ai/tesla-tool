// qr.js - Artistic QR Generator
document.addEventListener('DOMContentLoaded', () => {
  const qrText = document.getElementById('qrText');
  const qrColor = document.getElementById('qrColor');
  const qrBgColor = document.getElementById('qrBgColor');
  const genQrBtn = document.getElementById('genQrBtn');
  const qrcodeContainer = document.getElementById('qrcode');

  let qr = null;

  function makeQr() {
    qrcodeContainer.innerHTML = "";
    qr = new QRCode(qrcodeContainer, {
      text: qrText.value.trim() || "https://tossgpt.online",
      width: 200,
      height: 200,
      colorDark: qrColor.value,
      colorLight: qrBgColor.value,
      correctLevel: QRCode.CorrectLevel.H
    });
  }

  genQrBtn.addEventListener('click', makeQr);
  qrColor.addEventListener('input', makeQr);
  qrBgColor.addEventListener('input', makeQr);

  makeQr();
});
