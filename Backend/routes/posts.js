const express = require("express");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const { auth, editorAuth } = require("../middleware/auth");
const { validatePost } = require("../middleware/validation");

const router = express.Router();

// Get all posts with optional filtering by tags
router.get("/", async (req, res) => {
  try {
    const { tags, page = 1, limit = 10, search } = req.query;
    let query = {};

    if (tags) {
      const tagArray = tags.split(",").map((tag) => tag.trim());
      query.tags = { $in: tagArray };
    }

    if (search) {
      query.$text = { $search: search };
    }

    const posts = await Post.find(query)
      .populate("author", "username")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Post.countDocuments(query);

    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get single post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "username email"
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create a post (Editor and Admin only)
router.post("/", auth, editorAuth, validatePost, async (req, res) => {
  try {
    const { title, body, tags } = req.body;

    const post = new Post({
      title,
      body,
      author: req.user.id,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
    });

    await post.save();
    await post.populate("author", "username");

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update a post (Only author, Editor or Admin)
router.put("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user is author, editor or admin
    if (
      post.author.toString() !== req.user.id &&
      req.user.role !== "Admin" &&
      req.user.role !== "Editor"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this post" });
    }

    const { title, body, tags } = req.body;

    if (title) post.title = title;
    if (body) post.body = body;
    if (tags) post.tags = tags.split(",").map((tag) => tag.trim());

    await post.save();
    await post.populate("author", "username");

    res.json(post);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete a post (Only author, Editor or Admin)
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user is author, editor or admin
    if (
      post.author.toString() !== req.user.id &&
      req.user.role !== "Admin" &&
      req.user.role !== "Editor"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }

    // Also delete all comments associated with this post
    await Comment.deleteMany({ postID: req.params.id });

    await Post.findByIdAndDelete(req.params.id);

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get comments for a post
router.get("/:id/comments", async (req, res) => {
  try {
    const comments = await Comment.find({ postID: req.params.id })
      .populate("userID", "username")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
