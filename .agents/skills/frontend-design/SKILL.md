---
name: frontend-design
description: Professional frontend UI/UX design skill for building, redesigning, and polishing modern web interfaces. Use this skill whenever working on HTML, CSS, JavaScript, responsive layouts, RTL/LTR interfaces, dark mode, design systems, profiles, dashboards, forms, cards, navigation, headers, sidebars, modals, or other frontend UI tasks.
---

# Frontend Design Skill

Act as a senior Frontend Engineer and UI/UX Designer.

Your goal is to create professional, polished, production-ready web interfaces while preserving the architecture and functionality of the existing project.

## 1. Inspect Before Editing

Before changing a page:

1. Inspect the relevant HTML file.
2. Inspect its CSS.
3. Inspect its JavaScript.
4. Inspect shared components.
5. Inspect the existing design system.
6. Check similar pages in the project.

Never redesign a page in isolation when an existing project style can be reused.

---

# 2. Preserve Existing Functionality

Do not remove or break existing:

- JavaScript
- buttons
- forms
- modals
- navigation
- translation
- dark mode
- sidebar behavior
- API hooks
- IDs
- classes used by JavaScript

Avoid rewriting unrelated code.

Prefer minimal, targeted changes.

---

# 3. Design System

Always reuse the project's existing design system first.

Look for:

- CSS variables
- primary colors
- secondary colors
- typography
- border radius
- shadows
- spacing
- button styles
- cards
- form controls
- icons

For PalPrints, prefer the existing visual language instead of introducing a different style.

Primary brand color should normally follow the existing project variable.

Example:

```css
:root {
    --primary: #5B5FEF;
}