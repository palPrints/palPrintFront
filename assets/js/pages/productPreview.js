(function () {
  "use strict";

  const SESSION_KEY = "palprintsCustomerPreview";
  const CART_KEY = "palprints-product-cart";
  const ALLOWED_TONES = new Set([
    "hoodie-tone--cream",
    "hoodie-tone--black",
    "hoodie-tone--pink",
    "hoodie-tone--purple",
    "hoodie-tone--blue",
    "hoodie-tone--green"
  ]);
  const DARK_TONES = new Set([
    "hoodie-tone--black",
    "hoodie-tone--purple",
    "hoodie-tone--blue",
    "hoodie-tone--green"
  ]);
  const ALLOWED_ICONS = new Set([
    "tree-fill",
    "flower2",
    "emoji-smile",
    "rocket-takeoff",
    "moon-stars-fill",
    "leaf",
    "emoji-laughing",
    "stars"
  ]);

  const elements = {
    viewTabs: document.getElementById("viewTabs"),
    productCanvas: document.getElementById("productCanvas"),
    productImage: document.getElementById("productImage"),
    designPlacement: document.getElementById("designPlacement"),
    designArt: document.getElementById("designArt"),
    imagePlaceholder: document.getElementById("imagePlaceholder"),
    currentViewBadge: document.getElementById("currentViewBadge"),
    colorOptions: document.getElementById("colorOptions"),
    selectedColorName: document.getElementById("selectedColorName"),
    sizeOptions: document.getElementById("sizeOptions"),
    selectedSizeName: document.getElementById("selectedSizeName"),
    quantityValue: document.getElementById("quantityValue"),
    decreaseQuantity: document.getElementById("decreaseQuantity"),
    increaseQuantity: document.getElementById("increaseQuantity"),
    printAreaOptions: document.getElementById("printAreaOptions"),
    printAreaError: document.getElementById("printAreaError"),
    priceBreakdown: document.getElementById("priceBreakdown"),
    totalPrice: document.getElementById("totalPrice"),
    mobileTotalPrice: document.getElementById("mobileTotalPrice"),
    summaryTitle: document.getElementById("summaryTitle"),
    designMeta: document.getElementById("designMeta"),
    summaryValidation: document.getElementById("summaryValidation"),
    customerWarnings: document.getElementById("customerWarnings"),
    zoomOut: document.getElementById("zoomOut"),
    zoomIn: document.getElementById("zoomIn"),
    zoomValue: document.getElementById("zoomValue"),
    fitPreview: document.getElementById("fitPreview"),
    openFullscreen: document.getElementById("openFullscreen"),
    fullscreenDialog: document.getElementById("fullscreenDialog"),
    fullscreenTitle: document.getElementById("fullscreenTitle"),
    fullscreenStage: document.getElementById("fullscreenStage"),
    closeFullscreen: document.getElementById("closeFullscreen"),
    addToCartButton: document.getElementById("addToCartButton"),
    mobileAddToCart: document.getElementById("mobileAddToCart"),
    toast: document.getElementById("previewToast"),
    toastIcon: document.querySelector("#previewToast .preview-toast-icon i"),
    toastMessage: document.getElementById("previewToastMessage"),
    cartBadge: document.getElementById("cartBadge")
  };

  if (!elements.productCanvas) return;

  function createFallbackPayload() {
    return {
      version: 1,
      product: {
        id: "hoodie-classic",
        name: "هودي رجال / نساء",
        sellingPrice: 20,
        currency: "ILS",
        colors: [
          { id: "cream", name: "كريمي", value: "#eee6d6", image: "assets/images/hoodie.png", toneClass: "hoodie-tone--cream" },
          { id: "black", name: "أسود", value: "#151719", image: "assets/images/hoodie.png", toneClass: "hoodie-tone--black" },
          { id: "pink", name: "وردي", value: "#d9a6a9", image: "assets/images/hoodie.png", toneClass: "hoodie-tone--pink" },
          { id: "purple", name: "بنفسجي", value: "#76758d", image: "assets/images/hoodie.png", toneClass: "hoodie-tone--purple" },
          { id: "blue", name: "أزرق", value: "#7f9eb7", image: "assets/images/hoodie.png", toneClass: "hoodie-tone--blue" },
          { id: "green", name: "أخضر", value: "#45605b", image: "assets/images/hoodie.png", toneClass: "hoodie-tone--green" }
        ],
        sizes: ["S", "M", "L", "XL", "XXL"].map(function (name) { return { id: name.toLowerCase(), name: name }; }),
        printAreas: [
          { id: "front", name: "الأمام", image: "assets/images/hoodie.png", fee: 5, placement: { top: 25, left: 29, width: 42, height: 42 } },
          { id: "back", name: "الخلف", image: "assets/images/hoodie-back-clean.png", fee: 5, placement: { top: 26, left: 30, width: 40, height: 42 } }
        ]
      },
      design: {
        id: "salam",
        name: "سلام دائم",
        designerName: "Omar K",
        preview: {
          images: [],
          texts: [
            { content: "سلام", fontFamily: "Cairo", color: "#ffffff", autoContrast: true, x: 50, y: 63, width: 82, size: 30, rotation: 0, layerOrder: 2 }
          ],
          icons: [
            { name: "flower2", color: "#ffffff", autoContrast: true, x: 50, y: 33, size: 28, rotation: 0, layerOrder: 1 }
          ]
        }
      },
      selection: { colorId: "black", sizeId: "m", quantity: 1, printAreaIds: ["front"] },
      customerWarnings: []
    };
  }

  function safeString(value, fallback, maximum) {
    const text = typeof value === "string" ? value.trim() : "";
    return (text || fallback).slice(0, maximum || 120);
  }

  function safeNumber(value, fallback, minimum, maximum) {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    return Math.min(maximum, Math.max(minimum, number));
  }

  function safeImageSource(value, fallback) {
    const source = typeof value === "string" ? value.trim() : "";
    if (/^(assets\/|data:image\/(?:png|jpe?g|webp|gif);base64,|https:\/\/)/i.test(source)) return source;
    return fallback;
  }

  function normalizePayload(candidate) {
    const fallback = createFallbackPayload();
    if (!candidate || candidate.version !== 1 || !candidate.product || !candidate.design) return fallback;

    const rawProduct = candidate.product;
    const rawColors = Array.isArray(rawProduct.colors) ? rawProduct.colors : [];
    const colors = rawColors.map(function (color, index) {
      const fallbackColor = fallback.product.colors[index % fallback.product.colors.length];
      return {
        id: safeString(color && color.id, fallbackColor.id, 40),
        name: safeString(color && color.name, fallbackColor.name, 40),
        value: /^#[0-9a-f]{6}$/i.test(color && color.value) ? color.value : fallbackColor.value,
        image: safeImageSource(color && color.image, fallbackColor.image),
        toneClass: ALLOWED_TONES.has(color && color.toneClass) ? color.toneClass : fallbackColor.toneClass
      };
    }).filter(function (color, index, list) {
      return list.findIndex(function (item) { return item.id === color.id; }) === index;
    });

    const rawSizes = Array.isArray(rawProduct.sizes) ? rawProduct.sizes : [];
    const sizes = rawSizes.map(function (size, index) {
      const fallbackSize = fallback.product.sizes[index % fallback.product.sizes.length];
      return {
        id: safeString(size && size.id, fallbackSize.id, 24),
        name: safeString(size && size.name, fallbackSize.name, 24)
      };
    }).filter(function (size, index, list) {
      return list.findIndex(function (item) { return item.id === size.id; }) === index;
    });

    const rawAreas = Array.isArray(rawProduct.printAreas) ? rawProduct.printAreas : [];
    const areas = rawAreas.map(function (area, index) {
      const fallbackArea = fallback.product.printAreas[index % fallback.product.printAreas.length];
      const placement = area && area.placement ? area.placement : fallbackArea.placement;
      return {
        id: safeString(area && area.id, fallbackArea.id, 40),
        name: safeString(area && area.name, fallbackArea.name, 50),
        image: safeImageSource(area && area.image, fallbackArea.image),
        fee: safeNumber(area && area.fee, fallbackArea.fee, 0, 9999),
        placement: {
          top: safeNumber(placement.top, fallbackArea.placement.top, 0, 100),
          left: safeNumber(placement.left, fallbackArea.placement.left, 0, 100),
          width: safeNumber(placement.width, fallbackArea.placement.width, 5, 100),
          height: safeNumber(placement.height, fallbackArea.placement.height, 5, 100)
        }
      };
    }).filter(function (area, index, list) {
      return list.findIndex(function (item) { return item.id === area.id; }) === index;
    });

    const design = candidate.design;
    const preview = design.preview || {};
    const images = (Array.isArray(preview.images) ? preview.images : []).slice(0, 12).map(function (item) {
      return {
        src: safeImageSource(item && item.src, ""),
        alt: safeString(item && item.alt, "عنصر من التصميم", 100),
        x: safeNumber(item && item.x, 50, 0, 100),
        y: safeNumber(item && item.y, 50, 0, 100),
        width: safeNumber(item && item.width, 50, 1, 100),
        height: safeNumber(item && item.height, 50, 1, 100),
        rotation: safeNumber(item && item.rotation, 0, -360, 360),
        layerOrder: safeNumber(item && item.layerOrder, 1, 0, 100)
      };
    }).filter(function (item) { return Boolean(item.src); });

    const texts = (Array.isArray(preview.texts) ? preview.texts : []).slice(0, 20).map(function (item) {
      return {
        content: safeString(item && item.content, "", 300),
        fontFamily: item && item.fontFamily === "Cairo" ? "Cairo" : "Cairo",
        color: /^#[0-9a-f]{6}$/i.test(item && item.color) ? item.color : "#ffffff",
        autoContrast: Boolean(item && item.autoContrast),
        x: safeNumber(item && item.x, 50, 0, 100),
        y: safeNumber(item && item.y, 50, 0, 100),
        width: safeNumber(item && item.width, 70, 5, 100),
        size: safeNumber(item && item.size, 24, 8, 80),
        rotation: safeNumber(item && item.rotation, 0, -360, 360),
        layerOrder: safeNumber(item && item.layerOrder, 1, 0, 100)
      };
    }).filter(function (item) { return Boolean(item.content); });

    const icons = (Array.isArray(preview.icons) ? preview.icons : []).slice(0, 20).map(function (item) {
      return {
        name: ALLOWED_ICONS.has(item && item.name) ? item.name : "stars",
        color: /^#[0-9a-f]{6}$/i.test(item && item.color) ? item.color : "#ffffff",
        autoContrast: Boolean(item && item.autoContrast),
        x: safeNumber(item && item.x, 50, 0, 100),
        y: safeNumber(item && item.y, 50, 0, 100),
        size: safeNumber(item && item.size, 28, 8, 80),
        rotation: safeNumber(item && item.rotation, 0, -360, 360),
        layerOrder: safeNumber(item && item.layerOrder, 1, 0, 100)
      };
    });

    const product = {
      id: safeString(rawProduct.id, fallback.product.id, 80),
      name: safeString(rawProduct.name, fallback.product.name, 100),
      sellingPrice: safeNumber(rawProduct.sellingPrice, 20, 0, 999999),
      currency: rawProduct.currency === "ILS" ? "ILS" : "ILS",
      colors: colors.length ? colors : fallback.product.colors,
      sizes: sizes.length ? sizes : fallback.product.sizes,
      printAreas: areas.length ? areas : fallback.product.printAreas
    };

    const rawSelection = candidate.selection || {};
    const validColorId = product.colors.some(function (color) { return color.id === rawSelection.colorId; }) ? rawSelection.colorId : product.colors[0].id;
    const validSizeId = product.sizes.some(function (size) { return size.id === rawSelection.sizeId; }) ? rawSelection.sizeId : product.sizes[0].id;
    const requestedAreaIds = Array.isArray(rawSelection.printAreaIds) ? rawSelection.printAreaIds : [];
    const validAreaIds = product.printAreas.filter(function (area) { return requestedAreaIds.includes(area.id); }).map(function (area) { return area.id; });

    return {
      version: 1,
      product: product,
      design: {
        id: safeString(design.id, fallback.design.id, 80),
        name: safeString(design.name, fallback.design.name, 100),
        designerName: safeString(design.designerName, fallback.design.designerName, 100),
        preview: { images: images, texts: texts, icons: icons }
      },
      selection: {
        colorId: validColorId,
        sizeId: validSizeId,
        quantity: Math.round(safeNumber(rawSelection.quantity, 1, 1, 99)),
        printAreaIds: validAreaIds.length ? validAreaIds : [product.printAreas[0].id]
      },
      customerWarnings: (Array.isArray(candidate.customerWarnings) ? candidate.customerWarnings : []).slice(0, 10).map(function (warning) {
        return {
          message: safeString(warning && (warning.message || warning.text), "", 240),
          customerVisible: Boolean(warning && warning.customerVisible),
          blocking: Boolean(warning && (warning.blocking || warning.severity === "error"))
        };
      }).filter(function (warning) { return warning.message; })
    };
  }

  function readPayload() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      return normalizePayload(raw ? JSON.parse(raw) : null);
    } catch (error) {
      return createFallbackPayload();
    }
  }

  const payload = readPayload();
  const state = {
    colorId: payload.selection.colorId,
    sizeId: payload.selection.sizeId,
    quantity: payload.selection.quantity,
    printAreaIds: new Set(payload.selection.printAreaIds),
    currentAreaId: payload.selection.printAreaIds[0],
    zoom: 1,
    fullscreenOpener: null,
    toastTimer: null,
    buttonTimer: null
  };

  function currentColor() {
    return payload.product.colors.find(function (color) { return color.id === state.colorId; });
  }

  function currentArea() {
    return payload.product.printAreas.find(function (area) { return area.id === state.currentAreaId; }) || payload.product.printAreas[0];
  }

  function selectedAreas() {
    return payload.product.printAreas.filter(function (area) { return state.printAreaIds.has(area.id); });
  }

  function formatMoney(value) {
    return new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value) + " ₪";
  }

  function pricing() {
    const areaFees = selectedAreas().map(function (area) {
      return { id: area.id, name: area.name, fee: area.fee };
    });
    const feesTotal = areaFees.reduce(function (total, area) { return total + area.fee; }, 0);
    const unitPrice = payload.product.sellingPrice + feesTotal;
    return { areaFees: areaFees, feesTotal: feesTotal, unitPrice: unitPrice, total: unitPrice * state.quantity };
  }

  function setText(element, text) {
    if (element) element.textContent = text;
  }

  function designColor(layer) {
    if (!layer.autoContrast) return layer.color;
    const color = currentColor();
    return color && DARK_TONES.has(color.toneClass) ? "#ffffff" : "#0b1f3a";
  }

  function renderArtwork(container) {
    container.replaceChildren();
    payload.design.preview.images.forEach(function (item) {
      const image = document.createElement("img");
      image.className = "preview-design-item preview-design-image";
      image.src = item.src;
      image.alt = item.alt;
      image.style.left = item.x + "%";
      image.style.top = item.y + "%";
      image.style.width = item.width + "%";
      image.style.height = item.height + "%";
      image.style.transform = "translate(-50%, -50%) rotate(" + item.rotation + "deg)";
      image.style.zIndex = String(item.layerOrder);
      container.appendChild(image);
    });

    payload.design.preview.texts.forEach(function (item) {
      const text = document.createElement("span");
      text.className = "preview-design-item preview-design-text";
      text.textContent = item.content;
      text.style.left = item.x + "%";
      text.style.top = item.y + "%";
      text.style.width = item.width + "%";
      text.style.fontSize = item.size + "px";
      text.style.fontFamily = item.fontFamily + ", sans-serif";
      text.style.color = designColor(item);
      text.style.transform = "translate(-50%, -50%) rotate(" + item.rotation + "deg)";
      text.style.zIndex = String(item.layerOrder);
      container.appendChild(text);
    });

    payload.design.preview.icons.forEach(function (item) {
      const icon = document.createElement("i");
      icon.className = "bi bi-" + item.name + " preview-design-item preview-design-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.style.left = item.x + "%";
      icon.style.top = item.y + "%";
      icon.style.fontSize = item.size + "px";
      icon.style.color = designColor(item);
      icon.style.transform = "translate(-50%, -50%) rotate(" + item.rotation + "deg)";
      icon.style.zIndex = String(item.layerOrder);
      container.appendChild(icon);
    });

    if (!container.children.length) {
      const placeholder = document.createElement("span");
      placeholder.className = "preview-design-placeholder";
      placeholder.textContent = "التصميم غير متاح للمعاينة";
      container.appendChild(placeholder);
    }
  }

  function renderProductCanvas() {
    const area = currentArea();
    const color = currentColor();
    const selected = state.printAreaIds.has(area.id);
    const source = area.image || (color && color.image);

    elements.productImage.hidden = false;
    elements.productImage.className = "preview-product-image " + (color ? color.toneClass : "");
    elements.productImage.alt = payload.product.name + " — " + area.name;
    elements.productImage.onload = function () {
      elements.imagePlaceholder.hidden = true;
      elements.productImage.hidden = false;
      elements.designPlacement.hidden = !selected;
    };
    elements.productImage.onerror = function () {
      elements.productImage.hidden = true;
      elements.designPlacement.hidden = true;
      elements.imagePlaceholder.hidden = false;
    };
    elements.productImage.src = source;

    elements.designPlacement.style.top = area.placement.top + "%";
    elements.designPlacement.style.left = area.placement.left + "%";
    elements.designPlacement.style.width = area.placement.width + "%";
    elements.designPlacement.style.height = area.placement.height + "%";
    elements.designPlacement.hidden = !selected;
    renderArtwork(elements.designArt);

    elements.productCanvas.style.setProperty("--preview-zoom", String(state.zoom));
    elements.currentViewBadge.classList.toggle("is-unselected", !selected);
    setText(elements.currentViewBadge, area.name + " · " + (selected ? "محددة للطباعة" : "غير محددة للطباعة"));
  }

  function renderViewTabs() {
    elements.viewTabs.replaceChildren();
    payload.product.printAreas.forEach(function (area) {
      const button = document.createElement("button");
      const image = document.createElement("img");
      const label = document.createElement("span");
      const color = currentColor();
      const isCurrent = area.id === state.currentAreaId;
      button.type = "button";
      button.className = "view-tab" + (state.printAreaIds.has(area.id) ? "" : " is-unselected");
      button.dataset.areaId = area.id;
      button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", String(isCurrent));
      button.setAttribute("aria-label", "عرض " + area.name + (state.printAreaIds.has(area.id) ? "، محددة للطباعة" : "، غير محددة للطباعة"));
      image.src = area.image || (color && color.image);
      image.alt = "";
      image.className = color ? color.toneClass : "";
      image.onerror = function () { image.hidden = true; };
      label.textContent = area.name;
      button.append(image, label);
      elements.viewTabs.appendChild(button);
    });
  }

  function renderColors() {
    elements.colorOptions.replaceChildren();
    payload.product.colors.forEach(function (color) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "color-option" + (color.id === state.colorId ? " is-selected" : "");
      button.dataset.colorId = color.id;
      button.style.setProperty("--color-value", color.value);
      button.setAttribute("aria-label", "اللون " + color.name);
      button.setAttribute("aria-pressed", String(color.id === state.colorId));
      button.title = color.name;
      elements.colorOptions.appendChild(button);
    });
    const color = currentColor();
    setText(elements.selectedColorName, color ? color.name : "غير محدد");
  }

  function renderSizes() {
    elements.sizeOptions.replaceChildren();
    payload.product.sizes.forEach(function (size) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "size-option" + (size.id === state.sizeId ? " is-selected" : "");
      button.dataset.sizeId = size.id;
      button.textContent = size.name;
      button.setAttribute("aria-pressed", String(size.id === state.sizeId));
      elements.sizeOptions.appendChild(button);
    });
    const size = payload.product.sizes.find(function (item) { return item.id === state.sizeId; });
    setText(elements.selectedSizeName, size ? size.name : "غير محدد");
  }

  function renderQuantity() {
    setText(elements.quantityValue, String(state.quantity));
    elements.decreaseQuantity.disabled = state.quantity <= 1;
    elements.increaseQuantity.disabled = state.quantity >= 99;
  }

  function renderPrintAreas() {
    elements.printAreaOptions.replaceChildren();
    payload.product.printAreas.forEach(function (area) {
      const selected = state.printAreaIds.has(area.id);
      const button = document.createElement("button");
      const image = document.createElement("img");
      const body = document.createElement("span");
      const name = document.createElement("strong");
      const fee = document.createElement("small");
      const color = currentColor();
      button.type = "button";
      button.className = "print-area-option" + (selected ? " is-selected" : "");
      button.dataset.areaId = area.id;
      button.setAttribute("aria-pressed", String(selected));
      button.setAttribute("aria-label", (selected ? "إلغاء " : "اختيار ") + area.name + " برسوم " + formatMoney(area.fee));
      image.src = area.image || (color && color.image);
      image.alt = "";
      image.className = color ? color.toneClass : "";
      image.onerror = function () { image.hidden = true; };
      body.className = "print-area-option__body";
      name.textContent = area.name;
      fee.textContent = "+" + formatMoney(area.fee);
      body.append(name, fee);
      button.append(image, body);
      elements.printAreaOptions.appendChild(button);
    });
  }

  function addPriceRow(label, value, className) {
    const row = document.createElement("div");
    const labelElement = document.createElement("span");
    const valueElement = document.createElement("strong");
    row.className = "price-line" + (className ? " " + className : "");
    labelElement.textContent = label;
    valueElement.textContent = value;
    row.append(labelElement, valueElement);
    elements.priceBreakdown.appendChild(row);
  }

  function renderPrice() {
    const result = pricing();
    elements.priceBreakdown.replaceChildren();
    addPriceRow("سعر المنتج", formatMoney(payload.product.sellingPrice));
    result.areaFees.forEach(function (area) {
      addPriceRow("طباعة " + area.name, "+" + formatMoney(area.fee));
    });
    addPriceRow("سعر الوحدة", formatMoney(result.unitPrice), "is-unit");
    if (state.quantity > 1) addPriceRow("الكمية", "× " + state.quantity);
    setText(elements.totalPrice, formatMoney(result.total));
    setText(elements.mobileTotalPrice, formatMoney(result.total));
  }

  function visibleWarnings() {
    return payload.customerWarnings.filter(function (warning) { return warning.customerVisible; });
  }

  function renderWarnings() {
    const warnings = visibleWarnings();
    elements.customerWarnings.replaceChildren();
    elements.customerWarnings.hidden = warnings.length === 0;
    warnings.forEach(function (warning) {
      const item = document.createElement("li");
      const icon = document.createElement("i");
      const text = document.createElement("span");
      item.className = warning.blocking ? "is-blocking" : "";
      icon.className = "bi " + (warning.blocking ? "bi-exclamation-octagon" : "bi-exclamation-triangle");
      icon.setAttribute("aria-hidden", "true");
      text.textContent = warning.message;
      item.append(icon, text);
      elements.customerWarnings.appendChild(item);
    });
  }

  function validationMessage() {
    if (!currentColor()) return "اختر لون المنتج للمتابعة.";
    if (!payload.product.sizes.some(function (size) { return size.id === state.sizeId; })) return "اختر المقاس للمتابعة.";
    if (state.printAreaIds.size === 0) return "اختر منطقة طباعة واحدة على الأقل.";
    if (visibleWarnings().some(function (warning) { return warning.blocking; })) return "عالج التحذير الظاهر قبل الإضافة إلى السلة.";
    return "";
  }

  function renderValidation() {
    const message = validationMessage();
    elements.summaryValidation.hidden = !message;
    setText(elements.summaryValidation, message);
    elements.addToCartButton.disabled = Boolean(message);
    elements.mobileAddToCart.disabled = Boolean(message);
  }

  function renderZoom() {
    elements.productCanvas.style.setProperty("--preview-zoom", String(state.zoom));
    setText(elements.zoomValue, Math.round(state.zoom * 100) + "%");
    elements.zoomOut.disabled = state.zoom <= 0.8;
    elements.zoomIn.disabled = state.zoom >= 1.5;
  }

  function renderMeta() {
    setText(elements.summaryTitle, payload.product.name);
    setText(elements.designMeta, payload.design.name + " · تصميم: " + payload.design.designerName);
    setText(elements.fullscreenTitle, "معاينة " + payload.design.name + " على " + payload.product.name);
  }

  function syncSession() {
    payload.selection = {
      colorId: state.colorId,
      sizeId: state.sizeId,
      quantity: state.quantity,
      printAreaIds: selectedAreas().map(function (area) { return area.id; })
    };
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(payload)); } catch (error) { /* Preview still works without storage. */ }
  }

  function renderAll() {
    renderMeta();
    renderViewTabs();
    renderProductCanvas();
    renderColors();
    renderSizes();
    renderQuantity();
    renderPrintAreas();
    renderPrice();
    renderWarnings();
    renderValidation();
    renderZoom();
    syncSession();
  }

  function showToast(message, type) {
    clearTimeout(state.toastTimer);
    elements.toast.className = "preview-toast is-visible " + (type === "error" ? "is-error" : "is-success");
    elements.toastIcon.className = "bi " + (type === "error" ? "bi-exclamation-lg" : "bi-check2");
    setText(elements.toastMessage, message);
    state.toastTimer = window.setTimeout(function () {
      elements.toast.classList.remove("is-visible");
    }, 3200);
  }

  function updateCartBadge(cart) {
    const count = cart.reduce(function (total, item) {
      return total + safeNumber(item && item.quantity, 0, 0, 9999);
    }, 0);
    setText(elements.cartBadge, String(count));
    elements.cartBadge.hidden = count === 0;
  }

  function readCart() {
    try {
      const parsed = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function setAddButtonSuccess() {
    clearTimeout(state.buttonTimer);
    [elements.addToCartButton, elements.mobileAddToCart].forEach(function (button) {
      button.classList.add("is-success");
      button.dataset.originalLabel = button.textContent.trim();
      button.replaceChildren();
      const icon = document.createElement("i");
      const text = document.createTextNode(" تمت الإضافة");
      icon.className = "bi bi-check2";
      icon.setAttribute("aria-hidden", "true");
      button.append(icon, text);
    });
    state.buttonTimer = window.setTimeout(function () {
      elements.addToCartButton.classList.remove("is-success");
      elements.mobileAddToCart.classList.remove("is-success");
      elements.addToCartButton.replaceChildren();
      elements.mobileAddToCart.replaceChildren();
      const desktopIcon = document.createElement("i");
      desktopIcon.className = "bi bi-cart-plus";
      desktopIcon.setAttribute("aria-hidden", "true");
      elements.addToCartButton.append(desktopIcon, document.createTextNode(" إضافة إلى السلة"));
      const mobileIcon = document.createElement("i");
      mobileIcon.className = "bi bi-cart-plus";
      mobileIcon.setAttribute("aria-hidden", "true");
      elements.mobileAddToCart.append(mobileIcon, document.createTextNode(" إضافة إلى السلة"));
    }, 1800);
  }

  function addToCart() {
    const errorMessage = validationMessage();
    if (errorMessage) {
      showToast(errorMessage, "error");
      return;
    }

    const cart = readCart();
    const selectedIds = selectedAreas().map(function (area) { return area.id; });
    const result = pricing();
    const matching = cart.find(function (item) {
      const itemAreaIds = Array.isArray(item && item.printAreaIds) ? item.printAreaIds : [];
      return item && item.kind === "custom-product" &&
        item.productId === payload.product.id &&
        item.designId === payload.design.id &&
        item.colorId === state.colorId &&
        item.sizeId === state.sizeId &&
        itemAreaIds.length === selectedIds.length &&
        itemAreaIds.every(function (id, index) { return id === selectedIds[index]; });
    });

    if (matching) {
      matching.quantity = Math.min(99, safeNumber(matching.quantity, 0, 0, 99) + state.quantity);
      matching.pricing = matching.pricing && typeof matching.pricing === "object" ? matching.pricing : {};
      matching.pricing.sellingPrice = payload.product.sellingPrice;
      matching.pricing.areaFees = result.areaFees;
      matching.pricing.unitPrice = result.unitPrice;
      matching.pricing.total = result.unitPrice * matching.quantity;
      matching.pricing.currency = payload.product.currency;
      matching.updatedAt = new Date().toISOString();
    } else {
      const color = currentColor();
      const size = payload.product.sizes.find(function (item) { return item.id === state.sizeId; });
      const area = currentArea();
      cart.push({
        id: "custom-product-" + Date.now(),
        kind: "custom-product",
        productId: payload.product.id,
        productName: payload.product.name,
        designId: payload.design.id,
        designName: payload.design.name,
        designerName: payload.design.designerName,
        colorId: state.colorId,
        colorName: color.name,
        sizeId: state.sizeId,
        sizeName: size.name,
        quantity: state.quantity,
        printAreaIds: selectedIds,
        printAreas: result.areaFees,
        pricing: {
          sellingPrice: payload.product.sellingPrice,
          areaFees: result.areaFees,
          unitPrice: result.unitPrice,
          total: result.total,
          currency: payload.product.currency
        },
        previewSnapshot: {
          areaId: area.id,
          image: area.image || color.image,
          toneClass: color.toneClass,
          designPreview: payload.design.preview
        },
        createdAt: new Date().toISOString()
      });
    }

    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      updateCartBadge(cart);
      setAddButtonSuccess();
      showToast(matching && matching.quantity === 99 ? "تم تحديث العنصر في السلة حتى الحد الأقصى 99." : "تمت إضافة المنتج إلى السلة بنجاح.", "success");
    } catch (error) {
      showToast("تعذر حفظ السلة على هذا المتصفح. حاول مرة أخرى.", "error");
    }
  }

  function renderFullscreen() {
    const clone = elements.productCanvas.cloneNode(true);
    clone.removeAttribute("id");
    clone.querySelectorAll("[id]").forEach(function (node) { node.removeAttribute("id"); });
    clone.style.setProperty("--preview-zoom", "1");
    elements.fullscreenStage.replaceChildren(clone);
  }

  elements.viewTabs.addEventListener("click", function (event) {
    const button = event.target.closest("[data-area-id]");
    if (!button) return;
    state.currentAreaId = button.dataset.areaId;
    renderViewTabs();
    renderProductCanvas();
  });

  elements.colorOptions.addEventListener("click", function (event) {
    const button = event.target.closest("[data-color-id]");
    if (!button) return;
    state.colorId = button.dataset.colorId;
    renderColors();
    renderViewTabs();
    renderPrintAreas();
    renderProductCanvas();
    syncSession();
  });

  elements.sizeOptions.addEventListener("click", function (event) {
    const button = event.target.closest("[data-size-id]");
    if (!button) return;
    state.sizeId = button.dataset.sizeId;
    renderSizes();
    renderValidation();
    syncSession();
  });

  elements.printAreaOptions.addEventListener("click", function (event) {
    const button = event.target.closest("[data-area-id]");
    if (!button) return;
    const id = button.dataset.areaId;
    if (state.printAreaIds.has(id) && state.printAreaIds.size === 1) {
      elements.printAreaError.hidden = false;
      setText(elements.printAreaError, "يجب إبقاء منطقة طباعة واحدة على الأقل.");
      showToast("يجب إبقاء منطقة طباعة واحدة على الأقل.", "error");
      return;
    }
    elements.printAreaError.hidden = true;
    state.currentAreaId = id;
    if (state.printAreaIds.has(id)) state.printAreaIds.delete(id);
    else state.printAreaIds.add(id);
    renderPrintAreas();
    renderViewTabs();
    renderProductCanvas();
    renderPrice();
    renderValidation();
    syncSession();
  });

  elements.decreaseQuantity.addEventListener("click", function () {
    state.quantity = Math.max(1, state.quantity - 1);
    renderQuantity();
    renderPrice();
    syncSession();
  });

  elements.increaseQuantity.addEventListener("click", function () {
    state.quantity = Math.min(99, state.quantity + 1);
    renderQuantity();
    renderPrice();
    syncSession();
  });

  elements.zoomOut.addEventListener("click", function () {
    state.zoom = Math.max(0.8, Math.round((state.zoom - 0.1) * 10) / 10);
    renderZoom();
  });

  elements.zoomIn.addEventListener("click", function () {
    state.zoom = Math.min(1.5, Math.round((state.zoom + 0.1) * 10) / 10);
    renderZoom();
  });

  elements.fitPreview.addEventListener("click", function () {
    state.zoom = 1;
    renderZoom();
  });

  elements.openFullscreen.addEventListener("click", function () {
    state.fullscreenOpener = document.activeElement;
    renderFullscreen();
    if (typeof elements.fullscreenDialog.showModal === "function") elements.fullscreenDialog.showModal();
    elements.closeFullscreen.focus();
  });

  elements.closeFullscreen.addEventListener("click", function () { elements.fullscreenDialog.close(); });
  elements.fullscreenDialog.addEventListener("click", function (event) {
    if (event.target !== elements.fullscreenDialog) return;
    const rect = elements.fullscreenDialog.getBoundingClientRect();
    const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
    if (!inside) elements.fullscreenDialog.close();
  });
  elements.fullscreenDialog.addEventListener("close", function () {
    if (state.fullscreenOpener && typeof state.fullscreenOpener.focus === "function") state.fullscreenOpener.focus();
  });

  elements.addToCartButton.addEventListener("click", addToCart);
  elements.mobileAddToCart.addEventListener("click", addToCart);

  updateCartBadge(readCart());
  renderAll();
})();
