import React, { useEffect, useState } from "react";
import API from "../api";
import CreateStudent from "./CreateStudent";

export default function Students() {
  const [students, setStudents] = useState([]);

  const fetchStudents = async () => {
    const res = await API.get("/students");
    setStudents(res.data);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div>
      <h2>Students</h2>
      <CreateStudent onAdded={fetchStudents} />
      <ul>
        {students.map((s) => (
          <li key={s._id}>
            {s.name} - {s.rollNumber}
          </li>
        ))}
      </ul>
    </div>
  );
}
