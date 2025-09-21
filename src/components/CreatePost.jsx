import React, { useState } from "react";
import API from "../api";

export default function CreatePost({ onCreated }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");

  const createPost = async () => {
    try {
      await API.post("/posts", { title, body, tags: tags.split(",") });
      setTitle("");
      setBody("");
      setTags("");
      alert("Post created");
      if (onCreated) onCreated();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div>
      <h4>Create Post</h4>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <input
        placeholder="Tags comma-separated"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <button onClick={createPost}>Add Post</button>
    </div>
  );
}
