# PALPRINTS Registration System — Technical UI/UX Blueprint

> **Document purpose:** Define the registration experience, its responsive architecture, field model, validation behavior, and deployment constraints.
>
> **Implementation audit:** The active entry point is **`index.html`**, with presentation in **`styles.css`** and interaction logic in **`script.js`**. This blueprint distinguishes the current implementation from production requirements where they differ.

---

## 1. ARCHITECTURAL LAYOUT SUMMARY

### 1.1 Two-step onboarding flow

PALPRINTS uses a progressive onboarding model that asks for the minimum decision first, then reveals the appropriate registration interface.

```text
Registration entry
    │
    ▼
Step 1 — Select account type
    ├── العميل   / Customer
    ├── المصمم   / Designer
    └── المطبعة  / Printing Press
    │
    ▼
Step 2 — Adaptive registration panel
    ├── Customer: social-first hybrid registration
    ├── Designer: creator registration form + social alternatives
    └── Printing Press: business registration form + social alternatives
```

- **Step 1 — Role selection:** Three large, horizontal card modules are stacked vertically. “Horizontal” describes each card’s internal icon-and-copy arrangement; the cards themselves form a vertical list.
- **Step 2 — Adaptive panels:** Selecting a card hides the role-selection state and activates the matching **`.role-panel`**.
- **Back navigation:** The fixed **`.back-to-roles`** control returns the user to Step 1 without reloading the document.
- **Accessible selection model:** Role cards are buttons with tab semantics, **`aria-selected`**, **`aria-controls`**, and keyboard navigation using arrow, Home, and End keys.
- **Stable interaction geometry:** Hover elevation uses transforms and color/shadow changes. Border width remains constant so nearby headings and cards never shift.

### 1.2 Desktop split-screen distribution

The desktop registration shell is a two-column composition:

| Region | Width | Responsibility |
|---|---:|---|
| Form panel | **55% of viewport** | Role selection, registration forms, notices, and actions |
| Product showcase | **45% of viewport** | Fixed ambient PALPRINTS product mockup and supporting visual copy |

The effective desktop grid is:

```css
.auth-layout {
  display: grid;
  grid-template-columns: 55fr 45fr;
  grid-template-areas: "form visual";
  min-height: 100dvh;
}

html[dir="ltr"] .auth-layout {
  grid-template-columns: 45fr 55fr;
  grid-template-areas: "visual form";
}
```

- In **Arabic/RTL**, the form occupies the left 55% and the visual occupies the right 45%.
- In **English/LTR**, the physical sides mirror while preserving the form’s 55% width and the visual’s 45% width.
- The showcase is an **`<aside class="auth-visual-panel">`** with viewport-bound height and clipped ambient artwork.
- At tablet/mobile breakpoints, the showcase is hidden and **`.auth-form-panel`** expands to the full viewport width.

### 1.3 Option A — Scrollable Engine

**Option A is the recommended resilient production layout.** The current final CSS cascade favors a strict no-scroll desktop shell using **`overflow: hidden`**. That can fit the present shortened forms, but it is fragile when copy wraps, browser zoom increases, errors appear, or fields are restored. Option A confines scrolling to the form panel and prevents document-level clipping.

```css
html,
body {
  min-height: 100%;
  margin: 0;
}

body {
  overflow: hidden;
}

.auth-layout {
  height: 100dvh;
  min-height: 100svh;
}

.auth-form-panel {
  height: 100dvh;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  padding-block: 76px 80px;
  scrollbar-gutter: stable;
  overscroll-behavior: contain;
}

.register-card {
  width: min(100%, 560px);
  margin-block: auto;
  flex: 0 0 auto;
}
```

#### Why these rules matter

