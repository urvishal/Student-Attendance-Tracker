const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validateUserRegistration = (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (username.length < 3) {
    return res
      .status(400)
      .json({ message: "Username must be at least 3 characters" });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Please provide a valid email" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  next();
};

const validatePost = (req, res, next) => {
  const { title, body } = req.body;

  if (!title || !body) {
    return res.status(400).json({ message: "Title and body are required" });
  }

  if (title.length > 200) {
    return res
      .status(400)
      .json({ message: "Title must be less than 200 characters" });
  }

  next();
};

const validateComment = (req, res, next) => {
  const { comment } = req.body;

  if (!comment) {
    return res.status(400).json({ message: "Comment is required" });
  }

  if (comment.length > 500) {
    return res
      .status(400)
      .json({ message: "Comment must be less than 500 characters" });
  }

  next();
};

module.exports = {
  validateUserRegistration,
  validatePost,
  validateComment,
};
