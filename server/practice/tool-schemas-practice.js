/**
 * ============================================================================
 * PRACTICAL MASTERCLASS: Tool Schemas in LLM Function Calling
 * ----------------------------------------------------------------------------
 * 1. First Principles: Why do LLMs need Schemas?
 * 2. Raw JSON Schema (The Wire Format)
 * 3. Zod (Declarative Schema & Runtime Safety)
 * 4. Strict Validation (Defending Against LLM Hallucinations & Bad Inputs)
 * 5. Practical Exercises & Self-Healing Agent Execution
 * ============================================================================
 * 
 * To run this interactive practice file:
 *   node practice/tool-schemas-practice.js
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

console.log(`\n==================================================================`);
console.log(`  PART 1: FIRST PRINCIPLES — WHY DO WE NEED TOOL SCHEMAS?`);
console.log(`==================================================================\n`);

/**
 * 💡 FIRST PRINCIPLE:
 * LLMs are probabilistic autoregressive next-token predictors.
 * They do not inherently know your database structure, your backend APIs, 
 * or the exact variable names your code expects.
 * 
 * If you ask an LLM: "Get me order ORD1007", without a schema it might output:
 * - "The order id is 1007" (as text)
 * - { "order_number": 1007 } (wrong key name, number instead of string)
 * - { "id": "ord1007", "extra_guess": true } (unexpected keys)
 * 
 * A TOOL SCHEMA is a strict CONTRACT between two worlds:
 * 
 *   [ Unstructured Natural Language (User) ]
 *                    │
 *                    ▼
 *   [ LLM Reasoning Engine (Gemini) ]
 *                    │  (Constrained by Tool Schema)
 *                    ▼
 *   [ Structured Function Arguments (JSON) ]
 *                    │  (Validated at Runtime by Zod)
 *                    ▼
 *   [ Deterministic Backend Code (Database/APIs) ]
 */

console.log(`Concept: A Tool Schema is a two-way contract:`);
console.log(` 1. Upstream Contract: Tells the LLM what parameters it is allowed to pass.`);
console.log(` 2. Downstream Guard: Validates that the LLM's generated JSON is 100% safe before executing code.\n`);


console.log(`==================================================================`);
console.log(`  PART 2: RAW JSON SCHEMA (The Standard Wire Format)`);
console.log(`==================================================================\n`);

/**
 * All major AI providers (Gemini, OpenAI, Anthropic) accept JSON Schema (OpenAPI 3.0 subset).
 * Here is how you write it manually:
 */
const manualJsonSchema = {
  type: "function",
  name: "get_order_manual",
  description: "Retrieve order details by Order ID",
  parameters: {
    type: "object",
    properties: {
      orderId: {
        type: "string",
        description: "The unique order identifier, e.g. ORD1001",
        pattern: "^ORD\\d{4}$"
      },
      includeHistory: {
        type: "boolean",
        description: "Whether to include full tracking history"
      }
    },
    required: ["orderId"],
    additionalProperties: false // Disallow extra hallucinated keys
  }
};

console.log("Raw JSON Schema Object:\n", JSON.stringify(manualJsonSchema, null, 2));
console.log(`
⚠️ The Problem with writing Raw JSON Schema by hand:
  - Verbose and prone to syntax typos (e.g. forgetting 'required', missing 'properties').
  - No runtime validation in JavaScript (JSON schema alone does not validate data received in Node.js!).
  - Duplication: You write the schema once for the LLM, and then write manual 'if (!id)' checks in your code.
`);


console.log(`==================================================================`);
console.log(`  PART 3: ZOD — DECLARATIVE SCHEMAS + RUNTIME SAFETY`);
console.log(`==================================================================\n`);

/**
 * ZOD gives you:
 * 1. Clean, readable schema definitions.
 * 2. Automatic conversion to JSON Schema for the LLM.
 * 3. Single Source of Truth: Define once, use for both LLM prompt AND backend runtime validation!
 */

// Step 1: Define the schema using Zod
const GetOrderZodSchema = z.object({
  id: z.string()
    .min(3, "Order ID must be at least 3 characters")
    .describe("Order ID (e.g. ORD1001) or MongoDB User ID"),
  includeHistory: z.boolean()
    .optional()
    .default(false)
    .describe("Whether to include historical tracking timeline"),
});

// Step 2: Automatically convert Zod schema to Gemini-compatible JSON Schema
function zodToGeminiTool(name, description, zodSchema) {
  const jsonSchema = zodToJsonSchema(zodSchema, {
    target: 'openApi3',
    $refStrategy: 'none'
  });

  return {
    type: "function",
    name,
    description,
    parameters: {
      type: "object",
      properties: jsonSchema.properties || {},
      required: jsonSchema.required || [],
      // strict mode
      additionalProperties: false
    }
  };
}

const geminiToolFromZod = zodToGeminiTool(
  "get_order",
  "Get order details including status, items, and shipping info",
  GetOrderZodSchema
);

console.log("Generated Gemini Tool Definition from Zod:\n", JSON.stringify(geminiToolFromZod, null, 2));


console.log(`\n==================================================================`);
console.log(`  PART 4: STRICT VALIDATION (Defending Against LLM Hallucinations)`);
console.log(`==================================================================\n`);

