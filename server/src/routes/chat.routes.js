const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const { getOrders } = require('../controllers/order.controller');

router.post('/', chatController.handleChat);

// router.get("/test",(req, res)=>{
//   res.status(200).json({message:"test"})
// });

router.get('/orders', getOrders);
router.get('/orders/:user_id', getOrders);

module.exports = router;
