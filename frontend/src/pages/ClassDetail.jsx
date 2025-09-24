import React from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Alert, Tabs, Tab } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { isEditor } from "../utils/helpers";

const ClassDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();

  // Temporary mock data
  const classData = {
    _id: id,
    name: id === "1" ? "Mathematics 101" : "Computer Science",
    description:
      id === "1" ? "Introduction to Algebra" : "Programming Fundamentals",
    instructor: { username: id === "1" ? "Dr. Smith" : "Prof. Johnson" },
    students: [
      { _id: "s1", username: "student1", email: "student1@example.com" },
      { _id: "s2", username: "student2", email: "student2@example.com" },
    ],
    schedule: {
      days: id === "1" ? ["Monday", "Wednesday"] : ["Tuesday", "Thursday"],
      startTime: id === "1" ? "09:00" : "14:00",
      endTime: id === "1" ? "10:30" : "15:30",
    },
    isActive: true,
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col lg={10}>
          <div className="mb-4">
            <h1>{classData.name}</h1>
            <p className="text-muted">{classData.description}</p>
          </div>

          <Tabs defaultActiveKey="info" className="mb-4">
            <Tab eventKey="info" title="Class Information">
              <Row>
                <Col md={6}>
                  <Card>
                    <Card.Header>
                      <h5 className="mb-0">Class Details</h5>
                    </Card.Header>
                    <Card.Body>
                      <p>
                        <strong>Instructor:</strong>{" "}
                        {classData.instructor.username}
                      </p>
                      <p>
                        <strong>Status:</strong>
                        <span
                          className={`badge bg-${
                            classData.isActive ? "success" : "secondary"
                          } ms-2`}>
                          {classData.isActive ? "Active" : "Inactive"}
                        </span>
                      </p>
                      <p>
                        <strong>Days:</strong>{" "}
                        {classData.schedule.days.join(", ")}
                      </p>
                      <p>
                        <strong>Time:</strong> {classData.schedule.startTime} -{" "}
                        {classData.schedule.endTime}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={6}>
                  <Card>
                    <Card.Header>
                      <h5 className="mb-0">
                        Students ({classData.students.length})
                      </h5>
                    </Card.Header>
                    <Card.Body
                      style={{ maxHeight: "300px", overflowY: "auto" }}>
                      {classData.students.map((student) => (
                        <div
                          key={student._id}
                          className="d-flex justify-content-between align-items-center py-2 border-bottom">
                          <div>
                            <strong>{student.username}</strong>
                            <br />
                            <small className="text-muted">
                              {student.email}
                            </small>
                          </div>
                        </div>
                      ))}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab>

            <Tab eventKey="attendance" title="Attendance">
              {isEditor(user) ? (
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">Attendance Management</h5>
                  </Card.Header>
                  <Card.Body>
                    <p>
                      Attendance tracking features will be implemented here.
                    </p>
                    <ul>
                      <li>Record daily attendance</li>
                      <li>View attendance history</li>
                      <li>Generate reports</li>
                    </ul>
                  </Card.Body>
                </Card>
              ) : (
                <Alert variant="info">
                  Only instructors can view and record attendance.
                </Alert>
              )}
            </Tab>

            <Tab eventKey="stats" title="Statistics">
              <Row>
                <Col md={4}>
                  <Card className="text-center">
                    <Card.Body>
                      <h2>{classData.students.length}</h2>
                      <p className="text-muted">Total Students</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="text-center">
                    <Card.Body>
                      <h2>85%</h2>
                      <p className="text-muted">Attendance Rate</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="text-center">
                    <Card.Body>
                      <h2>24</h2>
                      <p className="text-muted">Sessions Completed</p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
};

export default ClassDetail;
