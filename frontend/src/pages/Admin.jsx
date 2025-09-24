import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Form,
  Button,
  Alert,
  Badge,
} from "react-bootstrap";
import { usersAPI } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { isAdmin } from "../utils/helpers";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { user } = useAuth();

  useEffect(() => {
    if (user && isAdmin(user)) {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersData = await usersAPI.getAll();
      setUsers(usersData);
    } catch (err) {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await usersAPI.updateRole(userId, newRole);
      setUsers(
        users.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
      setSuccess("User role updated successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to update user role");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await usersAPI.delete(userId);
        setUsers(users.filter((u) => u._id !== userId));
        setSuccess("User deleted successfully");
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        setError("Failed to delete user");
      }
    }
  };

  if (!isAdmin(user)) {
    return (
      <Container>
        <Alert variant="danger" className="mt-4">
          You must be an administrator to access this page.
        </Alert>
      </Container>
    );
  }

  if (loading) return <LoadingSpinner />;

  return (
    <Container>
      <h1 className="mb-4">Admin Dashboard</h1>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h4 className="mb-0">User Management</h4>
            </Card.Header>
            <Card.Body>
              {users.length === 0 ? (
                <p className="text-muted">No users found</p>
              ) : (
                <Table responsive striped>
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((userItem) => (
                      <tr key={userItem._id}>
                        <td>{userItem.username}</td>
                        <td>{userItem.email}</td>
                        <td>
                          <Form.Select
                            value={userItem.role}
                            onChange={(e) =>
                              handleRoleChange(userItem._id, e.target.value)
                            }
                            size="sm"
                            style={{ width: "auto" }}>
                            <option value="User">User</option>
                            <option value="Editor">Editor</option>
                            <option value="Admin">Admin</option>
                          </Form.Select>
                        </td>
                        <td>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteUser(userItem._id)}
                            disabled={userItem._id === user.id}>
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h2>{users.length}</h2>
              <p className="text-muted">Total Users</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h2>{users.filter((u) => u.role === "Admin").length}</h2>
              <p className="text-muted">Administrators</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h2>{users.filter((u) => u.role === "Editor").length}</h2>
              <p className="text-muted">Editors</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Admin;
