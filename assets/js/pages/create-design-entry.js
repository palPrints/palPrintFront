(function initializeCreateDesignEntry(window, document) {
  "use strict";

  const FLOW_ROLE_KEY = "palprintsCreateDesignRoleContext";
  const roleAuth = window.PALPRINTS_ROLE_AUTH;

  async function initialize() {
    if (!roleAuth) return;

    const pageRole = document.body.dataset.roleContext || null;
    const accessPromise = roleAuth.resolve({ contextRole: pageRole });
    document.querySelectorAll("[data-create-design]").forEach(link => {
      link.addEventListener("click", async event => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        const access = await accessPromise;
        if (!access.role) {
          roleAuth.redirectToLogin();
          return;
        }
        try {
          window.sessionStorage.setItem(FLOW_ROLE_KEY, JSON.stringify({
            role: access.role,
            source: access.source,
            updatedAt: new Date().toISOString()
          }));
        } catch (error) {
          // Navigation still works if storage is unavailable.
        }
        window.location.href = link.href;
      });
    });

    const access = await accessPromise;
    roleAuth.debug?.("designer dashboard entry", {
      pageRole,
      resolvedRole: access.role,
      source: access.source
    });
    if (!access.role) {
      roleAuth.redirectToLogin();
      return;
    }

    document.body.dataset.userRole = access.role;
  }

  void initialize();
})(window, document);
