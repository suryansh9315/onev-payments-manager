const express = require("express");
const {
  verifyToken,
  verifyDriver,
} = require("../../middlewares/auth");
const { validatePaymentSignature } = require("../../utils/razorpay_helpers");
const { mongoClient } = require("../../database");

const database = mongoClient.db("onev");
const orders = database.collection("orders");
const drivers = database.collection("drivers");

const app = express.Router();

app.post("/verifySignature", verifyToken, verifyDriver, async (req, res) => {
  if (!req.body.txnId) {
    return res.status(400).json({ message: "Missing Fields" });
  }
  const query = { txnId: req.body.txnId };
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
  const value = validatePaymentSignature(
    order_id,
    razorpay_payment_id,
    razorpay_signature
  );
  if (!value) {
    return res
      .status(400)
      .json({ status: "error", message: "Payment was not verified." });
  }
  const update = {
    $set: {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      amount_paid: order.amount_due,
      amount_due: 0,
      status: "Paid",
      attempts: 1
    },
  };
  const options = { upsert: false };
  const result = await orders.updateOne(query, update, options);
  const { matchedCount, modifiedCount } = result;
  if (matchedCount !== modifiedCount) {
    return res.status(401).json({
      status: "failure",
      message: "Something went wrong.",
    });
  }
  const driver_query = { dNumber: req.driver.dNumber }
  const oldDriver = await drivers.findOne(driver_query);
  const driver_update = {
    $set: {
      balance: oldDriver.balance + order.amount/100,
      Paid: oldDriver.Paid + order.amount/100
    },
  }
  const result_driver = await drivers.updateOne(driver_query, driver_update, options);
  if (result_driver.matchedCount !== result_driver.modifiedCount) {
    return res.status(401).json({
      status: "failure",
      message: "Something went wrong.",
    });
  }
  res.status(200).json({ status: "error", message: "Payment verified." });
});

module.exports = app;
