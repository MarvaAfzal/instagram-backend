const Comment = require("../models/comment.js");

// Add comment
const addComment = async (postId, userId, content) => {
  //  validation
  if (!postId || !userId || !content) {
    const error = new Error("postId, userId, and comment content are required");
    error.statusCode = 400; // HTTP status code set
    throw error; // route  catch block
  }

  const comment = await Comment.create({ post: postId, user: userId, content });
  return comment;
};

// Get comments for a post
const getCommentsForPost = async (postId) => {
  // Validation: postId required
  if (!postId) {
    const error = new Error("postId parameter is required");
    error.statusCode = 400;
    throw error;
  }

  const comments = await Comment.find({ post: postId })
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  return comments;
};

module.exports = { addComment, getCommentsForPost };
