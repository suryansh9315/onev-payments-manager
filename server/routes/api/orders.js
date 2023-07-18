const express = require("express");
const {
  verifyToken,
  verifyDriver,
  verifyManager,
} = require("../../middlewares/auth");
const { mongoClient } = require("../../database");
const { instance } = require("../../razorpay");
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
      razorpay_payment_id: "",
      razorpay_order_id: "",
      razorpay_signature: "",
    };
    const newOrder = await orders.insertOne(order_object);
    res.status(200).json({ message: "Order created successfully.", order_id });
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

app.post(
  "/fetchDriverLast6Spent",
  verifyToken,
  verifyDriver,
  async (req, res) => {
    try {
      let data = [];
      const color = ["#2AB0A7", "#b0952a", "#e94646", "#2a43b0", "#b02aae", "#78b02a"]
      const overlay_color = ["#defcf9", "#fcfbde", "#fcdede", "#dee2fc", "#f7defc", "#ebfcde"]
      for (let i = 0; i < 6; i++) {
        const aggre = orders.aggregate([
          {
            $match: {
              driver_id: new ObjectId(req.driver._id),
              created_at: {
                $gte: (new Date().valueOf() - (2678400000 * (i + 1))) / 1000,
                $lt: (new Date().valueOf() - (2678400000 * i)) / 1000,
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
        if(order_list.length !== 0){
          total = order_list[0].amount
        }
        const obj = {
          color: color[i],
          overlay_color: overlay_color[i],
          value: total / 100,
          date: new Date().valueOf() - (i * 2678400000) 
        }
        data.push(obj)
      }
      res.status(200).json({ message: "Query Successfull...", data });
    } catch (error) {
      console.log(error);
      res.status(401).json({ message: "Something went wrong" });
    }
  }
);

// app.post("/fetchOrderById", verifyToken, async (req, res) => {
//   if (!req.body.orderId) {
//     return res.status(400).json({ message: "Missing Fields" });
//   }
//   try {
//     const orderId = req.body.orderId;
//     const response = await instance.orders.fetch(orderId);
//     res.status(200).json({ order: response });
//   } catch (error) {
//     res.status(400).json({ message: error?.error?.description });
//   }
// });

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
