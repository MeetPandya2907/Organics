import express from 'express';
import {
  addOrderItems,
  getOrderById,
  trackOrderByNumber,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
  updateOrderToShipped,
  cancelOrder,
} from '../controllers/orderController.js';
import { protect, protectOptional, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protectOptional, addOrderItems).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/track/:orderNumber').get(trackOrderByNumber);
router.route('/:id').get(protectOptional, getOrderById);
router.route('/:id/pay').put(protectOptional, updateOrderToPaid);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);
router.route('/:id/ship').put(protect, admin, updateOrderToShipped);
router.route('/:id/cancel').put(protectOptional, cancelOrder);

export default router;
