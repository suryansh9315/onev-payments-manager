const dotenv = require("dotenv").config();
const crypto = require("crypto");

const secret = process.env.RAZORPAY_KEY_SECRET;

const validatePaymentSignature = (order_id, payment_id, signature) => {
  generated_signature = crypto.createHmac("sha256", secret).update(order_id + "|" + payment_id).digest("hex")
  return generated_signature === signature
};

module.exports = { validatePaymentSignature };
