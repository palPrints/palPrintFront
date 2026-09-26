"use strict";

(function (window, document) {
  const STORAGE = {
    language: "palprints-language",
    theme: "palprints-theme",
    sidebar: "palprints-sidebar-collapsed",
    defaults: "palprints-designer-dashboard-defaults-v2"
  };

  const dictionary = {
    ar: {
      documentTitle: "لوحة التحكم | PalPrints",
      documentDescription: "لوحة تحكم مصمم PalPrints",
      sidebarLabel: "القائمة الجانبية للمصمم",
      designerNavLabel: "روابط حساب المصمم",
      goHome: "الصفحة الرئيسية",
      openSidebar: "فتح القائمة الجانبية",
      closeSidebar: "إغلاق القائمة الجانبية",
      pageTools: "أدوات الصفحة",
      switchToDark: "تفعيل الوضع الليلي",
      switchToLight: "تفعيل الوضع النهاري",
      changeLanguage: "تغيير اللغة",
      shoppingCart: "سلة المشتريات",
      twoItems: "عنصران في السلة",
      notifications: "الإشعارات",
      dashboard: "لوحة التحكم",
      uploadDesign: "رفع تصميم جديد",
      myDesigns: "تصاميمي",
      profileTitle: "الملف الشخصي",
      earnings: "الأرباح",
      settings: "الإعدادات",
      support: "التواصل مع الدعم الفني",
      logout: "تسجيل الخروج",
      logoutConfirm: "هل تريد تسجيل الخروج من حسابك؟",
      designerIntroLabel: "ابدأ تصميمًا جديدًا",
      heroEyebrow: "مساحتك للإبداع",
      heroTitleLine1: "حوّل أفكارك المبتكرة إلى تصاميم مذهلة",
      heroTitleLine2: "وابدأ الربح الآن!",
      heroSubtitle: "أنشئ تصميمك القادم وشاركه مع عملاء يبحثون عن أفكار مميزة.",
      ctaAction: "ابدأ التصميم",
      dashboardSummary: "ملخص لوحة التحكم",
      totalDesigns: "إجمالي التصاميم",
      designsThisMonth: "+6 هذا الشهر",
      totalSales: "إجمالي المبيعات",
      salesThisMonth: "+12% هذا الشهر",
      totalEarnings: "إجمالي الأرباح",
      earningsThisMonth: "+1,200 ₪ هذا الشهر",
      averageRating: "متوسط التقييم",
      ratingValue: "4.8 / 5",
      ratingsCount: "126 تقييم",
      gazaTrends: "ترند غزة",
      trendsIntro: "اكتشف الأفكار الرائجة الآن وحوّلها إلى تصاميم تلفت الانتباه",
      viewMore: "عرض المزيد",
      graduationAlt: "تخرج غزة 2026",
      mostTrending: "الأكثر رواجاً",
      graduationSeason: "موسم التخرج",
      class2026: "دفعة 2026",
      gazaGraduation: "تخرج غزة 2026",
      graduationDesc: "خلفيات تخرج • دفعة 2026 • النجاح",
      exploreTrend: "استلهم من الترند",
      seaAlt: "غزة والبحر",
      weeklyGrowth: "+32% هذا الأسبوع",
      calm: "الهدوء",
      boats: "القوارب",
      sunset: "الغروب",
      gazaSea: "غزة والبحر",
      seaDesc: "مشاهد وأماكن • مناظر طبيعية",
      getInspired: "استلهم فكرة",
      phrasesAlt: "عبارات فلسطينية",
      greatIdea: "فكرة رائعة",
      arabicCalligraphy: "خط عربي",
      inspiringWords: "كلمات ملهمة",
      palestinianPhrases: "عبارات فلسطينية",
      phrasesDesc: "من على هذه الأرض • كلمات وعبارات",
      explore: "استكشف",
      recentActivity: "آخر النشاطات",
      activityTableLabel: "جدول آخر النشاطات، قابل للتمرير أفقياً",
      activity: "النشاط",
      details: "التفاصيل",
      time: "الوقت",
      status: "الحالة",
      newDesignUploaded: "تم رفع تصميم جديد",
      newDesignDetails: "تم تحميل تصميم \"عبارات فلسطينية - جزء من فلسطين\"",
      twelveMinutesAgo: "منذ 12 دقيقة",
      completed: "مكتمل",
      printOrderCompleted: "اكتمال طلب طباعة",
      printOrderDetails: "تم بيع تصميم \"خبز في قلبي\"",
      twentyFiveMinutesAgo: "منذ 25 دقيقة",
      newEarnings: "إضافة أرباح جديدة",
      newEarningsDetails: "تمت إضافة أرباح جديدة من بيع 4 تصاميم",
      thirtySixMinutesAgo: "منذ 36 دقيقة",
      processing: "قيد الإجراء",
      designUnderReview: "تصميم قيد المراجعة",
      reviewDetails: "حصل تصميمك على تقييم 4 نجوم",
      oneDayAgo: "منذ يوم",
      underReview: "قيد المراجعة",
      designRejected: "تصميم مرفوض",
      rejectedDetails: "حصل تصميمك على تقييم نجمتين",
      fiveDaysAgo: "منذ 5 أيام",
      rejected: "مرفوض"
    },
    en: {
      documentTitle: "Dashboard | PalPrints",
      documentDescription: "PalPrints designer dashboard",
      sidebarLabel: "Designer sidebar",
      designerNavLabel: "Designer account links",
      goHome: "Go to the home page",
      openSidebar: "Open sidebar",
      closeSidebar: "Close sidebar",
      pageTools: "Page tools",
      switchToDark: "Switch to dark mode",
      switchToLight: "Switch to light mode",
      changeLanguage: "Change language",
      shoppingCart: "Shopping cart",
      twoItems: "Two items in the cart",
      notifications: "Notifications",
      dashboard: "Dashboard",
      uploadDesign: "Upload new design",
      myDesigns: "My designs",
      profileTitle: "Profile",
      earnings: "Earnings",
      settings: "Settings",
      support: "Contact support",
      logout: "Log out",
      logoutConfirm: "Do you want to log out of your account?",
      designerIntroLabel: "Start a new design",
      heroEyebrow: "Your creative space",
      heroTitleLine1: "Turn your creative ideas into stunning designs",
      heroTitleLine2: "and start earning today!",
      heroSubtitle: "Create your next design and share it with customers looking for something distinctive.",
      ctaAction: "Start designing",
      dashboardSummary: "Dashboard summary",
      totalDesigns: "Total designs",
      designsThisMonth: "+6 this month",
      totalSales: "Total sales",
      salesThisMonth: "+12% this month",
      totalEarnings: "Total earnings",
      earningsThisMonth: "+₪1,200 this month",
      averageRating: "Average rating",
      ratingValue: "4.8 / 5",
      ratingsCount: "126 ratings",
      gazaTrends: "Gaza trends",
      trendsIntro: "Discover what is trending and turn popular ideas into eye-catching designs",
      viewMore: "View more",
      graduationAlt: "Gaza Graduation 2026",
      mostTrending: "Most trending",
      graduationSeason: "Graduation season",
      class2026: "Class of 2026",
      gazaGraduation: "Gaza Graduation 2026",
      graduationDesc: "Graduation backgrounds • Class of 2026 • Success",
      exploreTrend: "Explore the trend",
      seaAlt: "Gaza and the sea",
      weeklyGrowth: "+32% this week",
      calm: "Calm",
      boats: "Boats",
      sunset: "Sunset",
      gazaSea: "Gaza and the Sea",
      seaDesc: "Scenes and places • Natural landscapes",
      getInspired: "Get inspired",
      phrasesAlt: "Palestinian phrases",
      greatIdea: "Great idea",
      arabicCalligraphy: "Arabic calligraphy",
      inspiringWords: "Inspiring words",
      palestinianPhrases: "Palestinian Phrases",
      phrasesDesc: "On this land • Words and phrases",
      explore: "Explore",
      recentActivity: "Recent activity",
      activityTableLabel: "Recent activity table, horizontally scrollable",
      activity: "Activity",
      details: "Details",
      time: "Time",
      status: "Status",
      newDesignUploaded: "New design uploaded",
      newDesignDetails: "The design \"Palestinian Phrases — A Piece of Palestine\" was uploaded",
      twelveMinutesAgo: "12 minutes ago",
      completed: "Completed",
      printOrderCompleted: "Print order completed",
      printOrderDetails: "The design \"Bread in My Heart\" was sold",
      twentyFiveMinutesAgo: "25 minutes ago",
      newEarnings: "New earnings added",
      newEarningsDetails: "Earnings from the sale of 4 designs were added",
      thirtySixMinutesAgo: "36 minutes ago",
      processing: "Processing",
      designUnderReview: "Design under review",
      reviewDetails: "Your design received a 4-star rating",
      oneDayAgo: "1 day ago",
      underReview: "Under review",
      designRejected: "Design rejected",
      rejectedDetails: "Your design received a 2-star rating",
      fiveDaysAgo: "5 days ago",
      rejected: "Rejected"
    }
  };

  const mobileScreen = window.matchMedia("(max-width: 991.98px)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const languageListeners = [];

  function readStorage(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function writeStorage(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      /* التخزين غير متاح؛ تستمر الصفحة بالعمل بالإعداد الحالي. */
    }
  }

  function initializeDefaults() {
    if (readStorage(STORAGE.defaults) === "true") return;
    writeStorage(STORAGE.language, "ar");
    writeStorage(STORAGE.theme, "light");
    writeStorage(STORAGE.sidebar, "false");
    writeStorage(STORAGE.defaults, "true");
  }

  function each(list, callback) {
    Array.prototype.forEach.call(list || [], callback);
  }

  function getLanguage() {
    return document.documentElement.getAttribute("lang") === "en" ? "en" : "ar";
  }

  function translate(key) {
    const language = getLanguage();
    if (Object.prototype.hasOwnProperty.call(dictionary[language], key)) return dictionary[language][key];
    return Object.prototype.hasOwnProperty.call(dictionary.ar, key) ? dictionary.ar[key] : "";
  }

  function syncThemeControl() {
    const theme = document.documentElement.getAttribute("data-bs-theme") === "dark" ? "dark" : "light";
    const button = document.getElementById("themeToggleButton");
    const icon = document.getElementById("themeToggleIcon");
    const key = theme === "dark" ? "switchToLight" : "switchToDark";

    if (icon) {
      icon.classList.remove("bi-moon-stars", "bi-sun");
      icon.classList.add(theme === "dark" ? "bi-sun" : "bi-moon-stars");
    }

    if (button) {
      button.setAttribute("data-i18n-aria", key);
      button.setAttribute("aria-label", translate(key));
    }
  }

  function applyTranslations() {
    each(document.querySelectorAll("[data-i18n]"), function (element) {
      const value = translate(element.getAttribute("data-i18n"));
      if (value) element.textContent = value;
    });

    each(document.querySelectorAll("[data-i18n-aria]"), function (element) {
      const value = translate(element.getAttribute("data-i18n-aria"));
      if (value) element.setAttribute("aria-label", value);
    });

    each(document.querySelectorAll("[data-i18n-alt]"), function (element) {
      const value = translate(element.getAttribute("data-i18n-alt"));
      if (value) element.setAttribute("alt", value);
    });

    const title = translate("documentTitle");
    const description = document.querySelector('meta[name="description"]');
    if (title) document.title = title;
    if (description) description.setAttribute("content", translate("documentDescription"));

    each(document.querySelectorAll("[data-back-icon]"), function (icon) {
      icon.classList.remove("bi-arrow-left", "bi-arrow-right");
      icon.classList.add(getLanguage() === "ar" ? "bi-arrow-left" : "bi-arrow-right");
    });

    sidebar.sync();
    syncThemeControl();
    languageListeners.forEach(function (listener) { listener(getLanguage()); });
  }

  function applyLanguage(language) {
    const next = language === "en" ? "en" : "ar";
    document.documentElement.setAttribute("lang", next);
    document.documentElement.setAttribute("dir", next === "ar" ? "rtl" : "ltr");
    document.body.setAttribute("dir", next === "ar" ? "rtl" : "ltr");
    writeStorage(STORAGE.language, next);

    const toggleText = document.getElementById("languageToggleText");
    if (toggleText) toggleText.textContent = next === "ar" ? "EN" : "AR";
    applyTranslations();
  }

  function onLanguageChange(listener) {
    if (typeof listener === "function") languageListeners.push(listener);
  }

  function currentTheme() {
    return document.documentElement.getAttribute("data-bs-theme") === "dark" ? "dark" : "light";
  }

  function applyTheme(theme) {
    const next = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-bs-theme", next);
    writeStorage(STORAGE.theme, next);
    syncThemeControl();
  }

  const sidebar = {
    app: null,
    element: null,
    isMobile: function () { return mobileScreen.matches; },
    isOpen: function () {
      if (!this.app) return false;
      return this.isMobile() ? this.app.classList.contains("sidebar-open") : !this.app.classList.contains("sidebar-collapsed");
    },
    open: function () {
      if (!this.app) return;
      if (this.isMobile()) {
        this.app.classList.add("sidebar-open");
        document.body.style.overflow = "hidden";
      } else {
        this.app.classList.remove("sidebar-collapsed");
        writeStorage(STORAGE.sidebar, "false");
      }
      this.sync();
    },
    close: function () {
      if (!this.app) return;
      if (this.isMobile()) {
        this.app.classList.remove("sidebar-open");
        document.body.style.overflow = "";
      } else {
        this.app.classList.add("sidebar-collapsed");
        writeStorage(STORAGE.sidebar, "true");
      }
      this.sync();
    },
    toggle: function () { this.isOpen() ? this.close() : this.open(); },
    sync: function () {
      const button = document.getElementById("sidebarToggleButton");
      const icon = document.getElementById("sidebarToggleIcon");
      const open = this.isOpen();
      const key = open ? "closeSidebar" : "openSidebar";

      if (button) {
        button.setAttribute("aria-expanded", open ? "true" : "false");
        button.setAttribute("data-i18n-aria", key);
        button.setAttribute("aria-label", translate(key));
      }

      if (icon) {
        icon.classList.remove("bi-arrow-left", "bi-arrow-right", "bi-list", "bi-x-lg");
        icon.classList.add(open ? "bi-x-lg" : "bi-list");
      }

      if (this.element) {
        if (this.isMobile() && !open) this.element.setAttribute("aria-hidden", "true");
        else this.element.removeAttribute("aria-hidden");
      }
    },
    syncWithScreen: function () {
      if (!this.app) return;
      this.app.classList.remove("sidebar-open");
      document.body.style.overflow = "";

      if (this.isMobile()) this.app.classList.remove("sidebar-collapsed");
      else this.app.classList.toggle("sidebar-collapsed", readStorage(STORAGE.sidebar) === "true");
      this.sync();
    }
  };

  function setupSidebar() {
    sidebar.app = document.querySelector(".profile-app");
    sidebar.element = document.getElementById("profileSidebar");
    const toggle = document.getElementById("sidebarToggleButton");
    const close = document.getElementById("sidebarCloseButton");
    const backdrop = document.getElementById("sidebarBackdrop");

    if (!sidebar.app) return;
    if (toggle) toggle.addEventListener("click", function () { sidebar.toggle(); });
    if (close) close.addEventListener("click", function () { sidebar.close(); });
    if (backdrop) backdrop.addEventListener("click", function () { sidebar.close(); });

    if (sidebar.element) {
      each(sidebar.element.querySelectorAll(".profile-sidebar-link"), function (link) {
        link.addEventListener("click", function () { if (sidebar.isMobile()) sidebar.close(); });
      });
    }

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && sidebar.isMobile() && sidebar.isOpen()) sidebar.close();
    });

    const onScreenChange = function () { sidebar.syncWithScreen(); };
    if (typeof mobileScreen.addEventListener === "function") mobileScreen.addEventListener("change", onScreenChange);
    else if (typeof mobileScreen.addListener === "function") mobileScreen.addListener(onScreenChange);
    sidebar.syncWithScreen();
  }

  function setupHeaderButtons() {
    each(document.querySelectorAll(".top-utility-bar .utility-btn"), function (button) {
      function releaseButton() {
        if (!button.classList.contains("is-pressed")) return;
        button.classList.remove("is-pressed");
        if (reducedMotion.matches) return;
        button.classList.remove("is-popped");
        void button.offsetWidth;
        button.classList.add("is-popped");
        window.setTimeout(function () { button.classList.remove("is-popped"); }, 300);
      }

      button.addEventListener("pointerdown", function () { button.classList.add("is-pressed"); });
      button.addEventListener("pointerup", releaseButton);
      button.addEventListener("pointercancel", releaseButton);
      button.addEventListener("pointerleave", releaseButton);
      button.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") button.classList.add("is-pressed");
      });
      button.addEventListener("keyup", releaseButton);
    });
  }

  function setupCounters() {
    const counters = document.querySelectorAll(".counter");

    function format(value) {
      return new Intl.NumberFormat(getLanguage() === "ar" ? "ar-EG" : "en-US").format(value);
    }

    function animateCounter(counter) {
      const target = Number(counter.getAttribute("data-target"));
      if (!Number.isFinite(target)) return;

      if (reducedMotion.matches) {
        counter.textContent = format(target);
        return;
      }

      const startedAt = performance.now();
      const duration = 1200;
      function update(now) {
        const progress = Math.min((now - startedAt) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = format(Math.floor(eased * target));
        if (progress < 1) window.requestAnimationFrame(update);
      }
      window.requestAnimationFrame(update);
    }

    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      counters.forEach(animateCounter);
    } else {
      const counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        });
      }, { threshold: 0.55 });
      counters.forEach(function (counter) { counterObserver.observe(counter); });
    }
    onLanguageChange(function () {
      counters.forEach(function (counter) {
        counter.textContent = format(Number(counter.getAttribute("data-target")) || 0);
      });
    });
  }

  function setupCards() {
    const cards = document.querySelectorAll(".trend-card");
    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      cards.forEach(function (card) { card.classList.add("visible"); });
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, index) {
        if (!entry.isIntersecting) return;
        window.setTimeout(function () { entry.target.classList.add("visible"); }, index * 130);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    cards.forEach(function (card) { observer.observe(card); });
  }

  function setupLogout() {
    const button = document.getElementById("profileLogoutButton");
    if (!button) return;
    button.addEventListener("click", function () {
      if (window.confirm(translate("logoutConfirm"))) window.location.href = button.getAttribute("data-href") || "login.html";
    });
  }

  function setupDashboardHeaderMenus() {
    const toggles = Array.from(document.querySelectorAll(".designer-dropdown-toggle"));

    function closeAll(exceptButton) {
      toggles.forEach(function (button) {
        if (button === exceptButton) return;
        const menu = document.getElementById(button.getAttribute("aria-controls"));
        button.setAttribute("aria-expanded", "false");
        if (menu) menu.hidden = true;
      });
    }

    toggles.forEach(function (button) {
      const menu = document.getElementById(button.getAttribute("aria-controls"));
      if (!menu) return;
      button.addEventListener("click", function () {
        const willOpen = button.getAttribute("aria-expanded") !== "true";
        closeAll(button);
        button.setAttribute("aria-expanded", willOpen ? "true" : "false");
        menu.hidden = !willOpen;
        if (willOpen) {
          const firstItem = menu.querySelector("a, button");
          if (firstItem) window.setTimeout(function () { firstItem.focus(); }, 0);
        }
      });
    });

    document.addEventListener("click", function (event) {
      if (!event.target.closest(".designer-header-dropdown-wrap")) closeAll();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeAll();
    });
  }

  function setupDesignFilters() {
    const headerSearch = document.getElementById("designerDashboardSearch");
    const tableSearch = document.getElementById("designTableSearch");
    const statusFilter = document.getElementById("designStatusFilter");
    const dateFilter = document.getElementById("designDateFilter");
    const clearButton = document.getElementById("clearDesignFilters");
    const emptyState = document.getElementById("designsEmptyState");
    const rows = Array.from(document.querySelectorAll("[data-design-row]"));
    if (!rows.length) return;

    function normalized(value) {
      return String(value || "").trim().toLocaleLowerCase("ar");
    }

    function applyFilters(source) {
      const activeSearch = source === headerSearch || !tableSearch ? headerSearch : tableSearch;
      const query = normalized(activeSearch && activeSearch.value);
      const status = statusFilter ? statusFilter.value : "";
      const date = dateFilter ? dateFilter.value : "";
      let visibleCount = 0;

      if (headerSearch && tableSearch) {
        if (source === headerSearch) tableSearch.value = headerSearch.value;
        else headerSearch.value = tableSearch.value;
      }

      rows.forEach(function (row) {
        const matchesQuery = !query || normalized(row.getAttribute("data-search")).includes(query);
        const matchesStatus = !status || row.getAttribute("data-status") === status;
        const matchesDate = !date || row.getAttribute("data-date") === date;
        const visible = matchesQuery && matchesStatus && matchesDate;
        row.hidden = !visible;
        if (visible) visibleCount += 1;
      });

      if (emptyState) emptyState.hidden = visibleCount !== 0;
    }

    if (headerSearch) headerSearch.addEventListener("input", function () { applyFilters(headerSearch); });
    if (tableSearch) tableSearch.addEventListener("input", function () { applyFilters(tableSearch); });
    if (statusFilter) statusFilter.addEventListener("change", function () { applyFilters(tableSearch); });
    if (dateFilter) dateFilter.addEventListener("change", function () { applyFilters(tableSearch); });
    if (clearButton) clearButton.addEventListener("click", function () {
      if (headerSearch) headerSearch.value = "";
      if (tableSearch) tableSearch.value = "";
      if (statusFilter) statusFilter.value = "";
      if (dateFilter) dateFilter.value = "";
      applyFilters(tableSearch);
      if (tableSearch) tableSearch.focus();
    });
  }

  function setupChartPeriods() {
    const buttons = Array.from(document.querySelectorAll("[data-chart-period]"));
    const salesLine = document.querySelector(".chart-line.is-sales");
    const profitLine = document.querySelector(".chart-line.is-profit");
    const salesArea = document.querySelector(".chart-area");
    const salesMarker = document.getElementById("salesChartMarker");
    const caption = document.querySelector(".performance-panel .dashboard-panel-head p");
    let markerFrame = 0;
    const series = {
      week: {
        sales: "M10 190 C90 188,105 160,150 168 S245 115,290 132 S380 145,430 108 S530 62,575 78 S660 52,710 36",
        profit: "M10 207 C90 204,105 188,150 193 S245 153,290 166 S380 174,430 145 S530 104,575 118 S660 96,710 84",
        label: "ملخص الأداء خلال آخر 7 أيام"
      },
      month: {
        sales: "M10 185 C80 176,110 158,150 164 S240 130,290 138 S380 99,430 112 S520 70,575 82 S660 38,710 46",
        profit: "M10 203 C80 196,110 185,150 190 S240 165,290 171 S380 139,430 148 S520 112,575 122 S660 86,710 94",
        label: "ملخص الأداء خلال آخر 6 أشهر"
      },
      year: {
        sales: "M10 202 C75 196,110 182,150 185 S235 158,290 165 S375 120,430 132 S520 86,575 96 S655 42,710 28",
        profit: "M10 214 C75 210,110 199,150 202 S235 181,290 187 S375 154,430 162 S520 126,575 134 S655 92,710 78",
        label: "ملخص الأداء خلال آخر 12 شهرًا"
      }
    };

    function animateChart() {
      if (!salesLine || !profitLine) return;
      [salesLine, profitLine, salesArea].forEach(function (element) {
        if (!element) return;
        element.classList.remove("is-drawing");
      });

      void salesLine.getBoundingClientRect();
      [salesLine, profitLine, salesArea].forEach(function (element) {
        if (element) element.classList.add("is-drawing");
      });

      if (!salesMarker) return;
      window.cancelAnimationFrame(markerFrame);
      salesMarker.classList.remove("is-resting");
      salesMarker.classList.add("is-active");
      const pathLength = salesLine.getTotalLength();
      const duration = reducedMotion.matches ? 0 : 1550;
      const startedAt = performance.now();

      function moveMarker(now) {
        const progress = duration ? Math.min((now - startedAt) / duration, 1) : 1;
        const eased = 1 - Math.pow(1 - progress, 3);
        const point = salesLine.getPointAtLength(pathLength * eased);
        salesMarker.setAttribute("cx", point.x.toFixed(2));
        salesMarker.setAttribute("cy", point.y.toFixed(2));
        if (progress < 1) markerFrame = window.requestAnimationFrame(moveMarker);
        else {
          salesMarker.classList.remove("is-active");
          salesMarker.classList.add("is-resting");
        }
      }
      markerFrame = window.requestAnimationFrame(moveMarker);
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        const selected = series[button.getAttribute("data-chart-period")] || series.month;
        buttons.forEach(function (item) {
          item.classList.toggle("active", item === button);
          item.setAttribute("aria-pressed", item === button ? "true" : "false");
        });
        if (salesLine) salesLine.setAttribute("d", selected.sales);
        if (profitLine) profitLine.setAttribute("d", selected.profit);
        if (salesArea) salesArea.setAttribute("d", selected.sales + " L710 218 L10 218 Z");
        if (caption) caption.textContent = selected.label;
        animateChart();
      });
      button.setAttribute("aria-pressed", button.classList.contains("active") ? "true" : "false");
    });

    const chart = document.querySelector(".designer-performance-chart");
    if (chart && !reducedMotion.matches && "IntersectionObserver" in window) {
      const chartObserver = new IntersectionObserver(function (entries) {
        if (!entries.some(function (entry) { return entry.isIntersecting; })) return;
        animateChart();
        chartObserver.disconnect();
      }, { threshold: 0.35 });
      chartObserver.observe(chart);
    } else {
      animateChart();
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    initializeDefaults();
    applyLanguage("ar");
    applyTheme("light");
    setupSidebar();
    setupHeaderButtons();
    setupCounters();
    setupCards();
    setupLogout();
    setupDashboardHeaderMenus();
    setupDesignFilters();
    setupChartPeriods();

    const themeButton = document.getElementById("themeToggleButton");
    const languageButton = document.getElementById("languageToggleButton");
    if (themeButton) themeButton.addEventListener("click", function () { applyTheme(currentTheme() === "dark" ? "light" : "dark"); });
    if (languageButton) languageButton.addEventListener("click", function () { applyLanguage(getLanguage() === "ar" ? "en" : "ar"); });
  });
})(window, document);
