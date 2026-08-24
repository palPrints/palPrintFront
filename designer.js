const selection = JSON.parse(sessionStorage.getItem("palprintsDesignerSelection") || "null");

const catalog = {
    "product-001": {
        name: "تي شيرت كلاسيكي",
        colorName: { white: "أبيض", black: "أسود", navy: "كحلي", red: "أحمر", green: "أخضر" },
        image: "assets/images/tshirt.webp",
        colors: [{ id: "white", value: "#fff" }, { id: "black", value: "#111" }, { id: "navy", value: "#173b87" }, { id: "red", value: "#d52a3c" }, { id: "green", value: "#2e9b42" }],
        sizes: ["S", "M", "L", "XL", "XXL"],
        areas: [{ id: "front", name: "الأمام", image: "assets/images/printing-areas/tshirt/tshirt-front-removebg-preview.png", dimensions: "28 × 36 سم" }, { id: "back", name: "الخلف", image: "assets/images/printing-areas/tshirt/tshirt-back-removebg-preview.png", dimensions: "28 × 36 سم" }, { id: "right-sleeve", name: "الكم الأيمن", image: "assets/images/printing-areas/tshirt/tshirt-rightSleeve-removebg-preview.png", dimensions: "10 × 12 سم" }, { id: "left-sleeve", name: "الكم الأيسر", image: "assets/images/printing-areas/tshirt/tshirt-leftSleeve-removebg-preview.png", dimensions: "10 × 12 سم" }]
    },
    "product-002": {
        name: "هودي بسيط", colorName: { white: "أبيض", black: "أسود" }, colors: [{ id: "white", value: "#fff", image: "assets/images/hoodie.png" }, { id: "black", value: "#111", image: "assets/images/hoodie-black.png" }], sizes: ["S", "M", "L", "XL"], areas: [{ id: "front", name: "الأمام", image: "assets/images/printing-areas/hoodie/hoodie-front.png", dimensions: "28 × 36 سم" }, { id: "back", name: "الخلف", image: "assets/images/printing-areas/hoodie/hoodie-back.png", dimensions: "28 × 36 سم" }]
    },
    "product-003": { name: "كوب سيراميك", colorName: { white: "أبيض" }, image: "assets/images/cup.webp", colors: [{ id: "white", value: "#fff" }], sizes: ["قياسي"], areas: [{ id: "front", name: "الواجهة", image: "assets/images/cup.webp", dimensions: "20 × 9 سم" }] },
    "product-004": { name: "حقيبة قماشية", colorName: { white: "أبيض" }, image: "assets/images/bag.png", colors: [{ id: "white", value: "#fff" }], sizes: ["قياسي"], areas: [{ id: "front", name: "الأمام", image: "assets/images/bag.png", dimensions: "28 × 30 سم" }, { id: "back", name: "الخلف", image: "assets/images/bag.png", dimensions: "28 × 30 سم" }] },
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
        areas: [{ id: "front", name: "الأمام", image: "assets/images/printing-areas/tshirt/tshirt-front-removebg-preview.png", dimensions: "28 × 36 سم" }, { id: "back", name: "الخلف", image: "assets/images/printing-areas/tshirt/tshirt-back-removebg-preview.png", dimensions: "28 × 36 سم" }, { id: "right-sleeve", name: "الكم الأيمن", image: "assets/images/printing-areas/tshirt/tshirt-rightSleeve-removebg-preview.png", dimensions: "10 × 12 سم" }, { id: "left-sleeve", name: "الكم الأيسر", image: "assets/images/printing-areas/tshirt/tshirt-leftSleeve-removebg-preview.png", dimensions: "10 × 12 سم" }],
        canvasWidth: "min(56%, 455px)",
        canvasMobileWidth: "76%",
        printZone: { top: "31%", left: "32%", width: "36%", height: "36%" }
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
        areas: [{ id: "front", name: "الواجهة", dimensions: "18 × 8 سم" }],
        canvasWidth: "min(56%, 455px)",
        canvasMobileWidth: "76%",
        printZone: { top: "29%", left: "31%", width: "38%", height: "20%" }
    }
};

const product = catalog[selection?.productId] || catalog["product-001"];
const state = { colorId: selection?.colorId || product.colors[0].id, sizeId: selection?.sizeId || product.sizes[0], areaId: selection?.printAreaIds?.[0] || "front", zoom: 1, tool: "upload", hasDesign: false, images: [], selectedImageId: null, nextImageId: 1, texts: [], selectedTextId: null, nextTextId: 1, zoneLabelHidden: false };
const $ = id => document.getElementById(id);
let fontSelectionRequest = 0;

