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
    const query = { number: number };
    if (isManager) {
      // Find Manager in Database
      const manager = await managers.findOne(query);
      if (!manager) {
        return res
          .status(400)
          .json({ status: "error", message: "Manager does not exist." });
      }
    } else {
      // Find Driver in Database
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
    const query = { number: number };
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
      // Find Manager in Database
      const manager = await managers.findOne(query);
      if (!manager) {
        return res
          .status(400)
          .json({ status: "error", message: "Manager does not exist." });
      }
      user = manager
    } else {
      // Find Driver in Database
      const driver = await drivers.findOne(query);
      if (!driver) {
        return res
        .status(400)
        .json({ status: "error", message: "Driver does not exist." });
      }
      user = driver
    }
    // Return JWT Token with user data
    const token = sign_jwt({ id: user._id });
    res.status(200).json({
      status: "success",
      message: "Phone number verified...",
      token,
      user
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
  console.log(req)
  // Validate User Input
  if (!req.body.driver.number || req.body.driver.number.length != 14) {
    return res
      .status(400)
      .json({ status: "error", message: "Missing fields for creating..." });
  }
  const number = req.body.driver.number;
  const query = { number: number }
  const oldDriver = await drivers.findOne(query)
  if (oldDriver) {
    return res.status(400).json({
      status: "failure",
      message: "Driver already exists.",
    });
  }
  const driverObject = {
    number: number,
  };
  const newDriver = await drivers.insertOne(driverObject);
  res.status(200).json({
    status: "success",
    message: "Driver created.",
    driverObject
  });
});

module.exports = app;
