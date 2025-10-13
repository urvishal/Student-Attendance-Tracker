import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppNavbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register";
import Posts from "./pages/Posts";
import PostDetail from "./pages/PostDetail";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Classes from "./pages/Classes";
import ClassDetail from "./pages/ClassDetail";
import LoadingSpinner from "./components/LoadingSpinner";
import { useAuth } from "./context/AuthContext";

// Create a wrapper component to handle auth loading
const AppContent = () => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/posts" element={<Posts />} />
      <Route path="/posts/:id" element={<PostDetail />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/classes" element={<Classes />} />
      <Route path="/classes/:id" element={<ClassDetail />} />
      <Route
        path="*"
        element={
          <div className="container mt-4">
            <h2>Page Not Found</h2>
          </div>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppNavbar />
          <main>
            <AppContent />
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
