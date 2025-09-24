import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <Container>
      {/* Hero Section */}
      <Row className="py-5 mb-4 bg-light rounded-3">
        <Col>
          <h1 className="display-4 text-center">Student Attendance System</h1>
          <p className="lead text-center">
            A comprehensive system to track classes, students, and attendance
            records with user management and communication features.
          </p>
          <div className="text-center">
            {!user ? (
              <div>
                <Link to="/register" className="btn btn-primary btn-lg me-2">
                  Get Started
                </Link>
                <Link to="/login" className="btn btn-outline-secondary btn-lg">
                  Login
                </Link>
              </div>
            ) : (
              <Link to="/posts" className="btn btn-primary btn-lg">
                View Posts
              </Link>
            )}
          </div>
        </Col>
      </Row>

      {/* Features Section */}
      <Row className="mb-5">
        <Col md={4} className="text-center mb-4">
          <div
            className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
            style={{ width: "80px", height: "80px" }}>
            <i className="fas fa-users fa-2x"></i>
          </div>
          <h3>Track Attendance</h3>
          <p className="text-muted">
            Easily track student attendance for classes and events with our
            intuitive system.
          </p>
        </Col>

        <Col md={4} className="text-center mb-4">
          <div
            className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
            style={{ width: "80px", height: "80px" }}>
            <i className="fas fa-clipboard-list fa-2x"></i>
          </div>
          <h3>Manage Students</h3>
          <p className="text-muted">
            Keep detailed records of students, classes, and academic information
            all in one place.
          </p>
        </Col>

        <Col md={4} className="text-center mb-4">
          <div
            className="bg-info text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
            style={{ width: "80px", height: "80px" }}>
            <i className="fas fa-comments fa-2x"></i>
          </div>
          <h3>Communicate</h3>
          <p className="text-muted">
            Share announcements, posts, and updates with students and staff.
          </p>
        </Col>
      </Row>

      {/* Additional Info */}
      <Row>
        <Col lg={8} className="mx-auto">
          <h2 className="text-center mb-4">How It Works</h2>
          <Row>
            <Col md={6} className="mb-3">
              <h5>1. User Registration</h5>
              <p>
                Register as Admin, Editor, or User with appropriate permissions.
              </p>
            </Col>
            <Col md={6} className="mb-3">
              <h5>2. Create Posts</h5>
              <p>
                Editors and Admins can create posts with categories and tags.
              </p>
            </Col>
            <Col md={6} className="mb-3">
              <h5>3. Comment System</h5>
              <p>
                Users can engage with posts through comments and discussions.
              </p>
            </Col>
            <Col md={6} className="mb-3">
              <h5>4. Admin Dashboard</h5>
              <p>Admins can manage users, roles, and system settings.</p>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
