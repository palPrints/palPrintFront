const selection = JSON.parse(sessionStorage.getItem("palprintsDesignerSelection") || "null");

const catalog = {
    "product-001": {
        name: "تي شيرت كلاسيكي",
        colorName: { white: "أبيض", black: "أسود", navy: "كحلي", red: "أحمر", green: "أخضر" },
        image: "assets/images/tshirt.webp",
        colors: [{ id: "white", value: "#fff" }, { id: "black", value: "#111" }, { id: "navy", value: "#173b87" }, { id: "red", value: "#d52a3c" }, { id: "green", value: "#2e9b42" }],
        sizes: ["S", "M", "L", "XL", "XXL"],
        areas: [
            { id: "front", name: "الأمام", useColorImage: true, dimensions: "28 × 36 سم", safeDimensions: "24 × 32 سم", safeInset: { x: "7%", y: "6%" }, zone: { top: "28%", left: "33%", width: "34%", height: "38%" } },
            { id: "back", name: "الخلف", image: "assets/images/printing-areas/tshirt/tshirt-back-removebg-preview.png", dimensions: "28 × 36 سم", safeDimensions: "24 × 32 سم", safeInset: { x: "7%", y: "6%" }, zone: { top: "25%", left: "35%", width: "30%", height: "42%" } },
            { id: "right-sleeve", name: "الكم الأيمن", image: "assets/images/printing-areas/tshirt/tshirt-rightSleeve-removebg-preview.png", dimensions: "10 × 12 سم", safeDimensions: "8 × 10 سم", safeInset: { x: "10%", y: "8%" }, compact: true, zone: { top: "22%", left: "74%", width: "9%", height: "19%", rotation: "-14deg" } },
            { id: "left-sleeve", name: "الكم الأيسر", image: "assets/images/printing-areas/tshirt/tshirt-leftSleeve-removebg-preview.png", dimensions: "10 × 12 سم", safeDimensions: "8 × 10 سم", safeInset: { x: "10%", y: "8%" }, compact: true, zone: { top: "22%", left: "17%", width: "9%", height: "19%", rotation: "14deg" } }
        ]
    },
    "product-002": {
        name: "هودي بسيط", colorName: { white: "أبيض", black: "أسود" }, colors: [{ id: "white", value: "#fff", image: "assets/images/hoodie.png" }, { id: "black", value: "#111", image: "assets/images/hoodie-black.png" }], sizes: ["S", "M", "L", "XL"], areas: [
            { id: "front", name: "الأمام", useColorImage: true, dimensions: "28 × 36 سم", safeDimensions: "24 × 32 سم", safeInset: { x: "7%", y: "6%" }, zone: { top: "26%", left: "32%", width: "36%", height: "38%" } },
            { id: "back", name: "الخلف", image: "assets/images/printing-areas/hoodie/hoodie-back.png", dimensions: "28 × 36 سم", safeDimensions: "24 × 32 سم", safeInset: { x: "7%", y: "6%" }, zone: { top: "29%", left: "31%", width: "38%", height: "46%" } }
        ]
    },
    "product-003": { name: "كوب سيراميك", colorName: { white: "أبيض" }, image: "assets/images/cup.webp", colors: [{ id: "white", value: "#fff" }], sizes: ["قياسي"], areas: [{ id: "front", name: "الواجهة", useColorImage: true, dimensions: "20 × 9 سم", safeDimensions: "18 × 7 سم", safeInset: { x: "5%", y: "11%" }, zone: { top: "32%", left: "22%", width: "40%", height: "25%" } }] },
    "product-004": { name: "حقيبة قماشية", colorName: { white: "أبيض" }, image: "assets/images/bag.png", colors: [{ id: "white", value: "#fff" }], sizes: ["قياسي"], areas: [
        { id: "front", name: "الأمام", useColorImage: true, dimensions: "28 × 30 سم", safeDimensions: "24 × 26 سم", safeInset: { x: "7%", y: "7%" }, zone: { top: "39%", left: "25%", width: "42%", height: "26%" } },
        { id: "back", name: "الخلف", useColorImage: true, dimensions: "28 × 30 سم", safeDimensions: "24 × 26 سم", safeInset: { x: "7%", y: "7%" }, zone: { top: "39%", left: "25%", width: "42%", height: "26%" } }
    ] },
    "product-005": {
        name: "تي شيرت ثقيل باهت",
        colorName: { "faded-black": "أسود باهت", "faded-brown": "بني باهت", "faded-cream": "كريمي باهت", "faded-navy": "كحلي باهت" },
        colors: [
            { id: "faded-black", value: "#4a4a48", image: "assets/products/tshirt-2/tshirt-dyed-heavyweight-faded-black-removebg-preview.png" },
            { id: "faded-brown", value: "#9b816a", image: "assets/products/tshirt-2/tshirt-dyed-heavyweight-faded-brown-removebg-preview.png" },
            { id: "faded-cream", value: "#f1ebdd", image: "assets/products/tshirt-2/tshirt-dyed-heavyweight-faded-cream-removebg-preview.png" },
            { id: "faded-navy", value: "#345775", image: "assets/products/tshirt-2/tshirt-dyed-heavyweight-faded-navy-removebg-preview.png" }
        ],
        sizes: ["S", "M", "L", "XL", "XXL"],
        areas: [
            { id: "front", name: "الأمام", useColorImage: true, dimensions: "28 × 36 سم", safeDimensions: "24 × 32 سم", safeInset: { x: "7%", y: "6%" }, zone: { top: "31%", left: "32%", width: "36%", height: "36%" } },
            { id: "back", name: "الخلف", image: "assets/images/printing-areas/tshirt/tshirt-back-removebg-preview.png", dimensions: "28 × 36 سم", safeDimensions: "24 × 32 سم", safeInset: { x: "7%", y: "6%" }, zone: { top: "25%", left: "35%", width: "30%", height: "42%" } },
            { id: "right-sleeve", name: "الكم الأيمن", image: "assets/images/printing-areas/tshirt/tshirt-rightSleeve-removebg-preview.png", dimensions: "10 × 12 سم", safeDimensions: "8 × 10 سم", safeInset: { x: "10%", y: "8%" }, compact: true, zone: { top: "22%", left: "74%", width: "9%", height: "19%", rotation: "-14deg" } },
            { id: "left-sleeve", name: "الكم الأيسر", image: "assets/images/printing-areas/tshirt/tshirt-leftSleeve-removebg-preview.png", dimensions: "10 × 12 سم", safeDimensions: "8 × 10 سم", safeInset: { x: "10%", y: "8%" }, compact: true, zone: { top: "22%", left: "17%", width: "9%", height: "19%", rotation: "14deg" } }
        ],
        canvasWidth: "min(56%, 455px)",
        canvasMobileWidth: "76%"
    },
    "product-006": {
        name: "قبعة كلاسيكية",
        colorName: { black: "أسود", navy: "كحلي", storm: "رمادي فاتح", walnut: "جوزي" },
        colors: [
            { id: "black", value: "#171717", image: "assets/products/cap/cap-black-removebg-preview.png" },
            { id: "navy", value: "#1d1e2b", image: "assets/products/cap/cap-navy-removebg-preview.png" },
            { id: "storm", value: "#d3d3d3", image: "assets/products/cap/cap-storm-removebg-preview.png" },
            { id: "walnut", value: "#786551", image: "assets/products/cap/cap-wallnut-removebg-preview.png" }
        ],
        sizes: ["قياسي"],
        areas: [{ id: "front", name: "الواجهة", useColorImage: true, dimensions: "18 × 8 سم", safeDimensions: "16 × 6 سم", safeInset: { x: "6%", y: "13%" }, zone: { top: "29%", left: "31%", width: "38%", height: "20%" } }],
        canvasWidth: "min(56%, 455px)",
        canvasMobileWidth: "76%"
    }
};

