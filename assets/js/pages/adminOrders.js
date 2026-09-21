"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("adminSidebar");
  const backdrop = document.getElementById("sidebarBackdrop");
  const menuButton = document.getElementById("menuButton");
  const mobileLayout = window.matchMedia("(max-width: 760px)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const statCounters = document.querySelectorAll("[data-stat-counter]");

  const animateCounter = (counter) => {
    const target = Number(counter.dataset.statCounter);
    const duration = 1100;
    const startTime = performance.now();

    const draw = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.round(target * easedProgress).toLocaleString("en-US");

      if (progress < 1) requestAnimationFrame(draw);
    };

    requestAnimationFrame(draw);
  };

  statCounters.forEach((counter) => {
    if (reducedMotion) {
      counter.textContent = Number(counter.dataset.statCounter).toLocaleString("en-US");
      return;
    }

    animateCounter(counter);
  });

  const orderRows = Array.from(document.querySelectorAll("[data-order-row]"));
  const orderFilters = Array.from(document.querySelectorAll("[data-order-filter]"));
  const ordersSearch = document.getElementById("ordersSearch");
  const ordersEmptyRow = document.getElementById("ordersEmptyRow");
  const ordersResultCount = document.getElementById("ordersResultCount");
  let activeOrderFilter = "all";

  const normalizeText = (text) => text.trim().toLocaleLowerCase("ar");

  const filterOrders = () => {
    const query = normalizeText(ordersSearch.value);
    let visibleCount = 0;

    orderRows.forEach((row) => {
      const matchesStatus = activeOrderFilter === "all" || row.dataset.status === activeOrderFilter;
      const matchesSearch = normalizeText(row.dataset.search).includes(query);
      const isVisible = matchesStatus && matchesSearch;
      row.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    ordersEmptyRow.hidden = visibleCount !== 0;
    ordersResultCount.textContent = `عرض ${visibleCount} من أصل ${orderRows.length} طلبًا`;
  };

  orderFilters.forEach((button) => {
    button.addEventListener("click", () => {
      activeOrderFilter = button.dataset.orderFilter;
      orderFilters.forEach((filter) => filter.classList.toggle("active", filter === button));
      filterOrders();
    });
  });

  ordersSearch.addEventListener("input", filterOrders);

  const orderDetailsDialog = document.getElementById("orderDetailsDialog");
  const orderDialogSubtitle = document.getElementById("orderDialogSubtitle");
  const orderDetailsList = document.getElementById("orderDetailsList");
  const dialogProduct = document.getElementById("dialogProduct");
  const dialogProductImage = document.getElementById("dialogProductImage");
  const dialogSubtotal = document.getElementById("dialogSubtotal");
  const dialogTotal = document.getElementById("dialogTotal");
  const dialogPhone = document.getElementById("dialogPhone");
  const dialogAddress = document.getElementById("dialogAddress");
  const dialogPayment = document.getElementById("dialogPayment");
  const dialogShipment = document.getElementById("dialogShipment");
  const dialogNotes = document.getElementById("dialogNotes");
  const dialogStatusSelect = document.getElementById("dialogStatusSelect");
  const dialogPrinterSelect = document.getElementById("dialogPrinterSelect");
  const orderManagementHint = document.getElementById("orderManagementHint");
  const orderDialogFeedback = document.getElementById("orderDialogFeedback");
  const saveOrderChanges = document.getElementById("saveOrderChanges");
  let activeOrderRow = null;

  const statusPresentation = {
    processing: { label: "قيد التنفيذ", className: "is-processing", shipment: "قيد التجهيز" },
    shipped: { label: "تم الشحن", className: "is-shipped", shipment: "في الطريق إلى العميل" },
    completed: { label: "مكتمل", className: "is-completed", shipment: "تم التسليم" },
    pending: { label: "معلق", className: "is-pending", shipment: "بانتظار التجهيز" },
    cancelled: { label: "ملغي", className: "is-cancelled", shipment: "أُلغيت الشحنة" },
  };

  const customerDetails = [
    { phone: "0599 214 782", address: "غزة، شارع الوحدة", payment: "بطاقة ائتمانية", notes: "يرجى التواصل قبل التوصيل." },
    { phone: "0598 731 406", address: "رام الله، حي المصايف", payment: "PalPay", notes: "لا توجد ملاحظات إضافية." },
    { phone: "0569 445 120", address: "نابلس، شارع فيصل", payment: "الدفع عند الاستلام", notes: "التسليم بعد الساعة الرابعة مساءً." },
    { phone: "0597 822 315", address: "الخليل، عين سارة", payment: "بطاقة ائتمانية", notes: "يرجى تغليف المنتج كهدية." },
  ];

  const productImages = [
    { keyword: "تيشيرت", src: "assets/images/tshirt.webp" },
    { keyword: "كوب", src: "assets/images/cup.webp" },
    { keyword: "دفتر", src: "assets/images/notebookicon.png" },
    { keyword: "حقيبة", src: "assets/images/bag.png" },
    { keyword: "هودي", src: "assets/images/hoodie.png" },
    { keyword: "ستيكر", src: "assets/images/icons8-sticker-48.png" },
    { keyword: "وسادة", src: "assets/images/bag.png" },
    { keyword: "كتاب", src: "assets/images/document.png" },
  ];

  document.querySelectorAll(".order-details").forEach((button) => {
    button.addEventListener("click", () => {
      const row = button.closest("tr");
      const cells = Array.from(row.cells);
      const orderNumber = cells[8].innerText.trim();
      const detail = customerDetails[orderRows.indexOf(row) % customerDetails.length];
      const amount = Number(cells[3].innerText.replace(/[^0-9.]/g, ""));
      const status = row.dataset.status;
      const cannotRedirect = status === "completed" || status === "cancelled";

      orderDialogSubtitle.textContent = orderNumber;
      orderDetailsList.replaceChildren(...[
        ["رقم الطلب", orderNumber],
        ["تاريخ الطلب", cells[2].innerText.trim()],
        ["العميل", cells[7].querySelector("strong").innerText.trim()],
        ["المصمم", cells[5].innerText.trim()],
        ["المطبعة", cells[4].innerText.trim()],
        ["الحالة", cells[1].innerText.trim()],
      ].map(([term, content]) => {
        const item = document.createElement("div");
        const label = document.createElement("dt");
        const value = document.createElement("dd");
        label.textContent = term;
        value.textContent = content;
        item.append(label, value);
        return item;
      }));

      const productName = cells[6].innerText.trim();
      const productImage = productImages.find((item) => productName.includes(item.keyword));
      dialogProduct.textContent = productName;
      dialogProductImage.src = productImage?.src || "assets/images/tshirt.webp";
      dialogProductImage.alt = `صورة ${productName}`;
      dialogSubtotal.textContent = `${amount} ₪`;
      dialogTotal.textContent = `${amount + 15} ₪`;
      dialogPhone.textContent = detail.phone;
      dialogAddress.textContent = detail.address;
      dialogPayment.textContent = detail.payment;
      dialogShipment.textContent = statusPresentation[status].shipment;
      dialogNotes.textContent = detail.notes;
      dialogStatusSelect.value = status;
      dialogPrinterSelect.value = cells[4].innerText.trim();
      dialogPrinterSelect.disabled = cannotRedirect;
      orderManagementHint.textContent = cannotRedirect
        ? "لا يمكن إعادة توجيه الطلبات المكتملة أو الملغاة إلى مطبعة أخرى."
        : "يمكنك تحديث الحالة أو إعادة توجيه الطلب إلى مطبعة أخرى.";
      orderDialogFeedback.textContent = "";
      activeOrderRow = row;

      orderDetailsDialog.showModal();
    });
  });

  saveOrderChanges.addEventListener("click", () => {
    if (!activeOrderRow) return;

    const selectedStatus = dialogStatusSelect.value;
    const presentation = statusPresentation[selectedStatus];
    const statusElement = activeOrderRow.querySelector(".order-status");
    const previousPrinter = activeOrderRow.cells[4].innerText.trim();
    const selectedPrinter = dialogPrinterSelect.value;

    activeOrderRow.dataset.status = selectedStatus;
    statusElement.className = `order-status ${presentation.className}`;
    statusElement.textContent = presentation.label;
    dialogShipment.textContent = presentation.shipment;

    if (!dialogPrinterSelect.disabled) activeOrderRow.cells[4].textContent = selectedPrinter;

    const printerMessage = !dialogPrinterSelect.disabled && selectedPrinter !== previousPrinter
      ? ` وتم تحويله إلى ${selectedPrinter}`
      : "";
    orderDialogFeedback.textContent = `تم حفظ حالة الطلب${printerMessage} بنجاح.`;
    filterOrders();
  });

  orderDetailsDialog.querySelectorAll("[data-order-dialog-close]").forEach((button) => {
    button.addEventListener("click", () => orderDetailsDialog.close());
  });

  orderDetailsDialog.addEventListener("click", (event) => {
    if (event.target === orderDetailsDialog) orderDetailsDialog.close();
  });

  document.querySelectorAll(".nav-group-toggle").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const group = toggle.closest(".nav-group");
      const isOpen = group.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
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
