const Order = require('../models/Order');

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    console.log('Orders:', orders);
    res.status(200).json(orders);
  } catch (error) {
    console.log('Error fetching orders:', error);
    res.status(500).json({ error: 'Error fetching orders' });
  }
}


module.exports = { getOrders };