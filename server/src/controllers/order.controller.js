import mongoose from 'mongoose';
import Order from '../models/Order.js';

export const getOrders = async (req, res) => {
  const id = req.params.user_id || req.params.userId;

  try {
    const query = id
      ? (mongoose.Types.ObjectId.isValid(id)
          ? { userId: id }
          : { orderId: id.toUpperCase() })
      : {};
    console.log('Order query:', query);
    const orders = await Order.find(query);
    console.log('Orders found:', orders);
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: error.message || 'Error fetching orders' });
  }
};

export default { getOrders };