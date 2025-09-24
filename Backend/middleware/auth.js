const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Token is not valid" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    if (req.user.role !== "Admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Admin required." });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const editorAuth = async (req, res, next) => {
  try {
    if (req.user.role !== "Admin" && req.user.role !== "Editor") {
      return res
        .status(403)
        .json({ message: "Access denied. Editor or Admin required." });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { auth, adminAuth, editorAuth };
