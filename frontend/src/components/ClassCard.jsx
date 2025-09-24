import React from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { formatDate, isEditor } from "../utils/helpers";
import { useAuth } from "../context/AuthContext";

const ClassCard = ({ classData, onDelete, onEnroll, onUnenroll }) => {
  const { user } = useAuth();
  const isEnrolled = classData.students?.some(
    (student) => student._id === user?.id
  );

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      onDelete(classData._id);
    }
  };

  const handleEnroll = () => {
    onEnroll(classData._id, user.id);
  };

  const handleUnenroll = () => {
    onUnenroll(classData._id, user.id);
  };

  return (
    <Card className="h-100">
      <Card.Body>
        <Card.Title>{classData.name}</Card.Title>

        <Card.Text className="text-muted">{classData.description}</Card.Text>

        <div className="mb-2">
          <strong>Instructor:</strong> {classData.instructor?.username}
        </div>

        <div className="mb-2">
          <strong>Students:</strong> {classData.students?.length || 0}
        </div>

        {classData.schedule && (
          <div className="mb-2">
            <strong>Schedule:</strong> {classData.schedule.days?.join(", ")}
            {classData.schedule.startTime &&
              ` at ${classData.schedule.startTime}`}
          </div>
        )}

        <div className="mb-2">
          <Badge bg={classData.isActive ? "success" : "secondary"}>
            {classData.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </Card.Body>

      <Card.Footer>
        <div className="d-flex justify-content-between align-items-center">
          <Link
            to={`/classes/${classData._id}`}
            className="btn btn-primary btn-sm">
            View Details
          </Link>

          <div>
            {isEditor(user) ? (
              <>
                <Link
                  to={`/classes/edit/${classData._id}`}
                  className="btn btn-outline-secondary btn-sm me-2">
                  Edit
                </Link>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={handleDelete}>
                  Delete
                </Button>
              </>
            ) : isEnrolled ? (
              <Button
                variant="outline-warning"
                size="sm"
                onClick={handleUnenroll}>
                Unenroll
              </Button>
            ) : (
              <Button
                variant="outline-success"
                size="sm"
                onClick={handleEnroll}>
                Enroll
              </Button>
            )}
          </div>
        </div>
      </Card.Footer>
    </Card>
  );
};

export default ClassCard;
