const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/database");

// Load env vars - make sure this is at the very top
dotenv.config();

// Log environment variables to verify they're loading
console.log(
  "MONGODB_URI:",
  process.env.MONGODB_URI ? "Loaded successfully" : "NOT LOADED"
);
console.log(
  "JWT_SECRET:",
  process.env.JWT_SECRET ? "Loaded successfully" : "NOT LOADED"
);
console.log("PORT:", process.env.PORT || 5000);

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Your frontend URL
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/classes", require("./routes/classes"));
app.use("/api/attendance", require("./routes/attendance"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/comments", require("./routes/comments"));
app.use("/api/users", require("./routes/users"));

// Basic route
app.get("/", (req, res) => {
  res.json({
    message: "Student Attendance System API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      posts: "/api/posts",
      comments: "/api/comments",
      users: "/api/users",
    },
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: "Server error", error: error.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
