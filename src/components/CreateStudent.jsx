import React, { useState } from "react";
import API from "../api";

export default function CreateStudent({ onAdded }) {
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [classId, setClassId] = useState("");

  const createStudent = async () => {
    try {
      await API.post("/students", { name, rollNumber, classId });
      alert("Student added");
      setName("");
      setRollNumber("");
      setClassId("");
      if (onAdded) onAdded();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div>
      <h4>Add Student</h4>
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Roll Number"
        value={rollNumber}
        onChange={(e) => setRollNumber(e.target.value)}
      />
      <input
        placeholder="Class ID"
        value={classId}
        onChange={(e) => setClassId(e.target.value)}
      />
      <button onClick={createStudent}>Add</button>
    </div>
  );
}
