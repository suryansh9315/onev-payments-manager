const express = require("express");
const auth = require("./api/auth");

const app = express.Router();

app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to onev Payments API" })
})

app.use("/api/auth", auth);

module.exports = app;