- **`height: 100dvh`** follows the dynamically available viewport height, including mobile browser chrome changes.
- **`min-height: 0`** permits a grid/flex child to shrink and become internally scrollable instead of overflowing its parent.
- **`display: flex; flex-direction: column`** keeps the card’s vertical alignment intentional while allowing natural content growth.
- **`overflow-y: auto`** creates a scrollbar only when content genuinely exceeds the available panel height.
- **`padding-bottom: 80px`** guarantees a comfortable final safe zone beneath submit/social/legal controls; no action touches or disappears behind the viewport boundary.
- **`scrollbar-gutter: stable`** reserves scrollbar space before it is needed, preventing the brief horizontal jump that occurs when a scrollbar appears during initialization.
- **`flex: 0 0 auto`** prevents the registration card from being compressed to an unreadable height.
- The visual panel remains fixed and ambient while only the form column scrolls.

> **Acceptance rule:** Test Option A at 100%, 125%, and 200% zoom, at 800 px viewport height, with Arabic wrapping, English wrapping, all validation messages visible, and the browser password manager UI active.

---

## 2. DETAILED FIELD & USER-ROLE MATRIX

### 2.1 Effective field matrix

The runtime helper currently simplifies every registration route to four enabled manual fields. Additional legacy fields remain in the HTML but are disabled and removed from required validation.

| Role | Production interaction model | Enabled manual fields in current runtime | Social actions |
|---|---|---|---|
| **العميل / Customer** | Social-first hybrid; manual fallback collapsed by default | Full Name, Email, Password, Confirm Password | Google + Apple |
| **المصمم / Designer** | Full manual creator registration with social alternatives | Full Name, Email, Password, Confirm Password | Google + Apple |
| **المطبعة / Printing Press** | Top-down business account block matching the designer form’s rhythm | Business/Full Name, Email, Password, Confirm Password | Google + Apple |

#### How to read the field specification

Every field is documented by its literal HTML element and attributes—not only by its visual purpose. For example:

```html
<input
  id="customerEmail"
  name="email"
  type="email"
  autocomplete="email"
  placeholder=" "
  required
>
```

This means the email field is an HTML **`<input>`** element whose **`type`** is **`email`**. The browser can therefore expose an email keyboard on mobile and provide email-aware semantics, while PALPRINTS JavaScript remains responsible for submit-only validation.

### 2.2 Customer View — العميل

#### Intended hybrid model

- Make **Google Identity Services** and **Apple Sign-In** the dominant one-click paths.
- Place both providers in the existing **`.social-auth-row`** with equal height, radius, typography, and available text space.
- Keep manual registration available as a secondary fallback inside a collapsed disclosure/accordion.
- Expanding manual registration reveals, in order:
  1. **Full Name** — an HTML **`<input>`** tag with **`type="text"`**.
  2. **Email** — an HTML **`<input>`** tag with **`type="email"`**.
  3. **Password** — an HTML **`<input>`** tag with **`type="password"`**, a visibility **`<button type="button">`**, and a contextual **`<div role="tooltip">`**.
  4. **Confirm Password** — an HTML **`<input>`** tag with **`type="password"`** and a visibility **`<button type="button">`**.

#### Exact customer HTML elements

The customer container is an HTML **`<form>`** tag:

```html
<form id="customerForm" class="register-form" method="post" action="#" novalidate>
  <!-- customer fields and actions -->
</form>
```

| UI control | Literal HTML specification | Purpose |
|---|---|---|
| Full Name | **`<input id="customerFullName" name="fullName" type="text" minlength="3" autocomplete="name" required>`** | Captures the customer’s full name |
| Email | **`<input id="customerEmail" name="email" type="email" autocomplete="email" required>`** | Captures the login email; runtime currently adds a Gmail-only pattern |
| Password | **`<input id="customerPassword" name="password" type="password" minlength="8" autocomplete="new-password" required>`** | Captures the new password and connects to the tooltip/error elements through **`aria-describedby`** |
| Confirm Password | **`<input id="customerPasswordConfirm" name="passwordConfirm" type="password" autocomplete="new-password" required>`** | Confirms that both password values match |
| Password visibility | **`<button type="button" class="field-action password-toggle">`** | Toggles the related input between **`type="password"`** and **`type="text"`** without submitting the form |
| Create account | **`<button type="submit" class="primary-button submit-button">`** | Starts validation and submits the customer form when valid |
| Google continuation | **`<button type="button" class="google-button" data-google-role="customer">`** | Starts Google authentication after GIS is configured |
| Apple continuation | JavaScript-generated **`<button type="button" class="google-button apple-button">`** | Starts Apple authentication after its SDK is configured |