const product = catalog[selection?.productId] || catalog["product-001"];
const state = { colorId: selection?.colorId || product.colors[0].id, sizeId: selection?.sizeId || product.sizes[0], areaId: selection?.printAreaIds?.[0] || "front", zoom: 1, tool: "upload", hasDesign: false, imageUrl: null, imageX: 50, imageY: 50, imageWidth: 65, imageHeight: 65, imageRotation: 0, imageSelected: false, text: "", textSize: 28, textColor: "#6432f2", textAlign: "center", letterSpacing: 0, lineHeight: 1.2, rotation: 0, textX: 50, textY: 38, textSelected: false, zoneLabelHidden: false };
const $ = id => document.getElementById(id);

function showToast(message) { const toast = $("toast"); toast.textContent = message; toast.classList.add("show"); setTimeout(() => toast.classList.remove("show"), 2200); }
function activeArea() { return product.areas.find(area => area.id === state.areaId) || product.areas[0]; }
function renderProduct() {
    $("canvasProductName").textContent = product.name;
    $("productName").value = product.name;
    $("canvasVariant").textContent = `اللون: ${product.colorName[state.colorId] || product.colorName[product.colors[0].id]} · المقاس: ${state.sizeId}`;
    const productCanvas = $("productCanvas");
    if (product.canvasWidth) productCanvas.style.setProperty("--product-canvas-width", product.canvasWidth); else productCanvas.style.removeProperty("--product-canvas-width");
    if (product.canvasMobileWidth) productCanvas.style.setProperty("--product-canvas-mobile-width", product.canvasMobileWidth); else productCanvas.style.removeProperty("--product-canvas-mobile-width");
    const activeColor = product.colors.find(color => color.id === state.colorId) || product.colors[0];
    const area = activeArea();
    $("productImage").src = area.useColorImage ? (activeColor.image || product.image) : (area.image || activeColor.image || product.image);
    $("productImage").alt = `${product.name} - ${area.name}`;
    $("areaDimensions").textContent = area.dimensions;
    $("safeAreaDimensions").textContent = area.safeDimensions;
    const printZone = $("printZone");
    printZone.style.top = area.zone.top;
    printZone.style.left = area.zone.left;
    printZone.style.width = area.zone.width;
    printZone.style.height = area.zone.height;
    printZone.style.transform = `rotate(${area.zone.rotation || "0deg"})`;
    printZone.style.setProperty("--safe-inset-x", area.safeInset.x);
    printZone.style.setProperty("--safe-inset-y", area.safeInset.y);
    const zoneBadge = document.querySelector(".zone-badge");
    zoneBadge.classList.toggle("compact", Boolean(area.compact));
    $("zoneBadgeText").textContent = area.compact ? "" : "منطقة الطباعة";
    zoneBadge.setAttribute("aria-label", `منطقة طباعة ${area.name}`);
    state.hasDesign = Boolean(state.imageUrl || state.text);
    zoneBadge.hidden = state.hasDesign || state.zoneLabelHidden;
    const imageLayer = $("imageLayer");
    imageLayer.hidden = !state.imageUrl;
    imageLayer.classList.toggle("selected", state.imageSelected && Boolean(state.imageUrl));
    imageLayer.style.left = `${state.imageX}%`;
    imageLayer.style.top = `${state.imageY}%`;
    imageLayer.style.width = `${state.imageWidth}%`;
    imageLayer.style.height = `${state.imageHeight}%`;
    imageLayer.style.transform = `translate(-50%, -50%) rotate(${state.imageRotation}deg)`;
    if (state.imageUrl && $("uploadedImage").src !== state.imageUrl) $("uploadedImage").src = state.imageUrl;
    if (state.imageUrl) {
        constrainImagePosition();
        imageLayer.style.left = `${state.imageX}%`;
        imageLayer.style.top = `${state.imageY}%`;
    }
    $("textLayer").hidden = !state.text;
    $("textLayer").classList.toggle("selected", state.textSelected && Boolean(state.text));
    $("textContentPreview").textContent = state.text;
    $("textLayer").style.left = `${state.textX}%`;
    $("textLayer").style.top = `${state.textY}%`;
    $("textLayer").style.fontSize = `${state.textSize}px`;
    $("textLayer").style.color = state.textColor;
    $("textLayer").style.textAlign = state.textAlign;
    $("textLayer").style.letterSpacing = `${state.letterSpacing}px`;
    $("textLayer").style.lineHeight = state.lineHeight;
    $("textLayer").style.rotate = `${state.rotation}deg`;
    constrainTextPosition();
    $("textLayer").style.left = `${state.textX}%`;
    $("textLayer").style.top = `${state.textY}%`;
    $("positionX").value = Math.round(state.textX);
    $("positionY").value = Math.round(state.textY);
    $("rotation").value = state.rotation;
}
function renderAreas() { const select = $("areaSelect"); select.innerHTML = product.areas.map(area => `<option value="${area.id}">${area.name}</option>`).join(""); select.value = state.areaId; }
function renderColors() { $("swatches").innerHTML = product.colors.map(color => `<button class="swatch ${color.id === state.colorId ? "active" : ""}" type="button" data-color="${color.id}" style="background:${color.value}" aria-label="${product.colorName[color.id]}"></button>`).join(""); document.querySelectorAll("[data-color]").forEach(button => button.addEventListener("click", () => { state.colorId = button.dataset.color; renderColors(); renderProduct(); showToast(`تم اختيار اللون ${product.colorName[state.colorId]}`); })); }
function renderSizes() { $("sizes").innerHTML = product.sizes.map(size => `<button class="size-button ${size === state.sizeId ? "active" : ""}" type="button" data-size="${size}">${size}</button>`).join(""); document.querySelectorAll("[data-size]").forEach(button => button.addEventListener("click", () => { state.sizeId = button.dataset.size; renderSizes(); renderProduct(); })); }

