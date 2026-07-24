import express from 'express';
import {
  authUser,
  googleAuth,
  sendOtp,
  registerUser,
  logoutUser,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  saveUserCart,
  addAddress,
  deleteAddress,
  setDefaultAddress,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(registerUser).get(protect, admin, getUsers);
router.post('/google-auth', googleAuth);
router.post('/send-otp', sendOtp);
router.post('/reset-password', resetPassword);
router.post('/login', authUser);
router.post('/logout', logoutUser);
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.route('/cart').put(protect, saveUserCart);
router.route('/addresses').post(protect, addAddress);
router.route('/addresses/:addressId').delete(protect, deleteAddress);
router.route('/addresses/:addressId/default').put(protect, setDefaultAddress);
router.route('/:id').delete(protect, admin, deleteUser).get(protect, admin, getUserById).put(protect, admin, updateUser);

export default router;