The blank **`placeholder=" "`** value is intentional. It enables the floating-label selector without duplicating visible placeholder text.

#### Current integration status

> **Important:** The UI currently renders Google and Apple buttons, but it does not yet load or initialize the Google Identity Services or Apple authentication SDKs. **`API_CONFIG.googleAuth`** and the registration endpoint are empty; clicks therefore produce a local “not configured” status instead of authenticating a user.

The production implementation must wire:

- Google button → initialized Google Identity Services client.
- Apple button → initialized Sign in with Apple client.
- Provider credential/token → secure backend verification.
- Verified provider profile → PALPRINTS account creation/session endpoint.

The current customer manual fields are also still visible. To satisfy the social-first requirement, wrap them in one semantic collapsible fieldset and preserve keyboard access, labels, autocomplete, and validation when expanded.

### 2.3 Designer View — المصمم

The designer route uses a compact top-down form:

```html
<form
  id="designerForm"
  class="register-form"
  method="post"
  action="#"
  enctype="multipart/form-data"
  novalidate
>
  <!-- designer fields and actions -->
</form>
```

| Order | Field | Literal HTML specification | Core rule |
|---:|---|---|---|
| 1 | Full Name | **`<input id="designerFullName" name="fullName" type="text" minlength="3" autocomplete="name" required>`** | Non-empty human-readable name |
| 2 | Email | **`<input id="designerEmail" name="email" type="email" autocomplete="email" required>`** | Valid email address; runtime currently adds a Gmail-only pattern |
| 3 | Password | **`<input id="designerPassword" name="password" type="password" minlength="8" autocomplete="new-password" required>`** | 8+ characters, one uppercase Latin letter, and one number |
| 4 | Confirm Password | **`<input id="designerPasswordConfirm" name="passwordConfirm" type="password" autocomplete="new-password" required>`** | Exact match with Password |

Designer action elements are:

- **Create designer account:** an HTML **`<button>`** tag with **`type="submit"`**.
- **Show/hide password:** an HTML **`<button>`** tag with **`type="button"`** for each password input.
- **Google:** an HTML **`<button>`** tag with **`type="button"`** and **`data-google-role="designer"`**.
- **Apple:** a JavaScript-generated HTML **`<button>`** tag with **`type="button"`** and **`.apple-button`**.

- Google and Apple remain alternative registration paths below the primary form action.
- Existing portfolio, WhatsApp, and profile-image controls are dormant legacy markup: runtime code disables them and removes their **`required`** attributes.
- If these fields are restored later, they must be documented as a deliberate onboarding phase or deferred profile-completion step—not silently re-enabled in the initial account form.

### 2.4 Printing Press View — المطبعة

The printing-press route intentionally inherits the designer form’s vertical rhythm, width, control height, and primary-action size.

```html
<form
  id="printerForm"
  class="register-form"
  method="post"
  action="#"
  enctype="multipart/form-data"
  novalidate
>
  <!-- printing-press fields and actions -->
</form>
```

| Order | Field | Literal HTML specification | Business interpretation |
|---:|---|---|---|
| 1 | Printing Press Name | **`<input id="printerName" name="printerName" type="text" minlength="3" autocomplete="organization" required>`** | Legal or public-facing business name |
| 2 | Email | **`<input id="printerEmail" name="email" type="email" autocomplete="email" required>`** | Business login/contact email; runtime currently adds a Gmail-only pattern |
| 3 | Password | **`<input id="printerPassword" name="password" type="password" minlength="8" autocomplete="new-password" required>`** | New business-account credential |
| 4 | Confirm Password | **`<input id="printerPasswordConfirm" name="passwordConfirm" type="password" autocomplete="new-password" required>`** | Credential confirmation |

