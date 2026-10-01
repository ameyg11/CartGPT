# Orderly Chaos - AI Ecommerce Support Playground

An intentionally small, modular MERN stack application designed specifically for practicing **LLM tool calling and AI customer support**. 

The purpose of this project is to provide a dummy ecommerce backend (with MongoDB models and data) so you can write custom tools that Gemini can call to answer customer queries.

## Architecture

```text
React (Chat UI)
 ↓
Express (Backend API)
 ↓
Gemini (LLM)
 ↓
Custom Tools (You build these!)
 ↓
MongoDB (Dummy Ecommerce Data)
 ↓
Function Result
 ↓
Gemini (Final synthesis)
 ↓
React (Final response)
```

## Getting Started

### 1. Prerequisites
- Node.js
- MongoDB running locally (default: `mongodb://localhost:27017/orderly-chaos`)
- A Google Gemini API Key

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory (you can copy `.env.example`):
```text
GOOGLE_API_KEY=your_real_gemini_api_key_here
MONGODB_URI=mongodb://localhost:27017/orderly-chaos
PORT=5000
```

Seed the database with dummy users, products, and orders:
```bash
node src/seed/seed.js
```
or run `npm run seed` if added to `package.json`.

Start the server:
```bash
node server.js
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```

## How to Practice Tool Calling

The backend is intentionally missing the actual tools. It's your job to implement them!
Follow this sequence to practice tool calling:

### Tool 1: Get Order Status
- **Create**: `get_order(orderId)`
- **Practice**: "Where is ORD1001?"

### Tool 2: Customer History
- **Create**: `get_customer_orders(email)`
- **Practice**: "Show me all orders for amey@example.com."

### Tool 3: Track Package
- **Create**: `track_order(orderId)`
- **Practice**: "Where is my package for ORD1005?"

### Tool 4: Cancel Order
- **Create**: `cancel_order(orderId)`
- **Practice**: "Can I cancel ORD1003?"

### Tool 5: Refund
- **Create**: `refund_order(orderId)`
- **Practice**: "Can I get a refund for ORD1004?"

## Development Flow for Adding Tools

1. **Create Gemini function declaration** in `services/gemini.service.js`.
2. **Create JavaScript implementation** in `src/tools/` using Mongoose models.
3. **Detect `function_call`** in `services/chat.service.js`.
4. **Execute your function** and collect the result.
5. **Return `function_result`** back to Gemini.

Enjoy the chaos!
