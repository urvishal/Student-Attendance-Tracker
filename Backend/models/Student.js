import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNo: { type: String, required: true, unique: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
});

export default mongoose.model("Student", studentSchema);
