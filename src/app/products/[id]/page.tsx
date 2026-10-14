"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
  ChevronRight,
  Star,
  CheckCircle2,
  Truck,
  RotateCcw,
  ShieldCheck,
  Headphones,
  Sparkles,
  Share2,
  Flame,
  Leaf,
  Award,
  PackageCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { Breadcrumb } from "@/components/ui/breadcrumb";

// Category list matching Home page
const categories = [
  { id: "fruits", name: "Fruits & Vegetables", count: 32, icon: "🍎" },
  { id: "breads", name: "Breads & Sweets", count: 24, icon: "🥖" },
  { id: "seafood", name: "Frozen Seafoods", count: 18, icon: "🦀" },
  { id: "meats", name: "Raw Meats", count: 29, icon: "🥩" },
  { id: "drinks", name: "Wines & Alcohol Drinks", count: 45, icon: "🍷" },
  { id: "coffee", name: "Coffees and Teas", count: 21, icon: "☕" },
  { id: "milks", name: "Milks and Dairies", count: 36, icon: "🥛" },
  { id: "pets", name: "Pet Foods", count: 15, icon: "🐶" }
];

// Product Data
const productData = {
  id: "british-beef-mince",
  title: "British Beef Mince (Typically 15% Fat) 500g",
  brand: "Farmart Fresh Farm",
  sku: "FARM-BEEF-8921",
  category: "Raw Meats",
  categorySlug: "meats",
  rating: 4.9,
  reviewsCount: 128,
  price: 39.50,
  oldPrice: 45.00,
  unit: "500g Pack",
  stockStatus: "In Stock (45 available)",
  soldCount: 35,
  totalStock: 50,
  badge: "SALE -12%",
  origin: "United Kingdom • Organic Grass-Fed",
  description:
    "Our British Beef Mince is sourced directly from sustainable certified UK pastures. Naturally grass-fed, rich in protein, iron, and essential omega-3 fatty acids. Ideal for bolognese, classic homemade burgers, meatballs, and savory cottage pies.",
  images: [
    "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1585325701165-351af916e581?w=800&auto=format&fit=crop&q=80"
  ],
  highlights: [
    { title: "100% Organic", desc: "No artificial hormones or antibiotics", icon: <Leaf className="w-4 h-4 text-emerald-400" /> },
    { title: "Grass Fed Pastures", desc: "Ethically farmed British cattle", icon: <Award className="w-4 h-4 text-[#2b783c]" /> },
    { title: "Vacuum Sealed", desc: "Optimal freshness lock packaging", icon: <PackageCheck className="w-4 h-4 text-[#2b783c]" /> },
    { title: "Same-Day Delivery", desc: "Chilled express transport in 2 hours", icon: <Truck className="w-4 h-4 text-amber-400" /> }
  ],
  nutrition: [
    { name: "Energy", value: "215 kcal / 895 kJ" },
    { name: "Protein", value: "20.4g (41% RI)" },
    { name: "Fat", value: "15.0g (21% RI)" },
    { name: "Saturates", value: "6.2g (31% RI)" },
    { name: "Carbohydrates", value: "0.0g" },
    { name: "Salt", value: "0.15g" },
    { name: "Iron", value: "2.1mg (15% RI)" }
  ],
  specifications: [
    { label: "Product Type", value: "Fresh Chilled Meat" },
    { label: "Storage Instructions", value: "Keep refrigerated below 4°C. Freeze on day of purchase." },
    { label: "Country of Origin", value: "United Kingdom" },
    { label: "Weight / Volume", value: "500g e" },
    { label: "Packaging Type", value: "Recyclable Tray & Barrier Film" },
    { label: "Certifications", value: "Red Tractor Assured, Organic Soil Association" }
  ],
  reviewsList: [
    {
      id: 1,
      author: "David Harrison",
      date: "October 8, 2026",
      rating: 5,
      comment: "Super fresh beef mince! Made homemade burgers for the family BBQ and everyone praised how juicy and flavorful it was. Will buy weekly.",
      verified: true
    },
    {
      id: 2,
      author: "Emma Watson",
      date: "September 29, 2026",
      rating: 5,
      comment: "Arrived chilled in an insulated cold box within 90 minutes. Lean yet full of flavor with just the right 15% fat ratio for rich bolognese sauce.",
      verified: true
    },
    {
      id: 3,
      author: "Liam O'Connor",
      date: "September 15, 2026",
      rating: 4,
      comment: "High quality meat, nicely packaged and very fresh. Would love to see an even larger 1kg value family pack option soon.",
      verified: true
    }
  ],
  relatedProducts: [
    {
      id: "bs-6",
      brand: "Ocean Harvest",
      category: "Frozen Seafoods",
      title: "Fresh Salmon Fillet Premium Cut 350g",
      price: 18.50,
      oldPrice: 22.00,
      rating: 5,
      image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&auto=format&fit=crop&q=80",
      badge: "BESTSELLER"
    },
    {
      id: "bs-2",
      brand: "MariFury",
      category: "Fruits & Vegetables",
      title: "US Yellow Water Melon Whole Sweet 1kg",
      price: 5.50,
      oldPrice: 7.20,
      rating: 5,
      image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&auto=format&fit=crop&q=80",
      badge: "HOT"
    },
    {
      id: "bs-3",
      brand: "Farmart",
      category: "Fruits & Vegetables",
      title: "Spices Seeds & Peats Salted Snack 200g",
      price: 2.90,
      oldPrice: 4.20,
      rating: 5,
      image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&auto=format&fit=crop&q=80",
      badge: "SALE -30%"
    },
    {
      id: "bs-4",
      brand: "Farmart",
      category: "Breads & Sweets",
      title: "Oatmeal Crunchy Cookies Classic Box 500g",
      price: 29.60,
      oldPrice: null,
      rating: 5,
      image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&auto=format&fit=crop&q=80",
      badge: "NEW"
    }
  ]
};