async function loadFont(family, weight = 800, size = 28, sample = "PalPrints تصميم") {
    if (!document.fonts) return;
    const descriptor = `${weight} ${size}px "${family}"`;
    await document.fonts.load(descriptor, sample);
    if (!document.fonts.check(descriptor, sample)) throw new Error(`Font failed to load: ${family}`);
}

async function revealDesignerAfterFontsLoad() {
    try {
        await Promise.all([loadFont("Cairo", 400, 16), loadFont("Cairo", 800, 28)]);
        renderProduct();
    } finally {
        window.clearTimeout(window.palPrintsFontTimeout);
        document.documentElement.classList.remove("fonts-loading");
    }
}

function showToast(message) { const toast = $("toast"); toast.textContent = message; toast.classList.add("show"); setTimeout(() => toast.classList.remove("show"), 2200); }
function activeArea() { return product.areas.find(area => area.id === state.areaId) || product.areas[0]; }
function createImageLayer(image) {
    const layer = document.createElement("div");
    layer.className = "image-layer";
    layer.dataset.imageId = image.id;
    layer.innerHTML = `
        <img class="uploaded-image" alt="تصميم مرفوع" draggable="false">
        <button class="image-handle image-rotate-handle" type="button" data-image-action="rotate" aria-label="تدوير الصورة"><i class="bi bi-arrow-clockwise" aria-hidden="true"></i></button>
        <button class="image-handle image-resize-handle" type="button" data-image-action="resize" aria-label="تغيير حجم الصورة"><i class="bi bi-arrows-angle-expand" aria-hidden="true"></i></button>
        <button class="image-handle image-stretch-x-handle" type="button" data-image-action="stretch-x" aria-label="تمديد الصورة أفقياً"><i class="bi bi-arrows-expand" aria-hidden="true"></i></button>
        <button class="image-handle image-stretch-y-handle" type="button" data-image-action="stretch-y" aria-label="تمديد الصورة عمودياً"><i class="bi bi-arrows-expand-vertical" aria-hidden="true"></i></button>
        <button class="image-handle image-delete-handle" type="button" data-image-action="delete" aria-label="حذف الصورة"><i class="bi bi-trash3" aria-hidden="true"></i></button>
    `;
    $("imageLayers").appendChild(layer);
    return layer;
}
function renderImages() {
    const container = $("imageLayers");
    container.querySelectorAll(".image-layer").forEach(layer => {
        if (!state.images.some(image => String(image.id) === layer.dataset.imageId)) layer.remove();
    });
    state.images.forEach((image, index) => {
        const layer = container.querySelector(`[data-image-id="${image.id}"]`) || createImageLayer(image);
        const imageElement = layer.querySelector(".uploaded-image");
        if (imageElement.src !== image.url) imageElement.src = image.url;
        imageElement.alt = `تصميم مرفوع ${index + 1}`;
        layer.classList.toggle("selected", image.id === state.selectedImageId);
        layer.style.zIndex = image.id === state.selectedImageId ? "2" : "1";
        layer.style.left = `${image.x}%`;
        layer.style.top = `${image.y}%`;
        layer.style.width = `${image.width}%`;
        layer.style.height = `${image.height}%`;
        layer.style.transform = `translate(-50%, -50%) rotate(${image.rotation}deg)`;
        constrainImagePosition(image, layer);
        layer.style.left = `${image.x}%`;
        layer.style.top = `${image.y}%`;
    });
}
function updateImageOverlapIndicators(activeImageId = null) {
    const container = $("imageLayers");
    const layers = [...container.querySelectorAll(".image-layer")];
    container.classList.toggle("dragging", activeImageId !== null);
    layers.forEach(layer => layer.classList.remove("overlapping"));
    if (activeImageId === null) return;
    const activeLayer = layers.find(layer => Number(layer.dataset.imageId) === activeImageId);
    if (!activeLayer) return;
    const activeBounds = activeLayer.getBoundingClientRect();
    layers.forEach(layer => {
        if (layer === activeLayer) return;
        const bounds = layer.getBoundingClientRect();
        const overlaps = activeBounds.left < bounds.right && activeBounds.right > bounds.left && activeBounds.top < bounds.bottom && activeBounds.bottom > bounds.top;
        if (!overlaps) return;
        activeLayer.classList.add("overlapping");
        layer.classList.add("overlapping");
    });
}
function selectedText() {
    return state.texts.find(text => text.id === state.selectedTextId) || null;
}

function createText(content = "") {
    return { id: state.nextTextId++, content, fontFamily: "Cairo", size: 28, color: "#6432f2", align: "center", letterSpacing: 0, lineHeight: 1.2, rotation: 0, x: 50, y: 50 };
}

function ensureSelectedText() {
    let text = selectedText();
    if (text) return text;
    text = createText();
    state.texts.push(text);
    state.selectedTextId = text.id;
    state.selectedImageId = null;
    return text;
}

