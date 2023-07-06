const express = require("express");
const dotenv = require("dotenv").config();
const client = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const { sign_jwt } = require('../../utils/jwt_helpers')
const auth = require("../../middlewares/auth");

const app = express.Router();

const verifications = client.verify.v2.services(process.env.TWILIO_SERVICE_SID).verifications;
const verificationsChecks = client.verify.v2.services(process.env.TWILIO_SERVICE_SID).verificationChecks;

app.post("/login", async (req, res) => {
  // Validate User Input
  if (!req.body.number) {
    res
      .status(400)
      .json({ status: "error", message: "Missing fields for login..." });
    return;
  }
  const number = req.body.number;
  // Send O.T.P
  try {
    const new_verification = await verifications.create({
      to: number,
      channel: "sms",
    });
    res.status(200).json({
      status: "success",
      message: "O.T.P sent to the number provided.",
    });
  } catch (error) {
    res.status(400).json({ status: "error", error: error });
  }
});

app.post("/verify", async (req, res) => {
  // Validate User Input
  if (!req.body.otp || !req.body.number) {
    res
      .status(400)
      .json({ status: "error", message: "Missing fields for login..." });
    return;
  }
  const otp = req.body.otp;
  const number = req.body.number;
  try {
    // Verify O.T.P
    const new_verificationCheck = await verificationsChecks.create({
      to: number,
      code: otp,
    });
    if (new_verificationCheck.status != "approved") {
      return res.status(400).json({ status: "error", message: "Wrong O.T.P" });
    }
    // Create a user in our database if it doesn't exist
    // Create a signed JWT token
    const token = sign_jwt({ number })
    // Return user info with signed jwt token
    res.status(200).json({
      status: "sucess",
      message: "Phone number verified...",
      token
    });
  } catch (error) {
    res.status(400).json({ status: "error", error: error });
  }
});

app.post("/update", auth, async (req, res) => {
  // User object = req.user
  // Validate User Input
  // Update User Info in Database
  // Return user info (updated)
  res.status(200).json({
    status: "sucess",
    message: "Profile Updated...",
    number: req.user.number
  });
});

module.exports = app;
