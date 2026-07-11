import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/orderModel.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Create Razorpay Order
// @route   POST /api/payment/razorpay/create
// @access  Private
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, orderId } = req.body;
    
    // Validate order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to pay for this order' });
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: Math.round(amount * 100), // amount in smallest currency unit (paise)
      currency: 'INR',
      receipt: `receipt_order_${orderId}`,
    };

    const razorpayOrder = await instance.orders.create(options);

    if (!razorpayOrder) {
      return res.status(500).json({ message: 'Failed to create Razorpay order' });
    }

    res.json(razorpayOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payment/razorpay/verify
// @access  Private
const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment is verified
      const order = await Order.findById(orderId);
      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
          id: razorpay_payment_id,
          status: 'success',
          update_time: Date.now().toString(),
          email_address: req.user.email,
        };

        const updatedOrder = await order.save();

        // Send email receipt
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
            <div style="background-color: #0c3927; padding: 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Organics Store</h1>
            </div>
            <div style="padding: 30px; background-color: #faf7f2;">
              <h2 style="color: #0c3927; margin-top: 0;">Payment Successful!</h2>
              <p style="color: #555; font-size: 16px; line-height: 1.5;">Hi ${req.user.name},</p>
              <p style="color: #555; font-size: 16px; line-height: 1.5;">Thank you for your order! We have successfully received your payment of <strong>₹${order.totalPrice}</strong>.</p>
              
              <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #eee;">
                <h3 style="color: #0c3927; margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 10px;">Order Summary (Order #${order._id.toString().substring(0, 8)})</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  ${order.orderItems.map(item => `
                    <tr>
                      <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333;">${item.name} x ${item.qty}</td>
                      <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right; color: #333;">₹${item.price * item.qty}</td>
                    </tr>
                  `).join('')}
                  <tr>
                    <td style="padding: 10px 0; font-weight: bold; color: #0c3927;">Total</td>
                    <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #0c3927;">₹${order.totalPrice}</td>
                  </tr>
                </table>
              </div>

              <p style="color: #555; font-size: 16px; line-height: 1.5;">Your order is now being processed. We will notify you once it ships!</p>
            </div>
            <div style="background-color: #f5f5f5; padding: 15px; text-align: center; color: #888; font-size: 12px;">
              &copy; ${new Date().getFullYear()} Organics Store. All rights reserved.
            </div>
          </div>
        `;

        sendEmail({
          email: req.user.email,
          subject: `Order Receipt - Organics Store (#${order._id.toString().substring(0, 8)})`,
          html: emailHtml,
        });

        res.json({ message: 'Payment verified successfully', order: updatedOrder });
      } else {
        res.status(404).json({ message: 'Order not found' });
      }
    } else {
      res.status(400).json({ message: 'Invalid signature sent!' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Razorpay Key Id
// @route   GET /api/payment/razorpay/key
// @access  Private
const getRazorpayKeyId = (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID });
};

export { createRazorpayOrder, verifyRazorpayPayment, getRazorpayKeyId };
