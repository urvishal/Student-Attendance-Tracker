<div>
  <h2 className="mb-3">Blog Posts</h2>
  <CreatePost onCreated={fetchPosts} />
  <div className="row">
    {posts.map((p) => (
      <div className="col-md-6 mb-3" key={p._id}>
        <div className="card shadow-sm p-3 h-100">
          <h5>{p.title}</h5>
          <p>{p.body}</p>
          <small>By: {p.author?.username}</small>
          <Comments postId={p._id} />
        </div>
      </div>
    ))}
  </div>
</div>;
