import { GoogleGenAI } from '@google/genai';
import { findOrders } from '../controllers/order.controller.js';

// Initialize Gemini client (requires GOOGLE_API_KEY env var)
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

const getOrderFunction = {
  type: "function",
  name: "get_order",
  description: "Get order details including status, items, shipping, etc. by Order ID (e.g. ORD1001) or User ID",
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

export async function get_order(id) {
  try {
    const orders = await findOrders(id);
    return orders;
  } catch (error) {
    console.error('get_order tool error:', error);
    return { error: error.message };
  }
}

const tools = [getOrderFunction];

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
 * Communicates with Gemini API using the Interactions API
 * @param {Array|String} messages - Chat history or user prompt string
 * @param {Object} debugInfo - Debug panel tracker for tools
 * @returns {Object} The Gemini response with text and interaction details
 */
export async function generateResponse(messages, debugInfo = null) {
  const system_instruction = "You are a helpful customer support assistant for an ecommerce store called Orderly Chaos. You help customers with their orders. When an order is found, clearly explain its status, items, tracking details, and estimated delivery date to the user.";

  let promptText = "";
  if (typeof messages === 'string') {
    promptText = messages;
  } else if (Array.isArray(messages) && messages.length > 0) {
    promptText = messages[messages.length - 1]?.parts?.[0]?.text || "";
  }

  const model = 'gemini-3.8-flash';

  try {
    const interaction = await ai.interactions.create({
      model,
      input: promptText,
      system_instruction,
      tools: tools,
    });

    const callStep = interaction.steps?.find(step => step.type === "function_call");

    if (callStep) {
      console.log(`[Interaction Tool Call] ${callStep.name}:`, callStep.arguments);

      if (debugInfo && debugInfo.toolCalls) {
        debugInfo.toolCalls.push({
          name: callStep.name,
          arguments: callStep.arguments,
        });
      }

      let toolResult = [];
      if (callStep.name === "get_order") {
        toolResult = await get_order(callStep.arguments?.id);
      }

      const finalInteraction = await ai.interactions.create({
        model,
        previous_interaction_id: interaction.id,
        input: [{
          type: "function_result",
          call_id: callStep.id,
          name: callStep.name,
          result: JSON.stringify(toolResult)
        }],
      });

      const text = getInteractionText(finalInteraction);
      return {
        text,
        interaction: finalInteraction
      };
    }

    const text = getInteractionText(interaction);
    return {
      text,
      interaction
    };

  } catch (error) {
    console.error('Gemini Interactions Service Error:', error);
    throw error;
  }
}

export default {
  generateResponse,
  get_order,
  tools
};
