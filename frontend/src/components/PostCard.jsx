import React from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { formatDate, truncateText, isAuthor, isEditor } from "../utils/helpers";
import { useAuth } from "../context/AuthContext";

const PostCard = ({ post, onDelete }) => {
  const { user } = useAuth();

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      onDelete(post._id);
    }
  };

  return (
    <Card className="h-100">
      <Card.Body>
        <Card.Title>{post.title}</Card.Title>

        <div className="d-flex justify-content-between align-items-center mb-2">
          <small className="text-muted">
            By {post.author?.username} • {formatDate(post.createdAt)}
          </small>

          {post.tags && post.tags.length > 0 && (
            <div>
              {post.tags.map((tag) => (
                <Badge key={tag} bg="secondary" className="me-1">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Card.Text className="post-content">
          {truncateText(post.body, 150)}
        </Card.Text>
      </Card.Body>

      <Card.Footer>
        <div className="d-flex justify-content-between">
          <Link to={`/posts/${post._id}`} className="btn btn-primary btn-sm">
            Read More
          </Link>

          {(isAuthor(user, post.author?._id) || isEditor(user)) && (
            <div>
              <Link
                to={`/posts/edit/${post._id}`}
                className="btn btn-outline-secondary btn-sm me-2">
                Edit
              </Link>
              <Button variant="outline-danger" size="sm" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          )}
        </div>
      </Card.Footer>
    </Card>
  );
};

export default PostCard;
