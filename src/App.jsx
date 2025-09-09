// App.jsx
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AuthAPI } from "./services/api"; // Import the API service
import "./App.css";

export default function App() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    showPwd: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended destination from location state
  const from = location.state?.from?.pathname || '/search';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await AuthAPI.login(form.username, form.password);
      
      // Store the token
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('token_type', data.token_type);
      
      // Navigate to intended destination or default to search
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-root"
      style={{ "--brand": "#99C129" }}
    >
      <header className="login-logo" aria-label="Site logo">
        <img className="login-logo-img" src="/public/images/logo.png" alt="CheckExplore Technologies" />
      </header>

      <main className="glass login-card" role="main" aria-labelledby="loginTitle">
        <h1 id="loginTitle" className="login-title">Vahan Check</h1>
        <p className="login-subtitle">Log in to continue</p>

        {error && (
          <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit} autoComplete="on">
          <div className="field-row">
            <label htmlFor="username" className="field-label">Username or Email</label>
            <input
              id="username"
              name="username"
              className="field-input"
              type="text"
              inputMode="email"
              autoComplete="username"
              placeholder="name@example.com"
              value={form.username}
              onChange={handleChange}
              aria-required="true"
              disabled={loading}
            />
          </div>

          <div className="field-row">
            <label htmlFor="password" className="field-label">Password</label>
            <div className="pwd-wrap">
              <input
                id="password"
                name="password"
                className="field-input pwd-input"
                type={form.showPwd ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                aria-required="true"
                disabled={loading}
              />
              <button
                type="button"
                className="pwd-toggle"
                onClick={() => setForm((s) => ({ ...s, showPwd: !s.showPwd }))}
                aria-pressed={form.showPwd}
                aria-label={form.showPwd ? "Hide password" : "Show password"}
                disabled={loading}
              >
                {form.showPwd ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </main>
    </div>
  );
}