function addDesign() { state.hasDesign = true; renderProduct(); showToast("تمت إضافة عنصر جاهز"); }

function openTextPanel() {
    state.text = "";
    state.textSelected = false;
    state.hasDesign = Boolean(state.imageUrl);
    state.zoneLabelHidden = true;
    state.textX = 50;
    state.textY = 38;
    state.rotation = 0;
    state.textSize = 28;
    state.textColor = "#6432f2";
    state.textAlign = "center";
    state.letterSpacing = 0;
    state.lineHeight = 1.2;
    $("textContent").value = "";
    $("textSize").value = state.textSize;
    $("textColor").value = state.textColor;
    $("letterSpacing").value = state.letterSpacing;
    $("lineHeight").value = state.lineHeight;
    $("rotation").value = state.rotation;
    $("positionX").value = state.textX;
    $("positionY").value = state.textY;
    document.querySelectorAll("[data-align]").forEach(button => button.classList.toggle("active", button.dataset.align === state.textAlign));
    renderProduct();
    $("textPanel").hidden = false;
    document.querySelector(".details-panel").classList.add("text-mode");
    $("textContent").focus();
}

function closeTextPanel() { $("textPanel").hidden = true; document.querySelector(".details-panel").classList.remove("text-mode"); state.zoneLabelHidden = Boolean(state.text); renderProduct(); }

