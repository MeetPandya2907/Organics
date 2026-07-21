import Coupon from '../models/couponModel.js';

// @desc    List all coupons
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.json(coupons);
};

// @desc    Create a coupon
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = async (req, res) => {
  const { code, discountType, discountValue, minOrderValue, maxDiscountAmount, usageLimit, expiresAt, isActive } = req.body;

  if (!code || !discountValue) {
    res.status(400).json({ message: 'Coupon code and discount value are required' });
    return;
  }

  const exists = await Coupon.findOne({ code: code.trim().toUpperCase() });
  if (exists) {
    res.status(400).json({ message: 'A coupon with this code already exists' });
    return;
  }

  const coupon = new Coupon({
    code: code.trim().toUpperCase(),
    discountType: discountType || 'PERCENT',
    discountValue,
    minOrderValue: minOrderValue || 0,
    maxDiscountAmount: maxDiscountAmount || undefined,
    usageLimit: usageLimit || undefined,
    expiresAt: expiresAt || undefined,
    isActive: isActive !== undefined ? isActive : true,
  });

  const created = await coupon.save();
  res.status(201).json(created);
};

// @desc    Update a coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
const updateCoupon = async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    res.status(404).json({ message: 'Coupon not found' });
    return;
  }

  const { code, discountType, discountValue, minOrderValue, maxDiscountAmount, usageLimit, expiresAt, isActive } = req.body;

  if (code) coupon.code = code.trim().toUpperCase();
  if (discountType) coupon.discountType = discountType;
  if (discountValue !== undefined) coupon.discountValue = discountValue;
  if (minOrderValue !== undefined) coupon.minOrderValue = minOrderValue;
  if (maxDiscountAmount !== undefined) coupon.maxDiscountAmount = maxDiscountAmount;
  if (usageLimit !== undefined) coupon.usageLimit = usageLimit;
  if (expiresAt !== undefined) coupon.expiresAt = expiresAt;
  if (isActive !== undefined) coupon.isActive = isActive;

  const updated = await coupon.save();
  res.json(updated);
};

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    res.status(404).json({ message: 'Coupon not found' });
    return;
  }
  await Coupon.deleteOne({ _id: coupon._id });
  res.json({ message: 'Coupon removed' });
};

// @desc    Validate a coupon code against an order subtotal (used at checkout)
// @route   POST /api/coupons/validate
// @access  Private
const validateCoupon = async (req, res) => {
  const { code, subtotal } = req.body;

  const coupon = await Coupon.findOne({ code: (code || '').trim().toUpperCase() });

  if (!coupon || !coupon.isActive) {
    res.status(404).json({ message: 'Invalid or inactive coupon code' });
    return;
  }
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    res.status(400).json({ message: 'This coupon has expired' });
    return;
  }
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    res.status(400).json({ message: 'This coupon has reached its usage limit' });
    return;
  }
  if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
    res.status(400).json({ message: `Minimum order value for this coupon is ₹${coupon.minOrderValue}` });
    return;
  }

  let discount = coupon.discountType === 'PERCENT'
    ? (subtotal * coupon.discountValue) / 100
    : coupon.discountValue;

  if (coupon.maxDiscountAmount) {
    discount = Math.min(discount, coupon.maxDiscountAmount);
  }
  discount = Math.min(discount, subtotal);

  res.json({
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    discountAmount: Math.round(discount * 100) / 100,
  });
};

export { getCoupons, createCoupon, updateCoupon, deleteCoupon, validateCoupon };
