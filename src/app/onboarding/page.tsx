"use client";

import Link from "next/link";
import {
  ShoppingBag,
  Database,
  Tag,
  Package,
  Star,
  Layers,
  Terminal,
  ChevronRight,
  CheckCircle2,
  Boxes,
  Sparkles,
  BookOpen,
  GitBranch,
  Zap,
  BarChart3,
  Users,
  ImageIcon,
  ArrowRight,
} from "lucide-react";

// ── Seed data mirror (for display only) ─────────────────────────────────────

const CATEGORIES = [
  { id: "fruits",  name: "Fruits & Vegetables",   icon: "🍎", productCount: 32, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  { id: "breads",  name: "Breads & Sweets",        icon: "🥖", productCount: 24, color: "text-amber-400   bg-amber-500/10   border-amber-500/20" },
  { id: "seafood", name: "Frozen Seafoods",         icon: "🦀", productCount: 18, color: "text-cyan-400    bg-cyan-500/10    border-cyan-500/20" },
  { id: "meats",   name: "Raw Meats",               icon: "🥩", productCount: 29, color: "text-rose-400    bg-rose-500/10    border-rose-500/20" },
  { id: "drinks",  name: "Wines & Alcohol Drinks",  icon: "🍷", productCount: 45, color: "text-purple-400  bg-purple-500/10  border-purple-500/20" },
  { id: "coffee",  name: "Coffees and Teas",        icon: "☕", productCount: 21, color: "text-orange-400  bg-orange-500/10  border-orange-500/20" },
  { id: "milks",   name: "Milks and Dairies",       icon: "🥛", productCount: 36, color: "text-sky-400     bg-sky-500/10     border-sky-500/20" },
  { id: "pets",    name: "Pet Foods",               icon: "🐶", productCount: 15, color: "text-lime-400    bg-lime-500/10    border-lime-500/20" },
];

const FEATURED_BRANDS = [
  { id: "fb-1", brand: "FOODPOUCH",   title: "New Snacks Release",              badge: "NEW",       badgeColor: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30" },
  { id: "fb-2", brand: "ITEA JSC",    title: "Happy Tea 100% Organic",          badge: "ORGANIC",   badgeColor: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  { id: "fb-3", brand: "SODA BRAND",  title: "Soda Can Box – 30% OFF",          badge: "-30% OFF",  badgeColor: "bg-rose-500/15 text-rose-300 border-rose-500/30" },
  { id: "fb-4", brand: "FARMART",     title: "Fresh Meat Sausage BUY 2 GET 1",  badge: "BUY 2 GET 1", badgeColor: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
];

const PRODUCTS = [
  { id: "british-beef-mince",  title: "British Beef Mince",          category: "meats",   price: 39.50, collection: "best-sellers", badge: "SALE -12%",   rating: 5, reviews: 45 },
  { id: "la-molisana-beef",    title: "La Molisana Beef x 24pcs",    category: "meats",   price: 49.50, collection: "top-savers",   badge: "SAVE $5.50",  rating: 5, reviews: 45 },
  { id: "fresh-salmon-fillet", title: "Fresh Salmon Fillet",         category: "seafood", price: 18.50, collection: "best-sellers", badge: "BESTSELLER",  rating: 5, reviews: 62 },
  { id: "yellow-watermelon",   title: "US Yellow Watermelon",        category: "fruits",  price: 5.50,  collection: "best-sellers", badge: "HOT",          rating: 5, reviews: 28 },
  { id: "spices-salted-snack", title: "Spices Seeds Salted Snack",   category: "fruits",  price: 2.90,  collection: "best-sellers", badge: "SALE -30%",   rating: 5, reviews: 15 },
  { id: "farmhouse-soft-white",title: "Farmhouse Soft White Bread",  category: "breads",  price: 12.70, collection: "top-savers",   badge: null,           rating: 5, reviews: 9  },
  { id: "oatmeal-crunchy",     title: "Oatmeal Crunchy Cookies",     category: "breads",  price: 29.60, collection: "best-sellers", badge: "NEW",          rating: 5, reviews: 34 },
  { id: "canned-rice-crab",    title: "Canned Rice With Fresh Crab", category: "seafood", price: 22.39, collection: "best-sellers", badge: "SAVE $5.6",   rating: 4, reviews: 22 },
  { id: "ice-geck-beer",       title: "Ice Geck Beer x 24pcs",       category: "drinks",  price: 22.35, collection: "top-savers",   badge: "-20%",         rating: 5, reviews: 34 },
  { id: "organic-whole-milk",  title: "Organic Whole Milk",          category: "milks",   price: 8.90,  collection: null,           badge: "ORGANIC",      rating: 4.8, reviews: 55 },
  { id: "happy-tea-organic",   title: "Happy Tea 100% Organic",      category: "coffee",  price: 29.90, collection: null,           badge: "ORGANIC",      rating: 5, reviews: 18 },
  { id: "premium-dog-food",    title: "Premium Dry Dog Food",        category: "pets",    price: 35.00, collection: null,           badge: "SALE -16%",   rating: 4.7, reviews: 88 },
];

const API_ROUTES = [
  { method: "GET", path: "/api/catalog/home",                       desc: "Categories, featured brands, top-savers, best-sellers",   tag: "catalog" },
  { method: "GET", path: "/api/categories",                         desc: "All product categories sorted by sort_order",              tag: "catalog" },
  { method: "GET", path: "/api/products",                           desc: "Paginated products with q / category / collection filter", tag: "products" },
  { method: "GET", path: "/api/products/[productId]",               desc: "Full product detail: variants, images, highlights",        tag: "products" },
  { method: "GET", path: "/api/products/[productId]/reviews",       desc: "Paginated reviews for a product",                          tag: "products" },
  { method: "GET", path: "/api/mermaid",                            desc: "Mermaid ER diagram syntax of the DB schema",               tag: "meta" },
  { method: "GET", path: "/api/openapi.json",                       desc: "Full OpenAPI 3 spec (Swagger-compatible)",                 tag: "meta" },
];

const DB_TABLES = [
  { name: "categories",         rows: 8,   pk: "id (TEXT)",    desc: "Product categories with icon, image, and sort order" },
  { name: "products",           rows: 12,  pk: "id (TEXT)",    desc: "Core product catalog with price, rating, collection" },
  { name: "product_images",     rows: 12,  pk: "id (INT)",     desc: "Additional gallery images per product" },
  { name: "product_variants",   rows: 24,  pk: "(id, product_id)", desc: "Size / weight variants with stock & price" },
  { name: "product_highlights", rows: 24,  pk: "id (INT)",     desc: "Key feature bullets shown on product detail" },
  { name: "featured_brands",    rows: 4,   pk: "id (TEXT)",    desc: "Homepage hero brand banners with badge" },
  { name: "reviews",            rows: 24,  pk: "id (TEXT)",    desc: "Customer reviews (2 per product, verified)" },
];

const QUICK_STEPS = [
  { step: "01", title: "Run the dev server", cmd: "npm run dev", desc: "Starts Next.js on http://localhost:3000" },
  { step: "02", title: "Seed the database",  cmd: "npm run db:seed", desc: "Populates farmart.db with all demo data" },
  { step: "03", title: "Run the tests",      cmd: "npx vitest run --project node", desc: "62 backend tests across 7 files" },
  { step: "04", title: "Open Swagger docs",  cmd: "open /docs", desc: "Interactive API explorer at /docs" },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function tagColor(tag: string) {
  if (tag === "catalog")  return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
  if (tag === "products") return "bg-purple-500/10 text-purple-400 border-purple-500/20";
  return "bg-slate-700/40 text-slate-400 border-slate-600/30";
}

function collectionPill(c: string | null) {
  if (c === "best-sellers") return <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/25 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300">⭐ best-sellers</span>;
  if (c === "top-savers")   return <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-300">💰 top-savers</span>;
  return <span className="inline-flex items-center gap-1 rounded-full border border-slate-700/50 bg-slate-800/50 px-1.5 py-0.5 text-[10px] text-slate-500">— none</span>;
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const totalProductCount = CATEGORIES.reduce((s, c) => s + c.productCount, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">

      {/* ── NAV ────────────────────────────────────────── */}
      <nav className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
          <Link href="/" className="group flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500 shadow-md shadow-cyan-500/30 transition-transform group-hover:scale-105">
              <ShoppingBag className="h-4 w-4 text-slate-950" />
            </span>
            <span className="text-lg font-bold tracking-tight text-slate-50">
              Farm<span className="text-cyan-400">art</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/docs" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/50 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-slate-100">
              <BookOpen className="h-3.5 w-3.5" /> API Docs
            </Link>
            <Link href="/mermaid" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/50 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-slate-100">
              <GitBranch className="h-3.5 w-3.5" /> DB Schema
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-10 lg:px-8">

        {/* ── HERO ─────────────────────────────────────── */}
        <section className="mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-3 py-1 text-xs font-semibold tracking-widest text-cyan-400 uppercase">
            <Sparkles className="h-3 w-3" /> Developer Onboarding
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-50">
            Farmart Seed&nbsp;
            <span className="bg-gradient-to-r from-cyan-400 to-sky-400 bg-clip-text text-transparent">
              Data Guide
            </span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
            ภาพรวมของ seed data ทั้งหมดที่ถูก inject เข้า <code className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-xs text-cyan-400">farmart.db</code> เพื่อให้คุณเริ่ม development ได้ทันที — ครอบคลุม categories, products, API routes, และ database schema
          </p>

          {/* Stats bar */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { icon: Tag,      label: "Categories",     value: CATEGORIES.length,           color: "text-cyan-400" },
              { icon: Package,  label: "Seed Products",  value: PRODUCTS.length,             color: "text-purple-400" },
              { icon: Database, label: "DB Tables",      value: DB_TABLES.length,            color: "text-emerald-400" },
              { icon: Zap,      label: "API Routes",     value: API_ROUTES.length,           color: "text-amber-400" },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="flex items-center gap-3 rounded-xl border border-slate-800/80 bg-slate-900/90 p-4 shadow-md">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 ${color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-50">{value}</p>
                  <p className="text-xs text-slate-500">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── QUICK START ───────────────────────────────── */}
        <section className="mb-12">
          <SectionHeader icon={Terminal} title="Quick Start" subtitle="รันคำสั่งเหล่านี้เพื่อเริ่ม project" />
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {QUICK_STEPS.map((s) => (
              <div key={s.step} className="group rounded-xl border border-slate-800/80 bg-slate-900/90 p-4 shadow-md transition-all duration-200 hover:border-slate-700 hover:shadow-cyan-500/5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-cyan-500">{s.step}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-600 transition-colors group-hover:text-cyan-500" />
                </div>
                <p className="mb-1 text-sm font-medium text-slate-100">{s.title}</p>
                <code className="mb-2 block rounded-md border border-slate-700/50 bg-slate-950 px-2.5 py-1.5 font-mono text-xs text-cyan-300">
                  {s.cmd}
                </code>
                <p className="text-xs text-slate-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CATEGORIES ────────────────────────────────── */}
        <section className="mb-12">
          <SectionHeader icon={Tag} title="Categories (8)" subtitle={`รวม ${totalProductCount.toLocaleString()} products ทั้งหมดใน catalog`} />
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((cat) => (
              <div key={cat.id} className={`flex items-center gap-3 rounded-xl border bg-slate-900/90 p-4 shadow-md transition-all duration-200 hover:shadow-md ${cat.color.split(" ").filter(c => c.startsWith("border")).join(" ")}`}>
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-xl ${cat.color}`}>
                  {cat.icon}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-100">{cat.name}</p>
                  <p className="text-xs text-slate-500">
                    id: <code className="font-mono text-cyan-400">{cat.id}</code>
                  </p>
                  <p className="text-xs text-slate-500">{cat.productCount} products</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURED BRANDS ───────────────────────────── */}
        <section className="mb-12">
          <SectionHeader icon={Sparkles} title="Featured Brands (4)" subtitle="แสดงใน homepage hero banner" />
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURED_BRANDS.map((b) => (
              <div key={b.id} className="rounded-xl border border-slate-800/80 bg-slate-900/90 p-4 shadow-md">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <p className="font-mono text-xs font-bold tracking-wider text-slate-400">{b.brand}</p>
                  <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold ${b.badgeColor}`}>{b.badge}</span>
                </div>
                <p className="text-sm font-medium leading-snug text-slate-100">{b.title}</p>
                <p className="mt-1.5 text-xs text-slate-500">id: <code className="font-mono text-cyan-400">{b.id}</code></p>
              </div>
            ))}
          </div>
        </section>

        {/* ── PRODUCTS ──────────────────────────────────── */}
        <section className="mb-12">
          <SectionHeader icon={Package} title="Seed Products (12)" subtitle="ทุก product มี 2 variants, 2 highlights, 1 image, และ 2 reviews" />
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/90 shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-left">
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">ID</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Title</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Category</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">Price</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Collection</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Badge</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {PRODUCTS.map((p, i) => (
                    <tr key={p.id} className={`border-b border-slate-800/50 transition-colors hover:bg-slate-800/40 ${i % 2 === 0 ? "" : "bg-slate-800/10"}`}>
                      <td className="px-4 py-3">
                        <code className="font-mono text-xs text-cyan-400">{p.id}</code>
                      </td>
                      <td className="px-4 py-3 text-xs font-medium text-slate-200">{p.title}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 rounded-md border border-slate-700/50 bg-slate-800/50 px-2 py-0.5 text-xs text-slate-400">
                          {CATEGORIES.find(c => c.id === p.category)?.icon} {p.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs font-semibold text-emerald-400">
                        ${p.price.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">{collectionPill(p.collection)}</td>
                      <td className="px-4 py-3">
                        {p.badge ? (
                          <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-300">{p.badge}</span>
                        ) : (
                          <span className="text-xs text-slate-600">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs text-slate-300">{p.rating}</span>
                          <span className="text-xs text-slate-600">({p.reviews})</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sub-data note */}
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {[
              { icon: Layers,    label: "Variants per product",  value: "2",  note: "Default unit + Bulk x2" },
              { icon: ImageIcon, label: "Images per product",    value: "1",  note: "Main image (Unsplash)" },
              { icon: Users,     label: "Reviews per product",   value: "2",  note: "Alice M. ★5 + Bob K. ★4" },
            ].map(({ icon: Icon, label, value, note }) => (
              <div key={label} className="flex items-center gap-3 rounded-lg border border-slate-800/60 bg-slate-900/50 px-4 py-3">
                <Icon className="h-4 w-4 shrink-0 text-slate-500" />
                <div>
                  <span className="font-mono text-sm font-bold text-slate-200">{value} </span>
                  <span className="text-xs text-slate-400">{label}</span>
                  <p className="text-xs text-slate-600">{note}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── DATABASE SCHEMA ───────────────────────────── */}
        <section className="mb-12">
          <SectionHeader icon={Database} title="Database Schema (7 tables)" subtitle={`SQLite · farmart.db · WAL mode · foreign_keys ON`} />
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {DB_TABLES.map((t) => (
              <div key={t.name} className="rounded-xl border border-slate-800/80 bg-slate-900/90 p-4 shadow-md">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <code className="font-mono text-sm font-bold text-cyan-400">{t.name}</code>
                  <span className="shrink-0 rounded-md border border-slate-700/50 bg-slate-800/60 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
                    ~{t.rows} rows
                  </span>
                </div>
                <p className="mb-1.5 text-xs leading-relaxed text-slate-400">{t.desc}</p>
                <p className="text-[11px] text-slate-600">PK: <code className="text-slate-500">{t.pk}</code></p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Link href="/mermaid" className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/50 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors">
              <GitBranch className="h-3.5 w-3.5 text-cyan-400" /> View ER Diagram
            </Link>
            <span className="text-xs text-slate-600">→ /mermaid renders an interactive entity-relationship diagram</span>
          </div>
        </section>

        {/* ── API ROUTES ────────────────────────────────── */}
        <section className="mb-12">
          <SectionHeader icon={Zap} title="API Routes (7)" subtitle="Next.js App Router · all read-only GET endpoints" />
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/90 shadow-md">
            {API_ROUTES.map((r, i) => (
              <div key={r.path} className={`flex flex-wrap items-start gap-3 px-4 py-3.5 transition-colors hover:bg-slate-800/40 ${i < API_ROUTES.length - 1 ? "border-b border-slate-800/50" : ""}`}>
                <span className="shrink-0 rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 font-mono text-xs font-bold text-emerald-400">
                  {r.method}
                </span>
                <code className="shrink-0 font-mono text-sm text-slate-200">{r.path}</code>
                <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${tagColor(r.tag)}`}>{r.tag}</span>
                <span className="text-xs text-slate-500 leading-relaxed">{r.desc}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Link href="/docs" className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/50 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors">
              <BookOpen className="h-3.5 w-3.5 text-cyan-400" /> Open Swagger UI
            </Link>
            <span className="text-xs text-slate-600">→ /docs เปิด interactive API explorer</span>
          </div>
        </section>

        {/* ── CHECKLIST ────────────────────────────────── */}
        <section className="mb-12">
          <SectionHeader icon={CheckCircle2} title="Onboarding Checklist" subtitle="สิ่งที่ต้องทำก่อนเริ่ม development" />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { done: true,  text: "Schema migrated — ตาราง 7 ตารางถูกสร้างแล้ว",                    note: "migrate() runs automatically on API boot" },
              { done: true,  text: "Seed data inserted — 12 products + 8 categories พร้อมใช้งาน",     note: "npm run db:seed" },
              { done: true,  text: "API routes พร้อม — GET endpoints ทุกตัวทำงานได้",                note: "/api/catalog/home, /api/products, ..." },
              { done: true,  text: "Tests ผ่าน — 62 tests ใน 7 test files",                           note: "npx vitest run --project node" },
              { done: true,  text: "OpenAPI spec สร้างแล้ว — ดูได้ที่ /docs",                        note: "/api/openapi.json" },
              { done: true,  text: "Mermaid ER diagram พร้อม — ดูได้ที่ /mermaid",                  note: "/api/mermaid" },
              { done: false, text: "เพิ่ม feature ใหม่ตาม PLAN.md หรือ DESIGN.md",                 note: "อ่าน DESIGN.md ก่อนเขียน UI" },
              { done: false, text: "เพิ่ม POST/PATCH endpoints (cart, checkout, user auth)",          note: "ยังไม่มี write API" },
            ].map((item, i) => (
              <div key={i} className={`flex items-start gap-3 rounded-xl border p-4 ${item.done ? "border-emerald-500/20 bg-emerald-500/5" : "border-slate-800/80 bg-slate-900/90"}`}>
                <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${item.done ? "text-emerald-400" : "text-slate-700"}`} />
                <div>
                  <p className={`text-sm font-medium ${item.done ? "text-slate-200" : "text-slate-500"}`}>{item.text}</p>
                  <p className="mt-0.5 text-xs text-slate-600">{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FOOTER CTA ───────────────────────────────── */}
        <section className="rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-sky-500/5 p-8 text-center shadow-md shadow-cyan-500/5">
          <BarChart3 className="mx-auto mb-3 h-8 w-8 text-cyan-400" />
          <h2 className="text-xl font-semibold text-slate-50">พร้อมเริ่ม Development แล้ว</h2>
          <p className="mt-1.5 text-sm text-slate-400">database มี seed data ครบแล้ว API routes พร้อมใช้ทันที</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/" className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-md shadow-cyan-500/30 transition-all hover:bg-cyan-400">
              เปิด Storefront <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/docs" className="inline-flex items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-800 px-5 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-700">
              <Boxes className="h-4 w-4" /> API Explorer
            </Link>
            <Link href="/mermaid" className="inline-flex items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-800 px-5 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-700">
              <GitBranch className="h-4 w-4" /> ER Diagram
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}

// ── Section Header component ──────────────────────────────────────────────────

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-700/50 bg-slate-800">
        <Icon className="h-4 w-4 text-cyan-400" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}
