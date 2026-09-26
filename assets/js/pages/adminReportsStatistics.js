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
    const logoutButton = document.getElementById("logoutButton");
    const accountButton = document.getElementById("accountButton");
    const accountDropdown = document.getElementById("accountDropdown");
    const notificationButton = document.getElementById("notificationButton");
    const notificationDropdown = document.getElementById("notificationDropdown");
    const notificationCounter = document.getElementById("notificationCounter");
    const markNotificationsRead = document.getElementById("markNotificationsRead");
    const exportReportButton = document.getElementById("exportReportButton");
    const exportFormatMenu = document.getElementById("exportFormatMenu");
    const toast = document.getElementById("adminToast");
    const mobileLayout = window.matchMedia("(max-width: 760px)");
    const sidebarStorageKey = "palprints-admin-sidebar-collapsed";
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const periodLabels = {
      week: "هذا الأسبوع",
      month: "هذا الشهر",
      quarter: "آخر ٣ أشهر",
      year: "هذه السنة"
    };
    const periodMultipliers = { week: 0.24, month: 1, quarter: 2.86, year: 11.87 };
    const reportData = {
      sales: [
        { title: "إجمالي الإيرادات", value: 46200, prefix: "₪ ", scalable: true, change: 18 },
        { title: "إجمالي الطلبات", value: 528, suffix: " طلب", scalable: true, change: 12 },
        { title: "متوسط قيمة الطلب", value: 121, prefix: "₪ ", change: 5 },
        { title: "أعلى مبيعًا", text: "تيشيرت" }
      ],
      orders: [
        { title: "الطلبات المكتملة", value: 412, suffix: " طلب", scalable: true, change: 14 },
        { title: "قيد التنفيذ", value: 83, suffix: " طلب", scalable: true, change: 9 },
        { title: "الطلبات الملغاة", value: 33, suffix: " طلب", scalable: true, change: -3 },
        { title: "معدل الإكمال", value: 78, suffix: "%", change: 6 }
      ],
      profits: [
        { title: "صافي الأرباح", value: 18480, prefix: "₪ ", scalable: true, change: 16 },
        { title: "إجمالي العمولات", value: 6940, prefix: "₪ ", scalable: true, change: 11 },
        { title: "دفعات المصممين", value: 8210, prefix: "₪ ", scalable: true, change: 8 },
        { title: "هامش الربح", value: 40, suffix: "%", change: 4 }
      ],
      users: [
        { title: "إجمالي المستخدمين", value: 4281, scalable: false, change: 12 },
        { title: "مستخدمون جدد", value: 286, scalable: true, change: 15 },
        { title: "المستخدمون النشطون", value: 3140, scalable: false, change: 9 },
        { title: "معدل النمو", value: 12, suffix: "%", change: 3 }
      ]
    };
    let activePeriod = "month";
    let activeReport = "sales";
    let chartAnimationRun = 0;
    let breakdownAnimationRun = 0;
    let toastTimer;

    function formatStat(value, item) {
      return (item.prefix || "") + new Intl.NumberFormat("en-US").format(value) + (item.suffix || "");
    }

    function animateCounter(element, target, item) {
      if (reducedMotion.matches) {
        element.textContent = formatStat(target, item);
        return;
      }
      const start = window.performance.now();
      const duration = 700;
      function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = formatStat(Math.round(target * eased), item);
        if (progress < 1) window.requestAnimationFrame(update);
      }
      window.requestAnimationFrame(update);
    }

    function animateMiniCharts() {
      if (reducedMotion.matches) return;
      const cards = document.querySelectorAll("[data-stat-card]");
      cards.forEach(function (card) {
        card.classList.remove("is-chart-animating");
      });
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
          cards.forEach(function (card) {
            card.classList.add("is-chart-animating");
          });
        });
      });
    }

    function animateChartCounters() {
      const chartGrid = document.querySelector(".reports-charts-grid");
      if (!chartGrid) return;
      const productCounters = Array.from(chartGrid.querySelectorAll(".product-sales-row strong"));
      const monthlyCounters = Array.from(chartGrid.querySelectorAll(".monthly-bar b")).reverse();
      const counters = productCounters.map(function (counter, index) {
        return { counter: counter, delayIndex: index };
      }).concat(monthlyCounters.map(function (counter, index) {
        return { counter: counter, delayIndex: index };
      }));
      const run = ++chartAnimationRun;
      chartGrid.classList.remove("is-data-animating");

      counters.forEach(function (entry) {
        const counter = entry.counter;
        const delayIndex = entry.delayIndex;
        if (!counter.dataset.chartTarget) counter.dataset.chartTarget = counter.textContent.replace(/[^0-9.-]/g, "");
        const target = Number(counter.dataset.chartTarget);
        const chartItem = counter.closest(".monthly-bar, .product-sales-row");
        if (chartItem) chartItem.style.setProperty("--chart-delay", String(delayIndex * 55) + "ms");
        if (reducedMotion.matches) {
          counter.textContent = new Intl.NumberFormat("en-US").format(target);
          return;
        }
        counter.textContent = "0";
        const delay = delayIndex * 55;
        window.setTimeout(function () {
          if (run !== chartAnimationRun) return;
          const start = window.performance.now();
          function update(now) {
            if (run !== chartAnimationRun) return;
            const progress = Math.min((now - start) / 780, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = new Intl.NumberFormat("en-US").format(Math.round(target * eased));
            if (progress < 1) window.requestAnimationFrame(update);
          }
          window.requestAnimationFrame(update);
        }, delay);
      });

      if (!reducedMotion.matches) {
        window.requestAnimationFrame(function () {
          window.requestAnimationFrame(function () {
            if (run === chartAnimationRun) chartGrid.classList.add("is-data-animating");
          });
        });
      }
    }

    function animateBreakdownCharts() {
      const breakdownGrid = document.querySelector(".reports-breakdown-grid");
      if (!breakdownGrid) return;
      const counters = Array.from(breakdownGrid.querySelectorAll(".city-sales-row strong bdi, .revenue-legend strong bdi, .revenue-donut strong"));
      const run = ++breakdownAnimationRun;
      breakdownGrid.classList.remove("is-breakdown-animating");

      breakdownGrid.querySelectorAll(".city-sales-row").forEach(function (row, index) {
        row.style.setProperty("--breakdown-delay", String(index * 80) + "ms");
      });
      breakdownGrid.querySelectorAll(".revenue-legend li").forEach(function (item, index) {
        item.style.setProperty("--breakdown-delay", String(index * 70 + 180) + "ms");
      });

      counters.forEach(function (counter, index) {
        if (!counter.dataset.breakdownTarget) counter.dataset.breakdownTarget = counter.textContent.replace(/[^0-9.-]/g, "");
        const target = Number(counter.dataset.breakdownTarget);
        const hasCurrency = counter.closest(".city-sales-row, .revenue-legend");
        if (reducedMotion.matches) {
          counter.textContent = (hasCurrency ? "₪ " : "") + new Intl.NumberFormat("en-US").format(target);
          return;
        }
        counter.textContent = hasCurrency ? "₪ 0" : "0";
        window.setTimeout(function () {
          if (run !== breakdownAnimationRun) return;
          const start = window.performance.now();
          function update(now) {
            if (run !== breakdownAnimationRun) return;
            const progress = Math.min((now - start) / 800, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = (hasCurrency ? "₪ " : "") + new Intl.NumberFormat("en-US").format(Math.round(target * eased));
            if (progress < 1) window.requestAnimationFrame(update);
          }
          window.requestAnimationFrame(update);
        }, index * 45);
      });

      if (!reducedMotion.matches) {
        window.requestAnimationFrame(function () {
          window.requestAnimationFrame(function () {
            if (run === breakdownAnimationRun) breakdownGrid.classList.add("is-breakdown-animating");
          });
        });
      }
    }

    function updateReportCards() {
      const multiplier = periodMultipliers[activePeriod];
      document.querySelectorAll("[data-stat-card]").forEach(function (card, index) {
        const item = reportData[activeReport][index];
        const title = card.querySelector("[data-stat-title]");
        const value = card.querySelector("[data-stat-value]");
        const change = card.querySelector("[data-stat-change]");
        title.textContent = item.title;
        card.classList.toggle("is-text-stat", Boolean(item.text));
        if (item.text) value.textContent = item.text;
        else animateCounter(value, item.scalable ? Math.round(item.value * multiplier) : item.value, item);
        if (change) {
          change.hidden = typeof item.change !== "number";
          if (typeof item.change === "number") {
            const adjustedChange = item.change + ({ week: -2, month: 0, quarter: 3, year: 7 }[activePeriod]);
            const positive = adjustedChange >= 0;
            change.classList.toggle("is-positive", positive);
            change.classList.toggle("is-negative", !positive);
            change.innerHTML = '<i class="bi bi-caret-' + (positive ? "up" : "down") + '-fill" aria-hidden="true"></i> ' + Math.abs(adjustedChange) + "%";
          }
        }
      });
      document.querySelectorAll("[data-period-label]").forEach(function (label) {
        label.textContent = periodLabels[activePeriod];
      });
      animateMiniCharts();
      animateChartCounters();
      animateBreakdownCharts();
    }

    function showToast(message) {
      if (!toast) return;
      window.clearTimeout(toastTimer);
      toast.textContent = message;
      toast.classList.add("is-visible");
      toastTimer = window.setTimeout(function () {
        toast.classList.remove("is-visible");
      }, 2800);
    }

    function closeExportMenu() {
      exportFormatMenu.hidden = true;
      exportReportButton.setAttribute("aria-expanded", "false");
    }

    function collectReportRows() {
      const rows = [["القسم", "القيمة", "الفترة"]];
      document.querySelectorAll("[data-stat-card]").forEach(function (card) {
        rows.push([
          card.querySelector("[data-stat-title]").textContent.trim(),
          card.querySelector("[data-stat-value]").textContent.trim(),
          card.querySelector("[data-period-label]").textContent.trim()
        ]);
      });
      return rows;
    }

    function downloadBlob(content, type, extension) {
      const blobUrl = URL.createObjectURL(new Blob([content], { type: type }));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "palprints-report-" + activeReport + "-" + activePeriod + "." + extension;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(function () { URL.revokeObjectURL(blobUrl); }, 1000);
    }

    function exportReport(format) {
      const rows = collectReportRows();
      if (format === "csv") {
        const csv = rows.map(function (row) {
          return row.map(function (cell) { return '"' + String(cell).replace(/"/g, '""') + '"'; }).join(",");
        }).join("\r\n");
        downloadBlob("\ufeff" + csv, "text/csv;charset=utf-8", "csv");
        showToast("تم تنزيل التقرير بصيغة CSV.");
      } else if (format === "xlsx") {
        const tableRows = rows.map(function (row) {
          return "<tr>" + row.map(function (cell) { return "<td>" + cell + "</td>"; }).join("") + "</tr>";
        }).join("");
        const excel = '<html dir="rtl"><head><meta charset="UTF-8"></head><body><table border="1">' + tableRows + "</table></body></html>";
        downloadBlob(excel, "application/vnd.ms-excel;charset=utf-8", "xls");
        showToast("تم تنزيل التقرير بصيغة Excel.");
      } else if (format === "pdf") {
        showToast("اختر حفظ كملف PDF من نافذة الطباعة.");
        window.setTimeout(function () { window.print(); }, 180);
      }
      closeExportMenu();
    }

    function isSidebarOpen() {
      return mobileLayout.matches ? body.classList.contains("sidebar-open") : !body.classList.contains("sidebar-collapsed");
    }

    function syncSidebarState() {
      const open = isSidebarOpen();
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "إغلاق القائمة" : "فتح القائمة");
      menuButton.querySelector("i").className = open ? "bi bi-x-lg" : "bi bi-list";
      if (mobileLayout.matches && !open) sidebar.setAttribute("aria-hidden", "true");
      else sidebar.removeAttribute("aria-hidden");
    }

    function restoreSidebarPreference() {
      if (mobileLayout.matches) {
        body.classList.remove("sidebar-collapsed");
        return;
      }
      try {
        const preference = window.localStorage.getItem(sidebarStorageKey);
        if (preference !== null) body.classList.toggle("sidebar-collapsed", preference === "true");
      } catch (error) {
        // Keep the markup default if local storage is unavailable.
      }
    }

    function closeMobileSidebar() {
      body.classList.remove("sidebar-open");
      backdrop.classList.remove("open");
      syncSidebarState();
    }

    function toggleSidebar() {
      if (mobileLayout.matches) {
        const open = !body.classList.contains("sidebar-open");
        body.classList.toggle("sidebar-open", open);
        backdrop.classList.toggle("open", open);
      } else {
        const collapsed = !body.classList.contains("sidebar-collapsed");
        body.classList.toggle("sidebar-collapsed", collapsed);
        try {
          window.localStorage.setItem(sidebarStorageKey, String(collapsed));
        } catch (error) {
          // The sidebar still works without persistence.
        }
      }
      syncSidebarState();
    }

    function toggleUsersSubmenu() {
      if (!mobileLayout.matches && body.classList.contains("sidebar-collapsed")) {
        body.classList.remove("sidebar-collapsed");
      }
      const open = !usersNavGroup.classList.contains("is-open");
      usersNavGroup.classList.toggle("is-open", open);
      usersNavToggle.setAttribute("aria-expanded", String(open));
      usersSubmenu.hidden = !open;
      syncSidebarState();
    }

    function closeMenu(button, dropdown) {
      dropdown.classList.remove("open");
      dropdown.hidden = true;
      button.setAttribute("aria-expanded", "false");
    }

    function toggleMenu(button, dropdown, otherButton, otherDropdown) {
      const open = !dropdown.classList.contains("open");
      closeMenu(otherButton, otherDropdown);
      dropdown.classList.toggle("open", open);
      dropdown.hidden = !open;
      button.setAttribute("aria-expanded", String(open));
    }

    restoreSidebarPreference();
    syncSidebarState();
    updateReportCards();

    menuButton.addEventListener("click", toggleSidebar);
    backdrop.addEventListener("click", closeMobileSidebar);
    usersNavToggle.addEventListener("click", toggleUsersSubmenu);
    accountButton.addEventListener("click", function (event) {
      event.stopPropagation();
      toggleMenu(accountButton, accountDropdown, notificationButton, notificationDropdown);
    });
    notificationButton.addEventListener("click", function (event) {
      event.stopPropagation();
      toggleMenu(notificationButton, notificationDropdown, accountButton, accountDropdown);
    });
    markNotificationsRead.addEventListener("click", function () {
      notificationCounter.hidden = true;
      showToast("تم تحديد جميع الإشعارات كمقروءة.");
    });
    document.querySelectorAll("[data-period]").forEach(function (button) {
      button.addEventListener("click", function () {
        activePeriod = button.dataset.period;
        document.querySelectorAll("[data-period]").forEach(function (item) {
          item.classList.toggle("active", item === button);
        });
        updateReportCards();
      });
    });
    document.querySelectorAll(".report-tabs [role='tab']").forEach(function (tab) {
      tab.addEventListener("click", function () {
        activeReport = tab.dataset.report;
        document.querySelectorAll(".report-tabs [role='tab']").forEach(function (item) {
          const selected = item === tab;
          item.classList.toggle("active", selected);
          item.setAttribute("aria-selected", String(selected));
        });
        updateReportCards();
      });
    });
    exportReportButton.addEventListener("click", function (event) {
      event.stopPropagation();
      const open = exportFormatMenu.hidden;
      exportFormatMenu.hidden = !open;
      exportReportButton.setAttribute("aria-expanded", String(open));
      if (open) exportFormatMenu.querySelector("button").focus();
    });
    exportFormatMenu.addEventListener("click", function (event) {
      const option = event.target.closest("[data-export-format]");
      if (option) exportReport(option.dataset.exportFormat);
    });
    logoutButton.addEventListener("click", function () {
      if (window.confirm("هل تريد تسجيل الخروج من لوحة الإدارة؟")) {
        window.location.href = logoutButton.dataset.href || "login.html";
      }
    });

    document.addEventListener("click", function (event) {
      if (!event.target.closest(".account-wrap")) closeMenu(accountButton, accountDropdown);
      if (!event.target.closest(".notification-wrap")) closeMenu(notificationButton, notificationDropdown);
      if (!event.target.closest(".export-menu-wrap")) closeExportMenu();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") return;
      closeMenu(accountButton, accountDropdown);
      closeMenu(notificationButton, notificationDropdown);
      closeExportMenu();
      if (mobileLayout.matches && isSidebarOpen()) closeMobileSidebar();
    });

    function handleLayoutChange() {
      body.classList.remove("sidebar-open");
      backdrop.classList.remove("open");
      restoreSidebarPreference();
      syncSidebarState();
    }

    if (typeof mobileLayout.addEventListener === "function") mobileLayout.addEventListener("change", handleLayoutChange);
    else mobileLayout.addListener(handleLayoutChange);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, { once: true });
  else initialize();
})(window, document);
