(function () {
  "use strict";

  const form = document.getElementById("productSearchForm");
  const input = document.getElementById("productSearch");
  const grid = document.getElementById("productGrid");
  const emptyState = document.getElementById("productsEmpty");
  const countLabel = document.getElementById("productsCount");
  /* واجهة فلترة التصنيفات غير مركّبة في storefront.html حالياً،
     فهذه المحدِّدات تعود بقوائم فارغة والكود أدناه لا يفعل شيئاً.
     محفوظ لحين إعادة تركيب شريط الفلاتر. */
  const categoryButtons = [
    ...document.querySelectorAll(
      ".category-pill[data-category]:not(.category-submenu-toggle), .category-quick-pill[data-category]:not(.category-submenu-toggle)"
    )
  ];
  const categoryFilterToggle = document.querySelector(".category-filter-toggle");
  const categoryFilterMenu = document.getElementById("categoryFilterMenu");
  const submenuToggles = [...document.querySelectorAll(".category-submenu-toggle")];
  const submenus = [...document.querySelectorAll(".category-submenu")];
  const profileMenuToggle = document.getElementById("profileMenuToggle");
  const profileDropdown = document.getElementById("profileDropdown");
  const sidebarToggle = document.getElementById("sidebarToggle");
  const sidebarClose = document.getElementById("sidebarClose");
  const storeSidebar = document.getElementById("storeSidebar");
  const sidebarBackdrop = document.getElementById("sidebarBackdrop");
  const sidebarLogout = document.getElementById("storeSidebarLogout");

  const closeSubmenus = () => {
    submenus.forEach((submenu) => {
      submenu.hidden = true;
    });
    submenuToggles.forEach((toggle) => {
      toggle.setAttribute("aria-expanded", "false");
    });
  };

  if (!form || !input || !grid || !emptyState) return;

  if (profileMenuToggle && profileDropdown) {
    profileMenuToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const isOpen = profileMenuToggle.getAttribute("aria-expanded") === "true";
      profileMenuToggle.setAttribute("aria-expanded", String(!isOpen));
      profileDropdown.hidden = isOpen;
    });

    document.addEventListener("click", (event) => {
      if (event.target.closest(".profile-menu")) return;
      profileDropdown.hidden = true;
      profileMenuToggle.setAttribute("aria-expanded", "false");
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      profileDropdown.hidden = true;
      profileMenuToggle.setAttribute("aria-expanded", "false");
      profileMenuToggle.focus();
    });
  }

  if (sidebarToggle && sidebarClose && storeSidebar && sidebarBackdrop) {
    const mobileScreen = window.matchMedia("(max-width: 991px)");

    const isMobile = () => mobileScreen.matches;

    const syncSidebar = () => {
      storeSidebar.hidden = false;

      if (isMobile()) {
        storeSidebar.classList.remove("is-collapsed");
        storeSidebar.classList.remove("is-open");
        document.body.classList.remove("sidebar-layout-open");
        storeSidebar.setAttribute("aria-hidden", "true");
      } else {
        storeSidebar.classList.remove("is-open");
        storeSidebar.classList.add("is-collapsed");
        document.body.classList.remove("sidebar-layout-open");
        storeSidebar.setAttribute("aria-hidden", "true");
      }
    };

    const closeSidebar = () => {
      storeSidebar.classList.remove("is-open");
      sidebarToggle.setAttribute("aria-expanded", "false");
      sidebarToggle.setAttribute("aria-label", "فتح القائمة الجانبية");
      sidebarToggle.querySelector("i")?.classList.replace("bi-x-lg", "bi-list");

      if (isMobile()) {
        sidebarBackdrop.hidden = true;
        storeSidebar.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      } else {
        storeSidebar.classList.add("is-collapsed");
        document.body.classList.remove("sidebar-layout-open");
        storeSidebar.setAttribute("aria-hidden", "true");
      }
    };

    sidebarToggle.addEventListener("click", () => {
      if (storeSidebar.classList.contains("is-open")) {
        closeSidebar();
        return;
      }

      storeSidebar.classList.remove("is-collapsed");
      window.requestAnimationFrame(() => storeSidebar.classList.add("is-open"));
      sidebarToggle.setAttribute("aria-expanded", "true");
      sidebarToggle.setAttribute("aria-label", "إغلاق القائمة الجانبية");
      sidebarToggle.querySelector("i")?.classList.replace("bi-list", "bi-x-lg");
      storeSidebar.setAttribute("aria-hidden", "false");

      if (isMobile()) {
        sidebarBackdrop.hidden = false;
        document.body.style.overflow = "hidden";
        sidebarClose.focus();
      } else {
        document.body.classList.add("sidebar-layout-open");
      }
    });

    sidebarClose.addEventListener("click", closeSidebar);
    sidebarBackdrop.addEventListener("click", closeSidebar);

    sidebarClose.addEventListener("pointerenter", () => {
      sidebarClose.classList.add("is-hovered");
    });

    sidebarClose.addEventListener("pointerleave", () => {
      sidebarClose.classList.remove("is-hovered");
    });

    storeSidebar.addEventListener("click", (event) => {
      if (event.target.closest("a") && isMobile()) closeSidebar();
    });

    if (sidebarLogout) {
      sidebarLogout.addEventListener("click", () => {
        const confirmed = window.confirm("هل تريد تسجيل الخروج من حسابك؟");
        if (confirmed) window.location.href = sidebarLogout.dataset.href || "login.html";
      });
    }

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      closeSidebar();
      sidebarToggle.focus();
    });

    mobileScreen.addEventListener("change", () => {
      sidebarBackdrop.hidden = true;
      document.body.style.overflow = "";
      sidebarToggle.setAttribute("aria-expanded", "false");
      sidebarToggle.querySelector("i")?.classList.replace("bi-x-lg", "bi-list");
      syncSidebar();
    });

    syncSidebar();
  }

  const normalize = (value) => value
    .toLocaleLowerCase("ar")
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "")
    .replace(/ـ/g, "")
    .trim();

  const cards = [...grid.querySelectorAll(".product-card")];
  cards
    .slice()
    .sort((a, b) => Number(a.dataset.order) - Number(b.dataset.order))
    .forEach((card) => grid.append(card));

  const productPrices = {
    shirt: 15,
    hoodie: 35,
    cap: 20,
    bag: 50,
    scarf: 18,
    "phone-case": 25,
    cups: 12,
    paper: 10,
    notebooks: 15,
    posters: 20,
    stickers: 8,
    "wedding-cards": 30
  };

  const productImages = {
    shirt: "1.png",
    hoodie: "2.png",
    cap: "3.png",
    bag: "4.png",
    scarf: "5.png",
    "phone-case": "6.png",
    cups: "7.png",
    paper: "8.png",
    notebooks: "9.png",
    posters: "10.png",
    stickers: "11.png",
    "wedding-cards": "12.png"
  };

  const hoverImages = {
    shirt: "تحديث1.png",
    hoodie: "تحديث2.png"
  };

  const heroCopy = document.querySelector(".hero-copy");
  const heroVisual = document.querySelector(".hero-visual");
  const productsSection = document.querySelector(".products-section");
  const productsHeading = document.querySelector(".section-heading");

  const reveal = (element) => {
    if (element) element.classList.add("is-revealed");
  };

  if (heroCopy && heroVisual && productsSection && productsHeading) {
    document.body.classList.add("storefront-motion-ready");

    requestAnimationFrame(() => {
      reveal(heroCopy);
      window.setTimeout(() => reveal(heroVisual), 420);
    });

    const rows = [];
    cards.forEach((card) => {
      const top = card.getBoundingClientRect().top;
      let row = rows.find((group) => Math.abs(group.top - top) < 8);
      if (!row) {
        row = { top, cards: [] };
        rows.push(row);
      }
      row.cards.push(card);
    });

    const revealProducts = () => {
      reveal(productsHeading);
      if (!rows.length) return;

      window.setTimeout(() => {
        rows[0].cards.forEach(reveal);
      }, 260);

      rows.slice(1).forEach((row) => {
        const rowObserver = new IntersectionObserver((entries, observer) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          row.cards.forEach(reveal);
          observer.disconnect();
        }, { threshold: 0.15, rootMargin: "0px 0px -12% 0px" });
        rowObserver.observe(row.cards[0]);
      });
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealProducts();
    } else {
      const productsObserver = new IntersectionObserver((entries, observer) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        revealProducts();
        observer.disconnect();
      }, { threshold: 0.12 });
      productsObserver.observe(productsSection);
    }
  }

  cards.forEach((card) => {
    const body = card.querySelector(".product-card__body");
    if (!body) return;

    const price = document.createElement("span");
    price.className = "product-card__price";
    price.dir = "ltr";
    price.textContent = `$${productPrices[card.dataset.product].toFixed(2)}`;
    body.append(price);
  });

  cards.forEach((card) => {
    const media = card.querySelector(".product-card__media");
    const image = media?.querySelector("img");
    if (!image) return;

    const product = card.dataset.product;
    const originalSrc = `assets/images/products/${productImages[product]}`;
    const hoverSrc = hoverImages[product]
      ? `assets/images/products/${hoverImages[product]}`
      : null;
    image.src = originalSrc;

    if (hoverSrc) {
      const hoverImage = new Image();
      hoverImage.src = hoverSrc;
    }

    const setHovered = (isHovered) => {
      card.classList.toggle("is-image-hovered", isHovered);
      if (!hoverSrc) return;
      image.src = isHovered ? hoverSrc : originalSrc;
      image.classList.toggle("is-hover-image", isHovered);
    };

    card.addEventListener("pointerenter", () => setHovered(true));
    card.addEventListener("pointerleave", () => setHovered(false));
    card.addEventListener("focusin", () => setHovered(true));
    card.addEventListener("focusout", () => setHovered(false));
  });

  let selectedCategory = "all";

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    applyFilters();
  });

  const applyFilters = () => {
    const query = normalize(input.value);
    let visibleCount = 0;

    cards.forEach((card) => {
      const searchableText = normalize(card.textContent);
      const categoryMatch = selectedCategory === "all" || card.dataset.category === selectedCategory;
      const isMatch = categoryMatch && (!query || searchableText.includes(query));

      card.classList.toggle("is-filter-hidden", !isMatch);
      if (isMatch) visibleCount += 1;
    });

    emptyState.hidden = visibleCount > 0;
    if (countLabel) countLabel.textContent = `${visibleCount} منتجات`;
  };

  input.addEventListener("input", applyFilters);

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedCategory = button.dataset.category;
      categoryButtons.forEach((categoryButton) => {
        const isSelected = categoryButton.dataset.category === selectedCategory;
        categoryButton.setAttribute("aria-pressed", String(isSelected));
        categoryButton.classList.toggle("is-active", isSelected);
      });
      applyFilters();

      if (categoryFilterMenu && categoryFilterToggle) {
        categoryFilterMenu.hidden = true;
        categoryFilterToggle.setAttribute("aria-expanded", "false");
      }
      closeSubmenus();
    });
  });

  if (categoryFilterToggle && categoryFilterMenu) {
    categoryFilterToggle.addEventListener("click", () => {
      const isOpen = categoryFilterToggle.getAttribute("aria-expanded") === "true";
      categoryFilterToggle.setAttribute("aria-expanded", String(!isOpen));
      categoryFilterMenu.hidden = isOpen;
    });

    document.addEventListener("click", (event) => {
      if (!event.target.closest(".category-filter-dropdown")) {
        categoryFilterMenu.hidden = true;
        categoryFilterToggle.setAttribute("aria-expanded", "false");
        closeSubmenus();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        categoryFilterMenu.hidden = true;
        categoryFilterToggle.setAttribute("aria-expanded", "false");
        closeSubmenus();
      }
    });
  }

  submenuToggles.forEach((submenuToggle) => {
    const submenu = document.getElementById(submenuToggle.getAttribute("aria-controls"));
    if (!submenu) return;

    submenuToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const isOpen = submenuToggle.getAttribute("aria-expanded") === "true";
      closeSubmenus();
      submenuToggle.setAttribute("aria-expanded", String(!isOpen));
      submenu.hidden = isOpen;
    });
  });

  applyFilters();
})();