/**
 * LLMs frequently produce edge-case data:
 * - Passing string numbers: { amount: "100" } instead of { amount: 100 }
 * - Hallucinating extra keys: { id: "ORD1001", debug: true, user: "admin" }
 * - Case mismatch: "ord1007" instead of "ORD1007"
 * 
 * Strict Zod validation handles all of these!
 */

// Strict Schema with formatting, regex, transforms, and .strict()
const CancelOrderStrictSchema = z.object({
  id: z.string()
    .trim()
    .regex(/^ORD\d{4}$/i, "Order ID must be in the format ORD followed by 4 digits (e.g. ORD1001)")
    .transform(val => val.toUpperCase()) // automatically normalize to uppercase!
    .describe("The 7-character Order ID (e.g. ORD1001)"),

  reason: z.enum([
    "FOUND_BETTER_PRICE",
    "ORDERED_BY_MISTAKE",
    "SHIPPING_TOO_SLOW",
    "CUSTOMER_REQUEST",
    "OTHER"
  ], {
    errorMap: () => ({ message: "Reason must be one of the allowed categories: FOUND_BETTER_PRICE, ORDERED_BY_MISTAKE, SHIPPING_TOO_SLOW, CUSTOMER_REQUEST, OTHER" })
  }).default("CUSTOMER_REQUEST").describe("Category reason for cancellation"),

  notes: z.string()
    .max(200, "Notes cannot exceed 200 characters")
    .optional()
    .describe("Optional additional notes from customer"),
}).strict(); // 🚨 .strict() rejects any unknown properties!

console.log("--- TEST 1: Valid LLM Arguments ---");
const validLLMInput = {
  id: "ord1007", // lowercase, should be transformed to 'ORD1007'
  reason: "ORDERED_BY_MISTAKE",
  notes: "Bought the wrong color"
};
const parsed1 = CancelOrderStrictSchema.safeParse(validLLMInput);
console.log("Valid parse result:", parsed1);

console.log("\n--- TEST 2: LLM Hallucinated Extra Keys (.strict() in action) ---");
const hallucinatedInput = {
  id: "ORD1007",
  reason: "CUSTOMER_REQUEST",
  unauthorized_admin_override: true // Extra hallucinated parameter!
};
const parsed2 = CancelOrderStrictSchema.safeParse(hallucinatedInput);
console.log("Hallucination caught:", parsed2.success ? "Passed" : parsed2.error.issues);

console.log("\n--- TEST 3: Invalid Order ID Format ---");
const invalidFormatInput = {
  id: "INVALID_123",
  reason: "INVALID_REASON"
};
const parsed3 = CancelOrderStrictSchema.safeParse(invalidFormatInput);
console.log("Format error caught:", parsed3.success ? "Passed" : parsed3.error.issues.map(i => `${i.path.join('.')}: ${i.message}`));


console.log(`\n==================================================================`);
console.log(`  PART 5: SELF-HEALING AGENT EXECUTION (Real Gemini Integration)`);
console.log(`==================================================================\n`);

/**
 * What happens if the LLM generates invalid arguments?
 * Instead of crashing your server, you catch the Zod error and send the error message
 * back to Gemini in 'function_result'. Gemini will read the error and SELF-CORRECT!
 */
async function runSelfHealingDemo() {
  if (!process.env.GOOGLE_API_KEY) {
    console.log("⚠️ Set GOOGLE_API_KEY to test live Gemini execution.");
    return;
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
  const model = 'gemini-3.5-flash';

  const CancelToolDefinition = zodToGeminiTool(
    "cancel_order",
    "Cancel an order with a strict reason category",
    CancelOrderStrictSchema
  );

  console.log("Asking Gemini to cancel an order...");
  const userPrompt = "Cancel my order ord1007 because I bought it by mistake";

  let interaction = await ai.interactions.create({
    model,
    input: userPrompt,
    tools: [CancelToolDefinition],
    system_instruction: "You are an assistant. When cancelling an order, call cancel_order with the exact required parameters."
  });

  const toolCall = interaction.steps?.find(s => s.type === "function_call");
  if (toolCall) {
    console.log(`\n🤖 Gemini initiated tool call '${toolCall.name}' with raw arguments:`, toolCall.arguments);

    // 🛡️ STEP: Runtime Validation using Zod
    const validation = CancelOrderStrictSchema.safeParse(toolCall.arguments);

    let toolResult;
    if (!validation.success) {
      console.log("❌ Zod Validation Failed! Returning error to Gemini for self-correction...");
      toolResult = {
        error: "VALIDATION_ERROR",
        details: validation.error.issues.map(i => `${i.path.join('.')}: ${i.message}`)
      };
    } else {
      console.log("✅ Zod Validation Succeeded! Sanitized arguments:", validation.data);
      toolResult = {
        success: true,
        orderId: validation.data.id,
        status: "CANCELLED",
        message: `Order ${validation.data.id} cancelled successfully for reason: ${validation.data.reason}`
      };
    }

    // Return the result back to Gemini
    const finalInteraction = await ai.interactions.create({
      model,
      previous_interaction_id: interaction.id,
      input: [{
        type: "function_result",
        call_id: toolCall.id,
        name: toolCall.name,
        result: JSON.stringify(toolResult)
      }]
    });

    console.log("\n🤖 Gemini Final Response to User:\n", finalInteraction.output_text);
  }
}

runSelfHealingDemo().catch(console.error);
