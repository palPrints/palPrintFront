"use strict";

document.addEventListener("DOMContentLoaded", async () => {
  const componentFiles = {
    "main-header": "components/main-header.html",
    "auth-header": "components/auth-header.html",
    "main-footer": "components/main-footer.html",
    "dashboard-sidebar": "components/dashboard-sidebar.html"
  };

  const elements = [...document.querySelectorAll("[data-component]")];

  await Promise.all(elements.map(async (element) => {
    const name = element.dataset.component;
    const path = componentFiles[name];
    if (!path) return;

    try {
      const response = await fetch(path);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      element.innerHTML = await response.text();
    } catch (error) {
      console.error(`تعذر تحميل المكوّن ${name}:`, error);
      element.innerHTML = '<div class="alert alert-danger m-3">تعذر تحميل جزء من الصفحة. شغّل المشروع عبر Live Server.</div>';
    }
  }));

  document.dispatchEvent(new CustomEvent("componentsLoaded"));
});
