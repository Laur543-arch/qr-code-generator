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

// Batch QR
const batchInput = document.getElementById("batch-input");
const batchColumn = document.getElementById("batch-column");
const batchStart = document.getElementById("batch-start");
const batchProgress = document.getElementById("batch-progress");
const batchBar = document.getElementById("batch-bar");
const batchStatus = document.getElementById("batch-status");

// Template-uri premium
const templateItems = document.querySelectorAll(".template-item");

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
        resetText: "Reset",
        batchTitle: "Batch QR",
        batchFileLabel: "Fișier Excel (XLSX)",
        batchColumnLabel: "Coloana cu text/URL",
        batchStart: "Generează QR-uri",
        templateTitle: "Template-uri premium"
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
        resetText: "Reset",
        batchTitle: "Batch QR",
        batchFileLabel: "Excel file (XLSX)",
        batchColumnLabel: "Column with text/URL",
        batchStart: "Generate QR codes",
        templateTitle: "Premium templates"
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

    configTitles[4].textContent = t.batchTitle;
    document.querySelector("label[for='batch-input']").textContent = t.batchFileLabel;
    document.querySelector("label[for='batch-column']").textContent = t.batchColumnLabel;
    batchStart.textContent = t.batchStart;

    configTitles[5].textContent = t.templateTitle;

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
// GENERARE QR INDIVIDUAL
// -------------------------

function drawAdvancedOnCanvas(canvas) {
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
}

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
        drawAdvancedOnCanvas(canvas);
    }, 200);
}

// -------------------------
// EXPORTURI INDIVIDUALE
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
// EVENT LISTENERS INDIVIDUAL
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

// -------------------------
// BATCH QR — ACTIVARE BUTON
// -------------------------

batchInput.addEventListener("change", () => {
    batchStart.disabled = !batchInput.files.length;
});

// -------------------------
// BATCH QR — GENERARE
// -------------------------

batchStart.addEventListener("click", async () => {
    const file = batchInput.files[0];
    const column = batchColumn.value.trim().toUpperCase();

    if (!file || !column) return;

    batchProgress.classList.remove("hidden");
    batchBar.style.width = "0%";
    batchStatus.textContent = "0%";

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const colIndex = column.charCodeAt(0) - 65;
    const zip = new JSZip();

    let total = rows.length;
    let processed = 0;

    for (let i = 0; i < rows.length; i++) {
        const value = rows[i][colIndex];
        if (!value) continue;

        const tempDiv = document.createElement("div");
        new QRCode(tempDiv, {
            text: value.toString(),
            width: parseInt(inputSize.value),
            height: parseInt(inputSize.value),
            colorDark: inputQrColor.value,
            colorLight: inputBgColor.value,
            correctLevel: QRCode.CorrectLevel.H
        });

        await new Promise(res => setTimeout(res, 50));

        const canvas = tempDiv.querySelector("canvas");
        if (!canvas) continue;

        drawAdvancedOnCanvas(canvas);

        const pngData = canvas.toDataURL("image/png").split(",")[1];
        zip.file(`qr_${i + 1}.png`, pngData, { base64: true });

        processed++;
        const percent = Math.round((processed / total) * 100);
        batchBar.style.width = percent + "%";
        batchStatus.textContent = percent + "%";
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(zipBlob);
    link.download = "batch-qr.zip";
    link.click();

    batchStatus.textContent = "100%";
});

// -------------------------
// TEMPLATE-URI PREMIUM
// -------------------------

const templates = {
    corporate: () => {
        inputQrColor.value = "#1A4C8B";
        inputBgColor.value = "#FFFFFF";
        gradientEnable.value = "none";
        borderColor.value = "#1A4C8B";
        borderSize.value = 4;
        logoPosition.value = "centru";
        updateContrastStatus();
        generateQR();
    },
    luxury: () => {
        inputQrColor.value = "#C59D2F";
        inputBgColor.value = "#FFFFFF";
        gradientEnable.value = "linear";
        gradientColor1.value = "#C59D2F";
        gradientColor2.value = "#8C6A1F";
        borderColor.value = "#C59D2F";
        borderSize.value = 3;
        logoOpacity.value = 10;
        logoPosition.value = "centru";
        updateLogoLabels();
        updateContrastStatus();
        generateQR();
    },
    modern: () => {
        inputQrColor.value = "#6B2FB3";
        inputBgColor.value = "#F7F2FF";
        gradientEnable.value = "linear";
        gradientColor1.value = "#6B2FB3";
        gradientColor2.value = "#B38CFF";
        borderSize.value = 0;
        logoPosition.value = "right";
        updateContrastStatus();
        generateQR();
    },
    minimal: () => {
        inputQrColor.value = "#000000";
        inputBgColor.value = "#FFFFFF";
        gradientEnable.value = "none";
        borderSize.value = 0;
        logoImage = null;
        logoInput.value = "";
        updateContrastStatus();
        generateQR();
    },
    neon: () => {
        inputQrColor.value = "#00FFAA";
        inputBgColor.value = "#000000";
        gradientEnable.value = "linear";
        gradientColor1.value = "#00FFAA";
        gradientColor2.value = "#00CC88";
        borderColor.value = "#00FFAA";
        borderSize.value = 2;
        logoPosition.value = "centru";
        updateContrastStatus();
        generateQR();
    }
};

templateItems.forEach(item => {
    item.addEventListener("click", () => {
        templateItems.forEach(i => i.classList.remove("active"));
        item.classList.add("active");

        const key = item.dataset.template;
        if (templates[key]) {
            templates[key]();
        }
    });
});

// -------------------------
// LIMBĂ — BUTOANE & INITIALIZARE
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
