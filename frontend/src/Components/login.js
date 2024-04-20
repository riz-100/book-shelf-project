// Login.js
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../CSS/login.css";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState(null);
  const [loginError, setLoginError] = useState("");
  const Navigate = useNavigate();

  const handleLogin = async (e) => {
    const backendURL =
      process.env.NODE_ENV === "development"
        ? process.env.REACT_APP_BACKEND_URL_DEVELOPMENT
        : process.env.REACT_APP_BACKEND_URL_PRODUCTION;
    console.log(backendURL);
    e.preventDefault();
    try {
      const response = await axios.post(`${backendURL}/users/login`, {
        email,
        password,
      });
      console.log("Login successful");

      const authToken = response.data.token;

      // Store the authToken and userID in localStorage
      localStorage.setItem("authToken", authToken);
      localStorage.setItem("userID", response.data.id);

      onLogin(response.data.id, authToken);

      Navigate(`/bookshelf/:${response.data.id}`);
      // Redirect user to dashboard or bookshelf upon successful login
    } catch (error) {
      console.error("Login failed:", error);

      setLoginError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="user-msg">
        Reconnect with your favorite reads. Log in to your bookshelf.
      </div>
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login to continue </h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        <Link to="/signup" className="signup-link">
          Signup
        </Link>
        {loginError && <p className="error-message">{loginError}</p>}{" "}
        {/* Display login error message */}
      </form>
    </div>
  );
};

export default Login;