function createTextLayer(text) {
    const layer = document.createElement("div");
    layer.className = "text-layer";
    layer.dataset.textId = text.id;
    layer.innerHTML = `
        <span class="text-content" dir="auto"></span>
        <button class="text-handle text-rotate-handle" type="button" data-text-action="rotate" aria-label="تدوير النص"><i class="bi bi-arrow-clockwise" aria-hidden="true"></i></button>
    `;
    $("textLayers").appendChild(layer);
    return layer;
}

function fitTextLayer(text, layer) {
    if (!text.content) return;
    const zone = $("printZone");
    const content = layer.querySelector(".text-content");
    const styles = getComputedStyle(content);
    const measuringCanvas = fitTextLayer.measuringCanvas || (fitTextLayer.measuringCanvas = document.createElement("canvas"));
    const context = measuringCanvas.getContext("2d");
    context.font = `${styles.fontWeight} ${styles.fontSize} ${styles.fontFamily}`;
    const letterSpacing = Number(text.letterSpacing) || 0;
    const naturalWidth = Math.max(...text.content.split("\n").map(line => context.measureText(line || " ").width + Math.max(0, line.length - 1) * letterSpacing));
    const layerWidth = clamp(Math.ceil(naturalWidth + 22), 28, Math.max(28, zone.clientWidth - 8));
    layer.style.width = `${layerWidth}px`;
    layer.style.height = "auto";
    const layerStyles = getComputedStyle(layer);
    const verticalSpacing = Number.parseFloat(layerStyles.paddingTop) + Number.parseFloat(layerStyles.paddingBottom) + Number.parseFloat(layerStyles.borderTopWidth) + Number.parseFloat(layerStyles.borderBottomWidth);
    const layerHeight = Math.min(Math.ceil(content.offsetHeight + verticalSpacing), Math.max(20, zone.clientHeight - 16));
    layer.style.height = `${layerHeight}px`;
}

function renderTexts() {
    const container = $("textLayers");
    container.querySelectorAll(".text-layer").forEach(layer => {
        if (!state.texts.some(text => String(text.id) === layer.dataset.textId)) layer.remove();
    });
    state.texts.forEach(text => {
        const layer = container.querySelector(`[data-text-id="${text.id}"]`) || createTextLayer(text);
        const content = layer.querySelector(".text-content");
        layer.hidden = !text.content;
        if (!text.content) return;
        layer.classList.toggle("selected", text.id === state.selectedTextId);
        layer.style.zIndex = text.id === state.selectedTextId ? "4" : "3";
        content.textContent = text.content;
        layer.style.left = "0";
        layer.style.top = "0";
        layer.style.fontSize = `${text.size}px`;
        layer.style.fontFamily = `"${text.fontFamily}", sans-serif`;
        content.style.fontFamily = `"${text.fontFamily}", sans-serif`;
        layer.style.color = text.color;
        layer.style.textAlign = text.align;
        content.style.letterSpacing = `${Number(text.letterSpacing) || 0}px`;
        layer.style.lineHeight = text.lineHeight;
        layer.style.transform = "none";
        fitTextLayer(text, layer);
        constrainTextPosition(text, layer);
        layer.style.left = `calc(${text.x}% - ${layer.offsetWidth / 2}px)`;
        layer.style.top = `calc(${text.y}% - ${layer.offsetHeight / 2}px)`;
        layer.style.transform = `rotate(${text.rotation}deg)`;
    });
    const text = selectedText();
    if (text) {
        $("positionX").value = Math.round(text.x);
        $("positionY").value = Math.round(text.y);
        $("rotation").value = text.rotation;
    }
}
function renderProduct() {
    $("canvasProductName").textContent = product.name;
    $("productName").value = product.name;
    $("canvasVariant").textContent = `اللون: ${product.colorName[state.colorId] || product.colorName[product.colors[0].id]} · المقاس: ${state.sizeId}`;
    const productCanvas = $("productCanvas");
    if (product.canvasWidth) productCanvas.style.setProperty("--product-canvas-width", product.canvasWidth); else productCanvas.style.removeProperty("--product-canvas-width");
    if (product.canvasMobileWidth) productCanvas.style.setProperty("--product-canvas-mobile-width", product.canvasMobileWidth); else productCanvas.style.removeProperty("--product-canvas-mobile-width");
    const activeColor = product.colors.find(color => color.id === state.colorId) || product.colors[0];
    $("productImage").src = activeColor.image || product.image;
    $("productImage").alt = product.name;
    const area = activeArea();
    $("areaDimensions").textContent = area.dimensions;
    const printZone = $("printZone");
    printZone.style.top = product.printZone?.top || "";
    printZone.style.left = product.printZone?.left || "";
    printZone.style.width = product.printZone?.width || "";
    printZone.style.height = product.printZone?.height || "";
    state.hasDesign = Boolean(state.images.length || state.texts.some(text => text.content));
    document.querySelector(".zone-badge").hidden = state.hasDesign || state.zoneLabelHidden;
    renderImages();
    renderTexts();
    const hasSelection = state.selectedImageId !== null || state.selectedTextId !== null;
    $("selectionActions").hidden = !hasSelection;
    $("selectionActionLabel").textContent = state.selectedImageId !== null ? "الصورة المحددة" : "النص المحدد";
}
function renderAreas() { const select = $("areaSelect"); select.innerHTML = product.areas.map(area => `<option value="${area.id}">${area.name}</option>`).join(""); select.value = state.areaId; }
function renderColors() { $("swatches").innerHTML = product.colors.map(color => `<button class="swatch ${color.id === state.colorId ? "active" : ""}" type="button" data-color="${color.id}" style="background:${color.value}" aria-label="${product.colorName[color.id]}"></button>`).join(""); document.querySelectorAll("[data-color]").forEach(button => button.addEventListener("click", () => { state.colorId = button.dataset.color; renderColors(); renderProduct(); showToast(`تم اختيار اللون ${product.colorName[state.colorId]}`); })); }
function renderSizes() { $("sizes").innerHTML = product.sizes.map(size => `<button class="size-button ${size === state.sizeId ? "active" : ""}" type="button" data-size="${size}">${size}</button>`).join(""); document.querySelectorAll("[data-size]").forEach(button => button.addEventListener("click", () => { state.sizeId = button.dataset.size; renderSizes(); renderProduct(); })); }

