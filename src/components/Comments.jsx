import React, { useEffect, useState } from "react";
import API from "../api";

export default function Comments({ postId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  const fetchComments = async () => {
    const res = await API.get(`/comments/post/${postId}`);
    setComments(res.data);
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const addComment = async () => {
    try {
      await API.post("/comments", { postId, comment: text });
      setText("");
      fetchComments();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div>
      <h5>Comments</h5>
      {comments.map((c) => (
        <p key={c._id}>
          {c.user?.username}: {c.comment}
        </p>
      ))}
      <input
        placeholder="Write a comment"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={addComment}>Add</button>
    </div>
  );
}
