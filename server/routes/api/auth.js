const express = require("express");
const dotenv = require("dotenv").config();
const client = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const { sign_jwt } = require("../../utils/jwt_helpers");
const { verifyToken, verifyManager } = require("../../middlewares/auth");
const { mongoClient } = require("../../database");

const database = mongoClient.db("onev");
const drivers = database.collection("drivers");
const managers = database.collection("managers");
const app = express.Router();
const verifications = client.verify.v2.services(
  process.env.TWILIO_SERVICE_SID
).verifications;
const verificationsChecks = client.verify.v2.services(
  process.env.TWILIO_SERVICE_SID
).verificationChecks;

app.post("/login", async (req, res) => {
  // Validate User Input
  if (
    !req.body.number ||
    req.body.number.length != 14 ||
    req.body.isManager == null
  ) {
    return res
      .status(400)
      .json({ status: "error", message: "Missing fields for login..." });
  }
  try {
    const isManager = req.body.isManager;
    const number = req.body.number;
    if (isManager) {
      // Find Manager in Database
      const query = { number: number };
      const manager = await managers.findOne(query);
      if (!manager) {
        return res
          .status(400)
          .json({ status: "error", message: "Manager does not exist." });
      }
    } else {
      // Find Driver in Database
      const query = { dNumber: number };
      const driver = await drivers.findOne(query);
      if (!driver) {
        return res
          .status(400)
          .json({ status: "error", message: "Driver does not exist." });
      }
    }
    // Send O.T.P
    const new_verification = await verifications.create({
      to: number,
      channel: "sms",
    });
    res.status(200).json({
      status: "success",
      message: "O.T.P sent to the number provided.",
    });
  } catch (error) {
    res.status(400).json({ status: "error", message: "error" });
  }
});

app.post("/verifyOtp", async (req, res) => {
  // Validate User Input
  if (
    !req.body.otp ||
    !req.body.number ||
    req.body.number.length != 14 ||
    req.body.otp.length != 4 ||
    req.body.isManager == null
  ) {
    res
      .status(400)
      .json({ status: "error", message: "Missing fields for login..." });
    return;
  }
  try {
    const otp = req.body.otp;
    const number = req.body.number;
    const isManager = req.body.isManager;
    // Verify O.T.P
    const new_verificationCheck = await verificationsChecks.create({
      to: number,
      code: otp,
    });
    if (new_verificationCheck.status != "approved") {
      return res.status(400).json({ status: "error", message: "Wrong O.T.P" });
    }
    let user;
    if (isManager) {
      const query = { number: number };
      // Find Manager in Database
      const manager = await managers.findOne(query);
      if (!manager) {
        return res
          .status(400)
          .json({ status: "error", message: "Manager does not exist." });
      }
      user = manager;
    } else {
      // Find Driver in Database
      const query = { dNumber: number };
      const driver = await drivers.findOne(query);
      if (!driver) {
        return res
          .status(400)
          .json({ status: "error", message: "Driver does not exist." });
      }
      user = driver;
    }
    // Return JWT Token with user data
    const token = sign_jwt({ id: user._id });
    res.status(200).json({
      status: "success",
      message: "Phone number verified...",
      token,
      user,
    });
  } catch (error) {
    res.status(400).json({ status: "error", message: "err", error });
  }
});

app.post("/updateDriver", verifyToken, async (req, res) => {
  // User object = req.user
  // Validate User Input
  // Update User Info in Database
  // Return user info (updated)
  res.status(200).json({
    status: "success",
    message: "Profile Updated...",
    number: req.number,
  });
});

app.post("/createDriver", verifyToken, verifyManager, async (req, res) => {
  if (!req.body.driver_obj) {
    return res
      .status(400)
      .json({ status: "error", message: "Missing fields for creating..." });
  }
  const number = req.body.driver_obj.dNumber;
  const query = { dNumber: number };
  const oldDriver = await drivers.findOne(query);
  if (oldDriver) {
    return res.status(400).json({
      status: "failure",
      message: "Driver already exists.",
    });
  }
  const driverObject = {
    ...req.body.driver_obj,
    payment_status: false,
    balance: 0,
    date: Date.now(),
    admin_name: req.manager.name,
    admin_number: req.manager.number,
  };
  const newDriver = await drivers.insertOne(driverObject);
  res.status(200).json({
    status: "success",
    message: "Driver created.",
  });
});

app.post("/checkToken", verifyToken, (req, res) => {
  res.status(200).json({ status: "success", message: "Token Valid." });
});

app.post("/getDriver", verifyToken, verifyManager, async (req, res) => {
  if (!req.body.dNumber) {
    return res
      .status(401)
      .json({ status: "error", message: "Missing fields for creating..." });
  }
  const dNumber = req.body.dNumber;
  const query = { dNumber };
  const oldDriver = await drivers.findOne(query);
  if (oldDriver) {
    return res.status(401).json({
      status: "failure",
      message: "Driver already exists.",
    });
  }
  res.status(200).json({ status: "success", message: "Token Valid." });
});

app.post("/getAllDrivers", verifyToken, verifyManager, async (req, res) => {
  const query = { name: { $exists: true } };
  const options = {
    sort: { name: 1 },
  };
  const allDrivers = drivers.find(query, options);
  docs = [];
  for await (const doc of allDrivers) {
    docs.push(doc);
  }
  res.status(200).json({ status: "success", message: "Token Valid.", docs });
});

app.post("/updatePayStatus", verifyToken, verifyManager, async (req, res) => {
  if (!req.body.dNumber) {
    return res
      .status(401)
      .json({ status: "error", message: "Missing fields for creating..." });
  }
  const dNumber = req.body.dNumber;
  const query = { dNumber };
  const oldDriver = await drivers.findOne(query);
  if (!oldDriver) {
    return res.status(401).json({
      status: "failure",
      message: "Driver doesn't exists."
    });
  }
  const old_payment_status = oldDriver.payment_status
  const old_balance = oldDriver.balance
  const rent = oldDriver.rent
  let new_balance = old_balance
  if (old_payment_status) {
    new_balance -= rent
  } else {
    new_balance += rent
  }
  const update = {
    $set: {
      payment_status: !old_payment_status,
      balance: new_balance,
    },
  };
  const options = { upsert: false };
  const result = await drivers.updateOne(query, update, options);
  const { matchedCount, modifiedCount } = result;
  if (matchedCount && modifiedCount) {
    return res
      .status(200)
      .json({ status: "success", message: "Payment Status Updated." });
  }
  res.status(401).json({
    status: "failure",
    message: "Something went wrong."
  });
});

module.exports = app;
