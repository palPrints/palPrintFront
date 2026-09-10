"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const menuButton = document.getElementById("menuButton");
  const menuIcon = menuButton.querySelector("i");
  const sidebarOverlay = document.getElementById("sidebarOverlay");
  const notificationButton = document.getElementById("notificationButton");
  const notificationWrap = document.querySelector(".notification-wrap");
  const notificationDropdown = document.getElementById("notificationDropdown");
  const notificationCounter = document.getElementById("notificationCounter");
  const cancelModal = document.getElementById("cancelModal");
  const modalOrderNumber = document.getElementById("modalOrderNumber");
  const mobileLayout = window.matchMedia("(max-width: 820px)");
  let selectedCancelButton = null;

  function closeSidebar() {
    body.classList.remove("sidebar-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "فتح القائمة");
    menuIcon.className = "bi bi-list";
  }

  function syncSidebarMode() {
    body.classList.remove("sidebar-open");
    body.classList.toggle("sidebar-collapsed", !mobileLayout.matches);
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "فتح القائمة");
    menuIcon.className = "bi bi-list";
  }

  menuButton.addEventListener("click", () => {
    if (mobileLayout.matches) {
      const open = !body.classList.contains("sidebar-open");
      body.classList.toggle("sidebar-open", open);
      menuButton.setAttribute("aria-expanded", String(open));
      menuIcon.className = open ? "bi bi-x-lg" : "bi bi-list";
    } else {
      const collapsed = !body.classList.contains("sidebar-collapsed");
      body.classList.toggle("sidebar-collapsed", collapsed);
      menuButton.setAttribute("aria-expanded", String(!collapsed));
      menuIcon.className = collapsed ? "bi bi-list" : "bi bi-x-lg";
    }
  });

  syncSidebarMode();
  mobileLayout.addEventListener("change", syncSidebarMode);
  sidebarOverlay.addEventListener("click", closeSidebar);

  function setNotificationsOpen(open) {
    notificationDropdown.hidden = !open;
    if (open) {
      const wrapRect = notificationWrap.getBoundingClientRect();
      const width = notificationDropdown.offsetWidth;
      const center = wrapRect.left + wrapRect.width / 2;
      const left = Math.max(8, Math.min(center - width / 2, window.innerWidth - width - 8));
      notificationDropdown.style.left = `${left - wrapRect.left}px`;
      notificationDropdown.style.setProperty("--arrow-offset", `${center - left}px`);
      notificationCounter.hidden = true;
    }
    requestAnimationFrame(() => notificationDropdown.classList.toggle("open", open));
    notificationButton.setAttribute("aria-expanded", String(open));
  }

  notificationButton.addEventListener("click", (event) => {
    event.stopPropagation();
    setNotificationsOpen(!notificationDropdown.classList.contains("open"));
  });

  document.addEventListener("click", (event) => {
    if (notificationDropdown.classList.contains("open") && !notificationDropdown.contains(event.target)) setNotificationsOpen(false);
  });

  function closeModal() {
    cancelModal.hidden = true;
    body.style.overflow = "";
    selectedCancelButton?.focus();
  }

  document.querySelectorAll(".cancel-order").forEach((button) => {
    button.addEventListener("click", () => {
      selectedCancelButton = button;
      modalOrderNumber.textContent = `#${button.dataset.order}`;
      cancelModal.hidden = false;
      body.style.overflow = "hidden";
      document.getElementById("keepOrder").focus();
    });
  });

  cancelModal.querySelector(".modal-close").addEventListener("click", closeModal);
  document.getElementById("keepOrder").addEventListener("click", closeModal);
  cancelModal.addEventListener("click", (event) => { if (event.target === cancelModal) closeModal(); });
  document.getElementById("confirmCancel").addEventListener("click", () => {
    if (!selectedCancelButton) return;
    const row = selectedCancelButton.closest("tr");
    row.querySelector(".status").className = "status status-cancelled";
    row.querySelector(".status").innerHTML = '<i class="bi bi-x-circle"></i>ملغي';
    selectedCancelButton.disabled = true;
    selectedCancelButton.innerHTML = '<i class="bi bi-check2"></i>تم الإلغاء';
    row.classList.add("is-cancelled-row");
    closeModal();
  });

  document.querySelectorAll(".details-button").forEach((button) => {
    button.addEventListener("click", () => {
      const order = button.dataset.order;
      button.innerHTML = `<i class="bi bi-receipt"></i> الطلب #${order}`;
      window.setTimeout(() => { button.innerHTML = 'عرض التفاصيل<i class="bi bi-arrow-left"></i>'; }, 1800);
    });
  });

  window.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeSidebar();
    setNotificationsOpen(false);
    if (!cancelModal.hidden) closeModal();
  });
});
