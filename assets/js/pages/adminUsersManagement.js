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
    const pageTitle = document.getElementById("usersPageTitle");
    const usersManagement = document.querySelector(".users-management");
    const usersFilters = document.getElementById("usersFilters");
    const usersPanel = document.getElementById("usersPanel");
    const usersListTitle = document.getElementById("usersListTitle");
    const usersCount = document.getElementById("usersCount");
    const usersList = document.getElementById("usersList");
    const usersEmpty = document.getElementById("usersEmpty");
    const customerDialog = document.getElementById("customerDetailsDialog");
    const closeCustomerDialog = document.getElementById("closeCustomerDialog");
    const customerDisableButton = document.getElementById("customerDisableButton");
    const mobileLayout = window.matchMedia("(max-width: 760px)");
    const storageKey = "palprints-admin-sidebar-collapsed";
    const userTypes = {
      customers: {
        title: "العملاء", icon: "bi-person", metricIcon: "bi-cart3", metricLabel: "طلب",
        users: [
          { name: "محمد الخطيب", email: "m.kahlout@email.com", phone: "+970 599 111 222", city: "غزة", registered: "10 يناير 2026", metric: 14, spend: "₪1,190", lastOrder: "18 سبتمبر 2026", status: "active" },
          { name: "علا المصري", email: "ola.masri@email.com", phone: "+970 598 204 731", city: "رام الله", registered: "22 فبراير 2026", metric: 7, spend: "₪640", lastOrder: "19 سبتمبر 2026", status: "active" },
          { name: "يامن أبو شاويش", email: "yamen.a@email.com", phone: "+970 597 330 184", city: "نابلس", registered: "5 مارس 2026", metric: 22, spend: "₪2,080", lastOrder: "17 سبتمبر 2026", status: "active" },
          { name: "نوال أبو رزق", email: "nowal.r@email.com", phone: "+970 599 840 265", city: "الخليل", registered: "14 أبريل 2026", metric: 3, spend: "₪275", lastOrder: "21 سبتمبر 2026", status: "suspended" },
          { name: "أحمد سالم", email: "ahmed.s@email.com", phone: "+970 595 127 660", city: "جنين", registered: "30 مايو 2026", metric: 9, spend: "₪810", lastOrder: "16 سبتمبر 2026", status: "active" },
          { name: "جمانة الحدّوج", email: "jumana.d@email.com", phone: "+970 598 445 912", city: "غزة", registered: "11 يونيو 2026", metric: 2, spend: "₪185", lastOrder: "12 سبتمبر 2026", status: "active" }
        ]
      },
      designers: {
        title: "المصممون", icon: "bi-palette", metricIcon: "bi-palette", metricLabel: "تصميم",
        users: [
          { name: "أريج ناجي", email: "areej.n@design.com", phone: "+970 594 100 200", city: "رام الله", joined: "5 فبراير 2026", portfolio: "behance.net/areej", metric: 18, sales: 102, status: "active" },
          { name: "سامر علي", email: "samer.ali@design.com", phone: "+970 598 246 310", city: "نابلس", joined: "12 مارس 2026", portfolio: "behance.net/samer-ali", metric: 9, sales: 61, status: "active" },
          { name: "هند محمود", email: "hind.m@design.com", phone: "+970 599 720 184", city: "غزة", joined: "18 أبريل 2026", portfolio: "behance.net/hind-m", metric: 4, sales: 13, status: "pending" },
          { name: "خالد عبد النور", email: "k.abdalnour@design.com", phone: "+970 595 800 411", city: "الخليل", joined: "2 مايو 2026", portfolio: "behance.net/khaled-an", metric: 0, sales: 0, status: "pending" },
          { name: "ريم الحسن", email: "reem.h@design.com", phone: "+970 597 334 208", city: "جنين", joined: "20 مايو 2026", portfolio: "behance.net/reem-h", metric: 0, sales: 0, status: "pending" }
        ]
      },
      printShops: {
        title: "المطابع", icon: "bi-shop-window", metricIcon: "bi-box-seam", metricLabel: "منتج",
        users: [
          { name: "مطبعة النور", email: "alnour@print.com", phone: "+970 590 010 020", city: "رام الله", joined: "20 يناير 2026", metric: 87, activeJobs: 5, delivery: "2 أيام", revenue: "₪12,400", status: "active" },
          { name: "مطبعة الإبداع", email: "ibda3@print.com", phone: "+970 598 335 170", city: "نابلس", joined: "8 فبراير 2026", metric: 34, activeJobs: 3, delivery: "3 أيام", revenue: "₪7,850", status: "active" },
          { name: "مطبعة الفجر", email: "alfajr@print.com", phone: "+970 595 742 680", city: "الخليل", joined: "16 مارس 2026", metric: 0, activeJobs: 0, delivery: "—", revenue: "₪0", status: "pending" }
        ]
      }
    };
    const statusLabels = { active: "نشط", suspended: "معطّل", pending: "معلّق الاعتماد" };
    let activeUserType = "customers";
    let activeStatus = "all";
    let expandedDesignerIndex = -1;
    let activeDesignerTab = "info";
    let expandedPrintShopIndex = -1;
    let activePrintShopTab = "info";

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
      if (mobileLayout.matches) return body.classList.remove("sidebar-collapsed");
      try {
        const saved = window.localStorage.getItem(storageKey);
        if (saved !== null) body.classList.toggle("sidebar-collapsed", saved === "true");
      } catch (error) {}
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

    function getInitials(name) {
      return name.trim().charAt(0);
    }

    function renderFilters() {
      const users = userTypes[activeUserType].users;
      const filters = [
        { key: "all", label: "الكل", count: users.length },
        { key: "active", label: "نشط", count: users.filter(function (user) { return user.status === "active"; }).length },
        { key: "pending", label: "معلّق", count: users.filter(function (user) { return user.status === "pending"; }).length },
        { key: "suspended", label: "معطّل", count: users.filter(function (user) { return user.status === "suspended"; }).length }
      ];
      usersFilters.innerHTML = filters.map(function (filter) {
        return '<button class="users-filter' + (filter.key === activeStatus ? ' active' : '') + '" type="button" data-status-filter="' + filter.key + '"><b>' + filter.count + '</b><span>' + filter.label + '</span></button>';
      }).join("");
    }

    function renderUsers() {
      const type = userTypes[activeUserType];
      const visibleUsers = type.users.filter(function (user) {
        const statusMatches = activeStatus === "all" || user.status === activeStatus;
        return statusMatches;
      });
      usersList.innerHTML = visibleUsers.map(function (user) {
        const customerIndex = activeUserType === "customers" ? userTypes.customers.users.indexOf(user) : -1;
        const designerIndex = activeUserType === "designers" ? userTypes.designers.users.indexOf(user) : -1;
        const printShopIndex = activeUserType === "printShops" ? userTypes.printShops.users.indexOf(user) : -1;
        const isDesignerExpanded = designerIndex >= 0 && designerIndex === expandedDesignerIndex;
        const isPrintShopExpanded = printShopIndex >= 0 && printShopIndex === expandedPrintShopIndex;
        const isExpanded = isDesignerExpanded || isPrintShopExpanded;
        const customerAttributes = customerIndex >= 0 ? ' is-clickable" data-customer-index="' + customerIndex + '" role="button" tabindex="0" aria-label="عرض تفاصيل ' + user.name : '';
        const arrowAttributes = designerIndex >= 0 ? ' data-designer-index="' + designerIndex + '"' : printShopIndex >= 0 ? ' data-print-shop-index="' + printShopIndex + '"' : '';
        const arrow = arrowAttributes ? '<button class="user-arrow-button" type="button"' + arrowAttributes + ' aria-expanded="' + String(isExpanded) + '" aria-label="' + (isExpanded ? 'إخفاء تفاصيل ' : 'عرض تفاصيل ') + user.name + '"><i class="bi bi-chevron-' + (isExpanded ? 'up' : 'left') + '" aria-hidden="true"></i></button>' : '<i class="bi bi-chevron-left user-arrow" aria-hidden="true"></i>';
        const row = '<article class="user-row' + customerAttributes + '">' +
          '<span class="user-avatar" aria-hidden="true">' + getInitials(user.name) + '</span>' +
          '<div class="user-main"><strong>' + user.name + '</strong><small dir="ltr">' + user.email + '</small></div>' +
          '<div class="user-meta"><i class="bi ' + type.metricIcon + '" aria-hidden="true"></i><span>' + user.metric + ' ' + type.metricLabel + '</span><span class="user-status is-' + user.status + '">' + statusLabels[user.status] + '</span></div>' +
          arrow +
        '</article>';
        const expansion = isDesignerExpanded ? renderDesignerExpansion(user, designerIndex) : isPrintShopExpanded ? renderPrintShopExpansion(user, printShopIndex) : '';
        return '<div class="user-entry' + (isExpanded ? ' is-expanded' : '') + '">' + row + expansion + '</div>';
      }).join("");
      usersCount.textContent = String(visibleUsers.length);
      usersEmpty.hidden = visibleUsers.length !== 0;
    }

    function renderDesignerExpansion(designer, index) {
      const infoVisible = activeDesignerTab === "info";
      return '<section class="designer-expansion" aria-label="تفاصيل ' + designer.name + '">' +
        '<div class="designer-tabs" role="tablist"><button class="' + (infoVisible ? 'active' : '') + '" type="button" data-designer-tab="info" data-designer-tab-index="' + index + '">البيانات</button><button class="' + (!infoVisible ? 'active' : '') + '" type="button" data-designer-tab="designs" data-designer-tab-index="' + index + '">التصاميم</button></div>' +
        '<div class="designer-info-panel"' + (infoVisible ? '' : ' hidden') + '>' +
          '<div class="designer-stats"><div><strong>' + designer.metric + '</strong><span>التصاميم</span></div><div><strong>' + designer.sales + '</strong><span>المبيعات</span></div><div><strong>' + designer.city + '</strong><span>المدينة</span></div></div>' +
          '<a class="designer-portfolio" href="https://' + designer.portfolio + '" target="_blank" rel="noopener"><span><i class="bi bi-bezier2" aria-hidden="true"></i>رابط الأعمال</span><strong dir="ltr">' + designer.portfolio + '</strong></a>' +
          '<dl class="designer-contact"><div><dt>البريد الإلكتروني</dt><dd dir="ltr">' + designer.email + '</dd></div><div><dt>رقم الهاتف</dt><dd dir="ltr">' + designer.phone + '</dd></div><div><dt>تاريخ الانضمام</dt><dd>' + designer.joined + '</dd></div></dl>' +
          '<button class="designer-disable" type="button" data-disable-designer="' + index + '">' + (designer.status === 'suspended' ? 'تفعيل الحساب' : 'تعطيل الحساب') + '</button>' +
        '</div>' +
        '<div class="designer-designs-panel"' + (!infoVisible ? '' : ' hidden') + '><i class="bi bi-palette" aria-hidden="true"></i><strong>' + designer.metric + ' تصميمًا</strong><span>إجمالي التصاميم المضافة إلى المنصة</span></div>' +
      '</section>';
    }

    function renderPrintShopExpansion(shop, index) {
      const infoVisible = activePrintShopTab === "info";
      return '<section class="designer-expansion print-shop-expansion" aria-label="تفاصيل ' + shop.name + '">' +
        '<div class="designer-tabs" role="tablist"><button class="' + (infoVisible ? 'active' : '') + '" type="button" data-print-shop-tab="info" data-print-shop-tab-index="' + index + '">البيانات</button><button class="' + (!infoVisible ? 'active' : '') + '" type="button" data-print-shop-tab="jobs" data-print-shop-tab-index="' + index + '">وظائف الطباعة</button></div>' +
        '<div class="designer-info-panel"' + (infoVisible ? '' : ' hidden') + '>' +
          '<div class="designer-stats print-shop-stats"><div><strong>' + shop.metric + '</strong><span>الوظائف المنجزة</span></div><div><strong>' + shop.activeJobs + '</strong><span>الوظائف النشطة</span></div><div><strong>' + shop.delivery + '</strong><span>متوسط التسليم</span></div><div><strong>' + shop.city + '</strong><span>المدينة</span></div></div>' +
          '<div class="print-shop-revenue"><span><i class="bi bi-wallet2" aria-hidden="true"></i>إجمالي الإيرادات</span><strong dir="ltr">' + shop.revenue + '</strong></div>' +
          '<dl class="designer-contact"><div><dt>البريد الإلكتروني</dt><dd dir="ltr">' + shop.email + '</dd></div><div><dt>رقم الهاتف</dt><dd dir="ltr">' + shop.phone + '</dd></div><div><dt>تاريخ الانضمام</dt><dd>' + shop.joined + '</dd></div></dl>' +
          '<button class="designer-disable" type="button" data-disable-print-shop="' + index + '">' + (shop.status === 'suspended' ? 'تفعيل الحساب' : 'تعطيل الحساب') + '</button>' +
        '</div>' +
        '<div class="designer-designs-panel print-shop-jobs-panel"' + (!infoVisible ? '' : ' hidden') + '><i class="bi bi-printer" aria-hidden="true"></i><strong>' + shop.activeJobs + ' وظائف نشطة</strong><span>وظائف الطباعة التي تتم معالجتها حاليًا</span></div>' +
      '</section>';
    }

    function showCustomerTab(tabName) {
      document.querySelectorAll("[data-customer-tab]").forEach(function (tab) {
        const selected = tab.dataset.customerTab === tabName;
        tab.classList.toggle("active", selected);
        tab.setAttribute("aria-selected", String(selected));
      });
      document.getElementById("customerInfoPanel").hidden = tabName !== "info";
      document.getElementById("customerOrdersPanel").hidden = tabName !== "orders";
    }

    function openCustomerDetails(index) {
      const customer = userTypes.customers.users[index];
      if (!customer) return;
      document.getElementById("customerDialogAvatar").textContent = getInitials(customer.name);
      document.getElementById("customerDialogName").textContent = customer.name;
      document.getElementById("customerDialogEmail").textContent = customer.email;
      document.getElementById("customerDialogPhone").textContent = customer.phone;
      document.getElementById("customerDialogCity").textContent = customer.city;
      document.getElementById("customerDialogRegistered").textContent = customer.registered;
      document.getElementById("customerDialogOrders").textContent = String(customer.metric);
      document.getElementById("customerDialogSpend").textContent = customer.spend;
      document.getElementById("customerDialogLastOrder").textContent = customer.lastOrder;
      document.getElementById("customerOrdersSummary").textContent = String(customer.metric);
      const status = document.getElementById("customerDialogStatus");
      status.textContent = statusLabels[customer.status];
      status.className = "user-status is-" + customer.status;
      customerDisableButton.textContent = customer.status === "suspended" ? "تفعيل الحساب" : "تعطيل الحساب";
      customerDisableButton.dataset.customerIndex = String(index);
      showCustomerTab("info");
      customerDialog.showModal();
    }

    function selectUserType(typeKey, updateHash) {
      if (!userTypes[typeKey]) return;
      activeUserType = typeKey;
      activeStatus = "all";
      expandedDesignerIndex = -1;
      activeDesignerTab = "info";
      expandedPrintShopIndex = -1;
      activePrintShopTab = "info";
      const type = userTypes[typeKey];
      pageTitle.textContent = type.title;
      usersListTitle.innerHTML = '<i class="bi ' + type.icon + '" aria-hidden="true"></i><span>' + type.title + '</span>';
      usersPanel.className = "users-panel theme-" + typeKey;
      usersManagement.className = "users-management theme-" + typeKey;
      renderFilters();
      renderUsers();
      if (updateHash) window.history.replaceState(null, "", "#" + (typeKey === "printShops" ? "print-shops" : typeKey));
      if (mobileLayout.matches) closeMobileSidebar();
    }

    restoreSidebar();
    syncSidebar();
    const initialHash = window.location.hash.replace("#", "");
    selectUserType(initialHash === "designers" ? "designers" : initialHash === "print-shops" ? "printShops" : "customers", false);
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
    usersSubmenu.addEventListener("click", function (event) {
      const link = event.target.closest("[data-user-type]");
      if (!link) return;
      event.preventDefault();
      selectUserType(link.dataset.userType, true);
    });
    usersFilters.addEventListener("click", function (event) {
      const button = event.target.closest("[data-status-filter]");
      if (!button) return;
      activeStatus = button.dataset.statusFilter;
      renderFilters();
      renderUsers();
    });
    usersList.addEventListener("click", function (event) {
      const printShopTab = event.target.closest("[data-print-shop-tab]");
      if (printShopTab) {
        activePrintShopTab = printShopTab.dataset.printShopTab;
        expandedPrintShopIndex = Number(printShopTab.dataset.printShopTabIndex);
        renderUsers();
        return;
      }
      const disablePrintShop = event.target.closest("[data-disable-print-shop]");
      if (disablePrintShop) {
        const shop = userTypes.printShops.users[Number(disablePrintShop.dataset.disablePrintShop)];
        shop.status = shop.status === "suspended" ? "active" : "suspended";
        renderFilters();
        renderUsers();
        showToast(shop.status === "suspended" ? "تم تعطيل حساب المطبعة." : "تم تفعيل حساب المطبعة.");
        return;
      }
      const designerTab = event.target.closest("[data-designer-tab]");
      if (designerTab) {
        activeDesignerTab = designerTab.dataset.designerTab;
        expandedDesignerIndex = Number(designerTab.dataset.designerTabIndex);
        renderUsers();
        return;
      }
      const disableDesigner = event.target.closest("[data-disable-designer]");
      if (disableDesigner) {
        const designer = userTypes.designers.users[Number(disableDesigner.dataset.disableDesigner)];
        designer.status = designer.status === "suspended" ? "active" : "suspended";
        renderFilters();
        renderUsers();
        showToast(designer.status === "suspended" ? "تم تعطيل حساب المصمم." : "تم تفعيل حساب المصمم.");
        return;
      }
      const row = event.target.closest("[data-customer-index]");
      if (row) openCustomerDetails(Number(row.dataset.customerIndex));
      const designerRow = event.target.closest("[data-designer-index]");
      if (designerRow) {
        const index = Number(designerRow.dataset.designerIndex);
        expandedDesignerIndex = expandedDesignerIndex === index ? -1 : index;
        activeDesignerTab = "info";
        renderUsers();
      }
      const printShopRow = event.target.closest("[data-print-shop-index]");
      if (printShopRow) {
        const index = Number(printShopRow.dataset.printShopIndex);
        expandedPrintShopIndex = expandedPrintShopIndex === index ? -1 : index;
        activePrintShopTab = "info";
        renderUsers();
      }
    });
    usersList.addEventListener("keydown", function (event) {
      if (event.key !== "Enter" && event.key !== " ") return;
      const row = event.target.closest("[data-customer-index]");
      if (row) {
        event.preventDefault();
        openCustomerDetails(Number(row.dataset.customerIndex));
        return;
      }
    });
    closeCustomerDialog.addEventListener("click", function () { customerDialog.close(); });
    customerDialog.addEventListener("click", function (event) {
      if (event.target === customerDialog) customerDialog.close();
    });
    document.querySelectorAll("[data-customer-tab]").forEach(function (tab) {
      tab.addEventListener("click", function () { showCustomerTab(tab.dataset.customerTab); });
    });
    customerDisableButton.addEventListener("click", function () {
      const customer = userTypes.customers.users[Number(customerDisableButton.dataset.customerIndex)];
      customer.status = customer.status === "suspended" ? "active" : "suspended";
      customerDialog.close();
      renderFilters();
      renderUsers();
      showToast(customer.status === "suspended" ? "تم تعطيل حساب العميل." : "تم تفعيل حساب العميل.");
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
    mobileLayout.addEventListener("change", function () {
      body.classList.remove("sidebar-open");
      backdrop.classList.remove("open");
      restoreSidebar();
      syncSidebar();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, { once: true });
  else initialize();
})(window, document);
