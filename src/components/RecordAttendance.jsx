import React, { useState } from "react";
import API from "../api";

export default function RecordAttendance({ classId, date, onRecorded }) {
  const [records, setRecords] = useState([
    { studentId: "", status: "Present" },
  ]);

  const addRow = () =>
    setRecords([...records, { studentId: "", status: "Present" }]);

  const updateRow = (index, field, value) => {
    const newRecords = [...records];
    newRecords[index][field] = value;
    setRecords(newRecords);
  };

  const recordAttendance = async () => {
    try {
      await API.post("/attendance", { classId, date, records });
      alert("Attendance recorded");
      if (onRecorded) onRecorded();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div>
      <h4>Record Attendance</h4>
      {records.map((r, i) => (
        <div key={i}>
          <input
            placeholder="Student ID"
            value={r.studentId}
            onChange={(e) => updateRow(i, "studentId", e.target.value)}
          />
          <select
            value={r.status}
            onChange={(e) => updateRow(i, "status", e.target.value)}
          >
            <option>Present</option>
            <option>Absent</option>
            <option>Late</option>
            <option>Excused</option>
          </select>
        </div>
      ))}
      <button onClick={addRow}>Add Row</button>
      <button onClick={recordAttendance}>Submit Attendance</button>
    </div>
  );
}
