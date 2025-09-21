<div className="d-flex justify-content-center align-items-center vh-100 bg-primary">
  <div className="card p-4 shadow w-50">
    <h2 className="mb-4 text-center text-primary">Login</h2>
    <input
      className="form-control mb-3"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
    <input
      className="form-control mb-3"
      placeholder="Password"
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
    <button className="btn btn-primary w-100" onClick={login}>
      Login
    </button>
  </div>
</div>;
