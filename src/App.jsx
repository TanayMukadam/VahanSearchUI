import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Username:", username);
    console.log("Password:", password);
  };

  return (
    <div className="main-page-container">
      <div className="main-page-center-container">
        <form action="" className="form-container">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" placeholder="Enter Your Username" />

          <label htmlFor="password">Password</label>
          <input type="password" id="password" placeholder="Enter Your Password"/>
        </form>
      </div>
    </div>
  );
}
