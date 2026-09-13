(function initializeDesignStudioShell(window, document) {
  "use strict";

  const STORAGE_KEY = "palprintsDesignerSelection";

  const elements = {
    summaryImage: document.getElementById("summaryImage"),
    summaryProductName: document.getElementById("summaryProductName"),
    summaryColor: document.getElementById("summaryColor"),
    summarySize: document.getElementById("summarySize"),
    summaryPrice: document.getElementById("summaryPrice"),
    selectedColorName: document.getElementById("selectedColorName"),
    colorOptions: document.getElementById("colorOptions"),
    sizeOptions: document.getElementById("sizeOptions"),
    areaOptions: document.getElementById("areaOptions"),
    areaCount: document.getElementById("areaCount"),
    zoneDimensions: document.getElementById("zoneDimensions"),
    workspaceEyebrow: document.getElementById("workspaceEyebrow"),
    productCanvas: document.getElementById("productCanvas"),
    productMockup: document.getElementById("productMockup"),
    printZone: document.getElementById("printZone"),
    toolPanel: document.getElementById("toolPanel"),
    toolPanelContent: document.getElementById("toolPanelContent"),
    error: document.getElementById("studioError"),
    errorMessage: document.getElementById("studioErrorMessage"),
    liveRegion: document.getElementById("studioLiveRegion")
  };

  const toolContent = {
    upload: {
      icon: "bi-cloud-arrow-up",
      title: "رفع صورك إلى التصميم",
      description: "ستتوفر إضافة الصور وإدارة الملفات في المرحلة التالية."
    },
    text: {
      icon: "bi-type",
      title: "إضافة نصوص متعددة",
      description: "ستتوفر كتابة النص وتنسيقه في المرحلة التالية."
    },
    graphics: {
      icon: "bi-images",
      title: "مكتبة الرسومات والعناصر",
      description: "سيتم تفعيل المكتبة المنسقة في مرحلة الرسومات."
    }
  };

  function readSelection() {
    try {
      return JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) || "null");
    } catch (error) {
      return null;
    }
  }

  function validateProduct(product) {
    if (!product || !product.id || !product.editor) {
      return { valid: false, message: "بيانات المنتج المرسلة إلى الاستوديو غير مكتملة." };
    }

    const areas = Array.isArray(product.editor.printAreas)
      ? product.editor.printAreas
      : [];

    if (!areas.length) {
      return { valid: false, message: "لا يحتوي المنتج على منطقة طباعة مهيأة." };
    }

    if (!areas.some(area => area.id === product.editor.defaultAreaId)) {
      return { valid: false, message: "منطقة الطباعة الافتراضية للمنتج غير صالحة." };
    }

    const ids = new Set();

    for (const area of areas) {
      if (!area.id || ids.has(area.id) || typeof area.mockup !== "string" || !area.mockup.trim()) {
        return { valid: false, message: "إحدى مناطق الطباعة تفتقد المعرف أو صورة المنتج." };
      }

      ids.add(area.id);

      const zone = area.printZone || {};
      const left = Number(zone.leftPct);
      const top = Number(zone.topPct);
      const width = Number(zone.widthPct);
      const height = Number(zone.heightPct);
      const physicalWidth = Number(zone.widthCm);
      const physicalHeight = Number(zone.heightCm);
      const values = [left, top, width, height, physicalWidth, physicalHeight];

      const validZone = values.every(Number.isFinite)
        && left >= 0
        && top >= 0
        && width > 0
        && height > 0
        && left + width <= 100
        && top + height <= 100
        && physicalWidth > 0
        && physicalHeight > 0;

      if (!validZone) {
        return { valid: false, message: `بيانات منطقة الطباعة «${area.name || area.id}» غير مكتملة أو غير صالحة.` };
      }
    }

    return { valid: true, message: "" };
  }

  function selectedItem(items, id) {
    return (Array.isArray(items) ? items : []).find(item => item.id === id) || items?.[0] || null;
  }

  function resolveMockup(product, area, color) {
    const colorAreaMockup = color?.areaMockups?.[area.id];
    if (colorAreaMockup) return colorAreaMockup;
    if (["front", "primary"].includes(area.role) && color?.image) return color.image;
    return area.mockup || product.thumbnail || color?.image || "";
  }

  function formatPrice(value) {
    const amount = Number(value);
    return Number.isFinite(amount) ? `${amount.toFixed(2)} ر.س` : "—";
  }

  function announce(message) {
    elements.liveRegion.textContent = "";
    window.setTimeout(() => { elements.liveRegion.textContent = message; }, 20);
  }

  function showError(message) {
    elements.errorMessage.textContent = message;
    elements.error.hidden = false;
  }

  function renderToolPanel(toolName) {
    const content = toolContent[toolName] || toolContent.upload;
    const activeTab = document.querySelector(`[data-studio-tool="${toolName}"]`);

    document.querySelectorAll("[data-studio-tool]").forEach(tab => {
      const isActive = tab === activeTab;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });

    elements.toolPanel.setAttribute("aria-labelledby", activeTab?.id || "uploadTab");
    elements.toolPanelContent.innerHTML = `
      <div>
        <i class="bi ${content.icon}" aria-hidden="true"></i>
        <strong>${content.title}</strong>
        <span>${content.description}</span>
      </div>
    `;
  }

  function setupToolTabs() {
    document.querySelectorAll("[data-studio-tool]").forEach(tab => {
      tab.addEventListener("click", () => {
        renderToolPanel(tab.dataset.studioTool);
        announce(tab.textContent.trim());
      });
    });

    renderToolPanel("upload");
  }

  function renderColors(product, color) {
    elements.colorOptions.innerHTML = "";

    (product.colors || []).forEach(item => {
      const swatch = document.createElement("span");
      swatch.className = `studio-swatch${item.id === color?.id ? " is-active" : ""}`;
      swatch.style.backgroundColor = item.value || "#ffffff";
      swatch.setAttribute("aria-label", item.name || item.id);
      swatch.setAttribute("aria-disabled", "true");
      elements.colorOptions.appendChild(swatch);
    });
  }

  function renderSizes(product, size) {
    elements.sizeOptions.innerHTML = "";

    (product.sizes || []).forEach(item => {
      const chip = document.createElement("span");
      chip.className = `studio-size${item.id === size?.id ? " is-active" : ""}`;
      chip.textContent = item.name || item.id;
      chip.setAttribute("aria-disabled", "true");
      elements.sizeOptions.appendChild(chip);
    });
  }

  function applyArea(product, area, color) {
    const zone = area.printZone;
    const mockup = resolveMockup(product, area, color);

    elements.productMockup.src = mockup;
    elements.productMockup.alt = `${product.name} — ${area.name}`;
    elements.workspaceEyebrow.textContent = area.name;
    elements.zoneDimensions.textContent = `${zone.widthCm} × ${zone.heightCm} سم`;
    elements.printZone.style.setProperty("--zone-left", `${zone.leftPct}%`);
    elements.printZone.style.setProperty("--zone-top", `${zone.topPct}%`);
    elements.printZone.style.setProperty("--zone-width", `${zone.widthPct}%`);
    elements.printZone.style.setProperty("--zone-height", `${zone.heightPct}%`);

    document.querySelectorAll("[data-area-id]").forEach(button => {
      const isActive = button.dataset.areaId === area.id;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", String(isActive));
    });

    announce(`منطقة الطباعة الحالية: ${area.name}`);
  }

  function renderAreas(product, initialArea, color) {
    const areas = product.editor.printAreas;
    elements.areaOptions.innerHTML = "";
    elements.areaCount.textContent = `${areas.length} ${areas.length === 1 ? "جهة" : "جهات"}`;

    areas.forEach(area => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `studio-area${area.id === initialArea.id ? " is-active" : ""}`;
      button.dataset.areaId = area.id;
      button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", String(area.id === initialArea.id));
      button.innerHTML = `<i class="${area.icon || "bi bi-bounding-box"}" aria-hidden="true"></i><span></span>`;
      button.querySelector("span").textContent = area.name;
      button.addEventListener("click", () => applyArea(product, area, color));
      elements.areaOptions.appendChild(button);
    });
  }

  function renderProduct(selection) {
    const product = selection.editorProduct;
    const color = selectedItem(product.colors, selection.colorId);
    const size = selectedItem(product.sizes, selection.sizeId);
    const requestedAreaId = selection.printAreaIds?.find(id => product.editor.printAreas.some(area => area.id === id));
    const initialArea = product.editor.printAreas.find(area => area.id === requestedAreaId)
      || product.editor.printAreas.find(area => area.id === product.editor.defaultAreaId)
      || product.editor.printAreas[0];
    const summaryMockup = resolveMockup(product, initialArea, color);

    elements.summaryImage.src = summaryMockup;
    elements.summaryImage.alt = product.name;
    elements.summaryProductName.textContent = product.name;
    elements.summaryColor.textContent = color?.name || "—";
    elements.summarySize.textContent = size?.name || "—";
    elements.summaryPrice.textContent = formatPrice(product.price);
    elements.selectedColorName.textContent = color?.name || "—";

    const syncProductRatio = () => {
      if (!elements.productMockup.naturalWidth || !elements.productMockup.naturalHeight) return;
      elements.productCanvas.style.setProperty(
        "--studio-product-ratio",
        `${elements.productMockup.naturalWidth} / ${elements.productMockup.naturalHeight}`
      );
    };

    elements.productMockup.addEventListener("load", syncProductRatio);

    renderColors(product, color);
    renderSizes(product, size);
    renderAreas(product, initialArea, color);
    applyArea(product, initialArea, color);

    if (elements.productMockup.complete) syncProductRatio();
  }

  function init() {
    setupToolTabs();

    const selection = readSelection();
    if (!selection) {
      showError("اختر منتجًا مهيأ من صفحة اختيار المنتجات أولًا.");
      return;
    }

    const validation = validateProduct(selection.editorProduct);
    if (!validation.valid) {
      showError(validation.message);
      return;
    }

    renderProduct(selection);
  }

  init();
})(window, document);
