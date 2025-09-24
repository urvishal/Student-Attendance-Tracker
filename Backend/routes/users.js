const express = require("express");
const User = require("../models/User");
const { auth, adminAuth } = require("../middleware/auth");

const router = express.Router();

// Get all users (Admin only)
router.get("/", auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get current user profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update user profile
router.put("/profile", auth, async (req, res) => {
  try {
    const { username, email } = req.body;
    const updates = {};

    if (username) updates.username = username;
    if (email) updates.email = email;

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json(user);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update user role (Admin only)
router.put("/:id/role", auth, adminAuth, async (req, res) => {
  try {
    const { role } = req.body;

    if (!["Admin", "Editor", "User"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete user (Admin only)
router.delete("/:id", auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
