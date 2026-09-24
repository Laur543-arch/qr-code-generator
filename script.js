let logoImage = null;
const { jsPDF } = window.jspdf;

// Elemente UI
const inputContent = document.getElementById("qr-input");
const inputQrColor = document.getElementById("qr-color");
const inputBgColor = document.getElementById("bg-color");
const inputSize = document.getElementById("qr-size");
const sizeLabel = document.getElementById("qr-size-label");

const contentStatus = document.getElementById("content-status");
const contrastStatus = document.getElementById("contrast-status");
const scanStatus = document.getElementById("scan-status");

const logoInput = document.getElementById("logo-input");
const clearLogoBtn = document.getElementById("clear-logo-btn");
const logoScale = document.getElementById("logo-scale");
const logoScaleLabel = document.getElementById("logo-scale-label");
const logoOpacity = document.getElementById("logo-opacity");
const logoOpacityLabel = document.getElementById("logo-opacity-label");
const logoPosition = document.getElementById("logo-position");

const gradientEnable = document.getElementById("gradient-enable");
const gradientColor1 = document.getElementById("gradient-color1");
const gradientColor2 = document.getElementById("gradient-color2");
const borderColor = document.getElementById("border-color");
const borderSize = document.getElementById("border-size");

const resetBtn = document.getElementById("reset-btn");

const downloadBtn = document.getElementById("download-btn");
const pdfBtn = document.getElementById("pdf-btn");
const svgBtn = document.getElementById("svg-btn");

const qrContainer = document.getElementById("qrcode");


// -------------------------
// LIMBI (i18n)
// -------------------------

const translations = {
    ro: {
        appTitle: "Qrio – Generator QR Premium",
        headerTitle: "Qrio",
        headerSubtitle: "Configurează, verifică și descarcă în câteva secunde.",
        contentTitle: "Conținut",
        contentLabel: "URL sau text",
        contentValid: "Conținut valid",
        contentEmpty: "Conținut gol",
        aspectTitle: "Aspect",
        qrColorLabel: "Culoare QR",
        bgColorLabel: "Culoare fundal",
        sizeLabel: "Dimensiune",
        contrastGood: "Contrast bun, ușor de scanare",
        contrastMedium: "Contrast mediu, verifică înainte de tipărire",
        contrastBad: "Contrast slab, risc de scanare dificilă",
        scanGood: "Scanabil, contrast bun",
        scanMedium: "Scanabil, dar nu ideal",
        scanBad: "Risc de scanare dificilă",
        logoTitle: "Logo",
        logoFileLabel: "Fișier logo (PNG/JPG)",
        logoClear: "Șterge logo",
        logoSizeLabel: "Dimensiune logo",
        logoOpacityLabel: "Transparență logo",
        logoPositionLabel: "Poziție logo",
        effectsTitle: "Efecte avansate",
        gradientLabel: "Gradient QR",
        gradientNone: "Fără",
        gradientLinear: "Linear",
        color1Label: "Culoare 1",
        color2Label: "Culoare 2",
        borderColorLabel: "Culoare margine",
        borderSizeLabel: "Grosime margine",
        previewTitle: "Previzualizare",
        downloadPng: "Descarcă PNG",
        downloadPdf: "Descarcă PDF",
        downloadSvg: "Descarcă SVG",
        footerText: "Qrio · Generator QR Premium",
        resetText: "Reset"
    },
    en: {
        appTitle: "Qrio – Premium QR Generator",
        headerTitle: "Qrio",
        headerSubtitle: "Configure, verify and download in seconds.",
        contentTitle: "Content",
        contentLabel: "URL or text",
        contentValid: "Valid content",
        contentEmpty: "Empty content",
        aspectTitle: "Appearance",
        qrColorLabel: "QR color",
        bgColorLabel: "Background color",
        sizeLabel: "Size",
        contrastGood: "Good contrast, easy to scan",
        contrastMedium: "Medium contrast, test before printing",
        contrastBad: "Low contrast, scanning may be difficult",
        scanGood: "Scannable, good contrast",
        scanMedium: "Scannable, but not ideal",
        scanBad: "Risk of difficult scanning",
        logoTitle: "Logo",
        logoFileLabel: "Logo file (PNG/JPG)",
        logoClear: "Clear logo",
        logoSizeLabel: "Logo size",
        logoOpacityLabel: "Logo transparency",
        logoPositionLabel: "Logo position",
        effectsTitle: "Advanced effects",
        gradientLabel: "QR gradient",
        gradientNone: "None",
        gradientLinear: "Linear",
        color1Label: "Color 1",
        color2Label: "Color 2",
        borderColorLabel: "Border color",
        borderSizeLabel: "Border thickness",
        previewTitle: "Preview",
        downloadPng: "Download PNG",
        downloadPdf: "Download PDF",
        downloadSvg: "Download SVG",
        footerText: "Qrio · Premium QR Generator",
        resetText: "Reset"
    }
};

let currentLang = "ro";