Printing-press action elements are:

- **Submit printing-press request:** an HTML **`<button>`** tag with **`type="submit"`** and classes **`.primary-button.submit-button.printer-submit-button`**.
- **Show/hide password:** an HTML **`<button>`** tag with **`type="button"`** for each password input.
- **Google:** an HTML **`<button>`** tag with **`type="button"`** and **`data-google-role="printer"`**.
- **Apple:** a JavaScript-generated HTML **`<button>`** tag with **`type="button"`** and **`.apple-button`**.

- The source HTML starts with **`name="printerName"`** and **`autocomplete="organization"`**. The runtime currently changes these to **`name="fullName"`** and **`autocomplete="name"`** so the simplified payload matches the other roles.
- Address, WhatsApp, operating hours, logo, license, service selection, and terms controls remain disabled legacy markup.
- Production architecture should collect high-friction business verification details after account creation unless they are legally required during signup.

### 2.5 Dormant HTML input inventory

The following elements physically exist in **`index.html`**, but **`simplifyRegistrationForms()`** currently sets them to **`disabled`** and removes **`required`**. Disabled controls cannot receive interaction and are omitted from native form submission. They are documented here so the blueprint accounts for every input type present in the registration system.

#### Customer dormant elements

| Field | Exact element type | Source attributes |
|---|---|---|
| Account role | HTML **`<input>`** with **`type="hidden"`** | **`name="accountType" value="customer"`**; retained for submission |
| Phone number | HTML **`<input>`** with **`type="tel"`** | **`id="customerPhone" name="phone" inputmode="tel" autocomplete="tel"`** |
| Terms consent | HTML **`<input>`** with **`type="checkbox"`** | **`id="customerTerms" name="terms"`** |

#### Designer dormant elements

| Field | Exact element type | Source attributes |
|---|---|---|
| Account role | HTML **`<input>`** with **`type="hidden"`** | **`name="accountType" value="designer"`**; retained for submission |
| WhatsApp number | HTML **`<input>`** with **`type="tel"`** | **`id="designerWhatsapp" name="whatsappNumber" inputmode="tel" autocomplete="tel"`** |
| Portfolio URL | HTML **`<input>`** with **`type="url"`** | **`id="designerPortfolio" name="portfolioUrl" inputmode="url" autocomplete="url"`** |
| Profile image | HTML **`<input>`** with **`type="file"`** | **`id="designerAvatar" name="profileImage" accept="image/png,image/jpeg,image/webp"`** |
| Terms consent | HTML **`<input>`** with **`type="checkbox"`** | **`id="designerTerms" name="terms"`** |

The designer **`<form>`** uses **`enctype="multipart/form-data"`** because its dormant profile-image input can transmit binary file data if re-enabled.

#### Printing-press dormant elements

| Field | Exact element type | Source attributes |
|---|---|---|
| Account role | HTML **`<input>`** with **`type="hidden"`** | **`name="accountType" value="printer"`**; retained for submission |
| WhatsApp number | HTML **`<input>`** with **`type="tel"`** | **`id="printerWhatsapp" name="whatsappNumber" inputmode="tel" autocomplete="tel"`** |
| Street address | HTML **`<input>`** with **`type="text"`** | **`id="printerAddress" name="address" autocomplete="street-address"`** |
| Opening time | HTML **`<input>`** with **`type="time"`** | **`id="printerOpeningTime" name="openingTime"`** |
| Closing time | HTML **`<input>`** with **`type="time"`** | **`id="printerClosingTime" name="closingTime"`** |
| Printing-press logo | HTML **`<input>`** with **`type="file"`** | **`id="printerLogo" name="printerLogo" accept="image/png,image/jpeg,image/webp"`** |
| Business license | HTML **`<input>`** with **`type="file"`** | **`id="printerLicense" name="printerLicense" accept="application/pdf,image/png,image/jpeg"`** |
| Printing services | Nine HTML **`<input>`** elements with **`type="checkbox"`** | Shared **`name="services"`** with values for T-shirts, hoodies, mugs, bags, caps, notebooks, paper products, stickers, and posters |
| Terms consent | HTML **`<input>`** with **`type="checkbox"`** | **`id="printerTerms" name="terms"`** |

