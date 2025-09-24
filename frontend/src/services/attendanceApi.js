import api from "./api";

export const classesAPI = {
  getAll: () => {
    return api.get("/classes").then((response) => response.data);
  },

  getById: (id) => {
    return api.get(`/classes/${id}`).then((response) => response.data);
  },

  create: (classData) => {
    return api.post("/classes", classData).then((response) => response.data);
  },

  update: (id, classData) => {
    return api
      .put(`/classes/${id}`, classData)
      .then((response) => response.data);
  },

  delete: (id) => {
    return api.delete(`/classes/${id}`).then((response) => response.data);
  },

  addStudent: (classId, studentId) => {
    return api
      .post(`/classes/${classId}/students`, { studentId })
      .then((response) => response.data);
  },

  removeStudent: (classId, studentId) => {
    return api
      .delete(`/classes/${classId}/students/${studentId}`)
      .then((response) => response.data);
  },
};

export const attendanceAPI = {
  record: (attendanceData) => {
    return api
      .post("/attendance", attendanceData)
      .then((response) => response.data);
  },

  recordBulk: (bulkData) => {
    return api
      .post("/attendance/bulk", bulkData)
      .then((response) => response.data);
  },

  getByClass: (classId, date) => {
    const params = date ? { date } : {};
    return api
      .get(`/attendance/class/${classId}`, { params })
      .then((response) => response.data);
  },

  getByStudent: (studentId, startDate, endDate) => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    return api
      .get(`/attendance/student/${studentId}`, { params })
      .then((response) => response.data);
  },

  update: (id, attendanceData) => {
    return api
      .put(`/attendance/${id}`, attendanceData)
      .then((response) => response.data);
  },

  getStats: (classId, startDate, endDate) => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    return api
      .get(`/attendance/stats/class/${classId}`, { params })
      .then((response) => response.data);
  },
};
