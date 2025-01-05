const express = require("express");
const mongoose = require("mongoose");
const postsRoute = require("./routes/posts_route");
const commentsRoute = require("./routes/comments_route");
require("dotenv").config();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Use the posts route
app.use("/posts", postsRoute);

// Use the comments route
app.use("/comments", commentsRoute);

// Connect to MongoDB
mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});