function addDesign() { state.hasDesign = true; renderProduct(); showToast("تمت إضافة عنصر جاهز"); }

function syncTextControls(text = selectedText()) {
    const values = text || { content: "", fontFamily: "Cairo", size: 28, color: "#6432f2", align: "center", letterSpacing: 0, lineHeight: 1.2, rotation: 0, x: 50, y: 50 };
    $("textContent").value = values.content;
    $("fontFamily").value = values.fontFamily;
    $("fontFamily").style.setProperty("--selected-font", `"${values.fontFamily}"`);
    $("textSize").value = values.size;
    $("textColor").value = values.color;
    $("letterSpacing").value = values.letterSpacing;
    $("lineHeight").value = values.lineHeight;
    $("rotation").value = values.rotation;
    $("positionX").value = values.x;
    $("positionY").value = values.y;
    document.querySelectorAll("[data-align]").forEach(button => button.classList.toggle("active", button.dataset.align === values.align));
}

function openTextPanel(startNew = false) {
    if (startNew) {
        state.selectedTextId = null;
        state.selectedImageId = null;
    } else if (!selectedText()) {
        const latestText = [...state.texts].reverse().find(text => text.content);
        state.selectedTextId = latestText?.id || null;
        if (latestText) state.selectedImageId = null;
    }
    state.zoneLabelHidden = true;
    syncTextControls();
    renderProduct();
    setDetailsMode("text");
    $("textContent").focus();
}

function setDetailsMode(mode) {
    const textMode = mode === "text";
    $("textPanel").hidden = !textMode;
    document.querySelector(".details-panel").classList.toggle("text-mode", textMode);
    document.querySelectorAll("[data-details-mode]").forEach(button => {
        const active = button.dataset.detailsMode === mode;
        button.classList.toggle("active", active);
        button.setAttribute("aria-selected", String(active));
    });
}

function closeTextPanel() { state.selectedTextId = null; state.zoneLabelHidden = state.texts.some(text => text.content); setDetailsMode("product"); renderProduct(); }

function removeUploadedImage(imageId = state.selectedImageId) {
    const imageIndex = state.images.findIndex(image => image.id === imageId);
    if (imageIndex < 0) return;
    const [removedImage] = state.images.splice(imageIndex, 1);
    if (!state.images.some(image => image.url === removedImage.url)) URL.revokeObjectURL(removedImage.url);
    state.selectedImageId = state.images.at(-1)?.id || null;
}

function clearUploadedImages() {
    new Set(state.images.map(image => image.url)).forEach(url => URL.revokeObjectURL(url));
    state.images = [];
    state.selectedImageId = null;
    $("imageUpload").value = "";
}

function removeText(textId = state.selectedTextId) {
    const textIndex = state.texts.findIndex(text => text.id === textId);
    if (textIndex < 0) return;
    state.texts.splice(textIndex, 1);
    state.selectedTextId = state.texts.at(-1)?.id || null;
    syncTextControls();
}

