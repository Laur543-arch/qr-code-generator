/* ============================
   SISTEM DE LIMBI (i18n)
   ============================ */

let currentLang = "ro";
let translations = {};

/* Încarcă fișierul lang.json */
async function loadTranslations() {
  try {
    const response = await fetch("lang.json");
    translations = await response.json();
  } catch (error) {
    console.error("Eroare la încărcarea traducerilor:", error);
  }
}

/* Aplică traducerile în HTML */
function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (translations[currentLang] && translations[currentLang][key]) {
      el.textContent = translations[currentLang][key];
    }
  });
}

/* Detectare automată limbă */
function detectLanguage() {
  const saved = localStorage.getItem("app_lang");
  if (saved) {
    currentLang = saved;
    return;
  }

  const browserLang = navigator.language || navigator.userLanguage;
  currentLang = browserLang.startsWith("ro") ? "ro" : "en";
}

/* Schimbare limbă manual */
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
   GENERARE QR + LOGO
   ============================ */

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
const sizeInput = document.getElementById('qr-size');

function markDirty() {
  downloadBtn.disabled = true;
}

[input, qrColorInput, bgColorInput, sizeInput, logoInput].forEach(el => {
  el.addEventListener('input', markDirty);
});

/* Funcție care generează QR într-un canvas propriu */
function generateCustomQR(text, size, colorDark, colorLight, logoFile) {
  qrContainer.innerHTML = "";

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  const qr = new QRCode(document.createElement("div"), {
    text: text,
    width: size,
    height: size,
    colorDark: colorDark,
    colorLight: colorLight,
    correctLevel: QRCode.CorrectLevel.H
  });

  setTimeout(() => {
    const qrCanvas = qr._oDrawing._elCanvas;
    ctx.drawImage(qrCanvas, 0, 0);

    if (logoFile) {
      const logo = new Image();
      logo.src = URL.createObjectURL(logoFile);

      logo.onload = () => {
        const logoSize = size * 0.20;
        const x = (size - logoSize) / 2;
        const y = (size - logoSize) / 2;
        ctx.drawImage(logo, x, y, logoSize, logoSize);
      };
    }
  }, 50);

  qrContainer.appendChild(canvas);
}

/* GENERARE QR + LOGO ÎN PREVIEW */
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

/* PDF – premium */
pdfBtn.addEventListener('click', () => {
  alert(currentLang === "ro" ? "Funcția PDF va fi disponibilă în versiunea premium." : "PDF export will be available in the premium version.");
});

/* ============================
   INITIALIZARE
   ============================ */

document.addEventListener("DOMContentLoaded", async () => {
  await loadTranslations();
  detectLanguage();
  applyTranslations();

  // Activează vizual limba curentă
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === currentLang);
  });

  // Activează Dark Mode la încărcare
  applyDarkMode();

  // Activare buton Dark Mode
  const darkBtn = document.getElementById("darkmode-btn");
  if (darkBtn) {
    darkBtn.addEventListener("click", toggleDarkMode);
  }

  // Activare butoane limbă
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      switchLanguage(btn.dataset.lang);
    });
  });
});
