/* =========================================================
   PALPRINTS Login Page
   Vanilla JavaScript only
   ========================================================= */
(() => {
  "use strict";

  const API_CONFIG = Object.freeze({ login: "", googleAuth: "" });
  const STORAGE_KEYS = Object.freeze({ language: "palprints-language", theme: "palprints-theme" });
  const html = document.documentElement;
  let language = safeGet(STORAGE_KEYS.language) || "ar";

  const translations = {
    ar: {
      skipToContent: "انتقل إلى المحتوى الرئيسي", headerNavLabel: "خيارات الحساب والواجهة",
      needAccount: "ليس لديك حساب؟", createAccount: "إنشاء حساب", languageToggleLabel: "تغيير اللغة إلى الإنجليزية",
      themeToggleText: "تبديل المظهر", activateDarkTheme: "تفعيل الوضع الليلي", activateLightTheme: "تفعيل الوضع الفاتح",
      visualKicker: "منصة الطباعة حسب الطلب", visualTitle: "كل فكرة يمكن أن تصبح شيئًا حقيقيًا",
      visualDescription: "انضم إلى PALPRINTS واكتشف عالمًا يجمع التصميم، الطباعة، والإبداع.",
      visualBenefitsLabel: "مزايا PALPRINTS", visualBenefitOne: "وصول سريع إلى حسابك", visualBenefitTwo: "متابعة الطلبات والحالة",
      visualBenefitThree: "تجربة موحّدة لكل أنواع الحسابات", eyebrow: "مرحبًا بعودتك", loginTitle: "تسجيل الدخول",
      loginSubtitle: "أدخل بيانات حسابك للمتابعة إلى PALPRINTS.", email: "البريد الإلكتروني", password: "كلمة المرور",
      rememberMe: "تذكرني", forgotPassword: "نسيت كلمة المرور؟", signIn: "تسجيل الدخول", or: "أو",
      continueWithGoogle: "المتابعة باستخدام Google", continueWithApple: "المتابعة باستخدام Apple", allRightsReserved: "جميع الحقوق محفوظة.", showPassword: "إظهار كلمة المرور",
      hidePassword: "إخفاء كلمة المرور", requiredField: "هذا الحقل مطلوب.", invalidEmail: "يرجى إدخال بريد إلكتروني صحيح.",
      loginFailed: "تعذر تسجيل الدخول حاليًا. تحقق من البيانات وحاول مرة أخرى.", demoReady: "تم التحقق من النموذج. اربط API تسجيل الدخول لإكمال العملية.",
      passwordResetSuccess: "تم تغيير كلمة المرور بنجاح. يمكنك تسجيل الدخول الآن.", googleNotConfigured: "تسجيل الدخول باستخدام Google غير مربوط بالـ API بعد."
    },
    en: {
      skipToContent: "Skip to main content", headerNavLabel: "Account and interface options",
      needAccount: "Don't have an account?", createAccount: "Create account", languageToggleLabel: "Switch language to Arabic",
      themeToggleText: "Toggle appearance", activateDarkTheme: "Enable dark mode", activateLightTheme: "Enable light mode",
      visualKicker: "Print-on-demand platform", visualTitle: "Every idea can become something real",
      visualDescription: "Join PALPRINTS and discover a world that brings design, printing, and creativity together.",
      visualBenefitsLabel: "PALPRINTS benefits", visualBenefitOne: "Quick access to your account", visualBenefitTwo: "Track orders and status",
      visualBenefitThree: "One experience for every account type", eyebrow: "Welcome back", loginTitle: "Sign in",
      loginSubtitle: "Enter your account details to continue to PALPRINTS.", email: "Email address", password: "Password",
      rememberMe: "Remember me", forgotPassword: "Forgot password?", signIn: "Sign in", or: "or",
      continueWithGoogle: "Continue with Google", continueWithApple: "Continue with Apple", allRightsReserved: "All rights reserved.", showPassword: "Show password",
      hidePassword: "Hide password", requiredField: "This field is required.", invalidEmail: "Enter a valid email address.",
      loginFailed: "Unable to sign in right now. Check your details and try again.", demoReady: "The form is valid. Connect the login API to complete sign-in.",
      passwordResetSuccess: "Your password was changed successfully. You can sign in now.", googleNotConfigured: "Google sign-in is not connected to the API yet."
    }
  };

  if (!translations[language]) language = "ar";
  function t(key) { return translations[language][key] || translations.ar[key] || key; }
  function safeGet(key) { try { return localStorage.getItem(key); } catch { return null; } }
  function safeSet(key, value) { try { localStorage.setItem(key, value); } catch { /* no-op */ } }

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
    updatePasswordToggleLabels();
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

  function bindThemeAndLanguage() {
    const savedTheme = safeGet(STORAGE_KEYS.theme);
    applyTheme(savedTheme === "dark" || savedTheme === "light" ? savedTheme : "light");
    document.getElementById("themeToggle")?.addEventListener("click", () => applyTheme(html.dataset.theme === "dark" ? "light" : "dark"));
    document.getElementById("languageToggle")?.addEventListener("click", () => {
      language = language === "ar" ? "en" : "ar";
      safeSet(STORAGE_KEYS.language, language);
      applyLanguage();
      applyTheme(html.dataset.theme || "light");
    });
  }

  function bindPasswordToggle() {
    document.querySelectorAll(".password-toggle").forEach((button) => {
      button.addEventListener("click", () => {
        const input = document.getElementById(button.dataset.passwordTarget);
        if (!input) return;
        const show = input.type === "password";
        input.type = show ? "text" : "password";
        button.classList.toggle("is-visible", show);
        button.setAttribute("aria-label", show ? t("hidePassword") : t("showPassword"));
      });
    });
  }

  function updatePasswordToggleLabels() {
    document.querySelectorAll(".password-toggle").forEach((button) => {
      const input = document.getElementById(button.dataset.passwordTarget);
      if (input) button.setAttribute("aria-label", input.type === "text" ? t("hidePassword") : t("showPassword"));
    });
  }

  function setStatus(message, type) {
    const status = document.getElementById("loginFormStatus");
    if (!status) return;
    status.textContent = message;
    status.className = `form-status is-${type}`;
    status.style.display = message ? "block" : "none";
  }

  function setLoading(button, loading) {
    button.disabled = loading;
    button.classList.toggle("is-loading", loading);
    button.setAttribute("aria-busy", String(loading));
  }

  function prefillEmailFromQuery() {
    const params = new URLSearchParams(location.search);
    const email = params.get("email") || "";
    const input = document.getElementById("loginEmail");
    if (input && email) input.value = email;
    if (params.get("reset") === "success") setStatus(t("passwordResetSuccess"), "success");
  }

  function bindForm() {
    const form = document.getElementById("loginForm");
    if (!form) return;
    const email = document.getElementById("loginEmail");
    const password = document.getElementById("loginPassword");
    const emailError = document.getElementById("loginEmailError");
    const passwordError = document.getElementById("loginPasswordError");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      emailError.textContent = "";
      passwordError.textContent = "";
      setStatus("", "info");
      const value = email.value.trim();
      if (!value) { emailError.textContent = t("requiredField"); email.focus(); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) { emailError.textContent = t("invalidEmail"); email.focus(); return; }
      if (!password.value) { passwordError.textContent = t("requiredField"); password.focus(); return; }

      const button = form.querySelector(".submit-button");
      setLoading(button, true);
      try {
        if (API_CONFIG.login) {
          const response = await fetch(API_CONFIG.login, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({ email: value, password: password.value, remember: document.getElementById("rememberMe")?.checked || false })
          });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          // Route according to the role returned by your backend here.
        } else {
          await new Promise((resolve) => setTimeout(resolve, 550));
          setStatus(t("demoReady"), "info");
        }
      } catch (error) {
        console.error(error);
        setStatus(t("loginFailed"), "error");
      } finally {
        setLoading(button, false);
      }
    });

    document.getElementById("googleLoginButton")?.addEventListener("click", () => {
      if (API_CONFIG.googleAuth) location.assign(API_CONFIG.googleAuth);
      else setStatus(t("googleNotConfigured"), "info");
    });

    document.getElementById("appleLoginButton")?.addEventListener("click", () => {
      setStatus(t("googleNotConfigured"), "info");
    });
  }

  document.getElementById("currentYear").textContent = String(new Date().getFullYear());
  bindThemeAndLanguage();
  bindPasswordToggle();
  applyLanguage();
  prefillEmailFromQuery();
  bindForm();
})();
