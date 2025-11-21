const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  addComment,
  getCommentsForPost,
} = require("../services/comments.services");

// Add comment (protected route) with manual validation
router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const { postId, content } = req.body;

    // Manual request body validation
    if (!postId || !content) {
      res.status(400); // HTTP status code set
      return next(new Error("postId and content are required"));
    }

    const comment = await addComment(postId, req.user._id, content);
    res.status(201).json({ success: true, message: "Comment added", comment });
  } catch (err) {
    next({
      status: err.status || 500,
      message: err.message || "An unexpected server error occurred",
    }); 
  }
});

// Get comments for a post (no body validation needed, just param)
router.get("/:postId", async (req, res, next) => {
  try {
    const postId = req.params.postId;

    if (!postId) {
      res.status(400);
      return next(new Error("postId parameter is required"));
    }

    const comments = await getCommentsForPost(postId);
    res.json({ success: true, comments });
  } catch (err) {
    next({
      status: err.status || 500,
      message: err.message || "server error",
    }); 
  }
});

module.exports = router;
