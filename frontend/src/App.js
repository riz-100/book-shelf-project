import React, { useContext, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navigate } from "react-router";
import Bookshelf from "./Components/BookShelf";
import Login from "./Components/login";
import Signup from "./Components/signup";
import Dashboard from "./Components/dashboard";
import User from "./Components/User";
import UserContext from "./UserContext";

function App() {
  const [token, setToken] = useState(localStorage.getItem("authToken") || null);
  const [userID, setUserID] = useState(localStorage.getItem("userID") || null);

  const handleLogin = (loggedInUserId, token) => {
    setToken(token);
    setUserID(loggedInUserId);
  };
  const handleSignup = (loggedInUserId, token) => {
    setToken(token);
    setUserID(loggedInUserId);
  };

  return (
    <Router>
      <UserContext.Provider value={{ token, userID }}>
        <div>
          <Routes>
            {userID ? (
              <Route path="/" element={<Navigate to={`/user/:${userID}`} />} />
            ) : (
              <Route path="/" element={<Navigate to="/login" />} />
            )}
            <Route path="/bookshelf/:userID" element={<Bookshelf />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route
              path="/signup"
              element={<Signup onSignup={handleSignup} />}
            />
            <Route path="/dashboard/:userID" element={<Dashboard />} />
            <Route path="/user/:userID" element={<User />} />
          </Routes>
        </div>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
