---
name: PalPrints
description: Palestinian print-on-demand marketplace UI — precise, print-shop-inspired, Arabic RTL.
colors:
  blue-50: "#EFF6FF"
  blue-100: "#DAE9FF"
  blue-200: "#BED9FF"
  blue-300: "#91BFFF"
  blue-400: "#5B9FFF"
  blue-500: "#3287FF"
  blue-600: "#1677FF"
  blue-700: "#0A68EB"
  blue-800: "#0F58BE"
  navy-50: "#F7FAFD"
  navy-100: "#EFF4FB"
  navy-200: "#DFE8F3"
  navy-400: "#8CA2C0"
  navy-500: "#5B7394"
  navy-700: "#2C405C"
  navy-900: "#0B1F3A"
  orange-50: "#FFF6ED"
  orange-100: "#FFE9D5"
  orange-500: "#FF7A00"
  orange-700: "#B25500"
  success: "#16A34A"
  warning: "#D97706"
  danger: "#DC2626"
  primary: "#1677FF"
  primary-hover: "#0A68EB"
  primary-active: "#0F58BE"
  primary-soft: "#EFF6FF"
  primary-border: "#BED9FF"
  media-blue-1: "#E7F1FF"
  media-blue-2: "#CFE2FF"
  media-sand-1: "#FFF5E8"
  media-sand-2: "#F6DDBD"
  media-mint-1: "#E8F8F3"
  media-mint-2: "#C9EADF"
  media-violet-1: "#F1ECFF"
  media-violet-2: "#DDD1FF"
  avatar-green-text: "#12664F"
  avatar-green-bg: "#D8F2E9"
  avatar-violet-text: "#5B3CA8"
  avatar-violet-bg: "#E8E0FF"
  on-primary: "#FFFFFF"
  accent: "#FF7A00"
  accent-soft: "#FFE9D5"
  accent-surface: "#FFF6ED"
  accent-text: "#B25500"
  text-strong: "#0B1F3A"
  text-body: "#2C405C"
  text-muted: "#5B7394"
  text-placeholder: "#8CA2C0"
  border: "#DFE8F3"
  surface-muted: "#F7FAFD"
  navy-800: "#182941"
  on-dark-emphasis: "#DBE7F7"
  on-dark-body: "#D8E2F1"
  on-dark-muted: "#C5D1E2"
  on-dark-muted-2: "#B8C8DC"
  on-dark-faint: "#9FB0C9"
  on-dark-faintest: "#879AB6"
  on-dark-border: "#54708F"
typography:
  display:
    fontFamily: "Cairo, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "clamp(1.9rem, 1.55rem + 1.4vw, 2.75rem)"
    fontWeight: 800
    lineHeight: 1.18
    letterSpacing: "-0.01em"
  h1:
    fontFamily: "Cairo, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "1.75rem"
    fontWeight: 800
    lineHeight: 1.28
  h2:
    fontFamily: "Cairo, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "1.375rem"
    fontWeight: 700
    lineHeight: 1.32
  h3:
    fontFamily: "Cairo, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.4
  body-lg:
    fontFamily: "Cairo, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.8
  body:
    fontFamily: "Cairo, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.8
  body-sm:
    fontFamily: "Cairo, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.7
  eyebrow:
    fontFamily: "Cairo, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 700
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, 'SFMono-Regular', Consolas, monospace"
rounded:
  xs: "6px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  pill: "999px"
spacing:
  sp-1: "4px"
  sp-2: "8px"
  sp-3: "12px"
  sp-4: "16px"
  sp-5: "24px"
  sp-6: "32px"
  sp-8: "48px"
  sp-10: "64px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
    padding: "0.7rem 1.35rem"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: "0.7rem 1.35rem"
  button-dark:
    backgroundColor: "{colors.text-strong}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "0.7rem 1.35rem"
  card:
    backgroundColor: "#FFFFFF"
    rounded: "{rounded.lg}"
    padding: "1.25rem 1.5rem"
  badge-soft:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.blue-800}"
    rounded: "{rounded.pill}"
    padding: "0.15rem 0.65rem"
  badge-accent:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent-text}"
    rounded: "{rounded.pill}"
    padding: "0.15rem 0.65rem"
  input:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.text-body}"
    rounded: "{rounded.sm}"
    padding: "0.65rem 0.85rem"
