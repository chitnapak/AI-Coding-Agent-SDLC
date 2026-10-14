/**
 * Seed the SQLite database with realistic Farmart demo data.
 * Run with:  npx tsx src/lib/seed.ts
 */
import { migrate } from "./migrate";
import { db } from "./db";

migrate();
console.log("✅ Schema migrated");

// ── CATEGORIES ────────────────────────────────────────────────────────────────
const categories = [
  { id: "fruits", name: "Fruits & Vegetables", icon: "🍎", image_url: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=300&auto=format&fit=crop&q=80", product_count: 32, sort_order: 1 },
  { id: "breads", name: "Breads & Sweets", icon: "🥖", image_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&auto=format&fit=crop&q=80", product_count: 24, sort_order: 2 },
  { id: "seafood", name: "Frozen Seafoods", icon: "🦀", image_url: "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=300&auto=format&fit=crop&q=80", product_count: 18, sort_order: 3 },
  { id: "meats", name: "Raw Meats", icon: "🥩", image_url: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=300&auto=format&fit=crop&q=80", product_count: 29, sort_order: 4 },
  { id: "drinks", name: "Wines & Alcohol Drinks", icon: "🍷", image_url: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=300&auto=format&fit=crop&q=80", product_count: 45, sort_order: 5 },
  { id: "coffee", name: "Coffees and Teas", icon: "☕", image_url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&auto=format&fit=crop&q=80", product_count: 21, sort_order: 6 },
  { id: "milks", name: "Milks and Dairies", icon: "🥛", image_url: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&auto=format&fit=crop&q=80", product_count: 36, sort_order: 7 },
  { id: "pets", name: "Pet Foods", icon: "🐶", image_url: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=300&auto=format&fit=crop&q=80", product_count: 15, sort_order: 8 },
] as const;

const insertCategory = db.prepare(`
  INSERT OR IGNORE INTO categories (id, name, icon, image_url, product_count, sort_order)
  VALUES (@id, @name, @icon, @image_url, @product_count, @sort_order)
`);

const insertCats = db.transaction(() => {
  for (const cat of categories) insertCategory.run(cat);
});
insertCats();
console.log("✅ Categories seeded");

// ── FEATURED BRANDS ───────────────────────────────────────────────────────────
const featuredBrands = [
  { id: "fb-1", brand: "FOODPOUCH", title: "New Snacks Release", badge: "NEW", image_url: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500&auto=format&fit=crop&q=80", sort_order: 1 },
  { id: "fb-2", brand: "ITEA JSC", title: "Happy Tea 100% Organic, From $29.9", badge: "ORGANIC", image_url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80", sort_order: 2 },
  { id: "fb-3", brand: "SODA BRAND", title: "Soda Can Box 24 Pieces - 30% OFF", badge: "-30% OFF", image_url: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80", sort_order: 3 },
  { id: "fb-4", brand: "FARMART", title: "Fresh Meat Sausage BUY 2 GET 1", badge: "BUY 2 GET 1", image_url: "https://images.unsplash.com/photo-1585325701165-351af916e581?w=500&auto=format&fit=crop&q=80", sort_order: 4 },
] as const;

const insertBrand = db.prepare(`
  INSERT OR IGNORE INTO featured_brands (id, brand, title, badge, image_url, sort_order)
  VALUES (@id, @brand, @title, @badge, @image_url, @sort_order)
`);
const insertBrands = db.transaction(() => {
  for (const b of featuredBrands) insertBrand.run(b);
});
insertBrands();
console.log("✅ Featured brands seeded");

// ── PRODUCTS ──────────────────────────────────────────────────────────────────
interface ProductSeed {
  id: string; sku: string; title: string; brand: string; category_id: string;
  description: string; price: number; compare_at_price: number | null; currency: string;
  unit: string; rating: number; review_count: number; sold_count: number;
  badge: string | null; image_url: string; collection: string | null;
}

const products: ProductSeed[] = [
  // ── MEATS ─────────────────────────────────────────
  {
    id: "british-beef-mince", sku: "FARM-BEEF-8921", title: "British Beef Mince (Typically 15% Fat)",
    brand: "Meat Brand", category_id: "meats",
    description: "Premium British beef mince, typically 15% fat. Ideal for burgers, bolognese, and meatballs. Sourced from grass-fed cattle on UK farms.",
    price: 39.50, compare_at_price: 45.00, currency: "USD", unit: "500g",
    rating: 5, review_count: 45, sold_count: 35, badge: "SALE -12%",
    image_url: "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=400&auto=format&fit=crop&q=80",
    collection: "best-sellers",
  },
  {
    id: "la-molisana-beef", sku: "FARM-BEEF-0012", title: "La Molisana Beef Minced x 24 Pieces",
    brand: "Brand Name", category_id: "meats",
    description: "Premium Italian-style beef mince in convenient 24-piece multipack. Perfect for meal prepping.",
    price: 49.50, compare_at_price: 55.00, currency: "USD", unit: "Pack 24pcs",
    rating: 5, review_count: 45, sold_count: 35, badge: "SAVE $5.50",
    image_url: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400&auto=format&fit=crop&q=80",
    collection: "top-savers",
  },
  {
    id: "fresh-salmon-fillet", sku: "FARM-FISH-3301", title: "Fresh Salmon Fillet Premium Cut",
    brand: "Ocean Harvest", category_id: "seafood",
    description: "Hand-selected Atlantic salmon fillet, rich in Omega-3. Perfect for grilling or pan-frying.",
    price: 18.50, compare_at_price: 22.00, currency: "USD", unit: "350g",
    rating: 5, review_count: 62, sold_count: 80, badge: "BESTSELLER",
    image_url: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&auto=format&fit=crop&q=80",
    collection: "best-sellers",
  },
  // ── FRUITS & VEG ──────────────────────────────────
  {
    id: "yellow-watermelon", sku: "FARM-FRU-1102", title: "US Yellow Water Melon Whole Sweet",
    brand: "MariFury", category_id: "fruits",
    description: "Sweet, crisp yellow-fleshed watermelon imported from the US. Lower in sugar than red varieties.",
    price: 5.50, compare_at_price: 7.20, currency: "USD", unit: "1 kg",
    rating: 5, review_count: 28, sold_count: 120, badge: "HOT",
    image_url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&auto=format&fit=crop&q=80",
    collection: "best-sellers",
  },
  {
    id: "spices-salted-snack", sku: "FARM-FRU-2233", title: "Spices Seeds & Peats Salted Snack",
    brand: "Farmart", category_id: "fruits",
    description: "Mixed spiced seeds and nuts, lightly salted. A healthy, satisfying snack.",
    price: 2.90, compare_at_price: 4.20, currency: "USD", unit: "200g",
    rating: 5, review_count: 15, sold_count: 55, badge: "SALE -30%",
    image_url: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&auto=format&fit=crop&q=80",
    collection: "best-sellers",
  },
  // ── BREADS & SWEETS ───────────────────────────────
  {
    id: "farmhouse-soft-white", sku: "FARM-BRD-4410", title: "Farmart Farmhouse Soft White",
    brand: "Farmart", category_id: "breads",
    description: "Classic soft white bread baked in our Farmhouse bakery. No preservatives, just pure ingredients.",
    price: 12.70, compare_at_price: null, currency: "USD", unit: "800g loaf",
    rating: 5, review_count: 9, sold_count: 8, badge: null,
    image_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=80",
    collection: "top-savers",
  },
  {
    id: "oatmeal-crunchy-cookies", sku: "FARM-BRD-5501", title: "Oatmeal Crunchy Cookies Classic",
    brand: "Farmart", category_id: "breads",
    description: "Old-fashioned oatmeal cookies baked with rolled oats, brown sugar, and a hint of cinnamon.",
    price: 29.60, compare_at_price: null, currency: "USD", unit: "Box 500g",
    rating: 5, review_count: 34, sold_count: 60, badge: "NEW",
    image_url: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&auto=format&fit=crop&q=80",
    collection: "best-sellers",
  },
  // ── SEAFOOD ───────────────────────────────────────
  {
    id: "canned-rice-crab", sku: "FARM-SEA-7701", title: "Canned Rice With Tuber & Fresh Crab",
    brand: "Brand Name", category_id: "seafood",
    description: "Ready-to-eat canned rice with taro and premium fresh crab meat. Heat and serve in minutes.",
    price: 22.39, compare_at_price: 28.00, currency: "USD", unit: "Pack 400g",
    rating: 4, review_count: 22, sold_count: 40, badge: "SAVE $5.6",
    image_url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format&fit=crop&q=80",
    collection: "best-sellers",
  },
  // ── DRINKS ───────────────────────────────────────
  {
    id: "ice-geck-beer", sku: "FARM-DRK-9901", title: "Ice Geck's Beer 350ml x 24 Pieces",
    brand: "Brand Name", category_id: "drinks",
    description: "Crisp and refreshing lager beer in a convenient 24-can multipack. Best served ice cold.",
    price: 22.35, compare_at_price: 28.00, currency: "USD", unit: "24 x 350ml",
    rating: 5, review_count: 34, sold_count: 62, badge: "-20%",
    image_url: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&auto=format&fit=crop&q=80",
    collection: "top-savers",
  },
  // ── MILKS ────────────────────────────────────────
  {
    id: "organic-whole-milk", sku: "FARM-MLK-1101", title: "Organic Whole Milk Fresh Farm",
    brand: "Farmart Dairy", category_id: "milks",
    description: "Pasteurized organic whole milk from certified free-range cows. Rich, creamy, and full of nutrients.",
    price: 8.90, compare_at_price: 10.50, currency: "USD", unit: "2L",
    rating: 4.8, review_count: 55, sold_count: 200, badge: "ORGANIC",
    image_url: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop&q=80",
    collection: null,
  },
  // ── COFFEE ───────────────────────────────────────
  {
    id: "happy-tea-organic", sku: "FARM-TEA-2201", title: "Happy Tea 100% Organic Green Tea",
    brand: "ITEA JSC", category_id: "coffee",
    description: "Premium single-origin green tea leaves, organically farmed in the highlands. Light, grassy, and refreshing.",
    price: 29.90, compare_at_price: null, currency: "USD", unit: "100g",
    rating: 5, review_count: 18, sold_count: 45, badge: "ORGANIC",
    image_url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&auto=format&fit=crop&q=80",
    collection: null,
  },
  // ── PETS ─────────────────────────────────────────
  {
    id: "premium-dog-food", sku: "FARM-PET-3301", title: "Premium Dry Dog Food Chicken & Rice",
    brand: "PetFarm", category_id: "pets",
    description: "Balanced nutrition for adult dogs. Made with real chicken as the #1 ingredient plus wholesome brown rice.",
    price: 35.00, compare_at_price: 42.00, currency: "USD", unit: "5kg bag",
    rating: 4.7, review_count: 88, sold_count: 150, badge: "SALE -16%",
    image_url: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&auto=format&fit=crop&q=80",
    collection: null,
  },
];

const insertProduct = db.prepare(`
  INSERT OR IGNORE INTO products
    (id, sku, title, brand, category_id, description, price, compare_at_price,
     currency, unit, rating, review_count, sold_count, badge, image_url, collection)
  VALUES
    (@id, @sku, @title, @brand, @category_id, @description, @price, @compare_at_price,
     @currency, @unit, @rating, @review_count, @sold_count, @badge, @image_url, @collection)
`);

const insertVariant = db.prepare(`
  INSERT OR IGNORE INTO product_variants
    (id, product_id, label, price, compare_at_price, in_stock, available_quantity)
  VALUES (@id, @product_id, @label, @price, @compare_at_price, @in_stock, @available_quantity)
`);

const insertHighlight = db.prepare(`
  INSERT OR IGNORE INTO product_highlights (product_id, title, description)
  SELECT @product_id, @title, @description
  WHERE NOT EXISTS (
    SELECT 1 FROM product_highlights WHERE product_id = @product_id AND title = @title
  )
`);

const insertProductImage = db.prepare(`
  INSERT OR IGNORE INTO product_images (product_id, url, sort_order)
  SELECT @product_id, @url, @sort_order
  WHERE NOT EXISTS (
    SELECT 1 FROM product_images WHERE product_id = @product_id AND url = @url
  )
`);

const insertReview = db.prepare(`
  INSERT OR IGNORE INTO reviews (id, product_id, author, rating, comment, verified, created_at)
  VALUES (@id, @product_id, @author, @rating, @comment, @verified, @created_at)
`);

const seedProducts = db.transaction(() => {
  for (const p of products) {
    insertProduct.run(p);

    // Default variant – unit price
    insertVariant.run({
      id: `${p.id}-default`, product_id: p.id, label: p.unit || "Default",
      price: p.price, compare_at_price: p.compare_at_price ?? null,
      in_stock: 1, available_quantity: 50,
    });

    // Second variant where appropriate
    if (p.unit && p.unit !== "Default") {
      insertVariant.run({
        id: `${p.id}-bulk`, product_id: p.id, label: `Bulk (x2)`,
        price: +(p.price * 1.8).toFixed(2), compare_at_price: null,
        in_stock: 1, available_quantity: 20,
      });
    }

    // Highlights
    insertHighlight.run({ product_id: p.id, title: "Farm Fresh", description: "Sourced directly from certified farms." });
    insertHighlight.run({ product_id: p.id, title: "No Preservatives", description: "100% natural, no artificial additives." });

    // Extra images (reuse same URL as placeholder)
    insertProductImage.run({ product_id: p.id, url: p.image_url, sort_order: 0 });

    // Sample reviews
    insertReview.run({
      id: `rev-${p.id}-1`, product_id: p.id, author: "Alice M.", rating: 5,
      comment: "Absolutely love this product! Will buy again.", verified: 1,
      created_at: "2026-09-15T10:23:00",
    });
    insertReview.run({
      id: `rev-${p.id}-2`, product_id: p.id, author: "Bob K.", rating: 4,
      comment: "Good quality, fast delivery. Slightly smaller than expected.", verified: 1,
      created_at: "2026-10-01T14:05:00",
    });
  }
});
seedProducts();
console.log("✅ Products seeded");
console.log("🎉 Seed complete – database is at", process.cwd() + "/farmart.db");
