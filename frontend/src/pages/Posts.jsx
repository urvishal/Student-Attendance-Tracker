import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { postsAPI } from "../services/api";
import PostCard from "../components/PostCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { isEditor } from "../utils/helpers";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [tagsFilter, setTagsFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, [currentPage, searchTerm, tagsFilter]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 9,
        ...(searchTerm && { search: searchTerm }),
        ...(tagsFilter && { tags: tagsFilter }),
      };

      const response = await postsAPI.getAll(params);
      setPosts(response.posts);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await postsAPI.delete(postId);
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (err) {
      setError("Failed to delete post");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPosts();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Posts</h1>
        {isEditor(user) && (
          <Link to="/posts/create" className="btn btn-primary">
            Create New Post
          </Link>
        )}
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Search and Filter */}
      <Form onSubmit={handleSearch} className="mb-4">
        <Row>
          <Col md={6}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Filter by tags (comma separated)"
                value={tagsFilter}
                onChange={(e) => setTagsFilter(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Button type="submit" variant="primary" className="w-100">
              Search
            </Button>
          </Col>
        </Row>
      </Form>

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-5">
          <h3>No posts found</h3>
          <p>Try adjusting your search criteria or create a new post.</p>
        </div>
      ) : (
        <>
          <Row>
            {posts.map((post) => (
              <Col key={post._id} md={6} lg={4} className="mb-4">
                <PostCard post={post} onDelete={handleDelete} />
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <nav>
                <ul className="pagination">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage - 1)}>
                      Previous
                    </button>
                  </li>

                  {[...Array(totalPages)].map((_, index) => (
                    <li
                      key={index + 1}
                      className={`page-item ${
                        currentPage === index + 1 ? "active" : ""
                      }`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(index + 1)}>
                        {index + 1}
                      </button>
                    </li>
                  ))}

                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage + 1)}>
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default Posts;
