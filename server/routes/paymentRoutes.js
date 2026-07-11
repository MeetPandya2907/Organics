import express from 'express';
import { createRazorpayOrder, verifyRazorpayPayment, getRazorpayKeyId } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/razorpay/create').post(protect, createRazorpayOrder);
router.route('/razorpay/verify').post(protect, verifyRazorpayPayment);
router.route('/razorpay/key').get(protect, getRazorpayKeyId);

export default router;