function removeUploadedImage() {
    if (state.imageUrl) URL.revokeObjectURL(state.imageUrl);
    state.imageUrl = null;
    state.imageSelected = false;
    $("uploadedImage").removeAttribute("src");
    $("imageUpload").value = "";
}

document.querySelectorAll("[data-tool]").forEach(button => button.addEventListener("click", () => { state.tool = button.dataset.tool; document.querySelectorAll("[data-tool]").forEach(item => item.classList.toggle("active", item === button)); if (state.tool === "upload") $("imageUpload").click(); else if (state.tool === "text") openTextPanel(); else addDesign(); }));
$("textContent").addEventListener("input", event => { state.text = event.target.value; renderProduct(); });
$("textSize").addEventListener("input", event => { state.textSize = event.target.value; renderProduct(); });
$("textColor").addEventListener("input", event => { state.textColor = event.target.value; renderProduct(); });
$("letterSpacing").addEventListener("input", event => { state.letterSpacing = event.target.value; renderProduct(); });
$("lineHeight").addEventListener("input", event => { state.lineHeight = event.target.value; renderProduct(); });
$("rotation").addEventListener("input", event => { state.rotation = event.target.value; renderProduct(); });
$("positionX").addEventListener("input", event => { state.textX = clamp(Number(event.target.value), 12, 88); renderProduct(); });
$("positionY").addEventListener("input", event => { state.textY = clamp(Number(event.target.value), 12, 88); renderProduct(); });
document.querySelectorAll("[data-align]").forEach(button => button.addEventListener("click", () => { state.textAlign = button.dataset.align; document.querySelectorAll("[data-align]").forEach(item => item.classList.toggle("active", item === button)); renderProduct(); }));
$("addTextButton").addEventListener("click", () => { state.text = $("textContent").value.trim() || "تصميمك"; state.hasDesign = true; state.textSelected = true; renderProduct(); showToast("تمت إضافة النص إلى التصميم"); });
$("closeTextPanel").addEventListener("click", closeTextPanel);
$("duplicateText").addEventListener("click", () => showToast("تم تكرار النص"));
$("deleteText").addEventListener("click", () => { state.text = ""; state.hasDesign = false; renderProduct(); showToast("تم حذف النص"); });
$("imageUpload").addEventListener("change", event => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { showToast("يرجى اختيار ملف صورة"); event.target.value = ""; return; }
    if (state.imageUrl) URL.revokeObjectURL(state.imageUrl);
    const imageUrl = URL.createObjectURL(file);
    state.imageUrl = imageUrl;
    state.imageX = 50;
    state.imageY = 50;
    state.imageRotation = 0;
    state.imageSelected = true;
    const imageProbe = new Image();
    imageProbe.onload = () => {
        if (state.imageUrl !== imageUrl) return;
        const imageRatio = imageProbe.naturalWidth / imageProbe.naturalHeight;
        state.imageWidth = imageRatio >= 1 ? 70 : 70 * imageRatio;
        state.imageHeight = imageRatio >= 1 ? 70 / imageRatio : 70;
        renderProduct();
    };
    imageProbe.onerror = () => { if (state.imageUrl !== imageUrl) return; removeUploadedImage(); renderProduct(); showToast("تعذر تحميل الصورة"); };
    imageProbe.src = imageUrl;
    renderProduct();
    showToast("تمت إضافة الصورة");
});
$("areaSelect").addEventListener("change", event => { state.areaId = event.target.value; renderProduct(); });
$("zoomIn").addEventListener("click", () => { state.zoom = Math.min(1.4, state.zoom + .1); $("productCanvas").style.transform = `scale(${state.zoom})`; $("zoomValue").textContent = `${Math.round(state.zoom * 100)}%`; });
$("zoomOut").addEventListener("click", () => { state.zoom = Math.max(.7, state.zoom - .1); $("productCanvas").style.transform = `scale(${state.zoom})`; $("zoomValue").textContent = `${Math.round(state.zoom * 100)}%`; });
$("fitButton").addEventListener("click", () => { state.zoom = 1; $("productCanvas").style.transform = "scale(1)"; $("zoomValue").textContent = "100%"; });
$("undoButton").addEventListener("click", () => { removeUploadedImage(); state.hasDesign = false; state.text = ""; renderProduct(); showToast("تم التراجع"); });
$("redoButton").addEventListener("click", () => showToast("لا توجد تغييرات لإعادتها"));
$("saveButton").addEventListener("click", () => { sessionStorage.setItem("palprintsDesignerState", JSON.stringify(state)); showToast("تم حفظ التصميم"); });
$("previewButton").addEventListener("click", () => showToast("المعاينة جاهزة"));

