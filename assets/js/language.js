"use strict";

const LANGUAGE_KEY = "palprints-language";

const translations = {
  ar: {
    home: "الرئيسية",
    designs: "التصاميم",
    products: "المنتجات",
    about: "عن المنصة",
    contact: "تواصل معنا",
    login: "تسجيل الدخول",
    register: "إنشاء حساب"
  },
  en: {
    home: "Home",
    designs: "Designs",
    products: "Products",
    about: "About",
    contact: "Contact",
    login: "Login",
    register: "Create account"
  }
};

function applyLanguage(language) {
  const isArabic = language === "ar";
  document.documentElement.lang = language;
  document.documentElement.dir = isArabic ? "rtl" : "ltr";
  document.body.dir = isArabic ? "rtl" : "ltr";

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (translations[language]?.[key]) element.textContent = translations[language][key];
  });

  document.querySelectorAll("[data-language-label]").forEach((element) => {
    element.textContent = isArabic ? "العربية" : "English";
  });
}

function toggleLanguage() {
  const current = localStorage.getItem(LANGUAGE_KEY) || "ar";
  const next = current === "ar" ? "en" : "ar";
  localStorage.setItem(LANGUAGE_KEY, next);
  applyLanguage(next);
}

document.addEventListener("click", (event) => {
  if (event.target.closest("[data-language-toggle]")) toggleLanguage();
});

document.addEventListener("componentsLoaded", () => applyLanguage(localStorage.getItem(LANGUAGE_KEY) || "ar"));
applyLanguage(localStorage.getItem(LANGUAGE_KEY) || "ar");
