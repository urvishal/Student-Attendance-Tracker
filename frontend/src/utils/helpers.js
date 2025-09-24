// Format date to readable format
export const formatDate = (dateString) => {
  if (!dateString) return "Unknown date";

  try {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  } catch (error) {
    return "Invalid date";
  }
};

// Check if user has admin role
export const isAdmin = (user) => {
  return user && user.role === "Admin";
};

// Check if user has editor or admin role
export const isEditor = (user) => {
  return user && (user.role === "Editor" || user.role === "Admin");
};

// Check if user is the author of content
export const isAuthor = (user, contentAuthorId) => {
  return user && user.id === contentAuthorId;
};

// Truncate text to specified length
export const truncateText = (text, length = 100) => {
  if (!text) return "";
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
};
