import React, { useState } from "react";

const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8080";

function AuthForm({ onAuthSuccess, isLogin, setIsLogin }) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true); 

  const url = isLogin
    ? `${API_URL}/api/auth/login`
    : `${API_URL}/api/auth/register`;

  const body = isLogin
    ? { username, password }
    : { username, password, displayName };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error("Authentication failed");
    }

    const data = await res.json();
    onAuthSuccess(data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false); 
  }
};


  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <h2>{isLogin ? "Welcome Back" : "Join the Chat"}</h2>

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          {!isLogin && (
            <input
              placeholder="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          )}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
  {loading
    ? "Please wait..."
    : isLogin
    ? "Login"
    : "Register"}
</button>

        </form>

        {error && <p className="error">{error}</p>}

        <p onClick={() => setIsLogin(!isLogin)} className="toggle">
          {isLogin
            ? "Need an account? Register"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}

export default AuthForm;
