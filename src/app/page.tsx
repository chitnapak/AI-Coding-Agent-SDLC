"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Search,
  PhoneCall,
  User,
  Heart,
  ShoppingBag,
  Menu,
  ChevronDown,
  Zap,
  Clock,
  ChevronLeft,
  ChevronRight,
  Star,
  Plus,
  Minus,
  CheckCircle2,
  Truck,
  RotateCcw,
  ShieldCheck,
  Headphones,
  Sparkles,
  ArrowRight,
  Loader2,
  X,
} from "lucide-react";

// ── API types ─────────────────────────────────────────────────────────────────
interface Category {
  id: string;
  name: string;
  icon?: string;
  imageUrl?: string;
  productCount: number;
}

interface FeaturedBrand {
  id: string;
  brand: string;
  title: string;
  badge?: string;
  imageUrl?: string;
}

interface ProductCard {
  id: string;
  title: string;
  brand?: string;
  category?: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  unit?: string;
  rating?: number;
  badge?: string;
  imageUrl?: string;
}

interface HomeCatalog {
  categories: Category[];
  featuredBrands: FeaturedBrand[];
  topSavers: ProductCard[];
  bestSellers: ProductCard[];
}

interface ProductPage {
  items: ProductCard[];
  pageInfo: { page: number; pageSize: number; total: number };
}