function clamp(value, minimum, maximum) { return Math.min(maximum, Math.max(minimum, value)); }

function constrainImagePosition() {
    if (!state.imageUrl) return;
    const zone = $("printZone");
    const layer = $("imageLayer");
    const angle = Math.abs(Number(state.imageRotation) * Math.PI / 180);
    const rotatedWidth = Math.abs(layer.offsetWidth * Math.cos(angle)) + Math.abs(layer.offsetHeight * Math.sin(angle));
    const rotatedHeight = Math.abs(layer.offsetWidth * Math.sin(angle)) + Math.abs(layer.offsetHeight * Math.cos(angle));
    const horizontalPadding = Math.min(50, (rotatedWidth / zone.clientWidth) * 50);
    const verticalPadding = Math.min(50, (rotatedHeight / zone.clientHeight) * 50);
    state.imageX = clamp(Number(state.imageX), horizontalPadding, 100 - horizontalPadding);
    state.imageY = clamp(Number(state.imageY), verticalPadding, 100 - verticalPadding);
}

function constrainTextPosition() {
    const zone = $("printZone");
    const layer = $("textLayer");
    const angle = Math.abs(Number(state.rotation) * Math.PI / 180);
    const width = layer.offsetWidth;
    const height = layer.offsetHeight;
    const rotatedWidth = Math.abs(width * Math.cos(angle)) + Math.abs(height * Math.sin(angle));
    const rotatedHeight = Math.abs(width * Math.sin(angle)) + Math.abs(height * Math.cos(angle));
    const horizontalPadding = (rotatedWidth / zone.clientWidth) * 50;
    const verticalPadding = (rotatedHeight / zone.clientHeight) * 50;
    state.textX = clamp(Number(state.textX), horizontalPadding, 100 - horizontalPadding);
    state.textY = clamp(Number(state.textY), verticalPadding, 100 - verticalPadding);
}

