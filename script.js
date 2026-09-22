let qrInstance = null;

const input = document.getElementById('qr-input');
const generateBtn = document.getElementById('generate-btn');
const downloadBtn = document.getElementById('download-btn');
const qrContainer = document.getElementById('qrcode');
const logoInput = document.getElementById('logo-input');
const pdfBtn = document.getElementById('pdf-btn');

/* GENERARE QR */
generateBtn.addEventListener('click', () => {
  const value = input.value.trim();
  const colorDark = document.getElementById('qr-color').value;
  const colorLight = document.getElementById('bg-color').value;
  const size = parseInt(document.getElementById('qr-size').value, 10);

  if (!value) {
    alert('Introdu un text sau un URL.');
    return;
  }

  qrContainer.innerHTML = '';

  qrInstance = new QRCode(qrContainer, {
    text: value,
    width: size,
    height: size,
    colorDark: colorDark,
    colorLight: colorLight,
    correctLevel: QRCode.CorrectLevel.H
  });

  downloadBtn.disabled = false;
  pdfBtn.disabled = false;
});

/* DESCĂRCARE PNG + LOGO */
downloadBtn.addEventListener('click', () => {
  if (!qrInstance) return;

  const canvas = qrContainer.querySelector('canvas');
  if (!canvas) {
    alert('Nu s-a găsit canvas-ul QR.');
    return;
  }

  const ctx = canvas.getContext('2d');

  if (logoInput.files && logoInput.files[0]) {
    const logo = new Image();
    logo.src = URL.createObjectURL(logoInput.files[0]);

    logo.onload = () => {
      const logoSize = canvas.width * 0.25;
      const x = (canvas.width - logoSize) / 2;
      const y = (canvas.height - logoSize) / 2;

      ctx.drawImage(logo, x, y, logoSize, logoSize);

      const dataURL = canvas.toDataURL("image/png");

      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'qrcode.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  } else {
    const dataURL = canvas.toDataURL("image/png");

    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
});

/* EXPORT PDF — funcție premium (placeholder) */
pdfBtn.addEventListener('click', () => {
  alert("Funcția PDF va fi disponibilă în versiunea premium.");
});
