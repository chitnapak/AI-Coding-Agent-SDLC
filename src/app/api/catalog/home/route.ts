/**
 * /api/catalog/home – GET
 * Returns categories, featured brands, top savers, and best sellers.
 * Runs migrate() once so the DB is always bootstrapped.
 */
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { migrate } from "@/lib/migrate";

migrate();

export function GET() {
  const categories = db
    .prepare(
      `SELECT id, name, icon, image_url AS imageUrl, product_count AS productCount
       FROM categories
       ORDER BY sort_order ASC`
    )
    .all();

  const featuredBrands = db
    .prepare(
      `SELECT id, brand, title, badge, image_url AS imageUrl
       FROM featured_brands
       ORDER BY sort_order ASC`
    )
    .all();

  const topSavers = db
    .prepare(
      `SELECT
         p.id, p.title, p.brand,
         c.name AS category,
         p.price, p.compare_at_price AS compareAtPrice,
         p.currency, p.unit,
         p.rating, p.badge,
         p.image_url AS imageUrl
       FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       WHERE p.collection = 'top-savers' AND p.is_active = 1
       ORDER BY p.sold_count DESC`
    )
    .all();

  const bestSellers = db
    .prepare(
      `SELECT
         p.id, p.title, p.brand,
         c.name AS category,
         p.price, p.compare_at_price AS compareAtPrice,
         p.currency, p.unit,
         p.rating, p.badge,
         p.image_url AS imageUrl
       FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       WHERE p.collection = 'best-sellers' AND p.is_active = 1
       ORDER BY p.sold_count DESC`
    )
    .all();

  return NextResponse.json({ categories, featuredBrands, topSavers, bestSellers });
}
