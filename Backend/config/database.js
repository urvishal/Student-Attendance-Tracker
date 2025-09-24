const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Use environment variable or fallback to local MongoDB
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/student_attendance";

    console.log("Connecting to MongoDB:", mongoURI);

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
