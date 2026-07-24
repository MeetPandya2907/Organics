import Order from '../models/orderModel.js';
import Coupon from '../models/couponModel.js';
import Product from '../models/productModel.js';
import Counter from '../models/counterModel.js';
import { flushProductCache } from './productController.js';

const ORDER_NUMBER_START = 100000;

const getNextOrderNumber = async () => {
  // $inc on an upsert bypasses the schema's `default`, so the counter
  // document is seeded explicitly on its first-ever use instead.
  let counter = await Counter.findOneAndUpdate(
    { _id: 'orderNumber' },
    { $inc: { seq: 1 } },
    { new: true }
  );

  if (!counter) {
    try {
      counter = await Counter.create({ _id: 'orderNumber', seq: ORDER_NUMBER_START + 1 });
    } catch (err) {
      // Lost a race to another concurrent first-ever order — the other
      // request already seeded the document, so just increment it now.
      counter = await Counter.findOneAndUpdate(
        { _id: 'orderNumber' },
        { $inc: { seq: 1 } },
        { new: true }
      );
    }
  }

  return counter.seq;
};

// Atomically decrements stock for every order item, rejecting the whole
// order (and rolling back any items already decremented in this call) if
// any single item doesn't have enough stock left. The $gte guard makes
// each decrement safe under concurrent orders for the same product.
const reserveStockForOrder = async (orderItems) => {
  const decremented = [];

  for (const item of orderItems) {
    const updated = await Product.findOneAndUpdate(
      { _id: item.product, countInStock: { $gte: item.qty } },
      { $inc: { countInStock: -item.qty } },
      { new: true }
    );

    if (!updated) {
      for (const done of decremented) {
        await Product.updateOne({ _id: done.product }, { $inc: { countInStock: done.qty } });
      }
      const outOfStock = await Product.findById(item.product).select('name countInStock');
      return {
        ok: false,
        message: outOfStock
          ? `Only ${outOfStock.countInStock} left of "${outOfStock.name}" — please adjust the quantity in your cart.`
          : 'One of the items in your cart is no longer available.',
      };
    }

    decremented.push({ product: item.product, qty: item.qty });
  }

  flushProductCache();
  return { ok: true };
};

// Restores stock for a cancelled order — mirrors reserveStockForOrder.
const releaseStockForOrder = async (orderItems) => {
  for (const item of orderItems) {
    await Product.updateOne({ _id: item.product }, { $inc: { countInStock: item.qty } });
  }
  flushProductCache();
};

// @desc    Create new order (logged-in user or guest)
// @route   POST /api/orders
// @access  Public (guest checkout supported via protectOptional)
const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    couponCode,
    discountAmount,
    guestName,
    guestEmail,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ message: 'No order items' });
    return;
  }

  if (!req.user && (!guestName || !guestEmail)) {
    res.status(400).json({ message: 'Name and email are required for guest checkout' });
    return;
  }

  {
    const stockResult = await reserveStockForOrder(orderItems);
    if (!stockResult.ok) {
      res.status(400).json({ message: stockResult.message });
      return;
    }

    const orderNumber = await getNextOrderNumber();

    const order = new Order({
      orderNumber,
      orderItems,
      user: req.user ? req.user._id : undefined,
      guestName: req.user ? undefined : guestName,
      guestEmail: req.user ? undefined : guestEmail,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      couponCode: couponCode || undefined,
      discountAmount: discountAmount || 0,
    });

    const createdOrder = await order.save();

    if (couponCode) {
      // Best-effort usage tracking — never blocks order creation.
      Coupon.updateOne({ code: couponCode.toUpperCase() }, { $inc: { usedCount: 1 } }).catch(() => {});
    }

    res.status(201).json(createdOrder);
  }
};

