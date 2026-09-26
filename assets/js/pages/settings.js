"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const Core = window.PalProfile;
  if (!Core) return;

  Core.init({ dictionary: { ar: { openSidebar:"فتح القائمة الجانبية", closeSidebar:"إغلاق القائمة الجانبية", logoutConfirm:"هل تريد تسجيل الخروج من حسابك؟" }, en: { openSidebar:"Open sidebar", closeSidebar:"Close sidebar", logoutConfirm:"Do you want to log out?" } } });

  const roleConfig = {
    customer: { label:"حساب عميل", icon:"bi-person", dashboard:"index.html", dashboardLabel:"متجر PalPrints", dashboardIcon:"bi-shop-window", profile:"custProfile.html" },
    designer: { label:"حساب مصمم", icon:"bi-palette", dashboard:"dashboardDesigner.html", dashboardLabel:"لوحة التحكم", dashboardIcon:"bi-grid", profile:"designerProfile.html" },
    printer: { label:"حساب مطبعة", icon:"bi-printer", dashboard:"dashboardPrintShops.html", dashboardLabel:"لوحة التحكم", dashboardIcon:"bi-grid", profile:"printingProfile.html" }
  };

  function resolveRole() {
    const queryRole = new URLSearchParams(window.location.search).get("role");
    if (roleConfig[queryRole]) return queryRole;
    const source = document.referrer.toLowerCase();
    if (source.includes("custprofile") || source.includes("orders")) return "customer";
    if (source.includes("printing") || source.includes("printshop")) return "printer";
    const storedRole = window.localStorage.getItem("palprints-user-role");
    if (roleConfig[storedRole]) return storedRole;
    return "designer";
  }

  const role = resolveRole();
  const config = roleConfig[role];
  window.localStorage.setItem("palprints-user-role", role);
  document.body.dataset.userRole = role;

  document.getElementById("roleDashboardLink").href = config.dashboard;
  document.getElementById("roleDashboardLink").querySelector("i").className = "bi " + config.dashboardIcon;
  document.getElementById("roleDashboardLink").querySelector("span").textContent = config.dashboardLabel;
  document.getElementById("roleProfileLink").href = config.profile;
  document.getElementById("headerProfileLink").href = config.profile;
  document.getElementById("supportSidebarLink").href = "support.html?role=" + role;
  const badge = document.getElementById("settingsRoleBadge");
  badge.querySelector("i").className = "bi " + config.icon;
  badge.querySelector("span").textContent = config.label;
  document.getElementById("supportLinkLabel").textContent = role === "designer" ? "التواصل مع الدعم الفني" : "الدعم الفني";
  document.querySelectorAll("[data-role-only]").forEach(function (item) { item.hidden = item.dataset.roleOnly !== role; });

  const roleContent = {
    customer: {
      tab:"العناوين والتوصيل", icon:"bi-geo-alt", title:"العناوين والتوصيل", description:"إدارة بيانات الاستلام والعناوين المحفوظة قبل الدفع.", completion:"75%", name:"أحمد محمد", email:"ahmad@example.com", initials:"أم", status:"حساب فعّال",
      items:[
        ["bi-envelope-check","تفعيل البريد الإلكتروني","تم تأكيد البريد ويمكن استخدام جميع خصائص الحساب.","مكتمل",false],
        ["bi-geo-alt","عنوان التوصيل الافتراضي","أضف عنوانًا صالحًا لاستخدامه مباشرة عند إتمام الطلب.","يحتاج استكمال",true],
        ["bi-telephone","رقم الهاتف","يُستخدم للتواصل بخصوص الطلبات والتوصيل.","مكتمل",false]
      ], note:"وفق متطلبات النظام، يجب اختيار عنوان توصيل صالح قبل الانتقال إلى خطوة الدفع."
    },
    designer: {
      tab:"حالة الاعتماد", icon:"bi-patch-check", title:"اعتماد حساب المصمم", description:"تابع تفعيل البريد وحالة مراجعة حساب المصمم.", completion:"85%", name:"سارة أحمد", email:"sara.design@gmail.com", initials:"سأ", status:"حساب معتمد",
      items:[
        ["bi-envelope-check","تفعيل البريد الإلكتروني","تم تفعيل البريد الإلكتروني بنجاح.","مكتمل",false],
        ["bi-person-check","اعتماد حساب المصمم","تمت مراجعة بياناتك واعتماد الحساب.","معتمد",false],
        ["bi-briefcase","معرض الأعمال والمهارات","بياناتك المهنية ظاهرة للعملاء.","مكتمل",false]
      ], note:"ستصلك إشعارات عند أي تغيير على حالة اعتماد الحساب أو مراجعة التصاميم."
    },
    printer: {
      tab:"حالة الاعتماد", icon:"bi-building-check", title:"اعتماد حساب المطبعة", description:"تابع وثائق المطبعة وحالة طلب التسجيل والاعتماد.", completion:"70%", name:"مطبعة الإبداع", email:"info@creativeprint.ps", initials:"مط", status:"قيد المراجعة",
      items:[
        ["bi-envelope-check","تفعيل البريد الإلكتروني","تم تفعيل بريد المطبعة.","مكتمل",false],
        ["bi-file-earmark-check","وثائق المطبعة","تم رفع الوثائق ويجري التحقق منها.","قيد المراجعة",true],
        ["bi-building-check","اعتماد الحساب","يتم تفعيل خدمات المطبعة بعد موافقة الإدارة.","قيد المراجعة",true]
      ], note:"لن تتاح خصائص المطبعة التشغيلية قبل اعتماد الحساب والوثائق من الإدارة."
    }
  }[role];

  document.getElementById("roleSettingsTab").querySelector("i").className = "bi " + roleContent.icon;
  document.getElementById("roleSettingsTab").querySelector("span").textContent = roleContent.tab;
  document.getElementById("roleSettingsIcon").innerHTML = '<i class="bi ' + roleContent.icon + '"></i>';
  document.getElementById("roleSettingsTitle").textContent = roleContent.title;
  document.getElementById("roleSettingsDescription").textContent = roleContent.description;
  document.querySelector('[name="fullName"]').value = roleContent.name;
  document.querySelector('[name="email"]').value = roleContent.email;
  document.querySelector('[name="username"]').value = { customer:"ahmad.m", designer:"sara.design", printer:"creativeprint.ps" }[role];
  document.getElementById("roleSettingsContent").innerHTML = roleContent.items.map(function (item) {
    return '<div class="settings-requirement"><i class="bi ' + item[0] + '"></i><div><strong>' + item[1] + '</strong><p>' + item[2] + '</p></div><span class="settings-requirement-status' + (item[4] ? ' is-warning' : '') + '">' + item[3] + '</span></div>';
  }).join("") + '<div class="settings-role-note"><i class="bi bi-info-circle"></i><span>' + roleContent.note + '</span></div>';

  const tabs = Array.from(document.querySelectorAll("[data-settings-tab]"));
  const panels = Array.from(document.querySelectorAll("[data-settings-panel]"));
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      const target = tab.dataset.settingsTab;
      tabs.forEach(function (item) { const active = item === tab; item.classList.toggle("active", active); item.setAttribute("aria-selected", String(active)); });
      panels.forEach(function (panel) { const active = panel.dataset.settingsPanel === target; panel.hidden = !active; panel.classList.toggle("active", active); });
    });
  });

  function success(message) { Core.toast(message, "success"); }
  const accountForm = document.getElementById("accountSettingsForm");
  accountForm.addEventListener("submit", function (event) { event.preventDefault(); if (accountForm.reportValidity()) success("تم حفظ معلومات الحساب بنجاح."); });

  const securityForm = document.getElementById("securitySettingsForm");
  securityForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const current = securityForm.elements.currentPassword;
    const password = securityForm.elements.newPassword;
    const confirm = securityForm.elements.confirmPassword;
    const valid = password.value === confirm.value;
    confirm.closest(".profile-field").classList.toggle("has-error", !valid);
    if (!securityForm.reportValidity() || !current.value || !valid) { if (!valid) confirm.focus(); return; }
    success("تم تحديث إعدادات الأمان بنجاح."); securityForm.reset();
  });

  document.getElementById("saveNotificationSettings").addEventListener("click", function () { success("تم حفظ تفضيلات الإشعارات."); });
  document.getElementById("downloadDataButton").addEventListener("click", function () { success("تم إرسال طلب تجهيز نسخة بياناتك."); });

  const languageToggle = document.getElementById("settingsLanguageToggle");
  languageToggle.checked = Core.getLanguage() === "en";
  languageToggle.addEventListener("change", function () { Core.applyLanguage(languageToggle.checked ? "en" : "ar"); });
  Core.onLanguageChange(function (language) { languageToggle.checked = language === "en"; });

  const themeToggle = document.getElementById("settingsThemeToggle");
  themeToggle.checked = document.documentElement.getAttribute("data-bs-theme") === "dark";
  themeToggle.addEventListener("change", function () { Core.applyTheme(themeToggle.checked ? "dark" : "light"); });
  document.getElementById("reduceMotionToggle").addEventListener("change", function (event) { document.body.classList.toggle("reduce-motion", event.target.checked); });

  const deleteDialog = document.getElementById("deleteAccountDialog");
  const deleteButton = document.getElementById("deleteAccountButton");
  const deleteForm = document.getElementById("deleteAccountForm");
  deleteButton.addEventListener("click", function () { deleteDialog.showModal(); window.setTimeout(function () { document.getElementById("deleteConfirmation").focus(); }, 0); });
  document.querySelectorAll("[data-delete-close]").forEach(function (button) { button.addEventListener("click", function () { deleteDialog.close(); }); });
  deleteDialog.addEventListener("click", function (event) { if (event.target === deleteDialog) deleteDialog.close(); });
  deleteForm.addEventListener("submit", function (event) { event.preventDefault(); if (document.getElementById("deleteConfirmation").value.trim() !== "حذف حسابي") { Core.toast("اكتب «حذف حسابي» للتأكيد.", "error"); return; } deleteDialog.close(); Core.toast("تم تأكيد طلب حذف الحساب.", "info"); });

  const dropdowns = [["settingsProfileMenuButton","settingsProfileMenu"],["settingsNotificationMenuButton","settingsNotificationMenu"]].map(function (ids) { return { button:document.getElementById(ids[0]), menu:document.getElementById(ids[1]) }; });
  function closeDropdown(item) { item.button.setAttribute("aria-expanded","false"); item.menu.classList.remove("is-open"); item.menu.hidden = true; }
  dropdowns.forEach(function (item) { item.button.addEventListener("click", function (event) { event.stopPropagation(); const open = item.button.getAttribute("aria-expanded") === "true"; dropdowns.forEach(closeDropdown); if (!open) { item.button.setAttribute("aria-expanded","true"); item.menu.hidden = false; window.requestAnimationFrame(function () { item.menu.classList.add("is-open"); }); } }); item.menu.addEventListener("click", function (event) { event.stopPropagation(); }); });
  document.addEventListener("click", function () { dropdowns.forEach(closeDropdown); });
  document.addEventListener("keydown", function (event) { if (event.key === "Escape") dropdowns.forEach(closeDropdown); });
});
