import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// Auth API
export const authAPI = {
  setToken: setAuthToken,

  login: (email, password) => {
    return api
      .post("/auth/login", { email, password })
      .then((response) => response.data);
  },

  register: (userData) => {
    return api
      .post("/auth/register", userData)
      .then((response) => response.data);
  },

  getProfile: () => {
    return api.get("/users/profile").then((response) => response.data);
  },

  updateProfile: (userData) => {
    return api
      .put("/users/profile", userData)
      .then((response) => response.data);
  },
};

// Posts API
export const postsAPI = {
  getAll: (params = {}) => {
    return api.get("/posts", { params }).then((response) => response.data);
  },

  getById: (id) => {
    return api.get(`/posts/${id}`).then((response) => response.data);
  },

  create: (postData) => {
    return api.post("/posts", postData).then((response) => response.data);
  },

  update: (id, postData) => {
    return api.put(`/posts/${id}`, postData).then((response) => response.data);
  },

  delete: (id) => {
    return api.delete(`/posts/${id}`).then((response) => response.data);
  },

  getComments: (postId) => {
    return api
      .get(`/posts/${postId}/comments`)
      .then((response) => response.data);
  },
};

// Comments API
export const commentsAPI = {
  create: (commentData) => {
    return api.post("/comments", commentData).then((response) => response.data);
  },

  update: (id, commentData) => {
    return api
      .put(`/comments/${id}`, commentData)
      .then((response) => response.data);
  },

  delete: (id) => {
    return api.delete(`/comments/${id}`).then((response) => response.data);
  },
};

// Users API (Admin only)
export const usersAPI = {
  getAll: () => {
    return api.get("/users").then((response) => response.data);
  },

  updateRole: (id, role) => {
    return api
      .put(`/users/${id}/role`, { role })
      .then((response) => response.data);
  },

  delete: (id) => {
    return api.delete(`/users/${id}`).then((response) => response.data);
  },
};

export default api;