function duplicateSelectedDesign() {
    if (state.selectedImageId !== null) {
        const image = state.images.find(item => item.id === state.selectedImageId);
        if (!image) return;
        const duplicate = { ...image, id: state.nextImageId++, x: clamp(Number(image.x) + 4, 0, 100), y: clamp(Number(image.y) + 4, 0, 100) };
        state.images.push(duplicate);
        state.selectedImageId = duplicate.id;
        state.selectedTextId = null;
        setDetailsMode("product");
        renderProduct();
        showToast("تم تكرار الصورة");
        return;
    }
    const text = selectedText();
    if (text) {
        const duplicate = { ...text, id: state.nextTextId++, x: clamp(Number(text.x) + 4, 0, 100), y: clamp(Number(text.y) + 4, 0, 100) };
        state.texts.push(duplicate);
        state.selectedTextId = duplicate.id;
        syncTextControls(duplicate);
        renderProduct();
        showToast("تم تكرار النص");
        return;
    }
    showToast("حدد صورة أو نصاً أولاً");
}

function deleteSelectedDesign() {
    if (state.selectedImageId !== null) {
        removeUploadedImage();
        renderProduct();
        showToast("تم حذف الصورة");
        return;
    }
    if (state.selectedTextId !== null) {
        removeText();
        renderProduct();
        showToast("تم حذف النص");
        return;
    }
    showToast("حدد صورة أو نصاً أولاً");
}

document.querySelectorAll("[data-tool]").forEach(button => button.addEventListener("click", () => { state.tool = button.dataset.tool; document.querySelectorAll("[data-tool]").forEach(item => item.classList.toggle("active", item === button)); if (state.tool === "upload") $("imageUpload").click(); else if (state.tool === "text") openTextPanel(true); else addDesign(); }));
document.querySelectorAll("[data-details-mode]").forEach(button => button.addEventListener("click", () => { if (button.dataset.detailsMode === "text") openTextPanel(); else closeTextPanel(); }));
$("textContent").addEventListener("input", event => { const text = ensureSelectedText(); text.content = event.target.value; renderProduct(); });
$("fontFamily").addEventListener("change", async event => {
    const select = event.currentTarget;
    const nextFontFamily = select.value;
    const text = ensureSelectedText();
    const textId = text.id;
    const requestId = ++fontSelectionRequest;
    select.setAttribute("aria-busy", "true");
    try {
        await loadFont(nextFontFamily, 800, text.size, text.content || "PalPrints تصميم");
        if (requestId !== fontSelectionRequest) return;
        const targetText = state.texts.find(item => item.id === textId);
        if (!targetText) return;
        targetText.fontFamily = nextFontFamily;
        if (state.selectedTextId === textId) select.style.setProperty("--selected-font", `"${nextFontFamily}"`);
        renderProduct();
    } catch {
        if (requestId !== fontSelectionRequest) return;
        select.value = selectedText()?.fontFamily || "Cairo";
        showToast("تعذر تحميل الخط المحدد");
    } finally {
        if (requestId === fontSelectionRequest) select.removeAttribute("aria-busy");
    }
});
$("textSize").addEventListener("input", event => { ensureSelectedText().size = event.target.value; renderProduct(); });
$("textColor").addEventListener("input", event => { ensureSelectedText().color = event.target.value; renderProduct(); });
$("letterSpacing").addEventListener("input", event => { ensureSelectedText().letterSpacing = event.target.value; renderProduct(); });
$("lineHeight").addEventListener("input", event => { ensureSelectedText().lineHeight = event.target.value; renderProduct(); });
$("rotation").addEventListener("input", event => { ensureSelectedText().rotation = event.target.value; renderProduct(); });
$("positionX").addEventListener("input", event => { ensureSelectedText().x = clamp(Number(event.target.value), 0, 100); renderProduct(); });
$("positionY").addEventListener("input", event => { ensureSelectedText().y = clamp(Number(event.target.value), 0, 100); renderProduct(); });
document.querySelectorAll("[data-align]").forEach(button => button.addEventListener("click", () => { const text = ensureSelectedText(); text.align = button.dataset.align; document.querySelectorAll("[data-align]").forEach(item => item.classList.toggle("active", item === button)); renderProduct(); }));
$("addTextButton").addEventListener("click", () => { const text = ensureSelectedText(); text.content = $("textContent").value.trim() || "تصميمك"; $("textContent").value = text.content; renderProduct(); showToast("تمت إضافة النص إلى التصميم"); });
$("duplicateText").addEventListener("click", duplicateSelectedDesign);
$("deleteText").addEventListener("click", deleteSelectedDesign);
$("imageUpload").addEventListener("change", event => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { showToast("يرجى اختيار ملف صورة"); event.target.value = ""; return; }
    const imageUrl = URL.createObjectURL(file);
    const imageId = state.nextImageId++;
    const offset = (state.images.length % 4) * 4;
    const uploadedImage = { id: imageId, url: imageUrl, x: 50 + offset, y: 50 + offset, width: 70, height: 70, rotation: 0 };
    state.images.push(uploadedImage);
    state.selectedImageId = imageId;
    state.selectedTextId = null;
    setDetailsMode("product");
    event.target.value = "";
    const imageProbe = new Image();
    imageProbe.onload = () => {
        const image = state.images.find(item => item.id === imageId && item.url === imageUrl);
        if (!image) return;
        const imageRatio = imageProbe.naturalWidth / imageProbe.naturalHeight;
        image.width = imageRatio >= 1 ? 70 : 70 * imageRatio;
        image.height = imageRatio >= 1 ? 70 / imageRatio : 70;
        renderProduct();
    };
    imageProbe.onerror = () => {
        if (!state.images.some(item => item.id === imageId && item.url === imageUrl)) return;
        removeUploadedImage(imageId);
        renderProduct();
        showToast("تعذر تحميل الصورة");
    };
    imageProbe.src = imageUrl;
    renderProduct();
    showToast("تمت إضافة الصورة");
});
$("areaSelect").addEventListener("change", event => { state.areaId = event.target.value; renderProduct(); });
$("zoomIn").addEventListener("click", () => { state.zoom = Math.min(1.4, state.zoom + .1); $("productCanvas").style.transform = `scale(${state.zoom})`; $("zoomValue").textContent = `${Math.round(state.zoom * 100)}%`; });
$("zoomOut").addEventListener("click", () => { state.zoom = Math.max(.7, state.zoom - .1); $("productCanvas").style.transform = `scale(${state.zoom})`; $("zoomValue").textContent = `${Math.round(state.zoom * 100)}%`; });
$("fitButton").addEventListener("click", () => { state.zoom = 1; $("productCanvas").style.transform = "scale(1)"; $("zoomValue").textContent = "100%"; });
$("undoButton").addEventListener("click", () => { clearUploadedImages(); state.texts = []; state.selectedTextId = null; state.hasDesign = false; syncTextControls(); renderProduct(); showToast("تم التراجع"); });
$("redoButton").addEventListener("click", () => showToast("لا توجد تغييرات لإعادتها"));
$("saveButton").addEventListener("click", () => { sessionStorage.setItem("palprintsDesignerState", JSON.stringify(state)); showToast("تم حفظ التصميم"); });
$("previewButton").addEventListener("click", () => showToast("المعاينة جاهزة"));

