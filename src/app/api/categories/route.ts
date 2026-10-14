/**
 * /api/categories – GET
 * Returns all product categories.
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

  return NextResponse.json(categories);
}
