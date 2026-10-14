/**
 * Unit tests for GET /api/mermaid
 */
import { describe, it, expect } from 'vitest';

const { GET } = await import('@/app/api/mermaid/route');

async function callGet() {
  const res = await GET();
  return { status: res.status, body: await res.json() };
}

describe('GET /api/mermaid', () => {
  it('returns 200', async () => {
    const { status } = await callGet();
    expect(status).toBe(200);
  });

  it('returns JSON with a diagram field', async () => {
    const { body } = await callGet();
    expect(body).toHaveProperty('diagram');
    expect(typeof body.diagram).toBe('string');
  });

  it('diagram starts with erDiagram', async () => {
    const { body } = await callGet();
    expect(body.diagram.trim()).toMatch(/^erDiagram/);
  });

  it('diagram contains all 7 entity definitions', async () => {
    const { body } = await callGet();
    const diagram: string = body.diagram;

    expect(diagram).toContain('categories {');
    expect(diagram).toContain('products {');
    expect(diagram).toContain('productImages {');
    expect(diagram).toContain('productVariants {');
    expect(diagram).toContain('productHighlights {');
    expect(diagram).toContain('featuredBrands {');
    expect(diagram).toContain('reviews {');
  });

  it('diagram contains all relationship lines', async () => {
    const { body } = await callGet();
    const diagram: string = body.diagram;

    expect(diagram).toContain('categories ||--o{ products');
    expect(diagram).toContain('products ||--o{ productImages');
    expect(diagram).toContain('products ||--o{ productVariants');
    expect(diagram).toContain('products ||--o{ productHighlights');
    expect(diagram).toContain('products ||--o{ reviews');
  });

  it('diagram does not contain invalid PK_FK key type', async () => {
    const { body } = await callGet();
    expect(body.diagram).not.toContain('PK_FK');
  });

  it('diagram uses camelCase for field names (no snake_case)', async () => {
    const { body } = await callGet();
    const diagram: string = body.diagram;

    // snake_case field names are not allowed in the diagram
    expect(diagram).not.toMatch(/\b(image_url|product_count|sort_order|category_id|compare_at_price|review_count|sold_count|is_active|created_at|product_id|in_stock|available_quantity)\b/);
  });

  it('entities have PK markers on id fields', async () => {
    const { body } = await callGet();
    const diagram: string = body.diagram;

    // Each entity should have at least one PK field
    const pkCount = (diagram.match(/\bPK\b/g) ?? []).length;
    expect(pkCount).toBeGreaterThanOrEqual(7); // at least one PK per entity
  });

  it('entities have FK markers on foreign key fields', async () => {
    const { body } = await callGet();
    const diagram: string = body.diagram;

    const fkCount = (diagram.match(/\bFK\b/g) ?? []).length;
    expect(fkCount).toBeGreaterThanOrEqual(5); // products, product_images, variants, highlights, reviews each have FK
  });
});
