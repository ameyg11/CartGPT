import { GoogleGenAI } from '@google/genai';
import { findOrders, cancelOrder } from '../controllers/order.controller.js';

// Initialize Gemini client (requires GOOGLE_API_KEY env var)
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

const getOrderFunction = {
  type: "function",
  name: "get_order",
  description: "Get order details including status, items, shipping, payment info by Order ID (e.g. ORD1001) or User ID",
  parameters: {
    type: "object",
    properties: {
      id: {
        type: "string",
        description: "Order ID (e.g. ORD1001) or MongoDB User ID",
      },
    },
    required: ["id"],
  },
};

const cancelOrderFunction = {
  type: "function",
  name: "cancel_order",
  description: "Cancel an order if it has not shipped yet (status is PLACED, CONFIRMED, or PROCESSING). Returns cancellation and refund status.",
  parameters: {
    type: "object",
    properties: {
      id: {
        type: "string",
        description: "The Order ID (e.g. ORD1003) or User ID to cancel",
      },
      reason: {
        type: "string",
        description: "Optional reason for cancellation",
      },
    },
    required: ["id"],
  },
};

export async function get_order(id) {
  try {
    const orders = await findOrders(id);
    return orders;
  } catch (error) {
    console.error('get_order tool error:', error);
    return { error: error.message };
  }
}

export async function cancel_order(id, reason = '') {
  try {
    const result = await cancelOrder(id, reason);
    return result;
  } catch (error) {
    console.error('cancel_order tool error:', error);
    return { success: false, error: error.message };
  }
}

const tools = [getOrderFunction, cancelOrderFunction];

function getInteractionText(interaction) {
  if (interaction?.output_text) {
    return interaction.output_text;
  }
  if (Array.isArray(interaction?.steps)) {
    for (const step of interaction.steps) {
      if (step.type === 'model_output' && Array.isArray(step.content)) {
        const textPart = step.content.find(c => c.text)?.text;
        if (textPart) return textPart;
      }
    }
  }
  return "";
}

/**
 * Communicates with Gemini API using the Interactions API with multi-step tool support
 * @param {Array|String} messages - Chat history or user prompt string
 * @param {Object} debugInfo - Debug panel tracker for tools
 * @returns {Object} The Gemini response with text and interaction details
 */
export async function generateResponse(messages, debugInfo = null) {
  const system_instruction = `You are a helpful and polite customer support assistant for an ecommerce store called Orderly Chaos.
You assist customers with order tracking, order inquiries, and order cancellations.
Guidelines:
1. When asked about order details or status, use the get_order tool.
2. When asked to check if an order can be cancelled and/or cancel it:
   - First check the order using get_order.
   - If the user explicitly requested to cancel if eligible, and the order is eligible (not yet shipped), call cancel_order.
   - If the user only asked if it can be cancelled, confirm eligibility and ask if they would like you to proceed with cancellation.
3. Clearly explain what actions were taken and answer any questions the user asked about which tools or steps were used.`;

  let promptText = "";
  if (typeof messages === 'string') {
    promptText = messages;
  } else if (Array.isArray(messages) && messages.length > 0) {
    promptText = messages[messages.length - 1]?.parts?.[0]?.text || "";
  }

  const model = 'gemini-3.5-flash';
  const MAX_TURNS = 5;

  try {
    let currentInteraction = await ai.interactions.create({
      model,
      input: promptText,
      system_instruction,
      tools: tools,
    });

    let turn = 0;
    while (turn < MAX_TURNS) {
      turn++;
      const callSteps = currentInteraction.steps?.filter(step => step.type === "function_call") || [];

      if (callSteps.length === 0) {
        break;
      }

      const functionResults = [];

      for (const callStep of callSteps) {
        console.log(`[Interaction Tool Call - Turn ${turn}] ${callStep.name}:`, callStep.arguments);

        if (debugInfo && debugInfo.toolCalls) {
          debugInfo.toolCalls.push({
            name: callStep.name,
            arguments: callStep.arguments,
            turn,
          });
        }

        let toolResult = null;
        if (callStep.name === "get_order") {
          const orderId = callStep.arguments?.id || callStep.arguments?.orderId;
          toolResult = await get_order(orderId);
        } else if (callStep.name === "cancel_order") {
          const orderId = callStep.arguments?.id || callStep.arguments?.orderId;
          const reason = callStep.arguments?.reason || '';
          toolResult = await cancel_order(orderId, reason);
        } else {
          toolResult = { error: `Unknown tool: ${callStep.name}` };
        }

        functionResults.push({
          type: "function_result",
          call_id: callStep.id,
          name: callStep.name,
          result: JSON.stringify(toolResult)
        });
      }

      currentInteraction = await ai.interactions.create({
        model,
        previous_interaction_id: currentInteraction.id,
        input: functionResults,
      });
    }

    const text = getInteractionText(currentInteraction);
    return {
      text,
      interaction: currentInteraction
    };

  } catch (error) {
    console.error('Gemini Interactions Service Error:', error);
    throw error;
  }
}

export default {
  generateResponse,
  get_order,
  cancel_order,
  tools
};
