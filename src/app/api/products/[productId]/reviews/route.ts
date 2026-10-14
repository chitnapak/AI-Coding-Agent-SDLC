/**
 * /api/products/[productId]/reviews – GET
 * Returns paginated reviews for a product.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { migrate } from "@/lib/migrate";

migrate();

export function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = params as unknown as { productId: string };
  const { searchParams } = request.nextUrl;

  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const pageSize = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("pageSize") ?? "24", 10))
  );
  const offset = (page - 1) * pageSize;

  const items = db
    .prepare(
      `SELECT id, author, rating, comment, created_at AS createdAt, verified
       FROM reviews
       WHERE product_id = ?
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`
    )
    .all(productId, pageSize, offset);

  const { total } = db
    .prepare(`SELECT COUNT(*) AS total FROM reviews WHERE product_id = ?`)
    .get(productId) as { total: number };

  return NextResponse.json({ items, pageInfo: { page, pageSize, total } });
}
