"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const sidebar = document.getElementById("adminSidebar");
  const backdrop = document.getElementById("sidebarBackdrop");
  const menuButton = document.getElementById("menuButton");
  const mobileLayout = window.matchMedia("(max-width: 760px)");
  const rows = () => Array.from(document.querySelectorAll("[data-design-row]"));
  const headerSearch = document.getElementById("headerSearch");
  const tableEmpty = document.getElementById("tableEmpty");
  const dialog = document.getElementById("designDialog");
  const dialogActions = document.getElementById("dialogActions");
  const toast = document.getElementById("toast");
  let activeCategory = "all";
  let activeStatus = "all";
  let activeRow = null;
  let toastTimer;

  const normalize = (value) => String(value || "").trim().toLocaleLowerCase("ar").replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي");
  const previewPositions = {
    "DSN-046": "100% 0%",
    "DSN-045": "75% 0%",
    "DSN-044": "50% 0%",
    "DSN-042": "25% 0%",
    "DSN-041": "0% 0%",
    "DSN-040": "0% 100%",
    "DSN-039": "25% 100%",
    "DSN-038": "50% 100%",
    "DSN-036": "75% 100%",
    "DSN-035": "100% 100%",
  };

  const showToast = (message) => {
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("show");
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2400);
  };

  const updateSummary = () => {
    const allRows = rows();
    const counts = {
      total: allRows.length,
      pending: allRows.filter((row) => row.dataset.status === "pending").length,
      approved: allRows.filter((row) => row.dataset.status === "approved").length,
      rejected: allRows.filter((row) => row.dataset.status === "rejected").length,
    };
    document.getElementById("totalDesigns").textContent = counts.total;
    document.getElementById("pendingDesigns").textContent = counts.pending;
    document.getElementById("approvedDesigns").textContent = counts.approved;
    document.getElementById("rejectedDesigns").textContent = counts.rejected;
    document.getElementById("totalTabCount").textContent = counts.total;
    document.getElementById("pendingTabCount").textContent = counts.pending;
    document.getElementById("approvedTabCount").textContent = counts.approved;
    document.getElementById("rejectedTabCount").textContent = counts.rejected;
    document.getElementById("sidebarPendingBadge").textContent = counts.pending;
    const notificationCounter = document.getElementById("notificationCounter");
    notificationCounter.textContent = counts.pending;
    notificationCounter.hidden = counts.pending === 0;
  };

  const filterRows = () => {
    const query = normalize(headerSearch.value);
    let visible = 0;
    rows().forEach((row) => {
      const searchable = normalize(`${row.dataset.id} ${row.dataset.title} ${row.dataset.designer} ${row.dataset.city} ${row.dataset.categoryLabel}`);
      const matchesQuery = !query || searchable.includes(query);
      const matchesCategory = activeCategory === "all" || row.dataset.category === activeCategory;
      const matchesStatus = activeStatus === "all" || row.dataset.status === activeStatus;
      const matches = matchesQuery && matchesCategory && matchesStatus;
      row.hidden = !matches;
      if (matches) visible += 1;
    });
    tableEmpty.hidden = visible !== 0;
  };

  const syncMenuState = () => {
    const open = mobileLayout.matches ? body.classList.contains("sidebar-open") : !body.classList.contains("sidebar-collapsed");
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "إغلاق القائمة" : "فتح القائمة");
    menuButton.querySelector("i").className = open ? "bi bi-x-lg" : "bi bi-list";
  };

  const closeMobileMenu = () => { body.classList.remove("sidebar-open"); syncMenuState(); };
  menuButton.addEventListener("click", () => { body.classList.toggle(mobileLayout.matches ? "sidebar-open" : "sidebar-collapsed"); syncMenuState(); });
  backdrop.addEventListener("click", closeMobileMenu);
  sidebar.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMobileMenu));
  mobileLayout.addEventListener("change", closeMobileMenu);
  document.querySelectorAll(".nav-group-toggle").forEach((toggle) => toggle.addEventListener("click", () => {
    const group = toggle.closest(".nav-group");
    const open = group.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  }));

  const accountButton = document.getElementById("accountButton");
  const accountDropdown = document.getElementById("accountDropdown");
  const notificationButton = document.getElementById("notificationButton");
  const notificationDropdown = document.getElementById("notificationDropdown");
  const closeDropdown = (button, dropdown) => { dropdown.classList.remove("open"); dropdown.hidden = true; button.setAttribute("aria-expanded", "false"); };
  const toggleDropdown = (button, dropdown, otherButton, otherDropdown) => {
    const open = !dropdown.classList.contains("open");
    closeDropdown(otherButton, otherDropdown);
    dropdown.classList.toggle("open", open);
    dropdown.hidden = !open;
    button.setAttribute("aria-expanded", String(open));
  };
  accountButton.addEventListener("click", (event) => { event.stopPropagation(); toggleDropdown(accountButton, accountDropdown, notificationButton, notificationDropdown); });
  notificationButton.addEventListener("click", (event) => { event.stopPropagation(); toggleDropdown(notificationButton, notificationDropdown, accountButton, accountDropdown); });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".account-wrap")) closeDropdown(accountButton, accountDropdown);
    if (!event.target.closest(".notification-wrap")) closeDropdown(notificationButton, notificationDropdown);
  });

  document.querySelectorAll("[data-category-filter]").forEach((button) => button.addEventListener("click", () => {
    activeCategory = button.dataset.categoryFilter;
    document.querySelectorAll("[data-category-filter]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    filterRows();
  }));

  document.querySelectorAll("[data-status-filter]").forEach((button) => button.addEventListener("click", () => {
    activeStatus = button.dataset.statusFilter;
    document.querySelectorAll("[data-status-filter]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    filterRows();
  }));

  headerSearch.addEventListener("input", filterRows);

  const categoryClasses = ["arts", "national", "calligraphy", "heritage"];
  const openDetails = (row) => {
    activeRow = row;
    const preview = document.getElementById("dialogDesignPreview");
    preview.style.setProperty("--preview-position", previewPositions[row.dataset.id] || "100% 0%");
    preview.setAttribute("aria-label", `معاينة تصميم ${row.dataset.title}`);
    document.getElementById("dialogDesignTitle").textContent = row.dataset.title;
    document.getElementById("dialogDesignId").textContent = row.dataset.id;
    document.getElementById("dialogCategoryPreview").textContent = row.dataset.categoryLabel;
    document.getElementById("dialogDesigner").textContent = row.dataset.designer;
    document.getElementById("dialogCity").textContent = row.dataset.city;
    document.getElementById("dialogDate").textContent = row.dataset.date;
    const category = document.getElementById("dialogCategory");
    category.textContent = row.dataset.categoryLabel;
    category.classList.remove(...categoryClasses);
    category.classList.add(row.dataset.category);
    const status = document.getElementById("dialogStatus");
    status.className = `design-status ${row.dataset.status}`;
    status.textContent = row.querySelector(".design-status").textContent;
    dialogActions.hidden = row.dataset.status !== "pending";
    dialog.showModal();
  };

  document.getElementById("designTableBody").addEventListener("click", (event) => {
    const button = event.target.closest("[data-details]");
    if (button) openDetails(button.closest("[data-design-row]"));
  });
  dialog.querySelectorAll("[data-dialog-close]").forEach((button) => button.addEventListener("click", () => dialog.close()));
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });

  const reviewDesign = (nextStatus) => {
    if (!activeRow) return;
    const status = activeRow.querySelector(".design-status");
    activeRow.dataset.status = nextStatus;
    status.className = `design-status ${nextStatus}`;
    status.textContent = nextStatus === "approved" ? "معتمد" : "مرفوض";
    dialog.close();
    updateSummary();
    filterRows();
    showToast(nextStatus === "approved" ? "تم اعتماد التصميم بنجاح." : "تم رفض التصميم.");
  };
  document.getElementById("approveDesign").addEventListener("click", () => reviewDesign("approved"));
  document.getElementById("rejectDesign").addEventListener("click", () => reviewDesign("rejected"));

  document.getElementById("logoutButton").addEventListener("click", () => { if (window.confirm("هل تريد تسجيل الخروج من لوحة الإدارة؟")) window.location.href = "login.html"; });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeDropdown(accountButton, accountDropdown);
    closeDropdown(notificationButton, notificationDropdown);
    closeMobileMenu();
  });

  updateSummary();
  filterRows();
  syncMenuState();
});
