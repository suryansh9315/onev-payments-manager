const { verify_jwt } = require("../utils/jwt_helpers");

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
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;