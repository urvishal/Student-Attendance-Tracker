const express = require("express");
const Attendance = require("../models/Attendance");
const Class = require("../models/Class");
const { auth, editorAuth } = require("../middleware/auth");

const router = express.Router();

// Record attendance
router.post("/", auth, editorAuth, async (req, res) => {
  try {
    const { studentID, classID, date, status, notes } = req.body;

    // Check if class exists
    const classData = await Class.findById(classID);
    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Check if student is enrolled in class
    if (!classData.students.includes(studentID)) {
      return res
        .status(400)
        .json({ message: "Student is not enrolled in this class" });
    }

    const attendance = new Attendance({
      studentID,
      classID,
      date: date || new Date(),
      status,
      notes,
      recordedBy: req.user.id,
    });

    await attendance.save();
    await attendance.populate("studentID", "username email");
    await attendance.populate("classID", "name");

    res.status(201).json(attendance);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({
          message: "Attendance already recorded for this student and date",
        });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Bulk record attendance
router.post("/bulk", auth, editorAuth, async (req, res) => {
  try {
    const { classID, date, attendanceRecords } = req.body;

    const classData = await Class.findById(classID);
    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    const results = [];
    const errors = [];

    for (const record of attendanceRecords) {
      try {
        // Check if student is enrolled
        if (!classData.students.includes(record.studentID)) {
          errors.push(`Student ${record.studentID} not enrolled in class`);
          continue;
        }

        const attendance = new Attendance({
          studentID: record.studentID,
          classID,
          date: date || new Date(),
          status: record.status,
          notes: record.notes,
          recordedBy: req.user.id,
        });

        await attendance.save();
        await attendance.populate("studentID", "username email");
        results.push(attendance);
      } catch (error) {
        if (error.code === 11000) {
          errors.push(
            `Attendance already recorded for student ${record.studentID}`
          );
        } else {
          errors.push(
            `Error recording attendance for student ${record.studentID}: ${error.message}`
          );
        }
      }
    }

    res.json({
      success: results.length,
      errors: errors.length,
      results,
      errors,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get attendance for a class on specific date
router.get("/class/:classID", auth, async (req, res) => {
  try {
    const { classID } = req.params;
    const { date } = req.query;

    const query = { classID };
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);

      query.date = {
        $gte: startDate,
        $lt: endDate,
      };
    }

    const attendance = await Attendance.find(query)
      .populate("studentID", "username email")
      .populate("classID", "name")
      .populate("recordedBy", "username")
      .sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get student's attendance history
router.get("/student/:studentID", auth, async (req, res) => {
  try {
    const { studentID } = req.params;
    const { startDate, endDate } = req.query;

    const query = { studentID };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const attendance = await Attendance.find(query)
      .populate("classID", "name")
      .populate("recordedBy", "username")
      .sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update attendance record
router.put("/:id", auth, editorAuth, async (req, res) => {
  try {
    const { status, notes } = req.body;

    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    if (status) attendance.status = status;
    if (notes !== undefined) attendance.notes = notes;

    await attendance.save();
    await attendance.populate("studentID", "username email");
    await attendance.populate("classID", "name");

    res.json(attendance);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Attendance record not found" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get attendance statistics
router.get("/stats/class/:classID", auth, async (req, res) => {
  try {
    const { classID } = req.params;
    const { startDate, endDate } = req.query;

    const matchQuery = { classID };

    if (startDate && endDate) {
      matchQuery.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const stats = await Attendance.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const classData = await Class.findById(classID).populate("students");
    const totalStudents = classData.students.length;
    const totalRecords = stats.reduce((sum, stat) => sum + stat.count, 0);

    res.json({
      totalStudents,
      totalRecords,
      stats,
      attendanceRate:
        totalRecords > 0
          ? (
              ((stats.find((s) => s._id === "Present")?.count || 0) /
                totalRecords) *
              100
            ).toFixed(2) + "%"
          : "0%",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
