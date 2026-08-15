"use strict";

/* =========================================================
   PalPrints — Printing House Profile
   File: assets/js/pages/printingProfile.js
   يعتمد على: assets/js/pages/profile-core.js

   ملاحظة أمنية مهمة (عقد الـ API):
   يجب أن تُرجع الواجهة الخلفية بيانات التحويل مخفية
   افتراضيًا، مثال:
   {
     "bankName": "بنك فلسطين",
     "accountNumberMasked": "•••• 1121",
     "ibanMasked": "PS92 •••• •••• 1000"
   }
   ولا يُرجَع الرقم الكامل إلا ضمن إجراء آمن ومصرح به
   (تحقق إضافي + صلاحية + تسجيل في سجل التدقيق).
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  const Core = window.PalProfile;

  if (!Core) {
    console.error("لم يتم تحميل profile-core.js قبل printingProfile.js");
    return;
  }

  /* =======================================================
     القاموس
     ======================================================= */

  const dictionary = {
    ar: {
      documentTitle: "الملف الشخصي للمطبعة | PalPrints",
      documentDescription: "الملف الشخصي للمطبعة في منصة PalPrints",

      skipToContent: "تخطي إلى المحتوى",
      sidebarLabel: "القائمة الجانبية للمطبعة",
      printerNavLabel: "روابط حساب المطبعة",
      breadcrumbLabel: "مسار التنقل",
      goDashboard: "الانتقال إلى لوحة التحكم",
      openSidebar: "فتح القائمة الجانبية",
      closeSidebar: "إغلاق القائمة الجانبية",
      goBack: "الرجوع إلى الصفحة السابقة",
      back: "رجوع",
      close: "إغلاق",

      changeTheme: "تغيير المظهر",
      switchToDark: "تفعيل الوضع الليلي",
      switchToLight: "تفعيل الوضع النهاري",
      changeLanguage: "تغيير اللغة",
      shoppingCart: "سلة المشتريات",
      notifications: "الإشعارات",

      dashboard: "لوحة التحكم",
      profileTitle: "الملف الشخصي",
      printerProfileTitle: "الملف الشخصي للمطبعة",
      printServices: "خدمات ومنتجات الطباعة",
      printOrders: "طلبات الطباعة",
      walletAndEarnings: "الأرباح والمحفظة",
      withdrawals: "طلبات السحب",
      reviews: "التقييمات",
      settingsSecurity: "الإعدادات والأمان",
      support: "التواصل مع الدعم الفني",
      logout: "تسجيل الخروج",
      logoutConfirm: "هل تريد تسجيل الخروج من حساب المطبعة؟",

      printerLogo: "شعار المطبعة",
      changeLogo: "تغيير شعار المطبعة",
      printerServices: "طباعة · تصميم · تغليف",
      location: "غزة، فلسطين",

      /* قيم البيانات القابلة للترجمة */
      printerNameValue: "مطبعة الألوان الحديثة",
      workingHoursValue: "8:00 ص – 8:00 م",
      addressValue: "غزة، الرمال، شارع عمر المختار",
      joinDateValue: "15 مارس 2024",
      lastTransferValue: "5 أغسطس 2026",
      lastReviewValue: "2 أغسطس 2026",
      bankNameValue: "بنك فلسطين",

      /* حالات اعتماد المطبعة */
      approvalApproved: "مطبعة معتمدة",
      approvalPending: "قيد المراجعة",
      approvalIncomplete: "تحتاج استكمال وثائق",
      approvalRejected: "مرفوضة",
      approvalPendingTitle: "ملف المطبعة قيد المراجعة",
      approvalPendingText:
        "يراجع فريق PalPrints وثائق المطبعة، وسيصلك إشعار فور انتهاء المراجعة.",
      approvalIncompleteTitle: "تحتاج المطبعة إلى استكمال الوثائق",
      approvalIncompleteText:
        "ارفع ترخيص المطبعة ووثيقة التحقق ليتم اعتماد حسابك واستقبال الطلبات.",
      approvalRejectedTitle: "تم رفض اعتماد المطبعة",
      approvalRejectedText:
        "راجع ملاحظات فريق المراجعة وأعد رفع الوثائق المطلوبة.",

      /* واتساب */
      whatsappVerified: "واتساب موثق",
      whatsappUnverified: "غير موثق",
      whatsappPending: "قيد التوثيق",
      whatsappShort: "موثق",
      ordersWhatsapp: "رقم واتساب الطلبات",

      manageServices: "إدارة الخدمات والأسعار",
      viewNewOrders: "عرض الطلبات الجديدة",
      editPrinterProfile: "تعديل ملف المطبعة",
      editPrinterDescription:
        "حدّث بيانات المطبعة الأساسية ثم احفظ التغييرات.",

      ordersNeedAction: "طلبات تحتاج إجراء",
      awaitingAcceptance: "بانتظار القبول",
      inPrinting: "قيد الطباعة",
      readyToShip: "جاهزة للشحن",
      lateOrders: "متأخرة",
      viewPrintOrders: "عرض طلبات الطباعة",
      emptyActionOrdersTitle: "لا توجد طلبات تحتاج إجراء",
      emptyActionOrdersText: "أحسنت! جميع الطلبات الحالية تمت معالجتها.",

      performanceSummary: "ملخص الأداء",
      completedOrdersCount: "طلباً مكتملاً",
      completionRate: "معدل الإنجاز",
      generalRating: "التقييم العام",
      averageProduction: "متوسط الإنتاج",
      twoDays: "يومان",

      /* الخدمات */
      serviceMugs: "أكواب",
      serviceTshirts: "تيشيرتات",
      serviceNotebooks: "دفاتر",
      servicePaper: "طباعة ورقية",
      serviceLeather: "طباعة جلدية",
      servicePackaging: "تغليف",
      manageableItems:
        "المنتجات · الأسعار · الألوان والمقاسات · مدة الإنتاج · توفر الخدمة — محدَّثة",
      addService: "إضافة خدمة",
      emptyServicesTitle: "لم تُضِف خدمات بعد",
      emptyServicesText:
        "أضف منتجاتك وأسعارك ومدة الإنتاج ليتمكن العملاء من الطلب منك.",
      serviceUnavailable: "غير متوفرة حالياً",

      totalEarnings: "إجمالي الأرباح",
      availableForWithdrawal: "متاح للسحب",
      pendingEarnings: "أرباح معلقة",
      lastTransfer: "آخر تحويل",
      requestWithdrawal: "طلب سحب",
      withdrawalRequested: "تم إرسال طلب السحب، سيصلك إشعار عند الموافقة.",

      printerInformation: "معلومات المطبعة",
      workingHours: "ساعات العمل",
      address: "العنوان",
      joinDate: "تاريخ الانضمام",
      printerName: "اسم المطبعة",
      email: "البريد الإلكتروني",
      editInformation: "تعديل المعلومات",

      verificationDocuments: "وثائق الاعتماد",
      documentLicense: "ترخيص المطبعة",
      documentVerification: "وثيقة التحقق",
      documentVerified: "موثق",
      documentPending: "قيد المراجعة",
      documentMissing: "مطلوب",
      documentRejected: "مرفوض",
      lastReview: "آخر مراجعة",
      manageDocuments: "إدارة الوثائق",
      uploadDocuments: "رفع الوثائق",
      emptyDocumentsTitle: "لم تُرفع وثائق بعد",
      emptyDocumentsText:
        "ارفع ترخيص المطبعة ووثيقة التحقق ليتم اعتماد حسابك.",

      transferDetails: "بيانات التحويل",
      bankName: "اسم البنك",
      accountHolder: "اسم صاحب الحساب",
      accountNumber: "رقم الحساب",
      editBankDetails: "تعديل بيانات التحويل",
      addBankDetails: "إضافة بيانات التحويل",
      bankProtectedNote:
        "بياناتك المالية محمية ولا تُعرض كاملة إلا بعد تحقق إضافي.",
      bankSecurityNote:
        "تُرسل البيانات مشفّرة، وتُعرض لاحقاً مخفية بآخر أربعة أرقام فقط.",
      bankDialogDescription:
        "لأسباب أمنية لا تُعرض البيانات الحالية كاملة، أدخل البيانات من جديد لتحديثها.",
      bankUpdated: "تم تحديث بيانات التحويل بنجاح.",
      emptyBankTitle: "لم تُضِف بيانات تحويل",
      emptyBankText: "أضف حساباً بنكياً لاستلام أرباحك من المنصة.",

      notificationPreferences: "تفضيلات الإشعارات",
      prefNewOrdersWhatsapp: "طلبات الطباعة الجديدة عبر واتساب",
      prefOrderStatus: "تحديثات حالة الطلب",
      prefWeeklyReports: "التقارير الأسبوعية عبر البريد الإلكتروني",
      prefPayouts: "الأرباح والتحويلات",
      preferenceOn: "تم التفعيل",
      preferenceOff: "تم الإيقاف",

      passwordMovedNote:
        "تغيير كلمة المرور أصبح ضمن «الإعدادات والأمان».",

      cancel: "إلغاء",
      saveChanges: "حفظ التغييرات",
      saving: "جارٍ الحفظ…",
      saveSuccess: "تم حفظ التغييرات بنجاح.",
      requiredField: "هذا الحقل مطلوب.",
      invalidEmail: "أدخل بريداً إلكترونياً صحيحاً.",

      errorTitle: "تعذر تحميل البيانات",
      errorHeroText:
        "حدث خطأ أثناء جلب بيانات المطبعة، تحقق من الاتصال ثم أعد المحاولة.",
      retry: "إعادة المحاولة",

      avatarTypeError: "يُسمح بصور PNG أو JPG أو WEBP فقط.",
      avatarSizeError: "حجم الصورة يجب أن يكون أقل من 2 ميجابايت.",
      avatarReadError: "تعذر قراءة الصورة.",
      avatarSuccess: "تم تحديث الشعار بنجاح."
    },

    en: {
      documentTitle: "Printing House Profile | PalPrints",
      documentDescription:
        "Printing house profile on the PalPrints platform",

      skipToContent: "Skip to content",
      sidebarLabel: "Printing house sidebar",
      printerNavLabel: "Printing house account links",
      breadcrumbLabel: "Breadcrumb",
      goDashboard: "Go to the dashboard",
      openSidebar: "Open sidebar",
      closeSidebar: "Close sidebar",
      goBack: "Go back to the previous page",
      back: "Back",
      close: "Close",

      changeTheme: "Change theme",
      switchToDark: "Switch to dark mode",
      switchToLight: "Switch to light mode",
      changeLanguage: "Change language",
      shoppingCart: "Shopping cart",
      notifications: "Notifications",

      dashboard: "Dashboard",
      profileTitle: "Profile",
      printerProfileTitle: "Printing house profile",
      printServices: "Printing services & products",
      printOrders: "Print orders",
      walletAndEarnings: "Wallet & earnings",
      withdrawals: "Withdrawal requests",
      reviews: "Reviews",
      settingsSecurity: "Settings & security",
      support: "Contact support",
      logout: "Log out",
      logoutConfirm: "Do you want to log out of the printing house account?",

      printerLogo: "Printing house logo",
      changeLogo: "Change printing house logo",
      printerServices: "Printing · Design · Packaging",
      location: "Gaza, Palestine",

      printerNameValue: "Al Alwan Modern Press",
      workingHoursValue: "8:00 AM - 8:00 PM",
      addressValue: "Gaza, Al Rimal, Omar Al Mukhtar St.",
      joinDateValue: "15 March 2024",
      lastTransferValue: "5 August 2026",
      lastReviewValue: "2 August 2026",
      bankNameValue: "Bank of Palestine",

      approvalApproved: "Verified printing house",
      approvalPending: "Under review",
      approvalIncomplete: "Documents required",
      approvalRejected: "Rejected",
      approvalPendingTitle: "Your printing house profile is under review",
      approvalPendingText:
        "The PalPrints team is reviewing your documents and will notify you once done.",
      approvalIncompleteTitle: "Missing verification documents",
      approvalIncompleteText:
        "Upload your printing licence and verification document to get approved and receive orders.",
      approvalRejectedTitle: "Verification was rejected",
      approvalRejectedText:
        "Review the team's notes and upload the required documents again.",

      whatsappVerified: "WhatsApp verified",
      whatsappUnverified: "Not verified",
      whatsappPending: "Verification pending",
      whatsappShort: "Verified",
      ordersWhatsapp: "Orders WhatsApp number",

      manageServices: "Manage services & prices",
      viewNewOrders: "View new orders",
      editPrinterProfile: "Edit printing house profile",
      editPrinterDescription:
        "Update the printing house details and save the changes.",

      ordersNeedAction: "Orders needing action",
      awaitingAcceptance: "Awaiting acceptance",
      inPrinting: "In printing",
      readyToShip: "Ready to ship",
      lateOrders: "Late",
      viewPrintOrders: "View print orders",
      emptyActionOrdersTitle: "No orders need action",
      emptyActionOrdersText: "Well done! All current orders are handled.",

      performanceSummary: "Performance summary",
      completedOrdersCount: "Completed orders",
      completionRate: "Completion rate",
      generalRating: "Overall rating",
      averageProduction: "Average production",
      twoDays: "2 days",

      serviceMugs: "Mugs",
      serviceTshirts: "T-shirts",
      serviceNotebooks: "Notebooks",
      servicePaper: "Paper printing",
      serviceLeather: "Leather printing",
      servicePackaging: "Packaging",
      manageableItems:
        "Products · Prices · Colors & sizes · Production time · Availability — up to date",
      addService: "Add service",
      emptyServicesTitle: "No services added yet",
      emptyServicesText:
        "Add your products, prices and production time so customers can order.",
      serviceUnavailable: "Currently unavailable",

      totalEarnings: "Total earnings",
      availableForWithdrawal: "Available to withdraw",
      pendingEarnings: "Pending earnings",
      lastTransfer: "Last transfer",
      requestWithdrawal: "Request withdrawal",
      withdrawalRequested:
        "Withdrawal request sent — you will be notified once approved.",

      printerInformation: "Printing house information",
      workingHours: "Working hours",
      address: "Address",
      joinDate: "Join date",
      printerName: "Printing house name",
      email: "Email",
      editInformation: "Edit information",

      verificationDocuments: "Verification documents",
      documentLicense: "Printing licence",
      documentVerification: "Verification document",
      documentVerified: "Verified",
      documentPending: "Under review",
      documentMissing: "Required",
      documentRejected: "Rejected",
      lastReview: "Last review",
      manageDocuments: "Manage documents",
      uploadDocuments: "Upload documents",
      emptyDocumentsTitle: "No documents uploaded yet",
      emptyDocumentsText:
        "Upload your printing licence and verification document to get approved.",

      transferDetails: "Transfer details",
      bankName: "Bank name",
      accountHolder: "Account holder name",
      accountNumber: "Account number",
      editBankDetails: "Edit transfer details",
      addBankDetails: "Add transfer details",
      bankProtectedNote:
        "Your financial data is protected and never shown in full without extra verification.",
      bankSecurityNote:
        "Data is sent encrypted and later displayed masked with the last four digits only.",
      bankDialogDescription:
        "For security reasons current details are not shown in full — enter them again to update.",
      bankUpdated: "Transfer details updated successfully.",
      emptyBankTitle: "No transfer details added",
      emptyBankText: "Add a bank account to receive your earnings.",

      notificationPreferences: "Notification preferences",
      prefNewOrdersWhatsapp: "New print orders via WhatsApp",
      prefOrderStatus: "Order status updates",
      prefWeeklyReports: "Weekly reports by email",
      prefPayouts: "Earnings & transfers",
      preferenceOn: "enabled",
      preferenceOff: "disabled",

      passwordMovedNote:
        "Password changes now live in “Settings & security”.",

      cancel: "Cancel",
      saveChanges: "Save changes",
      saving: "Saving…",
      saveSuccess: "Changes saved successfully.",
      requiredField: "This field is required.",
      invalidEmail: "Enter a valid email address.",

      errorTitle: "Could not load data",
      errorHeroText:
        "Something went wrong while loading the printing house data. Check your connection and try again.",
      retry: "Try again",

      avatarTypeError: "Only PNG, JPG or WEBP images are allowed.",
      avatarSizeError: "Image size must be under 2 MB.",
      avatarReadError: "Could not read the image.",
      avatarSuccess: "Logo updated successfully."
    }
  };

  Core.init({ dictionary: dictionary });

  /* =======================================================
     بيانات تجريبية — تُستبدل بنداءات API
     ======================================================= */

  const printer = {
    /* approved | pending | incomplete | rejected */
    approvalStatus: "approved",

    /* verified | pending | unverified */
    whatsappStatus: "verified",

    documents: [
      { key: "documentLicense", status: "verified" },
      { key: "documentVerification", status: "verified" }
    ],

    services: [
      { key: "serviceMugs", icon: "bi-cup-hot", available: true },
      { key: "serviceTshirts", icon: "bi-person-arms-up", available: true },
      { key: "serviceNotebooks", icon: "bi-journal-text", available: true },
      { key: "servicePaper", icon: "bi-printer", available: true },
      { key: "serviceLeather", icon: "bi-bag", available: true },
      { key: "servicePackaging", icon: "bi-box-seam", available: true }
    ],

    /* البيانات البنكية تصل من الخادم مخفية أصلاً.
       اسم البنك يُعرض عبر الترجمة (bankNameValue) ما لم
       يعدّله المستخدم، لذلك لا نضعه هنا. */
    bank: {
      bankName: null,
      accountNumberMasked: "•••• 1121",
      ibanMasked: "PS92 •••• •••• 1000"
    }
  };

  function fakeRequest(payload, delay) {
    return new Promise(function (resolve) {
      window.setTimeout(function () {
        resolve(payload);
      }, delay || 550);
    });
  }

  /* =======================================================
     حالة اعتماد المطبعة
     ======================================================= */

  const approvalBadge = document.getElementById("printerApprovalBadge");
  const approvalText = document.getElementById("printerApprovalText");
  const approvalAlert = document.getElementById("approvalAlert");
  const approvalAlertTitle = document.getElementById("approvalAlertTitle");
  const approvalAlertText = document.getElementById("approvalAlertText");

  const APPROVAL_MAP = {
    approved: {
      className: "is-approved",
      icon: "bi-patch-check-fill",
      labelKey: "approvalApproved"
    },
    pending: {
      className: "is-pending",
      icon: "bi-hourglass-split",
      labelKey: "approvalPending",
      alertClass: "",
      titleKey: "approvalPendingTitle",
      textKey: "approvalPendingText"
    },
    incomplete: {
      className: "is-incomplete",
      icon: "bi-file-earmark-arrow-up",
      labelKey: "approvalIncomplete",
      alertClass: "is-incomplete",
      titleKey: "approvalIncompleteTitle",
      textKey: "approvalIncompleteText"
    },
    rejected: {
      className: "is-rejected",
      icon: "bi-x-octagon",
      labelKey: "approvalRejected",
      alertClass: "is-rejected",
      titleKey: "approvalRejectedTitle",
      textKey: "approvalRejectedText"
    }
  };

  function renderApprovalStatus() {
    const config =
      APPROVAL_MAP[printer.approvalStatus] || APPROVAL_MAP.pending;

    if (approvalBadge) {
      approvalBadge.className = "profile-badge " + config.className;

      const icon = approvalBadge.querySelector("i");

      if (icon) {
        icon.className = "bi " + config.icon;
      }
    }

    if (approvalText) {
      approvalText.textContent = Core.translate(config.labelKey);
    }

    if (!approvalAlert) {
      return;
    }

    if (printer.approvalStatus === "approved") {
      approvalAlert.hidden = true;
      return;
    }

    approvalAlert.hidden = false;

    approvalAlert.className =
      "printer-approval-alert " + (config.alertClass || "");

    if (approvalAlertTitle) {
      approvalAlertTitle.textContent = Core.translate(config.titleKey);
    }

    if (approvalAlertText) {
      approvalAlertText.textContent = Core.translate(config.textKey);
    }
  }

  /* =======================================================
     حالة توثيق رقم واتساب
     ======================================================= */

  const WHATSAPP_MAP = {
    verified: {
      className: "is-whatsapp",
      icon: "bi-patch-check",
      labelKey: "whatsappVerified",
      shortKey: "whatsappShort"
    },
    pending: {
      className: "is-pending",
      icon: "bi-hourglass-split",
      labelKey: "whatsappPending",
      shortKey: "whatsappPending"
    },
    unverified: {
      className: "is-rejected",
      icon: "bi-exclamation-circle",
      labelKey: "whatsappUnverified",
      shortKey: "whatsappUnverified"
    }
  };

  function renderWhatsappStatus() {
    const config =
      WHATSAPP_MAP[printer.whatsappStatus] || WHATSAPP_MAP.unverified;

    const pairs = [
      {
        badge: document.getElementById("whatsappBadge"),
        text: document.getElementById("whatsappBadgeText"),
        key: config.labelKey
      },
      {
        badge: document.getElementById("infoWhatsappBadge"),
        text: document.getElementById("infoWhatsappBadgeText"),
        key: config.shortKey
      }
    ];

    pairs.forEach(function (pair) {
      if (pair.badge) {
        pair.badge.className = "profile-badge " + config.className;

        const icon = pair.badge.querySelector("i");

        if (icon) {
          icon.className = "bi " + config.icon;
        }
      }

      if (pair.text) {
        pair.text.textContent = Core.translate(pair.key);
      }
    });
  }

  /* =======================================================
     خدمات ومنتجات الطباعة
     ======================================================= */

  const servicesSection = document.getElementById("servicesSection");
  const serviceGrid = document.getElementById("serviceGrid");

  function renderServices() {
    if (!serviceGrid) {
      return;
    }

    serviceGrid.innerHTML = "";

    printer.services.forEach(function (service) {
      const item = document.createElement("li");

      item.className =
        "printer-service" + (service.available ? "" : " is-off");

      if (!service.available) {
        item.title = Core.translate("serviceUnavailable");
      }

      const icon = document.createElement("i");
      icon.className = "bi " + service.icon;
      icon.setAttribute("aria-hidden", "true");

      const label = document.createElement("span");
      label.textContent = Core.translate(service.key);

      item.appendChild(icon);
      item.appendChild(label);

      serviceGrid.appendChild(item);
    });
  }

  /* =======================================================
     وثائق الاعتماد
     ======================================================= */

  const documentsSection = document.getElementById("documentsSection");
  const documentList = document.getElementById("documentList");

  const DOCUMENT_STATUS_MAP = {
    verified: {
      itemClass: "",
      icon: "bi-check-circle-fill",
      badgeClass: "is-approved",
      labelKey: "documentVerified"
    },
    pending: {
      itemClass: "is-pending",
      icon: "bi-hourglass-split",
      badgeClass: "is-pending",
      labelKey: "documentPending"
    },
    missing: {
      itemClass: "is-missing",
      icon: "bi-exclamation-circle-fill",
      badgeClass: "is-incomplete",
      labelKey: "documentMissing"
    },
    rejected: {
      itemClass: "is-rejected",
      icon: "bi-x-circle-fill",
      badgeClass: "is-rejected",
      labelKey: "documentRejected"
    }
  };

  function renderDocuments() {
    if (!documentList) {
      return;
    }

    documentList.innerHTML = "";

    printer.documents.forEach(function (document_) {
      const config =
        DOCUMENT_STATUS_MAP[document_.status] || DOCUMENT_STATUS_MAP.missing;

      const item = document.createElement("li");
      item.className = "printer-document " + config.itemClass;

      const name = document.createElement("span");
      name.className = "printer-document-name";

      const icon = document.createElement("i");
      icon.className = "bi " + config.icon;
      icon.setAttribute("aria-hidden", "true");

      const nameText = document.createElement("span");
      nameText.textContent = Core.translate(document_.key);

      name.appendChild(icon);
      name.appendChild(nameText);

      const badge = document.createElement("span");
      badge.className = "profile-badge " + config.badgeClass;
      badge.textContent = Core.translate(config.labelKey);

      item.appendChild(name);
      item.appendChild(badge);

      documentList.appendChild(item);
    });

    const lastReview = document.getElementById("documentsLastReview");

    if (lastReview) {
      lastReview.textContent = Core.translate("lastReviewValue");
    }
  }

  /* =======================================================
     بيانات التحويل — تُعرض مخفية دائماً
     ======================================================= */

  const bankSection = document.getElementById("bankSection");

  function renderBank() {
    const accountElement = document.getElementById("bankAccountMasked");
    const ibanElement = document.getElementById("bankIbanMasked");

    if (!printer.bank) {
      Core.setState(bankSection, "empty");
      return;
    }

    /* لا نلمس اسم البنك إلا إذا عدّله المستخدم،
       وإلا تتكفل الترجمة بعرضه */
    if (printer.bank.bankName) {
      setEditedValue("bankName", printer.bank.bankName);
    }

    /* القيم تصل مخفية من الخادم؛ نستخدم الإخفاء المحلي
       فقط كخط دفاع أخير إذا وصل الرقم كاملاً بالخطأ. */

    if (accountElement) {
      accountElement.textContent =
        printer.bank.accountNumberMasked ||
        Core.maskAccountNumber(printer.bank.accountNumber);
    }

    if (ibanElement) {
      ibanElement.textContent =
        printer.bank.ibanMasked || Core.maskIban(printer.bank.iban);
    }

    Core.setState(bankSection, "ready");
  }

  /* =======================================================
     النماذج
     ======================================================= */

  function clearFieldErrors(form) {
    Array.prototype.forEach.call(
      form.querySelectorAll(".profile-field"),
      function (field) {
        field.classList.remove("has-error");

        const input = field.querySelector("input, select, textarea");

        if (input) {
          input.removeAttribute("aria-invalid");
        }
      }
    );
  }

  function validate(form, inputs) {
    clearFieldErrors(form);

    let valid = true;

    inputs.forEach(function (input) {
      if (!input) {
        return;
      }

      const value = String(input.value || "").trim();
      const field = input.closest(".profile-field");

      let ok = Boolean(value);

      if (ok && input.type === "email") {
        ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      }

      if (!ok) {
        valid = false;

        if (field) {
          field.classList.add("has-error");
        }

        input.setAttribute("aria-invalid", "true");
      }
    });

    if (!valid) {
      const firstInvalid = form.querySelector('[aria-invalid="true"]');

      if (firstInvalid) {
        firstInvalid.focus();
      }
    }

    return valid;
  }

  /* تعديل معلومات المطبعة */

  /* الحقول تُعبّأ من القيم المعروضة حالياً
     حتى تتبع اللغة النشطة */

  const EDIT_FIELD_MAP = [
    { input: "editPrinterName", source: "printerName" },
    { input: "editPrinterEmail", source: "printerEmail" },
    { input: "editPrinterWhatsapp", source: "printerWhatsapp" },
    { input: "editWorkingHours", source: "infoWorkingHours" },
    { input: "editPrinterAddress", source: "infoAddress" }
  ];

  const printerEditDialog = Core.setupDialog("printerEditDialog", {
    onOpen: function () {
      EDIT_FIELD_MAP.forEach(function (pair) {
        const input = document.getElementById(pair.input);
        const source = document.getElementById(pair.source);

        if (input && source) {
          input.value = source.textContent.trim();
        }
      });
    }
  });

  const printerEditForm = document.getElementById("printerEditForm");
  const printerEditSave = document.getElementById("printerEditSave");

  /* بعد التعديل اليدوي نوقف الترجمة التلقائية لهذا العنصر
     حتى لا تُستبدل قيمة المستخدم عند تبديل اللغة */

  function setEditedValue(id, value) {
    const element = document.getElementById(id);

    if (!element) {
      return;
    }

    element.textContent = value;
    element.removeAttribute("data-i18n");
  }

  if (printerEditForm) {
    printerEditForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const name = document.getElementById("editPrinterName");
      const email = document.getElementById("editPrinterEmail");
      const whatsapp = document.getElementById("editPrinterWhatsapp");
      const hours = document.getElementById("editWorkingHours");
      const address = document.getElementById("editPrinterAddress");

      if (
        !validate(printerEditForm, [name, email, whatsapp, hours, address])
      ) {
        return;
      }

      const label = printerEditSave.querySelector("span");
      const originalText = label ? label.textContent : "";

      if (label) {
        label.textContent = Core.translate("saving");
      }

      printerEditSave.disabled = true;

      fakeRequest(true, 650).then(function () {
        setEditedValue("printerName", name.value.trim());
        setEditedValue("printerEmail", email.value.trim());
        setEditedValue("printerWhatsapp", whatsapp.value.trim());
        setEditedValue("infoWhatsapp", whatsapp.value.trim());
        setEditedValue("infoWorkingHours", hours.value.trim());
        setEditedValue("infoAddress", address.value.trim());

        if (label) {
          label.textContent = originalText;
        }

        printerEditSave.disabled = false;

        printerEditDialog.close();

        Core.toast(Core.translate("saveSuccess"), "success");
      });
    });
  }

  /* تعديل بيانات التحويل */

  const bankDialog = Core.setupDialog("bankDialog", {
    onOpen: function () {
      /* لا نملأ الحقول الحساسة بالقيم الحالية إطلاقاً،
         اسم البنك وحده غير حساس فنقرأه من العرض الحالي */
      const bankNameInput = document.getElementById("editBankName");
      const bankNameElement = document.getElementById("bankName");

      if (bankNameInput && bankNameElement) {
        bankNameInput.value = bankNameElement.textContent.trim();
      }

      ["editAccountHolder", "editAccountNumber", "editIban"].forEach(
        function (id) {
          const input = document.getElementById(id);

          if (input) {
            input.value = "";
          }
        }
      );
    }
  });

  const bankForm = document.getElementById("bankForm");

  if (bankForm) {
    bankForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const bankName = document.getElementById("editBankName");
      const holder = document.getElementById("editAccountHolder");
      const account = document.getElementById("editAccountNumber");
      const iban = document.getElementById("editIban");

      if (!validate(bankForm, [bankName, holder, account, iban])) {
        return;
      }

      fakeRequest(true, 700).then(function () {
        /* في التطبيق الحقيقي تُرسل القيم للخادم،
           والخادم يعيد النسخة المخفية فقط. */

        printer.bank = {
          bankName: bankName.value.trim(),
          accountNumberMasked: Core.maskAccountNumber(account.value),
          ibanMasked: Core.maskIban(iban.value)
        };

        /* تفريغ الحقول الحساسة مباشرة بعد الإرسال */
        account.value = "";
        iban.value = "";

        renderBank();

        bankDialog.close();

        Core.toast(Core.translate("bankUpdated"), "success");
      });
    });
  }

  /* طلب سحب */

  const withdrawButton = document.getElementById("withdrawButton");

  if (withdrawButton) {
    withdrawButton.addEventListener("click", function () {
      withdrawButton.disabled = true;

      fakeRequest(true, 600).then(function () {
        withdrawButton.disabled = false;

        Core.toast(Core.translate("withdrawalRequested"), "success");
      });
    });
  }

  /* =======================================================
     تحميل الأقسام
     ======================================================= */

  const heroSection = document.getElementById("profileHero");
  const actionOrdersSection = document.getElementById("actionOrdersSection");
  const performanceSection = document.getElementById("performanceSection");
  const walletSection = document.getElementById("walletSection");

  function loadHero() {
    Core.loadSection(heroSection, function () {
      return fakeRequest(printer, 450);
    }).then(function () {
      renderApprovalStatus();
      renderWhatsappStatus();
    });
  }

  function loadActionOrders() {
    Core.loadSection(
      actionOrdersSection,
      function () {
        return fakeRequest({ awaiting: 6, printing: 14 }, 600);
      },
      {
        isEmpty: function (result) {
          return !result;
        }
      }
    );
  }

  function loadPerformance() {
    Core.loadSection(performanceSection, function () {
      return fakeRequest({ rating: 4.8 }, 550);
    });
  }

  function loadWallet() {
    Core.loadSection(walletSection, function () {
      return fakeRequest({ total: 23370 }, 700);
    });
  }

  function loadServices() {
    Core.setState(servicesSection, "loading");

    fakeRequest(printer.services, 600).then(function (list) {
      renderServices();

      Core.setState(
        servicesSection,
        list && list.length ? "ready" : "empty"
      );
    });
  }

  function loadDocuments() {
    Core.setState(documentsSection, "loading");

    fakeRequest(printer.documents, 650).then(function (list) {
      renderDocuments();

      Core.setState(
        documentsSection,
        list && list.length ? "ready" : "empty"
      );
    });
  }

  function loadBank() {
    Core.setState(bankSection, "loading");

    fakeRequest(printer.bank, 700).then(function () {
      renderBank();
    });
  }

  Core.onRetry(heroSection, loadHero);
  Core.onRetry(actionOrdersSection, loadActionOrders);
  Core.onRetry(performanceSection, loadPerformance);
  Core.onRetry(walletSection, loadWallet);
  Core.onRetry(servicesSection, loadServices);
  Core.onRetry(documentsSection, loadDocuments);
  Core.onRetry(bankSection, loadBank);

  loadHero();
  loadActionOrders();
  loadPerformance();
  loadWallet();
  loadServices();
  loadDocuments();
  loadBank();

  /* =======================================================
     إعادة الرسم عند تغيير اللغة
     ======================================================= */

  Core.onLanguageChange(function () {
    renderApprovalStatus();
    renderWhatsappStatus();
    renderServices();
    renderDocuments();
  });
});
