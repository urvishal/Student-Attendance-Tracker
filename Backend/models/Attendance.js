const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    studentID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    classID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Present", "Absent", "Late", "Excused"],
      default: "Present",
    },
    notes: {
      type: String,
      maxlength: 500,
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },  
  {
    timestamps: true,
  }
);

// Prevent duplicate attendance records for same student, class, and date
attendanceSchema.index({ studentID: 1, classID: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
