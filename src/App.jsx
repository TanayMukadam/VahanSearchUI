// App.jsx
import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    showPwd: false,
  });

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
    <div
      className="login-root"
      // Set the brand color once to match the logo (adjust this hex to logo green)
      style={{ "--brand": "#99C129" }}
    >
      <header className="login-logo" aria-label="Site logo">
        <img className="login-logo-img" src="/public/images/logo.png" alt="CheckExplore Technologies" />
      </header>

      <main className="glass login-card" role="main" aria-labelledby="loginTitle">
        <h1 id="loginTitle" className="login-title">Welcome back</h1>
        <p className="login-subtitle">Log in to continue</p>

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
              />
              <button
                type="button"
                className="pwd-toggle"
                onClick={() => setForm((s) => ({ ...s, showPwd: !s.showPwd }))}
                aria-pressed={form.showPwd}
                aria-label={form.showPwd ? "Hide password" : "Show password"}
              >
                {form.showPwd ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Button style remains exactly the same class: login-btn */}
          <button type="submit" className="login-btn">Sign in</button>
        </form>
      </main>
    </div>
  );
}