let imageDragOffset = null;
$("imageLayer").addEventListener("click", event => { event.stopPropagation(); });
$("imageLayer").addEventListener("pointerdown", event => {
    if (event.target.closest(".image-handle") || !state.imageUrl) return;
    event.preventDefault();
    event.stopPropagation();
    state.imageSelected = true;
    state.textSelected = false;
    const layer = $("imageLayer");
    const zone = $("printZone").getBoundingClientRect();
    const layerRect = layer.getBoundingClientRect();
    imageDragOffset = { x: event.clientX - (layerRect.left + layerRect.width / 2), y: event.clientY - (layerRect.top + layerRect.height / 2), zone, width: layerRect.width, height: layerRect.height };
    layer.setPointerCapture(event.pointerId);
    renderProduct();
});
$("imageLayer").addEventListener("pointermove", event => {
    if (!imageDragOffset) return;
    const { zone, width, height } = imageDragOffset;
    const centerX = clamp(event.clientX - imageDragOffset.x, zone.left + width / 2, zone.right - width / 2);
    const centerY = clamp(event.clientY - imageDragOffset.y, zone.top + height / 2, zone.bottom - height / 2);
    state.imageX = ((centerX - zone.left) / zone.width) * 100;
    state.imageY = ((centerY - zone.top) / zone.height) * 100;
    renderProduct();
});
$("imageLayer").addEventListener("pointerup", event => {
    imageDragOffset = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
});
function beginImageResize(event, mode) {
    event.preventDefault();
    event.stopPropagation();
    const zone = $("printZone").getBoundingClientRect();
    const layer = $("imageLayer").getBoundingClientRect();
    const centerX = layer.left + layer.width / 2;
    const centerY = layer.top + layer.height / 2;
    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = state.imageWidth;
    const startHeight = state.imageHeight;
    const startDistance = Math.max(1, Math.hypot(startX - centerX, startY - centerY));
    const rotation = Number(state.imageRotation) * Math.PI / 180;
    const move = moveEvent => {
        if (mode === "both") {
            const distance = Math.hypot(moveEvent.clientX - centerX, moveEvent.clientY - centerY);
            const minimumScale = Math.max(10 / startWidth, 10 / startHeight);
            const maximumScale = Math.min(100 / startWidth, 100 / startHeight);
            const scale = clamp(distance / startDistance, minimumScale, maximumScale);
            state.imageWidth = startWidth * scale;
            state.imageHeight = startHeight * scale;
        } else {
            const deltaX = moveEvent.clientX - startX;
            const deltaY = moveEvent.clientY - startY;
            const localX = deltaX * Math.cos(rotation) + deltaY * Math.sin(rotation);
            const localY = -deltaX * Math.sin(rotation) + deltaY * Math.cos(rotation);
            if (mode === "horizontal") state.imageWidth = clamp(startWidth + (localX / zone.width) * 100, 10, 100);
            if (mode === "vertical") state.imageHeight = clamp(startHeight + (localY / zone.height) * 100, 10, 100);
        }
        renderProduct();
    };
    const stop = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", stop); };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
}
$("imageResizeHandle").addEventListener("pointerdown", event => beginImageResize(event, "both"));
$("imageStretchXHandle").addEventListener("pointerdown", event => beginImageResize(event, "horizontal"));
$("imageStretchYHandle").addEventListener("pointerdown", event => beginImageResize(event, "vertical"));
$("imageRotateHandle").addEventListener("pointerdown", event => {
    event.preventDefault();
    event.stopPropagation();
    const layer = $("imageLayer").getBoundingClientRect();
    const centerX = layer.left + layer.width / 2;
    const centerY = layer.top + layer.height / 2;
    const startAngle = Math.atan2(event.clientY - centerY, event.clientX - centerX) * 180 / Math.PI;
    const startRotation = Number(state.imageRotation);
    const move = moveEvent => {
        const angle = Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX) * 180 / Math.PI;
        state.imageRotation = Math.round(startRotation + angle - startAngle);
        renderProduct();
    };
    const stop = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", stop); };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
});
$("imageDeleteHandle").addEventListener("click", event => {
    event.stopPropagation();
    removeUploadedImage();
    renderProduct();
    showToast("تم حذف الصورة");
});
document.addEventListener("keydown", event => {
    if (!state.imageSelected || !["Delete", "Backspace"].includes(event.key) || event.target.closest("input, textarea, select")) return;
    event.preventDefault();
    removeUploadedImage();
    renderProduct();
    showToast("تم حذف الصورة");
});
window.addEventListener("beforeunload", () => { if (state.imageUrl) URL.revokeObjectURL(state.imageUrl); });

