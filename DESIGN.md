---
name: Labs Design System
version: 1.0.0
tokens:
  colors:
    background:
      primary: "#020617"
      surface: "#0f172a"
      surfaceHover: "#1e293b"
    border:
      default: "#1e293b"
      hover: "#334155"
    brand:
      primary: "#06b6d4"
      accentHover: "#22d3ee"
    text:
      primary: "#f8fafc"
      secondary: "#94a3b8"
      muted: "#64748b"
      code: "#22d3ee"
    status:
      success: "#10b981"
      warning: "#f59e0b"
      destructive: "#f43f5e"
  typography:
    fontFamily:
      sans: "GeistSans, sans-serif"
      mono: "GeistMono, monospace"
    fontSize:
      xs: "12px"
      sm: "14px"
      md: "16px"
      lg: "18px"
      xl: "20px"
      2xl: "24px"
      4xl: "36px"
    fontWeight:
      normal: "400"
      medium: "500"
      semibold: "600"
      bold: "700"
  spacing:
    xs: "4px"
    sm: "8px"
    md: "12px"
    lg: "16px"
    xl: "24px"
    2xl: "32px"
    3xl: "48px"
  borderRadius:
    sm: "6px"
    md: "8px"
    lg: "12px"
    full: "9999px"
  elevation:
    shadowSm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
    shadowMd: "0 4px 6px -1px rgba(2, 6, 23, 0.5)"
    shadowLg: "0 10px 15px -3px rgba(2, 6, 23, 0.8)"
    shadow2xl: "0 25px 50px -12px rgba(2, 6, 23, 0.9)"
  components:
    button:
      primary:
        bg: "{tokens.colors.brand.primary}"
        text: "{tokens.colors.background.primary}"
        hoverBg: "{tokens.colors.brand.accentHover}"
      secondary:
        bg: "{tokens.colors.background.surfaceHover}"
        text: "{tokens.colors.text.primary}"
        border: "{tokens.colors.border.default}"
    card:
      bg: "{tokens.colors.background.surface}"
      border: "{tokens.colors.border.default}"
      radius: "{tokens.borderRadius.lg}"
---

# DESIGN.md — Design System & Visual Guidelines

This document defines the visual language, design system tokens, component stylings, and design guardrails for the **Labs** Next.js application. All AI coding agents and developers working on this codebase MUST follow these guidelines to maintain visual consistency and pass `design.md` linting requirements.

---

## 1. Visual Theme & Atmosphere

- **Core Aesthetic**: Modern, clean, technical, and high-density productivity dashboard / SaaS interface.
- **Mood**: Precise, responsive, dark-mode first (with adaptive light-mode support), elegant typography, and subtle micro-interactions.
- **Design Philosophy**: 
  - **Content-First**: High clarity with low visual clutter.
  - **Consistent Spacing**: Strict adherence to standard 4px/8px grid intervals.
  - **Micro-elevation**: Soft borders, subtle blurs, and controlled depth rather than harsh shadows.

---

## 2. Color Palette & Roles

Tailwind CSS v4 color tokens, functional semantic mappings, and WCAG AA contrast verification:

| Role | Token / Value | Tailwind Class | Contrast Ratio (vs Background) | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Background** | Slate 950 (`#020617`) | `bg-slate-950` / `dark:bg-slate-950` | Base canvas | Main application background |
| **Surface (Card/Modal)** | Slate 900 (`#0f172a`) | `bg-slate-900` / `bg-slate-900/80` | N/A | Card, container, and sidebar surface |
| **Surface Hover** | Slate 800 (`#1e293b`) | `hover:bg-slate-800` | N/A | Interactive surface state |
| **Border / Divider** | Slate 800 (`#1e293b`) | `border-slate-800` | N/A | Subtle structural borders |
| **Primary Brand / Accent**| Cyan 500 (`#06b6d4`) | `bg-cyan-500` / `text-cyan-500` | 7.5:1 (on Slate 950) | Primary CTA, focus indicators, active states |
| **Accent Hover** | Cyan 400 (`#22d3ee`) | `hover:bg-cyan-400` | 10.5:1 (on Slate 950) | Hover state for primary buttons |
| **Text Primary** | Slate 50 (`#f8fafc`) | `text-slate-50` | 18.2:1 (WCAG AAA) | Primary headings and main text |
| **Text Secondary** | Slate 400 (`#94a3b8`) | `text-slate-400` | 6.8:1 (WCAG AA) | Subtitles, labels, and muted text |
| **Success State** | Emerald 500 (`#10b981`) | `text-emerald-500` / `bg-emerald-500/10` | 7.2:1 (WCAG AAA) | Status badges, positive trends |
| **Warning State** | Amber 500 (`#f59e0b`) | `text-amber-500` / `bg-amber-500/10` | 7.8:1 (WCAG AAA) | Caution alerts and pending tasks |
| **Destructive State** | Rose 500 (`#f43f5e`) | `text-rose-500` / `bg-rose-500/10` | 5.4:1 (WCAG AA) | Error messages and deletion CTAs |

---

## 3. Typography Rules

Font Family: `GeistSans` / `sans-serif` (Default Next.js font setup) with `GeistMono` for code blocks and metrics.

### Type Scale & Hierarchy

