const express = require("express");
const dotenv = require("dotenv").config();
const { verifyToken, verifyDriver } = require("../../middlewares/auth");
const { mongoClient } = require("../../database");

const database = mongoClient.db("onev");
const drivers = database.collection("drivers");
const app = express.Router();

app.post("/addNotiToken", verifyToken, verifyDriver, async (req, res) => {
  if (!req.body.noti_token) {
    return res
      .status(401)
      .json({ status: "error", message: "Missing fields..." });
  }
  const query = { dNumber: req.driver.dNumber };
  const options = { upsert: false };
  const update = {
    $set: {
      noti_token: req.body.noti_token,
    },
  };
  const result = await drivers.updateOne(query, update, options);
  if (result.matchedCount !== result.modifiedCount) {
    return res.status(401).json({
      status: "failure",
      message: "Something went wrong.",
    });
  }
  res.status(200).json({ message: "Notifications Token added successfully." });
});

module.exports = app;
