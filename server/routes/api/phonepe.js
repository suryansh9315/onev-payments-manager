const express = require("express");
const {
  verifyToken,
  verifyDriver,
  verifyManager,
} = require("../../middlewares/auth");
const { mongoClient } = require("../../database");
const { instance } = require("../../razorpay");
const crypto = require("crypto");
const { ObjectId } = require("mongodb");
const { createHash } = require("crypto");

const database = mongoClient.db("onev");
const orders = database.collection("orders");
const drivers = database.collection("drivers");
const app = express.Router();

app.post("/createPPURL", verifyToken, verifyDriver, async (req, res) => {
  if (
    !req.body.amount ||
    typeof req.body.amount !== "number" ||
    req.body.amount < 1
  ) {
    return res.status(400).json({ message: "Missing Fields" });
  }
  try {
    const amount = req.body.amount;
    const driver_id = req.userId;
    const driver_name = req.driver.name;
    const driver_number = req.driver.dNumber;
    const txnId = crypto.randomBytes(12).toString("hex") + "_" + Date.now()
    const order_id = "order " + crypto.randomBytes(15).toString("hex");
    const receipt = driver_id + "_" + Date.now();
    const obj_prod = {
      merchantId: process.env.PHONEPE_MERCHANT_ID,
      merchantTransactionId: txnId,
      merchantUserId: driver_id,
      amount: amount * 100,
      redirectUrl: "https://webhook.site/redirect-url",
      redirectMode: "REDIRECT",
      callbackUrl: "https://webhook.site/callback-url",
      mobileNumber: driver_number.split("")[1],
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };
    const saltKey = process.env.PHONEPE_SALT_KEY;
    const saltIndex = process.env.PHONEPE_SALT_INDEX;
    const base64_obj_prod = Buffer.from(JSON.stringify(obj_prod)).toString(
      "base64"
    );
    const sha256_prod = createHash("sha256")
      .update(base64_obj_prod + "/pg/v1/pay" + saltKey)
      .digest("hex");
    const xVerify_prod = sha256_prod + "###" + saltIndex;
    const options_prod = {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": xVerify_prod,
      },
      body: JSON.stringify({
        request: base64_obj_prod,
      }),
    };
    const response_prod = await fetch(
      "https://api.phonepe.com/apis/hermes/pg/v1/pay",
      options_prod
    );
    const data_prod = await response_prod.json();
    if (data_prod.code === "PAYMENT_INITIATED") {
      const order_object = {
        amount: amount * 100,
        amount_paid: 0,
        amount_due: amount * 100,
        driver_id,
        driver_name,
        driver_number,
        txnId,
        id: order_id,
        receipt,
        created_at: new Date().valueOf() / 1000,
        status: "created",
        currency: "INR",
        type: "Online",
        s2s_received: false,
        pp_transactionId: "",
        payment_instrument: {},
      };
      const newOrder = await orders.insertOne(order_object);
      return res
        .status(200)
        .json({ message: "Order Created Successfully", pp_url: data_prod.data.instrumentResponse.redirectInfo.url });
    }else{
      return res
        .status(400)
        .json({ message: "Payment Gateway Error" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Something Went Wrong" });
  }
});

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
  const txnId =
    req.driver._id +
    "_" +
    Date.now() +
    "_" +
    crypto.randomBytes(8).toString("hex");
  const options = {
    amount,
    currency: "INR",
    receipt,
    partial_payment: false,
  };
  try {
    const response = await instance.orders.create(options);
    const order_id = response.id;
    const order_object = {
      ...response,
      driver_id: req.driver._id,
      driver_name: req.driver.name,
      driver_number: req.driver.dNumber,
      txnId,
      razorpay_payment_id: "",
      razorpay_order_id: "",
      razorpay_signature: "",
      type: "Online",
    };
    const newOrder = await orders.insertOne(order_object);
    res
      .status(200)
      .json({ message: "Order created successfully.", order_id, txnId });
  } catch (error) {
    res.status(400).json({ message: error?.error?.description });
  }
});

