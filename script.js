/* =========================================================
   PALPRINTS Register Page
   File: script.js
   Vanilla JavaScript only
   ========================================================= */

(() => {
  "use strict";

  /* ---------------------------------------------------------
     Back-end integration placeholders
     Add your real endpoints when the API is ready.
     --------------------------------------------------------- */
  const API_CONFIG = Object.freeze({
    register: "",
    googleAuth: ""
  });

  /*
   * عدّل هذه المسارات فقط إذا كان ترتيب المجلدات مختلفًا داخل مشروعك.
   * الصفحة الرئيسية موجودة داخل مجلد homepage حسب الملفات المرسلة.
   */
  const ROUTES = Object.freeze({
    login: "login.html",
    accountStatus: "account-status.html"
  });

  const STORAGE_KEYS = Object.freeze({
    language: "palprints-language",
    theme: "palprints-theme",
    accountRole: "palprints-account-role",
    pendingRegistration: "palprints-pending-registration"
  });

  const translations = {
    ar: {
      pageTitle: "إنشاء حساب جديد | PALPRINTS",
      pageDescription: "إنشاء حساب جديد في منصة PALPRINTS كعميل أو مصمم أو مطبعة.",
      skipToContent: "انتقل إلى المحتوى الرئيسي",
      headerNavLabel: "خيارات الحساب والواجهة",
      alreadyHaveAccount: "هل لديك حساب بالفعل؟",
      signIn: "تسجيل الدخول",
      languageToggleLabel: "تغيير اللغة إلى الإنجليزية",
      themeToggleLabel: "تفعيل الوضع الليلي",
      themeToggleText: "تبديل المظهر",
      activateDarkTheme: "تفعيل الوضع الليلي",
      activateLightTheme: "تفعيل الوضع الفاتح",
      eyebrow: "ابدأ رحلتك مع PALPRINTS",
      registerTitle: "إنشاء حساب جديد",
      registerSubtitle: "اختر نوع الحساب المناسب لك، ثم أكمل البيانات المطلوبة.",
      onboardingWelcomeTitle: "أهلاً بك في PALPRINTS",
      onboardingWelcomeSubtitle: "اختر نوع الحساب الذي يناسبك للمتابعة.",
      changeAccountType: "تغيير نوع الحساب",
      completeYourDetails: "أكمل بياناتك",
      onboardingCustomerTitle: "إنشاء حساب العميل",
      onboardingDesignerTitle: "إنشاء حساب مصمم جديد",
      onboardingPrinterTitle: "إنشاء حساب مطبعة شريكة",
      backToRegistration: "العودة إلى صفحة التسجيل الرئيسية",
      chooseAccountType: "اختر نوع الحساب",
      roleSelectionDescription: "اختر المسار الذي يناسب أهدافك لتخصيص تجربة التسجيل والخدمات المتاحة لك.",
      accountTypesLabel: "أنواع الحسابات",
      customer: "العميل",
      customerDescription: "اطلب تصاميم مخصصة واطبع منتجاتك الفريدة بسهولة",
      designer: "المصمم",
      designerDescription: "اعرض أعمالك الإبداعية، وقم ببيع تصاميمك وحقّق أرباحاً",
      printer: "المطبعة",
      printerDescription: "استقبل طلبات الطباعة ونفّذها بجودة وكفاءة عالية",
      visualDefaultTitle: "حوّل أفكارك إلى منتجات تحمل بصمتك",
      visualDefaultDescription: "اختر نوع الحساب الذي يناسبك وابدأ رحلتك الإبداعية.",
      visualCustomerTitle: "اكتشف تصاميم تعبّر عنك",
      visualCustomerDescription: "اختر التصميم الذي تحبه واطبعه على المنتج المناسب لك بسهولة.",
      visualDesignerTitle: "حوّل إبداعك إلى فرصة",
      visualDesignerDescription: "اعرض تصاميمك، وسّع جمهورك، واجعل أعمالك تصل إلى منتجات حقيقية.",
      visualPrinterTitle: "نمِّ أعمالك مع طلبات جديدة",
      visualPrinterDescription: "استقبل فرص طباعة جديدة تناسب خدمات مطبعتك ووسّع نطاق أعمالك.",
      personalInformation: "المعلومات الشخصية",
      fullName: "الاسم الكامل",
      email: "البريد الإلكتروني",
      gmailAccount: "البريد الإلكتروني",
      invalidGmail: "أدخل عنوان Gmail صحيحًا ينتهي بـ @gmail.com.",
      phoneNumber: "رقم الهاتف",
      phoneHint: "أدخل الرقم مع مفتاح الدولة، مثال: +970 59 000 0000",
      password: "كلمة المرور",
      passwordHint: "8 أحرف على الأقل، وتحتوي على حرف إنجليزي كبير ورقم ورمز خاص.",
      passwordRequirementLength: "8 أحرف على الأقل",
      passwordRequirementUppercase: "حرف إنجليزي كبير",
      passwordRequirementNumber: "رقم واحد على الأقل",
      passwordRequirementSymbol: "رمز خاص واحد على الأقل",
      passwordStrong: "كلمة مرور قوية",
      confirmPassword: "تأكيد كلمة المرور",
      showPassword: "إظهار كلمة المرور",
      hidePassword: "إخفاء كلمة المرور",
      agreeTo: "أوافق على",
      termsAndConditions: "الشروط والأحكام",
      and: "و",
      privacyPolicy: "سياسة الخصوصية",
      createCustomerAccount: "إنشاء حساب العميل",
      or: "أو",
      continueWithGoogle: "التسجيل باستخدام Google",
      continueWithGoogleAndComplete: "المتابعة باستخدام Google",
      continueWithApple: "المتابعة باستخدام Apple",
      optional: "اختياري",
      skills: "المهارات والتخصصات",
      skillsHint: "مثال: تصميم شعارات، رسومات رقمية، تايبوجرافي.",
      portfolioUrl: "رابط معرض الأعمال",
      portfolioHint: "أضف رابط Behance أو Dribbble أو موقعك الشخصي.",
      designerPhoto: "الصورة الشخصية للمصمم",
      uploadDesignerPhoto: "ارفع صورتك الشخصية",
      dragOrBrowse: "اسحب الصورة هنا أو اضغط للاختيار",
      removeImage: "حذف الصورة",
      imageUploadHint: "PNG أو JPG أو WEBP، وبحجم لا يتجاوز 5MB.",
      createDesignerAccount: "إنشاء حساب المصمم",
      designerApprovalNote: "بعد إرسال الطلب، ينتقل الحساب إلى مرحلة مراجعة الإدارة.",
      printerName: "اسم المطبعة",
      whatsappNumber: "رقم الهاتف المرتبط بواتساب",
      whatsappHint: "سيستخدم هذا الرقم لاستقبال إشعارات الطلبات.",
      printerAddress: "عنوان المطبعة",
      openingTime: "بداية الدوام",
      closingTime: "نهاية الدوام",
      printerLogo: "شعار المطبعة",
      uploadPrinterLogo: "ارفع شعار المطبعة",
      printerLicense: "ترخيص المطبعة",
      printerLicenseDescription: "ارفع نسخة واضحة من ترخيص المطبعة لمراجعة طلب التسجيل.",
      uploadPrinterLicense: "رفع ترخيص المطبعة",
      noFileSelected: "لم يتم اختيار ملف",
      documentUploadHint: "PDF أو JPG أو PNG، بحد أقصى 8MB.",
      printingServices: "خدمات الطباعة المتاحة",
      printingServicesDescription: "اختر المنتجات التي تستطيع المطبعة تنفيذها. يمكنك اختيار أكثر من خدمة.",
      serviceTshirts: "تيشيرتات",
      serviceHoodies: "هوديز",
      serviceMugs: "أكواب",
      serviceBags: "حقائب",
      serviceCaps: "قبعات",
      serviceNotebooks: "دفاتر",
      servicePaperProducts: "ورقيات",
      serviceStickers: "ملصقات",
      servicePosters: "بوسترات",
      submitPrinterRequest: "إرسال طلب تسجيل المطبعة",
      printerApprovalNote: "سيتم حفظ الطلب بحالة «قيد المراجعة» حتى تعتمد الإدارة الحساب.",
      printerBusinessSection: "بيانات المطبعة",
      printerBusinessSectionDescription: "المعلومات الأساسية ووسائل التواصل الخاصة بالمطبعة.",
      printerHoursSection: "أوقات العمل",
      printerHoursSectionDescription: "حدد وقت بداية الدوام ونهايته لاستقبال الطلبات.",
      printerSecuritySection: "بيانات تسجيل الدخول",
      printerSecuritySectionDescription: "أنشئ كلمة مرور قوية وآمنة لحساب المطبعة.",
      printerFilesSection: "الشعار والترخيص",
      printerFilesSectionDescription: "أضف شعار المطبعة وارفع نسخة واضحة من الترخيص.",
      printerServicesSection: "خدمات الطباعة",
      printerServicesSectionDescription: "اختر كل المنتجات التي تستطيع المطبعة تنفيذها.",
      printerSubmitSection: "مراجعة الطلب وإرساله",
      sectionErrorCount: "أخطاء: {count}",
      goToLogin: "الانتقال إلى تسجيل الدخول",
      allRightsReserved: "جميع الحقوق محفوظة.",
      uploadedDesignerImageAlt: "معاينة الصورة الشخصية للمصمم",
      uploadedPrinterLogoAlt: "معاينة شعار المطبعة",

      requiredField: "هذا الحقل مطلوب.",
      invalidName: "يرجى إدخال اسم صحيح من 3 أحرف على الأقل.",
      invalidEmail: "يرجى إدخال بريد إلكتروني صحيح.",
      invalidPhone: "يرجى إدخال رقم هاتف صحيح مع مفتاح الدولة.",
      weakPassword: "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل، وأن تحتوي على حرف إنجليزي كبير ورقم.",
      passwordSubmitError: "⚠️ كلمة المرور غير صحيحة. حاول مجدداً.",
      passwordTooltipTitle: "يجب أن تحتوي كلمة المرور على:",
      passwordTooltipLength: "• 8 أحرف على الأقل",
      passwordTooltipUppercase: "• حرف كبير واحد",
      passwordTooltipNumber: "• رقم واحد",
      passwordMismatch: "كلمتا المرور غير متطابقتين.",
      invalidSkills: "يرجى كتابة نبذة عن مهاراتك لا تقل عن 10 أحرف.",
      invalidUrl: "يرجى إدخال رابط صحيح يبدأ بـ http:// أو https://.",
      invalidAddress: "يرجى إدخال عنوان واضح للمطبعة.",
      invalidWorkingHours: "يجب أن يكون وقت نهاية الدوام بعد وقت البداية.",
      termsRequired: "يجب الموافقة على الشروط والأحكام وسياسة الخصوصية.",
      servicesRequired: "اختر خدمة طباعة واحدة على الأقل.",
      imageTypeError: "نوع الصورة غير مدعوم. استخدم PNG أو JPG أو WEBP.",
      imageSizeError: "حجم الصورة يتجاوز 5MB.",
      documentRequired: "هذا المستند مطلوب.",
      documentTypeError: "نوع الملف غير مدعوم. استخدم PDF أو JPG أو PNG.",
      documentSizeError: "حجم الملف يتجاوز 8MB.",
      requestFailed: "تعذر إرسال الطلب حاليًا. يرجى المحاولة مرة أخرى.",
      googleNotConfigured: "واجهة Google جاهزة، لكنها تحتاج إلى ربط Google OAuth والواجهة الخلفية.",
    },

    en: {
      pageTitle: "Create an Account | PALPRINTS",
      pageDescription: "Create a PALPRINTS account as a customer, designer, or print provider.",
      skipToContent: "Skip to main content",
      headerNavLabel: "Account and interface options",
      alreadyHaveAccount: "Already have an account?",
      signIn: "Sign in",
      languageToggleLabel: "Change language to Arabic",
      themeToggleLabel: "Enable dark mode",
      themeToggleText: "Toggle appearance",
      activateDarkTheme: "Enable dark mode",
      activateLightTheme: "Enable light mode",
      eyebrow: "Start your journey with PALPRINTS",
      registerTitle: "Create a new account",
      registerSubtitle: "Choose the account type that suits you, then complete the required information.",
      onboardingWelcomeTitle: "Welcome to PALPRINTS",
      onboardingWelcomeSubtitle: "Choose the account type that suits you to continue.",
      changeAccountType: "Change account type",
      completeYourDetails: "Complete your details",
      onboardingCustomerTitle: "Create a customer account",
      onboardingDesignerTitle: "Create a designer account",
      onboardingPrinterTitle: "Create a print provider account",
      backToRegistration: "Back to the main registration page",
      chooseAccountType: "Choose an account type",
      roleSelectionDescription: "Choose the path that best fits your goals so we can tailor registration and available services.",
      accountTypesLabel: "Account types",
      customer: "Customer",
      customerDescription: "Request custom designs and print your unique products with ease.",
      designer: "Designer",
      designerDescription: "Showcase your creative work, sell your designs, and earn revenue.",
      printer: "Print provider",
      printerDescription: "Receive print orders and fulfill them with excellent quality and efficiency.",
      visualDefaultTitle: "Turn your ideas into products that feel like you",
      visualDefaultDescription: "Choose the account type that suits you and begin your creative journey.",
      visualCustomerTitle: "Discover designs that express you",
      visualCustomerDescription: "Choose the design you love and print it on the right product with ease.",
      visualDesignerTitle: "Turn your creativity into opportunity",
      visualDesignerDescription: "Showcase your designs, grow your audience, and bring your work to real products.",
      visualPrinterTitle: "Grow your business with new orders",
      visualPrinterDescription: "Receive new printing opportunities suited to your services and grow your business.",
      personalInformation: "Personal information",
      fullName: "Full name",
      email: "Email address",
      gmailAccount: "Email",
      invalidGmail: "Enter a valid address ending in @gmail.com.",
      phoneNumber: "Phone number",
      phoneHint: "Enter the country code, for example: +970 59 000 0000",
      password: "Password",
      passwordHint: "At least 8 characters, including an uppercase letter, a number, and a special symbol.",
      passwordRequirementLength: "At least 8 characters",
      passwordRequirementUppercase: "One uppercase English letter",
      passwordRequirementNumber: "At least one number",
      passwordRequirementSymbol: "At least one special symbol",
      passwordStrong: "Strong password",
      confirmPassword: "Confirm password",
      showPassword: "Show password",
      hidePassword: "Hide password",
      agreeTo: "I agree to the",
      termsAndConditions: "Terms and Conditions",
      and: "and",
      privacyPolicy: "Privacy Policy",
      createCustomerAccount: "Create customer account",
      or: "or",
      continueWithGoogle: "Continue with Google",
      continueWithGoogleAndComplete: "Continue with Google",
      continueWithApple: "Continue with Apple",
      optional: "Optional",
      skills: "Skills and specialties",
      skillsHint: "Example: logo design, digital illustration, typography.",
      portfolioUrl: "Portfolio URL",
      portfolioHint: "Add your Behance, Dribbble, or personal website URL.",
      designerPhoto: "Designer profile image",
      uploadDesignerPhoto: "Upload your profile image",
      dragOrBrowse: "Drag the image here or click to browse",
      removeImage: "Remove image",
      imageUploadHint: "PNG, JPG, or WEBP, up to 5MB.",
      createDesignerAccount: "Create designer account",
      designerApprovalNote: "After submission, the account will move to admin review.",
      printerName: "Print provider name",
      whatsappNumber: "WhatsApp phone number",
      whatsappHint: "This number will receive order notifications.",
      printerAddress: "Print provider address",
      openingTime: "Opening time",
      closingTime: "Closing time",
      printerLogo: "Print provider logo",
      uploadPrinterLogo: "Upload the print provider logo",
      printerLicense: "Print provider license",
      printerLicenseDescription: "Upload a clear copy of the print provider license for registration review.",
      uploadPrinterLicense: "Upload print provider license",
      noFileSelected: "No file selected",
      documentUploadHint: "PDF, JPG, or PNG, up to 8MB.",
      printingServices: "Available printing services",
      printingServicesDescription: "Select the products your print provider can produce. You may select more than one.",
      serviceTshirts: "T-shirts",
      serviceHoodies: "Hoodies",
      serviceMugs: "Mugs",
      serviceBags: "Bags",
      serviceCaps: "Caps",
      serviceNotebooks: "Notebooks",
      servicePaperProducts: "Paper products",
      serviceStickers: "Stickers",
      servicePosters: "Posters",
      submitPrinterRequest: "Submit print provider request",
      printerApprovalNote: "The request will be saved as “Pending review” until the admin approves the account.",
      printerBusinessSection: "Print provider details",
      printerBusinessSectionDescription: "Basic information and contact details for the print provider.",
      printerHoursSection: "Working hours",
      printerHoursSectionDescription: "Set the opening and closing times for receiving orders.",
      printerSecuritySection: "Sign-in details",
      printerSecuritySectionDescription: "Create a strong and secure password for the account.",
      printerFilesSection: "Logo and license",
      printerFilesSectionDescription: "Add the print provider logo and upload a clear license copy.",
      printerServicesSection: "Printing services",
      printerServicesSectionDescription: "Select every product the print provider can produce.",
      printerSubmitSection: "Review and submit",
      sectionErrorCount: "Errors: {count}",
      goToLogin: "Go to sign in",
      allRightsReserved: "All rights reserved.",
      uploadedDesignerImageAlt: "Designer profile image preview",
      uploadedPrinterLogoAlt: "Print provider logo preview",

      requiredField: "This field is required.",
      invalidName: "Enter a valid name with at least 3 characters.",
      invalidEmail: "Enter a valid email address.",
      invalidPhone: "Enter a valid phone number including the country code.",
      weakPassword: "The password must be at least 8 characters and include an uppercase letter and a number.",
      passwordSubmitError: "⚠️ Incorrect password. Please try again.",
      passwordTooltipTitle: "Your password must contain:",
      passwordTooltipLength: "• At least 8 characters",
      passwordTooltipUppercase: "• One uppercase letter",
      passwordTooltipNumber: "• One number",
      passwordMismatch: "The passwords do not match.",
      invalidSkills: "Write a skills summary of at least 10 characters.",
      invalidUrl: "Enter a valid URL beginning with http:// or https://.",
      invalidAddress: "Enter a clear print provider address.",
      invalidWorkingHours: "The closing time must be later than the opening time.",
      termsRequired: "You must accept the Terms and Conditions and Privacy Policy.",
      servicesRequired: "Select at least one printing service.",
      imageTypeError: "Unsupported image type. Use PNG, JPG, or WEBP.",
      imageSizeError: "The image exceeds the 5MB size limit.",
      documentRequired: "This document is required.",
      documentTypeError: "Unsupported file type. Use PDF, JPG, or PNG.",
      documentSizeError: "The file exceeds the 8MB size limit.",
      requestFailed: "The request could not be submitted. Please try again.",
      googleNotConfigured: "The Google interface is ready, but Google OAuth and a back end must be connected.",
    }
  };

  const fieldRules = {
    customer: [
      { id: "customerFullName", rule: "name" },
      { id: "customerEmail", rule: "gmail" },
      { id: "customerPassword", rule: "password" },
      {
        id: "customerPasswordConfirm",
        rule: "confirmPassword",
        matches: "customerPassword"
      }
    ],
    designer: [
      { id: "designerFullName", rule: "name" },
      { id: "designerEmail", rule: "gmail" },
      { id: "designerPassword", rule: "password" },
      {
        id: "designerPasswordConfirm",
        rule: "confirmPassword",
        matches: "designerPassword"
      }
    ],
    printer: [
      { id: "printerName", rule: "name" },
      { id: "printerEmail", rule: "gmail" },
      { id: "printerPassword", rule: "password" },
      {
        id: "printerPasswordConfirm",
        rule: "confirmPassword",
        matches: "printerPassword"
      }
    ]
  };

  const formConfig = {
    customer: {
      formId: "customerForm",
      statusId: "customerFormStatus"
    },
    designer: {
      formId: "designerForm",
      statusId: "designerFormStatus"
    },
    printer: {
      formId: "printerForm",
      statusId: "printerFormStatus"
    }
  };

  const state = {
    language: "ar",
    theme: "light",
    activeRole: "customer"
  };

  const elements = {};

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    cacheElements();
    simplifyRegistrationForms();
    removePasswordGuidance();
    enhanceCoreRegistrationFields();
    loadPreferences();
    applyLanguage(state.language);
    applyTheme(state.theme);
    activateRole(state.activeRole, false);
    clearAccountSelection();
    elements.body.classList.add("role-selection-view");
    updateDefaultVisual();

    bindThemeAndLanguage();
    bindAccountTabs();
    bindPasswordToggles();
    bindFieldInteractions();
    bindForms();
    bindGoogleButtons();
    addAppleButtons();

    const requestedRole = new URLSearchParams(window.location.search).get("role");
    if (["customer", "designer", "printer"].includes(requestedRole)) {
      selectRole(requestedRole);
    }

    updateCurrentYear();

  }

  function simplifyRegistrationForms() {
    const allowedIds = new Set([
      "customerFullName", "customerEmail", "customerPassword", "customerPasswordConfirm",
      "designerFullName", "designerEmail", "designerPassword", "designerPasswordConfirm",
      "printerName", "printerEmail", "printerPassword", "printerPasswordConfirm"
    ]);

    Object.values(formConfig).forEach(({ formId }) => {
      const form = document.getElementById(formId);
      if (!form) return;

      form.querySelectorAll("input, select, textarea").forEach((control) => {
        const keep = control.type === "hidden" || allowedIds.has(control.id);
        if (!keep) {
          control.disabled = true;
          control.required = false;
          control.removeAttribute("aria-required");
        }
      });
    });

    const printerName = document.getElementById("printerName");
    if (printerName) {
      printerName.name = "fullName";
      printerName.autocomplete = "name";
      const label = document.querySelector('label[for="printerName"]');
      if (label) label.dataset.i18n = "fullName";
    }

    ["customerEmail", "designerEmail", "printerEmail"].forEach((id) => {
      const input = document.getElementById(id);
      if (!input) return;
      input.pattern = "^[^\\s@]+@gmail\\.com$";
      const label = document.querySelector(`label[for="${id}"]`);
      if (label) label.dataset.i18n = "gmailAccount";
    });
  }

  function removePasswordGuidance() {
    document.querySelectorAll("[data-password-requirements]").forEach((list) => {
      const input = document.getElementById(list.dataset.passwordRequirements);
      if (input && list.id) {
        const describedBy = (input.getAttribute("aria-describedby") || "")
          .split(/\s+/)
          .filter((id) => id && id !== list.id);

        if (describedBy.length) input.setAttribute("aria-describedby", describedBy.join(" "));
        else input.removeAttribute("aria-describedby");
      }

      list.remove();
    });

    document.querySelectorAll("[data-password-strong], [data-compact-password-helper]")
      .forEach((element) => element.remove());
  }

  function enhanceCoreRegistrationFields() {
    Object.values(fieldRules).flat().forEach((config) => {
      const input = document.getElementById(config.id);
      const floatingField = input?.closest(".floating-field");
      if (!input || !floatingField) return;

      const iconName = config.rule === "password" || config.rule === "confirmPassword"
        ? "lock"
        : "user";

      floatingField.classList.add("has-leading-icon");

      if (!floatingField.querySelector(".field-leading-icon")) {
        const icon = document.createElement("span");
        icon.className = "field-leading-icon";
        icon.setAttribute("aria-hidden", "true");
        icon.innerHTML = `<svg class="icon"><use href="#icon-${iconName}"></use></svg>`;
        floatingField.prepend(icon);
      }

    });
  }

  function addAppleButtons() {
    document.querySelectorAll("[data-google-role]").forEach((googleButton) => {
      if (googleButton.parentElement?.querySelector(`[data-apple-role="${googleButton.dataset.googleRole}"]`)) return;

      const button = document.createElement("button");
      button.className = "google-button apple-button";
      button.type = "button";
      button.dataset.appleRole = googleButton.dataset.googleRole;
      button.innerHTML = '<span class="apple-icon-slot" aria-hidden="true"><img src="assets/icons/apple-logo.svg" alt="" width="20" height="20"></span><span data-i18n="continueWithApple"></span>';
      button.querySelector('[data-i18n="continueWithApple"]').textContent = t("continueWithApple");
      button.addEventListener("click", () => {
        const statusId = formConfig[button.dataset.appleRole]?.statusId;
        if (statusId) setFormStatus(statusId, t("googleNotConfigured"), "info");
      });
      const row = document.createElement("div");
      row.className = "social-auth-row";
      googleButton.insertAdjacentElement("beforebegin", row);
      row.append(googleButton, button);
    });
  }

  function cacheElements() {
    elements.html = document.documentElement;
    elements.body = document.body;
    elements.metaThemeColor = document.querySelector('meta[name="theme-color"]');
    elements.metaDescription = document.querySelector('meta[name="description"]');
    elements.languageToggle = document.getElementById("languageToggle");
    elements.languageToggleText = document.getElementById("languageToggleText");
    elements.themeToggle = document.getElementById("themeToggle");
    elements.tabs = Array.from(document.querySelectorAll('[role="tab"][data-role]'));
    elements.panels = Array.from(document.querySelectorAll('[role="tabpanel"][data-role-panel]'));
    elements.registerCard = document.querySelector(".register-card");
    elements.roleStep = document.querySelector('[data-onboarding-step="role"]');
    elements.formStep = document.querySelector('[data-onboarding-step="form"]');
    elements.formStepTitle = document.querySelector("[data-onboarding-form-title]");
    elements.backButton = document.querySelector("[data-onboarding-back]");
    elements.currentYear = document.getElementById("currentYear");
    elements.visualTitle = document.querySelector("[data-role-visual-title]");
    elements.visualDescription = document.querySelector("[data-role-visual-description]");
  }

  /* ---------------------------------------------------------
     Preferences
     --------------------------------------------------------- */
  function loadPreferences() {
    const savedLanguage = safeStorageGet(STORAGE_KEYS.language);
    const savedTheme = safeStorageGet(STORAGE_KEYS.theme);
    const savedRole = safeStorageGet(STORAGE_KEYS.accountRole);

    state.language = savedLanguage === "en" ? "en" : "ar";

    if (savedTheme === "dark" || savedTheme === "light") {
      state.theme = savedTheme;
    } else {
      state.theme = window.matchMedia?.("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    state.activeRole = ["customer", "designer", "printer"].includes(savedRole)
      ? savedRole
      : "customer";
  }

  function safeStorageGet(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function safeStorageSet(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Storage can be blocked by browser privacy settings.
    }
  }

  /* ---------------------------------------------------------
     Translation
     --------------------------------------------------------- */
  function t(key, replacements = {}) {
    const dictionary = translations[state.language] || translations.ar;
    let value = dictionary[key] ?? translations.ar[key] ?? key;

    Object.entries(replacements).forEach(([name, replacement]) => {
      value = value.replaceAll(`{${name}}`, String(replacement));
    });

    return value;
  }

  function applyLanguage(language) {
    state.language = language === "en" ? "en" : "ar";
    safeStorageSet(STORAGE_KEYS.language, state.language);

    elements.html.lang = state.language;
    elements.html.dir = state.language === "ar" ? "rtl" : "ltr";

    document.title = t("pageTitle");
    if (elements.metaDescription) {
      elements.metaDescription.content = t("pageDescription");
    }

    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.dataset.i18n;

      if (
        element.classList.contains("selected-file-name") &&
        element.dataset.fileSelected === "true"
      ) {
        return;
      }

      element.textContent = t(key);

      if (element.classList.contains("selected-file-name")) {
        element.dataset.emptyText = t("noFileSelected");
      }
    });

    document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
      const key = element.dataset.i18nAriaLabel;
      element.setAttribute("aria-label", t(key));
    });

    if (elements.languageToggleText) {
      elements.languageToggleText.textContent = state.language === "ar" ? "English" : "العربية";
    }

    updateLanguageToggleLabel();
    updateThemeToggleLabel();
    updateVisiblePasswordLabels();
    refreshCurrentValidationMessages();
    if (elements.body.classList.contains("role-selection-view")) {
      updateDefaultVisual();
    } else {
      updateRoleVisual(state.activeRole);
    }
    updateOnboardingTitle(state.activeRole);
  }

  function updateLanguageToggleLabel() {
    if (!elements.languageToggle) return;
    elements.languageToggle.setAttribute("aria-label", t("languageToggleLabel"));
  }

  function bindThemeAndLanguage() {
    elements.languageToggle?.addEventListener("click", () => {
      applyLanguage(state.language === "ar" ? "en" : "ar");
    });

    elements.themeToggle?.addEventListener("click", () => {
      applyTheme(state.theme === "light" ? "dark" : "light");
    });
  }

  /* ---------------------------------------------------------
     Theme
     --------------------------------------------------------- */
  function applyTheme(theme) {
    state.theme = "light";
    safeStorageSet(STORAGE_KEYS.theme, state.theme);

    elements.html.dataset.theme = state.theme;
    elements.body.classList.toggle("dark-mode", state.theme === "dark");

    if (elements.themeToggle) {
      elements.themeToggle.setAttribute(
        "aria-pressed",
        String(state.theme === "dark")
      );
    }

    if (elements.metaThemeColor) {
      elements.metaThemeColor.content = state.theme === "dark" ? "#080b1a" : "#f8faff";
    }

    updateThemeToggleLabel();
  }

  function updateThemeToggleLabel() {
    if (!elements.themeToggle) return;

    const labelKey = state.theme === "dark" ? "activateLightTheme" : "activateDarkTheme";
    elements.themeToggle.setAttribute("aria-label", t(labelKey));
  }

  /* ---------------------------------------------------------
     Accessible account tabs
     --------------------------------------------------------- */
  function bindAccountTabs() {
    elements.tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => selectRole(tab.dataset.role));

      tab.addEventListener("keydown", (event) => {
        const key = event.key;
        let nextIndex = index;

        if (key === "ArrowRight" || key === "ArrowDown") {
          nextIndex = (index + 1) % elements.tabs.length;
        } else if (key === "ArrowLeft" || key === "ArrowUp") {
          nextIndex = (index - 1 + elements.tabs.length) % elements.tabs.length;
        } else if (key === "Home") {
          nextIndex = 0;
        } else if (key === "End") {
          nextIndex = elements.tabs.length - 1;
        } else {
          return;
        }

        event.preventDefault();
        const nextTab = elements.tabs[nextIndex];
        activateRole(nextTab.dataset.role, true);
        nextTab.focus();
      });
    });

    elements.backButton?.addEventListener("click", goBack);
  }

  function selectRole(role) {
    if (!["customer", "designer", "printer"].includes(role)) return;

    activateRole(role, false);
    elements.body.classList.remove("role-selection-view");
    updateOnboardingTitle(role);
    elements.roleStep.setAttribute("hidden", "");
    elements.roleStep.style.display = "none";
    elements.formStep.removeAttribute("hidden");
    elements.formStep.style.setProperty("display", "block", "important");
    elements.formStep.dataset.roleView = role;
    const formPanel = document.querySelector(".auth-form-panel");
    formPanel?.classList.remove("customer-view");
    formPanel?.classList.add("professional-view");
    if (formPanel) formPanel.dataset.activeRole = role;
    elements.formStep.classList.remove("is-entering");
    void elements.formStep.offsetWidth;
    elements.formStep.classList.add("is-entering");

    window.requestAnimationFrame(() => {
      elements.backButton?.focus({ preventScroll: true });
    });
  }

  function goBack() {
    elements.body.classList.add("role-selection-view");
    elements.formStep.setAttribute("hidden", "");
    elements.formStep.style.display = "none";
    elements.roleStep.removeAttribute("hidden");
    elements.roleStep.style.setProperty("display", "block", "important");
    elements.roleStep.classList.remove("is-entering");
    void elements.roleStep.offsetWidth;
    elements.roleStep.classList.add("is-entering");
    const formPanel = document.querySelector(".auth-form-panel");
    formPanel?.classList.remove("customer-view", "professional-view");
    formPanel?.removeAttribute("data-active-role");

    // Returning to Step 1 starts a fresh choice: keep no role visually selected
    // and expose the first card as the keyboard-entry point without checking it.
    clearAccountSelection();
    updateDefaultVisual();

    window.requestAnimationFrame(() => {
      elements.tabs[0]?.focus({ preventScroll: true });
    });
  }

  function clearAccountSelection() {
    elements.tabs.forEach((tab, index) => {
      tab.classList.remove("is-active");
      tab.setAttribute("aria-selected", "false");
      tab.tabIndex = index === 0 ? 0 : -1;
    });
  }

  function updateOnboardingTitle(role = state.activeRole) {
    const roleKey = role.charAt(0).toUpperCase() + role.slice(1);
    if (elements.formStepTitle) {
      elements.formStepTitle.textContent = t(`onboarding${roleKey}Title`);
    }
  }

  window.selectRole = selectRole;
  window.goBack = goBack;

  function activateRole(role, focusPanel = false) {
    if (!["customer", "designer", "printer"].includes(role)) return;

    state.activeRole = role;
    safeStorageSet(STORAGE_KEYS.accountRole, role);

    elements.tabs.forEach((tab) => {
      const isActive = tab.dataset.role === role;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
    });

    elements.panels.forEach((panel) => {
      const isActive = panel.dataset.rolePanel === role;
      panel.hidden = !isActive;
      panel.classList.remove("role-enter");
      if (isActive && focusPanel) {
        void panel.offsetWidth;
        panel.classList.add("role-enter");
      }
    });

    updateRoleVisual(role);
    updateOnboardingTitle(role);

    if (focusPanel) {
      const panel = document.querySelector(`[data-role-panel="${role}"]`);
      const firstField = panel?.querySelector("input:not([type='hidden']), textarea, button");
      window.requestAnimationFrame(() => firstField?.focus({ preventScroll: true }));
    }
  }

  function updateRoleVisual(role) {
    const roleKey = role.charAt(0).toUpperCase() + role.slice(1);
    if (elements.visualTitle) elements.visualTitle.textContent = t(`visual${roleKey}Title`);
    if (elements.visualDescription) elements.visualDescription.textContent = t(`visual${roleKey}Description`);
  }

  function updateDefaultVisual() {
    if (elements.visualTitle) elements.visualTitle.textContent = t("visualDefaultTitle");
    if (elements.visualDescription) elements.visualDescription.textContent = t("visualDefaultDescription");
  }

  /* ---------------------------------------------------------
     Password controls
     --------------------------------------------------------- */
  function bindPasswordToggles() {
    document.querySelectorAll("[data-password-target]").forEach((button) => {
      button.addEventListener("click", () => {
        const input = document.getElementById(button.dataset.passwordTarget);
        if (!input) return;

        const willShow = input.type === "password";
        input.type = willShow ? "text" : "password";
        button.classList.toggle("is-visible", willShow);
        button.setAttribute("aria-label", t(willShow ? "hidePassword" : "showPassword"));
      });
    });
  }

  function bindFieldInteractions() {
    const allRules = Object.values(fieldRules).flat();

    allRules.forEach((config) => {
      const input = document.getElementById(config.id);
      if (!input) return;

      input.addEventListener("focus", () => {
        if (input.dataset.submitAutofocus !== "true") {
          clearFieldValidationState(input);
        }
      });

      input.addEventListener("input", () => {
        clearFieldValidationState(input);

        if (config.rule === "password") {
          const tooltip = input.closest(".password-wrapper")?.querySelector("[data-password-tooltip]");
          if (tooltip) {
            const passesAllRules = updatePasswordTooltipCriteria(input, tooltip);
            setPasswordTooltipVisibility(
              tooltip,
              document.activeElement === input && input.value.length > 0 && !passesAllRules
            );
          }

          const confirmationRule = allRules.find((rule) => rule.matches === config.id);
          const confirmationInput = confirmationRule
            ? document.getElementById(confirmationRule.id)
            : null;
          if (confirmationInput) clearFieldValidationState(confirmationInput);
        }
      });
    });
  }

  function updatePasswordTooltipCriteria(input, tooltip) {
    const checks = {
      length: input.value.length >= 8,
      uppercase: /[A-Z]/.test(input.value),
      number: /[0-9]/.test(input.value)
    };

    tooltip.querySelectorAll("[data-password-criterion]").forEach((criterion) => {
      const isMet = Boolean(checks[criterion.dataset.passwordCriterion]);
      criterion.classList.toggle("is-met", isMet);
      criterion.classList.toggle("is-unmet", !isMet);
    });

    return Object.values(checks).every(Boolean);
  }

  function setPasswordTooltipVisibility(tooltip, visible) {
    tooltip.classList.toggle("show", visible);
    tooltip.setAttribute("aria-hidden", String(!visible));
  }

  function hidePasswordTooltips(scope = document) {
    scope.querySelectorAll("[data-password-tooltip]").forEach((tooltip) => {
      setPasswordTooltipVisibility(tooltip, false);
    });
  }

  function updateVisiblePasswordLabels() {
    document.querySelectorAll("[data-password-target]").forEach((button) => {
      const input = document.getElementById(button.dataset.passwordTarget);
      if (!input) return;
      button.setAttribute("aria-label", t(input.type === "text" ? "hidePassword" : "showPassword"));
    });
  }

  /* ---------------------------------------------------------
     Submit-only validation
     --------------------------------------------------------- */
  function validateField(config) {
    const input = document.getElementById(config.id);
    if (!input) return true;

    const value = input.value.trim();
    let error = "";

    switch (config.rule) {
      case "name":
        if (!value) error = t("requiredField");
        else if (value.length < 3) error = t("invalidName");
        break;

      case "gmail":
        if (!value) error = t("requiredField");
        else if (!/^[^\s@]+@gmail\.com$/i.test(value)) error = t("invalidGmail");
        break;

      case "password":
        if (!value) error = t("requiredField");
        else if (!isStrongPassword(value)) error = t("weakPassword");
        break;

      case "confirmPassword": {
        const password = document.getElementById(config.matches)?.value ?? "";
        if (!value) error = t("requiredField");
        else if (value !== password) error = t("passwordMismatch");
        break;
      }

      default:
        if (input.required && !value) error = t("requiredField");
    }

    setFieldError(input, error);
    return !error;
  }

  function setFieldError(input, message) {
    const errorElement = document.getElementById(`${input.id}Error`);
    const fieldGroup = input.closest(".field-group");
    const passwordWrapper = input.closest(".password-wrapper");
    const isPasswordWarning = Boolean(passwordWrapper && errorElement?.classList.contains("field-error-message"));
    const hasValue = input.value.trim().length > 0;

    input.setAttribute("aria-invalid", String(Boolean(message)));
    input.classList.toggle("submit-error", Boolean(message));
    fieldGroup?.classList.remove("has-error");
    fieldGroup?.classList.toggle("has-success", !message && hasValue);
    fieldGroup?.classList.toggle("has-password-submit-error", Boolean(isPasswordWarning && message));
    if (errorElement) {
      errorElement.textContent = isPasswordWarning && message
        ? t("passwordSubmitError")
        : message;
      errorElement.hidden = isPasswordWarning ? !message : false;
      errorElement.classList.toggle("is-visible", Boolean(isPasswordWarning && message));
    }

    // Submit errors use only the Printify-style warning beneath the field.
    if (passwordWrapper && message) {
      const tooltip = passwordWrapper.querySelector("[data-password-tooltip]");
      if (tooltip) setPasswordTooltipVisibility(tooltip, false);
    }
  }

  function clearFieldValidationState(input) {
    const errorElement = document.getElementById(`${input.id}Error`);
    const fieldGroup = input.closest(".field-group");

    input.setAttribute("aria-invalid", "false");
    input.classList.remove("submit-error");
    fieldGroup?.classList.remove("has-error", "has-success", "has-password-submit-error");
    if (errorElement) {
      errorElement.textContent = "";
      if (errorElement.classList.contains("field-error-message")) {
        errorElement.hidden = true;
        errorElement.classList.remove("is-visible");
      }
    }
  }

  function validateForm(role) {
    const config = formConfig[role];
    const form = document.getElementById(config.formId);
    if (!form) return false;

    // Do not show validation errors before the first submit attempt.
    clearFormStatus(config.statusId);

    let valid = true;

    fieldRules[role].forEach((fieldConfig) => {
      valid = validateField(fieldConfig) && valid;
    });

    if (!valid) {
      focusFirstInvalid(form);
    }

    return valid;
  }

  function clearFormStatus(statusId) {
    const element = document.getElementById(statusId);
    if (!element) return;
    element.textContent = "";
    element.classList.remove("is-success", "is-error", "is-info");
  }

  function setFormStatus(statusId, message, type = "error") {
    const element = document.getElementById(statusId);
    if (!element) return;

    element.textContent = message;
    element.classList.remove("is-success", "is-error", "is-info");
    element.classList.add(type === "success" ? "is-success" : type === "info" ? "is-info" : "is-error");
  }

  function focusFirstInvalid(form) {
    const firstInvalid = form.querySelector('[aria-invalid="true"]');
    if (!firstInvalid) return;

    // Programmatic submit autofocus must not impersonate user recovery on a
    // password field; the warning remains until a real click or edit occurs.
    if (firstInvalid.closest(".password-wrapper")) {
      firstInvalid.dataset.submitAutofocus = "true";
      firstInvalid.focus({ preventScroll: false });
      queueMicrotask(() => delete firstInvalid.dataset.submitAutofocus);
      return;
    }

    firstInvalid.focus({ preventScroll: false });
  }

  function isStrongPassword(value) {
    const hasUppercase = /[A-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);

    return value.length >= 8 && hasUppercase && hasNumber;
  }

  function refreshCurrentValidationMessages() {
    Object.values(fieldRules).flat().forEach((config) => {
      const input = document.getElementById(config.id);
      if (input?.getAttribute("aria-invalid") === "true") validateField(config);
    });
  }

  /* ---------------------------------------------------------
     Form submission
     --------------------------------------------------------- */
  function bindForms() {
    Object.entries(formConfig).forEach(([role, config]) => {
      const form = document.getElementById(config.formId);
      if (!form) return;

      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        // The typing assistant never competes with submit-time feedback.
        hidePasswordTooltips(form);

        if (!validateForm(role)) return;

        const submitButton = form.querySelector(".submit-button");
        setButtonLoading(submitButton, true);

        try {
          const formData = new FormData(form);
          const response = await submitRegistration(role, formData);
          completeRegistration(role, form, response);
        } catch (error) {
          console.error("PALPRINTS registration error:", error);
          setFormStatus(config.statusId, t("requestFailed"), "error");
        } finally {
          setButtonLoading(submitButton, false);
        }
      });
    });
  }

  function setButtonLoading(button, loading) {
    if (!button) return;
    button.classList.toggle("is-loading", loading);
    button.disabled = loading;
    button.setAttribute("aria-busy", String(loading));
  }

  async function submitRegistration(role, formData) {
    if (!API_CONFIG.register) {
      await delay(850);
      return { ok: true, role, demo: true };
    }

    const response = await fetch(API_CONFIG.register, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Registration request failed with status ${response.status}`);
    }

    return response.json();
  }

  /* ---------------------------------------------------------
     Google registration placeholder
     --------------------------------------------------------- */
  function bindGoogleButtons() {
    document.querySelectorAll("[data-google-role]").forEach((button) => {
      button.addEventListener("click", () => {
        const role = button.dataset.googleRole;

        if (API_CONFIG.googleAuth) {
          const target = new URL(API_CONFIG.googleAuth, window.location.origin);
          target.searchParams.set("role", role);
          window.location.assign(target.toString());
          return;
        }

        const statusId = formConfig[role]?.statusId;
        if (statusId) {
          setFormStatus(statusId, t("googleNotConfigured"), "info");
          document.getElementById(statusId)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      });
    });
  }
  /* ---------------------------------------------------------
     Registration completion and routing
     --------------------------------------------------------- */
  function completeRegistration(role, form, response = {}) {
    const emailInput = form.querySelector('input[type="email"]');
    const email = emailInput?.value.trim() || "";

    if (role === "customer") {
      const loginUrl = new URL(ROUTES.login, window.location.href);
      if (email) loginUrl.searchParams.set("email", email);
      window.location.assign(loginUrl.href);
      return;
    }

    const requestReference =
      response.requestId ||
      response.reference ||
      createRequestReference(role);

    const pendingRegistration = {
      role,
      email,
      status: "pending",
      requestReference,
      submittedAt: new Date().toISOString()
    };

    safeSessionSet(
      STORAGE_KEYS.pendingRegistration,
      JSON.stringify(pendingRegistration)
    );

    const statusUrl = new URL(ROUTES.accountStatus, window.location.href);
    statusUrl.searchParams.set("role", role);
    statusUrl.searchParams.set("status", "pending");
    window.location.assign(statusUrl.href);
  }

  function createRequestReference(role) {
    const prefix = role === "printer" ? "PP" : "DS";
    const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, "");
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${datePart}-${randomPart}`;
  }

  function safeSessionSet(key, value) {
    try {
      window.sessionStorage.setItem(key, value);
    } catch (error) {
      console.warn("PALPRINTS session storage is unavailable:", error);
    }
  }

  /* ---------------------------------------------------------
     Utilities
     --------------------------------------------------------- */
  function updateCurrentYear() {
    if (elements.currentYear) {
      elements.currentYear.textContent = String(new Date().getFullYear());
    }
  }

  function delay(milliseconds) {
    return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
  }
})();