The printing-press **`<form>`** also uses **`enctype="multipart/form-data"`** because the logo and license controls are file inputs.

> **Reactivation rule:** Re-enabling a dormant element requires restoring its JavaScript rule, error message, backend payload contract, localization, accessibility behavior, and responsive layout together. Removing **`disabled`** alone is insufficient.

### 2.6 Text, labels, icons, and bidirectional alignment

#### Floating-label contract

- Inputs use **`placeholder=" "`** as a structural trigger for floating labels; the visible prompt is the associated **`<label>`**, not placeholder copy.
- The label floats when the input is focused or **`:not(:placeholder-shown)`**.
- Every input must retain a real **`id`** and matching label **`for`** value for accessibility.
- UI translations are supplied through **`data-i18n`** keys and refreshed when the language changes.

#### Typography

- Arabic and English UI: **`"Cairo", Arial, sans-serif`**.
- Masked passwords use circular disc rendering; when revealed, the input returns to Cairo.
- Avoid letter spacing on body copy. Role names may use the established **`2.5px`** display treatment where it remains legible in both languages.

#### Icon map

| Control | Current asset/behavior |
|---|---|
| Full-name field | User SVG icon |
| Email field | Currently receives the shared user icon; an envelope icon is recommended for clearer semantics |
| Password / confirmation | Lock SVG icon |
| Password visibility | Eye / eye-off SVG states, borderless and outline-free |
| Google | **`assets/icons/google-g.svg`** |
| Apple | **`assets/icons/apple-logo.svg`** |
| Return to role selection | **`assets/icons/arrow.svg`**, direction mirrored by language |

#### RTL/LTR mechanics

- **`applyLanguage()`** sets both **`lang`** and **`dir`** on the document root.
- Arabic labels and prose align right; English labels and prose align left.
- Email, telephone, and URL values should remain logically LTR using **`direction: ltr`** and **`unicode-bidi: plaintext`**, even inside the Arabic interface.
- Icons must occupy the logical inline-start/end position instead of relying on hard-coded physical left/right offsets.
- The form and showcase swap physical sides in English, and the return arrow moves to the left side of the form while reversing direction.

---

## 3. SMART VALIDATION & INTERACTION SYSTEM

### 3.1 On-Submit Only validation contract

Forms use **`novalidate`** so native browser timing does not produce premature red borders. Validation is managed by JavaScript and must follow this sequence:

```text
Normal field
    │ focus
    ▼
Brand-active border #6366f1 — never red on focus
    │ type / blur
    ▼
Still neutral — no blur-time validation
    │ submit registration
    ├── valid   → submit request
    └── invalid → add .submit-error + aria-invalid="true"
                         │
                         └── next focus/input → clear immediately
```

- Do not use **`:invalid`**, **`:required:invalid`**, or **`:user-invalid`** for error styling.
- Do not validate or display errors on blur.
- On submit, run the role’s **`fieldRules`**, stop submission if any rule fails, and mark only the affected controls.
- **`.submit-error[aria-invalid="true"]`** applies the solid error border.
- Any subsequent **`focus`** or **`input`** event removes **`.submit-error`**, clears **`aria-invalid`**, and hides the field’s submit-only error message immediately.
- There is no aggregate red form banner; errors remain attached to their individual fields.

Recommended state selectors:

```css
.input-field:focus {
  border-color: #6366f1;
}

.input-field.submit-error[aria-invalid="true"] {
  border-color: #dc2626;
}
```

### 3.2 Password Hint Dual-Layer Mechanics

The password experience deliberately separates **guidance while editing** from **an error after submission**.

#### Layer A — Real-Time Typing Assistant

