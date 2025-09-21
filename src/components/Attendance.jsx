<div>
  <h2 className="mb-3">Attendance</h2>
  <div className="mb-3 row g-2">
    <div className="col-md-3">
      <input
        className="form-control"
        placeholder="Class ID"
        value={classId}
        onChange={(e) => setClassId(e.target.value)}
      />
    </div>
    <div className="col-md-3">
      <input
        type="date"
        className="form-control"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
    </div>
    <div className="col-md-3">
      <button className="btn btn-success" onClick={fetchAttendance}>
        Fetch
      </button>
    </div>
  </div>
  <RecordAttendance
    classId={classId}
    date={date}
    onRecorded={fetchAttendance}
  />
  <table className="table table-striped table-hover shadow-sm mt-3">
    <thead className="table-dark">
      <tr>
        <th>Student</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {records.map((r) => (
        <tr key={r._id}>
          <td>{r.student?.name}</td>
          <td>{r.status}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>;
