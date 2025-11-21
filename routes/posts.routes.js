const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const authMiddleware = require("../middleware/auth.middleware");

const {
  createPost,
  getAllPosts,
  getMyPosts,
  updatePost,
  likePost,
  unlikePost,
  addComment,
} = require("../services/posts.services");

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, process.env.UPLOADS_FOLDER),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// CREATE POST
router.post(
  "/create",
  authMiddleware,
  upload.single("image"),
  async (req, res, next) => {
    try {
      const { title, description } = req.body;

      if (!title || !description || !req.file) {
        res.status(400);
        return next(new Error("Title, description, and image are required"));
      }

      // OLD (wrong): req.file.path → full system path (image show nahi hoti)
      // const post = await createPost(title, description, req.file.path, req.user._id);

      //  NEW (correct): relative path save
      const imagePath = `uploads/${req.file.filename}`;

      const post = await createPost(
        title,
        description,
        imagePath,
        req.user._id
      );

      res.status(201).json({
        success: true,
        message: "Post created successfully",
        post,
      });
    } catch (err) {
      next({
        status: err.status || 500,
        message: err.message || "Server error",
      });
    }
  }
);

// GET ALL POSTS
router.get("/getall", async (req, res, next) => {
  try {
    const posts = await getAllPosts();
    res.json({ success: true, posts });
  } catch (err) {
    next({ status: err.status || 500, message: err.message || "Server error" });
  }
});

// GET MY POSTS
router.get("/myposts", authMiddleware, async (req, res, next) => {
  try {
    const posts = await getMyPosts(req.user._id);
    res.json({ success: true, posts });
  } catch (err) {
    next({ status: err.status || 500, message: err.message || "Server error" });
  }
});
// UPDATE POST
router.put(
  "/:id/update",
  authMiddleware,
  upload.single("image"), // if you want to update image as well
  async (req, res, next) => {
    try {
      const { title, description } = req.body;
      let imagePath;

      if (req.file) {
        // Save new image path
        imagePath = `uploads/${req.file.filename}`;
      }

      const post = await updatePost(req.params.id, req.user._id, {
        title,
        description,
        image: imagePath,
      });

      res.status(200).json({
        success: true,
        message: "Post updated successfully",
        post,
      });
    } catch (err) {
      next({
        status: err.status || 500,
        message: err.message || "Server error",
      });
    }
  }
);

// LIKE POST
router.put("/:id/like", authMiddleware, async (req, res, next) => {
  try {
    const post = await likePost(req.params.id, req.user._id);
    res.json({ success: true, message: "Post liked successfully", post });
  } catch (err) {
    next({ status: err.status || 500, message: err.message || "Server error" });
  }
});

// UNLIKE POST
router.put("/:id/unlike", authMiddleware, async (req, res, next) => {
  try {
    const post = await unlikePost(req.params.id, req.user._id);
    res.json({ success: true, message: "Post unliked successfully", post });
  } catch (err) {
    next({ status: err.status || 500, message: err.message || "Server error" });
  }
});

// ADD COMMENT
router.post("/:id/comment", authMiddleware, async (req, res, next) => {
  try {
    const { text } = req.body;
    const post = await addComment(req.params.id, req.user._id, text);
    res
      .status(200)
      .json({ success: true, message: "Comment added successfully", post });
  } catch (err) {
    next({ status: err.status || 500, message: err.message || "Server error" });
  }
});

module.exports = router;
