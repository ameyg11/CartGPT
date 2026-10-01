# Custom Tools Directory

This directory is an extension point for your custom AI tools.

**DO NOT** expect to find pre-built tools here. The purpose of this project is for you to learn and build them yourself!

## How to add your own tools

1. **Create Gemini function declaration**
   Define the structure of your tool using the Gemini API specification.

2. **Create JavaScript implementation**
   Create a file here (e.g., `getOrder.tool.js`) and implement the logic using Mongoose to interact with the database.
   
   Example:
   ```javascript
   const Order = require('../models/Order');
   
   async function getOrder(orderId) {
     return await Order.findOne({ orderId }).populate('userId');
   }
   ```

3. **Register function**
   Add your function declaration to the `tools` array in `services/gemini.service.js` or `services/chat.service.js`.

4. **Detect `function_call`**
   In `chat.service.js`, check if Gemini's response includes a function call.

5. **Execute function**
   Map the function name provided by Gemini to your actual JavaScript function and execute it with the provided arguments.

6. **Return `function_result`**
   Send the result of your function execution back to Gemini so it can formulate the final answer.

7. **Continue Gemini interaction**
   Loop the process or return the final text response to the user.

Happy coding and learning!
