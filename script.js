/* ============================
   SISTEM DE LIMBI (i18n)
   ============================ */

let currentLang = "ro";
let translations = {};

async function loadTranslations() {
  try {
    const response = await fetch("lang.json");
    translations = await response.json();
  } catch (error) {
    console.error("Eroare la încărcarea traducerilor:", error);
  }
}

function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (translations[currentLang] && translations[currentLang][key]) {
      el.textContent = translations[currentLang][key];
    }
  });
}

function detectLanguage() {
  const saved = localStorage.getItem("app_lang");
  if (saved) {
    currentLang = saved;
    return;
  }

  const browserLang = navigator.language || navigator.userLanguage;
  currentLang = browserLang.startsWith("ro") ? "ro" : "en";
}

function switchLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("app_lang", lang);
  applyTranslations();

  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === currentLang);
  });
}

/* ============================
   DARK MODE
   ============================ */

function applyDarkMode() {
  const isDark = localStorage.getItem("dark_mode") === "true";
  document.body.classList.toggle("dark", isDark);

  const btn = document.getElementById("darkmode-btn");
  if (btn) {
    btn.textContent = isDark ? "☀️" : "🌙";
  }
}

function toggleDarkMode() {
  const current = localStorage.getItem("dark_mode") === "true";
  localStorage.setItem("dark_mode", !current);
  applyDarkMode();
}

/* ============================
   GENERARE QR + LOGO + PREMIUM
   ============================ */

const input = document.getElementById('qr-input');
const generateBtn = document.getElementById('generate-btn');
const downloadBtn = document.getElementById('download-btn');
const qrContainer = document.getElementById('qrcode');
const logoInput = document.getElementById('logo-input');
const clearLogoBtn = document.getElementById('clear-logo-btn');
const pdfBtn = document.getElementById('pdf-btn');

const qrColorInput = document.getElementById('qr-color');
const bgColorInput = document.getElementById('bg-color');
const sizeInput = document.getElementById('qr-size');

// Premium controls
const logoRotateInput = document.getElementById('logo-rotate');
const logoOpacityInput = document.getElementById('logo-opacity');
const logoScaleInput = document.getElementById('logo-scale');
const logoPositionSelect = document.getElementById('logo-position');

const gradientEnableSelect = document.getElementById('gradient-enable');
const gradientColor1Input = document.getElementById('gradient-color1');
const gradientColor2Input = document.getElementById('gradient-color2');

const borderSizeInput = document.getElementById('border-size');
const borderColorInput = document.getElementById('border-color');

function markDirty() {
  downloadBtn.disabled = true;
  pdfBtn.disabled = true;
}

[
  input, qrColorInput, bgColorInput, sizeInput, logoInput,
  logoRotateInput, logoOpacityInput, logoScaleInput, logoPositionSelect,
  gradientEnableSelect, gradientColor1Input, gradientColor2Input,
  borderSizeInput, borderColorInput
].forEach(el => {
  el.addEventListener('input', markDirty);
});

