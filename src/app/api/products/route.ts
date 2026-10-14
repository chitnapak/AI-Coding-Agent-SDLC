/**
 * /api/products – GET
 * Supports: q (free-text), category (slug), collection, page, pageSize
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { migrate } from "@/lib/migrate";

migrate();

export function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const q = (searchParams.get("q") ?? "").trim();
  const category = searchParams.get("category") ?? "";
  const collection = searchParams.get("collection") ?? "";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const pageSize = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("pageSize") ?? "24", 10))
  );

  const conditions: string[] = ["p.is_active = 1"];
  const params: Record<string, string | number> = {};

  if (q) {
    conditions.push(
      "(p.title LIKE @q OR p.brand LIKE @q OR p.description LIKE @q)"
    );
    params.q = `%${q}%`;
  }
  if (category) {
    conditions.push("p.category_id = @category");
    params.category = category;
  }
  if (collection) {
    conditions.push("p.collection = @collection");
    params.collection = collection;
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const offset = (page - 1) * pageSize;

  const selectCols = `
    p.id, p.title, p.brand,
    c.name AS category,
    p.price, p.compare_at_price AS compareAtPrice,
    p.currency, p.unit,
    p.rating, p.badge,
    p.image_url AS imageUrl
  `;

  const items = db
    .prepare(
      `SELECT ${selectCols}
       FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       ${where}
       ORDER BY p.sold_count DESC
       LIMIT @pageSize OFFSET @offset`
    )
    .all({ ...params, pageSize, offset });

  const { total } = db
    .prepare(
      `SELECT COUNT(*) AS total
       FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       ${where}`
    )
    .get(params) as { total: number };

  return NextResponse.json({
    items,
    pageInfo: { page, pageSize, total },
  });
}
