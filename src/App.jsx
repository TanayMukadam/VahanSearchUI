import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [form, setForm] = useState({ username: "", password: "", showPwd: false });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Username:", form.username);
    console.log("Password:", form.password);
    // TODO: authenticate, then navigate
  };

  return (
    <div className="login-root">
      {/* Logo */}
      <div className="login-logo" aria-hidden="true">
        <img src="/public/images/logo.png" alt="Logo" className="login-logo-img" />
      </div>

      {/* Glass card */}
      <main className="login-card glass">
        <h1 className="login-title">Vahan Search</h1>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {/* Username */}
          <div className="field-row">
            <label htmlFor="username" className="field-label">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              className="field-input"
              placeholder="Enter your username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password + toggle */}
          <div className="field-row">
            <label htmlFor="password" className="field-label">Password</label>
            <div className="pwd-wrap">
              <input
                id="password"
                name="password"
                type={form.showPwd ? "text" : "password"}
                autoComplete="current-password"
                className="field-input pwd-input"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
                aria-describedby="pwd-help"
              />
              <button
                type="button"
                className="pwd-toggle"
                aria-controls="password"
                aria-pressed={form.showPwd}
                onClick={() => setForm((s) => ({ ...s, showPwd: !s.showPwd }))}
              >
                {form.showPwd ? "Hide" : "Show"}
              </button>
            </div>
            <div id="pwd-help" className="sr-only">
              Toggle button switches password visibility; current state {form.showPwd ? "visible" : "hidden"}.
            </div>
          </div>

          <button className="login-btn" type="submit">Login</button>
        </form>
      </main>
    </div>
  );
}
