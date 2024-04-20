// Signup.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../CSS/signup.css";

const Signup = ({ onSignup }) => {
  const backendURL =
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_BACKEND_URL_DEVELOPMENT
      : process.env.REACT_APP_BACKEND_URL_PRODUCTION;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [Error, setError] = useState("");
  const Navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return; // Exit function if password is invalid
    }
    try {
      const response = await axios.post(`${backendURL}/users/register`, {
        email,
        password,
        name,
      });
      console.log("Signup successful");

      const authToken = response.data.token;
      const ID = response.data.id;

      setRegistrationSuccess(true);

      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("userID", response.data.id);

      onSignup(ID, authToken);

      // Redirect user to dashboard or bookshelf upon successful signup
      Navigate(`/bookshelf/:${response.data.id}`);
    } catch (error) {
      console.log(error.status);
      if (error.response.status === 400) {
        setError("Email already exists");
      } else {
        console.error("Signup failed:", error.response.status);
        setError("Signup failed");
      }

      // Display error message to user
    }
  };

  return (
    <div className="signup-container">
      <div className="user-msg">There is no friend as loyal as a book</div>
      <div className="user-msg">
        Embark on your reading journey. Let's get started!
      </div>{" "}
      {/* Apply container class */}
      {registrationSuccess && (
        <p className="success-message">Registration successful!</p>
      )}
      <form className="signup-form" onSubmit={handleSignup}>
        <h2>Signup</h2> {/* Apply form class */}
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        {Error && <p className="error-message">{Error}</p>}{" "}
        <button type="submit">Signup</button>
        <Link to="/login" className="login-link">
          Login
        </Link>
      </form>
    </div>
  );
};

export default Signup;
