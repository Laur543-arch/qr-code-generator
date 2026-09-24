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

    if (ratio >= 4.5) {
        contrastStatus.textContent = "Contrast bun, ușor de scanare";
        contrastStatus.className = "status-pill status-ok";
        scanStatus.textContent = "Scanabil, contrast bun";
        scanStatus.className = "status-pill status-ok";
    } else if (ratio >= 2.5) {
        contrastStatus.textContent = "Contrast mediu, verifică înainte de tipărire";
        contrastStatus.className = "status-pill status-warn";
        scanStatus.textContent = "Scanabil, dar nu ideal";
        scanStatus.className = "status-pill status-warn";
    } else {
        contrastStatus.textContent = "Contrast slab, risc de scanare dificilă";
        contrastStatus.className = "status-pill status-bad";
        scanStatus.textContent = "Risc de scanare dificilă";
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
    if (!value) {
        contentStatus.textContent = "Conținut gol";
        contentStatus.className = "status-pill status-bad";
        return false;
    }
    contentStatus.textContent = "Conținut valid";
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

    // Generăm QR-ul pe canvas
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

    // Așteptăm canvas-ul
    setTimeout(() => {
        const canvas = qrContainer.querySelector("canvas");
        if (!canvas) return;

        const ctx = canvas.getContext("2d");

        // GRADIENT
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

        // LOGO
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

        // MARGINE
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
inputQrColor.addEventListener("input", generateQR);
inputBgColor.addEventListener("input", generateQR);

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
// INITIALIZARE
// -------------------------

updateSizeLabel();
updateLogoLabels();
updateContrastStatus();
inputContent.value = "https://exemplu.ro";
generateQR();
