(function publishPalprintsRoleAuth(window, document) {
  "use strict";

  const ROLES = new Set(["customer", "designer"]);
  const DEVELOPMENT_ROLE_KEY = "palprints-user-role";
  const DEBUG_SESSION_KEY = "palprints-role-debug";
  let latestDiagnostics = null;

  function normalizeRole(value) {
    if (typeof value !== "string") return null;
    const role = value.trim().toLowerCase();
    return ROLES.has(role) ? role : null;
  }

  function roleDebugEnabled() {
    const requested = new URLSearchParams(window.location.search).get("debugRole") === "1";
    try {
      if (requested) window.sessionStorage.setItem(DEBUG_SESSION_KEY, "true");
      return requested || window.sessionStorage.getItem(DEBUG_SESSION_KEY) === "true";
    } catch (error) {
      return requested;
    }
  }

  function debug(stage, details) {
    if (!roleDebugEnabled()) return;
    console.info(`[PALPRINTS role] ${stage}`, details);
  }

  function isDevelopmentEnvironment() {
    return window.location.protocol === "file:"
      || ["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname);
  }

  async function readAuthenticatedRole() {
    const provider = window.PALPRINTS_AUTH;
    if (provider) {
      try {
        const user = typeof provider.getCurrentUser === "function"
          ? await provider.getCurrentUser()
          : provider.currentUser || provider.user || null;
        const rawRole = user?.role || provider.role || null;
        const role = normalizeRole(rawRole);
        debug("authenticated provider", { getCurrentUser: user, rawRole, normalizedRole: role });
        return { configured: true, role, rawRole };
      } catch (error) {
        console.error("Unable to resolve the authenticated PALPRINTS user.", error);
        return { configured: true, role: null, error };
      }
    }

    if (document.body.dataset.authenticated === "false") return { configured: true, role: null, rawRole: null };
    const bodyRole = normalizeRole(document.body.dataset.userRole);
    if (bodyRole) {
      debug("server-rendered body role", { bodyUserRole: document.body.dataset.userRole, normalizedRole: bodyRole });
      return { configured: true, role: bodyRole, rawRole: document.body.dataset.userRole };
    }
    debug("authenticated source missing", {
      providerAvailable: false,
      bodyUserRole: document.body.dataset.userRole || null
    });
    return { configured: false, role: null, rawRole: null };
  }

  async function resolve(options = {}) {
    const authenticated = await readAuthenticatedRole();
    const requestedRole = normalizeRole(new URLSearchParams(window.location.search).get("role"));
    let storedRole = null;
    try { storedRole = normalizeRole(window.localStorage.getItem(DEVELOPMENT_ROLE_KEY)); }
    catch (error) { /* Development storage is optional. */ }
    const contextRole = normalizeRole(options.contextRole);

    if (authenticated.configured) {
      const result = { role: authenticated.role, source: "authenticated", development: false };
      latestDiagnostics = {
        providerAvailable: Boolean(window.PALPRINTS_AUTH),
        authenticatedRole: authenticated.role,
        bodyUserRole: document.body.dataset.userRole || null,
        workflowRole: contextRole,
        queryRole: requestedRole,
        localStorageRole: storedRole,
        finalRole: result.role,
        source: result.source
      };
      if (!result.role) {
        console.error("[PALPRINTS role] The authenticated frontend provider is present but did not expose a supported customer/designer role.", latestDiagnostics);
      }
      debug("final resolution", latestDiagnostics);
      return result;
    }

    const development = isDevelopmentEnvironment();
    let result = { role: null, source: "unauthenticated", development };
    if (development && requestedRole) result = { role: requestedRole, source: "development-query", development: true };
    else if (development && contextRole) result = { role: contextRole, source: "development-context", development: true };
    else if (development && storedRole) result = { role: storedRole, source: "development-storage", development: true };
    else {
      const developmentDefault = normalizeRole(options.developmentDefault);
      if (development && developmentDefault) result = { role: developmentDefault, source: "development-default", development: true };
    }
    latestDiagnostics = {
      providerAvailable: Boolean(window.PALPRINTS_AUTH),
      authenticatedRole: null,
      bodyUserRole: document.body.dataset.userRole || null,
      workflowRole: contextRole,
      queryRole: requestedRole,
      localStorageRole: storedRole,
      finalRole: result.role,
      source: result.source
    };
    if (!development) {
      console.error("[PALPRINTS role] No production authenticated role source was exposed. Provide window.PALPRINTS_AUTH.getCurrentUser() or server-render body[data-user-role].", latestDiagnostics);
    }
    debug("final resolution", latestDiagnostics);
    return result;
  }

  function redirectToLogin() {
    const loginUrl = new URL("login.html", window.location.href);
    loginUrl.searchParams.set("returnTo", window.location.pathname + window.location.search + window.location.hash);
    window.location.replace(loginUrl.href);
  }

  function getDiagnostics() { return latestDiagnostics ? { ...latestDiagnostics } : null; }

  window.PALPRINTS_ROLE_AUTH = Object.freeze({ resolve, redirectToLogin, isDevelopmentEnvironment, getDiagnostics, debug });
})(window, document);
