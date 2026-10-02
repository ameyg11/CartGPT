import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

dotenv.config({ path: '../../.env' }); // Adjust if needed depending on where script is run
// Assuming the script is run from project root or server root
dotenv.config();

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not defined");
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for Seeding');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const usersData = [
  { name: 'Amey Gawade', email: 'amey@example.com', phone: '+91-9000000001', address: 'Nashik, Maharashtra' },
  { name: 'Rahul Sharma', email: 'rahul@example.com', phone: '+91-9000000002', address: 'Mumbai, Maharashtra' },
  { name: 'Priya Patil', email: 'priya@example.com', phone: '+91-9000000003', address: 'Pune, Maharashtra' },
  { name: 'John Doe', email: 'john@example.com', phone: '+1-555-1234567', address: 'New York, USA' },
  { name: 'Jane Smith', email: 'jane@example.com', phone: '+1-555-9876543', address: 'London, UK' },
  { name: 'Amit Singh', email: 'amit@example.com', phone: '+91-9000000004', address: 'Delhi, India' },
  { name: 'Sneha Gupta', email: 'sneha@example.com', phone: '+91-9000000005', address: 'Bangalore, India' },
  { name: 'David Lee', email: 'david@example.com', phone: '+1-555-4443333', address: 'San Francisco, USA' }
];

const productsData = [
  { name: 'Wireless Headphones', category: 'Electronics', price: 150, sku: 'ELEC-WH-001', stock: 50, description: 'High quality noise cancelling headphones.' },
  { name: 'Mechanical Keyboard', category: 'Electronics', price: 120, sku: 'ELEC-MK-002', stock: 30, description: 'RGB mechanical keyboard with brown switches.' },
  { name: 'Wireless Mouse', category: 'Electronics', price: 60, sku: 'ELEC-WM-003', stock: 100, description: 'Ergonomic wireless mouse.' },
  { name: 'USB-C Hub', category: 'Electronics', price: 45, sku: 'ELEC-UH-004', stock: 75, description: '7-in-1 USB-C Hub with HDMI and SD card reader.' },
  { name: 'Laptop Stand', category: 'Electronics', price: 35, sku: 'ELEC-LS-005', stock: 60, description: 'Adjustable aluminum laptop stand.' },
  { name: 'Smartwatch', category: 'Electronics', price: 200, sku: 'ELEC-SW-006', stock: 40, description: 'Fitness tracker smartwatch with heart rate monitor.' },
  { name: 'Laptop Sleeve', category: 'Accessories', price: 25, sku: 'ACC-LS-001', stock: 150, description: 'Water-resistant laptop sleeve 15-inch.' },
  { name: 'Phone Case', category: 'Accessories', price: 15, sku: 'ACC-PC-002', stock: 200, description: 'Clear shockproof phone case.' },
  { name: 'Charging Cable', category: 'Accessories', price: 10, sku: 'ACC-CC-003', stock: 300, description: '2m braided USB-C charging cable.' },
  { name: 'Power Bank', category: 'Accessories', price: 40, sku: 'ACC-PB-004', stock: 80, description: '10000mAh fast charging power bank.' },
  { name: 'Desk Lamp', category: 'Home', price: 30, sku: 'HOM-DL-001', stock: 45, description: 'LED desk lamp with adjustable brightness.' },
  { name: 'Water Bottle', category: 'Home', price: 20, sku: 'HOM-WB-002', stock: 120, description: 'Insulated stainless steel water bottle.' },
  { name: 'Backpack', category: 'Home', price: 70, sku: 'HOM-BP-003', stock: 55, description: 'Travel backpack with laptop compartment.' },
  { name: 'Coffee Mug', category: 'Home', price: 12, sku: 'HOM-CM-004', stock: 90, description: 'Ceramic coffee mug 350ml.' },
  { name: 'Notebook', category: 'Home', price: 8, sku: 'HOM-NB-005', stock: 250, description: 'A5 ruled notebook 200 pages.' }
];