// @desc    Get order by ID (owner, admin, or the guest who placed it)
// @route   GET /api/orders/:id
// @access  Public (protectOptional — ownership enforced below for logged-in orders)
const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (!order) {
    res.status(404).json({ message: 'Order not found' });
    return;
  }

  const isAdmin = req.user && req.user.isAdmin;

  if (order.user) {
    // Orders placed while logged in are only visible to their owner or an admin.
    const isOwner = req.user && order.user._id.toString() === req.user._id.toString();
    if (!isOwner && !isAdmin) {
      res.status(401).json({ message: 'Not authorized to view this order' });
      return;
    }
  } else {
    // Guest order — the Mongo _id alone is not a real access-control
    // boundary (it's routinely visible in browser history, referrers,
    // shared screenshots), so require the checkout email to match too.
    const emailMatches = req.query.email && order.guestEmail
      && order.guestEmail.toLowerCase() === req.query.email.trim().toLowerCase();
    if (!isAdmin && !emailMatches) {
      res.status(401).json({ message: 'Not authorized to view this order' });
      return;
    }
  }

  res.json(order);
};

// @desc    Look up an order by its public order number + the email used
//          at checkout — the real access-control gate for a sequential,
//          guessable identifier (unlike the Mongo _id, order numbers are
//          meant to be enumerable, so this route never trusts the number
//          alone).
// @route   GET /api/orders/track/:orderNumber?email=...
// @access  Public
const trackOrderByNumber = async (req, res) => {
  const orderNumber = Number(req.params.orderNumber);
  const { email } = req.query;

  if (!orderNumber || !email) {
    res.status(400).json({ message: 'Order number and email are required' });
    return;
  }

  const order = await Order.findOne({ orderNumber }).populate('user', 'name email');

  const ownerEmail = order && (order.user?.email || order.guestEmail);
  if (!order || !ownerEmail || ownerEmail.toLowerCase() !== email.trim().toLowerCase()) {
    // Same message whether the order doesn't exist or the email doesn't
    // match — don't let this endpoint confirm which order numbers are real.
    res.status(404).json({ message: "We couldn't find an order with that number and email combination." });
    return;
  }

  res.json(order);
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    if (order.isCancelled) return res.status(400).json({ message: 'Cannot pay for a cancelled order' });
    
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    if (order.isCancelled) return res.status(400).json({ message: 'Cannot deliver a cancelled order' });

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

// @desc    Update order to shipped
// @route   PUT /api/orders/:id/ship
// @access  Private/Admin
const updateOrderToShipped = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    if (order.isCancelled) return res.status(400).json({ message: 'Cannot ship a cancelled order' });

    order.isShipped = true;
    order.shippedAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

// @desc    Cancel an order (customer, only before it has shipped)
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404).json({ message: 'Order not found' });
    return;
  }

  if (order.user) {
    const isOwner = req.user && order.user.toString() === req.user._id.toString();
    if (!isOwner && !(req.user && req.user.isAdmin)) {
      res.status(401).json({ message: 'Not authorized to cancel this order' });
      return;
    }
  } else {
    // Guest order — require the same email used at checkout to confirm ownership.
    const isAdmin = req.user && req.user.isAdmin;
    const emailMatches = req.body.guestEmail && order.guestEmail === req.body.guestEmail;
    if (!isAdmin && !emailMatches) {
      res.status(401).json({ message: 'Not authorized to cancel this order' });
      return;
    }
  }

  if (order.isShipped) {
    res.status(400).json({ message: 'This order has already shipped and can no longer be cancelled. Please contact support.' });
    return;
  }

  if (order.isCancelled) {
    res.status(400).json({ message: 'This order is already cancelled' });
    return;
  }

  order.isCancelled = true;
  order.cancelledAt = Date.now();

  await order.save();
  await releaseStockForOrder(order.orderItems);
  const updatedOrder = await Order.findById(order._id).populate('user', 'name email');
  res.json(updatedOrder);
};

export {
  addOrderItems,
  getOrderById,
  trackOrderByNumber,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
  updateOrderToShipped,
  cancelOrder,
};
