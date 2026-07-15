// OpenAPI / Swagger configuration.
//
// The API contract is generated from JSDoc @openapi annotations that live next
// to the routes (server/routes/*.js), so it stays in sync with the code instead
// of drifting into a separate document. Reusable schemas are defined here under
// components.schemas and referenced from the route annotations.
const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");

const PORT = process.env.PORT || 3001;

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "TechnoRetail API",
      version: "1.0.0",
      description:
        "REST API for the TechnoRetail e-commerce backend (Express + Prisma + MySQL). " +
        "This contract is generated from JSDoc annotations in server/routes/*.js.",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Local development server",
      },
    ],
    tags: [
      { name: "Products", description: "Product catalog" },
      { name: "Categories", description: "Product categories" },
      { name: "Orders", description: "Customer orders" },
      { name: "Order Products", description: "Products that belong to an order" },
      { name: "Users", description: "User accounts" },
      { name: "Search", description: "Product search" },
      { name: "Slugs", description: "Product lookup by slug" },
      { name: "Merchants", description: "Merchants" },
      { name: "Notifications", description: "User notifications" },
      { name: "Product Images", description: "Additional product images" },
      { name: "Main Image", description: "Main image upload" },
      { name: "Bulk Upload", description: "CSV bulk product upload" },
      { name: "Wishlist", description: "User wishlist (route currently disabled in app.js)" },
      { name: "Promo Codes", description: "Promo code validation (available on the promo-code feature branch)" },
    ],
    components: {
      schemas: {
        Product: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            slug: { type: "string", example: "smart-phone-demo" },
            title: { type: "string", example: "Smart phone" },
            mainImage: { type: "string", example: "product1.webp" },
            price: { type: "integer", example: 22 },
            rating: { type: "integer", example: 5 },
            description: { type: "string" },
            manufacturer: { type: "string", example: "Samsung" },
            inStock: { type: "integer", example: 1 },
            categoryId: { type: "string", format: "uuid" },
          },
        },
        ProductInput: {
          type: "object",
          required: ["slug", "title", "price", "manufacturer", "categoryId"],
          properties: {
            merchantId: { type: "string" },
            slug: { type: "string" },
            title: { type: "string" },
            mainImage: { type: "string" },
            price: { type: "integer" },
            description: { type: "string" },
            manufacturer: { type: "string" },
            categoryId: { type: "string" },
            inStock: { type: "integer", example: 1 },
          },
        },
        Category: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string", example: "smart-phones" },
          },
        },
        CategoryInput: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string", example: "smart-phones" },
          },
        },
        Order: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            lastname: { type: "string" },
            phone: { type: "string" },
            email: { type: "string", format: "email" },
            company: { type: "string" },
            adress: { type: "string" },
            apartment: { type: "string" },
            postalCode: { type: "string" },
            dateTime: { type: "string", format: "date-time" },
            status: { type: "string", example: "pending" },
            city: { type: "string" },
            country: { type: "string" },
            orderNotice: { type: "string", nullable: true },
            total: { type: "integer", example: 52 },
          },
        },
        OrderInput: {
          type: "object",
          required: [
            "name", "lastname", "phone", "email", "company",
            "adress", "apartment", "city", "country", "postalCode", "total",
          ],
          properties: {
            name: { type: "string" },
            lastname: { type: "string" },
            phone: { type: "string" },
            email: { type: "string", format: "email" },
            company: { type: "string" },
            adress: { type: "string" },
            apartment: { type: "string" },
            city: { type: "string" },
            country: { type: "string" },
            postalCode: { type: "string" },
            status: { type: "string", example: "pending" },
            total: { type: "integer" },
            orderNotice: { type: "string" },
            userId: { type: "string", nullable: true },
          },
        },
        OrderProduct: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            customerOrderId: { type: "string", format: "uuid" },
            productId: { type: "string", format: "uuid" },
            quantity: { type: "integer", example: 1 },
          },
        },
        OrderProductInput: {
          type: "object",
          required: ["customerOrderId", "productId", "quantity"],
          properties: {
            customerOrderId: { type: "string", format: "uuid" },
            productId: { type: "string", format: "uuid" },
            quantity: { type: "integer", example: 1 },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            email: { type: "string", format: "email" },
            role: { type: "string", example: "user" },
          },
        },
        UserInput: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 8, example: "Secret123" },
            role: { type: "string", example: "user" },
          },
        },
        Merchant: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
            description: { type: "string" },
            phone: { type: "string" },
            address: { type: "string" },
            status: { type: "string", example: "active" },
          },
        },
        Notification: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            userId: { type: "string", format: "uuid" },
            message: { type: "string" },
            type: { type: "string" },
            isRead: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        PromoCode: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            code: { type: "string", example: "SAVE10" },
            discountType: { type: "string", enum: ["percentage", "fixed"] },
            discountValue: { type: "integer", example: 10 },
            validUntil: { type: "string", format: "date-time", nullable: true },
            isActive: { type: "boolean" },
            minOrderAmount: { type: "integer", example: 0 },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: { type: "string" },
            details: {
              oneOf: [
                { type: "string" },
                { type: "array", items: { type: "object" } },
              ],
            },
          },
        },
      },
    },
  },
  // Scan the route files for @openapi annotations.
  // swagger-jsdoc's glob matcher needs forward slashes, so normalise the
  // absolute path on Windows (path.join would produce backslashes).
  apis: [path.join(__dirname, "routes", "*.js").replace(/\\/g, "/")],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerSpec };
