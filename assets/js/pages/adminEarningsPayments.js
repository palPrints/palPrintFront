"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("adminSidebar");
  const backdrop = document.getElementById("sidebarBackdrop");
  const menuButton = document.getElementById("menuButton");
  const mobileLayout = window.matchMedia("(max-width: 760px)");

  const summaryCounters = Array.from(document.querySelectorAll("[data-counter]"));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const formatCounter = (value, decimals) => new Intl.NumberFormat("ar", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

  const animateCounter = (counter) => {
    if (counter.dataset.animated === "true") return;
    counter.dataset.animated = "true";

    const target = Number(counter.dataset.counter);
    const decimals = Number(counter.dataset.counterDecimals || 0);
    const duration = 1200;
    const startTime = performance.now();

    const draw = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      counter.textContent = formatCounter(current, decimals);
      if (progress < 1) requestAnimationFrame(draw);
    };

    requestAnimationFrame(draw);
  };

  if (reducedMotion || !("IntersectionObserver" in window)) {
    summaryCounters.forEach((counter) => {
      counter.textContent = formatCounter(Number(counter.dataset.counter), Number(counter.dataset.counterDecimals || 0));
    });
  } else {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      });
    }, { threshold: 0.55 });

    summaryCounters.forEach((counter) => {
      counter.textContent = formatCounter(0, Number(counter.dataset.counterDecimals || 0));
      counterObserver.observe(counter);
    });
  }

  document.querySelectorAll(".nav-group-toggle").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const group = toggle.closest(".nav-group");
      const isOpen = group.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  });

  const financeTabs = Array.from(document.querySelectorAll("[data-finance-filter]"));
  const financePanels = Array.from(document.querySelectorAll("[data-finance-panel]"));

  const activateFinanceFilter = (selectedTab) => {
    const selectedFilter = selectedTab.dataset.financeFilter;

    financeTabs.forEach((tab) => {
      const isActive = tab === selectedTab;
      tab.classList.toggle("active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
    });

    financePanels.forEach((panel) => {
      panel.hidden = panel.dataset.financePanel !== selectedFilter;
    });
  };

  financeTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateFinanceFilter(tab));

    tab.addEventListener("keydown", (event) => {
      if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
      event.preventDefault();

      let nextIndex = index;
      if (event.key === "ArrowRight") nextIndex = (index - 1 + financeTabs.length) % financeTabs.length;
      if (event.key === "ArrowLeft") nextIndex = (index + 1) % financeTabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = financeTabs.length - 1;

      financeTabs[nextIndex].focus();
      activateFinanceFilter(financeTabs[nextIndex]);
    });
  });

  const detailsDialog = document.getElementById("detailsDialog");
  const detailsDialogTitle = document.getElementById("detailsDialogTitle");
  const detailsDialogSubtitle = document.getElementById("detailsDialogSubtitle");
  const detailsList = document.getElementById("detailsList");
  const detailsDialogFooter = document.getElementById("detailsDialogFooter");
  const dialogReviewActions = document.getElementById("dialogReviewActions");
  const dialogApprove = document.getElementById("dialogApprove");
  const dialogReject = document.getElementById("dialogReject");
  let activeDetailsRow = null;

  const detailSchemas = {
    withdrawal: {
      title: "تفاصيل طلب السحب",
      labels: ["التفاصيل", "الحالة", "طريقة السحب", "تاريخ الطلب", "المبلغ", "نوع الحساب", "صاحب الطلب"],
      visibleIndexes: [6, 5, 4, 3, 2, 1],
    },
    transaction: {
      title: "تفاصيل المعاملة المالية",
      labels: ["التفاصيل", "الحالة", "المبلغ", "طريقة الدفع", "المستفيد", "نوع المعاملة", "التاريخ", "رقم المعاملة"],
      visibleIndexes: [7, 6, 5, 4, 3, 2, 1],
    },
  };

  document.addEventListener("click", (event) => {
    const detailsButton = event.target.closest(".details-button[data-detail-kind]");
    if (!detailsButton) return;

    const row = detailsButton.closest("tr");
    const cells = Array.from(row.cells);
    const schema = detailSchemas[detailsButton.dataset.detailKind];
    activeDetailsRow = row;

    detailsDialogTitle.textContent = schema.title;
    detailsDialogSubtitle.textContent = detailsButton.dataset.detailKind === "withdrawal"
      ? "راجع بيانات الطلب قبل اتخاذ القرار"
      : "بيانات العملية المسجلة في النظام";

    detailsList.replaceChildren(...schema.visibleIndexes.map((cellIndex) => {
      const item = document.createElement("div");
      const term = document.createElement("dt");
      const value = document.createElement("dd");
      term.textContent = schema.labels[cellIndex];
      value.textContent = cells[cellIndex].innerText.trim();
      item.append(term, value);
      return item;
    }));

    const isPendingWithdrawal = detailsButton.dataset.detailKind === "withdrawal"
      && row.querySelector(".payment-status")?.classList.contains("pending");
    dialogReviewActions.hidden = !isPendingWithdrawal;
    detailsDialogFooter.hidden = !isPendingWithdrawal;

    detailsDialog.showModal();
  });

  const reviewWithdrawal = (approved) => {
    if (!activeDetailsRow) return;
    const status = activeDetailsRow.querySelector(".payment-status");
    status.className = `payment-status ${approved ? "completed" : "failed"}`;
    status.textContent = approved ? "تم الاعتماد" : "مرفوض";
    dialogReviewActions.hidden = true;
    detailsDialog.close();
  };

  dialogApprove.addEventListener("click", () => reviewWithdrawal(true));
  dialogReject.addEventListener("click", () => reviewWithdrawal(false));


  detailsDialog.querySelectorAll("[data-dialog-close]").forEach((button) => {
    button.addEventListener("click", () => detailsDialog.close());
  });

  detailsDialog.addEventListener("click", (event) => {
    if (event.target === detailsDialog) detailsDialog.close();
  });

  const syncMenuState = () => {
    const isOpen = mobileLayout.matches
      ? document.body.classList.contains("sidebar-open")
      : !document.body.classList.contains("sidebar-collapsed");

    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "إغلاق القائمة" : "فتح القائمة");
    menuButton.querySelector("i").className = isOpen ? "bi bi-x-lg" : "bi bi-list";
  };

  const closeMobileMenu = () => {
    document.body.classList.remove("sidebar-open");
    syncMenuState();
  };

  menuButton.addEventListener("click", () => {
    if (mobileLayout.matches) {
      document.body.classList.toggle("sidebar-open");
    } else {
      document.body.classList.toggle("sidebar-collapsed");
    }
    syncMenuState();
  });

  backdrop.addEventListener("click", closeMobileMenu);
  sidebar.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMobileMenu));
  mobileLayout.addEventListener("change", closeMobileMenu);

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
    const willOpen = !dropdown.classList.contains("open");
    closeDropdown(otherButton, otherDropdown);
    dropdown.classList.toggle("open", willOpen);
    dropdown.hidden = !willOpen;
    button.setAttribute("aria-expanded", String(willOpen));
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
    if (!accountDropdown.contains(event.target)) closeDropdown(accountButton, accountDropdown);
    if (!notificationDropdown.contains(event.target)) closeDropdown(notificationButton, notificationDropdown);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeDropdown(accountButton, accountDropdown);
    closeDropdown(notificationButton, notificationDropdown);
    closeMobileMenu();
  });

  syncMenuState();
});
