"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const sidebar = document.getElementById("adminSidebar");
  const backdrop = document.getElementById("sidebarBackdrop");
  const menuButton = document.getElementById("menuButton");
  const mobileLayout = window.matchMedia("(max-width: 760px)");
  const searchInput = document.getElementById("productSearch");
  const productsGrid = document.getElementById("productsGrid");
  const emptyState = document.getElementById("emptyState");
  const dialog = document.getElementById("productDialog");
  const form = document.getElementById("productForm");
  const dialogTitle = document.getElementById("productDialogTitle");
  const nameInput = document.getElementById("productNameInput");
  const codeInput = document.getElementById("productCodeInput");
  const toast = document.getElementById("toast");
  let editingCard = null;
  let activeFilter = "all";
  let toastTimer;

  const normalize = (value) => String(value || "").trim().toLocaleLowerCase("ar").replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي");

  const showToast = (message) => {
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("show");
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2400);
  };

  const updateSummary = () => {
    const cards = Array.from(productsGrid.querySelectorAll(".product-card"));
    const active = cards.filter((card) => card.dataset.status === "active").length;
    document.getElementById("totalProducts").textContent = cards.length;
    document.getElementById("activeProducts").textContent = active;
    document.getElementById("pausedProducts").textContent = cards.length - active;
  };

  const filterProducts = () => {
    const query = normalize(searchInput.value);
    let visible = 0;
    productsGrid.querySelectorAll(".product-card").forEach((card) => {
      const matchesSearch = !query || normalize(`${card.dataset.productName} ${card.dataset.productId}`).includes(query);
      const matchesStatus = activeFilter === "all" || card.dataset.status === activeFilter;
      const matches = matchesSearch && matchesStatus;
      card.hidden = !matches;
      if (matches) visible += 1;
    });
    emptyState.hidden = visible !== 0;
  };

  const syncMenuState = () => {
    const open = mobileLayout.matches ? body.classList.contains("sidebar-open") : !body.classList.contains("sidebar-collapsed");
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "إغلاق القائمة" : "فتح القائمة");
    menuButton.querySelector("i").className = open ? "bi bi-x-lg" : "bi bi-list";
  };

  const closeMobileMenu = () => {
    body.classList.remove("sidebar-open");
    syncMenuState();
  };

  menuButton.addEventListener("click", () => {
    body.classList.toggle(mobileLayout.matches ? "sidebar-open" : "sidebar-collapsed");
    syncMenuState();
  });
  backdrop.addEventListener("click", closeMobileMenu);
  sidebar.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMobileMenu));
  mobileLayout.addEventListener("change", closeMobileMenu);

  document.querySelectorAll(".nav-group-toggle").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const group = toggle.closest(".nav-group");
      const open = group.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  });

  const accountButton = document.getElementById("accountButton");
  const accountDropdown = document.getElementById("accountDropdown");
  const notificationButton = document.getElementById("notificationButton");
  const notificationDropdown = document.getElementById("notificationDropdown");

  const closeDropdown = (button, dropdown) => {
    dropdown.classList.remove("open");
    dropdown.hidden = true;
    button.setAttribute("aria-expanded", "false");
  };

  const toggleDropdown = (button, dropdown, otherButton, otherDropdown) => {
    const open = !dropdown.classList.contains("open");
    closeDropdown(otherButton, otherDropdown);
    dropdown.classList.toggle("open", open);
    dropdown.hidden = !open;
    button.setAttribute("aria-expanded", String(open));
  };

  accountButton.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleDropdown(accountButton, accountDropdown, notificationButton, notificationDropdown);
  });
  notificationButton.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleDropdown(notificationButton, notificationDropdown, accountButton, accountDropdown);
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".account-wrap")) closeDropdown(accountButton, accountDropdown);
    if (!event.target.closest(".notification-wrap")) closeDropdown(notificationButton, notificationDropdown);
  });

  const openDialog = (card = null) => {
    editingCard = card;
    form.reset();
    dialogTitle.textContent = card ? "تعديل المنتج" : "إضافة منتج";
    if (card) {
      nameInput.value = card.dataset.productName;
      codeInput.value = card.dataset.productId;
    } else {
      const nextId = Math.max(0, ...Array.from(productsGrid.querySelectorAll(".product-card"), (item) => Number(item.dataset.productId.replace(/\D/g, "")))) + 1;
      codeInput.value = `PPR-${String(nextId).padStart(3, "0")}`;
    }
    dialog.showModal();
    window.setTimeout(() => nameInput.focus(), 50);
  };

  document.getElementById("addProductButton").addEventListener("click", () => openDialog());
  dialog.querySelectorAll("[data-dialog-close]").forEach((button) => button.addEventListener("click", () => dialog.close()));
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });

  const createCard = ({ name, code }) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.dataset.productId = code;
    card.dataset.productName = name;
    card.dataset.status = "active";
    card.innerHTML = `<div class="product-visual"><i class="bi bi-camera" aria-hidden="true"></i><span>لا توجد صورة</span><code></code></div><div class="product-info"><h3></h3><p>أُضيف اليوم</p></div><div class="product-actions"><button class="danger-action" type="button" data-action="toggle">إيقاف</button><button class="edit-action" type="button" data-action="edit">تعديل</button><button class="delete-action" type="button" data-action="delete"><i class="bi bi-trash3"></i></button></div>`;
    card.querySelector("code").textContent = code;
    card.querySelector("h3").textContent = name;
    card.querySelector("[data-action='delete']").setAttribute("aria-label", `حذف ${name}`);
    return card;
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const name = nameInput.value.trim();
    const code = codeInput.value.trim().toUpperCase();
    const duplicate = Array.from(productsGrid.querySelectorAll(".product-card")).some((card) => card !== editingCard && card.dataset.productId.toUpperCase() === code);
    if (duplicate) { showToast("رقم المنتج مستخدم مسبقًا."); codeInput.focus(); return; }

    if (editingCard) {
      editingCard.dataset.productName = name;
      editingCard.dataset.productId = code;
      editingCard.querySelector("h3").textContent = name;
      editingCard.querySelector("code").textContent = code;
      const visual = editingCard.querySelector(".product-visual");
      if (editingCard.dataset.status === "paused" && !visual.querySelector(".paused-label")) {
        visual.insertAdjacentHTML("afterbegin", '<span class="paused-label">موقوف</span>');
      }
      showToast("تم تحديث بيانات المنتج بنجاح.");
    } else {
      productsGrid.append(createCard({ name, code }));
      showToast("تمت إضافة المنتج بنجاح.");
    }
    dialog.close();
    updateSummary();
    filterProducts();
  });

  productsGrid.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const card = button.closest(".product-card");
    const name = card.dataset.productName;

    if (button.dataset.action === "edit") openDialog(card);
    if (button.dataset.action === "toggle") {
      const pausing = card.dataset.status === "active";
      card.dataset.status = pausing ? "paused" : "active";
      card.classList.toggle("is-paused", pausing);
      button.textContent = pausing ? "تفعيل" : "إيقاف";
      button.className = pausing ? "success-action" : "danger-action";
      const label = card.querySelector(".paused-label");
      if (pausing && !label) card.querySelector(".product-visual").insertAdjacentHTML("afterbegin", '<span class="paused-label">موقوف</span>');
      if (!pausing && label) label.remove();
      updateSummary();
      filterProducts();
      showToast(pausing ? `تم إيقاف ${name} مؤقتًا.` : `تم تفعيل ${name}.`);
    }
    if (button.dataset.action === "delete" && window.confirm(`هل تريد حذف منتج ${name}؟`)) {
      card.remove();
      updateSummary();
      filterProducts();
      showToast(`تم حذف ${name}.`);
    }
  });

  searchInput.addEventListener("input", filterProducts);
  document.querySelectorAll("[data-product-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.productFilter;
      document.querySelectorAll("[data-product-filter]").forEach((item) => {
        item.setAttribute("aria-pressed", String(item === button));
      });
      filterProducts();
    });
  });
  document.getElementById("logoutButton").addEventListener("click", () => {
    if (window.confirm("هل تريد تسجيل الخروج من لوحة الإدارة؟")) window.location.href = "login.html";
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeDropdown(accountButton, accountDropdown);
    closeDropdown(notificationButton, notificationDropdown);
    closeMobileMenu();
  });

  updateSummary();
  syncMenuState();
});
