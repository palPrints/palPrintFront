"use strict";

document.addEventListener("componentsLoaded", () => {
  const currentPage = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("[data-page]").forEach((link) => {
    link.classList.toggle("active", link.dataset.page === currentPage);
  });
});

document.addEventListener("submit", (event) => {
  const form = event.target.closest("[data-demo-form]");
  if (!form) return;
  event.preventDefault();

  const toastElement = document.getElementById("demoToast");
  if (toastElement && window.bootstrap) {
    bootstrap.Toast.getOrCreateInstance(toastElement).show();
  } else {
    alert("تم تنفيذ النموذج التجريبي بنجاح");
  }
});