export default function Home() {
  // ── UI state ──────────────────────────────────────────────────────────────
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeTab, setActiveTab] = useState("All");
  const [featuredQty, setFeaturedQty] = useState(1);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // ── API data state ────────────────────────────────────────────────────────
  const [catalog, setCatalog] = useState<HomeCatalog | null>(null);
  const [searchResults, setSearchResults] = useState<ProductPage | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ── Countdown timer ───────────────────────────────────────────────────────
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 25, seconds: 37 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // ── Fetch home catalog ────────────────────────────────────────────────────
  useEffect(() => {
    async function loadCatalog() {
      setIsLoading(true);
      try {
        const r = await fetch("/api/catalog/home");
        const data: HomeCatalog = await r.json();
        setCatalog(data);
      } finally {
        setIsLoading(false);
      }
    }
    void loadCatalog();
  }, []);

  // ── Search ────────────────────────────────────────────────────────────────
  const doSearch = useCallback(async (q: string, categoryId?: string) => {
    if (!q.trim() && !categoryId) {
      setSearchResults(null);
      return;
    }
    setIsSearching(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (categoryId && categoryId !== "all") params.set("category", categoryId);
    params.set("pageSize", "24");
    try {
      const res = await fetch(`/api/products?${params.toString()}`);
      const data: ProductPage = await res.json();
      setSearchResults(data);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    showToast(`Searching for "${searchQuery}"…`);
    doSearch(searchQuery);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleCategoryClick = (cat: Category) => {
    setSelectedCategory(cat.name);
    showToast(`Browsing: ${cat.name}`);
    doSearch(searchQuery, cat.id);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults(null);
    setSelectedCategory("All");
  };

  // ── Toast ─────────────────────────────────────────────────────────────────
  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddToCart = (itemTitle: string, price: number, qty = 1) => {
    setCartCount(prev => prev + qty);
    setCartTotal(prev => +(prev + price * qty).toFixed(2));
    showToast(`Added ${qty}x "${itemTitle}" to cart!`);
  };

  // ── Derived data ──────────────────────────────────────────────────────────
  const categories = catalog?.categories ?? [];
  const featuredBrands = catalog?.featuredBrands ?? [];
  const topSaverProducts = catalog?.topSavers ?? [];
  const bestSellerProducts = catalog?.bestSellers ?? [];

  const filteredBestSellers =
    activeTab === "All"
      ? bestSellerProducts
      : bestSellerProducts.filter(p => p.category === activeTab);

  const uniqueBestSellerTabs = [
    "All",
    ...Array.from(new Set(bestSellerProducts.map(p => p.category).filter(Boolean))),
  ] as string[];

  const featuredTopSaver = topSaverProducts[0];
  const remainingTopSavers = topSaverProducts.slice(1, 4);

  // ── Loading state ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <Loader2 className="w-10 h-10 animate-spin text-[#fab528]" />
          <span className="text-sm font-medium">Loading Farmart…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#222222] font-sans antialiased selection:bg-[#fab528]/30">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#166534] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#fab528]" />
          <span className="font-medium text-sm">{notification}</span>
        </div>
      )}

      {/* 1. TOP HEADER */}
      <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-40 shadow-xs">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-[#fab528] flex items-center justify-center text-white shadow-md shadow-[#fab528]/30 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-6 h-6 text-black" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-gray-900 leading-none">
                Farm<span className="text-[#fab528]">art</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#2b783c]">
                GROCERY STORE
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-2 lg:mx-8">
            <div className="relative flex items-center border-2 border-[#fab528] rounded-full overflow-hidden bg-white shadow-xs">
              <div className="hidden sm:flex items-center px-4 bg-gray-50 border-r border-gray-200 text-xs font-bold text-gray-700 whitespace-nowrap cursor-pointer hover:bg-gray-100 transition-colors">
                <span>ALL CATEGORIES</span>
                <ChevronDown className="w-3.5 h-3.5 ml-1.5 text-gray-500" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="I'm searching for..."
                className="w-full px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-hidden"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="px-2 text-gray-400 hover:text-gray-700 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={handleSearch}
                className="bg-[#fab528] hover:bg-[#e99e02] text-black px-5 py-2.5 transition-colors flex items-center justify-center font-medium"
              >
                {isSearching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Contact Support & User Actions */}
          <div className="flex items-center gap-5 lg:gap-7">
            {/* Phone Support */}
            <div className="hidden xl:flex items-center gap-2.5 text-left border-r border-gray-200 pr-6">
              <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center text-[#fab528]">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900 leading-tight">8 800 332 65-66</div>
                <div className="text-[11px] text-gray-500 font-medium">Support 24/7</div>
              </div>
            </div>

            {/* Account */}
            <button className="flex items-center gap-1.5 text-gray-700 hover:text-[#fab528] transition-colors cursor-pointer">
              <User className="w-5 h-5" />
              <span className="hidden md:inline text-xs font-semibold">Account</span>
            </button>

            {/* Wishlist */}
            <button className="relative text-gray-700 hover:text-red-500 transition-colors cursor-pointer">
              <Heart className="w-5 h-5" />
              <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                2
              </span>
            </button>

            {/* Cart */}
            <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => showToast("Cart preview opened")}>
              <div className="relative">
                <ShoppingBag className="w-6 h-6 text-gray-800 group-hover:text-[#fab528] transition-colors" />
                <span className="absolute -top-1.5 -right-2 bg-[#fab528] text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[10px] uppercase font-bold text-gray-400 leading-none">Your Cart</span>
                <span className="text-xs font-extrabold text-gray-900">${cartTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

        </div>

        {/* 2. NAVIGATION BAR */}
        <div className="border-t border-gray-100 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8 flex items-center justify-between">
            
            {/* Shop by Category Button */}
            <div className="relative">
              <button
                onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
                className="bg-[#fab528] hover:bg-[#e99e02] text-gray-950 font-extrabold text-xs uppercase px-5 py-3 flex items-center gap-2.5 rounded-t-md transition-colors tracking-wide"
              >
                <Menu className="w-4 h-4" />
                <span>SHOP BY CATEGORY</span>
                <ChevronDown className={`w-3.5 h-3.5 ml-3 transition-transform ${categoryMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu */}
              {categoryMenuOpen && (
                <div className="absolute top-full left-0 w-64 bg-white border border-gray-200 shadow-xl rounded-b-xl z-50 py-2 divide-y divide-gray-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setCategoryMenuOpen(false);
                        handleCategoryClick(cat);
                      }}
                      className="w-full px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-amber-50 hover:text-[#fab528] flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="text-base">{cat.icon}</span>
                        {cat.name}
                      </span>
                      <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">{cat.productCount}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation links */}
            <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-gray-700 tracking-tight">
              <a href="#" className="flex items-center gap-1 text-[#e99e02] hover:text-[#fab528] transition-colors py-3">
                <Zap className="w-3.5 h-3.5 fill-[#fab528]" />
                Deals Today
              </a>
              <a href="#" className="hover:text-[#fab528] transition-colors py-3">Special Prices</a>
              <a href="#" className="flex items-center gap-1 hover:text-[#fab528] transition-colors py-3">
                Fresh <ChevronDown className="w-3 h-3 text-gray-400" />
              </a>
              <a href="#" className="flex items-center gap-1 hover:text-[#fab528] transition-colors py-3">
                Frozen <ChevronDown className="w-3 h-3 text-gray-400" />
              </a>
              <a href="#" className="flex items-center gap-1 hover:text-[#fab528] transition-colors py-3">
                Shop <ChevronDown className="w-3 h-3 text-gray-400" />
              </a>
            </nav>

            {/* Recently Viewed */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-[#fab528] cursor-pointer transition-colors py-3">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>Recently Viewed</span>
            </div>

          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-[1400px] mx-auto px-4 lg:px-8 py-6 space-y-10">

        {/* ── SEARCH RESULTS OVERLAY ────────────────────────────────────────── */}
        {searchResults !== null && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-gray-900">
                  {searchQuery
                    ? `Results for "${searchQuery}"`
                    : `Category: ${selectedCategory}`}
                </h2>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                  {searchResults.pageInfo.total} items
                </span>
                {isSearching && <Loader2 className="w-4 h-4 animate-spin text-[#fab528]" />}
              </div>
              <button
                onClick={clearSearch}
                className="text-xs font-bold text-gray-500 hover:text-[#fab528] flex items-center gap-1 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            </div>

            {searchResults.items.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No products found</p>
                <p className="text-xs mt-1">Try a different search term or category</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {searchResults.items.map((product) => (
                  <ProductCardUI
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── HERO BANNER SECTION ───────────────────────────────────────────── */}
        {!searchResults && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Main Large Hero Banner (8 cols) */}
            <div className="lg:col-span-8 relative overflow-hidden rounded-2xl bg-[#eaf1f6] p-8 md:p-12 flex flex-col justify-between min-h-[360px] border border-blue-100/60 shadow-xs group">
              <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#166534_1px,transparent_1px)] [background-size:16px_16px]"></div>
              
              <div className="relative z-10 max-w-md space-y-3">
                <span className="inline-block px-3 py-1 bg-white/80 backdrop-blur-xs text-[#2b783c] text-xs font-bold rounded-full uppercase tracking-wider">
                  Summer Refresh 2026
                </span>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                  Active Summer With <br />
                  <span className="text-[#2b783c]">Juice Milk 300ml</span>
                </h1>
                <p className="text-xs md:text-sm text-gray-600 font-medium leading-relaxed">
                  New arrivals with maltese fruits, juice milk, essential for summer. Fresh vitamins packed directly for you.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => showToast("Navigating to Juice Milk Collection")}
                    className="bg-white hover:bg-gray-900 hover:text-white text-gray-900 text-xs font-extrabold px-7 py-3 rounded-full shadow-md hover:shadow-lg transition-all transform active:scale-95"
                  >
                    Shop Now
                  </button>
                </div>
              </div>

              <div className="absolute right-2 md:right-8 bottom-0 md:bottom-4 w-52 md:w-80 lg:w-96 h-full flex items-end justify-end pointer-events-none">
                <div className="relative w-full h-4/5">
                  <Image
                    src="https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80"
                    alt="Juice Milk Mockup"
                    fill
                    className="object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              <div className="relative z-10 flex items-center gap-2 pt-6">
                <button className="w-7 h-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-gray-600 hover:text-black shadow-xs">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-gray-700 bg-white/70 px-2 py-0.5 rounded-md">1 / 3</span>
                <button className="w-7 h-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-gray-600 hover:text-black shadow-xs">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Promo Banner (4 cols) */}
            <div className="lg:col-span-4 relative overflow-hidden rounded-2xl bg-[#fab528] p-8 flex flex-col justify-between min-h-[360px] shadow-xs group">
              <div className="relative z-10 space-y-2">
                <span className="text-xs font-black uppercase tracking-widest text-black/70">SPECIAL PROMO</span>
                <h2 className="text-3xl font-black text-gray-950 leading-tight">
                  20% SALE OFF
                </h2>
                <p className="text-xs text-gray-800 font-medium">
                  Synthetic seeds Net 2.0 OZ
                </p>
                <div className="pt-3">
                  <button
                    onClick={() => showToast("Promo claim applied!")}
                    className="bg-white hover:bg-gray-900 hover:text-white text-gray-900 text-xs font-extrabold px-6 py-2.5 rounded-full shadow-md transition-all active:scale-95"
                  >
                    Shop Now
                  </button>
                </div>
              </div>

              <div className="relative w-full h-44 mt-4 flex items-end justify-center">
                <Image
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80"
                  alt="20% Sale Off Box"
                  fill
                  className="object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </section>
        )}

        {/* ── BROWSE BY CATEGORY ────────────────────────────────────────────── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-900">Browse by Category</h2>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={clearSearch} className="text-xs font-bold text-gray-500 hover:text-[#fab528] flex items-center transition-colors">
                All Categories <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
              <div className="flex items-center gap-1">
                <button className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-3.5">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat)}
                className={`p-4 rounded-xl border border-gray-100 bg-white flex flex-col items-center text-center cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${
                  selectedCategory === cat.name ? "border-[#fab528] ring-2 ring-[#fab528]/20 bg-amber-50/20" : ""
                }`}
              >
                <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mb-3 shadow-inner relative overflow-hidden group">
                  <span className="text-2xl z-10 group-hover:scale-125 transition-transform">{cat.icon}</span>
                </div>
                <h3 className="text-xs font-bold text-gray-800 leading-snug line-clamp-2 h-8 flex items-center">
                  {cat.name}
                </h3>
                <span className="text-[10px] text-gray-400 mt-1 font-medium">{cat.productCount} Items</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURED BRANDS (4 Banners) ───────────────────────────────────── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-xl font-bold text-gray-900">Featured Brands</h2>
            <a href="#" className="text-xs font-bold text-gray-500 hover:text-[#fab528] flex items-center transition-colors">
              All Offers <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredBrands.map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-xs hover:shadow-lg transition-all duration-300"
              >
                <div className="relative w-full h-36 rounded-lg overflow-hidden mb-3 bg-gray-100">
                  {item.imageUrl && (
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  )}
                  {item.badge && (
                    <span className="absolute top-2 left-2 bg-black/75 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-sm uppercase tracking-wider backdrop-blur-xs">
                      {item.badge}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">{item.brand}</span>
                  <h4 className="text-xs font-bold text-gray-900 line-clamp-2 group-hover:text-[#fab528] transition-colors leading-tight">
                    {item.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── TOP SAVER TODAY ───────────────────────────────────────────────── */}
        <section className="space-y-4">
          {/* Header with Countdown */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <div className="flex items-center gap-4 flex-wrap">
              <h2 className="text-xl font-bold text-gray-900">Top Saver Today</h2>
              
              {/* Countdown badge */}
              <div className="flex items-center gap-2 bg-[#fbe7e7] text-[#dc2626] px-3 py-1 rounded-md text-xs font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>Expires in:</span>
                <div className="flex items-center gap-1 font-mono font-black">
                  <span className="bg-[#dc2626] text-white px-1.5 py-0.5 rounded text-[11px]">{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span>:</span>
                  <span className="bg-[#dc2626] text-white px-1.5 py-0.5 rounded text-[11px]">{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span>:</span>
                  <span className="bg-[#dc2626] text-white px-1.5 py-0.5 rounded text-[11px]">{String(timeLeft.seconds).padStart(2, '0')}</span>
                </div>
              </div>
            </div>

            <a href="#" className="text-xs font-bold text-gray-500 hover:text-[#fab528] flex items-center transition-colors">
              All Offers <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            
            {/* Left Big Highlight Deal (4 cols) */}
            {featuredTopSaver && (
              <div className="lg:col-span-4 rounded-2xl border-2 border-[#fab528] bg-white p-5 flex flex-col justify-between shadow-xs relative">
                <button className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>

                <div>
                  {/* Product Image */}
                  <div className="relative w-full h-52 mb-4">
                    {featuredTopSaver.imageUrl && (
                      <Image
                        src={featuredTopSaver.imageUrl}
                        alt={featuredTopSaver.title}
                        fill
                        className="object-contain"
                      />
                    )}
                    {featuredTopSaver.badge && (
                      <span className="absolute top-0 left-0 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">
                        {featuredTopSaver.badge}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wide">{featuredTopSaver.brand}</span>
                    <h3 className="text-base font-extrabold text-gray-900 leading-tight">
                      {featuredTopSaver.title}
                    </h3>

                    {/* Rating Stars */}
                    {featuredTopSaver.rating && (
                      <div className="flex items-center gap-1">
                        {[...Array(Math.round(featuredTopSaver.rating))].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-[#fab528] text-[#fab528]" />
                        ))}
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-2xl font-black text-gray-900">${featuredTopSaver.price.toFixed(2)}</span>
                      {featuredTopSaver.compareAtPrice && (
                        <span className="text-sm text-gray-400 line-through">${featuredTopSaver.compareAtPrice.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quantity Selector & Add To Cart */}
                <div className="pt-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                      <button
                        onClick={() => setFeaturedQty(Math.max(1, featuredQty - 1))}
                        className="px-2.5 py-1 text-gray-600 hover:bg-gray-200 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-gray-900">{featuredQty}</span>
                      <button
                        onClick={() => setFeaturedQty(featuredQty + 1)}
                        className="px-2.5 py-1 text-gray-600 hover:bg-gray-200 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Price</span>
                      <span className="text-sm font-extrabold text-gray-900">${(featuredTopSaver.price * featuredQty).toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddToCart(featuredTopSaver.title, featuredTopSaver.price, featuredQty)}
                    className="w-full bg-[#fab528] hover:bg-[#e99e02] text-gray-950 font-extrabold text-xs uppercase py-3 rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add To Cart
                  </button>
                </div>
              </div>
            )}

            {/* Center Top Saver Product Cards (5 cols) */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
              {remainingTopSavers.map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-xl border border-gray-100 bg-white flex flex-col sm:flex-col lg:flex-row items-center gap-4 hover:shadow-md transition-all group"
                >
                  <div className="relative w-28 h-28 shrink-0 bg-gray-50 rounded-lg p-2">
                    {p.imageUrl && (
                      <Image
                        src={p.imageUrl}
                        alt={p.title}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform"
                      />
                    )}
                    {p.badge && (
                      <span className="absolute top-1 left-1 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded">
                        {p.badge}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 space-y-1.5 w-full">
                    <span className="text-[10px] font-extrabold uppercase text-gray-400">{p.brand}</span>
                    <h4 className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-[#fab528] transition-colors">
                      {p.title}
                    </h4>

                    {p.rating && (
                      <div className="flex items-center gap-1">
                        {[...Array(Math.round(p.rating))].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-[#fab528] text-[#fab528]" />
                        ))}
                      </div>
                    )}

                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-black text-gray-900">${p.price.toFixed(2)}</span>
                      {p.compareAtPrice && (
                        <span className="text-xs text-gray-400 line-through">${p.compareAtPrice.toFixed(2)}</span>
                      )}
                    </div>

                    <button
                      onClick={() => handleAddToCart(p.title, p.price)}
                      className="w-full bg-gray-100 hover:bg-[#fab528] hover:text-gray-950 text-gray-700 font-bold text-[11px] py-1.5 rounded-md transition-all flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Member Sign Up 15% OFF Box (3 cols) */}
            <div className="lg:col-span-3 rounded-2xl bg-[#faf6eb] border border-amber-100 p-6 flex flex-col justify-between shadow-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 opacity-15 pointer-events-none">
                <Sparkles className="w-full h-full text-amber-600" />
              </div>

              <div className="relative z-10 space-y-2 text-center">
                <h3 className="text-3xl font-black text-gray-900 tracking-tight">15% OFF</h3>
                <p className="text-xs text-gray-600 font-medium">
                  For new member sign up at the first time
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  showToast("Registration successful! 15% OFF coupon sent.");
                }}
                className="relative z-10 space-y-2.5 my-4"
              >
                <input
                  type="email"
                  required
                  placeholder="your@mail.com"
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:outline-hidden focus:border-[#fab528]"
                />
                <input
                  type="password"
                  required
                  placeholder="Password"
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:outline-hidden focus:border-[#fab528]"
                />
                <input
                  type="password"
                  required
                  placeholder="Re-type Password"
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:outline-hidden focus:border-[#fab528]"
                />
                <button
                  type="submit"
                  className="w-full bg-[#fab528] hover:bg-[#e99e02] text-gray-950 font-extrabold text-xs uppercase py-3 rounded-lg shadow-sm transition-all"
                >
                  Register Now
                </button>
              </form>

              <div className="text-[10px] text-center text-gray-400 font-medium">
                By signing up, you agree to our Terms &amp; Privacy Policy.
              </div>
            </div>

          </div>
        </section>

        {/* ── BEST SELLER ───────────────────────────────────────────────────── */}
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <h2 className="text-xl font-bold text-gray-900">Best Seller</h2>
            
            {/* Category Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
              {uniqueBestSellerTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === tab
                      ? "bg-[#fab528] text-gray-950 font-extrabold"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {filteredBestSellers.map((product) => (
              <ProductCardUI
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </section>

        {/* ── FEATURES & TRUST BADGES ───────────────────────────────────────── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-white border border-gray-100">
            <div className="w-11 h-11 rounded-full bg-amber-50 text-[#fab528] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-gray-900">Free Delivery</h4>
              <p className="text-[11px] text-gray-500">For all orders over $99</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-white border border-gray-100">
            <div className="w-11 h-11 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-gray-900">90 Days Return</h4>
              <p className="text-[11px] text-gray-500">If goods have problems</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-white border border-gray-100">
            <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-gray-900">100% Secure Payment</h4>
              <p className="text-[11px] text-gray-500">Guaranteed safe checkout</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-white border border-gray-100">
            <div className="w-11 h-11 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-gray-900">24/7 Dedicated Support</h4>
              <p className="text-[11px] text-gray-500">Anywhere &amp; anytime assistance</p>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="w-full bg-[#1e2229] text-gray-300 mt-16 pt-12 pb-8 text-xs">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Col 1 */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#fab528] flex items-center justify-center text-black">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <span className="text-xl font-black text-white">Farm<span className="text-[#fab528]">art</span></span>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
                Farmart is your friendly neighborhood organic &amp; grocery supermarket, bringing farm-fresh goods, organic vegetables, and pantry essentials right to your doorstep.
              </p>
              <div className="text-xs text-gray-400 space-y-1">
                <div>Hotline: <strong className="text-white">8 800 332 65-66</strong></div>
                <div>Email: <strong className="text-white">contact@farmart-market.com</strong></div>
              </div>
            </div>

            {/* Col 2 */}
            <div className="space-y-3">
              <h4 className="text-white font-bold uppercase tracking-wider text-xs">Categories</h4>
              <ul className="space-y-2 text-gray-400">
                {categories.slice(0, 5).map(cat => (
                  <li key={cat.id}>
                    <button
                      onClick={() => handleCategoryClick(cat)}
                      className="hover:text-[#fab528] transition-colors text-left"
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3 */}
            <div className="space-y-3">
              <h4 className="text-white font-bold uppercase tracking-wider text-xs">Customer Care</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-[#fab528] transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-[#fab528] transition-colors">Track Your Order</a></li>
                <li><a href="#" className="hover:text-[#fab528] transition-colors">Returns &amp; Refunds</a></li>
                <li><a href="#" className="hover:text-[#fab528] transition-colors">Shipping Info</a></li>
                <li><a href="#" className="hover:text-[#fab528] transition-colors">Contact Us</a></li>
              </ul>
            </div>

            {/* Col 4 */}
            <div className="space-y-3">
              <h4 className="text-white font-bold uppercase tracking-wider text-xs">Newsletter</h4>
              <p className="text-gray-400 text-[11px]">
                Subscribe to get 15% discount on your first order and stay updated with weekly deals.
              </p>
              <div className="flex rounded-lg overflow-hidden border border-gray-700">
                <input
                  type="email"
                  placeholder="Enter your email..."
                  className="px-3 py-2 bg-gray-800 text-xs text-white placeholder-gray-500 focus:outline-hidden w-full"
                />
                <button
                  onClick={() => showToast("Subscribed to newsletter!")}
                  className="bg-[#fab528] hover:bg-[#e99e02] text-black font-bold px-3 text-xs"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-gray-500 text-[11px] gap-3">
            <div>© 2026 Farmart - Organic &amp; Grocery Supermarket. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Cookie Preferences</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ── Reusable Product Card Component ──────────────────────────────────────────
function ProductCardUI({
  product,
  onAddToCart,
}: {
  product: ProductCard;
  onAddToCart: (title: string, price: number, qty?: number) => void;
}) {
  return (
    <div className="p-3.5 rounded-xl border border-gray-100 bg-white flex flex-col justify-between hover:shadow-lg transition-all duration-300 group relative">
      {/* Wishlist Icon */}
      <button className="absolute top-2 right-2 text-gray-300 hover:text-red-500 transition-colors z-10">
        <Heart className="w-4 h-4" />
      </button>

      <div>
        {/* Image */}
        <div className="relative w-full h-32 mb-3 bg-gray-50/50 rounded-lg p-2">
          {product.imageUrl && (
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              className="object-contain group-hover:scale-110 transition-transform duration-300"
            />
          )}
          {product.badge && (
            <span className="absolute top-1 left-1 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded">
              {product.badge}
            </span>
          )}
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase text-gray-400">{product.brand}</span>
          <h4 className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-[#fab528] transition-colors h-8">
            {product.title}
          </h4>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-0.5">
              {[...Array(Math.round(product.rating))].map((_, i) => (
                <Star key={i} className="w-2.5 h-2.5 fill-[#fab528] text-[#fab528]" />
              ))}
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-1.5 pt-1">
            <span className="text-xs font-black text-gray-900">${product.price.toFixed(2)}</span>
            {product.compareAtPrice && (
              <span className="text-[11px] text-gray-400 line-through">${product.compareAtPrice.toFixed(2)}</span>
            )}
          </div>
        </div>
      </div>

      <div className="pt-3">
        <button
          onClick={() => onAddToCart(product.title, product.price)}
          className="w-full bg-gray-100 hover:bg-[#fab528] hover:text-gray-950 text-gray-700 font-bold text-[11px] py-1.5 rounded-md transition-all flex items-center justify-center gap-1"
        >
          <Plus className="w-3 h-3" />
          Add
        </button>
      </div>
    </div>
  );
}