---

# Design System: PalPrints

## Overview

**Creative North Star: "The Print Shop Registration Mark"**

PalPrints borrows its visual language from the print shop, not from generic SaaS: crop marks, a halftone dot grid, and the circular registration mark are the only decorative vocabulary allowed. There are no organic blobs, no decorative gradients beyond the one confirmed brand gradient, and no ornamental flourishes — precision reads as trust for a product whose entire promise is "your design, printed correctly." The interface is light-only (no dark mode); `data-bs-theme="light"` is the permanent state, matching a physical print shop's clean, well-lit counter rather than a screen-native dark aesthetic.

Blue carries the brand and every primary action. Navy carries every piece of text and every dark surface — there is no pure black (`#000`) anywhere in the system. Orange is a single strictly-rationed accent: badges, alerts, and campaign call-outs only, capped at roughly 5% of any screen's area, never a primary button, logo, navbar, or large background. The interface is Arabic-first and RTL end to end; Cairo is the only typeface, for Arabic and Latin text alike, and numerals/prices stay LTR inside the RTL flow.

**Key Characteristics:**
- Print-shop iconography only (crop marks, halftone, registration mark) — no organic or generic AI-UI decoration.
- One primary blue, rationed orange, navy for all text — no pure black.
- Light-only; no dark mode anywhere in the product.
- Cairo everywhere; numbers and currency always render LTR (`49.90 ₪`) inside RTL layout.
- 4px spacing scale exclusively; no arbitrary spacing values.

## Colors

Three families only: blue for identity and action, navy for all text and dark surfaces, orange as a heavily rationed accent.

### Primary
- **Primary Blue** (`#1677FF`, blue-600): buttons, links, active state, brand identity. Used freely.
- **Primary Hover** (`#0A68EB`, blue-700): hover state for primary actions; also the required color for small blue text/links on white (`#1677FF` itself only clears WCAG AA at 3:1, valid for graphical elements and large text, not small body text).
- **Primary Active** (`#0F58BE`, blue-800): pressed/active state.
- **Primary Soft** (`#EFF6FF`, blue-50): soft backgrounds for hover and selected states.

### Secondary (Accent)
- **Accent Orange** (`#FF7A00`, orange-500): attention only — "new"/"best seller" badges, urgent alerts, campaign banners, small dashboard indicators. Never a primary button, the logo, navbar/sidebar, active nav state, or a text link.
- **Accent Text** (`#B25500`, orange-700): the only acceptable orange for text, and only over `orange-50`/`orange-100` surfaces — orange-500 text on white fails contrast (≈2.6:1).

