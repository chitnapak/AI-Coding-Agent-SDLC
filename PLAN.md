# Farmart - Online Grocery Store

## Business Goals
- Increase online sales
- Drive repeat purchases via membership
- Reduce in-store workload

---

## Phase 1: Product Discovery & Browsing ✅

### Category Navigation
- [x] Define product categories (8 categories: fruits, breads, seafood, meats, drinks, coffee, milks, pets)
- [x] Build category sidebar/bar on homepage
- [x] Category filter + breadcrumb on listing page
- [x] Implement search with keyword + category filter (`?q=`, `?category=`)

### Product Listing & Card Presentation
- [x] Product Card UI with high-quality images and labels
- [x] Display regular price, discount price, and percentage saved
- [x] Display review ratings (star ratings & review count)
- [x] Quick "Add to Cart" button directly on product cards

---

## Phase 2: Promotional & Conversion Features ✅

### Hero & Deals Banner
- [x] Engaging Hero Banner showcasing active promotions
- [x] Highlight 15% discount offer for new members

### High-Conversion Sections
- [x] **Best Seller** section (featured high-demand products)
- [x] **Top Saver** section (deep discount & value items)

---

## Phase 3: Cart Management & Checkout

### Cart Operations
- [ ] Slide-over / Modal Shopping Cart drawer
- [ ] Add, remove, and adjust item quantities dynamically
- [ ] Real-time total price and savings calculation

### Member Discount Integration
- [ ] Apply 15% new member coupon/discount automatically or via code
- [ ] Summary of item subtotal, discount, and grand total

---

## Phase 4: Membership & Customer Retention

### New Member Onboarding
- [ ] Simple member signup modal/form to claim 15% discount
- [ ] Member profile badge in header

---

## Phase 5: Technical & UI Design Foundation ✅

### Design System & Styling
- [x] Vibrant & fresh grocery color palette (Organic Modern Green Theme)
- [x] Responsive layout for desktop and mobile devices
- [x] Smooth micro-animations and interactive hover states
- [x] Design system documented in `DESIGN.md` (tokens, components, typography)

---

## Phase 6: Backend API & Data Layer ✅ (completed 2026-10-11)

### Database
- [x] SQLite schema — 7 tables: categories, products, product_images, product_variants, product_highlights, featured_brands, reviews
- [x] `migrate.ts` — idempotent schema creation (WAL mode, foreign keys ON)
- [x] `seed.ts` — 12 products, 8 categories, 4 featured brands, 24 variants, 24 reviews

### REST API (Next.js App Router)
- [x] `GET /api/catalog/home` — categories, featured brands, top-savers, best-sellers
- [x] `GET /api/categories` — all categories sorted by sort_order
- [x] `GET /api/products` — paginated list with `?q`, `?category`, `?collection`, `?page`, `?pageSize`
- [x] `GET /api/products/[productId]` — full detail: variants, images, highlights, related products
- [x] `GET /api/products/[productId]/reviews` — paginated reviews
- [x] `GET /api/openapi.json` — OpenAPI 3 spec
- [x] `GET /api/mermaid` — Mermaid erDiagram syntax

### API Documentation
- [x] Swagger UI at `/docs`
- [x] OpenAPI spec built in `src/lib/openapi.ts`

---

## Phase 7: Developer Experience ✅ (completed 2026-10-11)

### Testing
- [x] Vitest configured with 2 projects: `node` (backend) and `storybook` (browser)
- [x] `src/test/helpers.ts` — `createTestDb()` + `seedTestDb()` for in-memory SQLite tests
- [x] 62 tests across 7 test files — all routes + migrate covered
- [x] Tests use `vi.mock('@/lib/db')` — never touch `farmart.db`

### Developer Tools
- [x] `GET /mermaid` — interactive ER diagram page (mermaid.js via CDN)
- [x] `/onboarding` — seed data guide: categories, products, tables, API routes, checklist
- [x] `CLAUDE.md` — full project instructions for AI agents and developers
- [x] Kiro skill: `skill-creator` installed at `.kiro/skills/skill-creator/SKILL.md`

---

## Next Steps

- [ ] Phase 3: Cart drawer (add/remove/quantity, real-time total)
- [ ] Phase 4: Member signup modal + 15% discount coupon
- [ ] `POST /api/cart` — cart management endpoints
- [ ] `POST /api/orders` — checkout flow
- [ ] `POST /api/auth/signup` — member registration
- [ ] Write E2E tests (Playwright) for storefront flows
