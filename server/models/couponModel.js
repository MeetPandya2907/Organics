import mongoose from 'mongoose';

const couponSchema = mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    discountType: {
      type: String,
      enum: ['PERCENT', 'FLAT'],
      required: true,
      default: 'PERCENT',
    },
    discountValue: {
      type: Number,
      required: true,
      default: 0,
    },
    minOrderValue: {
      type: Number,
      default: 0,
    },
    maxDiscountAmount: {
      type: Number, // caps a PERCENT discount, e.g. 10% off up to ₹200
    },
    usageLimit: {
      type: Number, // total number of times this coupon can be redeemed; null = unlimited
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;
