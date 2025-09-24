import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isEditor } from "../utils/helpers";
import LoadingSpinner from "../components/LoadingSpinner";

const Classes = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();

  // Temporary mock data - replace with actual API call later
  const [classes, setClasses] = useState([
    {
      _id: "1",
      name: "Mathematics 101",
      description: "Introduction to Algebra",
      instructor: { username: "Dr. Smith" },
      students: [],
      schedule: {
        days: ["Monday", "Wednesday"],
        startTime: "09:00",
        endTime: "10:30",
      },
      isActive: true,
    },
    {
      _id: "2",
      name: "Computer Science",
      description: "Programming Fundamentals",
      instructor: { username: "Prof. Johnson" },
      students: [],
      schedule: {
        days: ["Tuesday", "Thursday"],
        startTime: "14:00",
        endTime: "15:30",
      },
      isActive: true,
    },
  ]);

  if (loading) return <LoadingSpinner />;

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Classes</h1>
        {isEditor(user) && (
          <Button variant="primary" disabled>
            Create New Class (Coming Soon)
          </Button>
        )}
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        {classes.map((classData) => (
          <Col key={classData._id} md={6} lg={4} className="mb-4">
            <Card className="h-100">
              <Card.Body>
                <Card.Title>{classData.name}</Card.Title>
                <Card.Text className="text-muted">
                  {classData.description}
                </Card.Text>
                <div className="mb-2">
                  <strong>Instructor:</strong> {classData.instructor.username}
                </div>
                <div className="mb-2">
                  <strong>Schedule:</strong>{" "}
                  {classData.schedule.days.join(", ")} at{" "}
                  {classData.schedule.startTime}
                </div>
              </Card.Body>
              <Card.Footer>
                <Link
                  to={`/classes/${classData._id}`}
                  className="btn btn-primary btn-sm">
                  View Details
                </Link>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      {classes.length === 0 && (
        <div className="text-center py-5">
          <h3>No classes available</h3>
          <p>Classes will be listed here when they are created.</p>
        </div>
      )}
    </Container>
  );
};

export default Classes;
