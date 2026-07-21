import StockAlert from '../models/stockAlertModel.js';
import Product from '../models/productModel.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Subscribe to a back-in-stock alert for a product
// @route   POST /api/stock-alerts
// @access  Public
const createStockAlert = async (req, res) => {
  const { productId, email } = req.body;

  if (!productId || !email) {
    res.status(400).json({ message: 'Product and email are required' });
    return;
  }

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404).json({ message: 'Product not found' });
    return;
  }

  try {
    await StockAlert.findOneAndUpdate(
      { product: productId, email: email.toLowerCase().trim() },
      { product: productId, email: email.toLowerCase().trim(), notified: false },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.status(201).json({ message: `We'll email you the moment ${product.name} is back in stock.` });
  } catch (error) {
    res.status(500).json({ message: 'Could not save your request. Please try again.' });
  }
};

// @desc    Notify all subscribers that a product is back in stock (best-effort, non-blocking)
// Called internally from productController when stock goes 0 -> >0.
const notifyBackInStock = async (product) => {
  try {
    const alerts = await StockAlert.find({ product: product._id, notified: false });
    if (alerts.length === 0) return;

    await Promise.all(
      alerts.map((alert) =>
        sendEmail({
          email: alert.email,
          subject: `${product.name} is back in stock!`,
          html: `<p>Good news — <strong>${product.name}</strong> is back in stock at FitTree Organics.</p><p>Grab it before it sells out again: <a href="${process.env.CLIENT_URL || ''}/product/${product._id}">Shop now</a></p>`,
        })
      )
    );

    await StockAlert.updateMany({ product: product._id, notified: false }, { notified: true });
  } catch (error) {
    console.error(`Failed to send back-in-stock notifications: ${error.message}`);
  }
};

export { createStockAlert, notifyBackInStock };
