(function (window, document) {
  "use strict";

  function initialize() {
    const body = document.body;
    const sidebar = document.getElementById("adminSidebar");
    const backdrop = document.getElementById("sidebarBackdrop");
    const menuButton = document.getElementById("menuButton");
    const usersNavGroup = document.getElementById("usersNavGroup");
    const usersNavToggle = document.getElementById("usersNavToggle");
    const usersSubmenu = document.getElementById("usersSubmenu");
    const searchInput = document.getElementById("dashboardSearch");
    const emptyOrdersRow = document.getElementById("emptyOrdersRow");
    const logoutButton = document.getElementById("logoutButton");
    const accountButton = document.getElementById("accountButton");
    const accountDropdown = document.getElementById("accountDropdown");
    const notificationButton = document.getElementById("notificationButton");
    const notificationDropdown = document.getElementById("notificationDropdown");
    const notificationCounter = document.getElementById("notificationCounter");
    const markNotificationsRead = document.getElementById("markNotificationsRead");
    const toast = document.getElementById("adminToast");
    const mobileLayout = window.matchMedia("(max-width: 760px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sidebarStorageKey = "palprints-admin-sidebar-collapsed";
    let toastTimer = 0;

    function showToast(message) {
      if (!toast) return;
      window.clearTimeout(toastTimer);
      toast.textContent = message;
      toast.classList.add("is-visible");
      toastTimer = window.setTimeout(function () {
        toast.classList.remove("is-visible");
      }, 2800);
    }

    function isSidebarOpen() {
      return mobileLayout.matches
        ? body.classList.contains("sidebar-open")
        : !body.classList.contains("sidebar-collapsed");
    }

    function syncSidebarState() {
      const open = isSidebarOpen();
      if (menuButton) {
        menuButton.setAttribute("aria-expanded", String(open));
        menuButton.setAttribute("aria-label", open ? "إغلاق القائمة" : "فتح القائمة");
        const icon = menuButton.querySelector("i");
        if (icon) icon.className = open ? "bi bi-x-lg" : "bi bi-list";
      }
      if (sidebar) {
        if (mobileLayout.matches && !open) sidebar.setAttribute("aria-hidden", "true");
        else sidebar.removeAttribute("aria-hidden");
      }
    }

    function restoreSidebarPreference() {
      if (mobileLayout.matches) {
        body.classList.remove("sidebar-collapsed");
        return;
      }
      try {
        body.classList.toggle(
          "sidebar-collapsed",
          window.localStorage.getItem(sidebarStorageKey) === "true"
        );
      } catch (error) {
        body.classList.remove("sidebar-collapsed");
      }
    }

    function closeMobileSidebar() {
      body.classList.remove("sidebar-open");
      if (backdrop) backdrop.classList.remove("open");
      syncSidebarState();
    }

    function toggleSidebar() {
      if (mobileLayout.matches) {
        const open = !body.classList.contains("sidebar-open");
        body.classList.toggle("sidebar-open", open);
        if (backdrop) backdrop.classList.toggle("open", open);
      } else {
        const collapsed = !body.classList.contains("sidebar-collapsed");
        body.classList.toggle("sidebar-collapsed", collapsed);
        try {
          window.localStorage.setItem(sidebarStorageKey, String(collapsed));
        } catch (error) {
          // The sidebar remains usable when persistence is unavailable.
        }
      }
      syncSidebarState();
    }

    function toggleUsersSubmenu() {
      if (!usersNavGroup || !usersNavToggle || !usersSubmenu) return;
      if (!mobileLayout.matches && body.classList.contains("sidebar-collapsed")) {
        body.classList.remove("sidebar-collapsed");
        usersNavGroup.classList.add("is-open");
        usersNavToggle.setAttribute("aria-expanded", "true");
        usersSubmenu.hidden = false;
        try {
          window.localStorage.setItem(sidebarStorageKey, "false");
        } catch (error) {
          // Expanding still works when persistence is unavailable.
        }
        syncSidebarState();
        return;
      }
      const open = !usersNavGroup.classList.contains("is-open");
      usersNavGroup.classList.toggle("is-open", open);
      usersNavToggle.setAttribute("aria-expanded", String(open));
      usersSubmenu.hidden = !open;
      syncSidebarState();
    }

    function closeAccountMenu() {
      if (!accountButton || !accountDropdown) return;
      accountDropdown.classList.remove("open");
      accountDropdown.hidden = true;
      accountButton.setAttribute("aria-expanded", "false");
    }

    function closeNotificationMenu() {
      if (!notificationButton || !notificationDropdown) return;
      notificationDropdown.classList.remove("open");
      notificationDropdown.hidden = true;
      notificationButton.setAttribute("aria-expanded", "false");
    }

    function normalizeSearchValue(value) {
      return String(value || "")
        .trim()
        .toLocaleLowerCase("ar")
        .replace(/[أإآ]/g, "ا")
        .replace(/ة/g, "ه")
        .replace(/ى/g, "ي");
    }

    function filterOrders() {
      if (!searchInput) return;
      const query = normalizeSearchValue(searchInput.value);
      const rows = document.querySelectorAll("[data-order-row]");
      let visibleRows = 0;
      rows.forEach(function (row) {
        const searchableText = row.getAttribute("data-search") || row.textContent;
        const matches = !query || normalizeSearchValue(searchableText).includes(query);
        row.hidden = !matches;
        if (matches) visibleRows += 1;
      });
      if (emptyOrdersRow) emptyOrdersRow.hidden = visibleRows !== 0;
    }

    function animateCounters() {
      const counters = Array.from(document.querySelectorAll("[data-admin-counter]"));
      if (reducedMotion.matches) return;
      counters.forEach(function (counter) {
        const target = Number(counter.dataset.adminCounter);
        const start = window.performance.now();
        const formatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
        function update(now) {
          const progress = Math.min((now - start) / 950, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          counter.textContent = formatter.format(Math.round(target * eased));
          if (progress < 1) window.requestAnimationFrame(update);
        }
        window.requestAnimationFrame(update);
      });
    }

    function setupSectionReveal() {
      const sections = Array.from(document.querySelectorAll("#adminDashboardMain > *"));
      sections.forEach(function (section, index) {
        section.classList.add("admin-section-reveal");
        section.style.setProperty("--reveal-delay", String(index * 65) + "ms");
      });
      if (reducedMotion.matches || !("IntersectionObserver" in window)) {
        sections.forEach(function (section) {
          section.classList.add("is-visible");
        });
        return;
      }
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.04, rootMargin: "0px 0px -6% 0px" });
      sections.forEach(function (section) {
        observer.observe(section);
      });
    }

    restoreSidebarPreference();
    setupSectionReveal();
    animateCounters();
    filterOrders();
    syncSidebarState();

    if (menuButton) menuButton.addEventListener("click", toggleSidebar);
    if (backdrop) backdrop.addEventListener("click", closeMobileSidebar);
    if (usersNavToggle) usersNavToggle.addEventListener("click", toggleUsersSubmenu);
    if (searchInput) searchInput.addEventListener("input", filterOrders);

    if (accountButton && accountDropdown) {
      accountButton.addEventListener("click", function (event) {
        event.stopPropagation();
        const open = !accountDropdown.classList.contains("open");
        closeNotificationMenu();
        accountDropdown.classList.toggle("open", open);
        accountDropdown.hidden = !open;
        accountButton.setAttribute("aria-expanded", String(open));
      });
    }

    if (notificationButton && notificationDropdown) {
      notificationButton.addEventListener("click", function (event) {
        event.stopPropagation();
        const open = !notificationDropdown.classList.contains("open");
        closeAccountMenu();
        notificationDropdown.classList.toggle("open", open);
        notificationDropdown.hidden = !open;
        notificationButton.setAttribute("aria-expanded", String(open));
      });
    }

    if (markNotificationsRead) {
      markNotificationsRead.addEventListener("click", function () {
        if (notificationCounter) notificationCounter.hidden = true;
        showToast("تم تحديد جميع الإشعارات كمقروءة.");
      });
    }

    if (logoutButton) {
      logoutButton.addEventListener("click", function () {
        if (window.confirm("هل تريد تسجيل الخروج من لوحة الإدارة؟")) {
          window.location.href = logoutButton.getAttribute("data-href") || "login.html";
        }
      });
    }

    document.querySelectorAll("[data-review]").forEach(function (button) {
      button.addEventListener("click", function () {
        showToast("تم فتح " + button.dataset.review + " للمراجعة.");
      });
    });

    document.querySelectorAll("[data-action]").forEach(function (button) {
      button.addEventListener("click", function () {
        const messages = {
          "add-product": "تم فتح نموذج إضافة منتج جديد.",
          "view-all-orders": "تم فتح قائمة الطلبات الكاملة."
        };
        showToast(messages[button.dataset.action] || "تم تنفيذ الإجراء.");
      });
    });

    document.querySelectorAll('.admin-sidebar a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function () {
        if (mobileLayout.matches) closeMobileSidebar();
      });
    });

    document.addEventListener("click", function (event) {
      if (!event.target.closest(".account-wrap")) closeAccountMenu();
      if (!event.target.closest(".notification-wrap")) closeNotificationMenu();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") return;
      closeAccountMenu();
      closeNotificationMenu();
      if (mobileLayout.matches && isSidebarOpen()) closeMobileSidebar();
    });

    function handleLayoutChange() {
      body.classList.remove("sidebar-open");
      if (backdrop) backdrop.classList.remove("open");
      restoreSidebarPreference();
      syncSidebarState();
    }

    if (typeof mobileLayout.addEventListener === "function") {
      mobileLayout.addEventListener("change", handleLayoutChange);
    } else {
      mobileLayout.addListener(handleLayoutChange);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})(window, document);
