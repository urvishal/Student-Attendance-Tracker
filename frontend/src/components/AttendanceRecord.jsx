import React from "react";
import { Form } from "react-bootstrap";

const AttendanceRecord = ({
  student,
  attendance,
  onStatusChange,
  onNotesChange,
}) => {
  const getStatusVariant = (status) => {
    switch (status) {
      case "Present":
        return "success";
      case "Absent":
        return "danger";
      case "Late":
        return "warning";
      case "Excused":
        return "info";
      default:
        return "secondary";
    }
  };

  return (
    <div className="d-flex align-items-center mb-3 p-3 border rounded">
      <div className="flex-grow-1">
        <h6 className="mb-1">{student.username}</h6>
        <small className="text-muted">{student.email}</small>
      </div>

      <div className="mx-3">
        <Form.Select
          value={attendance?.status || "Present"}
          onChange={(e) => onStatusChange(student._id, e.target.value)}
          size="sm"
          style={{ width: "120px" }}>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
          <option value="Late">Late</option>
          <option value="Excused">Excused</option>
        </Form.Select>
      </div>

      <div>
        <Form.Control
          type="text"
          placeholder="Notes"
          value={attendance?.notes || ""}
          onChange={(e) => onNotesChange(student._id, e.target.value)}
          size="sm"
          style={{ width: "150px" }}
        />
      </div>
    </div>
  );
};

export default AttendanceRecord;