const seedData = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    
    console.log('Cleared existing data.');

    // Insert Users
    const insertedUsers = await User.insertMany(usersData);
    console.log(`Inserted ${insertedUsers.length} users.`);
    
    const userMap = {};
    insertedUsers.forEach(u => userMap[u.email] = u);

    // Insert Products
    const insertedProducts = await Product.insertMany(productsData);
    console.log(`Inserted ${insertedProducts.length} products.`);
    
    const productMap = {};
    insertedProducts.forEach(p => productMap[p.sku] = p);

    // Generate Orders based on instructions
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 3);

    const ordersData = [
      {
        orderId: 'ORD1001',
        userId: userMap['amey@example.com']._id,
        items: [{ productId: productMap['ELEC-WH-001']._id, productName: productMap['ELEC-WH-001'].name, quantity: 1, price: productMap['ELEC-WH-001'].price }],
        totalAmount: productMap['ELEC-WH-001'].price,
        status: 'SHIPPED',
        paymentStatus: 'PAID',
        shippingStatus: 'IN_TRANSIT',
        trackingNumber: 'TRK100001',
        estimatedDeliveryDate: futureDate,
        shippingAddress: userMap['amey@example.com'].address
      },
      {
        orderId: 'ORD1002',
        userId: userMap['amey@example.com']._id,
        items: [{ productId: productMap['ELEC-MK-002']._id, productName: productMap['ELEC-MK-002'].name, quantity: 1, price: productMap['ELEC-MK-002'].price }],
        totalAmount: productMap['ELEC-MK-002'].price,
        status: 'DELIVERED',
        paymentStatus: 'PAID',
        shippingStatus: 'DELIVERED',
        trackingNumber: 'TRK100002',
        deliveredDate: new Date(),
        shippingAddress: userMap['amey@example.com'].address
      },
      {
        orderId: 'ORD1003',
        userId: userMap['rahul@example.com']._id,
        items: [
          { productId: productMap['ACC-PB-004']._id, productName: productMap['ACC-PB-004'].name, quantity: 2, price: productMap['ACC-PB-004'].price },
          { productId: productMap['ACC-CC-003']._id, productName: productMap['ACC-CC-003'].name, quantity: 1, price: productMap['ACC-CC-003'].price }
        ],
        totalAmount: (productMap['ACC-PB-004'].price * 2) + productMap['ACC-CC-003'].price,
        status: 'PROCESSING',
        paymentStatus: 'PAID',
        shippingStatus: 'NOT_SHIPPED',
        shippingAddress: userMap['rahul@example.com'].address
      },
      {
        orderId: 'ORD1004',
        userId: userMap['priya@example.com']._id,
        items: [{ productId: productMap['HOM-BP-003']._id, productName: productMap['HOM-BP-003'].name, quantity: 1, price: productMap['HOM-BP-003'].price }],
        totalAmount: productMap['HOM-BP-003'].price,
        status: 'CANCELLED',
        paymentStatus: 'REFUNDED',
        shippingStatus: 'CANCELLED',
        shippingAddress: userMap['priya@example.com'].address
      },
      {
        orderId: 'ORD1005',
        userId: userMap['amey@example.com']._id,
        items: [{ productId: productMap['ELEC-LS-005']._id, productName: productMap['ELEC-LS-005'].name, quantity: 1, price: productMap['ELEC-LS-005'].price }],
        totalAmount: productMap['ELEC-LS-005'].price,
        status: 'OUT_FOR_DELIVERY',
        paymentStatus: 'PAID',
        shippingStatus: 'OUT_FOR_DELIVERY',
        trackingNumber: 'TRK100005',
        shippingAddress: userMap['amey@example.com'].address
      },
      // More realistic orders
      {
        orderId: 'ORD1006',
        userId: userMap['john@example.com']._id,
        items: [{ productId: productMap['HOM-DL-001']._id, productName: productMap['HOM-DL-001'].name, quantity: 1, price: productMap['HOM-DL-001'].price }],
        totalAmount: productMap['HOM-DL-001'].price,
        status: 'PLACED',
        paymentStatus: 'PENDING',
        shippingStatus: 'NOT_SHIPPED',
        shippingAddress: userMap['john@example.com'].address
      },
      {
        orderId: 'ORD1007',
        userId: userMap['jane@example.com']._id,
        items: [{ productId: productMap['ELEC-SW-006']._id, productName: productMap['ELEC-SW-006'].name, quantity: 1, price: productMap['ELEC-SW-006'].price }],
        totalAmount: productMap['ELEC-SW-006'].price,
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        shippingStatus: 'NOT_SHIPPED',
        shippingAddress: userMap['jane@example.com'].address
      },
      {
        orderId: 'ORD1008',
        userId: userMap['amit@example.com']._id,
        items: [{ productId: productMap['ACC-LS-001']._id, productName: productMap['ACC-LS-001'].name, quantity: 1, price: productMap['ACC-LS-001'].price }],
        totalAmount: productMap['ACC-LS-001'].price,
        status: 'SHIPPED',
        paymentStatus: 'PAID',
        shippingStatus: 'IN_TRANSIT',
        trackingNumber: 'TRK100008',
        shippingAddress: userMap['amit@example.com'].address
      },
      {
        orderId: 'ORD1009',
        userId: userMap['sneha@example.com']._id,
        items: [{ productId: productMap['HOM-WB-002']._id, productName: productMap['HOM-WB-002'].name, quantity: 3, price: productMap['HOM-WB-002'].price }],
        totalAmount: productMap['HOM-WB-002'].price * 3,
        status: 'DELIVERED',
        paymentStatus: 'PAID',
        shippingStatus: 'DELIVERED',
        trackingNumber: 'TRK100009',
        deliveredDate: new Date(Date.now() - 86400000), // 1 day ago
        shippingAddress: userMap['sneha@example.com'].address
      },
      {
        orderId: 'ORD1010',
        userId: userMap['david@example.com']._id,
        items: [{ productId: productMap['ELEC-UH-004']._id, productName: productMap['ELEC-UH-004'].name, quantity: 1, price: productMap['ELEC-UH-004'].price }],
        totalAmount: productMap['ELEC-UH-004'].price,
        status: 'CANCELLED',
        paymentStatus: 'PARTIALLY_REFUNDED',
        shippingStatus: 'CANCELLED',
        shippingAddress: userMap['david@example.com'].address
      },
      {
        orderId: 'ORD1011',
        userId: userMap['amey@example.com']._id,
        items: [{ productId: productMap['HOM-CM-004']._id, productName: productMap['HOM-CM-004'].name, quantity: 4, price: productMap['HOM-CM-004'].price }],
        totalAmount: productMap['HOM-CM-004'].price * 4,
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        shippingStatus: 'NOT_SHIPPED',
        shippingAddress: userMap['amey@example.com'].address
      },
      {
        orderId: 'ORD1012',
        userId: userMap['rahul@example.com']._id,
        items: [{ productId: productMap['ELEC-WM-003']._id, productName: productMap['ELEC-WM-003'].name, quantity: 1, price: productMap['ELEC-WM-003'].price }],
        totalAmount: productMap['ELEC-WM-003'].price,
        status: 'SHIPPED',
        paymentStatus: 'PAID',
        shippingStatus: 'IN_TRANSIT',
        trackingNumber: 'TRK100012',
        estimatedDeliveryDate: futureDate,
        shippingAddress: userMap['rahul@example.com'].address
      },
      {
        orderId: 'ORD1013',
        userId: userMap['priya@example.com']._id,
        items: [{ productId: productMap['HOM-NB-005']._id, productName: productMap['HOM-NB-005'].name, quantity: 5, price: productMap['HOM-NB-005'].price }],
        totalAmount: productMap['HOM-NB-005'].price * 5,
        status: 'DELIVERED',
        paymentStatus: 'PAID',
        shippingStatus: 'DELIVERED',
        trackingNumber: 'TRK100013',
        deliveredDate: new Date(),
        shippingAddress: userMap['priya@example.com'].address
      },
      {
        orderId: 'ORD1014',
        userId: userMap['john@example.com']._id,
        items: [{ productId: productMap['ACC-PC-002']._id, productName: productMap['ACC-PC-002'].name, quantity: 1, price: productMap['ACC-PC-002'].price }],
        totalAmount: productMap['ACC-PC-002'].price,
        status: 'OUT_FOR_DELIVERY',
        paymentStatus: 'PAID',
        shippingStatus: 'OUT_FOR_DELIVERY',
        trackingNumber: 'TRK100014',
        shippingAddress: userMap['john@example.com'].address
      },
      {
        orderId: 'ORD1015',
        userId: userMap['jane@example.com']._id,
        items: [{ productId: productMap['ELEC-WH-001']._id, productName: productMap['ELEC-WH-001'].name, quantity: 2, price: productMap['ELEC-WH-001'].price }],
        totalAmount: productMap['ELEC-WH-001'].price * 2,
        status: 'PROCESSING',
        paymentStatus: 'PAID',
        shippingStatus: 'NOT_SHIPPED',
        shippingAddress: userMap['jane@example.com'].address
      }
    ];

    const insertedOrders = await Order.insertMany(ordersData);
    console.log(`Inserted ${insertedOrders.length} orders.`);

    console.log('\nDatabase seeded successfully.\n');
    console.log(`Users: ${insertedUsers.length}`);
    console.log(`Products: ${insertedProducts.length}`);
    console.log(`Orders: ${insertedOrders.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