/* Funcție care generează QR într-un canvas propriu, cu Premium */
function generateCustomQR(text, size, colorDark, colorLight, logoFile) {
  qrContainer.innerHTML = "";

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  // Fundal
  ctx.fillStyle = colorLight;
  ctx.fillRect(0, 0, size, size);

  // QR temporar
  const tempDiv = document.createElement("div");
  const qr = new QRCode(tempDiv, {
    text: text,
    width: size,
    height: size,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });

  setTimeout(() => {
    const qrCanvas = qr._oDrawing._elCanvas;

    // Gradient sau culoare simplă
    let fillStyle = colorDark;
    if (gradientEnableSelect.value === "linear") {
      const grad = ctx.createLinearGradient(0, 0, size, size);
      grad.addColorStop(0, gradientColor1Input.value);
      grad.addColorStop(1, gradientColor2Input.value);
      fillStyle = grad;
    }

    // Desenăm QR alb-negru, apoi îl „colorăm”
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = size;
    tempCanvas.height = size;
    const tctx = tempCanvas.getContext("2d");
    tctx.drawImage(qrCanvas, 0, 0);

    const imgData = tctx.getImageData(0, 0, size, size);
    const data = imgData.data;

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, size, size);
    ctx.clip();

    ctx.fillStyle = fillStyle;
    ctx.fillRect(0, 0, size, size);

    // „mască” pentru păstrarea formelor QR
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = size;
    maskCanvas.height = size;
    const mctx = maskCanvas.getContext("2d");
    mctx.putImageData(imgData, 0, 0);
    ctx.globalCompositeOperation = "destination-in";
    ctx.drawImage(maskCanvas, 0, 0);
    ctx.restore();

    // Margine
    const borderSize = parseInt(borderSizeInput.value || "0", 10);
    if (borderSize > 0) {
      ctx.strokeStyle = borderColorInput.value;
      ctx.lineWidth = borderSize;
      ctx.strokeRect(
        borderSize / 2,
        borderSize / 2,
        size - borderSize,
        size - borderSize
      );
    }

    // Logo
    if (logoFile) {
      const logo = new Image();
      logo.src = URL.createObjectURL(logoFile);

      logo.onload = () => {
        const scalePercent = parseInt(logoScaleInput.value || "20", 10);
        const logoSize = size * (scalePercent / 100);

        let x = (size - logoSize) / 2;
        let y = (size - logoSize) / 2;

        const pos = logoPositionSelect.value;
        if (pos === "top") y = size * 0.1;
        if (pos === "bottom") y = size - logoSize - size * 0.1;
        if (pos === "left") x = size * 0.1;
        if (pos === "right") x = size - logoSize - size * 0.1;

        const rotateDeg = parseInt(logoRotateInput.value || "0", 10);
        const opacityPercent = parseInt(logoOpacityInput.value || "100", 10);

        ctx.save();
        ctx.globalAlpha = opacityPercent / 100;
        ctx.translate(x + logoSize / 2, y + logoSize / 2);
        ctx.rotate((rotateDeg * Math.PI) / 180);
        ctx.drawImage(logo, -logoSize / 2, -logoSize / 2, logoSize, logoSize);
        ctx.restore();
      };
    }
  }, 80);

  qrContainer.appendChild(canvas);
}

/* GENERARE QR + PREMIUM ÎN PREVIEW */
generateBtn.addEventListener('click', () => {
  const value = input.value.trim();
  const colorDark = qrColorInput.value;
  const colorLight = bgColorInput.value;
  const size = parseInt(sizeInput.value, 10);

  if (!value) {
    alert(currentLang === "ro" ? "Introdu un text sau un URL." : "Enter a text or URL.");
    return;
  }

  const logoFile = logoInput.files ? logoInput.files[0] : null;

  generateCustomQR(value, size, colorDark, colorLight, logoFile);

  downloadBtn.disabled = false;
  pdfBtn.disabled = false;
});

/* DESCĂRCARE PNG */
downloadBtn.addEventListener('click', () => {
  const canvas = qrContainer.querySelector("canvas");
  if (!canvas) return;

  const dataURL = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "qrcode.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

/* ȘTERGERE LOGO */
clearLogoBtn.addEventListener('click', () => {
  logoInput.value = "";
  markDirty();

  const value = input.value.trim();
  if (!value) return;

  const colorDark = qrColorInput.value;
  const colorLight = bgColorInput.value;
  const size = parseInt(sizeInput.value, 10);

  generateCustomQR(value, size, colorDark, colorLight, null);
});

/* EXPORT PDF */
pdfBtn.addEventListener('click', () => {
  const canvas = qrContainer.querySelector("canvas");
  if (!canvas) {
    alert(currentLang === "ro" ? "Generează mai întâi un cod QR." : "Generate a QR code first.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "A4"
  });

  const imgData = canvas.toDataURL("image/png");
  const pageWidth = doc.internal.pageSize.getWidth();
  const qrSizeMm = 80;

  const x = (pageWidth - qrSizeMm) / 2;
  const y = 60;

  doc.addImage(imgData, "PNG", x, y, qrSizeMm, qrSizeMm);

  doc.save("qrcode.pdf");
});

/* ============================
   INITIALIZARE
   ============================ */

document.addEventListener("DOMContentLoaded", async () => {
  await loadTranslations();
  detectLanguage();
  applyTranslations();

  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === currentLang);
  });

  applyDarkMode();

  const darkBtn = document.getElementById("darkmode-btn");
  if (darkBtn) {
    darkBtn.addEventListener("click", toggleDarkMode);
  }

  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      switchLanguage(btn.dataset.lang);
    });
  });
});
