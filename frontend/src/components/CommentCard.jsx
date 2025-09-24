import React from "react";
import { Card, Button } from "react-bootstrap";
import { formatDate, isAuthor, isEditor } from "../utils/helpers";
import { useAuth } from "../context/AuthContext";

const CommentCard = ({ comment, onDelete, onEdit }) => {
  const { user } = useAuth();

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      onDelete(comment._id);
    }
  };

  return (
    <Card className="mb-2">
      <Card.Body>
        <Card.Text>{comment.comment}</Card.Text>

        <div className="d-flex justify-content-between align-items-center">
          <small className="text-muted">
            By {comment.userID?.username} • {formatDate(comment.createdAt)}
          </small>

          {(isAuthor(user, comment.userID?._id) || isEditor(user)) && (
            <div>
              <Button
                variant="outline-secondary"
                size="sm"
                className="me-1"
                onClick={() => onEdit(comment)}>
                Edit
              </Button>
              <Button variant="outline-danger" size="sm" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default CommentCard;
