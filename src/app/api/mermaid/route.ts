import { NextResponse } from "next/server";

/**
 * GET /api/mermaid
 * Returns a Mermaid erDiagram string reflecting the farmart.db schema.
 */
export async function GET() {
  const diagram = `erDiagram
    categories {
        TEXT id PK
        TEXT name
        TEXT icon
        TEXT imageUrl
        INTEGER productCount
        INTEGER sortOrder
    }

    products {
        TEXT id PK
        TEXT sku
        TEXT title
        TEXT brand
        TEXT categoryId FK
        TEXT description
        REAL price
        REAL compareAtPrice
        TEXT currency
        TEXT unit
        REAL rating
        INTEGER reviewCount
        INTEGER soldCount
        TEXT badge
        TEXT imageUrl
        TEXT collection
        INTEGER isActive
        TEXT createdAt
    }

    productImages {
        INTEGER id PK
        TEXT productId FK
        TEXT url
        INTEGER sortOrder
    }

    productVariants {
        TEXT id PK
        TEXT productId FK
        TEXT label
        REAL price
        REAL compareAtPrice
        INTEGER inStock
        INTEGER availableQuantity
    }

    productHighlights {
        INTEGER id PK
        TEXT productId FK
        TEXT title
        TEXT description
    }

    featuredBrands {
        TEXT id PK
        TEXT brand
        TEXT title
        TEXT badge
        TEXT imageUrl
        INTEGER sortOrder
    }

    reviews {
        TEXT id PK
        TEXT productId FK
        TEXT author
        INTEGER rating
        TEXT comment
        INTEGER verified
        TEXT createdAt
    }

    categories ||--o{ products : "has"
    products ||--o{ productImages : "has"
    products ||--o{ productVariants : "has"
    products ||--o{ productHighlights : "has"
    products ||--o{ reviews : "has"
`;

  return NextResponse.json({ diagram });
}
