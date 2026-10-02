import express from 'express';
import chatController from '../controllers/chat.controller.js';
import { getOrders } from '../controllers/order.controller.js';

const router = express.Router();

router.post('/', chatController.handleChat);

// router.get("/test",(req, res)=>{
//   res.status(200).json({message:"test"})
// });

router.get('/orders', getOrders);
router.get('/orders/:user_id', getOrders);

export default router;
