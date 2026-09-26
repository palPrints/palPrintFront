"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const Core = window.PalProfile;
  if (!Core) return;
  Core.init({ dictionary:{ ar:{ openSidebar:"فتح القائمة الجانبية", closeSidebar:"إغلاق القائمة الجانبية", logoutConfirm:"هل تريد تسجيل الخروج من حسابك؟" }, en:{ openSidebar:"Open sidebar", closeSidebar:"Close sidebar", logoutConfirm:"Do you want to log out?" } } });

  const roles = {
    customer:{ label:"حساب عميل", icon:"bi-person", dashboard:"index.html", dashboardLabel:"متجر PalPrints", dashboardIcon:"bi-shop-window", profile:"custProfile.html", categories:["طلب أو توصيل","الدفع والاسترداد","الحساب والعنوان","مشكلة تقنية"] },
    designer:{ label:"حساب مصمم", icon:"bi-palette", dashboard:"dashboardDesigner.html", dashboardLabel:"لوحة التحكم", dashboardIcon:"bi-grid", profile:"designerProfile.html", categories:["رفع تصميم","مراجعة أو اعتماد تصميم","الأرباح والسحب","الحساب والملف الشخصي","مشكلة تقنية"] },
    printer:{ label:"حساب مطبعة", icon:"bi-printer", dashboard:"dashboardPrintShops.html", dashboardLabel:"لوحة التحكم", dashboardIcon:"bi-grid", profile:"printingProfile.html", categories:["طلب طباعة","إدارة خدمة طباعة","الأرباح والمحفظة","اعتماد المطبعة","مشكلة تقنية"] }
  };
  function resolveRole() {
    const query = new URLSearchParams(location.search).get("role");
    if (roles[query]) return query;
    const source = document.referrer.toLowerCase();
    if (source.includes("custprofile") || source.includes("orders") || source.includes("favorites")) return "customer";
    if (source.includes("printing") || source.includes("printshop")) return "printer";
    const stored = localStorage.getItem("palprints-user-role");
    return roles[stored] ? stored : "designer";
  }
  const role = resolveRole();
  const config = roles[role];
  localStorage.setItem("palprints-user-role", role);
  document.body.dataset.userRole = role;
  const dashboard = document.getElementById("roleDashboardLink");
  dashboard.href = config.dashboard;
  dashboard.querySelector("i").className = "bi " + config.dashboardIcon;
  dashboard.querySelector("span").textContent = config.dashboardLabel;
  document.getElementById("roleProfileLink").href = config.profile;
  document.getElementById("headerProfileLink").href = config.profile;
  document.getElementById("settingsSidebarLink").href = "settings.html?role=" + role;
  document.getElementById("headerSettingsLink").href = "settings.html?role=" + role;
  document.getElementById("supportSidebarLink").href = "support.html?role=" + role;
  document.getElementById("supportLinkLabel").textContent = role === "designer" ? "التواصل مع الدعم الفني" : "الدعم الفني";
  const badge = document.getElementById("supportRoleBadge");
  badge.querySelector("i").className = "bi " + config.icon;
  badge.querySelector("span").textContent = config.label;
  document.querySelectorAll("[data-role-only]").forEach(function (item) { item.hidden = item.dataset.roleOnly !== role; });

  const category = document.getElementById("ticketCategory");
  category.innerHTML = '<option value="">اختر نوع المشكلة</option>' + config.categories.map(function (item) { return '<option>' + item + '</option>'; }).join("");
  if (role === "designer") { document.getElementById("resolvedTicketText").textContent = "استفسار عن مراجعة تصميم"; document.getElementById("orderFaqTitle").textContent = "كيف أتابع مراجعة تصميمي؟"; document.getElementById("orderFaqAnswer").textContent = "يمكنك متابعة حالة التصميم من قسم تصاميمي في القائمة الجانبية."; }
  if (role === "printer") { document.getElementById("resolvedTicketText").textContent = "استفسار عن طلب طباعة"; document.getElementById("orderFaqTitle").textContent = "كيف أتابع طلبات الطباعة؟"; document.getElementById("orderFaqAnswer").textContent = "يمكنك متابعة الطلبات وتحديث حالتها من قسم طلبات الطباعة."; }

  document.getElementById("startChatButton").addEventListener("click", function () { Core.toast("سيتم ربطك بأحد موظفي الدعم الآن.", "info"); });
  const fileInput = document.querySelector(".support-upload input");
  fileInput.addEventListener("change", function () { document.getElementById("attachmentName").textContent = fileInput.files[0] ? fileInput.files[0].name : "اختيار ملف"; });
  const form = document.getElementById("supportTicketForm");
  form.addEventListener("reset", function () { setTimeout(function () { document.getElementById("attachmentName").textContent = "اختيار ملف"; }, 0); });
  form.addEventListener("submit", function (event) { event.preventDefault(); if (!form.reportValidity()) return; Core.toast("تم إرسال طلب الدعم برقم #SUP-1043.", "success"); form.reset(); });
  const dropdowns = [["supportProfileMenuButton","supportProfileMenu"],["supportNotificationMenuButton","supportNotificationMenu"]].map(function (ids) { return { button:document.getElementById(ids[0]), menu:document.getElementById(ids[1]) }; });
  function close(item) { item.button.setAttribute("aria-expanded","false"); item.menu.classList.remove("is-open"); item.menu.hidden = true; }
  dropdowns.forEach(function (item) { item.button.addEventListener("click", function (event) { event.stopPropagation(); const open = item.button.getAttribute("aria-expanded") === "true"; dropdowns.forEach(close); if (!open) { item.button.setAttribute("aria-expanded","true"); item.menu.hidden = false; requestAnimationFrame(function () { item.menu.classList.add("is-open"); }); } }); item.menu.addEventListener("click", function (event) { event.stopPropagation(); }); });
  document.addEventListener("click", function () { dropdowns.forEach(close); });
  document.addEventListener("keydown", function (event) { if (event.key === "Escape") dropdowns.forEach(close); });
});
