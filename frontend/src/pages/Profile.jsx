import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Tab,
  Tabs,
} from "react-bootstrap";
import { authAPI, postsAPI } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import PostCard from "../components/PostCard";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [postsLoading, setPostsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { user } = useAuth();
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });

  useEffect(() => {
    if (activeTab === "posts" && user) {
      fetchUserPosts();
    }
  }, [activeTab, user]);

  const fetchUserPosts = async () => {
    try {
      setPostsLoading(true);
      const response = await postsAPI.getAll();
      const userPosts = response.posts.filter(
        (post) => post.author?._id === user.id
      );
      setUserPosts(userPosts);
    } catch (err) {
      setError("Failed to load your posts");
    } finally {
      setPostsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await authAPI.updateProfile(formData);
      setSuccess("Profile updated successfully");
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await postsAPI.delete(postId);
      setUserPosts(userPosts.filter((post) => post._id !== postId));
      setSuccess("Post deleted successfully");
    } catch (err) {
      setError("Failed to delete post");
    }
  };

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col lg={8}>
          <h1 className="mb-4">Profile</h1>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-4">
            <Tab eventKey="profile" title="Profile Information">
              <Card>
                <Card.Body>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Role</Form.Label>
                      <Form.Control type="text" value={user.role} disabled />
                    </Form.Group>

                    <Button variant="primary" type="submit" disabled={loading}>
                      {loading ? "Updating..." : "Update Profile"}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Tab>

            <Tab eventKey="posts" title="My Posts">
              {postsLoading ? (
                <LoadingSpinner />
              ) : userPosts.length === 0 ? (
                <Card>
                  <Card.Body className="text-center py-5">
                    <h4>You haven't created any posts yet</h4>
                    <p className="text-muted">
                      Start creating posts to see them here
                    </p>
                  </Card.Body>
                </Card>
              ) : (
                <Row>
                  {userPosts.map((post) => (
                    <Col key={post._id} md={6} className="mb-3">
                      <PostCard post={post} onDelete={handleDeletePost} />
                    </Col>
                  ))}
                </Row>
              )}
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
