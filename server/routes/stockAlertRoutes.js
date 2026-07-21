import express from 'express';
import { createStockAlert } from '../controllers/stockAlertController.js';

const router = express.Router();

router.route('/').post(createStockAlert);

export default router;
