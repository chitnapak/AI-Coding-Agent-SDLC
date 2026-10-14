/**
 * /api/products/[productId] – GET
 * Returns full product detail including variants, images, highlights.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { migrate } from "@/lib/migrate";

migrate();

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;

  const product = db
    .prepare(
      `SELECT
         p.id, p.sku, p.title, p.brand,
         c.name AS category,
         p.description,
         p.price, p.compare_at_price AS compareAtPrice,
         p.currency, p.unit,
         p.rating, p.review_count AS reviewCount,
         p.sold_count AS soldCount,
         p.badge,
         p.image_url AS imageUrl
       FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       WHERE p.id = ? AND p.is_active = 1`
    )
    .get(productId);

  if (!product) {
    return NextResponse.json(
      { code: "not_found", message: "Product not found" },
      { status: 404 }
    );
  }

  const images = (
    db
      .prepare(
        `SELECT url FROM product_images WHERE product_id = ? ORDER BY sort_order ASC`
      )
      .all(productId) as { url: string }[]
  ).map((r) => r.url);

  const variants = db
    .prepare(
      `SELECT
         id, label, price,
         compare_at_price AS compareAtPrice,
         in_stock AS inStock,
         available_quantity AS availableQuantity
       FROM product_variants
       WHERE product_id = ?`
    )
    .all(productId);

  const highlights = db
    .prepare(
      `SELECT title, description FROM product_highlights WHERE product_id = ?`
    )
    .all(productId);

  const relatedProducts = db
    .prepare(
      `SELECT
         p.id, p.title, p.brand,
         c.name AS category,
         p.price, p.compare_at_price AS compareAtPrice,
         p.currency, p.unit, p.rating, p.badge,
         p.image_url AS imageUrl
       FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       WHERE p.category_id = (SELECT category_id FROM products WHERE id = ?)
         AND p.id != ?
         AND p.is_active = 1
       LIMIT 6`
    )
    .all(productId, productId);

  return NextResponse.json({
    ...product,
    images,
    variants,
    highlights,
    relatedProducts,
  });
}
