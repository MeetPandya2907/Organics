import express from 'express';
import { getSummary } from '../controllers/summaryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, admin, getSummary);

export default router;
