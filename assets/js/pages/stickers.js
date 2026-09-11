"use strict";

(function () {
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const ALLOWED_TYPES = new Set([
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/svg+xml"
  ]);
  const ALLOWED_EXTENSIONS = new Set(["png", "jpg", "jpeg", "webp", "svg"]);

  const state = {
    category: "brand",
    quantity: 50,
    size: "10x10",
    shape: "custom",
    paper: "glossy",
    protection: "protected",
    image: null
  };

  const elements = {
    sidebar: document.getElementById("designerSidebar"),
    siteWrapper: document.querySelector(".site-wrapper"),
    overlay: document.getElementById("pageOverlay"),
    menuButton: document.getElementById("mobileMenu"),
    menuIcon: document.getElementById("sidebarToggleIcon"),
    sidebarClose: document.getElementById("sidebarClose"),
    toast: document.getElementById("toast"),
    cartButton: document.getElementById("cartButton"),
    tabs: Array.from(document.querySelectorAll(".sticker-tab")),
    fileInput: document.getElementById("stickerFile"),
    dropzone: document.getElementById("stickerDropzone"),
    uploadStatus: document.getElementById("uploadStatus"),
    preview: document.getElementById("stickerPreview"),
    previewFrame: document.getElementById("stickerPreviewFrame"),
    previewCaption: document.getElementById("previewCaption"),
    quantityInput: document.getElementById("stickerQuantity"),
    customizer: document.getElementById("stickerCustomizer"),
    cartCount: document.getElementById("cartCount")
  };

  let toastTimer = null;
  let previewObjectUrl = null;
  let dragDepth = 0;
  let stickerCart = readCart();

  function readCart() {
    try {
      const savedCart = JSON.parse(localStorage.getItem("stickerCart"));
      return Array.isArray(savedCart) ? savedCart : [];
    } catch (error) {
      return [];
    }
  }

  function saveCart() {
    try {
      localStorage.setItem("stickerCart", JSON.stringify(stickerCart));
    } catch (error) {
      showToast("تمت الإضافة لهذه الجلسة، لكن تعذر حفظ السلة على الجهاز");
    }
  }

  function updateCartCount() {
    elements.cartCount.textContent = stickerCart.length;
  }

  function showToast(message) {
    if (!elements.toast) return;

    elements.toast.textContent = message;
    elements.toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      elements.toast.classList.remove("show");
    }, 2500);
  }

  function syncSidebarToggle(isOpen) {
    elements.menuButton.setAttribute("aria-expanded", String(isOpen));
    elements.menuButton.setAttribute(
      "aria-label",
      isOpen ? "إغلاق القائمة" : "فتح القائمة"
    );
    elements.menuIcon.classList.toggle("bi-list", !isOpen);
    elements.menuIcon.classList.toggle("bi-x-lg", isOpen);
  }

  function openSidebar() {
    elements.sidebar.classList.add("open");
    elements.sidebar.classList.remove("is-collapsed");
    elements.siteWrapper.classList.remove("is-sidebar-collapsed");
    elements.overlay.classList.add("visible");
    syncSidebarToggle(true);
  }

  function closeSidebar() {
    elements.sidebar.classList.remove("open");
    elements.sidebar.classList.add("is-collapsed");
    elements.siteWrapper.classList.add("is-sidebar-collapsed");
    elements.overlay.classList.remove("visible");
    syncSidebarToggle(false);
  }

  function initPageShell() {
    elements.menuButton.addEventListener("click", function () {
      if (elements.sidebar.classList.contains("is-collapsed")) {
        openSidebar();
      } else {
        closeSidebar();
      }
    });
    elements.sidebarClose.addEventListener("click", closeSidebar);
    elements.overlay.addEventListener("click", closeSidebar);
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && elements.menuButton.getAttribute("aria-expanded") === "true") {
        closeSidebar();
        elements.menuButton.focus();
      }
    });
    elements.cartButton.addEventListener("click", function () {
      showToast(
        stickerCart.length
          ? "لديك " + stickerCart.length + " من طلبات الملصقات في السلة"
          : "سلة المشتريات فارغة حاليًا"
      );
    });

    closeSidebar();
    updateCartCount();
  }

  function selectCategory(tab, shouldFocus) {
    elements.tabs.forEach(function (item) {
      const selected = item === tab;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    state.category = tab.dataset.category;
    if (shouldFocus) tab.focus();
  }

  function initCategories() {
    elements.tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () {
        selectCategory(tab, false);
      });
      tab.addEventListener("keydown", function (event) {
        let targetIndex = index;

        if (event.key === "ArrowRight") targetIndex = index - 1;
        if (event.key === "ArrowLeft") targetIndex = index + 1;
        if (event.key === "Home") targetIndex = 0;
        if (event.key === "End") targetIndex = elements.tabs.length - 1;

        if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;

        event.preventDefault();
        const wrappedIndex = (targetIndex + elements.tabs.length) % elements.tabs.length;
        selectCategory(elements.tabs[wrappedIndex], true);
        elements.tabs[wrappedIndex].scrollIntoView({ block: "nearest", inline: "nearest" });
      });
    });
  }

  function fileExtension(fileName) {
    const segments = String(fileName).toLowerCase().split(".");
    return segments.length > 1 ? segments.pop() : "";
  }

  function validateFile(file) {
    if (!file) return "لم يتم اختيار ملف.";
    if (!ALLOWED_TYPES.has(file.type) && !ALLOWED_EXTENSIONS.has(fileExtension(file.name))) {
      return "صيغة الملف غير مدعومة. اختر PNG أو JPG أو JPEG أو WEBP أو SVG.";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "حجم الملف أكبر من 10MB. اختر ملفًا أصغر.";
    }
    return "";
  }

  function setUploadStatus(message, type) {
    elements.uploadStatus.textContent = message;
    elements.uploadStatus.classList.toggle("is-error", type === "error");
    elements.uploadStatus.classList.toggle("is-success", type === "success");
  }

  function useUploadedImage(file) {
    const validationError = validateFile(file);
    if (validationError) {
      setUploadStatus(validationError, "error");
      showToast(validationError);
      return;
    }

    const candidateUrl = URL.createObjectURL(file);
    const imageProbe = new Image();

    imageProbe.onload = function () {
      if (previewObjectUrl) URL.revokeObjectURL(previewObjectUrl);
      previewObjectUrl = candidateUrl;
      state.image = file;
      elements.preview.src = candidateUrl;
      elements.preview.alt = `معاينة الملف المرفوع: ${file.name}`;
      elements.previewCaption.textContent = file.name;
      setUploadStatus(`تم تحميل ${file.name} بنجاح. يمكنك الضغط لاختيار ملف بديل.`, "success");
      showToast("تم تحديث معاينة الملصق");
    };

    imageProbe.onerror = function () {
      URL.revokeObjectURL(candidateUrl);
      setUploadStatus("تعذر قراءة الصورة. تأكد من أن الملف صالح ثم حاول مرة أخرى.", "error");
      showToast("تعذر قراءة ملف الصورة");
    };

    imageProbe.src = candidateUrl;
  }

  function preventDragDefaults(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  function initUpload() {
    elements.fileInput.addEventListener("change", function () {
      useUploadedImage(elements.fileInput.files[0]);
      elements.fileInput.value = "";
    });

    ["dragenter", "dragover", "dragleave", "drop"].forEach(function (eventName) {
      elements.dropzone.addEventListener(eventName, preventDragDefaults);
    });

    elements.dropzone.addEventListener("dragenter", function () {
      dragDepth += 1;
      elements.dropzone.classList.add("is-drag-active");
    });

    elements.dropzone.addEventListener("dragover", function (event) {
      if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
    });

    elements.dropzone.addEventListener("dragleave", function () {
      dragDepth = Math.max(0, dragDepth - 1);
      if (dragDepth === 0) elements.dropzone.classList.remove("is-drag-active");
    });

    elements.dropzone.addEventListener("drop", function (event) {
      dragDepth = 0;
      elements.dropzone.classList.remove("is-drag-active");
      const files = event.dataTransfer ? event.dataTransfer.files : null;
      useUploadedImage(files && files[0]);
    });

    window.addEventListener("beforeunload", function () {
      if (previewObjectUrl) URL.revokeObjectURL(previewObjectUrl);
    });
  }

  function selectButton(groupSelector, selectedButton) {
    document.querySelectorAll(groupSelector).forEach(function (button) {
      const selected = button === selectedButton;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  }

  function syncQuantity(quantity) {
    const safeQuantity = Math.max(1, Math.floor(Number(quantity) || 1));
    state.quantity = safeQuantity;
    elements.quantityInput.value = safeQuantity;
    document.querySelectorAll("[data-quantity]").forEach(function (button) {
      const selected = Number(button.dataset.quantity) === safeQuantity;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  }

  function initQuantitySelector() {
    document.querySelectorAll("[data-quantity]").forEach(function (button) {
      button.addEventListener("click", function () {
        syncQuantity(button.dataset.quantity);
      });
    });

    document.querySelectorAll("[data-quantity-action]").forEach(function (button) {
      button.addEventListener("click", function () {
        const delta = button.dataset.quantityAction === "increase" ? 1 : -1;
        syncQuantity(state.quantity + delta);
      });
    });

    elements.quantityInput.addEventListener("input", function () {
      const value = Number(elements.quantityInput.value);
      if (Number.isFinite(value) && value >= 1) {
        syncQuantity(value);
      }
    });

    elements.quantityInput.addEventListener("change", function () {
      syncQuantity(elements.quantityInput.value);
    });
  }

  function initChoiceSelectors() {
    document.querySelectorAll("[data-size]").forEach(function (button) {
      button.addEventListener("click", function () {
        state.size = button.dataset.size;
        selectButton("[data-size]", button);
      });
    });

    document.querySelectorAll("[data-shape]").forEach(function (button) {
      button.addEventListener("click", function () {
        state.shape = button.dataset.shape;
        elements.previewFrame.dataset.shape = state.shape;
        selectButton(".sticker-shape[data-shape]", button);
      });
    });

    document.querySelectorAll('input[name="paper"]').forEach(function (input) {
      input.addEventListener("change", function () {
        if (input.checked) state.paper = input.value;
      });
    });

    document.querySelectorAll('input[name="protection"]').forEach(function (input) {
      input.addEventListener("change", function () {
        if (input.checked) state.protection = input.value;
      });
    });
  }

  function initCartSubmission() {
    elements.customizer.addEventListener("submit", function (event) {
      event.preventDefault();

      stickerCart.push({
        id: Date.now(),
        category: state.category,
        quantity: state.quantity,
        size: state.size,
        shape: state.shape,
        paper: state.paper,
        protection: state.protection,
        imageName: state.image ? state.image.name : null
      });

      saveCart();
      updateCartCount();
      showToast("تمت إضافة طلب الملصقات إلى السلة");
    });
  }

  function initGalleryFallbacks() {
    document.querySelectorAll(".stickers-gallery-card img").forEach(function (image) {
      image.addEventListener("error", function () {
        if (image.dataset.fallbackApplied === "true") return;
        image.dataset.fallbackApplied = "true";
        image.src = "assets/stiker.png";
      });
    });
  }

  function init() {
    initPageShell();
    initCategories();
    initUpload();
    initQuantitySelector();
    initChoiceSelectors();
    initCartSubmission();
    initGalleryFallbacks();
  }

  init();
})();
