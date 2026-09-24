/* ELEMENTE DIN DOM */
const input = document.getElementById('qr-input');
const qrColorInput = document.getElementById('qr-color');
const bgColorInput = document.getElementById('bg-color');
const sizeInput = document.getElementById('qr-size');
const logoInput = document.getElementById('logo-input');
const clearLogoBtn = document.getElementById('clear-logo-btn');

const generateBtn = document.getElementById('generate-btn');
const downloadBtn = document.getElementById('download-btn');
const pdfBtn = document.getElementById('pdf-btn');

const qrContainer = document.getElementById('qrcode');

/* PREMIUM CONTROLS */
const logoRotateInput = document.getElementById('logo-rotate');
const logoOpacityInput = document.getElementById('logo-opacity');
const logoScaleInput = document.getElementById('logo-scale');
const logoPositionInput = document.getElementById('logo-position');

const gradientEnableInput = document.getElementById('gradient-enable');
const gradientColor1Input = document.getElementById('gradient-color1');
const gradientColor2Input = document.getElementById('gradient-color2');

const borderSizeInput = document.getElementById('border-size');
const borderColorInput = document.getElementById('border-color');

/* LIMBA */
let currentLang = "ro";

/* Funcția principală — LIVE UPDATE */
function regenerateQR() {
    const text = input.value.trim();
    if (!text) return;

    const size = parseInt(sizeInput.value, 10);
    const colorDark = qrColorInput.value;
    const colorLight = bgColorInput.value;
    const logoFile = logoInput.files ? logoInput.files[0] : null;

    qrContainer.innerHTML = "";

    /* 1. Generăm QR-ul într-un div temporar */
    const tempDiv = document.createElement("div");

    const qr = new QRCode(tempDiv, {
        text: text,
        width: size,
        height: size,
        colorDark: colorDark,
        colorLight: colorLight,
        correctLevel: QRCode.CorrectLevel.H
    });

    /* 2. Callback real — QR gata */
    qr._oDrawing._elImage.onload = () => {
        const img = tempDiv.querySelector("img") || tempDiv.querySelector("canvas");
        if (!img) return;

        /* 3. Canvas final */
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");

        /* FUNDAL / GRADIENT */
        if (gradientEnableInput.value !== "none" && gradientEnableInput.value !== "fara") {
            const grad = ctx.createLinearGradient(0, 0, size, size);
            grad.addColorStop(0, gradientColor1Input.value);
            grad.addColorStop(1, gradientColor2Input.value);
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, size, size);
        } else {
            ctx.fillStyle = colorLight;
            ctx.fillRect(0, 0, size, size);
        }

        /* QR */
        ctx.drawImage(img, 0, 0, size, size);

        /* BORDER */
        const borderSize = parseInt(borderSizeInput.value, 10);
        if (!isNaN(borderSize) && borderSize > 0) {
            ctx.strokeStyle = borderColorInput.value;
            ctx.lineWidth = borderSize;
            ctx.strokeRect(borderSize / 2, borderSize / 2, size - borderSize, size - borderSize);
        }

        /* LOGO */
        if (logoFile) {
            const logoImg = new Image();
            logoImg.onload = () => {
                const scale = parseInt(logoScaleInput.value, 10) / 100 || 0.2;
                const logoSize = size * scale;

                let x = (size - logoSize) / 2;
                let y = (size - logoSize) / 2;

                const pos = logoPositionInput.value;
                if (pos === "top") y = size * 0.1;
                if (pos === "bottom") y = size - logoSize - size * 0.1;
                if (pos === "left") x = size * 0.1;
                if (pos === "right") x = size - logoSize - size * 0.1;

                ctx.save();
                ctx.globalAlpha = parseInt(logoOpacityInput.value, 10) / 100 || 1;

                ctx.translate(x + logoSize / 2, y + logoSize / 2);
                ctx.rotate((parseInt(logoRotateInput.value, 10) * Math.PI) / 180 || 0);
                ctx.drawImage(logoImg, -logoSize / 2, -logoSize / 2, logoSize, logoSize);

                ctx.restore();
            };
            logoImg.src = URL.createObjectURL(logoFile);
        }

        /* Afișare */
        qrContainer.innerHTML = "";
        qrContainer.appendChild(canvas);

        /* Salvare pentru PNG/PDF */
        window.generatedCanvas = canvas;
    };
}

/* Butonul principal */
generateBtn.addEventListener('click', regenerateQR);

/* LIVE UPDATE — toate controalele */
[
    qrColorInput,
    bgColorInput,
    sizeInput,
    gradientEnableInput,
    gradientColor1Input,
    gradientColor2Input,
    borderSizeInput,
    borderColorInput,
    logoRotateInput,
    logoOpacityInput,
    logoScaleInput,
    logoPositionInput
].forEach(el => {
    if (el) el.addEventListener("input", regenerateQR);
    if (el) el.addEventListener("change", regenerateQR);
});

/* Logo upload */
logoInput.addEventListener("change", regenerateQR);

/* PNG */
downloadBtn.addEventListener('click', () => {
    if (!window.generatedCanvas) return;

    const link = document.createElement('a');
    link.href = window.generatedCanvas.toDataURL("image/png");
    link.download = 'qrcode.png';
    link.click();
});

/* PDF */
pdfBtn.addEventListener('click', () => {
    if (!window.generatedCanvas) return;

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [window.generatedCanvas.width, window.generatedCanvas.height]
    });

    pdf.addImage(
        window.generatedCanvas.toDataURL("image/png"),
        "PNG",
        0,
        0,
        window.generatedCanvas.width,
        window.generatedCanvas.height
    );

    pdf.save("qrcode.pdf");
});
