const { verify_jwt } = require("../utils/jwt_helpers");
const { mongoClient } = require("../database");
const { ObjectId } = require("mongodb");
const database = mongoClient.db("onev");
const managers = database.collection("managers");

const verifyToken = (req, res, next) => {
  // Check if the Auth Token exists
  const token = req.body.token || req.query.token || req.headers["x-access-token"];
  
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    // Validate Auth Token 
    const decoded = verify_jwt(token);
    // Add decoded data to request
    req.userId = decoded.id;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

const verifyManager = async (req, res, next) => {
  const userId = req.userId;
  await mongoClient.connect()
  const query = { _id: new ObjectId(userId) };
  const manager = await managers.findOne(query);
  await mongoClient.close()
  if (!manager) {
    return res
      .status(400)
      .json({ status: "error", message: "Manager does not exist." });
  }
  req.manager = manager
  return next();
};

module.exports = { verifyToken, verifyManager };