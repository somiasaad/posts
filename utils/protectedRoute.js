const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json({ message: "Unauthorized 😌" });

    const decoded = jwt.verify(token, "somiasaadbakr20013695llll");

    const user = await User.findById(decoded.userId).select("-password");

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { protectedRoute };
