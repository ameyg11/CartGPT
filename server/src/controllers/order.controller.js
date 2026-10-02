import mongoose from 'mongoose';
import Order from '../models/Order.js';

export const findOrders = async (id) => {
  const query = id
    ? (mongoose.Types.ObjectId.isValid(id)
        ? { userId: id }
        : { orderId: id.toUpperCase() })
    : {};
  console.log('Order query:', query);
  const orders = await Order.find(query);
  console.log('Orders found:', orders.length);
  return orders;
};

export const cancelOrder = async (id, reason = '') => {
  if (!id) {
    return { success: false, message: 'Order ID is required to cancel an order.' };
  }

  const query = mongoose.Types.ObjectId.isValid(id)
    ? { userId: id }
    : { orderId: id.toUpperCase() };

  console.log('Cancel order query:', query);
  const order = await Order.findOne(query);

  if (!order) {
    return { success: false, message: `Order ${id} not found.` };
  }

  if (order.status === 'CANCELLED') {
    return { 
      success: false, 
      message: `Order ${order.orderId} is already cancelled.`, 
      order 
    };
  }

  // Orders that are already shipped, out for delivery, or delivered cannot be cancelled
  if (['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.shippingStatus) || 
      ['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status)) {
    return { 
      success: false, 
      message: `Order ${order.orderId} cannot be cancelled because it has already been shipped (shipping status: ${order.shippingStatus}).`, 
      order 
    };
  }

  // Cancel the order and initiate refund if paid
  order.status = 'CANCELLED';
  order.shippingStatus = 'CANCELLED';
  if (order.paymentStatus === 'PAID') {
    order.paymentStatus = 'REFUNDED';
  }
  await order.save();

  console.log(`Order ${order.orderId} successfully cancelled.`);
  return {
    success: true,
    message: `Order ${order.orderId} has been successfully cancelled. ${order.paymentStatus === 'REFUNDED' ? 'A full refund has been initiated.' : ''}`,
    refundInitiated: order.paymentStatus === 'REFUNDED',
    order
  };
};

export const getOrders = async (req, res) => {
  const id = req?.params?.user_id || req?.params?.userId;

  try {
    const orders = await findOrders(id);
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: error.message || 'Error fetching orders' });
  }
};

export default { getOrders, findOrders, cancelOrder };