The dark **`.password-tooltip`** is an absolute contextual assistant. It never participates in normal document flow and therefore never pushes the submit or social buttons.

- **Initial state:** Hidden with **`opacity: 0`**, **`visibility: hidden`**, and a small transform offset.
- **Trigger:** Show only after an **`input`** event while the password field is actively focused.
- **Desktop location:** On the password field’s open flank at **`105%`**. In the current Arabic physical layout this resolves to **`left: 105%`**; after LTR mirroring it resolves to **`right: 105%`**.
- **Compact width:** **`210px`**.
- **Visual style:** Dark slate background **`#1e293b`**, white copy, rounded corners, directional triangle, and soft shadow.
- **Tracked rules:**
  - 8 characters or more.
  - At least one uppercase Latin letter **`A–Z`**.
  - At least one numeric digit **`0–9`**.
- **Live feedback:** Each satisfied item receives its completed state.
- **Self-dismissal:** The exact moment all three rules pass, remove **`.show`**.
- **Regression behavior:** If the user backspaces and a rule fails again while focused, restore **`.show`**.
- **Blur behavior:** Hide the tooltip.
- **Submit behavior:** Always call **`hidePasswordTooltips(form)`** before displaying any submit error. Guidance and submit warning must never compete visually.
- **Responsive behavior:** At narrower breakpoints, position the tooltip above the input because the side flank is unavailable.

#### Layer B — Printify-style submit warning

Each password wrapper owns one unique error element:

```html
<div
  class="field-error-message"
  id="customerPasswordError"
  role="alert"
  aria-live="assertive"
>
  ⚠️ كلمة المرور غير صحيحة. حاول مجدداً.
</div>
```

Use equivalent unique IDs for designer and printing-press forms. Never duplicate one global **`id="passwordError"`** across panels.

- **Default:** Hidden.
- **Only trigger:** A main-form submit attempt with a password that fails one or more rules.
- **Arabic text:** `⚠️ كلمة المرور غير صحيحة. حاول مجدداً.`
- **English text:** `⚠️ Incorrect password. Please try again.`
- **Placement:** Absolutely beneath the password field, aligned with the field’s logical start edge.
- **Field treatment:** Solid crimson border **`#dc2626`**.
- **Layout protection:** Reserve only the small error line’s vertical space when active; do not render an aggregate form-wide warning.
- **Instant clearing:** The next focus or first changed character hides the warning and clears the crimson border.
- **Assistant handoff:** After clearing a submit error, typing can reopen the dark assistant until the three rules pass.
- **Accessibility:** Keep **`role="alert"`** and **`aria-live="assertive"`** for submit-time announcements, and connect the input with **`aria-describedby`** when the message is active.

### 3.3 Submission pipeline

```text
submit event
    ├── hide all password tooltips
    ├── normalize current role payload
    ├── validate enabled role fields
    ├── mark invalid controls and announce field errors
    ├── focus first invalid field without reopening the tooltip
    └── if valid: call secure registration endpoint
```

> **Current code notice:** **`API_CONFIG.register`** is empty. The present handler waits briefly and returns a demo success state. Production readiness requires a real HTTPS endpoint, server-side validation, rate limiting, duplicate-account handling, and safe error normalization.

---

## 4. IMPORTANT ARCHITECTURAL & DEPLOYMENT NOTICES

### 4.1 Critical Git notice — green files, `U`, and working-tree states

Editor colors are theme-dependent. In VS Code, green commonly indicates a new or added file, while **`U`** commonly means **Untracked**. The terminal is the source of truth:

```bash
git status --short
```

Interpret the two status columns precisely:

| Marker | Meaning | Required decision |
|---|---|---|
| **`??`** | Untracked; Git has never staged the file | Add it intentionally or exclude it in `.gitignore` |
| **`A `** | New file staged in the index | Ready for commit |
| **`AM`** | File was staged, then modified again | Stage the latest working copy before committing |
| **`AD`** | File was staged as new, then deleted in the working tree | Confirm whether deletion or restoration is intended |
| **` M`** | Tracked file modified but not staged | Review and stage if intended |