### Neutral
- **Text Strong** (`#0B1F3A`, navy-900): headings and emphasized labels. This is also the system's substitute for black — never use `#000`.
- **Text Body** (`#2C405C`, navy-700): paragraph and description text.
- **Text Muted** (`#5B7394`, navy-500): hints, metadata, secondary captions on light surfaces. On a `blue-50` surface, use Text Body instead — Text Muted falls just short of AA there (4.46:1).
- **Text Placeholder** (`#8CA2C0`, navy-400): input placeholders only.
- **Border** (`#DFE8F3`, navy-200): card and field borders.
- **Surface Muted** (`#F7FAFD`, navy-50): page-level neutral background.
- **Navy 800** (`#182941`): darkest border/divider step, used on dark cards (e.g. the designer partner card's outer border).

### Neutral (Text on Dark Surfaces)
A separate, lighter scale for text sitting directly on a navy-900 surface (footer, designer partner card) — not derived from the light-surface Neutral scale above.
- **On-Dark Emphasis** (`#DBE7F7`): higher-emphasis text on dark, e.g. the designer benefits list.
- **On-Dark Body** (`#D8E2F1`): default body text color on dark surfaces (footer).
- **On-Dark Muted** (`#C5D1E2`): secondary text/chips on dark, e.g. footer payment marks.
- **On-Dark Muted 2** (`#B8C8DC`): paragraph text on the dark designer partner card.
- **On-Dark Faint** (`#9FB0C9`): tagline/description text on dark, e.g. footer brand blurb.
- **On-Dark Faintest** (`#879AB6`): least prominent text on dark, e.g. footer legal/copyright line.
- **On-Dark Border** (`#54708F`): borders on dark surfaces, e.g. the ghost button border in the designer partner card.

This on-dark scale is six close, not-fully-systematized steps inherited from the shipped implementation; treat it as documented reality rather than an intentional ramp, and avoid adding a seventh one-off.

### Semantic
- **Success** (`#16A34A`), **Warning** (`#D97706`), **Danger** (`#DC2626`), **Info** (`#1677FF`, same as Primary). Warning is deliberately a distinct amber from the marketing accent orange, so "system warning" never reads as "promotional attention."

### Category Accents (design-card media placeholders & avatar initials)
A small, decorative-only accent set for categorizing cards when no product photo is available (gradient media placeholders) and for designer-avatar initials. Not used for buttons, links, or status.
- **Blue Media** (`#E7F1FF` → `#CFE2FF`), **Sand Media** (`#FFF5E8` → `#F6DDBD`), **Mint Media** (`#E8F8F3` → `#C9EADF`), **Violet Media** (`#F1ECFF` → `#DDD1FF`): diagonal two-stop gradients behind a design-card thumbnail.
- **Green Avatar** (text `#12664F` on `#D8F2E9`), **Violet Avatar** (text `#5B3CA8` on `#E8E0FF`): designer-initials avatar variants, alongside the Primary-based blue avatar (`blue-800` on `blue-100`).

### Named Rules
**The One Accent Rule.** Orange never exceeds ~5% of a screen's area and never appears on a primary button, the logo, the navbar/sidebar, or a text link.
**The No-Pure-Black Rule.** All "black" text and dark surfaces are Navy 900 (`#0B1F3A`); `#000000` never appears.
**The Small-Text Blue Rule.** Any blue text below large-text size (links, small labels) uses `#0A68EB` (blue-700, 6.1:1 on white), not `#1677FF` (blue-600, 4.1:1 — valid only for buttons/graphics/large text).

## Typography

**Display/Body/Label Font:** Cairo (with `system-ui, -apple-system, "Segoe UI", sans-serif` fallback) — one typeface for the entire interface, Arabic and Latin.
**Mono Font:** JetBrains Mono (`ui-monospace, "SFMono-Regular", Consolas, monospace`) — numerals, prices, hex codes, and Gregorian dates only, always rendered LTR via a dedicated `.ltr` treatment even inside RTL paragraphs.

**Character:** Warm-neutral and highly legible in Arabic at every weight from 400 to 800; weight, not typeface variety, carries the hierarchy.

### Hierarchy
- **Display** (800, `clamp(1.9rem, 1.55rem + 1.4vw, 2.75rem)`, 1.18): hero headlines only.
- **H1** (800, 1.75rem, 1.28): page-level titles (e.g. dashboard title).
- **H2** (700, 1.375rem, 1.32): section titles.
- **H3** (700, 1.125rem, 1.4): card/sub-section titles.
- **Body Large** (400, 1.0625rem, 1.8): lead paragraphs.
- **Body** (400, 1rem, 1.8): default paragraph text.
- **Body Small** (400, 0.875rem, 1.7): secondary/meta text.
- **Eyebrow/Label** (700, 0.8125rem, uppercase-weight but not case-transformed): section kickers, always paired with a small primary-colored dot.

### Named Rules
**The Scale-Only Rule.** Use the defined type roles; never hand-pick a one-off `font-size`. Adjacent roles should read as a clear step, not a near-tie — a heading within ~1.1× of its body text is a hierarchy failure, not a subtle refinement.
**The 11px Floor Rule.** No functional or content-bearing text (labels, nav, payment marks, table cells) renders below 11px; only non-interactive legal fine print may drop to 10px.
**The Fluid-Anchor Rule.** The sizes above are anchors, not literal fixed values: most headings and hero/section text are implemented as `clamp(mobile-anchor, ..., desktop-anchor)` for responsive scaling, with the mobile end at or slightly below the role's anchor and the desktop end 20-40% larger. A clamp in that neighborhood satisfies the role; only a value that ignores the anchor and hierarchy entirely is drift.

## Layout

Main container caps at `1120px` with `1.25rem` horizontal padding (`.container-palprints`). Spacing is a strict 4px-based scale — `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64px` — with no arbitrary values (no `13px`, no `22px`) anywhere in a component. 16px is the default gap between form elements; 24px separates field groups; 32px is card/section internal padding; 48–64px separates major page sections.

## Elevation & Depth

Elevation is neutral and subtle — soft navy-tinted shadows, never a colored/chromatic glow. Depth signals interactivity (hover lift on cards) rather than decorating static surfaces.

### Shadow Vocabulary
- **shadow-sm** (`0 1px 2px rgba(11,31,58,.06)`): resting cards, subtle separation.
- **shadow** (`0 4px 14px rgba(11,31,58,.08)`): default raised surfaces (modals, popovers).
- **shadow-lg** (`0 12px 28px rgba(11,31,58,.12)`): high-elevation surfaces (large modals).
- **shadow-primary** (`0 6px 16px rgba(22,119,255,.24)`): reserved for the primary button only, as a brand-colored "lift," never as a background glow on other elements.

### Named Rules
**The No-Glow Rule.** A colored, zero-offset blurred shadow (a "glow") behind text or on a dark background never appears. `shadow-primary` is a directional button shadow, not a halo.

## Shapes

Four radius steps only: `6px` (xs, tight chips), `8px` (sm, inputs/small controls), `12px` (default, buttons), `16px` (lg, cards). Corner marks come from two dedicated print-shop motifs rather than border-radius: `print-frame` (two-corner crop marks framing an uploaded design) and `corner-flag` (a single diagonal flag marking "best seller"), each used sparingly — never more than one flourish per card.

## Components

### Buttons
- **Shape:** 12px radius (`rounded.md`).
- **Primary:** Primary Blue background, white text, `shadow-primary`; one primary button per section/form maximum.
- **Hover/Active:** background steps to blue-700 on hover, blue-800 on active (1px press translate).
- **Outline / Dark:** Outline = transparent + blue-200 border + blue text, for secondary actions. Dark = navy-900 background + white text, for a strong alternative that never sits beside a primary blue button in the same group.

### Badges & Alerts
- **Default badge:** `badge-soft` (primary-soft background, blue-800 text) — the default for any non-urgent status.
- **Accent badge:** orange, reserved for "new" / "best seller" only.
- **Status badges:** success/warning/danger map 1:1 to order/payment states; order status is always a colored badge, never plain text.

### Cards
- **Corner style:** 16px radius.
- **Background:** white on a navy-50 page background.
- **Shadow:** `shadow-sm` at rest, `shadow` + 3px lift on hover for interactive cards (`app-card-hover`).
- **Border:** 1px navy-200.
- **Internal padding:** 32px (desktop card default).

### Inputs / Fields
- **Style:** white background, 1px navy-200 border, 8px radius, persistent label above the field (never a floating/placeholder-only label).
- **Focus:** border shifts to Primary Blue with a soft blue focus ring (`0 0 0 3px rgba(22,119,255,.18)`).
- **Error / Valid:** border and helper text switch to danger/success respectively; helper text always present under the field.

### Navigation
- Top navbar (storefront): white surface, muted links, active link in Primary Blue.
- Sidebar (designer/print-shop/admin dashboards): white surface, active item on `primary-soft` background with blue-700 text; unread items get a small orange dot.
- Tabs use a 2px bottom border in Primary Blue for the active tab; breadcrumbs use muted text with a bold navy-900 current-page label.

## Do's and Don'ts

### Do:
- **Do** use exactly one primary blue button per screen/form.
- **Do** keep orange to badges, alerts, and campaign call-outs, under ~5% of screen area.
- **Do** render order/payment status as a colored badge, never plain text.
- **Do** use only the 4px-multiple spacing scale.
- **Do** give every interactive element a visible focus state.
- **Do** use blue-700 (not blue-600) for any small text or link on a light background.
- **Do** keep all functional text at 11px or larger (10px only for non-interactive legal fine print).

### Don't:
- **Don't** mix orange and blue in the same element or gradient.
- **Don't** put orange text on a plain white background.
- **Don't** use arbitrary border-radius values outside the four-step scale.
- **Don't** use `shadow-lg` or a colored glow on small elements like badges.
- **Don't** use pure black (`#000`) — Navy 900 is the system's black.
- **Don't** use any font other than Cairo, anywhere, including in small print or icon labels.
