(function (window, document) {
  "use strict";
  if (document.body.classList.contains("admin-support-inbox-page")) {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
    window.addEventListener("pageshow", function () {
      window.setTimeout(function () { window.scrollTo(0, 0); }, 0);
    });
  }
  function init() {
    var toast = document.getElementById("adminToast");
    var toastTimer;
    function showToast(message) {
      if (!toast) return;
      window.clearTimeout(toastTimer);
      toast.textContent = message;
      toast.classList.add("is-visible");
      toastTimer = window.setTimeout(function () { toast.classList.remove("is-visible"); }, 2800);
    }

    var tabs = Array.from(document.querySelectorAll("[data-settings-tab]"));
    var panels = Array.from(document.querySelectorAll("[data-settings-panel]"));
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var target = tab.dataset.settingsTab;
        tabs.forEach(function (item) { var active = item === tab; item.classList.toggle("active", active); item.setAttribute("aria-selected", String(active)); });
        panels.forEach(function (panel) { panel.hidden = panel.dataset.settingsPanel !== target; });
      });
    });
    document.querySelectorAll("[data-admin-form]").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        if (!form.reportValidity()) return;
        showToast("تم حفظ الإعدادات وتسجيل العملية في سجل النشاط.");
      });
    });
    document.querySelectorAll("[data-toast]").forEach(function (button) {
      button.addEventListener("click", function () { showToast(button.dataset.toast); });
    });

    var supportRequests = Array.from(document.querySelectorAll("[data-support-request]"));
    var requestFilters = Array.from(document.querySelectorAll("[data-request-filter]"));
    var roleFilters = Array.from(document.querySelectorAll("[data-role-filter]"));
    var listStatusFilter = document.getElementById("supportListStatus");
    var requestsEmpty = document.getElementById("supportRequestsEmpty");
    var requestSearch = document.getElementById("dashboardSearch");
    var activeRequestFilter = "all";
    var activeRoleFilter = "all";
    var selectedRequest = supportRequests[0] || null;

    function setText(id, value) { var element = document.getElementById(id); if (element) element.textContent = value; }
    function openSupportRequest(item) {
      if (!item) return;
      selectedRequest = item;
      supportRequests.forEach(function (request) { request.classList.toggle("active", request === item); });
      setText("supportDetailAvatar", item.dataset.initials);
      setText("supportDetailName", item.dataset.name);
      setText("supportDetailRole", item.dataset.roleLabel);
      setText("supportDetailId", item.dataset.id);
      setText("supportDetailCategory", item.dataset.category);
      setText("supportDetailTime", item.dataset.time);
      setText("supportDetailSubject", item.dataset.subject);
      setText("supportMessageSender", item.dataset.name);
      setText("supportDetailMessage", item.dataset.message);
      var email = document.getElementById("supportDetailEmail");
      if (email) { email.textContent = item.dataset.email; email.href = "mailto:" + item.dataset.email; }
      var status = document.getElementById("supportRequestStatus");
      if (status) status.value = item.dataset.status;
      var dialogStatus = document.getElementById("supportDialogStatus");
      if (dialogStatus) { dialogStatus.className = "is-" + item.dataset.status; dialogStatus.textContent = item.dataset.status === "resolved" ? "تم الحل" : item.dataset.status === "open" ? "قيد المعالجة" : "جديدة"; }
      var roleBadge = document.getElementById("supportDetailRole");
      if (roleBadge) roleBadge.className = "request-role is-" + item.dataset.role;
      var unread = item.querySelector(".request-unread");
      if (unread) unread.remove();
      var remaining = document.querySelectorAll(".request-unread").length;
      setText("supportNewCount", remaining);
      setText("supportNavCount", remaining);
      var problemDialog = document.getElementById("supportProblemDialog");
      if (problemDialog && !problemDialog.open && typeof problemDialog.showModal === "function") problemDialog.showModal();
    }
    function filterSupportRequests() {
      var query = requestSearch ? requestSearch.value.trim().toLocaleLowerCase("ar") : "";
      var visible = 0;
      supportRequests.forEach(function (item) {
        var statusValue = listStatusFilter ? listStatusFilter.value : activeRequestFilter;
        var filterMatch = statusValue === "all" || item.dataset.status === statusValue;
        var roleMatch = activeRoleFilter === "all" || item.dataset.role === activeRoleFilter;
        var haystack = [item.dataset.name, item.dataset.subject, item.dataset.category, item.dataset.message].join(" ").toLocaleLowerCase("ar");
        var match = filterMatch && roleMatch && (!query || haystack.includes(query));
        item.hidden = !match;
        if (match) visible += 1;
      });
      if (requestsEmpty) requestsEmpty.hidden = visible !== 0;
    }
    supportRequests.forEach(function (item) { item.addEventListener("click", function () { openSupportRequest(item); }); });
    var supportProblemDialog = document.getElementById("supportProblemDialog");
    var closeSupportDialog = document.getElementById("closeSupportDialog");
    if (closeSupportDialog && supportProblemDialog) closeSupportDialog.addEventListener("click", function () { supportProblemDialog.close(); });
    if (supportProblemDialog) supportProblemDialog.addEventListener("click", function (event) { if (event.target === supportProblemDialog) supportProblemDialog.close(); });
    requestFilters.forEach(function (button) { button.addEventListener("click", function () { activeRequestFilter = button.dataset.requestFilter; requestFilters.forEach(function (item) { item.classList.toggle("active", item === button); }); filterSupportRequests(); }); });
    roleFilters.forEach(function (button) { button.addEventListener("click", function () { activeRoleFilter = button.dataset.roleFilter; roleFilters.forEach(function (item) { item.classList.toggle("active", item === button); }); filterSupportRequests(); }); });
    if (listStatusFilter) listStatusFilter.addEventListener("change", filterSupportRequests);
    if (requestSearch && supportRequests.length) requestSearch.addEventListener("input", filterSupportRequests);
    function syncRequestState(item, statusValue) {
      if (!item) return;
      item.dataset.status = statusValue;
      var unreadMark = item.querySelector(".request-unread");
      if (unreadMark) unreadMark.remove();
      var state = item.querySelector(".request-state");
      var cleanState = item.querySelector(".support-clean-status");
      if (cleanState) {
        cleanState.className = "support-clean-status " + (statusValue === "resolved" ? "is-resolved" : statusValue === "open" ? "is-open" : "is-new");
        cleanState.textContent = statusValue === "resolved" ? "تم الحل" : statusValue === "open" ? "قيد المعالجة" : "جديدة";
        var dialogBadge = document.getElementById("supportDialogStatus");
        if (dialogBadge) { dialogBadge.className = "is-" + statusValue; dialogBadge.textContent = cleanState.textContent; }
        return;
      }
      if (!state) { state = document.createElement("span"); state.className = "request-state"; item.appendChild(state); }
      state.className = "request-state" + (statusValue === "resolved" ? " is-resolved" : "");
      state.textContent = statusValue === "resolved" ? "تم الحل" : statusValue === "open" ? "قيد المعالجة" : "جديدة";
    }
    var supportStatus = document.getElementById("supportRequestStatus");
    if (supportStatus) supportStatus.addEventListener("change", function () { syncRequestState(selectedRequest, supportStatus.value); showToast("تم تحديث حالة المشكلة."); filterSupportRequests(); });
    var resolveRequest = document.getElementById("resolveSupportRequest");
    if (resolveRequest) resolveRequest.addEventListener("click", function () { if (!selectedRequest) return; syncRequestState(selectedRequest, "resolved"); if (supportStatus) supportStatus.value = "resolved"; showToast("تم تحديد المشكلة كمحلولة."); filterSupportRequests(); });
    var supportReplyForm = document.getElementById("supportReplyForm");
    if (supportReplyForm) supportReplyForm.addEventListener("submit", function (event) { event.preventDefault(); var reply = document.getElementById("supportReplyText"); if (!reply || !reply.value.trim()) return; setText("supportPreviousReply", reply.value.trim()); var history = document.getElementById("supportReplyHistory"); if (history) history.hidden = false; syncRequestState(selectedRequest, "open"); if (supportStatus) supportStatus.value = "open"; reply.value = ""; showToast("تم إرسال الرد إلى المستخدم وحفظه في المحادثة."); filterSupportRequests(); });
    var showSupportReply = document.getElementById("showSupportReply");
    var cancelSupportReply = document.getElementById("cancelSupportReply");
    if (showSupportReply && supportReplyForm) showSupportReply.addEventListener("click", function () { supportReplyForm.hidden = false; var reply = document.getElementById("supportReplyText"); if (reply) reply.focus(); });
    if (cancelSupportReply && supportReplyForm) cancelSupportReply.addEventListener("click", function () { supportReplyForm.hidden = true; });

    var ticketButtons = Array.from(document.querySelectorAll("[data-ticket-filter]"));
    var priorityFilter = document.getElementById("priorityFilter");
    var search = document.getElementById("dashboardSearch");
    var rows = Array.from(document.querySelectorAll("[data-ticket-row]"));
    var empty = document.getElementById("ticketsEmpty");
    var activeStatus = "all";
    function filterTickets() {
      var query = search ? search.value.trim().toLocaleLowerCase("ar") : "";
      var priority = priorityFilter ? priorityFilter.value : "all";
      var visible = 0;
      rows.forEach(function (row) {
        var statusMatch = activeStatus === "all" || row.dataset.status === activeStatus;
        var priorityMatch = priority === "all" || row.dataset.priority === priority;
        var searchMatch = !query || (row.dataset.search || row.textContent).toLocaleLowerCase("ar").includes(query);
        row.hidden = !(statusMatch && priorityMatch && searchMatch);
        if (!row.hidden) visible += 1;
      });
      if (empty) empty.hidden = visible !== 0;
    }
    ticketButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        activeStatus = button.dataset.ticketFilter;
        ticketButtons.forEach(function (item) { item.classList.toggle("active", item === button); });
        filterTickets();
      });
    });
    if (priorityFilter) priorityFilter.addEventListener("change", filterTickets);
    if (search && rows.length) search.addEventListener("input", filterTickets);

    var dialog = document.getElementById("ticketDialog");
    var dialogTitle = document.getElementById("ticketDialogTitle");
    var dialogUser = document.getElementById("ticketDialogUser");
    var dialogSubject = document.getElementById("ticketDialogSubject");
    var activeTicketRow = null;
    document.querySelectorAll(".support-action").forEach(function (button) {
      button.addEventListener("click", function () {
        activeTicketRow = button.closest("[data-ticket-row]");
        if (dialogTitle) dialogTitle.textContent = "#" + button.dataset.ticket;
        if (dialogUser) dialogUser.textContent = button.dataset.user || "مستخدم المنصة";
        if (dialogSubject) dialogSubject.textContent = button.dataset.subject || "طلب دعم فني";
        if (dialog && typeof dialog.showModal === "function") dialog.showModal();
      });
    });
    var replyButton = document.getElementById("sendTicketReply");
    if (replyButton) replyButton.addEventListener("click", function (event) {
      var reply = document.getElementById("ticketReply");
      if (!reply || !reply.value.trim()) { event.preventDefault(); reply.focus(); showToast("اكتب ردًا قبل الإرسال."); return; }
      var status = document.getElementById("ticketStatus");
      if (activeTicketRow && status) {
        activeTicketRow.dataset.status = status.value;
        var badge = activeTicketRow.querySelector(".admin-status.is-new, .admin-status.is-progress, .admin-status.is-success");
        if (badge) {
          badge.className = "admin-status " + (status.value === "resolved" ? "is-success" : "is-progress");
          badge.textContent = status.value === "resolved" ? "محلولة" : "قيد المتابعة";
        }
      }
      showToast("تم إرسال الرد وتسجيل الإجراء في سجل النشاط.");
      reply.value = "";
      filterTickets();
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once:true });
  else init();
})(window, document);