| Element | Class String | Size / Weight | Usage |
| :--- | :--- | :--- | :--- |
| **Display H1** | `text-4xl font-bold tracking-tight text-slate-50` | 36px / 700 | Hero titles, main section banners |
| **Section H2** | `text-2xl font-semibold tracking-tight text-slate-50` | 24px / 600 | Page titles, major section headers |
| **Card Title H3**| `text-lg font-medium text-slate-100` | 18px / 500 | Component & card headings |
| **Body Primary** | `text-sm font-normal text-slate-300 leading-relaxed` | 14px / 400 | Regular paragraph content |
| **Subtext / Muted**| `text-xs font-normal text-slate-400` | 12px / 400 | Metadata, timestamps, helper text |
| **Monospace** | `font-mono text-xs text-cyan-400` | 12px / 400 | Code blocks, API keys, JSON output |

---

## 4. Component Stylings

### Buttons
- **Primary Button**: `bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-4 py-2 rounded-lg transition-all duration-150 shadow-sm focus:ring-2 focus:ring-cyan-400/50`
- **Secondary Button**: `bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-4 py-2 rounded-lg border border-slate-700/50 transition-all duration-150`
- **Ghost / Icon Button**: `p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 rounded-md transition-colors`

### Cards & Containers
- **Standard Card**: `bg-slate-900/90 border border-slate-800/80 rounded-xl p-6 shadow-lg backdrop-blur-sm`
- **Interactive Card**: `bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 rounded-xl p-6 transition-all duration-200 hover:shadow-cyan-500/5`

### Form Inputs
- **Text Input**: `w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all`

### Dialog / Modal Overlay
- **Backdrop Overlay**: `fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4`
- **Modal Surface**: `relative w-full max-w-lg bg-slate-900/95 border border-slate-800/90 rounded-xl p-6 shadow-2xl shadow-slate-950/90 backdrop-blur-md space-y-5`
- **Header & Title**: Title `text-lg font-medium text-slate-100`, Description `text-xs text-slate-400 mt-0.5`
- **Footer Actions**: Right-aligned flex layout `flex items-center justify-end gap-3 pt-3 border-t border-slate-800/80`

---

## 5. Layout Principles & Elevation

- **Grid & Alignment**: Standard 12-column grid system for complex dashboards (`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`).
- **Container Max-Widths**:
  - Main App Dashboard: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
  - Reading / Content Pages: `max-w-4xl mx-auto px-4`
- **Spacing System**: Strictly use Tailwind's spacing multiplier (4px grid):
  - Component Padding: `p-4` (16px) or `p-6` (24px)
  - Element Gaps: `gap-3` (12px), `gap-4` (16px), or `gap-6` (24px)
  - Section Vertical Spacing: `py-8` or `py-12`
- **Borders & Elevation**:
  - Thin semi-transparent borders: `border border-slate-800/80`
  - Sticky nav backdrop blur: `bg-slate-950/80 backdrop-blur-md border-b border-slate-800`
  - Card Shadow: `shadow-md shadow-slate-950/50`
  - Modal Shadow: `shadow-2xl shadow-slate-950/80`

---

## 6. Shapes & Border Radii

Standardized corner rounding scales across components:
- **Small (`rounded-md` / 6px)**: Badges, icon buttons, dropdown items.
- **Medium (`rounded-lg` / 8px)**: Buttons, text inputs, select boxes.
- **Large (`rounded-xl` / 12px)**: Cards, modals, slide-over panels.
- **Full (`rounded-full`)**: User avatars, pill indicators, online status dots.

---

## 7. Do's and Don'ts

### ✅ Do's
- **DO** include machine-readable YAML front matter with validated token paths.
- **DO** use semantic text colors (`text-slate-50` for titles, `text-slate-400` for subtitles).
- **DO** leverage flex/grid layouts with explicit `gap-*` properties instead of arbitrary margins.
- **DO** add smooth micro-transitions (`transition-colors duration-150` or `transition-all duration-200`) for interactive elements.
- **DO** ensure high contrast ratios for readability against dark backgrounds (WCAG AA standard).

### ❌ Don'ts
- **DON'T** omit the YAML front matter block at the beginning of `DESIGN.md`.
- **DON'T** use pure black (`#000000`) or pure white (`#ffffff`) for backgrounds/cards; use dark slate tones (`slate-950`, `slate-900`) for visual richness.
- **DON'T** mix multiple distinct accent colors arbitrarily. Stick to Cyan as primary and semantic colors for states (Green/Amber/Rose).
- **DON'T** hardcode static pixel values for layouts when Tailwind responsive utilities (`sm:`, `md:`, `lg:`) are available.
- **DON'T** omit focus ring indicators (`focus:ring-2 focus:ring-cyan-500/50`) on interactive inputs and buttons.

---

## 8. Responsive Behavior

- **Breakpoints**:
  - `sm:` (640px) — Mobile layout adjustment (single column stack).
  - `md:` (768px) — Tablet & split layouts (2-column grids, sidebar toggle).
  - `lg:` (1024px) — Full desktop view (3-column grids, permanent sidebar).
  - `xl:` (1280px) — Expanded desktop container.
- **Touch Targets**: Minimum target size of 44x44px (`min-h-[44px]` or `p-3`) on mobile viewports.
- **Navigation**: Collapse header links into a mobile menu drawer or hamburger overlay on screens `< md`.

---

## 9. Agent Prompt Guide

When asking AI coding agents to generate new UI pages or components for this project, provide prompt contexts like:

```markdown
"Build a new analytics overview card following DESIGN.md. Use bg-slate-900/90, border-slate-800/80, 
text-slate-50 for metrics, text-slate-400 for labels, and cyan-500 for positive highlight trends. 
Ensure responsive grid layout (1 column on mobile, 3 columns on lg)."
```
