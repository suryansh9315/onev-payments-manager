const express = require("express");
const {
  verifyToken,
  verifyManager,
  verifyDriver,
} = require("../../middlewares/auth");
const { validatePaymentSignature } = require("../../utils/razorpay_helpers");
const { mongoClient } = require("../../database");
const { instance } = require("../../razorpay");

const database = mongoClient.db("onev");
const orders = database.collection("orders");

const app = express.Router();

app.post("/verifySignature", verifyToken, verifyDriver, async (req, res) => {
  const query = { driver_id: req.driver._id };
  const order = await orders.findOne(query);
  if (!order) {
    return res
      .status(400)
      .json({ status: "error", message: "Order does not exist." });
  }
  const order_id = order.id;
  const razorpay_payment_id = req.body.razorpay_payment_id;
  const razorpay_order_id = req.body.razorpay_order_id;
  const razorpay_signature = req.body.razorpay_signature;
  const update = {
    $set: {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    },
  };
  const options = { upsert: false };
  const result = await drivers.updateOne(query, update, options);
  const { matchedCount, modifiedCount } = result;
  if (matchedCount !== modifiedCount) {
    return res.status(401).json({
      status: "failure",
      message: "Something went wrong.",
    });
  }
  const value = validatePaymentSignature(
    order_id,
    razorpay_payment_id,
    razorpay_signature
  );
  if (value) {
    return res
      .status(200)
      .json({ status: "success", message: "Payment Verified." });
  }
  res
    .status(400)
    .json({ status: "error", message: "Payment was not verified." });
});

module.exports = app;
