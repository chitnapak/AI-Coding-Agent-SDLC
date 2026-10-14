# Graph Report - Labs  (2026-10-12)

## Corpus Check
- 85 files · ~63,299 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: .css 4, (none) 1, .db 1)

## Summary
- 301 nodes · 448 edges · 18 communities (13 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- API Routes & Tests
- UI Pages & Design Tokens
- Next.js Config & Route Handlers
- ESLint & Package Config
- Storybook & UI Components
- Dev Dependencies
- TypeScript Config
- Onboarding & Constants
- Home & Product Cards
- Dialog Component
- Runtime Dependencies
- NPM Scripts
- App Layout & Preview
- Swagger / OpenAPI Docs
- OpenAPI Route
- Mermaid Page

## God Nodes (most connected - your core abstractions)
1. `next` - 19 edges
2. `react` - 16 edges
3. `compilerOptions` - 16 edges
4. `ProductDetailPage()` - 13 edges
5. `Dialog()` - 11 edges
6. `lucide-react` - 9 edges
7. `vitest` - 9 edges
8. `scripts` - 8 edges
9. `DesignSystemPage()` - 8 edges
10. `db` - 8 edges

## Surprising Connections (you probably didn't know these)
- `DesignSystemPage()` --calls--> `Dialog()`  [EXTRACTED]
  src/app/design/page.tsx → src/components/ui/dialog.tsx
- `ProductDetailPage()` --calls--> `Dialog()`  [EXTRACTED]
  src/app/products/[id]/page.tsx → src/components/ui/dialog.tsx
- `DesignSystemPage()` --calls--> `Badge()`  [EXTRACTED]
  src/app/design/page.tsx → src/components/ui/badge.tsx
- `DesignSystemPage()` --calls--> `Breadcrumb()`  [EXTRACTED]
  src/app/design/page.tsx → src/components/ui/breadcrumb.tsx
- `DesignSystemPage()` --calls--> `Button`  [EXTRACTED]
  src/app/design/page.tsx → src/components/ui/button.tsx

## Import Cycles
- None detected.

## Communities (18 total, 5 thin omitted)

### Community 0 - "API Routes & Tests"
Cohesion: 0.06
Nodes (32): better-sqlite3, vitest, BASE_BRANDS, BASE_CATEGORIES, testDb, callGet(), CATEGORIES, makeRequest() (+24 more)

### Community 1 - "UI Pages & Design Tokens"
Cohesion: 0.11
Nodes (28): lucide-react, react, colorTokens, DesignSystemPage(), typeScales, categories, productData, ProductDetailPage() (+20 more)

### Community 2 - "Next.js Config & Route Handlers"
Cohesion: 0.09
Nodes (19): nextConfig, next, db, DB_PATH, migrate(), categories, featuredBrands, insertBrand (+11 more)

### Community 3 - "ESLint & Package Config"
Cohesion: 0.07
Nodes (25): eslintConfig, name, private, version, @chromatic-com/storybook, eslint, eslint-config-next, eslint-plugin-storybook (+17 more)

### Community 4 - "Storybook & UI Components"
Cohesion: 0.08
Nodes (25): storybook, @storybook/nextjs-vite, @tailwindcss/vite, Button(), ButtonProps, Large, meta, Primary (+17 more)

### Community 5 - "Dev Dependencies"
Cohesion: 0.09
Nodes (23): devDependencies, @chromatic-com/storybook, eslint, eslint-config-next, eslint-plugin-storybook, playwright, storybook, @storybook/addon-a11y (+15 more)

### Community 6 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 7 - "Onboarding & Constants"
Cohesion: 0.24
Nodes (10): API_ROUTES, CATEGORIES, collectionPill(), DB_TABLES, FEATURED_BRANDS, OnboardingPage(), PRODUCTS, QUICK_STEPS (+2 more)

### Community 8 - "Home & Product Cards"
Cohesion: 0.25
Nodes (8): Category, categoryBg, FeaturedBrand, Home(), HomeCatalog, ProductCard, ProductCardUI(), ProductPage

### Community 9 - "Dialog Component"
Cohesion: 0.39
Nodes (8): Dialog(), DialogDescription(), DialogFooter(), DialogHeader(), DialogOverlay(), DialogProps, DialogSurface(), DialogTitle()

### Community 10 - "Runtime Dependencies"
Cohesion: 0.25
Nodes (8): dependencies, better-sqlite3, lucide-react, next, react, react-dom, swagger-ui-react, @types/better-sqlite3

### Community 11 - "NPM Scripts"
Cohesion: 0.25
Nodes (8): scripts, build, build-storybook, db:seed, dev, lint, start, storybook

### Community 12 - "App Layout & Preview"
Cohesion: 0.25
Nodes (4): geistMono, geistSans, metadata, preview

## Knowledge Gaps
- **15 isolated node(s):** `@types/better-sqlite3`, `react-dom`, `@chromatic-com/storybook`, `@storybook/addon-a11y`, `@storybook/addon-docs` (+10 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 189 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `Next.js Config & Route Handlers` to `API Routes & Tests`, `UI Pages & Design Tokens`, `ESLint & Package Config`, `Onboarding & Constants`, `Home & Product Cards`, `App Layout & Preview`?**
  _High betweenness centrality (0.286) - this node is a cross-community bridge._
- **What connects `@types/better-sqlite3`, `react-dom`, `@chromatic-com/storybook` to the rest of the system?**
  _15 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `API Routes & Tests` be split into smaller, more focused modules?**
  _Cohesion score 0.05939716312056738 - nodes in this community are weakly interconnected._
- **Why does `react` connect `UI Pages & Design Tokens` to `ESLint & Package Config`, `Storybook & UI Components`, `Home & Product Cards`, `Dialog Component`, `Swagger / OpenAPI Docs`, `Mermaid Page`?**
  _High betweenness centrality (0.167) - this node is a cross-community bridge._
- **Should `UI Pages & Design Tokens` be split into smaller, more focused modules?**
  _Cohesion score 0.10975609756097561 - nodes in this community are weakly interconnected._
- **Why does `devDependencies` connect `Dev Dependencies` to `ESLint & Package Config`?**
  _High betweenness centrality (0.129) - this node is a cross-community bridge._
- **Should `Next.js Config & Route Handlers` be split into smaller, more focused modules?**
  _Cohesion score 0.08858858858858859 - nodes in this community are weakly interconnected._