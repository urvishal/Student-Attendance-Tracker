const express = require("express");
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const { auth } = require("../middleware/auth");
const { validateComment } = require("../middleware/validation");

const router = express.Router();

// Create a comment
router.post("/", auth, validateComment, async (req, res) => {
  try {
    const { postID, comment } = req.body;

    // Check if post exists
    const post = await Post.findById(postID);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = new Comment({
      postID,
      userID: req.user.id,
      comment,
    });

    await newComment.save();
    await newComment.populate("userID", "username");

    res.status(201).json(newComment);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update a comment (Only author)
router.put("/:id", auth, validateComment, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user is the author of the comment
    if (comment.userID.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this comment" });
    }

    comment.comment = req.body.comment;
    await comment.save();
    await comment.populate("userID", "username");

    res.json(comment);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete a comment (Only author, Editor or Admin)
router.delete("/:id", auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user is author, editor or admin
    if (
      comment.userID.toString() !== req.user.id &&
      req.user.role !== "Admin" &&
      req.user.role !== "Editor"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this comment" });
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