function clamp(value, minimum, maximum) { return Math.min(maximum, Math.max(minimum, value)); }

function getPrintZoneBounds() {
    const zone = $("printZone");
    const bounds = zone.getBoundingClientRect();
    const scaleX = bounds.width / zone.offsetWidth;
    const scaleY = bounds.height / zone.offsetHeight;
    const left = bounds.left + zone.clientLeft * scaleX;
    const top = bounds.top + zone.clientTop * scaleY;
    const width = zone.clientWidth * scaleX;
    const height = zone.clientHeight * scaleY;
    return { left, top, width, height, right: left + width, bottom: top + height };
}

function constrainImagePosition(image, layer) {
    if (!image || !layer) return;
    const zone = $("printZone");
    const angle = Math.abs(Number(image.rotation) * Math.PI / 180);
    const rotatedWidth = Math.abs(layer.offsetWidth * Math.cos(angle)) + Math.abs(layer.offsetHeight * Math.sin(angle));
    const rotatedHeight = Math.abs(layer.offsetWidth * Math.sin(angle)) + Math.abs(layer.offsetHeight * Math.cos(angle));
    const horizontalPadding = Math.min(50, (rotatedWidth / zone.clientWidth) * 50);
    const verticalPadding = Math.min(50, (rotatedHeight / zone.clientHeight) * 50);
    image.x = clamp(Number(image.x), horizontalPadding, 100 - horizontalPadding);
    image.y = clamp(Number(image.y), verticalPadding, 100 - verticalPadding);
}

function constrainTextPosition(text, layer) {
    if (!text || !layer) return;
    const zone = $("printZone");
    const angle = Math.abs(Number(text.rotation) * Math.PI / 180);
    const width = layer.offsetWidth;
    const height = layer.offsetHeight;
    const rotatedWidth = Math.abs(width * Math.cos(angle)) + Math.abs(height * Math.sin(angle));
    const rotatedHeight = Math.abs(width * Math.sin(angle)) + Math.abs(height * Math.cos(angle));
    const horizontalPadding = Math.min(50, (rotatedWidth / zone.clientWidth) * 50);
    const verticalPadding = Math.min(50, (rotatedHeight / zone.clientHeight) * 50);
    text.x = clamp(Number(text.x), horizontalPadding, 100 - horizontalPadding);
    text.y = clamp(Number(text.y), verticalPadding, 100 - verticalPadding);
}

