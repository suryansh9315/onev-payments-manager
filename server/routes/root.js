const express = require("express");
const auth = require("./api/auth");
const orders = require("./api/orders");
const payments = require("./api/payments");
const notification = require("./api/notification");
const phonepe = require("./api/phonepe")

const app = express.Router();

app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to onev Payments API" })
})

app.use("/api/auth", auth);
app.use("/api/orders", orders);
app.use("/api/payments", payments);
app.use("/api/notification", notification);
app.use("/api/phonepe", phonepe);

module.exports = app;