import React, { useState } from "react";
import Login from "./components/Login";
import Students from "./components/Students";
import Attendance from "./components/Attendance";
import Posts from "./components/Posts";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));
  const [view, setView] = useState("dashboard"); // dashboard, students, attendance, posts

  if (!loggedIn) return <Login setLoggedIn={setLoggedIn} />;

  return (
    <div className="bg-light min-vh-100">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
        <div className="container">
          <a className="navbar-brand" href="#">
            Attendance Portal
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link text-white"
                  onClick={() => setView("dashboard")}
                >
                  Dashboard
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link text-white"
                  onClick={() => setView("students")}
                >
                  Students
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link text-white"
                  onClick={() => setView("attendance")}
                >
                  Attendance
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link text-white"
                  onClick={() => setView("posts")}
                >
                  Blog
                </button>
              </li>
            </ul>
            <button
              className="btn btn-outline-light"
              onClick={() => {
                localStorage.removeItem("token");
                window.location.reload();
              }}
            >
              Logout <i className="bi bi-box-arrow-right"></i>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-4">
        {view === "dashboard" && (
          <div className="text-center">
            <h1>Welcome to Attendance Portal</h1>
            <p className="lead">
              Manage Students, Attendance, and Blog Posts effortlessly.
            </p>
            <div className="row mt-4">
              <div className="col-md-4 mb-3">
                <div className="card shadow-sm p-3">
                  <i className="bi bi-people-fill display-4 text-primary"></i>
                  <h5 className="mt-2">Students</h5>
                  <p>View and manage student records.</p>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="card shadow-sm p-3">
                  <i className="bi bi-journal-check display-4 text-success"></i>
                  <h5 className="mt-2">Attendance</h5>
                  <p>Track class attendance easily.</p>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="card shadow-sm p-3">
                  <i className="bi bi-pencil-square display-4 text-warning"></i>
                  <h5 className="mt-2">Blog</h5>
                  <p>Manage posts and comments efficiently.</p>
                </div>
              </div>
            </div>
          </div>
        )}
        {view === "students" && <Students />}
        {view === "attendance" && <Attendance />}
        {view === "posts" && <Posts />}
      </div>
    </div>
  );
}