let dragOffset = null;
$("textLayer").addEventListener("click", event => {
    event.stopPropagation();
    state.textSelected = true;
    state.imageSelected = false;
    renderProduct();
});
$("textLayer").addEventListener("pointerdown", event => {
    if (event.target.closest(".text-rotate-handle") || !state.text) return;
    event.preventDefault();
    event.stopPropagation();
    const layer = $("textLayer");
    const zone = $("printZone").getBoundingClientRect();
    const layerRect = layer.getBoundingClientRect();
    dragOffset = { x: event.clientX - (layerRect.left + layerRect.width / 2), y: event.clientY - (layerRect.top + layerRect.height / 2), zone };
    layer.setPointerCapture(event.pointerId);
});
document.addEventListener("pointerdown", event => {
    let shouldRender = false;
    if (!event.target.closest("#imageLayer") && state.imageSelected) {
        state.imageSelected = false;
        shouldRender = true;
    }
    if (!$("productCanvas").contains(event.target)) {
        state.textSelected = false;
        shouldRender = true;
    }
    if (shouldRender) renderProduct();
});
$("textLayer").addEventListener("pointermove", event => {
    if (!dragOffset) return;
    const zone = dragOffset.zone;
    const layer = $("textLayer");
    const angle = Math.abs(Number(state.rotation) * Math.PI / 180);
    const rotatedWidth = Math.abs(layer.offsetWidth * Math.cos(angle)) + Math.abs(layer.offsetHeight * Math.sin(angle));
    const rotatedHeight = Math.abs(layer.offsetWidth * Math.sin(angle)) + Math.abs(layer.offsetHeight * Math.cos(angle));
    const centerX = clamp(event.clientX - dragOffset.x, zone.left + rotatedWidth / 2, zone.right - rotatedWidth / 2);
    const centerY = clamp(event.clientY - dragOffset.y, zone.top + rotatedHeight / 2, zone.bottom - rotatedHeight / 2);
    state.textX = ((centerX - zone.left) / zone.width) * 100;
    state.textY = ((centerY - zone.top) / zone.height) * 100;
    renderProduct();
});
$("textLayer").addEventListener("pointerup", event => { dragOffset = null; if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); });
$("textRotateHandle").addEventListener("pointerdown", event => {
    event.preventDefault();
    event.stopPropagation();
    const zone = $("printZone").getBoundingClientRect();
    const layer = $("textLayer").getBoundingClientRect();
    const centerX = layer.left + layer.width / 2;
    const centerY = layer.top + layer.height / 2;
    const startAngle = Math.atan2(event.clientY - centerY, event.clientX - centerX) * 180 / Math.PI;
    const startRotation = Number(state.rotation);
    const move = moveEvent => { const angle = Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX) * 180 / Math.PI; state.rotation = Math.round(startRotation + angle - startAngle); renderProduct(); };
    const stop = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", stop); };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
});

renderAreas(); renderColors(); renderSizes(); renderProduct();
