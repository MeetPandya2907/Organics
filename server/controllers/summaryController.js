import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';

// @desc    Get complete store summary for Admin Dashboard
// @route   GET /api/summary
// @access  Private/Admin
export const getSummary = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name');
    const users = await User.find();
    const products = await Product.find();

    // 1. Core Metrics
    const totalOrders = orders.length;
    const totalSales = orders.reduce((sum, order) => sum + (order.isPaid ? order.totalPrice : 0), 0);
    const totalUsers = users.length;
    const pendingOrders = orders.filter(order => !order.isDelivered).length;
    const lowStockItems = products.filter(product => product.countInStock <= 5).length;

    // 2. Sales by Date (Line Chart)
    const salesDataObj = {};
    orders.filter(order => order.isPaid).forEach(order => {
      const date = new Date(order.paidAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!salesDataObj[date]) {
        salesDataObj[date] = { date, sales: 0, orders: 0 };
      }
      salesDataObj[date].sales += order.totalPrice;
      salesDataObj[date].orders += 1;
    });
    // Sort chronologically (assuming paidAt is sortable, but usually it's chronological if from DB)
    const salesByDate = Object.values(salesDataObj);

    // 3. Sales by Category (Pie Chart)
    const categoryDataObj = {};
    orders.forEach(order => {
      if (order.isPaid) {
        order.orderItems.forEach(item => {
          // Since we didn't store category in orderItem, we might need to look it up or group by name.
          // In a perfect system, orderItems would retain category.
          // For now, we fetch product data matching the item.
        });
      }
    });

    // Alternatively, just group products by category for stock value! Let's do Sales by Category the robust way:
    const categorySales = {};
    for (const order of orders) {
      if (order.isPaid) {
        for (const item of order.orderItems) {
          const product = products.find(p => p._id.toString() === item.product.toString());
          const category = product ? product.category : 'Unknown';
          if (!categorySales[category]) categorySales[category] = 0;
          categorySales[category] += item.price * item.qty;
        }
      }
    }
    const salesByCategory = Object.keys(categorySales).map(key => ({
      name: key,
      value: categorySales[key]
    }));

    // 4. Recent Orders (Table data)
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalOrders,
      totalSales,
      totalUsers,
      pendingOrders,
      lowStockItems,
      salesByDate,
      salesByCategory,
      recentOrders
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