function detectBrowserLang() {
    const lang = navigator.language || navigator.userLanguage || "en";
    if (lang.startsWith("ro")) return "ro";
    return "en";
}

function applyTranslations() {
    const t = translations[currentLang];

    document.title = t.appTitle;

    document.querySelector(".brand-text h1").textContent = t.headerTitle;
    document.querySelector(".header-subtitle").textContent = t.headerSubtitle;

    const configTitles = document.querySelectorAll(".config-card h2");
    configTitles[0].textContent = t.contentTitle;
    document.querySelector("label[for='qr-input']").textContent = t.contentLabel;
    resetBtn.textContent = t.resetText;

    configTitles[1].textContent = t.aspectTitle;
    document.querySelector("label[for='qr-color']").textContent = t.qrColorLabel;
    document.querySelector("label[for='bg-color']").textContent = t.bgColorLabel;
    document.querySelector("label[for='qr-size']").textContent = t.sizeLabel;

    configTitles[2].textContent = t.logoTitle;
    document.querySelector("label[for='logo-input']").textContent = t.logoFileLabel;
    clearLogoBtn.textContent = t.logoClear;
    document.querySelector("label[for='logo-scale']").textContent = t.logoSizeLabel;
    document.querySelector("label[for='logo-opacity']").textContent = t.logoOpacityLabel;
    document.querySelector("label[for='logo-position']").textContent = t.logoPositionLabel;

    configTitles[3].textContent = t.effectsTitle;
    document.querySelector("label[for='gradient-enable']").textContent = t.gradientLabel;
    document.querySelector("#gradient-enable option[value='none']").textContent = t.gradientNone;
    document.querySelector("#gradient-enable option[value='linear']").textContent = t.gradientLinear;
    document.querySelector("label[for='gradient-color1']").textContent = t.color1Label;
    document.querySelector("label[for='gradient-color2']").textContent = t.color2Label;
    document.querySelector("label[for='border-color']").textContent = t.borderColorLabel;
    document.querySelector("label[for='border-size']").textContent = t.borderSizeLabel;

    document.querySelector(".preview-header h2").textContent = t.previewTitle;
    downloadBtn.textContent = t.downloadPng;
    pdfBtn.textContent = t.downloadPdf;
    svgBtn.textContent = t.downloadSvg;

    document.querySelector(".app-footer span").textContent = t.footerText;

    updateContrastStatus();
}

function setLang(lang) {
    if (lang === "auto") {
        currentLang = detectBrowserLang();
    } else {
        currentLang = lang;
    }
    applyTranslations();

    document.querySelectorAll(".lang-button").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.lang === lang);
        if (lang === "auto" && btn.dataset.lang === "auto") btn.classList.add("active");
    });
}


// -------------------------
// UTILITARE
// -------------------------

function getLuminance(hex) {
    const c = hex.replace("#", "");
    const r = parseInt(c.substr(0, 2), 16) / 255;
    const g = parseInt(c.substr(2, 2), 16) / 255;
    const b = parseInt(c.substr(4, 2), 16) / 255;
    const a = [r, g, b].map(v =>
        v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    );
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function updateContrastStatus() {
    const fg = inputQrColor.value;
    const bg = inputBgColor.value;
    const L1 = getLuminance(fg);
    const L2 = getLuminance(bg);
    const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);

    const t = translations[currentLang];

    if (ratio >= 4.5) {
        contrastStatus.textContent = t.contrastGood;
        contrastStatus.className = "status-pill status-ok";
        scanStatus.textContent = t.scanGood;
        scanStatus.className = "status-pill status-ok";
    } else if (ratio >= 2.5) {
        contrastStatus.textContent = t.contrastMedium;
        contrastStatus.className = "status-pill status-warn";
        scanStatus.textContent = t.scanMedium;
        scanStatus.className = "status-pill status-warn";
    } else {
        contrastStatus.textContent = t.contrastBad;
        contrastStatus.className = "status-pill status-bad";
        scanStatus.textContent = t.scanBad;
        scanStatus.className = "status-pill status-bad";
    }
}

function updateSizeLabel() {
    sizeLabel.textContent = `${inputSize.value} px`;
}

function updateLogoLabels() {
    logoScaleLabel.textContent = `${logoScale.value}%`;
    logoOpacityLabel.textContent = `${logoOpacity.value}%`;
}

function validateContent() {
    const value = inputContent.value.trim();
    const t = translations[currentLang];

    if (!value) {
        contentStatus.textContent = t.contentEmpty;
        contentStatus.className = "status-pill status-bad";
        return false;
    }
    contentStatus.textContent = t.contentValid;
    contentStatus.className = "status-pill status-ok";
    return true;
}


// -------------------------
// GENERARE QR
// -------------------------

