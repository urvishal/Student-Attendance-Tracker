const express = require("express");
const Class = require("../models/Class");
const Attendance = require("../models/Attendance");
const { auth, editorAuth } = require("../middleware/auth");

const router = express.Router();

// Get all classes
router.get("/", auth, async (req, res) => {
  try {
    const classes = await Class.find()
      .populate("instructor", "username email")
      .populate("students", "username email")
      .sort({ createdAt: -1 });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get single class
router.get("/:id", auth, async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id)
      .populate("instructor", "username email")
      .populate("students", "username email");

    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.json(classData);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Class not found" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create class (Editor/Admin only)
router.post("/", auth, editorAuth, async (req, res) => {
  try {
    const { name, description, schedule, students } = req.body;

    const classData = new Class({
      name,
      description,
      schedule,
      students: students || [],
      instructor: req.user.id,
    });

    await classData.save();
    await classData.populate("instructor", "username email");

    res.status(201).json(classData);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update class (Instructor, Editor, or Admin only)
router.put("/:id", auth, async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id);

    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Check if user is instructor, editor, or admin
    if (
      classData.instructor.toString() !== req.user.id &&
      req.user.role !== "Admin" &&
      req.user.role !== "Editor"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this class" });
    }

    const { name, description, schedule, students, isActive } = req.body;

    if (name) classData.name = name;
    if (description) classData.description = description;
    if (schedule) classData.schedule = schedule;
    if (students) classData.students = students;
    if (isActive !== undefined) classData.isActive = isActive;

    await classData.save();
    await classData.populate("instructor", "username email");
    await classData.populate("students", "username email");

    res.json(classData);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Class not found" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete class (Instructor, Editor, or Admin only)
router.delete("/:id", auth, async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id);

    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Check if user is instructor, editor, or admin
    if (
      classData.instructor.toString() !== req.user.id &&
      req.user.role !== "Admin" &&
      req.user.role !== "Editor"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this class" });
    }

    // Delete associated attendance records
    await Attendance.deleteMany({ classID: req.params.id });

    await Class.findByIdAndDelete(req.params.id);

    res.json({ message: "Class deleted successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Class not found" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Add student to class
router.post("/:id/students", auth, async (req, res) => {
  try {
    const { studentId } = req.body;
    const classData = await Class.findById(req.params.id);

    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    if (!classData.students.includes(studentId)) {
      classData.students.push(studentId);
      await classData.save();
    }

    await classData.populate("students", "username email");

    res.json(classData);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Remove student from class
router.delete("/:id/students/:studentId", auth, async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id);

    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    classData.students = classData.students.filter(
      (student) => student.toString() !== req.params.studentId
    );

    await classData.save();
    await classData.populate("students", "username email");

    res.json(classData);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
