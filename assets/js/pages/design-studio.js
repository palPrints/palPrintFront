(function initializeDesignStudio(window, document) {
  "use strict";

  const SELECTION_KEY = "palprintsDesignerSelection";
  const DESIGN_PREFIX = "palprintsDesign:";
  const FALLBACK_ASSET_PREFIX = "palprintsDesignAsset:";
  const DESKTOP_PRODUCT_HEIGHT_RATIO = 0.94;
  const COMPACT_PRODUCT_HEIGHT_RATIO = 0.7;
  const ALLOWED_UPLOADS = new Set(["image/png", "image/jpeg", "image/svg+xml"]);
  const FONT_FAMILIES = [
    "Cairo", "Tajawal", "Almarai", "Changa", "El Messiri", "Reem Kufi", "Noto Kufi Arabic", "Noto Naskh Arabic",
    "Amiri", "Lateef", "Scheherazade New", "Markazi Text", "Mada", "IBM Plex Sans Arabic", "Harmattan", "Katibeh",
    "Lemonada", "Mirza", "Rakkas", "Aref Ruqaa", "Baloo Bhaijaan 2", "Readex Pro", "Roboto", "Open Sans",
    "Montserrat", "Poppins", "Lato", "Oswald", "Raleway", "Playfair Display", "Merriweather", "Bebas Neue",
    "Anton", "Lobster", "Pacifico", "Dancing Script", "Abril Fatface", "Cinzel", "Nunito", "Inter"
  ];

  const $ = id => document.getElementById(id);
  const elements = {
    summaryImage: $("summaryImage"), summaryProductName: $("summaryProductName"), summaryColor: $("summaryColor"),
    summarySize: $("summarySize"), summaryPrice: $("summaryPrice"), selectedColorName: $("selectedColorName"),
    colorOptions: $("colorOptions"), sizeOptions: $("sizeOptions"), areaOptions: $("areaOptions"), areaCount: $("areaCount"),
    workspaceEyebrow: $("workspaceEyebrow"), stage: $("studioStage"), coordinateSystem: $("stageCoordinateSystem"), productCanvas: $("productCanvas"),
    productMockup: $("productMockup"), printZone: $("printZone"), designCanvas: $("designCanvas"),
    toolPanel: $("toolPanel"), toolPanelContent: $("toolPanelContent"), error: $("studioError"),
    errorMessage: $("studioErrorMessage"), liveRegion: $("studioLiveRegion"), notice: $("studioNotice"), noticeText: $("studioNoticeText"),
    deleteDialog: $("deleteAssetDialog"), deleteThumbnail: $("deleteAssetThumbnail"), deleteMessage: $("deleteAssetMessage"),
    cancelAssetDelete: $("cancelAssetDelete"), confirmAssetDelete: $("confirmAssetDelete")
  };

  const app = {
    selection: null, product: null, color: null, size: null, area: null, design: null, canvas: null, assetStore: null,
    activeTool: "upload", objectUrls: new Map(), fontPromises: new Map(), suppressCanvasEvents: false,
    geometryReady: false, viewportZone: null, logicalStage: null, stageScale: 1, areaSwitchToken: 0,
    persistTimer: null, resizeObserver: null, resizeFrame: null, noticeTimer: null, panelRenderToken: 0,
    pendingAssetFingerprints: new Set()
  };

  class DesignAssetStore {
    constructor(designId) { this.designId = designId; this.dbPromise = this.open(); }
    open() {
      if (!window.indexedDB) return Promise.resolve(null);
      return new Promise(resolve => {
        let finished = false;
        const finish = value => { if (finished) return; finished = true; clearTimeout(timeout); resolve(value); };
        const timeout = setTimeout(() => finish(null), 1800);
        const request = window.indexedDB.open("palprintsStudioAssets", 1);
        request.onupgradeneeded = () => {
          if (!request.result.objectStoreNames.contains("assets")) request.result.createObjectStore("assets", { keyPath: "key" });
        };
        request.onsuccess = () => finish(request.result);
        request.onerror = request.onblocked = () => finish(null);
      });
    }
    key(assetId) { return `${this.designId}:${assetId}`; }
    async putFallback(assetId, blob) {
      const reader = new FileReader();
      const dataUrl = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(blob);
      });
      try { localStorage.setItem(`${FALLBACK_ASSET_PREFIX}${this.key(assetId)}`, dataUrl); }
      catch (error) { /* IndexedDB remains the primary store when quota is unavailable. */ }
    }
    async put(assetId, blob) {
      const db = await this.dbPromise;
      if (db) {
        try {
          await new Promise((resolve, reject) => {
            const request = db.transaction("assets", "readwrite").objectStore("assets").put({ key: this.key(assetId), blob });
            request.onsuccess = resolve; request.onerror = () => reject(request.error);
          });
          if (location.protocol === "file:") await this.putFallback(assetId, blob);
          return;
        } catch (error) {
          // Continue to the isolated prototype fallback if browser storage rejects the blob.
        }
      }
      await this.putFallback(assetId, blob);
    }
    async get(assetId) {
      const db = await this.dbPromise;
      if (db) {
        const blob = await new Promise(resolve => {
          const request = db.transaction("assets").objectStore("assets").get(this.key(assetId));
          request.onsuccess = () => resolve(request.result?.blob || null); request.onerror = () => resolve(null);
        });
        if (blob) return blob;
      }
      const dataUrl = window.localStorage.getItem(`${FALLBACK_ASSET_PREFIX}${this.key(assetId)}`);
      return dataUrl ? fetch(dataUrl).then(response => response.blob()) : null;
    }
    async delete(assetId) {
      const db = await this.dbPromise;
      if (db) await new Promise(resolve => {
        const request = db.transaction("assets", "readwrite").objectStore("assets").delete(this.key(assetId));
        request.onsuccess = request.onerror = resolve;
      });
      window.localStorage.removeItem(`${FALLBACK_ASSET_PREFIX}${this.key(assetId)}`);
    }
  }

  function uid(prefix) { return `${prefix}-${window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`}`; }
  function readSelection() { try { return JSON.parse(window.sessionStorage.getItem(SELECTION_KEY) || "null"); } catch (error) { return null; } }
  function selectedItem(items, id) { return (items || []).find(item => item.id === id) || items?.[0] || null; }
  function formatPrice(value) { const amount = Number(value); return Number.isFinite(amount) ? `${amount.toFixed(2)} ر.س` : "—"; }
  function announce(message) { elements.liveRegion.textContent = ""; setTimeout(() => { elements.liveRegion.textContent = message; }, 20); }
  function showNotice(message, tone = "info") {
    clearTimeout(app.noticeTimer); elements.noticeText.textContent = message; elements.notice.className = `studio-notice is-${tone}`; elements.notice.hidden = false;
    app.noticeTimer = setTimeout(() => { elements.notice.hidden = true; }, 4200);
  }
  function showError(message) { elements.errorMessage.textContent = message; elements.error.hidden = false; }
  function resolveZone(area, size) { return area?.sizePrintZones?.[size?.id] || area?.printZone || null; }
  function resolveMockup(area, color) { return color?.areaMockups?.[area.id] || (["front", "primary"].includes(area.role) && color?.image) || area.mockup || app.product.thumbnail || color?.image || ""; }
  function zonesDiffer(a, b) { return ["leftPct", "topPct", "widthPct", "heightPct", "widthCm", "heightCm"].some(key => Number(a?.[key]) !== Number(b?.[key])); }

  function validateProduct(product) {
    if (!product?.id || !product.editor) return { valid: false, message: "بيانات المنتج المرسلة إلى الاستوديو غير مكتملة." };
    const areas = Array.isArray(product.editor.printAreas) ? product.editor.printAreas : [];
    if (!areas.length || !areas.some(area => area.id === product.editor.defaultAreaId)) return { valid: false, message: "مناطق الطباعة غير مهيأة بصورة صالحة." };
    const ids = new Set();
    for (const area of areas) {
      const zone = area.printZone || {}, values = [zone.leftPct, zone.topPct, zone.widthPct, zone.heightPct, zone.widthCm, zone.heightCm].map(Number);
      const [left, top, width, height, physicalWidth, physicalHeight] = values;
      if (!area.id || ids.has(area.id) || !area.mockup || !values.every(Number.isFinite) || left < 0 || top < 0 || width <= 0 || height <= 0
        || left + width > 100 || top + height > 100 || physicalWidth <= 0 || physicalHeight <= 0) {
        return { valid: false, message: `بيانات منطقة الطباعة «${area.name || area.id || "غير معروفة"}» غير صالحة.` };
      }
      ids.add(area.id);
    }
    return { valid: true, message: "" };
  }

  function setupSiteShell() {
    const menu = $("menuButton"), overlay = $("sidebarOverlay"), mobile = matchMedia("(max-width: 900px)");
    if (!menu || !overlay) return;
    const sync = () => { const open = mobile.matches ? document.body.classList.contains("sidebar-open") : !document.body.classList.contains("sidebar-collapsed"); menu.setAttribute("aria-expanded", String(open)); menu.setAttribute("aria-label", open ? "طي القائمة" : "فتح القائمة"); };
    const close = () => { document.body.classList.remove("sidebar-open"); sync(); };
    menu.addEventListener("click", () => { document.body.classList.toggle(mobile.matches ? "sidebar-open" : "sidebar-collapsed"); sync(); });
    overlay.addEventListener("click", close); document.querySelectorAll(".sidebar a").forEach(link => link.addEventListener("click", () => { if (mobile.matches) close(); }));
    mobile.addEventListener?.("change", close); sync();
  }

  function ensureDesignId(selection) {
    if (!selection.designId) { selection.designId = uid("design"); sessionStorage.setItem(SELECTION_KEY, JSON.stringify(selection)); }
  }
  function createDesign(selection) {
    const areas = {}; selection.editorProduct.editor.printAreas.forEach(area => { areas[area.id] = { objects: [] }; });
    return { schemaVersion: 1, designId: selection.designId, productId: selection.productId, colorId: selection.colorId, sizeId: selection.sizeId,
      activeAreaId: selection.printAreaIds?.[0] || selection.editorProduct.editor.defaultAreaId, assets: [], areas, updatedAt: new Date().toISOString() };
  }
  function uniqueAssetRecords(records) {
    const seen = new Set();
    return (Array.isArray(records) ? records : []).filter(asset => asset?.assetId && !seen.has(asset.assetId) && seen.add(asset.assetId));
  }
  function loadDesign(selection) {
    try {
      const saved = JSON.parse(localStorage.getItem(`${DESIGN_PREFIX}${selection.designId}`) || "null");
      if (saved?.schemaVersion === 1 && saved.productId === selection.productId) {
        saved.assets = uniqueAssetRecords(saved.assets);
        app.product.editor.printAreas.forEach(area => { if (!saved.areas[area.id]) saved.areas[area.id] = { objects: [] }; }); return saved;
      }
    } catch (error) { /* fresh document */ }
    return createDesign(selection);
  }
  function commitDesign() {
    if (!app.design) return;
    Object.assign(app.design, { colorId: app.color?.id, sizeId: app.size?.id, activeAreaId: app.area?.id, updatedAt: new Date().toISOString() });
    localStorage.setItem(`${DESIGN_PREFIX}${app.design.designId}`, JSON.stringify(app.design));
  }
  function scheduleCommit() {
    saveActiveArea();
    clearTimeout(app.persistTimer);
    app.persistTimer = setTimeout(commitDesign, 120);
  }

  function getZoneRect() {
    const root = elements.coordinateSystem.getBoundingClientRect(), zone = elements.printZone.getBoundingClientRect(), scale = app.stageScale || 1;
    return { left: (zone.left - root.left) / scale, top: (zone.top - root.top) / scale, width: zone.width / scale, height: zone.height / scale };
  }
  function objectToModel(object, zone) {
    const common = { id: object.studioId, kind: object.studioKind, x: (object.left - zone.left) / zone.width, y: (object.top - zone.top) / zone.height,
      angle: Number(object.angle) || 0, flipX: Boolean(object.flipX), flipY: Boolean(object.flipY) };
    if (object.studioKind === "image") return { ...common, assetId: object.assetId, width: object.getScaledWidth() / zone.width, height: object.getScaledHeight() / zone.height };
    return { ...common, text: object.text || "", width: object.width / zone.width, fontSize: object.fontSize / zone.height, scaleX: object.scaleX, scaleY: object.scaleY,
      fontFamily: object.fontFamily, fill: object.fill, fontWeight: object.fontWeight, fontStyle: object.fontStyle, textAlign: object.textAlign,
      charSpacing: object.charSpacing, lineHeight: object.lineHeight };
  }
  function saveActiveArea() {
    if (!app.canvas || !app.area || app.suppressCanvasEvents || !app.geometryReady) return;
    const zone = app.viewportZone || getZoneRect();
    app.design.areas[app.area.id].objects = app.canvas.getObjects().map(object => objectToModel(object, zone));
  }
  function configureObject(object, model) {
    object.set({ originX: "center", originY: "center", studioId: model.id, studioKind: model.kind, transparentCorners: false,
      cornerStyle: "circle", cornerColor: "#1677ff", borderColor: "#1677ff", cornerSize: 10 }); object.setCoords(); return object;
  }

  async function assetUrl(assetId) {
    if (app.objectUrls.has(assetId)) return app.objectUrls.get(assetId);
    const blob = await app.assetStore.get(assetId); if (!blob) return null;
    const url = URL.createObjectURL(blob); app.objectUrls.set(assetId, url); return url;
  }
  async function loadFont(family) {
    if (!family || family === "Cairo") return document.fonts?.load(`16px "${family || "Cairo"}"`) || Promise.resolve();
    if (app.fontPromises.has(family)) return app.fontPromises.get(family);
    const promise = new Promise(resolve => {
      const link = document.createElement("link"); link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, "+")}&display=swap`;
      link.onload = () => { document.fonts?.load(`16px "${family}"`).then(resolve).catch(resolve); }; link.onerror = resolve; document.head.appendChild(link);
    });
    app.fontPromises.set(family, promise); return promise;
  }
  async function modelToObject(model, zone) {
    const common = { left: zone.left + model.x * zone.width, top: zone.top + model.y * zone.height, angle: model.angle, flipX: model.flipX, flipY: model.flipY };
    if (model.kind === "image") {
      const url = await assetUrl(model.assetId); if (!url) return null;
      const ImageClass = fabric.FabricImage || fabric.Image, image = await ImageClass.fromURL(url, {}, common);
      image.set({ scaleX: (model.width * zone.width) / image.width, scaleY: (model.height * zone.height) / image.height, assetId: model.assetId });
      return configureObject(image, model);
    }
    await loadFont(model.fontFamily || "Cairo");
    return configureObject(new fabric.Textbox(model.text || "", { ...common, width: Math.max(30, model.width * zone.width), fontSize: Math.max(8, model.fontSize * zone.height),
      scaleX: model.scaleX || 1, scaleY: model.scaleY || 1, fontFamily: model.fontFamily || "Cairo", fill: model.fill || "#0b1f3a",
      fontWeight: model.fontWeight || "normal", fontStyle: model.fontStyle || "normal", textAlign: model.textAlign || "center",
      charSpacing: model.charSpacing || 0, lineHeight: model.lineHeight || 1.2, direction: /[\u0600-\u06ff]/.test(model.text || "") ? "rtl" : "ltr" }), model);
  }
  async function restoreArea(areaId) {
    const token = ++app.areaSwitchToken, models = app.design.areas[areaId]?.objects || [];
    await Promise.all([...new Set(models.filter(item => item.kind === "text").map(item => item.fontFamily).filter(Boolean))].map(loadFont));
    const zone = getZoneRect(), objects = (await Promise.all(models.map(model => modelToObject(model, zone)))).filter(Boolean);
    if (token !== app.areaSwitchToken) return;
    app.suppressCanvasEvents = true; app.canvas.clear(); objects.forEach(object => app.canvas.add(object)); app.canvas.discardActiveObject(); app.canvas.requestRenderAll(); app.suppressCanvasEvents = false;
    app.viewportZone = { ...zone };
  }
  function reflowObjects(models) {
    const zone = getZoneRect(), byId = new Map(models.map(model => [model.id, model]));
    app.canvas.getObjects().forEach(object => {
      const model = byId.get(object.studioId); if (!model) return;
      const values = { left: zone.left + model.x * zone.width, top: zone.top + model.y * zone.height, angle: model.angle };
      if (model.kind === "image") Object.assign(values, { scaleX: (model.width * zone.width) / object.width, scaleY: (model.height * zone.height) / object.height });
      else Object.assign(values, { width: Math.max(30, model.width * zone.width), fontSize: Math.max(8, model.fontSize * zone.height), scaleX: model.scaleX, scaleY: model.scaleY });
      object.set(values); object.setCoords();
    }); app.canvas.requestRenderAll(); app.viewportZone = { ...zone };
  }

  function uniformFitObjects(models, oldZone) {
    const nextZone = getZoneRect(), byId = new Map(models.map(model => [model.id, model]));
    const fit = Math.min(nextZone.width / oldZone.width, nextZone.height / oldZone.height);
    app.canvas.getObjects().forEach(object => {
      const model = byId.get(object.studioId); if (!model) return;
      object.set({ left: nextZone.left + model.x * nextZone.width, top: nextZone.top + model.y * nextZone.height,
        scaleX: object.scaleX * fit, scaleY: object.scaleY * fit });
      object.setCoords();
    });
    app.canvas.requestRenderAll(); app.viewportZone = { ...nextZone };
  }

  function initializeLogicalStage() {
    if (app.logicalStage) return;
    app.logicalStage = { width: elements.stage.clientWidth, height: elements.stage.clientHeight };
    elements.coordinateSystem.style.width = `${app.logicalStage.width}px`;
    elements.coordinateSystem.style.height = `${app.logicalStage.height}px`;
  }
  function updateStageTransform() {
    if (!app.logicalStage) return;
    const width = elements.stage.clientWidth, height = elements.stage.clientHeight;
    const scale = Math.min(width / app.logicalStage.width, height / app.logicalStage.height);
    const offsetX = (width - app.logicalStage.width * scale) / 2, offsetY = (height - app.logicalStage.height * scale) / 2;
    app.stageScale = scale;
    elements.coordinateSystem.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0) scale(${scale})`;
    app.canvas?.calcOffset();
  }
  function measureVisibleBounds() {
    const image = elements.productMockup, scale = Math.min(1, 512 / Math.max(image.naturalWidth, image.naturalHeight));
    const width = Math.max(1, Math.round(image.naturalWidth * scale)), height = Math.max(1, Math.round(image.naturalHeight * scale));
    const canvas = document.createElement("canvas"), context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return { left: 0, top: 0, right: 1, bottom: 1 }; canvas.width = width; canvas.height = height;
    try {
      context.drawImage(image, 0, 0, width, height); const pixels = context.getImageData(0, 0, width, height).data; let minX = width, minY = height, maxX = -1, maxY = -1;
      for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) if (pixels[((y * width) + x) * 4 + 3] > 24) { minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y); }
      if (maxX >= minX) return { left: minX / width, top: minY / height, right: (maxX + 1) / width, bottom: (maxY + 1) / height };
    } catch (error) { /* cross-origin fallback */ }
    return { left: 0, top: 0, right: 1, bottom: 1 };
  }
  function fitProductToStage() {
    const image = elements.productMockup; if (!image.naturalWidth || !image.naturalHeight) return false;
    const style = getComputedStyle(elements.stage), stageWidth = app.logicalStage.width, stageHeight = app.logicalStage.height;
    const availableWidth = stageWidth - parseFloat(style.paddingInlineStart) - parseFloat(style.paddingInlineEnd);
    const bounds = measureVisibleBounds();
    const visibleWidth = image.naturalWidth * (bounds.right - bounds.left), visibleHeight = image.naturalHeight * (bounds.bottom - bounds.top);
    const desktop = matchMedia("(min-width: 901px)").matches;
    const targetHeight = stageHeight * (desktop ? DESKTOP_PRODUCT_HEIGHT_RATIO : COMPACT_PRODUCT_HEIGHT_RATIO);
    const scale = Math.min(targetHeight / visibleHeight, availableWidth / visibleWidth);
    const offsetX = ((image.naturalWidth / 2) - ((bounds.left + bounds.right) / 2) * image.naturalWidth) * scale;
    const offsetY = ((image.naturalHeight / 2) - ((bounds.top + bounds.bottom) / 2) * image.naturalHeight) * scale;
    elements.productCanvas.style.setProperty("--studio-product-ratio", `${image.naturalWidth} / ${image.naturalHeight}`);
    elements.productCanvas.style.width = `${Math.floor(image.naturalWidth * scale)}px`; elements.productCanvas.style.height = `${Math.floor(image.naturalHeight * scale)}px`;
    elements.productCanvas.style.left = `calc(50% + ${offsetX}px)`; elements.productCanvas.style.top = `calc(50% + ${offsetY}px)`; app.geometryReady = true; return true;
  }
  function waitForMockup(image) {
    if (image.complete && image.naturalWidth > 0) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const loaded = () => { cleanup(); resolve(); }, failed = () => { cleanup(); reject(new Error("Mockup failed to load.")); };
      const cleanup = () => { image.removeEventListener("load", loaded); image.removeEventListener("error", failed); };
      image.addEventListener("load", loaded, { once: true }); image.addEventListener("error", failed, { once: true });
    });
  }
  async function loadMockup(area, color) {
    elements.stage.classList.add("is-loading"); elements.stage.setAttribute("aria-busy", "true"); app.geometryReady = false;
    elements.productMockup.src = resolveMockup(area, color); elements.productMockup.alt = `${app.product.studioTitle || app.product.name} — ${area.name}`;
    const zone = resolveZone(area, app.size); ["left", "top", "width", "height"].forEach(key => elements.printZone.style.setProperty(`--zone-${key}`, `${zone[`${key}Pct`]}%`));
    await waitForMockup(elements.productMockup);
    fitProductToStage(); updateStageTransform();
  }
  function revealStage() { elements.stage.classList.remove("is-loading"); elements.stage.setAttribute("aria-busy", "false"); }
  async function switchArea(areaId, initial = false) {
    const next = app.product.editor.printAreas.find(area => area.id === areaId); if (!next) return;
    if (!initial) { saveActiveArea(); commitDesign(); }
    app.canvas.discardActiveObject(); app.area = next; app.design.activeAreaId = next.id; elements.workspaceEyebrow.textContent = next.name;
    document.querySelectorAll("[data-area-id]").forEach(button => { const active = button.dataset.areaId === next.id; button.classList.toggle("is-active", active); button.setAttribute("aria-selected", String(active)); });
    await loadMockup(next, app.color); await restoreArea(next.id); revealStage(); renderToolPanel(app.activeTool); announce(`منطقة الطباعة الحالية: ${next.name}`);
  }

  function renderColors() {
    elements.colorOptions.innerHTML = ""; app.product.colors.forEach(color => {
      const button = document.createElement("button"); button.type = "button"; button.className = `studio-swatch${color.id === app.color.id ? " is-active" : ""}`;
      button.style.backgroundColor = color.value || "#fff"; button.setAttribute("aria-label", color.name); button.title = color.name;
      button.addEventListener("click", async () => {
        if (color.id === app.color.id) return; saveActiveArea(); const models = app.design.areas[app.area.id].objects;
        app.color = color; elements.summaryColor.textContent = color.name; elements.selectedColorName.textContent = color.name; renderColors();
        await loadMockup(app.area, color); reflowObjects(models); saveActiveArea(); commitDesign(); revealStage();
      }); elements.colorOptions.appendChild(button);
    });
  }
  function renderSizes() {
    elements.sizeOptions.innerHTML = ""; app.product.sizes.forEach(size => {
      const button = document.createElement("button"); button.type = "button"; button.className = `studio-size${size.id === app.size.id ? " is-active" : ""}`; button.textContent = size.name;
      button.addEventListener("click", () => {
        if (size.id === app.size.id) return; const oldZone = resolveZone(app.area, app.size), nextZone = resolveZone(app.area, size);
        saveActiveArea(); const oldZoneRect = app.viewportZone || getZoneRect(), models = app.design.areas[app.area.id].objects, needsFit = zonesDiffer(oldZone, nextZone);
        app.size = size; elements.summarySize.textContent = size.name; renderSizes();
        if (needsFit) showNotice("تغيّر مقاس منطقة الطباعة لهذا المقاس، وتمت ملاءمة التصميم تناسبيًا دون تشويه.", "warning");
        ["left", "top", "width", "height"].forEach(key => elements.printZone.style.setProperty(`--zone-${key}`, `${nextZone[`${key}Pct`]}%`));
        if (needsFit) uniformFitObjects(models, oldZoneRect); else reflowObjects(models); saveActiveArea(); commitDesign();
      }); elements.sizeOptions.appendChild(button);
    });
  }
  function renderAreas() {
    elements.areaOptions.innerHTML = ""; const areas = app.product.editor.printAreas; elements.areaCount.textContent = `${areas.length} ${areas.length === 1 ? "جهة" : "جهات"}`;
    areas.forEach(area => {
      const button = document.createElement("button"); button.type = "button"; button.className = `studio-area${area.id === app.area.id ? " is-active" : ""}`;
      button.dataset.areaId = area.id; button.setAttribute("role", "tab"); button.setAttribute("aria-selected", String(area.id === app.area.id));
      button.innerHTML = `<i class="${area.icon || "bi bi-bounding-box"}" aria-hidden="true"></i><span></span>`; button.querySelector("span").textContent = area.name;
      button.addEventListener("click", () => { void switchArea(area.id); }); elements.areaOptions.appendChild(button);
    });
  }
  function setActiveTool(name) {
    app.activeTool = name; document.querySelectorAll("[data-studio-tool]").forEach(tab => { const active = tab.dataset.studioTool === name; tab.classList.toggle("is-active", active); tab.setAttribute("aria-selected", String(active)); });
    elements.toolPanel.setAttribute("aria-labelledby", `${name}Tab`); renderToolPanel(name);
  }
  function setupToolTabs() { document.querySelectorAll("[data-studio-tool]").forEach(tab => tab.addEventListener("click", () => setActiveTool(tab.dataset.studioTool))); }
  function createEmptyState(icon, title, copy) {
    const box = document.createElement("div"); box.className = "studio-tool-empty"; box.innerHTML = `<div><i class="bi ${icon}" aria-hidden="true"></i><strong></strong><span></span></div>`;
    box.querySelector("strong").textContent = title; box.querySelector("span").textContent = copy; return box;
  }

  function uploadFingerprint(file, mimeType) {
    return [file.name, file.size, file.lastModified || 0, mimeType].join("::");
  }
  function hasUploadedFile(file, mimeType, fingerprint) {
    return app.design.assets.some(asset => asset.fingerprint === fingerprint
      || (!asset.fingerprint && asset.name === file.name && asset.size === file.size && asset.mimeType === mimeType));
  }

  async function handleUploads(files) {
    let changed = false;
    for (const file of files) {
      const extension = file.name.split(".").pop()?.toLowerCase(), mime = file.type || (extension === "svg" ? "image/svg+xml" : extension === "png" ? "image/png" : "image/jpeg");
      if (!ALLOWED_UPLOADS.has(mime) || !["png", "jpg", "jpeg", "svg"].includes(extension)) { showNotice(`الملف «${file.name}» غير مدعوم.`, "error"); continue; }
      const fingerprint = uploadFingerprint(file, mime);
      if (app.pendingAssetFingerprints.has(fingerprint) || hasUploadedFile(file, mime, fingerprint)) continue;
      app.pendingAssetFingerprints.add(fingerprint);
      try {
        const assetId = uid("asset"); await app.assetStore.put(assetId, file);
        if (!hasUploadedFile(file, mime, fingerprint)) {
          app.design.assets.push({ assetId, name: file.name, mimeType: mime, size: file.size, lastModified: file.lastModified || 0, fingerprint, createdAt: new Date().toISOString() });
          changed = true;
        }
      } finally {
        app.pendingAssetFingerprints.delete(fingerprint);
      }
    }
    if (changed) commitDesign();
    if (app.activeTool === "upload") renderToolPanel("upload");
  }
  function assetUsageCount(assetId) { return Object.values(app.design.areas).reduce((total, area) => total + area.objects.filter(object => object.kind === "image" && object.assetId === assetId).length, 0); }
  function confirmReferencedAssetDeletion(asset, usage, trigger) {
    if (elements.deleteDialog.open) return Promise.resolve(false);
    return new Promise(resolve => {
      const dialog = elements.deleteDialog; let settled = false;
      const finish = confirmed => {
        if (settled) return; settled = true;
        elements.cancelAssetDelete.removeEventListener("click", cancel); elements.confirmAssetDelete.removeEventListener("click", confirmDelete);
        dialog.removeEventListener("cancel", cancelEvent); dialog.removeEventListener("click", backdropClick);
        if (dialog.open) dialog.close(); else dialog.removeAttribute("open");
        trigger?.focus?.(); resolve(confirmed);
      };
      const cancel = () => finish(false), confirmDelete = () => finish(true);
      const cancelEvent = event => { event.preventDefault(); finish(false); };
      const backdropClick = event => { if (event.target === dialog) finish(false); };
      elements.deleteMessage.textContent = usage === 1
        ? "هذه الصورة مستخدمة في التصميم مرة واحدة. حذفها سيزيلها من التصميم أيضًا."
        : `هذه الصورة مستخدمة في التصميم ${usage} مرات. حذفها سيزيل جميع استخداماتها.`;
      elements.deleteThumbnail.alt = asset.name || "الصورة المراد حذفها"; elements.deleteThumbnail.removeAttribute("src");
      void assetUrl(asset.assetId).then(url => { if (!settled && url) elements.deleteThumbnail.src = url; });
      elements.cancelAssetDelete.addEventListener("click", cancel); elements.confirmAssetDelete.addEventListener("click", confirmDelete);
      dialog.addEventListener("cancel", cancelEvent); dialog.addEventListener("click", backdropClick);
      if (typeof dialog.showModal === "function") dialog.showModal(); else dialog.setAttribute("open", "");
      elements.cancelAssetDelete.focus();
    });
  }
  async function deleteAsset(asset, trigger) {
    saveActiveArea(); const usage = assetUsageCount(asset.assetId);
    if (usage && !await confirmReferencedAssetDeletion(asset, usage, trigger)) return;
    Object.values(app.design.areas).forEach(area => { area.objects = area.objects.filter(object => object.assetId !== asset.assetId); });
    app.canvas.getObjects().filter(object => object.assetId === asset.assetId).forEach(object => app.canvas.remove(object)); app.design.assets = app.design.assets.filter(item => item.assetId !== asset.assetId);
    await app.assetStore.delete(asset.assetId); const url = app.objectUrls.get(asset.assetId); if (url) URL.revokeObjectURL(url); app.objectUrls.delete(asset.assetId); commitDesign();
    if (app.activeTool === "upload") renderToolPanel("upload");
  }
  async function addAssetToCanvas(asset) {
    const url = await assetUrl(asset.assetId); if (!url) { showNotice("تعذر استعادة ملف الصورة.", "error"); return; }
    const ImageClass = fabric.FabricImage || fabric.Image, image = await ImageClass.fromURL(url), zone = getZoneRect();
    const scale = Math.min((zone.width * 0.55) / image.width, (zone.height * 0.55) / image.height);
    configureObject(image, { id: uid("object"), kind: "image" }); image.set({ left: zone.left + zone.width / 2, top: zone.top + zone.height / 2, scaleX: scale, scaleY: scale, assetId: asset.assetId });
    app.canvas.add(image); app.canvas.setActiveObject(image); image.setCoords(); app.canvas.requestRenderAll(); scheduleCommit();
    if (app.activeTool !== "upload") setActiveTool("upload");
  }
  function renderUploadPanel(renderToken) {
    const content = document.createDocumentFragment(), assets = uniqueAssetRecords(app.design.assets);
    const uploader = document.createElement("label"); uploader.className = "studio-upload-drop";
    uploader.innerHTML = `<input type="file" accept=".png,.jpg,.jpeg,.svg,image/png,image/jpeg,image/svg+xml" multiple><i class="bi bi-cloud-arrow-up" aria-hidden="true"></i><strong>رفع صورة</strong><span>PNG، JPG، SVG</span>`;
    const input = uploader.querySelector("input"); input.addEventListener("change", () => { void handleUploads([...input.files]); input.value = ""; });
    ["dragenter", "dragover"].forEach(name => uploader.addEventListener(name, event => { event.preventDefault(); uploader.classList.add("is-dragging"); }));
    ["dragleave", "drop"].forEach(name => uploader.addEventListener(name, event => { event.preventDefault(); uploader.classList.remove("is-dragging"); }));
    uploader.addEventListener("drop", event => { void handleUploads([...event.dataTransfer.files]); }); content.appendChild(uploader);
    if (assets.length) {
      const heading = document.createElement("div"); heading.className = "studio-assets-heading"; heading.innerHTML = `<strong>الصور المرفوعة</strong><span>${assets.length}</span>`; content.appendChild(heading);
      const grid = document.createElement("div"); grid.className = "studio-assets-grid";
      for (const asset of assets) {
        const card = document.createElement("div"); card.className = "studio-asset-card";
        card.dataset.assetId = asset.assetId;
        const add = document.createElement("button"); add.type = "button"; add.className = "studio-asset-add"; add.title = `إضافة ${asset.name}`;
        const image = document.createElement("img"); image.alt = asset.name; add.appendChild(image); add.addEventListener("click", () => { void addAssetToCanvas(asset); });
        void assetUrl(asset.assetId).then(url => { if (url) image.src = url; });
        const remove = document.createElement("button"); remove.type = "button"; remove.className = "studio-asset-delete"; remove.setAttribute("aria-label", `حذف ${asset.name}`); remove.innerHTML = '<i class="bi bi-trash" aria-hidden="true"></i>'; remove.addEventListener("click", () => { void deleteAsset(asset, remove); });
        card.append(add, remove); grid.appendChild(card);
      }
      content.appendChild(grid);
    }
    if (renderToken !== app.panelRenderToken || app.activeTool !== "upload") return;
    elements.toolPanelContent.className = `studio-upload-panel${assets.length ? "" : " is-empty"}`;
    elements.toolPanelContent.replaceChildren(content);
  }

  function activeText() { const object = app.canvas?.getActiveObject(); return object?.studioKind === "text" ? object : null; }
  function applyTextProperty(property, value) { const text = activeText(); if (!text) return; text.set(property, value); text.setCoords(); app.canvas.requestRenderAll(); scheduleCommit(); }
  function fontPicker(selectedFamily) {
    const details = document.createElement("details"); details.className = "studio-font-picker";
    const summary = document.createElement("summary"); summary.textContent = selectedFamily; summary.style.fontFamily = `"${selectedFamily}", sans-serif`;
    const list = document.createElement("div"); list.className = "studio-font-list";
    FONT_FAMILIES.forEach(family => {
      const button = document.createElement("button"); button.type = "button"; button.textContent = family; button.dataset.font = family; button.style.fontFamily = `"${family}", sans-serif`;
      button.addEventListener("click", async () => { await loadFont(family); summary.textContent = family; summary.style.fontFamily = button.style.fontFamily; details.open = false; applyTextProperty("fontFamily", family); }); list.appendChild(button);
    });
    details.addEventListener("toggle", () => {
      if (!details.open) return;
      if (!("IntersectionObserver" in window)) { list.querySelectorAll("button").forEach(button => { void loadFont(button.dataset.font); }); return; }
      const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) void loadFont(entry.target.dataset.font); }), { root: list });
      list.querySelectorAll("button").forEach(button => observer.observe(button));
    }, { once: true }); details.append(summary, list); return details;
  }
  function renderTextPanel() {
    const selected = activeText(); elements.toolPanelContent.innerHTML = ""; elements.toolPanelContent.className = "studio-text-panel";
    const form = document.createElement("div"); form.className = "studio-text-form";
    form.innerHTML = `<label class="studio-field studio-field-wide"><span>النص</span><textarea rows="3" placeholder="اكتب النص هنا"></textarea></label>
      <button type="button" class="studio-add-text"><i class="bi bi-plus-lg" aria-hidden="true"></i> إضافة مربع نص</button>
      <div class="studio-field studio-field-wide"><span>الخط</span><div data-font-picker></div></div>
      <label class="studio-field"><span>الحجم</span><input data-prop="fontSize" type="number" min="8" max="240"></label>
      <label class="studio-field"><span>اللون</span><input data-prop="fill" type="color"></label>
      <div class="studio-text-toggles"><button type="button" data-toggle="bold" aria-label="عريض"><i class="bi bi-type-bold"></i></button><button type="button" data-toggle="italic" aria-label="مائل"><i class="bi bi-type-italic"></i></button></div>
      <div class="studio-alignments"><button type="button" data-align="right" aria-label="يمين"><i class="bi bi-text-right"></i></button><button type="button" data-align="center" aria-label="وسط"><i class="bi bi-text-center"></i></button><button type="button" data-align="left" aria-label="يسار"><i class="bi bi-text-left"></i></button></div>
      <label class="studio-field"><span>تباعد الحروف</span><input data-prop="letterSpacing" type="number" min="-5" max="30" step="0.5"></label>
      <label class="studio-field"><span>ارتفاع السطر</span><input data-prop="lineHeight" type="number" min="0.7" max="3" step="0.1"></label>
      <label class="studio-field studio-field-wide"><span>الدوران</span><input data-prop="angle" type="range" min="-180" max="180" step="1"><output></output></label>`;
    const textarea = form.querySelector("textarea"), fontHost = form.querySelector("[data-font-picker]"); textarea.value = selected?.text || ""; fontHost.appendChild(fontPicker(selected?.fontFamily || "Cairo"));
    form.querySelector('[data-prop="fontSize"]').value = Math.round(selected?.fontSize || 36); form.querySelector('[data-prop="fill"]').value = typeof selected?.fill === "string" && selected.fill.startsWith("#") ? selected.fill : "#0b1f3a";
    form.querySelector('[data-prop="letterSpacing"]').value = selected ? ((selected.charSpacing * selected.fontSize) / 1000).toFixed(1) : 0; form.querySelector('[data-prop="lineHeight"]').value = selected?.lineHeight || 1.2;
    const angle = form.querySelector('[data-prop="angle"]'), output = form.querySelector("output"); angle.value = selected?.angle || 0; output.textContent = `${angle.value}°`;
    if (selected?.fontWeight === "bold") form.querySelector('[data-toggle="bold"]').classList.add("is-active"); if (selected?.fontStyle === "italic") form.querySelector('[data-toggle="italic"]').classList.add("is-active");
    form.querySelector(`[data-align="${selected?.textAlign || "center"}"]`)?.classList.add("is-active"); textarea.addEventListener("input", () => applyTextProperty("text", textarea.value));
    form.querySelector(".studio-add-text").addEventListener("click", async () => {
      const zone = getZoneRect(), value = textarea.value.trim() || "اكتب نصك هنا"; await loadFont("Cairo");
      const text = configureObject(new fabric.Textbox(value, { left: zone.left + zone.width / 2, top: zone.top + zone.height / 2, width: zone.width * 0.62,
        fontSize: Math.max(20, Math.min(44, zone.height * 0.13)), fontFamily: "Cairo", fill: "#0b1f3a", textAlign: "center", lineHeight: 1.2,
        direction: /[\u0600-\u06ff]/.test(value) ? "rtl" : "ltr" }), { id: uid("object"), kind: "text" });
      app.canvas.add(text); app.canvas.setActiveObject(text); app.canvas.requestRenderAll(); scheduleCommit(); renderTextPanel();
    });
    form.querySelector('[data-prop="fontSize"]').addEventListener("change", event => applyTextProperty("fontSize", Number(event.target.value)));
    form.querySelector('[data-prop="fill"]').addEventListener("input", event => applyTextProperty("fill", event.target.value));
    form.querySelector('[data-prop="letterSpacing"]').addEventListener("change", event => { const text = activeText(); if (text) applyTextProperty("charSpacing", Number(event.target.value) * 1000 / text.fontSize); });
    form.querySelector('[data-prop="lineHeight"]').addEventListener("change", event => applyTextProperty("lineHeight", Number(event.target.value)));
    angle.addEventListener("input", event => { output.textContent = `${event.target.value}°`; applyTextProperty("angle", Number(event.target.value)); });
    form.querySelectorAll("[data-toggle]").forEach(button => button.addEventListener("click", () => { const text = activeText(); if (!text) return; const prop = button.dataset.toggle === "bold" ? "fontWeight" : "fontStyle", value = button.dataset.toggle === "bold" ? "bold" : "italic"; applyTextProperty(prop, text[prop] === value ? "normal" : value); renderTextPanel(); }));
    form.querySelectorAll("[data-align]").forEach(button => button.addEventListener("click", () => { applyTextProperty("textAlign", button.dataset.align); renderTextPanel(); }));
    if (!selected) form.querySelectorAll("[data-prop], [data-toggle], [data-align]").forEach(control => { control.disabled = true; control.classList.add("is-disabled"); });
    elements.toolPanelContent.appendChild(form);
  }
  function renderToolPanel(name) {
    if (!app.design) return;
    const renderToken = ++app.panelRenderToken;
    if (name === "upload") void renderUploadPanel(renderToken); else if (name === "text") renderTextPanel();
    else { elements.toolPanelContent.className = ""; elements.toolPanelContent.replaceChildren(createEmptyState("bi-images", "الرسومات والعناصر", "لا توجد عناصر متاحة حاليًا.")); }
  }

  function setupCanvasEvents() {
    const select = event => { const object = event.selected?.[0] || app.canvas.getActiveObject(); if (object) setActiveTool(object.studioKind === "text" ? "text" : "upload"); };
    app.canvas.on("selection:created", select); app.canvas.on("selection:updated", select); app.canvas.on("selection:cleared", () => { if (app.activeTool === "text") renderTextPanel(); });
    ["object:added", "object:removed", "object:modified", "text:changed"].forEach(name => app.canvas.on(name, () => { if (!app.suppressCanvasEvents) scheduleCommit(); }));
  }
  function initCanvas() {
    initializeLogicalStage();
    app.canvas = new fabric.Canvas(elements.designCanvas, { preserveObjectStacking: true, selection: true, uniformScaling: true, controlsAboveOverlay: true, backgroundColor: "transparent" });
    app.canvas.setDimensions(app.logicalStage); updateStageTransform(); setupCanvasEvents();
  }
  function renderProductSummary() {
    const title = app.product.studioTitle || app.product.name, mockup = resolveMockup(app.area, app.color);
    elements.summaryImage.src = mockup; elements.summaryImage.alt = title; elements.summaryProductName.textContent = title; elements.summaryColor.textContent = app.color?.name || "—";
    elements.summarySize.textContent = app.size?.name || "—"; elements.summaryPrice.textContent = formatPrice(app.product.price); elements.selectedColorName.textContent = app.color?.name || "—";
  }
  function setupResizeObserver() {
    if (app.resizeObserver) return;
    app.resizeObserver = new ResizeObserver(() => {
      if (app.resizeFrame) cancelAnimationFrame(app.resizeFrame);
      app.resizeFrame = requestAnimationFrame(() => { app.resizeFrame = null; updateStageTransform(); });
    });
    app.resizeObserver.observe(elements.stage);
  }
  async function init() {
    setupSiteShell(); setupToolTabs(); if (!elements.designCanvas || !elements.printZone || !window.fabric?.Canvas) return showError("تعذر تجهيز مساحة التصميم. أعد تحميل الصفحة وحاول مرة أخرى.");
    app.selection = readSelection(); if (!app.selection) return showError("اختر منتجًا مهيأ من صفحة اختيار المنتجات أولًا.");
    const validation = validateProduct(app.selection.editorProduct); if (!validation.valid) return showError(validation.message);
    ensureDesignId(app.selection); app.product = app.selection.editorProduct; app.design = loadDesign(app.selection);
    app.color = selectedItem(app.product.colors, app.design.colorId || app.selection.colorId); app.size = selectedItem(app.product.sizes, app.design.sizeId || app.selection.sizeId);
    app.area = app.product.editor.printAreas.find(area => area.id === app.design.activeAreaId) || app.product.editor.printAreas[0]; app.assetStore = new DesignAssetStore(app.design.designId);
    renderProductSummary(); renderColors(); renderSizes(); renderAreas(); setActiveTool("upload");
    initCanvas();
    try {
      await switchArea(app.area.id, true); setupResizeObserver(); commitDesign();
    }
    catch (error) { console.error(error); showError("تعذر تحميل مساحة المنتج المحدد."); }
  }

  addEventListener("beforeunload", () => { saveActiveArea(); commitDesign(); app.objectUrls.forEach(url => URL.revokeObjectURL(url)); });
  void init();
})(window, document);
