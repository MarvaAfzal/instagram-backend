require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const postRoutes = require("./routes/posts.routes");
const commentsRouter = require("./routes/comments.routes");
const errorHandler = require("./middleware/error.middleware");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
// Connect to MongoDB
connectDB();
app.get("/", (req, res) => {
  res.send("API running");
});

// Serve uploaded images publicly
app.use("/uploads", express.static(path.join(__dirname,process.env.UPLOADS_FOLDER)));
// Routes
app.use("/posts", postRoutes);
//comments
app.use("/comments", commentsRouter);

// Routes
app.use("/auth", authRoutes);
app.use(errorHandler);

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
