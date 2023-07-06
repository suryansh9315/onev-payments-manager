const express = require("express");
const auth = require("./api/auth");

const app = express.Router();

app.use("/api/auth", auth);

module.exports = app;