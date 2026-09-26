(function (window, document) {
  "use strict";

  function initialize() {
    const body = document.body;
    const sidebar = document.getElementById("adminSidebar");
    const backdrop = document.getElementById("sidebarBackdrop");
    const menuButton = document.getElementById("menuButton");
    const usersGroup = document.getElementById("usersNavGroup");
    const usersToggle = document.getElementById("usersNavToggle");
    const usersSubmenu = document.getElementById("usersSubmenu");
    const accountButton = document.getElementById("accountButton");
    const accountDropdown = document.getElementById("accountDropdown");
    const notificationButton = document.getElementById("notificationButton");
    const notificationDropdown = document.getElementById("notificationDropdown");
    const notificationCounter = document.getElementById("notificationCounter");
    const markReadButton = document.getElementById("markNotificationsRead");
    const logoutButton = document.getElementById("logoutButton");
    const toast = document.getElementById("adminToast");
    const shippingEmptyRow = document.getElementById("shippingEmptyRow");
    const shippingResultsCount = document.getElementById("shippingResultsCount");
    const mobileLayout = window.matchMedia("(max-width: 760px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const storageKey = "palprints-admin-sidebar-collapsed";
    let activeShippingFilter = "all";

    function isSidebarOpen() {
      return mobileLayout.matches ? body.classList.contains("sidebar-open") : !body.classList.contains("sidebar-collapsed");
    }

    function syncSidebar() {
      const open = isSidebarOpen();
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "إغلاق القائمة" : "فتح القائمة");
      menuButton.querySelector("i").className = open ? "bi bi-x-lg" : "bi bi-list";
      if (mobileLayout.matches && !open) sidebar.setAttribute("aria-hidden", "true");
      else sidebar.removeAttribute("aria-hidden");
    }

    function restoreSidebar() {
      if (mobileLayout.matches) {
        body.classList.remove("sidebar-collapsed");
        return;
      }
      try {
        const saved = window.localStorage.getItem(storageKey);
        if (saved !== null) body.classList.toggle("sidebar-collapsed", saved === "true");
      } catch (error) {
        // Keep the markup default when storage is unavailable.
      }
    }

    function closeMobileSidebar() {
      body.classList.remove("sidebar-open");
      backdrop.classList.remove("open");
      syncSidebar();
    }

    function toggleSidebar() {
      if (mobileLayout.matches) {
        const open = !body.classList.contains("sidebar-open");
        body.classList.toggle("sidebar-open", open);
        backdrop.classList.toggle("open", open);
      } else {
        const collapsed = !body.classList.contains("sidebar-collapsed");
        body.classList.toggle("sidebar-collapsed", collapsed);
        try { window.localStorage.setItem(storageKey, String(collapsed)); } catch (error) {}
      }
      syncSidebar();
    }

    function closeMenu(button, menu) {
      menu.hidden = true;
      menu.classList.remove("open");
      button.setAttribute("aria-expanded", "false");
    }

    function toggleMenu(button, menu, otherButton, otherMenu) {
      const open = menu.hidden;
      closeMenu(otherButton, otherMenu);
      menu.hidden = !open;
      menu.classList.toggle("open", open);
      button.setAttribute("aria-expanded", String(open));
    }

    function showToast(message) {
      toast.textContent = message;
      toast.classList.add("is-visible");
      window.setTimeout(function () { toast.classList.remove("is-visible"); }, 2600);
    }

    function animateShippingCounters() {
      document.querySelectorAll("[data-shipping-counter]").forEach(function (counter, index) {
        const target = Number(counter.dataset.shippingCounter);
        if (reducedMotion.matches) {
          counter.textContent = String(target);
          return;
        }
        counter.textContent = "0";
        window.setTimeout(function () {
          const start = window.performance.now();
          function update(now) {
            const progress = Math.min((now - start) / 700, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = String(Math.round(target * eased));
            if (progress < 1) window.requestAnimationFrame(update);
          }
          window.requestAnimationFrame(update);
        }, index * 90);
      });
    }

    function filterShipments() {
      let visible = 0;
      document.querySelectorAll("[data-shipping-row]").forEach(function (row) {
        const statusMatches = activeShippingFilter === "all" || row.dataset.status === activeShippingFilter;
        row.hidden = !statusMatches;
        if (!row.hidden) visible += 1;
      });
      shippingEmptyRow.hidden = visible !== 0;
      shippingResultsCount.textContent = "عرض " + visible + " من أصل 9 شحنات";
    }

    restoreSidebar();
    syncSidebar();
    animateShippingCounters();
    filterShipments();
    menuButton.addEventListener("click", toggleSidebar);
    backdrop.addEventListener("click", closeMobileSidebar);
    usersToggle.addEventListener("click", function () {
      if (!mobileLayout.matches && body.classList.contains("sidebar-collapsed")) body.classList.remove("sidebar-collapsed");
      const open = !usersGroup.classList.contains("is-open");
      usersGroup.classList.toggle("is-open", open);
      usersToggle.setAttribute("aria-expanded", String(open));
      usersSubmenu.hidden = !open;
      syncSidebar();
    });
    accountButton.addEventListener("click", function (event) {
      event.stopPropagation();
      toggleMenu(accountButton, accountDropdown, notificationButton, notificationDropdown);
    });
    notificationButton.addEventListener("click", function (event) {
      event.stopPropagation();
      toggleMenu(notificationButton, notificationDropdown, accountButton, accountDropdown);
    });
    markReadButton.addEventListener("click", function () {
      notificationCounter.hidden = true;
      showToast("تم تحديد جميع الإشعارات كمقروءة.");
    });
    document.querySelectorAll("[data-shipping-filter]").forEach(function (button) {
      button.addEventListener("click", function () {
        activeShippingFilter = button.dataset.shippingFilter;
        document.querySelectorAll("[data-shipping-filter]").forEach(function (item) { item.classList.toggle("active", item === button); });
        filterShipments();
      });
    });
    logoutButton.addEventListener("click", function () {
      if (window.confirm("هل تريد تسجيل الخروج من لوحة الإدارة؟")) window.location.href = logoutButton.dataset.href || "login.html";
    });
    document.addEventListener("click", function (event) {
      if (!event.target.closest(".account-wrap")) closeMenu(accountButton, accountDropdown);
      if (!event.target.closest(".notification-wrap")) closeMenu(notificationButton, notificationDropdown);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") return;
      closeMenu(accountButton, accountDropdown);
      closeMenu(notificationButton, notificationDropdown);
      if (mobileLayout.matches && isSidebarOpen()) closeMobileSidebar();
    });
    function handleLayoutChange() {
      body.classList.remove("sidebar-open");
      backdrop.classList.remove("open");
      restoreSidebar();
      syncSidebar();
    }
    if (typeof mobileLayout.addEventListener === "function") mobileLayout.addEventListener("change", handleLayoutChange);
    else mobileLayout.addListener(handleLayoutChange);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, { once: true });
  else initialize();
})(window, document);