The current workspace includes staged/new combinations and an untracked arrow asset, so inspect before committing. A standard scoped workflow is:

```bash
git status --short
git diff
git diff --staged
git add index.html styles.css script.js assets/icons/arrow.svg PALPRINTS-REGISTRATION-BLUEPRINT.md
git status
git commit -m "Finalize PALPRINTS registration experience"
git push
```

- Prefer scoped **`git add`** when the workspace contains unrelated changes.
- If every displayed change is known and intended, **`git add .`** is the broader alternative.
- Resolve an **`AD`** entry deliberately before committing; do not blindly restore or delete it.
- A green filename or **`U`** is not an error in the application. It means the file is not yet represented in a commit.

### 4.2 Live Server and bidirectional rendering

- Run the site through a local HTTP development server, such as Live Server, rather than opening **`index.html`** through **`file://`**.
- Test with an explicit origin such as **`http://localhost:5500`**. An origin is the exact combination of scheme, host, and port.
- Every language switch must update **`<html lang>`** and **`<html dir>`** together.
- Mirror layout using grid areas, logical properties such as **`padding-inline`**, **`inset-inline-start`**, and directional asset transforms—not negative scaling of text containers.
- Only directional graphics such as the arrow should flip. Logos, provider marks, product art, text, and password-eye icons should not be mirrored.
- Preserve the 55/45 proportional split in both directions; only the physical side assignment changes.
- Recheck tooltip collision, floating labels, icon offsets, and keyboard focus order after every RTL/LTR adjustment.

### 4.3 Google Identity Services, HTTPS, and authorized origins

Google authentication is origin-bound. A button rendering correctly is not proof that the OAuth configuration is valid.

- Create the web OAuth client in Google Cloud and register every authorized JavaScript origin exactly.
- Local development may use HTTP on **`localhost`**; register the actual development origin and port, for example **`http://localhost:5500`**.
- **`file://`** is not a valid production-style origin for Google Identity Services.
- Production must use **`https://`** and the production origin must be whitelisted. A scheme, hostname, subdomain, or port mismatch is treated as a different origin and will fail authorization.
- One Tap and production login endpoints require a secure HTTPS context; localhost is the development exception.
- Configure redirect URIs separately if a redirect-based flow is used.
- Never expose a Google client secret in **`script.js`**. The browser receives a public client ID; the backend verifies the returned ID token and creates the PALPRINTS session.
- Apply appropriate Content Security Policy and Cross-Origin-Opener-Policy settings if the selected GIS flow requires popup support.

Official implementation references:

- [Get a Google API client ID](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid)
- [Display the Sign in with Google button](https://developers.google.com/identity/gsi/web/guides/display-button)
- [OAuth 2.0 for client-side web applications](https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow)

### 4.4 Production readiness checklist

- [ ] Adopt the scrollable form-panel engine and remove conflicting final **`overflow: hidden`** overrides.
- [ ] Collapse the customer manual fieldset by default while retaining an accessible fallback.
- [ ] Replace placeholder social click handlers with verified Google and Apple SDK flows.
- [ ] Configure real HTTPS registration and social-auth endpoints.
- [ ] Verify every enabled field’s **`name`**, **`autocomplete`**, label, icon, and backend contract.
- [ ] Keep validation submit-only and preserve immediate error clearing.
- [ ] Test Arabic and English at desktop, tablet, mobile, 200% zoom, and keyboard-only navigation.
- [ ] Validate no content clipping with password errors, translated copy, or browser autofill.
- [ ] Confirm exact production origins and redirect URIs in provider dashboards.
- [ ] Review Git status, stage intended assets, and commit a reproducible deployment state.

---

**Blueprint authority:** Use this document as the implementation contract for future registration changes. When code and blueprint diverge, update both in the same commit and record whether the change affects current behavior, target architecture, or deployment configuration.
