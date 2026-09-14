(function (window, document) {
  "use strict";

  const dictionary = {
    ar: {
      documentTitle: "لوحة تحكم المطبعة | PalPrints",
      documentDescription: "لوحة تحكم المطابع في منصة PalPrints",
      skipToContent: "تخطي إلى المحتوى",
      sidebarLabel: "القائمة الجانبية للمطبعة",
      printshopNavLabel: "روابط حساب المطبعة",
      goHome: "الصفحة الرئيسية",
      openSidebar: "فتح القائمة الجانبية",
      closeSidebar: "إغلاق القائمة الجانبية",
      changeTheme: "تغيير المظهر",
      changeLanguage: "تغيير اللغة",
      switchToDark: "التبديل إلى الوضع الداكن",
      switchToLight: "التبديل إلى الوضع الفاتح",
      notifications: "الإشعارات",
      dashboard: "لوحة التحكم",
      profile: "الملف الشخصي",
      printingServices: "خدمات الطباعة",
      printingOrders: "طلبات الطباعة",
      earningsWallet: "الأرباح والمحفظة",
      settings: "الإعدادات",
      support: "التواصل مع الدعم الفني",
      logout: "تسجيل الخروج",
      logoutConfirm: "هل تريد تسجيل الخروج من حساب المطبعة؟"
    },
    en: {
      documentTitle: "Print Shop Dashboard | PalPrints",
      documentDescription: "Print shop dashboard on PalPrints",
      skipToContent: "Skip to content",
      sidebarLabel: "Print shop sidebar",
      printshopNavLabel: "Print shop account links",
      goHome: "Home",
      openSidebar: "Open sidebar",
      closeSidebar: "Close sidebar",
      changeTheme: "Change theme",
      changeLanguage: "Change language",
      switchToDark: "Switch to dark mode",
      switchToLight: "Switch to light mode",
      notifications: "Notifications",
      dashboard: "Dashboard",
      profile: "Profile",
      printingServices: "Printing services",
      printingOrders: "Printing orders",
      earningsWallet: "Earnings & wallet",
      settings: "Settings",
      support: "Contact support",
      logout: "Log out",
      logoutConfirm: "Do you want to log out of the print shop account?"
    }
  };

  const toast = document.getElementById("dashboardToast");
  const searchForm = document.getElementById("dashboardSearchForm");
  const searchInput = document.getElementById("dashboardSearch");
  const clearSearchButton = document.getElementById("clearSearchButton");
  const emptySearchRow = document.getElementById("emptySearchRow");
  let toastTimer = 0;

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
      const searchableText = normalizeSearchValue(
        row.getAttribute("data-search") || row.textContent
      );
      const matches = !query || searchableText.includes(query);

      row.hidden = !matches;
      if (matches) visibleRows += 1;
    });

    if (emptySearchRow) emptySearchRow.hidden = visibleRows !== 0;
    if (clearSearchButton) clearSearchButton.hidden = query.length === 0;
  }

  function resetSearch() {
    window.setTimeout(function () {
      if (searchInput) searchInput.value = "";
      filterOrders();
      if (searchInput) searchInput.focus();
    }, 0);
  }

  function showToast(message) {
    if (!toast) return;

    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("is-visible");

    toastTimer = window.setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 2600);
  }

  function handleUnavailableLinks(event) {
    const link = event.target.closest("a[href]");

    if (!link || link.getAttribute("href") !== "#") return;

    event.preventDefault();
    showToast(link.getAttribute("data-message") || "ستتوفر هذه الميزة قريبًا.");
  }

  function initialize() {
    if (window.PalProfile) {
      window.PalProfile.init({
        dictionary: dictionary,
        sidebar: {
          desktopInitial: "open",
          persist: true
        }
      });
    }

    filterOrders();

    if (searchInput) searchInput.addEventListener("input", filterOrders);
    if (searchForm) {
      searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
      });
      searchForm.addEventListener("reset", resetSearch);
    }

    document.addEventListener("click", handleUnavailableLinks);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})(window, document);
