import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { postsAPI, commentsAPI } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import CommentCard from "../components/CommentCard";
import { useAuth } from "../context/AuthContext";
import { formatDate, isAuthor, isEditor } from "../utils/helpers";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentError, setCommentError] = useState("");

  const { user } = useAuth();

  useEffect(() => {
    fetchPostAndComments();
  }, [id]);

  const fetchPostAndComments = async () => {
    try {
      setLoading(true);
      const [postData, commentsData] = await Promise.all([
        postsAPI.getById(id),
        postsAPI.getComments(id),
      ]);

      setPost(postData);
      setComments(commentsData);
    } catch (err) {
      setError("Failed to load post");
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    try {
      const commentData = {
        postID: id,
        comment: newComment,
      };

      const newCommentData = await commentsAPI.create(commentData);
      setComments([newCommentData, ...comments]);
      setNewComment("");
      setCommentError("");
    } catch (err) {
      setCommentError("Failed to add comment");
    }
  };

  const handleEditComment = async (comment) => {
    setEditingComment(comment);
    setNewComment(comment.comment);
  };

  const handleUpdateComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    try {
      const updatedComment = await commentsAPI.update(editingComment._id, {
        comment: newComment,
      });

      setComments(
        comments.map((c) => (c._id === editingComment._id ? updatedComment : c))
      );

      setEditingComment(null);
      setNewComment("");
      setCommentError("");
    } catch (err) {
      setCommentError("Failed to update comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await commentsAPI.delete(commentId);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (err) {
      setCommentError("Failed to delete comment");
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await postsAPI.delete(id);
        navigate("/posts");
      } catch (err) {
        setError("Failed to delete post");
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <Alert variant="danger" className="m-3">
        {error}
      </Alert>
    );
  if (!post)
    return (
      <Alert variant="warning" className="m-3">
        Post not found
      </Alert>
    );

  return (
    <Container>
      <Row className="justify-content-center">
        <Col lg={8}>
          {/* Post Content */}
          <Card className="mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h1>{post.title}</h1>
                  <div className="text-muted">
                    By {post.author?.username} • {formatDate(post.createdAt)}
                  </div>
                </div>

                {(isAuthor(user, post.author?._id) || isEditor(user)) && (
                  <div>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="me-2"
                      onClick={() => navigate(`/posts/edit/${post._id}`)}>
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={handleDeletePost}>
                      Delete
                    </Button>
                  </div>
                )}
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="mb-3">
                  {post.tags.map((tag) => (
                    <span key={tag} className="badge bg-secondary me-1">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="post-content">{post.body}</div>
            </Card.Body>
          </Card>

          {/* Comments Section */}
          <Card>
            <Card.Header>
              <h3 className="mb-0">Comments ({comments.length})</h3>
            </Card.Header>
            <Card.Body>
              {commentError && <Alert variant="danger">{commentError}</Alert>}

              {/* Add/Edit Comment Form */}
              {user ? (
                <Form
                  onSubmit={
                    editingComment ? handleUpdateComment : handleAddComment
                  }
                  className="mb-4">
                  <Form.Group>
                    <Form.Label>
                      {editingComment ? "Edit Comment" : "Add a Comment"}
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write your comment here..."
                    />
                  </Form.Group>
                  <div className="mt-2">
                    <Button type="submit" variant="primary" className="me-2">
                      {editingComment ? "Update Comment" : "Post Comment"}
                    </Button>
                    {editingComment && (
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setEditingComment(null);
                          setNewComment("");
                        }}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </Form>
              ) : (
                <Alert variant="info">
                  Please <a href="/login">login</a> to leave a comment.
                </Alert>
              )}

              {/* Comments List */}
              {comments.length === 0 ? (
                <p className="text-muted">
                  No comments yet. Be the first to comment!
                </p>
              ) : (
                comments.map((comment) => (
                  <CommentCard
                    key={comment._id}
                    comment={comment}
                    onDelete={handleDeleteComment}
                    onEdit={handleEditComment}
                  />
                ))
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PostDetail;
