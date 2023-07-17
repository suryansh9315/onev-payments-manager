const express = require("express");
const {
  verifyToken,
  verifyDriver,
  verifyManager,
} = require("../../middlewares/auth");
const { mongoClient } = require("../../database");
const { instance } = require("../../razorpay");
const crypto = require('crypto');

const database = mongoClient.db("onev");
const orders = database.collection("orders");
const app = express.Router();

app.post("/createOrder", verifyToken, verifyDriver, async (req, res) => {
  if (
    !req.body.amount ||
    typeof req.body.amount !== "number" ||
    req.body.amount <= 1
  ) {
    return res.status(400).json({ message: "Missing Fields" });
  }
  const amount = req.body.amount * 100;
  const receipt = req.driver._id + "_" + Date.now();
  const txnId = req.driver._id + "_" + Date.now() + "_" + crypto.randomBytes(8).toString('hex');
  const options = {
    amount,
    currency: "INR",
    receipt,
    partial_payment: false
  };
  try {
    const response = await instance.orders.create(options);
    const order_id = response.id;
    const order_object = {
      ...response,
      driver_id: req.driver._id,
      txnId,
      razorpay_payment_id: "",
      razorpay_order_id: "",
      razorpay_signature: "",
    };
    const newOrder = await orders.insertOne(order_object);
    res.status(200).json({ message: "Order created successfully.", order_id, txnId });
  } catch (error) {
    res.status(400).json({ message: error?.error?.description });
  }
});

app.get("/fetchAllOrders", verifyToken, verifyManager, async (req, res) => {
  try {
    const response = await instance.orders.all();
    res.status(200).json({ orders: response });
  } catch (error) {
    res.status(400).json({ message: error?.error?.description });
  }
});

app.post("/fetchDriverOrders", verifyToken, verifyDriver, async (req, res) => {
  try {
    const response = await instance.orders.all();
    res.status(200).json({ orders: response });
  } catch (error) {
    res.status(400).json({ message: error?.error?.description });
  }
});

app.post("/fetchOrderById", async (req, res) => {
  if (!req.body.orderId) {
    return res.status(400).json({ message: "Missing Fields" });
  }
  try {
    const orderId = req.body.orderId;
    const response = await instance.orders.fetch(orderId);
    res.status(200).json({ order: response });
  } catch (error) {
    res.status(400).json({ message: error?.error?.description });
  }
});

// app.post("/fetchPaymentsOfOrder", async (req, res) => {
//   if (!req.body.orderId) {
//     return res.status(400).json({ message: "Missing Fields" });
//   }
//   try {
//     const orderId = req.body.orderId;
//     const response = await instance.orders.fetchPayments(orderId);
//     res.status(200).json({ order: response });
//   } catch (error) {
//     res.status(400).json({ message: error?.error?.description });
//   }
// });

// app.post("/updateOrder", async (req, res) => {
//   if (!req.body.orderId) {
//     return res.status(400).json({ message: "Missing Fields" });
//   }
//   try {
//     const orderId = req.body.orderId;
//     const response = await instance.orders.edit(orderId, {
//       notes: {
//         key1: "value3",
//         key2: "value2",
//       },
//     });
//     res.status(200).json({ order: response });
//   } catch (error) {
//     res.status(400).json({ message: error?.error?.description });
//   }
// });

module.exports = app;