export default function ProductDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState("500g");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [cartCount, setCartCount] = useState(3);
  const [cartTotal, setCartTotal] = useState(2450.50);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isProcessingBuy, setIsProcessingBuy] = useState(false);

  // Weight pricing multiplier
  const weightPrices: Record<string, number> = {
    "500g": productData.price,
    "1kg": +(productData.price * 1.9).toFixed(2),
    "2kg Value Pack": +(productData.price * 3.6).toFixed(2)
  };

  const currentPrice = weightPrices[selectedWeight] || productData.price;
  const currentTotal = +(currentPrice * quantity).toFixed(2);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleAddToCart = (qty = quantity) => {
    setCartCount((prev) => prev + qty);
    setCartTotal((prev) => +(prev + currentPrice * qty).toFixed(2));
    showToast(`Added ${qty}x "${productData.title} (${selectedWeight})" to cart!`);
  };

  const handleConfirmOrder = () => {
    setIsProcessingBuy(true);
    setTimeout(() => {
      setIsProcessingBuy(false);
      setIsBuyModalOpen(false);
      showToast(`Order confirmed for ${quantity}x ${productData.title}! Thank you for shopping with Farmart.`);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans antialiased selection:bg-[#fab528]/30 selection:text-[#166534]">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-white border border-[#fab528]/40 text-gray-900 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-5 h-5 text-[#2b783c] shrink-0" />
          <span className="font-medium text-xs sm:text-sm">{notification}</span>
        </div>
      )}

      {/* 1. TOP HEADER Navigation (Follows DESIGN.md Navbar Spec) */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#fab528] flex items-center justify-center text-black shadow-sm shadow-[#fab528]/30 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-gray-900 leading-none">
                Farm<span className="text-[#fab528]">art</span>
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-gray-600">
                GROCERY STORE
              </span>
            </div>
          </Link>

          {/* Search Bar using Input Component */}
          <div className="flex-1 max-w-xl mx-2 lg:mx-6">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search fresh meats, veggies, bakery..."
              icon={<Search className="w-4 h-4 text-gray-500" />}
              rightElement={
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => showToast(`Searching for "${searchQuery || 'fresh beef'}"`)}
                >
                  Search
                </Button>
              }
            />
          </div>

          {/* User Actions & Cart Overview */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden xl:flex items-center gap-2.5 text-left border-r border-gray-200 pr-6">
              <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-[#2b783c]">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-800">8 800 332 65-66</div>
                <div className="text-[10px] text-gray-600">Support 24/7</div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                showToast("Design System Showcase page accessible via /design link!")
              }
              className="hidden sm:flex items-center gap-1.5"
            >
              <User className="w-4 h-4" />
              <span>Account</span>
            </Button>

            <button
              onClick={() => {
                setIsWishlisted(!isWishlisted);
                showToast(isWishlisted ? "Removed from Wishlist" : "Added to Wishlist!");
              }}
              className="relative p-2 text-gray-600 hover:text-rose-400 transition-colors"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? "fill-rose-500 text-rose-500" : ""}`} />
              <span className="absolute -top-1 -right-1 bg-rose-500 text-gray-950 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {isWishlisted ? 3 : 2}
              </span>
            </button>

            {/* Cart Widget */}
            <div
              onClick={() => showToast("Cart drawer toggled")}
              className="flex items-center gap-3 bg-white border border-gray-200 hover:border-gray-300 rounded-lg px-3 py-1.5 cursor-pointer transition-all"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-gray-800" />
                <span className="absolute -top-2 -right-2 bg-[#fab528] text-gray-950 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[9px] uppercase font-mono text-gray-600">Cart Total</span>
                <span className="text-xs font-mono font-bold text-gray-900">
                  ${cartTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Sub-Header Navigation */}
        <div className="border-t border-gray-200/80 bg-white/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-12">
            
            {/* Shop by Category Dropdown */}
            <div className="relative">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
                leftIcon={<Menu className="w-3.5 h-3.5" />}
                rightIcon={<ChevronDown className={`w-3.5 h-3.5 transition-transform ${categoryMenuOpen ? "rotate-180" : ""}`} />}
              >
                Categories
              </Button>

              {categoryMenuOpen && (
                <div className="absolute top-full left-0 w-60 mt-1 bg-white border border-gray-200 shadow-2xl rounded-xl z-50 py-2 divide-y divide-gray-200/60 animate-in fade-in duration-150">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/#${cat.id}`}
                      onClick={() => setCategoryMenuOpen(false)}
                      className="px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 hover:text-[#2b783c] flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <span>{cat.icon}</span>
                        {cat.name}
                      </span>
                      <span className="text-[10px] font-mono text-gray-500 bg-white px-1.5 py-0.5 rounded">
                        {cat.count}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Nav Links */}
            <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-gray-600">
              <Link href="/" className="flex items-center gap-1 text-[#2b783c] hover:text-[#166534] transition-colors">
                <Zap className="w-3.5 h-3.5 text-[#2b783c]" />
                Deals Today
              </Link>
              <Link href="/" className="hover:text-gray-800 transition-colors">Special Offers</Link>
              <Link href="/" className="hover:text-gray-800 transition-colors">Fresh Groceries</Link>
              <Link href="/" className="hover:text-gray-800 transition-colors">Frozen Meats</Link>
              <Link href="/design" className="text-[#2b783c] hover:text-[#166534] transition-colors flex items-center gap-1 font-mono">
                Design System (/design) <ChevronRight className="w-3 h-3" />
              </Link>
            </nav>

            <div className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-800 cursor-pointer">
              <Clock className="w-3.5 h-3.5 text-gray-500" />
              <span className="hidden sm:inline">Recently Viewed</span>
            </div>

          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Breadcrumb Navigation Component */}
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: productData.category, href: "/#meats" },
            { label: productData.title }
          ]}
        />

        {/* Main Product Grid (Gallery + Purchase Spec + Trust Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* 1. Left Gallery Column (5 cols) */}
          <Card className="lg:col-span-5 space-y-4 p-5 sm:p-6">
            
            {/* Main Featured Image Container */}
            <div className="relative w-full h-80 sm:h-96 rounded-xl bg-white border border-gray-200 overflow-hidden flex items-center justify-center group p-4">
              <Image
                src={productData.images[selectedImage]}
                alt={productData.title}
                fill
                priority
                className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
              />

              <Badge variant="destructive" className="absolute top-4 left-4 font-mono font-bold">
                {productData.badge}
              </Badge>

              <button
                onClick={() => {
                  setIsWishlisted(!isWishlisted);
                  showToast(isWishlisted ? "Removed from Wishlist" : "Added to Wishlist!");
                }}
                className="absolute top-4 right-4 w-9 h-9 rounded-lg bg-white/80 border border-gray-200 text-gray-600 hover:text-rose-400 flex items-center justify-center transition-all hover:bg-gray-100"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? "fill-rose-500 text-rose-500" : ""}`} />
              </button>
            </div>

            {/* Thumbnail Carousel */}
            <div className="grid grid-cols-4 gap-3">
              {productData.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative h-20 rounded-lg bg-white border-2 overflow-hidden transition-all ${
                    selectedImage === idx
                      ? "border-[#fab528] ring-2 ring-[#fab528]/20"
                      : "border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover p-1" />
                </button>
              ))}
            </div>

            {/* Quality Guarantee Card */}
            <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-xs text-emerald-400">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Farmart Quality Assured: Organic grass-fed inspection certified before delivery.</span>
            </div>
          </Card>

          {/* 2. Center Product Details Column (4 cols) */}
          <Card className="lg:col-span-4 space-y-5 p-5 sm:p-6">
            
            {/* Header Brand & Title */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="active" className="font-mono text-[10px]">
                  {productData.brand}
                </Badge>
                <span className="text-xs font-mono text-gray-500">SKU: {productData.sku}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 leading-tight">
                {productData.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#fab528] text-[#2b783c]" />
                  ))}
                </div>
                <span className="text-xs font-mono font-bold text-gray-900">{productData.rating}</span>
                <span className="text-xs text-gray-600">({productData.reviewsCount} customer reviews)</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-xl bg-white border border-gray-200 space-y-1.5">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold font-mono text-[#2b783c]">
                  ${currentPrice.toFixed(2)}
                </span>
                {productData.oldPrice && (
                  <span className="text-sm font-mono text-gray-500 line-through">
                    ${(productData.oldPrice * (selectedWeight === "1kg" ? 1.9 : selectedWeight === "2kg Value Pack" ? 3.6 : 1)).toFixed(2)}
                  </span>
                )}
                <Badge variant="destructive" className="font-mono text-[10px]">
                  Save ${(productData.oldPrice ? productData.oldPrice - productData.price : 5.50).toFixed(2)}
                </Badge>
              </div>
              <p className="text-xs text-gray-600">
                Price includes VAT. Free express delivery on orders over $99.
              </p>
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              {productData.description}
            </p>

            {/* Weight / Pack Variant Selector */}
            <div className="space-y-2 pt-1">
              <div className="flex justify-between text-xs font-medium text-gray-700">
                <span>Select Package Size:</span>
                <span className="text-[#2b783c] font-mono font-bold">{selectedWeight}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {["500g", "1kg", "2kg Value Pack"].map((weight) => (
                  <Button
                    key={weight}
                    variant={selectedWeight === weight ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => setSelectedWeight(weight)}
                    className="w-full text-xs font-mono"
                  >
                    {weight}
                  </Button>
                ))}
              </div>
            </div>

            {/* Stock Progress Bar */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-medium text-gray-700">
                <span>Stock: <strong className="text-emerald-400 font-mono">{productData.stockStatus}</strong></span>
                <span className="text-rose-400 font-mono flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-rose-400 text-rose-400" /> {productData.soldCount} Sold
                </span>
              </div>
              <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-gray-200">
                <div
                  className="h-full bg-[#fab528] rounded-full"
                  style={{ width: `${(productData.soldCount / productData.totalStock) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-3">
                <QuantitySelector
                  value={quantity}
                  onChange={(val) => setQuantity(val)}
                  min={1}
                  max={20}
                />

                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handleAddToCart()}
                  leftIcon={<ShoppingBag className="w-4 h-4" />}
                  className="flex-1 font-mono"
                >
                  Add To Cart (${currentTotal.toFixed(2)})
                </Button>
              </div>

              <Button
                variant="secondary"
                size="md"
                onClick={() => setIsBuyModalOpen(true)}
                leftIcon={<Zap className="w-4 h-4 text-[#2b783c]" />}
                className="w-full text-[#2b783c] border-[#fab528]/30 hover:bg-[#fab528]/10"
              >
                Buy Now — Instant Checkout
              </Button>
            </div>

            {/* Meta details */}
            <div className="pt-3 border-t border-gray-200/80 flex items-center justify-between text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <span>Share:</span>
                <button
                  onClick={() => showToast("Product link copied to clipboard!")}
                  className="p-1 rounded text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <span>Category: <strong className="text-gray-800">{productData.category}</strong></span>
            </div>

          </Card>

          {/* 3. Right Sidebar: Services & Bonus Card (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            
            <Card className="p-5 space-y-4">
              <CardTitle className="text-xs uppercase font-mono text-[#2b783c] pb-2 border-b border-gray-200">
                Delivery &amp; Services
              </CardTitle>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-start gap-3">
                  <Truck className="w-4 h-4 text-[#2b783c] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-800">2-Hour Express Delivery</div>
                    <div className="text-gray-600 text-[11px]">Free shipping over $99 order</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <RotateCcw className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-800">90 Days Free Return</div>
                    <div className="text-gray-600 text-[11px]">Full refund if quality falls short</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-[#2b783c] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-800">100% Organic Inspected</div>
                    <div className="text-gray-600 text-[11px]">Direct from trusted UK pastures</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Headphones className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-800">24/7 Support Line</div>
                    <div className="text-gray-600 text-[11px]">Hotline: 8 800 332 65-66</div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-5 text-center space-y-2 border-[#fab528]/20 bg-white/90">
              <Badge variant="brand" className="font-mono text-[10px]">
                MEMBERSHIP BONUS
              </Badge>
              <h4 className="font-semibold text-gray-900 text-sm">Earn 40 Loyalty Points</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Sign in to collect points on this purchase for cashback vouchers.
              </p>
            </Card>

          </div>

        </div>

        {/* Product Highlights Grid (4 Cards) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {productData.highlights.map((item, idx) => (
            <Card key={idx} className="p-4 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div>
                <h4 className="text-xs font-semibold text-gray-900">{item.title}</h4>
                <p className="text-[11px] text-gray-600">{item.desc}</p>
              </div>
            </Card>
          ))}
        </section>

        {/* Detailed Tabs Component */}
        <Card className="p-6 sm:p-8 space-y-6">
          <Tabs defaultValue="description">
            <TabsList>
              <TabsTrigger value="description">Description &amp; Chef Tips</TabsTrigger>
              <TabsTrigger value="nutrition">Nutrition Facts</TabsTrigger>
              <TabsTrigger value="specs">Specifications &amp; Storage</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({productData.reviewsCount})</TabsTrigger>
            </TabsList>

            {/* Description Tab */}
            <TabsContent value="description" className="pt-4 space-y-4">
              <div className="space-y-3 text-xs sm:text-sm text-gray-700 leading-relaxed">
                <h3 className="text-lg font-medium text-gray-900">About Farmart British Beef Mince</h3>
                <p>
                  Our pasture-raised British beef mince delivers the rich, savory depth of authentic countryside beef. Sourced exclusively from accredited UK organic farms where cattle graze freely across pesticide-free grasslands.
                </p>
                <p>
                  With a balanced 15% fat ratio, it retains tenderness and moisture throughout cooking without rendering excessive grease. It forms the ultimate foundation for homemade burgers, rich spaghetti bolognese, shepherd&apos;s pie, spiced chili con carne, and taco fillings.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-gray-200 space-y-2">
                <h4 className="text-xs font-semibold text-[#2b783c] flex items-center gap-1.5 font-mono">
                  <Sparkles className="w-4 h-4" /> Chef&apos;s Tip for Best Results
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Brown the mince in batches over medium-high heat in a cast-iron skillet without crowding the pan. Allow a golden caramelized crust to develop for maximum umami flavor before adding aromatics and sauces.
                </p>
              </div>
            </TabsContent>

            {/* Nutrition Tab */}
            <TabsContent value="nutrition" className="pt-4 space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Typical Nutrition per 100g</h3>
              <div className="max-w-xl border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-200 text-xs">
                {productData.nutrition.map((item, idx) => (
                  <div key={idx} className="flex justify-between p-3.5 hover:bg-white transition-colors">
                    <span className="text-gray-600">{item.name}</span>
                    <span className="font-mono font-semibold text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Specifications Tab */}
            <TabsContent value="specs" className="pt-4 space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Technical Specifications</h3>
              <div className="max-w-2xl border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-200 text-xs">
                {productData.specifications.map((spec, idx) => (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 p-3.5 hover:bg-white transition-colors">
                    <span className="text-gray-600">{spec.label}</span>
                    <span className="sm:col-span-2 font-medium text-gray-800">{spec.value}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Customer Reviews Tab */}
            <TabsContent value="reviews" className="pt-4 space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-xl bg-white border border-gray-200">
                <div className="text-center sm:border-r sm:border-gray-200 sm:pr-8">
                  <div className="text-4xl font-bold font-mono text-[#2b783c]">{productData.rating}</div>
                  <div className="flex items-center justify-center gap-0.5 my-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#fab528] text-[#2b783c]" />
                    ))}
                  </div>
                  <div className="text-xs text-gray-600">{productData.reviewsCount} verified reviews</div>
                </div>

                <div className="flex-1 w-full space-y-1.5 text-xs text-gray-600 font-mono">
                  <div className="flex items-center gap-3">
                    <span>5 Stars</span>
                    <div className="flex-1 h-2 bg-white rounded-full overflow-hidden border border-gray-200">
                      <div className="h-full bg-[#fab528] rounded-full" style={{ width: "92%" }}></div>
                    </div>
                    <span className="text-gray-600 w-8">92%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>4 Stars</span>
                    <div className="flex-1 h-2 bg-white rounded-full overflow-hidden border border-gray-200">
                      <div className="h-full bg-[#fab528] rounded-full" style={{ width: "6%" }}></div>
                    </div>
                    <span className="text-gray-600 w-8">6%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>3 Stars</span>
                    <div className="flex-1 h-2 bg-white rounded-full overflow-hidden border border-gray-200">
                      <div className="h-full bg-[#fab528] rounded-full" style={{ width: "2%" }}></div>
                    </div>
                    <span className="text-gray-600 w-8">2%</span>
                  </div>
                </div>
              </div>

              {/* Review Items */}
              <div className="space-y-4">
                {productData.reviewsList.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl border border-gray-200/80 bg-white space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-800">{rev.author}</span>
                        {rev.verified && (
                          <Badge variant="active" className="text-[10px] py-0">
                            Verified Purchase
                          </Badge>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-gray-500">{rev.date}</span>
                    </div>

                    <div className="flex items-center gap-0.5">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#fab528] text-[#2b783c]" />
                      ))}
                    </div>

                    <p className="text-xs text-gray-700 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Related Products Grid Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200/80 pb-3">
            <h2 className="text-xl font-semibold tracking-tight text-gray-900">
              Related Products You Might Like
            </h2>
            <Link href="/" className="text-xs text-[#2b783c] hover:text-[#166534] font-mono flex items-center gap-1">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productData.relatedProducts.map((product) => (
              <Card key={product.id} interactive className="space-y-3 group">
                <div className="relative h-44 w-full rounded-lg bg-white border border-gray-200 overflow-hidden flex items-center justify-center p-3">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.badge && (
                    <Badge variant="brand" className="absolute top-3 left-3 font-mono text-[10px]">
                      {product.badge}
                    </Badge>
                  )}
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-gray-500 uppercase">{product.category}</span>
                  <h3 className="text-xs font-semibold text-gray-900 line-clamp-2 leading-snug group-hover:text-[#2b783c] transition-colors">
                    {product.title}
                  </h3>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-baseline gap-2 font-mono">
                      <span className="text-sm font-bold text-[#2b783c]">${product.price.toFixed(2)}</span>
                      {product.oldPrice && (
                        <span className="text-xs text-gray-500 line-through">${product.oldPrice.toFixed(2)}</span>
                      )}
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleAddToCart(1)}
                      leftIcon={<ShoppingBag className="w-3 h-3" />}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

      </main>

      {/* Interactive Direct Checkout Dialog */}
      <Dialog
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
        title="Confirm Instant Order"
        description="Verify your selected quantity and delivery options before processing."
        variant="default"
        primaryActionLabel={`Pay $${currentTotal.toFixed(2)}`}
        onPrimaryAction={handleConfirmOrder}
        isLoading={isProcessingBuy}
      >
        <div className="space-y-3 py-2 text-xs">
          <div className="p-3 bg-white rounded-lg border border-gray-200 space-y-2 font-mono">
            <div className="flex justify-between text-gray-700">
              <span>Item:</span>
              <span className="text-gray-900 truncate max-w-[200px]">{productData.title}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Size:</span>
              <span className="text-[#2b783c]">{selectedWeight}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Quantity:</span>
              <span className="text-[#2b783c]">{quantity}</span>
            </div>
            <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-gray-900 text-sm">
              <span>Total Amount:</span>
              <span className="text-[#2b783c]">${currentTotal.toFixed(2)}</span>
            </div>
          </div>
          <p className="text-[11px] text-gray-600">
            Express 2-Hour Chilled transport will be dispatched immediately upon confirmation.
          </p>
        </div>
      </Dialog>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-20 py-8 text-center text-xs text-gray-500">
        <p>Labs Next.js App Router • Product Detail Page designed with DESIGN.md System Tokens</p>
      </footer>

    </div>
  );
}
