/* =========================================================
   PALPRINTS Authentication Flow
   Forgot password -> OTP -> Reset password -> Login
   Account status (designer / printer)
   Vanilla JavaScript only
   ========================================================= */

(() => {
  "use strict";

  const API_CONFIG = Object.freeze({
    forgotPassword: "",
    verifyOtp: "",
    resetPassword: "",
    resendOtp: ""
  });

  const STORAGE_KEYS = Object.freeze({
    language: "palprints-language",
    theme: "palprints-theme",
    recoveryEmail: "palprints-recovery-email",
    pendingRegistration: "palprints-pending-registration"
  });

  const page = document.body.dataset.authFlow || "";
  const html = document.documentElement;

  const translations = {
    ar: {
      skipToContent: "انتقل إلى المحتوى الرئيسي",
      headerNavLabel: "خيارات الواجهة",
      languageToggleLabel: "تغيير اللغة إلى الإنجليزية",
      themeToggleText: "تبديل المظهر",
      activateDarkTheme: "تفعيل الوضع الليلي",
      activateLightTheme: "تفعيل الوضع الفاتح",
      allRightsReserved: "جميع الحقوق محفوظة.",
      email: "البريد الإلكتروني",
      backToLogin: "العودة إلى تسجيل الدخول",
      visualKicker: "PALPRINTS",
      requiredField: "هذا الحقل مطلوب.",
      invalidEmail: "يرجى إدخال بريد إلكتروني صحيح.",
      requestFailed: "تعذر إكمال الطلب حاليًا. حاول مرة أخرى.",
      pageForgotTitle: "نسيت كلمة المرور؟",
      pageForgotSubtitle: "أدخل البريد الإلكتروني المرتبط بحسابك وسنرسل لك رمز تحقق.",
      forgotEyebrow: "استعادة الحساب",
      forgotVisualTitle: "مساحة تجمع الإبداع والطباعة",
      forgotVisualDescription: "اكتشف عالمًا تتحول فيه التصاميم إلى منتجات حقيقية.",
      sendCode: "إرسال رمز التحقق",
      codeSent: "تم إرسال رمز التحقق. تحقق من بريدك الإلكتروني.",
      pageOtpTitle: "أدخل رمز التحقق",
      pageOtpSubtitle: "أدخل الرمز المكوّن من 6 أرقام الذي أرسلناه إلى بريدك الإلكتروني.",
      otpEyebrow: "التحقق الأمني",
      otpVisualTitle: "تحقق سريع قبل تغيير كلمة المرور",
      otpVisualDescription: "رمز تحقق قصير يحمي حسابك قبل السماح بإنشاء كلمة مرور جديدة.",
      otpGroupLabel: "رمز التحقق المكون من ستة أرقام",
      verifyCode: "تحقق من الرمز",
      invalidOtp: "أدخل رمز التحقق المكوّن من 6 أرقام.",
      didNotReceive: "لم يصلك الرمز؟",
      resendCode: "إعادة الإرسال",
      resendIn: "إعادة الإرسال خلال {seconds} ث",
      codeResent: "تم إرسال رمز جديد إلى بريدك الإلكتروني.",
      changeEmail: "تغيير البريد الإلكتروني",
      sentTo: "تم إرسال الرمز إلى {email}",
      pageResetTitle: "إعادة تعيين كلمة المرور",
      pageResetSubtitle: "اختر كلمة مرور قوية لم تستخدمها سابقًا لهذا الحساب.",
      resetEyebrow: "كلمة مرور جديدة",
      resetVisualTitle: "أفكارك تستحق أن تصبح حقيقة",
      resetVisualDescription: "في PALPRINTS، نربط الإبداع بالمنتجات والطباعة في مكان واحد.",
      newPassword: "كلمة المرور الجديدة",
      confirmPassword: "تأكيد كلمة المرور",
      ruleLength: "8 أحرف",
      ruleUppercase: "A-Z",
      ruleNumber: "رقم",
      ruleSymbol: "رمز",
      passwordStrong: "كلمة مرور قوية",
      weakPassword: "يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل وحرف إنجليزي كبير ورقم ورمز خاص.",
      passwordsMismatch: "كلمتا المرور غير متطابقتين.",
      savePassword: "حفظ كلمة المرور الجديدة",
      passwordUpdated: "تم تغيير كلمة المرور بنجاح. سيتم نقلك إلى تسجيل الدخول.",
      showPassword: "إظهار كلمة المرور",
      hidePassword: "إخفاء كلمة المرور",
      accountType: "نوع الحساب",
      requestReference: "رقم الطلب",
      browseAsGuest: "تصفح المنصة كزائر",
      login: "تسجيل الدخول",
      pendingEyebrow: "حالة الحساب",
      pendingTitle: "بانتظار مراجعة حسابك",
      pendingDescription: "تم استلام طلبك بنجاح، ويقوم فريق PALPRINTS الآن بمراجعة بيانات حسابك.",
      pendingNowTitle: "ماذا يحدث الآن؟",
      pendingDesignerNow: "نراجع بيانات ملف المصمم قبل تفعيل صلاحيات عرض وبيع التصاميم.",
      pendingPrinterNow: "نراجع بيانات المطبعة والترخيص قبل تفعيل حساب شريك الطباعة.",
      pendingGenericNow: "نراجع البيانات المرسلة للتأكد من جاهزية الحساب قبل تفعيل الصلاحيات.",
      pendingNext: "سنرسل لك إشعارًا عبر البريد الإلكتروني عند اكتمال المراجعة أو إذا احتجنا معلومات إضافية.",
      approvedEyebrow: "تم اعتماد الحساب",
      approvedTitle: "حسابك أصبح جاهزًا",
      approvedDescription: "تم اعتماد حسابك. يمكنك الآن تسجيل الدخول والوصول إلى لوحة التحكم المناسبة لدورك.",
      approvedNowTitle: "تمت المراجعة بنجاح",
      approvedNow: "اكتملت مراجعة بيانات الحساب وتم تفعيل الصلاحيات المرتبطة بنوع حسابك.",
      approvedNext: "سجّل الدخول للبدء باستخدام حسابك في PALPRINTS.",
      rejectedEyebrow: "تحديث على طلب الحساب",
      rejectedTitle: "يحتاج طلبك إلى تعديل",
      rejectedDescription: "تعذر اعتماد الطلب بصورته الحالية. يمكنك مراجعة بيانات التسجيل وتحديث المعلومات المطلوبة.",
      rejectedNowTitle: "ما الخطوة التالية؟",
      rejectedNow: "راجع بيانات الطلب والملاحظات التي يرسلها فريق PALPRINTS، ثم حدّث المعلومات المطلوبة وأعد الإرسال.",
      rejectedNext: "إذا لم تكن الملاحظات واضحة، استخدم رقم الطلب عند التواصل مع الدعم.",
      stepReceived: "تم استلام الطلب",
      stepReview: "قيد المراجعة",
      stepActivated: "تفعيل الحساب",
      updateRequest: "تحديث بيانات الطلب",
      statusProgressLabel: "مراحل مراجعة الحساب",
      designer: "مصمم",
      printer: "مطبعة",
      unknownRole: "حساب",
      noReference: "غير متوفر"
    },
    en: {
      skipToContent: "Skip to main content",
      headerNavLabel: "Interface options",
      languageToggleLabel: "Switch language to Arabic",
      themeToggleText: "Toggle appearance",
      activateDarkTheme: "Enable dark mode",
      activateLightTheme: "Enable light mode",
      allRightsReserved: "All rights reserved.",
      email: "Email address",
      backToLogin: "Back to login",
      visualKicker: "PALPRINTS",
      requiredField: "This field is required.",
      invalidEmail: "Enter a valid email address.",
      requestFailed: "We couldn't complete the request right now. Please try again.",
      pageForgotTitle: "Forgot your password?",
      pageForgotSubtitle: "Enter the email linked to your account and we'll send you a verification code.",
      forgotEyebrow: "Account recovery",
      forgotVisualTitle: "A space where creativity meets printing",
      forgotVisualDescription: "Discover a world where designs become real products.",
      sendCode: "Send verification code",
      codeSent: "Verification code sent. Check your email.",
      pageOtpTitle: "Enter the verification code",
      pageOtpSubtitle: "Enter the 6-digit code we sent to your email address.",
      otpEyebrow: "Security verification",
      otpVisualTitle: "A quick check before changing your password",
      otpVisualDescription: "A short verification code protects your account before a new password can be created.",
      otpGroupLabel: "Six-digit verification code",
      verifyCode: "Verify code",
      invalidOtp: "Enter the 6-digit verification code.",
      didNotReceive: "Didn't receive the code?",
      resendCode: "Resend",
      resendIn: "Resend in {seconds}s",
      codeResent: "A new code was sent to your email.",
      changeEmail: "Change email",
      sentTo: "Code sent to {email}",
      pageResetTitle: "Reset password",
      pageResetSubtitle: "Choose a strong password you haven't used for this account before.",
      resetEyebrow: "New password",
      resetVisualTitle: "Your ideas deserve to become reality",
      resetVisualDescription: "At PALPRINTS, we connect creativity, products, and printing in one place.",
      newPassword: "New password",
      confirmPassword: "Confirm password",
      ruleLength: "8 characters",
      ruleUppercase: "A-Z",
      ruleNumber: "Number",
      ruleSymbol: "Symbol",
      passwordStrong: "Strong password",
      weakPassword: "Use at least 8 characters with an uppercase English letter, a number, and a special symbol.",
      passwordsMismatch: "Passwords do not match.",
      savePassword: "Save new password",
      passwordUpdated: "Password updated successfully. Redirecting to login.",
      showPassword: "Show password",
      hidePassword: "Hide password",
      accountType: "Account type",
      requestReference: "Request reference",
      browseAsGuest: "Browse the platform as a guest",
      login: "Sign in",
      pendingEyebrow: "Account status",
      pendingTitle: "Your account is awaiting review",
      pendingDescription: "Your request was received successfully, and the PALPRINTS team is now reviewing your account details.",
      pendingNowTitle: "What's happening now?",
      pendingDesignerNow: "We're reviewing your designer profile before enabling permissions to publish and sell designs.",
      pendingPrinterNow: "We're reviewing the printer details and license before enabling the printing-partner account.",
      pendingGenericNow: "We're reviewing the submitted details before enabling account permissions.",
      pendingNext: "We'll email you when the review is complete or if we need any additional information.",
      approvedEyebrow: "Account approved",
      approvedTitle: "Your account is ready",
      approvedDescription: "Your account has been approved. You can now sign in and access the dashboard for your role.",
      approvedNowTitle: "Review completed",
      approvedNow: "Your account details have been reviewed and the permissions for your account type are now active.",
      approvedNext: "Sign in to start using your PALPRINTS account.",
      rejectedEyebrow: "Account request update",
      rejectedTitle: "Your request needs an update",
      rejectedDescription: "The request couldn't be approved as submitted. You can review the registration details and update the required information.",
      rejectedNowTitle: "What should you do next?",
      rejectedNow: "Review your request details and any notes sent by the PALPRINTS team, then update the required information and resubmit.",
      rejectedNext: "If the notes aren't clear, use the request reference when contacting support.",
      stepReceived: "Request received",
      stepReview: "Under review",
      stepActivated: "Account activation",
      updateRequest: "Update request details",
      statusProgressLabel: "Account review stages",
      designer: "Designer",
      printer: "Printer",
      unknownRole: "Account",
      noReference: "Not available"
    }
  };

  let language = safeGet(STORAGE_KEYS.language) || "ar";
  if (!translations[language]) language = "ar";

  function t(key, vars = {}) {
    let text = translations[language][key] ?? translations.ar[key] ?? key;
    Object.entries(vars).forEach(([name, value]) => {
      text = text.replaceAll(`{${name}}`, String(value));
    });
    return text;
  }

  function safeGet(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  }

  function safeSet(key, value) {
    try { localStorage.setItem(key, value); } catch { /* no-op */ }
  }

  function sessionGet(key) {
    try { return sessionStorage.getItem(key); } catch { return null; }
  }

  function sessionSet(key, value) {
    try { sessionStorage.setItem(key, value); } catch { /* no-op */ }
  }

  function applyLanguage() {
    html.lang = language;
    html.dir = language === "ar" ? "rtl" : "ltr";

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      if (translations[language][key]) el.textContent = t(key);
    });

    document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
      const key = el.dataset.i18nAriaLabel;
      if (translations[language][key]) el.setAttribute("aria-label", t(key));
    });

    const toggleText = document.getElementById("languageToggleText");
    if (toggleText) toggleText.textContent = language === "ar" ? "English" : "العربية";

    applyPageCopy();
    updatePasswordToggleLabels();
    renderOtpEmail();
    renderAccountStatus();
  }

  function applyPageCopy() {
    const map = {
      "forgot-password-page": {
        heading: "pageForgotTitle", subtitle: "pageForgotSubtitle", eyebrow: "forgotEyebrow",
        visualTitle: "forgotVisualTitle", visualDescription: "forgotVisualDescription"
      },
      "verify-otp-page": {
        heading: "pageOtpTitle", subtitle: "pageOtpSubtitle", eyebrow: "otpEyebrow",
        visualTitle: "otpVisualTitle", visualDescription: "otpVisualDescription"
      },
      "reset-password-page": {
        heading: "pageResetTitle", subtitle: "pageResetSubtitle", eyebrow: "resetEyebrow",
        visualTitle: "resetVisualTitle", visualDescription: "resetVisualDescription"
      }
    };
    const cfg = map[page];
    if (!cfg) return;
    const heading = document.querySelector(".auth-flow-heading h1");
    const subtitle = document.querySelector(".auth-flow-heading .register-subtitle");
    const eyebrow = document.querySelector(".auth-flow-heading .eyebrow");
    const visualTitle = document.querySelector(".auth-visual-copy h2");
    const visualDescription = document.querySelector(".auth-visual-description");
    if (heading) heading.textContent = t(cfg.heading);
    if (subtitle) subtitle.textContent = t(cfg.subtitle);
    if (eyebrow) eyebrow.textContent = t(cfg.eyebrow);
    if (visualTitle) visualTitle.textContent = t(cfg.visualTitle);
    if (visualDescription) visualDescription.textContent = t(cfg.visualDescription);
  }

  function bindLanguage() {
    document.getElementById("languageToggle")?.addEventListener("click", () => {
      language = language === "ar" ? "en" : "ar";
      safeSet(STORAGE_KEYS.language, language);
      applyLanguage();
    });
  }

  function applyTheme(theme) {
    theme = "light";
    html.dataset.theme = theme;
    document.body.classList.remove("dark-mode");
    safeSet(STORAGE_KEYS.theme, theme);
    const button = document.getElementById("themeToggle");
    if (button) {
      button.setAttribute("aria-pressed", String(theme === "dark"));
      button.setAttribute("aria-label", theme === "dark" ? t("activateLightTheme") : t("activateDarkTheme"));
    }
  }

  function bindTheme() {
    const saved = safeGet(STORAGE_KEYS.theme);
    const initial = saved === "dark" || saved === "light"
      ? saved
      : (window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    applyTheme(initial);
    document.getElementById("themeToggle")?.addEventListener("click", () => {
      applyTheme(html.dataset.theme === "dark" ? "light" : "dark");
    });
  }

  function setStatus(message, type = "info") {
    const status = document.getElementById("flowStatus");
    if (!status) return;
    status.textContent = message;
    status.className = `form-status is-${type}`;
    status.style.display = message ? "block" : "none";
  }

  function setLoading(button, loading) {
    if (!button) return;
    button.disabled = loading;
    button.classList.toggle("is-loading", loading);
    button.setAttribute("aria-busy", String(loading));
  }

  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function recoveryEmail() {
    const params = new URLSearchParams(location.search);
    return params.get("email") || sessionGet(STORAGE_KEYS.recoveryEmail) || "";
  }

  async function fakeDelay(ms = 650) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function bindForgotPassword() {
    const form = document.getElementById("forgotPasswordForm");
    if (!form) return;
    const email = document.getElementById("recoveryEmail");
    const error = document.getElementById("recoveryEmailError");
    const fromQuery = recoveryEmail();
    if (fromQuery) email.value = fromQuery;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      error.textContent = "";
      setStatus("");
      const value = email.value.trim();
      if (!value) { error.textContent = t("requiredField"); email.focus(); return; }
      if (!validEmail(value)) { error.textContent = t("invalidEmail"); email.focus(); return; }

      const button = form.querySelector(".submit-button");
      setLoading(button, true);
      try {
        if (API_CONFIG.forgotPassword) {
          const response = await fetch(API_CONFIG.forgotPassword, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({ email: value })
          });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
        } else {
          await fakeDelay();
        }
        sessionSet(STORAGE_KEYS.recoveryEmail, value);
        setStatus(t("codeSent"), "success");
        setTimeout(() => {
          location.assign(`verify-otp.html?email=${encodeURIComponent(value)}`);
        }, 450);
      } catch (errorObject) {
        console.error(errorObject);
        setStatus(t("requestFailed"), "error");
      } finally {
        setLoading(button, false);
      }
    });
  }

  function renderOtpEmail() {
    const target = document.getElementById("otpEmailTarget");
    if (!target) return;
    const email = recoveryEmail();
    target.textContent = email ? t("sentTo", { email: maskEmail(email) }) : "";
  }

  function maskEmail(email) {
    const [name, domain] = email.split("@");
    if (!domain) return email;
    const visible = name.slice(0, Math.min(2, name.length));
    return `${visible}${"•".repeat(Math.max(3, name.length - visible.length))}@${domain}`;
  }

  function bindOtp() {
    const form = document.getElementById("otpForm");
    if (!form) return;
    const inputs = [...form.querySelectorAll(".otp-digit")];
    const error = document.getElementById("otpError");
    const resend = document.getElementById("resendOtpButton");

    inputs.forEach((input, index) => {
      input.addEventListener("input", () => {
        input.value = input.value.replace(/\D/g, "").slice(-1);
        error.textContent = "";
        if (input.value && inputs[index + 1]) inputs[index + 1].focus();
      });
      input.addEventListener("keydown", (event) => {
        if (event.key === "Backspace" && !input.value && inputs[index - 1]) inputs[index - 1].focus();
        if (event.key === "ArrowLeft" && inputs[index - 1]) inputs[index - 1].focus();
        if (event.key === "ArrowRight" && inputs[index + 1]) inputs[index + 1].focus();
      });
      input.addEventListener("paste", (event) => {
        const digits = event.clipboardData?.getData("text").replace(/\D/g, "").slice(0, 6) || "";
        if (digits.length < 2) return;
        event.preventDefault();
        digits.split("").forEach((digit, digitIndex) => {
          if (inputs[digitIndex]) inputs[digitIndex].value = digit;
        });
        inputs[Math.min(digits.length, 6) - 1]?.focus();
      });
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const code = inputs.map((input) => input.value).join("");
      error.textContent = "";
      setStatus("");
      if (!/^\d{6}$/.test(code)) {
        error.textContent = t("invalidOtp");
        inputs.find((input) => !input.value)?.focus() || inputs[0].focus();
        return;
      }
      const button = form.querySelector(".submit-button");
      setLoading(button, true);
      try {
        if (API_CONFIG.verifyOtp) {
          const response = await fetch(API_CONFIG.verifyOtp, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({ email: recoveryEmail(), code })
          });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
        } else {
          await fakeDelay();
        }
        const email = recoveryEmail();
        const query = email ? `?email=${encodeURIComponent(email)}&verified=1` : "?verified=1";
        location.assign(`reset-password.html${query}`);
      } catch (errorObject) {
        console.error(errorObject);
        setStatus(t("requestFailed"), "error");
      } finally {
        setLoading(button, false);
      }
    });

    bindResend(resend);
    setTimeout(() => inputs[0]?.focus(), 120);
  }

  function bindResend(button) {
    if (!button) return;
    const timer = document.getElementById("resendTimer");
    let seconds = 60;
    let interval = null;

    const render = () => {
      button.disabled = seconds > 0;
      if (timer) timer.textContent = seconds > 0 ? `(${seconds})` : "";
    };
    const start = () => {
      clearInterval(interval);
      seconds = 60;
      render();
      interval = setInterval(() => {
        seconds -= 1;
        render();
        if (seconds <= 0) clearInterval(interval);
      }, 1000);
    };

    button.addEventListener("click", async () => {
      if (button.disabled) return;
      button.disabled = true;
      try {
        if (API_CONFIG.resendOtp) {
          const response = await fetch(API_CONFIG.resendOtp, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({ email: recoveryEmail() })
          });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
        } else {
          await fakeDelay(450);
        }
        setStatus(t("codeResent"), "success");
        start();
      } catch (errorObject) {
        console.error(errorObject);
        setStatus(t("requestFailed"), "error");
        button.disabled = false;
      }
    });
    start();
  }

  const passwordRules = {
    length: (value) => value.length >= 8,
    uppercase: (value) => /[A-Z]/.test(value),
    number: (value) => /\d/.test(value),
    symbol: (value) => /[^A-Za-z0-9]/.test(value)
  };

  function passwordValid(value) {
    return Object.values(passwordRules).every((rule) => rule(value));
  }

  function updateRequirements(value, active = true) {
    const list = document.getElementById("passwordRequirements");
    const strong = document.getElementById("passwordStrongMessage");
    if (!list || !strong) return;
    const allMet = passwordValid(value);
    list.classList.toggle("is-visible", active && !allMet);
    list.querySelectorAll("[data-rule]").forEach((item) => {
      const met = passwordRules[item.dataset.rule]?.(value) ?? false;
      item.classList.toggle("is-met", met);
      item.classList.toggle("is-unmet", !met);
    });
    strong.hidden = !(active && allMet);
  }

  function bindPasswordToggles() {
    document.querySelectorAll(".password-toggle").forEach((button) => {
      button.addEventListener("click", () => {
        const input = document.getElementById(button.dataset.passwordTarget);
        if (!input) return;
        const visible = input.type === "text";
        input.type = visible ? "password" : "text";
        button.classList.toggle("is-visible", !visible);
        button.setAttribute("aria-label", !visible ? t("hidePassword") : t("showPassword"));
      });
    });
  }

  function updatePasswordToggleLabels() {
    document.querySelectorAll(".password-toggle").forEach((button) => {
      const input = document.getElementById(button.dataset.passwordTarget);
      if (!input) return;
      button.setAttribute("aria-label", input.type === "text" ? t("hidePassword") : t("showPassword"));
    });
  }

  function bindResetPassword() {
    const form = document.getElementById("resetPasswordForm");
    if (!form) return;
    const password = document.getElementById("newPassword");
    const confirm = document.getElementById("confirmNewPassword");
    const passwordError = document.getElementById("newPasswordError");
    const confirmError = document.getElementById("confirmNewPasswordError");

    const showRules = () => updateRequirements(password.value, true);
    password.addEventListener("focus", showRules);
    password.addEventListener("input", showRules);
    password.addEventListener("change", showRules);

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      passwordError.textContent = "";
      confirmError.textContent = "";
      setStatus("");
      updateRequirements(password.value, true);

      if (!password.value) { passwordError.textContent = t("requiredField"); password.focus(); return; }
      if (!passwordValid(password.value)) { passwordError.textContent = t("weakPassword"); password.focus(); return; }
      if (!confirm.value) { confirmError.textContent = t("requiredField"); confirm.focus(); return; }
      if (password.value !== confirm.value) { confirmError.textContent = t("passwordsMismatch"); confirm.focus(); return; }

      const button = form.querySelector(".submit-button");
      setLoading(button, true);
      try {
        if (API_CONFIG.resetPassword) {
          const response = await fetch(API_CONFIG.resetPassword, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({ email: recoveryEmail(), password: password.value })
          });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
        } else {
          await fakeDelay();
        }
        setStatus(t("passwordUpdated"), "success");
        setTimeout(() => location.assign("login.html?reset=success"), 900);
      } catch (errorObject) {
        console.error(errorObject);
        setStatus(t("requestFailed"), "error");
      } finally {
        setLoading(button, false);
      }
    });
  }

  function renderAccountStatus() {
    if (page !== "account-status-page") return;
    let stored = {};
    try { stored = JSON.parse(sessionGet(STORAGE_KEYS.pendingRegistration) || "{}"); } catch { stored = {}; }
    const params = new URLSearchParams(location.search);
    const role = params.get("role") || stored.role || "";
    const status = params.get("status") || stored.status || "pending";
    const reference = params.get("ref") || stored.requestReference || "";

    const eyebrow = document.getElementById("statusEyebrow");
    const title = document.getElementById("status-title");
    const description = document.getElementById("statusDescription");
    const symbol = document.getElementById("statusSymbol");
    const roleEl = document.getElementById("statusRole");
    const refEl = document.getElementById("statusReference");
    const refRow = document.getElementById("statusReferenceRow");
    const primary = document.getElementById("statusPrimaryAction");
    const nowTitle = document.getElementById("status-now-title");
    const nowDescription = document.getElementById("statusNowDescription");
    const nextNote = document.getElementById("statusNextNote");
    const progress = document.getElementById("statusProgress");
    const stepReceived = document.getElementById("statusStepReceived");
    const stepReview = document.getElementById("statusStepReview");
    const stepActivated = document.getElementById("statusStepActivated");
    const stepReceivedLabel = document.getElementById("statusStepReceivedLabel");
    const stepReviewLabel = document.getElementById("statusStepReviewLabel");
    const stepActivatedLabel = document.getElementById("statusStepActivatedLabel");

    const state = status === "approved" ? "approved" : status === "rejected" ? "rejected" : "pending";
    document.body.dataset.accountStatus = state;
    if (eyebrow) eyebrow.textContent = t(`${state}Eyebrow`);
    if (title) title.textContent = t(`${state}Title`);
    if (description) description.textContent = t(`${state}Description`);
    if (symbol) symbol.textContent = state === "approved" ? "✓" : state === "rejected" ? "!" : "…";
    if (roleEl) roleEl.textContent = role === "designer" ? t("designer") : role === "printer" ? t("printer") : t("unknownRole");
    if (refEl) refEl.textContent = reference || t("noReference");
    if (refRow) refRow.hidden = !reference || !["designer", "printer"].includes(role);

    if (nowTitle) nowTitle.textContent = t(`${state}NowTitle`);
    if (nowDescription) {
      if (state === "pending") {
        nowDescription.textContent = role === "designer" ? t("pendingDesignerNow") : role === "printer" ? t("pendingPrinterNow") : t("pendingGenericNow");
      } else {
        nowDescription.textContent = t(`${state}Now`);
      }
    }
    if (nextNote) nextNote.textContent = t(`${state}Next`);
    if (progress) progress.setAttribute("aria-label", t("statusProgressLabel"));
    if (stepReceivedLabel) stepReceivedLabel.textContent = t("stepReceived");
    if (stepReviewLabel) stepReviewLabel.textContent = t("stepReview");
    if (stepActivatedLabel) stepActivatedLabel.textContent = t("stepActivated");

    [stepReceived, stepReview, stepActivated].forEach((step) => {
      if (step) step.classList.remove("is-complete", "is-current", "is-blocked");
    });
    if (stepReceived) stepReceived.classList.add("is-complete");
    if (state === "approved") {
      if (stepReview) stepReview.classList.add("is-complete");
      if (stepActivated) stepActivated.classList.add("is-complete", "is-current");
    } else if (state === "rejected") {
      if (stepReview) stepReview.classList.add("is-current", "is-blocked");
    } else if (stepReview) {
      stepReview.classList.add("is-current");
    }

    if (primary) {
      primary.hidden = state === "pending";
      if (state === "approved") {
        primary.textContent = t("login");
        primary.href = "login.html";
      } else if (state === "rejected") {
        primary.textContent = t("updateRequest");
        primary.href = role ? `index.html?role=${encodeURIComponent(role)}` : "index.html";
      }
    }
  }

  function setCurrentYear() {
    const year = document.getElementById("currentYear");
    if (year) year.textContent = String(new Date().getFullYear());
  }

  bindTheme();
  bindLanguage();
  bindPasswordToggles();
  bindForgotPassword();
  bindOtp();
  bindResetPassword();
  setCurrentYear();
  applyLanguage();
})();
