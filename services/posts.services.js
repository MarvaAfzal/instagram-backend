const Post = require("../models/posts.js");
// Create new post and vlidation
const createPost = async (title, description, imagePath, userId) => {
  if (!title || !description || !imagePath || !userId) {
    const error = new Error(
      "Title, description, image, and userId are required"
    );
    error.statusCode = 400;
    throw error;
  }

  // Create post
  const post = await Post.create({
    title,
    description,
    image: imagePath,
    user: userId,
    likesCount: 0,
    commentsCount: 0,
  });

  // Populate user and likes
  const populatedPost = await Post.findById(post._id)
    .populate("user", "_id username profileImage")
    .populate("likes", "_id username profileImage")
    .populate("comments.user", "_id username profileImage");

  return populatedPost;
};

// Get all posts
const getAllPosts = async () => {
  const posts = await Post.find()
    .populate("user", "_id username profileImage")
    .populate("likes", "_id username profileImage")
    .populate("comments.user", "_id username profileImage");
  return posts;
};

// Get my posts
const getMyPosts = async (userId) => {
  if (!userId) {
    const error = new Error("userId is required");
    error.statusCode = 400;
    throw error;
  }

  const posts = await Post.find({ user: userId })
    .populate("user", "_id username")
    .populate("likes", "_id username")
    .populate("comments.user", "_id username");
  return posts;
};
// Update post
const updatePost = async (postId, userId, data) => {
  if (!postId || !userId) throw new Error("postId and userId are required");

  const post = await Post.findById(postId);
  if (!post) throw new Error("Post not found");

  if (post.user.toString() !== userId) throw new Error("Unauthorized");

  // Update fields
  if (data.title) post.title = data.title;
  if (data.description) post.description = data.description;
  if (data.image) post.image = data.image;

  await post.save();

  const populatedPost = await Post.findById(post._id)
    .populate("user", "_id username")
    .populate("likes", "_id username")
    .populate("comments.user", "_id username");

  return populatedPost;
};

// Like post
const likePost = async (postId, userId) => {
  if (!postId || !userId) throw new Error("postId and userId are required");

  const post = await Post.findById(postId);
  if (!post) throw new Error("Post not found");

  if (!post.likes.some((id) => id.toString() === userId)) {
    post.likes.push(userId);
  }

  // Always update likesCount before save
  post.likesCount = post.likes.length;
  await post.save();

  // Populate after save
  const populatedPost = await Post.findById(post._id)
    .populate("user", "_id username")
    .populate("likes", "_id username")
    .populate("comments.user", "_id username");

  // Ensure likesCount matches actual likes array
  populatedPost.likesCount = populatedPost.likes.length;

  return populatedPost;
};
// Unlike post
const unlikePost = async (postId, userId) => {
  if (!postId || !userId) throw new Error("postId and userId are required");

  const post = await Post.findById(postId);
  if (!post) throw new Error("Post not found");

  // Remove userId from likes
  post.likes = post.likes.filter((id) => id.toString() !== userId);

  // Update likesCount
  post.likesCount = post.likes.length;
  await post.save();

  // Populate after save
  const populatedPost = await Post.findById(post._id)
    .populate("user", "_id username")
    .populate("likes", "_id username")
    .populate("comments.user", "_id username");

  // Ensure likesCount matches actual likes array
  populatedPost.likesCount = populatedPost.likes.length;

  return populatedPost;
};
// Add comment
const addComment = async (postId, userId, text) => {
  if (!postId || !userId || !text)
    throw new Error("postId, userId, and text are required");

  const post = await Post.findById(postId);
  if (!post) throw new Error("Post not found");

  post.comments.push({ user: userId, text });
  post.commentsCount = post.comments.length; //  update count
  await post.save();

  const populatedPost = await Post.findById(post._id)
    .populate("user", "_id username")
    .populate("likes", "_id username")
    .populate("comments.user", "_id username");

  return populatedPost;
};

module.exports = {
  createPost,
  getAllPosts,
  getMyPosts,
  updatePost,
  likePost,
  unlikePost,
  addComment,
};