(function () {
  "use strict";

  const toggle = document.getElementById("notificationsToggle");
  const panel = document.getElementById("notificationsPanel");
  const badge = document.querySelector(".notifications-badge");
  const list = document.querySelector(".notifications-list");
  const empty = document.querySelector(".notifications-empty");
  const clear = document.querySelector(".notifications-clear");
  const profileToggle = document.getElementById("profileMenuToggle");
  const profilePanel = document.getElementById("profileDropdown");

  if (!toggle || !panel || !badge || !list || !empty) return;

  const storageKey = "palprints-store-notifications";
  let notifications = [];
  let toastTimer = 0;

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
    if (Array.isArray(saved)) notifications = saved.slice(0, 20);
  } catch (_) { /* Keep notifications for this session only. */ }

  const save = () => {
    try { localStorage.setItem(storageKey, JSON.stringify(notifications)); }
    catch (_) { /* Keep notifications for this session only. */ }
  };

  const render = () => {
    list.replaceChildren();

    notifications.forEach((notification) => {
      const item = document.createElement("div");
      const icon = document.createElement("i");
      const content = document.createElement("div");
      const message = document.createElement("p");
      const time = document.createElement("time");

      item.className = "notification-item";
      icon.className = `bi bi-${notification.icon || "bell"}`;
      icon.setAttribute("aria-hidden", "true");
      message.textContent = notification.message;
      time.textContent = "الآن";
      content.append(message, time);
      item.append(icon, content);
      list.append(item);
    });

    const unread = notifications.filter((notification) => notification.unread).length;
    badge.textContent = unread > 99 ? "99+" : String(unread);
    badge.hidden = unread === 0;
    empty.hidden = notifications.length > 0;
    toggle.setAttribute("aria-label", unread ? `الإشعارات، ${unread} جديدة` : "الإشعارات");
  };

  const ring = () => {
    toggle.classList.remove("has-new-notification");
    void toggle.offsetWidth;
    toggle.classList.add("has-new-notification");
    window.setTimeout(() => toggle.classList.remove("has-new-notification"), 800);
  };

  const showToast = (message) => {
    document.querySelector(".store-notification-toast")?.remove();
    window.clearTimeout(toastTimer);
    const toast = document.createElement("div");
    toast.className = "store-notification-toast";
    toast.setAttribute("role", "status");
    toast.innerHTML = '<i class="bi bi-heart-fill" aria-hidden="true"></i><span></span>';
    toast.querySelector("span").textContent = message;
    document.body.append(toast);
    requestAnimationFrame(() => toast.classList.add("is-visible"));
    toastTimer = window.setTimeout(() => {
      toast.classList.remove("is-visible");
      window.setTimeout(() => toast.remove(), 300);
    }, 2800);
  };

  window.PalPrintNotifications = {
    add(message, icon = "bell") {
      notifications.unshift({ message, icon, unread: true, createdAt: Date.now() });
      notifications = notifications.slice(0, 20);
      save();
      render();
      ring();
      showToast(message);
    }
  };

  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const open = panel.hidden;
    panel.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    if (!open) return;
    if (profilePanel && profileToggle) {
      profilePanel.hidden = true;
      profileToggle.setAttribute("aria-expanded", "false");
    }
    notifications.forEach((notification) => { notification.unread = false; });
    save();
    render();
  });

  profileToggle?.addEventListener("click", () => {
    panel.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
  });

  clear?.addEventListener("click", () => {
    notifications = [];
    save();
    render();
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest(".notifications-menu")) return;
    panel.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || panel.hidden) return;
    panel.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    toggle.focus();
  });

  render();
})();
