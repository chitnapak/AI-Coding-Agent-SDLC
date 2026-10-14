/**
 * API contract derived from the Farmart storefront UI.  The routes documented
 * here are a contract for the backend; only the documentation endpoint itself
 * is implemented in this frontend project.
 */
export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Farmart Storefront API",
    version: "1.0.0",
    description:
      "Backend contract for the Farmart catalog, product detail, cart, wishlist, member sign-up, newsletter, and Buy Now checkout flows shown in the current storefront.",
  },
  servers: [{ url: "/api", description: "Current application origin" }],
  tags: [
    { name: "Catalog", description: "Home-page categories, promotions, search, and product catalog." },
    { name: "Products", description: "Product details, variants, related products, and reviews." },
    { name: "Cart", description: "The shopping-bag count and total shown in the header." },
    { name: "Wishlist", description: "Saved products from the product-detail page." },
    { name: "Customers", description: "Member registration and newsletter subscription." },
    { name: "Checkout", description: "Buy Now order confirmation." },
  ],
  paths: {
    "/catalog/home": {
      get: {
        tags: ["Catalog"],
        summary: "Get storefront content",
        description: "Provides the categories, promotional banners, top savers, and best sellers used by the home page.",
        operationId: "getHomeCatalog",
        responses: { "200": { description: "Storefront content", content: { "application/json": { schema: { $ref: "#/components/schemas/HomeCatalog" } } } } },
      },
    },
    "/categories": {
      get: {
        tags: ["Catalog"], summary: "List product categories", operationId: "listCategories",
        responses: { "200": { description: "Categories", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Category" } } } } } },
      },
    },
    "/products": {
      get: {
        tags: ["Catalog"], summary: "Search and filter products", operationId: "listProducts",
        parameters: [
          { name: "q", in: "query", description: "Free-text search query", schema: { type: "string", maxLength: 120 } },
          { name: "category", in: "query", description: "Category slug", schema: { type: "string", example: "meats" } },
          { name: "collection", in: "query", description: "Curated collection", schema: { type: "string", enum: ["best-sellers", "top-savers", "related"] } },
          { $ref: "#/components/parameters/Page" }, { $ref: "#/components/parameters/PageSize" },
        ],
        responses: { "200": { description: "Paged products", content: { "application/json": { schema: { $ref: "#/components/schemas/ProductPage" } } } } },
      },
    },
    "/products/{productId}": {
      get: {
        tags: ["Products"], summary: "Get a product detail page", operationId: "getProduct",
        parameters: [{ $ref: "#/components/parameters/ProductId" }],
        responses: { "200": { description: "Product", content: { "application/json": { schema: { $ref: "#/components/schemas/ProductDetail" } } } }, "404": { $ref: "#/components/responses/NotFound" } },
      },
    },
    "/products/{productId}/reviews": {
      get: {
        tags: ["Products"], summary: "List product reviews", operationId: "listProductReviews",
        parameters: [{ $ref: "#/components/parameters/ProductId" }, { $ref: "#/components/parameters/Page" }, { $ref: "#/components/parameters/PageSize" }],
        responses: { "200": { description: "Reviews", content: { "application/json": { schema: { $ref: "#/components/schemas/ReviewPage" } } } } },
      },
    },
    "/cart": {
      get: {
        tags: ["Cart"], summary: "Get the current cart", operationId: "getCart", security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Cart", content: { "application/json": { schema: { $ref: "#/components/schemas/Cart" } } } } },
      },
      delete: {
        tags: ["Cart"], summary: "Empty the current cart", operationId: "clearCart", security: [{ bearerAuth: [] }],
        responses: { "204": { description: "Cart emptied" } },
      },
    },
    "/cart/items": {
      post: {
        tags: ["Cart"], summary: "Add an item to cart", operationId: "addCartItem", security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/AddCartItemRequest" } } } },
        responses: { "201": { description: "Updated cart", content: { "application/json": { schema: { $ref: "#/components/schemas/Cart" } } } }, "422": { $ref: "#/components/responses/ValidationError" } },
      },
    },
    "/cart/items/{itemId}": {
      patch: {
        tags: ["Cart"], summary: "Change cart item quantity", operationId: "updateCartItem", security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/CartItemId" }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateCartItemRequest" } } } },
        responses: { "200": { description: "Updated cart", content: { "application/json": { schema: { $ref: "#/components/schemas/Cart" } } } } },
      },
      delete: {
        tags: ["Cart"], summary: "Remove an item from cart", operationId: "removeCartItem", security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/CartItemId" }],
        responses: { "204": { description: "Item removed" } },
      },
    },
    "/wishlist/items": {
      get: {
        tags: ["Wishlist"], summary: "List saved products", operationId: "listWishlistItems", security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Saved products", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/ProductCard" } } } } } },
      },
      post: {
        tags: ["Wishlist"], summary: "Save a product", operationId: "addWishlistItem", security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["productId"], properties: { productId: { type: "string", example: "british-beef-mince" } } } } } },
        responses: { "201": { description: "Product saved" } },
      },
    },
    "/wishlist/items/{productId}": {
      delete: {
        tags: ["Wishlist"], summary: "Remove a saved product", operationId: "removeWishlistItem", security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/ProductId" }], responses: { "204": { description: "Product removed" } },
      },
    },
    "/customers": {
      post: {
        tags: ["Customers"], summary: "Register a new member", operationId: "registerCustomer",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/RegisterCustomerRequest" } } } },
        responses: { "201": { description: "Member created", content: { "application/json": { schema: { $ref: "#/components/schemas/Customer" } } } }, "409": { description: "Email already registered" }, "422": { $ref: "#/components/responses/ValidationError" } },
      },
    },
    "/newsletter/subscriptions": {
      post: {
        tags: ["Customers"], summary: "Subscribe to the newsletter", operationId: "subscribeNewsletter",
        requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["email"], properties: { email: { type: "string", format: "email" } } } } } },
        responses: { "201": { description: "Subscription created" }, "409": { description: "Already subscribed" } },
      },
    },
    "/checkout/orders": {
      post: {
        tags: ["Checkout"], summary: "Create a Buy Now order", operationId: "createOrder", security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CreateOrderRequest" } } } },
        responses: { "201": { description: "Order confirmed", content: { "application/json": { schema: { $ref: "#/components/schemas/Order" } } } }, "422": { $ref: "#/components/responses/ValidationError" } },
      },
    },
  },
  components: {
    securitySchemes: { bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" } },
    parameters: {
      ProductId: { name: "productId", in: "path", required: true, schema: { type: "string", example: "british-beef-mince" } },
      CartItemId: { name: "itemId", in: "path", required: true, schema: { type: "string", example: "ci_01J5X" } },
      Page: { name: "page", in: "query", schema: { type: "integer", minimum: 1, default: 1 } },
      PageSize: { name: "pageSize", in: "query", schema: { type: "integer", minimum: 1, maximum: 100, default: 24 } },
    },
    responses: {
      NotFound: { description: "Resource not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
      ValidationError: { description: "Request validation failed", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
    },
    schemas: {
      Money: { type: "number", format: "float", minimum: 0, example: 39.5 },
      Category: { type: "object", required: ["id", "name", "productCount"], properties: { id: { type: "string", example: "meats" }, name: { type: "string", example: "Raw Meats" }, productCount: { type: "integer", example: 29 }, icon: { type: "string", example: "🥩" }, imageUrl: { type: "string", format: "uri" } } },
      ProductCard: { type: "object", required: ["id", "title", "price", "currency", "imageUrl"], properties: { id: { type: "string" }, title: { type: "string" }, brand: { type: "string" }, category: { type: "string" }, price: { $ref: "#/components/schemas/Money" }, compareAtPrice: { $ref: "#/components/schemas/Money" }, currency: { type: "string", example: "USD" }, unit: { type: "string", example: "500g" }, rating: { type: "number", minimum: 0, maximum: 5 }, badge: { type: "string", example: "SALE -12%" }, imageUrl: { type: "string", format: "uri" } } },
      ProductVariant: { type: "object", required: ["id", "label", "price", "inStock"], properties: { id: { type: "string", example: "500g" }, label: { type: "string", example: "500g" }, price: { $ref: "#/components/schemas/Money" }, compareAtPrice: { $ref: "#/components/schemas/Money" }, inStock: { type: "boolean" }, availableQuantity: { type: "integer", example: 45 } } },
      ProductDetail: { allOf: [{ $ref: "#/components/schemas/ProductCard" }, { type: "object", required: ["sku", "description", "images", "variants"], properties: { sku: { type: "string", example: "FARM-BEEF-8921" }, description: { type: "string" }, images: { type: "array", items: { type: "string", format: "uri" } }, variants: { type: "array", items: { $ref: "#/components/schemas/ProductVariant" } }, reviewCount: { type: "integer", example: 128 }, soldCount: { type: "integer", example: 35 }, highlights: { type: "array", items: { type: "object", required: ["title", "description"], properties: { title: { type: "string" }, description: { type: "string" } } } }, nutrition: { type: "object", additionalProperties: { type: "string" } }, specifications: { type: "object", additionalProperties: { type: "string" } }, relatedProducts: { type: "array", items: { $ref: "#/components/schemas/ProductCard" } } } }] },
      Review: { type: "object", required: ["id", "author", "rating", "comment", "createdAt", "verified"], properties: { id: { type: "string" }, author: { type: "string" }, rating: { type: "integer", minimum: 1, maximum: 5 }, comment: { type: "string" }, createdAt: { type: "string", format: "date-time" }, verified: { type: "boolean" } } },
      PageInfo: { type: "object", required: ["page", "pageSize", "total"], properties: { page: { type: "integer" }, pageSize: { type: "integer" }, total: { type: "integer" } } },
      ProductPage: { type: "object", required: ["items", "pageInfo"], properties: { items: { type: "array", items: { $ref: "#/components/schemas/ProductCard" } }, pageInfo: { $ref: "#/components/schemas/PageInfo" } } },
      ReviewPage: { type: "object", required: ["items", "pageInfo"], properties: { items: { type: "array", items: { $ref: "#/components/schemas/Review" } }, pageInfo: { $ref: "#/components/schemas/PageInfo" } } },
      HomeCatalog: { type: "object", required: ["categories", "featuredBrands", "topSavers", "bestSellers"], properties: { categories: { type: "array", items: { $ref: "#/components/schemas/Category" } }, featuredBrands: { type: "array", items: { type: "object", required: ["id", "brand", "title", "imageUrl"], properties: { id: { type: "string" }, brand: { type: "string" }, title: { type: "string" }, badge: { type: "string" }, imageUrl: { type: "string", format: "uri" } } } }, topSavers: { type: "array", items: { $ref: "#/components/schemas/ProductCard" } }, bestSellers: { type: "array", items: { $ref: "#/components/schemas/ProductCard" } } } },
      CartItem: { type: "object", required: ["id", "productId", "variantId", "title", "quantity", "unitPrice", "lineTotal"], properties: { id: { type: "string" }, productId: { type: "string" }, variantId: { type: "string" }, title: { type: "string" }, quantity: { type: "integer", minimum: 1 }, unitPrice: { $ref: "#/components/schemas/Money" }, lineTotal: { $ref: "#/components/schemas/Money" } } },
      Cart: { type: "object", required: ["id", "items", "itemCount", "subtotal", "currency"], properties: { id: { type: "string" }, items: { type: "array", items: { $ref: "#/components/schemas/CartItem" } }, itemCount: { type: "integer" }, subtotal: { $ref: "#/components/schemas/Money" }, currency: { type: "string", example: "USD" } } },
      AddCartItemRequest: { type: "object", required: ["productId", "variantId", "quantity"], properties: { productId: { type: "string" }, variantId: { type: "string" }, quantity: { type: "integer", minimum: 1, maximum: 99 } } },
      UpdateCartItemRequest: { type: "object", required: ["quantity"], properties: { quantity: { type: "integer", minimum: 1, maximum: 99 } } },
      RegisterCustomerRequest: { type: "object", required: ["email", "password", "passwordConfirmation"], properties: { email: { type: "string", format: "email" }, password: { type: "string", format: "password", minLength: 8 }, passwordConfirmation: { type: "string", format: "password", minLength: 8 } } },
      Customer: { type: "object", required: ["id", "email", "createdAt"], properties: { id: { type: "string" }, email: { type: "string", format: "email" }, createdAt: { type: "string", format: "date-time" } } },
      CreateOrderRequest: { type: "object", required: ["items"], properties: { items: { type: "array", minItems: 1, items: { $ref: "#/components/schemas/AddCartItemRequest" } } } },
      Order: { type: "object", required: ["id", "status", "items", "total", "currency", "createdAt"], properties: { id: { type: "string", example: "ord_01J5X" }, status: { type: "string", enum: ["confirmed", "processing", "cancelled"] }, items: { type: "array", items: { $ref: "#/components/schemas/CartItem" } }, total: { $ref: "#/components/schemas/Money" }, currency: { type: "string", example: "USD" }, createdAt: { type: "string", format: "date-time" } } },
      Error: { type: "object", required: ["code", "message"], properties: { code: { type: "string", example: "validation_error" }, message: { type: "string" }, details: { type: "array", items: { type: "object", properties: { field: { type: "string" }, message: { type: "string" } } } } } },
    },
  },
} as const;
