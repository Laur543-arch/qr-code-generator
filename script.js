let qrInstance = null;

const input = document.getElementById('qr-input');
const generateBtn = document.getElementById('generate-btn');
const downloadBtn = document.getElementById('download-btn');
const qrContainer = document.getElementById('qrcode');
const logoInput = document.getElementById('logo-input');
const clearLogoBtn = document.getElementById('clear-logo-btn');
const pdfBtn = document.getElementById('pdf-btn');

const qrColorInput = document.getElementById('qr-color');
const bgColorInput = document.getElementById('bg-color');

/* Dezactivăm descărcarea când se schimbă datele */
function markDirty() {
  downloadBtn.disabled = true;
}

input.addEventListener('input', markDirty);
qrColorInput.addEventListener('input', markDirty);
bgColorInput.addEventListener('input', markDirty);
document.getElementById('qr-size').addEventListener('input', markDirty);
logoInput.addEventListener('change', markDirty);

/* GENERARE QR + LOGO ÎN PREVIEW */
generateBtn.addEventListener('click', () => {
  const value = input.value.trim();
  const colorDark = qrColorInput.value;
  const colorLight = bgColorInput.value;
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

  /* OBSERVER — detectează apariția canvas-ului */
  const observer = new MutationObserver(() => {
    const canvas = qrContainer.querySelector('canvas');
    if (!canvas) return;

    observer.disconnect(); // oprim observarea

    if (logoInput.files && logoInput.files[0]) {
      const ctx = canvas.getContext('2d');
      const logo = new Image();
      logo.src = URL.createObjectURL(logoInput.files[0]);

      logo.onload = () => {
        const qrSize = canvas.width;
        const logoSize = qrSize * 0.20;
        const x = (qrSize - logoSize) / 2;
        const y = (qrSize - logoSize) / 2;
        ctx.drawImage(logo, x, y, logoSize, logoSize);
      };
    }
  });

  observer.observe(qrContainer, { childList: true });
});


/* DESCĂRCARE PNG (QR + logo dacă există) */
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
      const qrSize = canvas.width;
      const logoSize = qrSize * 0.20;

      const x = (qrSize - logoSize) / 2;
      const y = (qrSize - logoSize) / 2;

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

/* ȘTERGERE LOGO + REGENERARE QR FĂRĂ LOGO */
clearLogoBtn.addEventListener('click', () => {
  logoInput.value = "";
  markDirty();

  const value = input.value.trim();
  if (!value) return;

  const colorDark = qrColorInput.value;
  const colorLight = bgColorInput.value;
  const size = parseInt(document.getElementById('qr-size').value, 10);

  qrContainer.innerHTML = '';

  qrInstance = new QRCode(qrContainer, {
    text: value,
    width: size,
    height: size,
    colorDark: colorDark,
    colorLight: colorLight,
    correctLevel: QRCode.CorrectLevel.H
  });
});

/* EXPORT PDF – placeholder premium */
pdfBtn.addEventListener('click', () => {
  alert("Funcția PDF va fi disponibilă în versiunea premium.");
});