function generateQR() {
    if (!validateContent()) return;

    qrContainer.innerHTML = "";

    const size = parseInt(inputSize.value, 10);

    new QRCode(qrContainer, {
        text: inputContent.value.trim(),
        width: size,
        height: size,
        colorDark: inputQrColor.value,
        colorLight: inputBgColor.value,
        correctLevel: QRCode.CorrectLevel.H
    });

    updateContrastStatus();

    downloadBtn.disabled = false;
    pdfBtn.disabled = false;
    svgBtn.disabled = false;

    setTimeout(() => {
        const canvas = qrContainer.querySelector("canvas");
        if (!canvas) return;

        const ctx = canvas.getContext("2d");

        if (gradientEnable.value === "linear") {
            const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            grad.addColorStop(0, gradientColor1.value);
            grad.addColorStop(1, gradientColor2.value);

            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            ctx.putImageData(imgData, 0, 0);

            ctx.globalCompositeOperation = "source-in";
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = "source-over";
        }

        if (logoImage) {
            const logoSize = (logoScale.value / 100) * canvas.width;
            const opacity = 1 - logoOpacity.value / 100;

            let x = (canvas.width - logoSize) / 2;
            let y = (canvas.height - logoSize) / 2;

            if (logoPosition.value === "top") y = canvas.height * 0.15 - logoSize / 2;
            if (logoPosition.value === "bottom") y = canvas.height * 0.85 - logoSize / 2;
            if (logoPosition.value === "left") x = canvas.width * 0.15 - logoSize / 2;
            if (logoPosition.value === "right") x = canvas.width * 0.85 - logoSize / 2;

            ctx.save();
            ctx.globalAlpha = opacity;
            ctx.drawImage(logoImage, x, y, logoSize, logoSize);
            ctx.restore();
        }

        const border = parseInt(borderSize.value, 10);
        if (border > 0) {
            ctx.strokeStyle = borderColor.value;
            ctx.lineWidth = border;
            ctx.strokeRect(border, border, canvas.width - 2 * border, canvas.height - 2 * border);
        }

    }, 200);
}


// -------------------------
// EXPORTURI
// -------------------------

downloadBtn.addEventListener("click", () => {
    const canvas = qrContainer.querySelector("canvas");
    if (!canvas) return;

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "qr-code.png";
    link.click();
});

pdfBtn.addEventListener("click", () => {
    const canvas = qrContainer.querySelector("canvas");
    if (!canvas) return;

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4"
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const qrSize = 240;
    const x = (pageWidth - qrSize) / 2;
    const y = 200;

    pdf.addImage(imgData, "PNG", x, y, qrSize, qrSize);
    pdf.save("qr-code.pdf");
});

svgBtn.addEventListener("click", () => {
    const canvas = qrContainer.querySelector("canvas");
    if (!canvas) return;

    const svgData = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
            <image href="${canvas.toDataURL("image/png")}" width="${canvas.width}" height="${canvas.height}" />
        </svg>
    `;

    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "qr-code.svg";
    a.click();

    URL.revokeObjectURL(url);
});


// -------------------------
// LOGO
// -------------------------

logoInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
        logoImage = new Image();
        logoImage.onload = () => generateQR();
        logoImage.src = ev.target.result;
    };
    reader.readAsDataURL(file);
});

clearLogoBtn.addEventListener("click", () => {
    logoImage = null;
    logoInput.value = "";
    generateQR();
});


// -------------------------
// EVENT LISTENERS
// -------------------------

inputContent.addEventListener("input", generateQR);
inputQrColor.addEventListener("input", () => {
    updateContrastStatus();
    generateQR();
});
inputBgColor.addEventListener("input", () => {
    updateContrastStatus();
    generateQR();
});

inputSize.addEventListener("input", () => {
    updateSizeLabel();
    generateQR();
});

logoScale.addEventListener("input", () => {
    updateLogoLabels();
    generateQR();
});

logoOpacity.addEventListener("input", () => {
    updateLogoLabels();
    generateQR();
});

logoPosition.addEventListener("change", generateQR);

gradientEnable.addEventListener("change", generateQR);
gradientColor1.addEventListener("input", generateQR);
gradientColor2.addEventListener("input", generateQR);

borderColor.addEventListener("input", generateQR);
borderSize.addEventListener("input", generateQR);

resetBtn.addEventListener("click", () => {
    inputContent.value = "https://exemplu.ro";
    inputQrColor.value = "#2b1b5f";
    inputBgColor.value = "#ffffff";
    inputSize.value = 400;
    logoScale.value = 22;
    logoOpacity.value = 0;
    logoPosition.value = "centru";
    gradientEnable.value = "none";
    gradientColor1.value = "#2b1b5f";
    gradientColor2.value = "#000000";
    borderColor.value = "#2b1b5f";
    borderSize.value = 2;
    logoImage = null;
    logoInput.value = "";
    updateSizeLabel();
    updateLogoLabels();
    updateContrastStatus();
    generateQR();
});


// -------------------------
// LIMBĂ – BUTOANE & INITIALIZARE
// -------------------------

document.querySelectorAll(".lang-button").forEach(btn => {
    btn.addEventListener("click", () => {
        setLang(btn.dataset.lang);
    });
});

setLang("auto");
updateSizeLabel();
updateLogoLabels();
inputContent.value = "https://exemplu.ro";
generateQR();
