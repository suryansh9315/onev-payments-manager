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

const database = mongoClient.db("onev");
const orders = database.collection("orders");
const drivers = database.collection("drivers");
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

app.get("/fetchAllOrders", verifyToken, verifyManager, async (req, res) => {
  try {
    const response = await instance.orders.all();
    res.status(200).json({ orders: response });
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

app.post("/fetchAllOrders", verifyToken, verifyManager, async (req, res) => {
  try {
    const response = orders.find();
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

app.post(
  "/fetchDriverAllSpent",
  verifyToken,
  verifyDriver,
  async (req, res) => {
    try {
      const query = { _id: new ObjectId(req.driver._id) };
      const driver = await drivers.findOne(query);
      res
        .status(200)
        .json({ message: "Query Successfull...", total: driver?.Paid });
    } catch (error) {
      console.log(error);
      res.status(401).json({ message: "Something went wrong" });
    }
  }
);

app.post("/fetchAllEarn", verifyToken, verifyManager, async (req, res) => {
  try {
    const drivers_list = drivers.find();
    let total = 0;
    for await (const doc of drivers_list) {
      total += doc.Paid;
    }
    res.status(200).json({ message: "Query Successfull...", total });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Something went wrong" });
  }
});

app.post(
  "/fetchDriverLast6Spent",
  verifyToken,
  verifyDriver,
  async (req, res) => {
    try {
      let data = [];
      const color = [
        "#2AB0A7",
        "#b0952a",
        "#e94646",
        "#2a43b0",
        "#b02aae",
        "#78b02a",
      ];
      const overlay_color = [
        "#defcf9",
        "#fcfbde",
        "#fcdede",
        "#dee2fc",
        "#f7defc",
        "#ebfcde",
      ];
      for (let i = 0; i < 6; i++) {
        const aggre = orders.aggregate([
          {
            $match: {
              driver_id: new ObjectId(req.driver._id),
              status: "Paid",
              created_at: {
                $gte: (new Date().valueOf() - 2678400000 * (i + 1)) / 1000,
                $lt: (new Date().valueOf() - 2678400000 * i) / 1000,
              },
            },
          },
          {
            $group: {
              _id: "",
              amount: { $sum: "$amount" },
            },
          },
        ]);
        const order_list = [];
        for await (const doc of aggre) {
          order_list.push(doc);
        }
        let total = 0;
        if (order_list.length !== 0) {
          total = order_list[0].amount;
        }
        const obj = {
          color: color[i],
          overlay_color: overlay_color[i],
          value: total / 100,
          date: new Date().valueOf() - i * 2678400000,
        };
        data.push(obj);
      }
      res.status(200).json({ message: "Query Successfull...", data });
    } catch (error) {
      console.log(error);
      res.status(401).json({ message: "Something went wrong" });
    }
  }
);

app.post("/fetchLast6Earn", verifyToken, verifyManager, async (req, res) => {
  try {
    let data = [];
    const color = [
      "#2AB0A7",
      "#b0952a",
      "#e94646",
      "#2a43b0",
      "#b02aae",
      "#78b02a",
    ];
    const overlay_color = [
      "#defcf9",
      "#fcfbde",
      "#fcdede",
      "#dee2fc",
      "#f7defc",
      "#ebfcde",
    ];
    for (let i = 0; i < 6; i++) {
      const aggre = orders.aggregate([
        {
          $match: {
            status: "Paid",
            created_at: {
              $gte: (new Date().valueOf() - 2678400000 * (i + 1)) / 1000,
              $lt: (new Date().valueOf() - 2678400000 * i) / 1000,
            },
          },
        },
        {
          $group: {
            _id: "",
            amount: { $sum: "$amount" },
          },
        },
      ]);
      const order_list = [];
      for await (const doc of aggre) {
        order_list.push(doc);
      }
      let total = 0;
      if (order_list.length !== 0) {
        total = order_list[0].amount;
      }
      const obj = {
        color: color[i],
        overlay_color: overlay_color[i],
        value: total / 100,
        date: new Date().valueOf() - i * 2678400000,
      };
      data.push(obj);
    }
    res.status(200).json({ message: "Query Successfull...", data });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Something went wrong" });
  }
});

module.exports = app;
