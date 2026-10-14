---
name: farmart-ui-page
description: Create a new UI page for the Farmart Next.js project following the established design system. Use this skill whenever someone asks to add a new page, build a frontend view, or create a new route under src/app/. Also use it when modifying or extending an existing page's layout or components.
---

# Farmart UI Page

Every UI page in Farmart follows the same visual language defined in `DESIGN.md`. Read that file before writing any UI code — the token values there are the source of truth.

## File location and basic structure

```
src/app/<route>/page.tsx
```

All pages that use client-side state or browser APIs must have `"use client"` as the very first line:

```tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { /* icons */ } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
// ... other components as needed

export default function MyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      {/* content */}
    </main>
  );
}
```

Server components (no interactivity) omit `"use client"`.

## Color palette — use these, nothing else

| Role | Class |
|---|---|
| Page background | `bg-slate-950` |
| Card / surface | `bg-slate-900` or `bg-slate-900/90` |
| Hover surface | `hover:bg-slate-800` |
| Border | `border-slate-800` or `border-slate-800/80` |
| Primary text | `text-slate-50` |
| Secondary text | `text-slate-400` |
| Muted / metadata | `text-slate-500` or `text-slate-600` |
| Accent (CTA, active) | `bg-cyan-500` / `text-cyan-400` / `text-cyan-500` |
| Success | `text-emerald-500` |
| Warning | `text-amber-500` |
| Error / destructive | `text-rose-500` |

Never use pure black (`#000`) or pure white (`#fff`). Always stay on the slate scale.

## Component library

Use components from `src/components/ui/` — don't reinvent them:

| Component | Import |
|---|---|
| `Button` | `@/components/ui/button` |
| `Card`, `CardTitle` | `@/components/ui/card` |
| `Badge` | `@/components/ui/badge` |
| `Dialog` | `@/components/ui/dialog` |
| `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` | `@/components/ui/tabs` |
| `Input` | `@/components/ui/input` |
| `QuantitySelector` | `@/components/ui/quantity-selector` |
| `Breadcrumb` | `@/components/ui/breadcrumb` |

For icons, use `lucide-react`. Don't add other icon libraries.

## Typography scale

```tsx
// Page / hero title
<h1 className="text-4xl font-bold tracking-tight text-slate-50">

// Section heading
<h2 className="text-2xl font-semibold tracking-tight text-slate-50">

// Card heading
<h3 className="text-lg font-medium text-slate-100">

// Body text
<p className="text-sm text-slate-300 leading-relaxed">

// Muted / metadata
<span className="text-xs text-slate-400">

// Code / monospace
<code className="font-mono text-xs text-cyan-400">
```

## Buttons

```tsx
// Primary CTA
<Button className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-4 py-2 rounded-lg transition-all focus:ring-2 focus:ring-cyan-400/50">

// Secondary
<Button className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/50 px-4 py-2 rounded-lg transition-all">

// Ghost / icon
<button className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 rounded-md transition-colors">
```

Every interactive element needs `focus:ring-2 focus:ring-cyan-500/50`.

## Cards

```tsx
// Standard card
<div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-6 shadow-lg">

// Interactive card (hover effect)
<div className="bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 rounded-xl p-6 transition-all duration-200">
```

## Layout

```tsx
// Main container
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

// Content / reading pages
<div className="max-w-4xl mx-auto px-4">

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

## Responsive rules

- Mobile-first: define base styles, then use `md:` and `lg:` to widen
- Minimum touch target: `min-h-[44px]` on buttons/links in mobile views
- Sticky header: `bg-slate-950/80 backdrop-blur-md border-b border-slate-800`

## Data fetching in client pages

Use `useEffect` + `fetch` against the local API routes:

```tsx
const [data, setData] = useState(null);

useEffect(() => {
  fetch('/api/products?pageSize=12')
    .then(r => r.json())
    .then(setData);
}, []);
```

## Checklist before finishing

- [ ] `"use client"` present if the page uses state, effects, or event handlers
- [ ] Background is `bg-slate-950`, not white or plain black
- [ ] No hardcoded hex colors — only Tailwind slate/cyan/emerald/amber/rose classes
- [ ] All interactive elements have `focus:ring-2 focus:ring-cyan-500/50`
- [ ] Icons from `lucide-react` only
- [ ] Components from `src/components/ui/` where available
- [ ] Responsive: tested at mobile (`sm`), tablet (`md`), desktop (`lg`)