let imageDragOffset = null;
const imageLayers = $("imageLayers");
imageLayers.addEventListener("click", event => {
    const layer = event.target.closest(".image-layer");
    if (!layer) return;
    event.stopPropagation();
    const imageId = Number(layer.dataset.imageId);
    if (event.target.closest('[data-image-action="delete"]')) {
        removeUploadedImage(imageId);
        renderProduct();
        showToast("تم حذف الصورة");
        return;
    }
    state.selectedImageId = imageId;
    state.selectedTextId = null;
    setDetailsMode("product");
    renderProduct();
});
imageLayers.addEventListener("pointerdown", event => {
    const layer = event.target.closest(".image-layer");
    if (!layer) return;
    const image = state.images.find(item => item.id === Number(layer.dataset.imageId));
    if (!image) return;
    state.selectedImageId = image.id;
    state.selectedTextId = null;
    setDetailsMode("product");
    const action = event.target.closest("[data-image-action]")?.dataset.imageAction;
    if (action === "resize") return beginImageResize(event, "both", image, layer);
    if (action === "stretch-x") return beginImageResize(event, "horizontal", image, layer);
    if (action === "stretch-y") return beginImageResize(event, "vertical", image, layer);
    if (action === "rotate") return beginImageRotation(event, image, layer);
    if (action === "delete") return;
    event.preventDefault();
    event.stopPropagation();
    const zone = getPrintZoneBounds();
    const layerRect = layer.getBoundingClientRect();
    imageDragOffset = { imageId: image.id, x: event.clientX - (layerRect.left + layerRect.width / 2), y: event.clientY - (layerRect.top + layerRect.height / 2), zone, width: layerRect.width, height: layerRect.height };
    layer.setPointerCapture(event.pointerId);
    renderProduct();
    updateImageOverlapIndicators(image.id);
});
imageLayers.addEventListener("pointermove", event => {
    if (!imageDragOffset) return;
    const image = state.images.find(item => item.id === imageDragOffset.imageId);
    if (!image) return;
    const { zone, width, height } = imageDragOffset;
    const centerX = clamp(event.clientX - imageDragOffset.x, zone.left + width / 2, zone.right - width / 2);
    const centerY = clamp(event.clientY - imageDragOffset.y, zone.top + height / 2, zone.bottom - height / 2);
    image.x = ((centerX - zone.left) / zone.width) * 100;
    image.y = ((centerY - zone.top) / zone.height) * 100;
    renderProduct();
    updateImageOverlapIndicators(image.id);
});
function finishImageDrag(event) {
    const layer = event.target.closest(".image-layer");
    imageDragOffset = null;
    if (layer?.hasPointerCapture(event.pointerId)) layer.releasePointerCapture(event.pointerId);
    updateImageOverlapIndicators();
}
imageLayers.addEventListener("pointerup", finishImageDrag);
imageLayers.addEventListener("pointercancel", finishImageDrag);
function beginImageResize(event, mode, image, layerElement) {
    event.preventDefault();
    event.stopPropagation();
    const zone = getPrintZoneBounds();
    const layer = layerElement.getBoundingClientRect();
    const centerX = layer.left + layer.width / 2;
    const centerY = layer.top + layer.height / 2;
    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = image.width;
    const startHeight = image.height;
    const startDistance = Math.max(1, Math.hypot(startX - centerX, startY - centerY));
    const rotation = Number(image.rotation) * Math.PI / 180;
    updateImageOverlapIndicators(image.id);
    const move = moveEvent => {
        if (mode === "both") {
            const distance = Math.hypot(moveEvent.clientX - centerX, moveEvent.clientY - centerY);
            const minimumScale = Math.max(10 / startWidth, 10 / startHeight);
            const maximumScale = Math.min(100 / startWidth, 100 / startHeight);
            const scale = clamp(distance / startDistance, minimumScale, maximumScale);
            image.width = startWidth * scale;
            image.height = startHeight * scale;
        } else {
            const deltaX = moveEvent.clientX - startX;
            const deltaY = moveEvent.clientY - startY;
            const localX = deltaX * Math.cos(rotation) + deltaY * Math.sin(rotation);
            const localY = -deltaX * Math.sin(rotation) + deltaY * Math.cos(rotation);
            if (mode === "horizontal") image.width = clamp(startWidth + (localX / zone.width) * 100, 10, 100);
            if (mode === "vertical") image.height = clamp(startHeight + (localY / zone.height) * 100, 10, 100);
        }
        renderProduct();
        updateImageOverlapIndicators(image.id);
    };
    const stop = () => { updateImageOverlapIndicators(); window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", stop); };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
}
function beginImageRotation(event, image, layerElement) {
    event.preventDefault();
    event.stopPropagation();
    const layer = layerElement.getBoundingClientRect();
    const centerX = layer.left + layer.width / 2;
    const centerY = layer.top + layer.height / 2;
    const startAngle = Math.atan2(event.clientY - centerY, event.clientX - centerX) * 180 / Math.PI;
    const startRotation = Number(image.rotation);
    updateImageOverlapIndicators(image.id);
    const move = moveEvent => {
        const angle = Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX) * 180 / Math.PI;
        image.rotation = Math.round(startRotation + angle - startAngle);
        renderProduct();
        updateImageOverlapIndicators(image.id);
    };
    const stop = () => { updateImageOverlapIndicators(); window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", stop); };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
}
document.addEventListener("keydown", event => {
    if ((state.selectedImageId === null && state.selectedTextId === null) || !["Delete", "Backspace"].includes(event.key) || event.target.closest("input, textarea, select")) return;
    event.preventDefault();
    deleteSelectedDesign();
});
window.addEventListener("beforeunload", () => { new Set(state.images.map(image => image.url)).forEach(url => URL.revokeObjectURL(url)); });

let textDragOffset = null;
const textLayers = $("textLayers");
textLayers.addEventListener("click", event => {
    const layer = event.target.closest(".text-layer");
    if (!layer) return;
    event.stopPropagation();
    state.selectedTextId = Number(layer.dataset.textId);
    state.selectedImageId = null;
    syncTextControls();
    setDetailsMode("text");
    renderProduct();
});
textLayers.addEventListener("pointerdown", event => {
    const layer = event.target.closest(".text-layer");
    if (!layer) return;
    const text = state.texts.find(item => item.id === Number(layer.dataset.textId));
    if (!text) return;
    state.selectedTextId = text.id;
    state.selectedImageId = null;
    if (event.target.closest('[data-text-action="rotate"]')) return beginTextRotation(event, text, layer);
    if (!event.target.closest(".text-content")) return;
    event.preventDefault();
    event.stopPropagation();
    const zone = getPrintZoneBounds();
    const layerRect = layer.getBoundingClientRect();
    textDragOffset = { textId: text.id, x: event.clientX - (layerRect.left + layerRect.width / 2), y: event.clientY - (layerRect.top + layerRect.height / 2), zone };
    layer.setPointerCapture(event.pointerId);
    renderProduct();
});
document.addEventListener("pointerdown", event => {
    let shouldRender = false;
    if (!event.target.closest(".image-layer") && !event.target.closest("#selectionActions") && state.selectedImageId !== null) {
        state.selectedImageId = null;
        shouldRender = true;
    }
    if (!event.target.closest(".text-layer") && !event.target.closest("#textPanel") && !event.target.closest("#selectionActions") && state.selectedTextId !== null) {
        state.selectedTextId = null;
        shouldRender = true;
    }
    if (shouldRender) renderProduct();
});
textLayers.addEventListener("pointermove", event => {
    if (!textDragOffset) return;
    const text = state.texts.find(item => item.id === textDragOffset.textId);
    const layer = textLayers.querySelector(`[data-text-id="${textDragOffset.textId}"]`);
    if (!text || !layer) return;
    const zone = textDragOffset.zone;
    const layerBounds = layer.getBoundingClientRect();
    const rotatedWidth = layerBounds.width;
    const rotatedHeight = layerBounds.height;
    const centerX = clamp(event.clientX - textDragOffset.x, zone.left + rotatedWidth / 2, zone.right - rotatedWidth / 2);
    const centerY = clamp(event.clientY - textDragOffset.y, zone.top + rotatedHeight / 2, zone.bottom - rotatedHeight / 2);
    text.x = ((centerX - zone.left) / zone.width) * 100;
    text.y = ((centerY - zone.top) / zone.height) * 100;
    renderProduct();
});
function finishTextDrag(event) {
    const layer = event.target.closest(".text-layer");
    textDragOffset = null;
    if (layer?.hasPointerCapture(event.pointerId)) layer.releasePointerCapture(event.pointerId);
}
textLayers.addEventListener("pointerup", finishTextDrag);
textLayers.addEventListener("pointercancel", finishTextDrag);
function beginTextRotation(event, text, layerElement) {
    event.preventDefault();
    event.stopPropagation();
    const layer = layerElement.getBoundingClientRect();
    const centerX = layer.left + layer.width / 2;
    const centerY = layer.top + layer.height / 2;
    const startAngle = Math.atan2(event.clientY - centerY, event.clientX - centerX) * 180 / Math.PI;
    const startRotation = Number(text.rotation);
    const move = moveEvent => { const angle = Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX) * 180 / Math.PI; text.rotation = Math.round(startRotation + angle - startAngle); renderProduct(); };
    const stop = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", stop); };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
}

renderAreas(); renderColors(); renderSizes(); renderProduct(); revealDesignerAfterFontsLoad();