app.post("/createQROrder", verifyToken, verifyDriver, async (req, res) => {
  if (
    !req.body.amount ||
    typeof req.body.amount !== "number" ||
    req.body.amount <= 1 ||
    !req.body.screenshot
  ) {
    return res.status(400).json({ message: "Missing Fields" });
  }
  const amount = req.body.amount * 100;
  const receipt = req.driver._id + "_" + Date.now();
  const order_id = "order " + crypto.randomBytes(15).toString("hex");
  const txnId =
    req.driver._id +
    "_" +
    Date.now() +
    "_" +
    crypto.randomBytes(8).toString("hex");
  try {
    const order_object = {
      driver_id: req.driver._id,
      driver_name: req.driver.name,
      driver_number: req.driver.dNumber,
      txnId,
      type: "QR_Online",
      amount,
      amount_paid: amount,
      amount_due: 0,
      currency: "INR",
      receipt,
      partial_payment: false,
      status: "created",
      created_at: Date.now(),
      screenshot: req.body.screenshot,
      id: order_id,
    };
    const newOrder = await orders.insertOne(order_object);
    res
      .status(200)
      .json({ message: "Order created successfully.", order_id, txnId });
  } catch (error) {
    res.status(400).json({ message: error?.error?.description });
  }
});

app.post("/updateQROrder", verifyToken, verifyManager, async (req, res) => {
  if (
    !req.body.order_id ||
    !req.body.currentStatus ||
    !req.body.amountReceived
  ) {
    return res.status(400).json({ message: "Missing Fields" });
  }
  try {
    const order_id = req.body.order_id;
    const amount_received = req.body.amountReceived;
    const old_status = req.body.currentStatus;
    const query = { id: order_id };
    const old_order = await orders.findOne(query);
    const update = {
      $set: {
        status: old_status === "Paid" ? "created" : "Paid",
        amount: amount_received * 100,
        amount_paid: amount_received * 100,
      },
    };
    const options = { upsert: false };
    const result = await orders.updateOne(query, update, options);
    const { matchedCount, modifiedCount } = result;
    if (matchedCount !== modifiedCount) {
      return res.status(400).json({
        status: "failure",
        message: "Something went wrong.",
      });
    }
    const driver_query = { _id: old_order.driver_id };
    const old_driver = await drivers.findOne(driver_query);
    const driver_update = {
      $set: {
        balance: old_driver.balance + amount_received,
        Paid: old_driver.Paid + amount_received,
      },
    };
    const driver_result = await drivers.updateOne(
      driver_query,
      driver_update,
      options
    );
    if (driver_result.matchedCount !== driver_result.modifiedCount) {
      return res.status(400).json({
        status: "failure",
        message: "Something went wrong.",
      });
    }
    res.status(200).json({ message: "Payment Status Updated." });
  } catch (error) {
    res.status(400).json({ message: error?.error?.description });
  }
});

app.post("/createCashOrder", verifyToken, verifyManager, async (req, res) => {
  if (
    !req.body.amount ||
    typeof req.body.amount !== "number" ||
    req.body.amount <= 1 ||
    !req.body.driver_id
  ) {
    return res.status(401).json({ message: "Missing Fields" });
  }
  const driver_query = { _id: new ObjectId(req.body.driver_id) };
  const oldDriver = await drivers.findOne(driver_query);
  const amount = req.body.amount * 100;
  const receipt = oldDriver._id + "_" + Date.now();
  const order_id = "order " + crypto.randomBytes(15).toString("hex");
  const txnId =
    oldDriver._id +
    "_" +
    Date.now() +
    "_" +
    crypto.randomBytes(8).toString("hex");
  try {
    const order_object = {
      entity: "order",
      amount,
      amount_paid: amount,
      amount_due: 0,
      currency: "INR",
      receipt,
      status: "Paid",
      created_at: new Date().valueOf() / 1000,
      driver_id: oldDriver._id,
      txnId,
      type: "Cash",
      driver_name: oldDriver.name,
      driver_number: oldDriver.dNumber,
      admin_name: req.manager.name,
      admin_number: req.manager.number,
      id: order_id,
    };
    const newOrder = await orders.insertOne(order_object);
    const options = { upsert: false };
    const driver_update = {
      $set: {
        balance: oldDriver.balance + req.body.amount,
        Paid: oldDriver.Paid + req.body.amount,
      },
    };
    const result_driver = await drivers.updateOne(
      driver_query,
      driver_update,
      options
    );
    if (result_driver.matchedCount !== result_driver.modifiedCount) {
      return res.status(401).json({
        status: "failure",
        message: "Something went wrong.",
      });
    }
    res.status(200).json({ message: "Order created successfully." });
  } catch (error) {
    res.status(400).json({ message: error?.error?.description });
  }
});

app.post("/fetchDriverOrders", verifyToken, verifyDriver, async (req, res) => {
  try {
    const query = { driver_id: new ObjectId(req.driver._id) };
    const response = orders.find(query);
    const order_list = [];
    for await (const doc of response) {
      order_list.push(doc);
    }
    res
      .status(200)
      .json({ message: "Query Successfull...", orders: order_list });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Something went wrong" });
  }
});

module.exports = app;
