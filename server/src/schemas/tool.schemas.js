import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

/**
 * ============================================================================
 * Tool Schemas for CartGPT E-Commerce System
 * ============================================================================
 * Uses Zod for:
 * 1. Strict input validation (type checking, regex format, enum enforcement, .strict())
 * 2. Automatic conversion to Gemini / OpenAPI 3.0 tool schemas
 * 3. Sanitization (trimming, uppercase normalization)
 */

// Helper: Converts any Zod schema into a Gemini-compatible tool declaration
export function createGeminiTool(name, description, zodSchema) {
  const jsonSchema = zodToJsonSchema(zodSchema, {
    target: 'openApi3',
    $refStrategy: 'none',
  });

  return {
    type: "function",
    name,
    description,
    parameters: {
      type: "object",
      properties: jsonSchema.properties || {},
      required: jsonSchema.required || [],
      additionalProperties: false,
    }
  };
}

/**
 * 1. get_order Tool Schema
 */
export const GetOrderInputSchema = z.object({
  id: z.string()
    .trim()
    .min(1, "Order ID or User ID is required")
    .describe("Order ID (e.g. ORD1001) or MongoDB User ID"),
}).strict();

export const getOrderTool = createGeminiTool(
  "get_order",
  "Get order details including status, items, shipping, payment info by Order ID (e.g. ORD1001) or User ID",
  GetOrderInputSchema
);

/**
 * 2. cancel_order Tool Schema
 */
export const CancelOrderInputSchema = z.object({
  id: z.string()
    .trim()
    .min(3, "Order ID must be at least 3 characters")
    .transform(val => val.toUpperCase())
    .describe("The Order ID (e.g. ORD1003) or User ID to cancel"),

  reason: z.string()
    .trim()
    .max(200, "Reason must not exceed 200 characters")
    .optional()
    .default("Customer requested cancellation")
    .describe("Optional reason for cancellation"),
}).strict();

export const cancelOrderTool = createGeminiTool(
  "cancel_order",
  "Cancel an order if it has not shipped yet (status is PLACED, CONFIRMED, or PROCESSING). Returns cancellation and refund status.",
  CancelOrderInputSchema
);

/**
 * 3. search_products Tool Schema (For future expansion)
 */
export const SearchProductsInputSchema = z.object({
  query: z.string().trim().min(1).describe("Search keywords for products (e.g. 'headphones', 'watch')"),
  category: z.enum(["ELECTRONICS", "ACCESSORIES", "CLOTHING", "ALL"]).optional().default("ALL").describe("Product category"),
  maxPrice: z.number().positive().optional().describe("Maximum price in USD"),
  limit: z.number().int().min(1).max(20).optional().default(5).describe("Maximum number of products to return"),
}).strict();

export const searchProductsTool = createGeminiTool(
  "search_products",
  "Search the product catalog by keyword, category, and price range",
  SearchProductsInputSchema
);

// All active tools for the support agent
export const supportAgentTools = [
  getOrderTool,
  cancelOrderTool,
];

export default {
  createGeminiTool,
  GetOrderInputSchema,
  CancelOrderInputSchema,
  SearchProductsInputSchema,
  getOrderTool,
  cancelOrderTool,
  searchProductsTool,
  supportAgentTools,
};
