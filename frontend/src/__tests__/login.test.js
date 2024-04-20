import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect"; // Import matchers
import axios from "axios"; // Import axios for mocking
import { BrowserRouter as Router } from "react-router-dom";
import Login from "../Components/login";

// Mock axios post method
jest.mock("axios");

test("Login component renders correctly", () => {
  const { getByPlaceholderText, getByText } = render(
    <Router>
      <Login />
    </Router>
  );

  // Check if form elements are present
  expect(getByPlaceholderText("Email")).toBeInTheDocument();
  expect(getByPlaceholderText("Password")).toBeInTheDocument();
  expect(getByText("Login")).toBeInTheDocument(); // Select the button element
});

test("User input is captured correctly", () => {
  const { getByPlaceholderText } = render(
    <Router>
      <Login />
    </Router>
  );

  // Input email and password
  const emailInput = getByPlaceholderText("Email");
  const passwordInput = getByPlaceholderText("Password");
  fireEvent.change(emailInput, { target: { value: "test@example.com" } });
  fireEvent.change(passwordInput, { target: { value: "password123" } });

  // Check if input values are captured correctly
  expect(emailInput).toHaveValue("test@example.com");
  expect(passwordInput).toHaveValue("password123");
});

test("Form submission works as expected", async () => {
  axios.post.mockResolvedValueOnce({ data: { token: "mockToken", id: "123" } });

  const { getByPlaceholderText, getByText } = render(
    <Router>
      <Login />
    </Router>
  );

  // Input email and password
  fireEvent.change(getByPlaceholderText("Email"), {
    target: { value: "test@example.com" },
  });
  fireEvent.change(getByPlaceholderText("Password"), {
    target: { value: "password123" },
  });

  // Submit form
  fireEvent.click(getByText("Login"));

  // Check if axios.post is called with correct data
  await waitFor(() =>
    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:3001/users/login",
      { email: "test@example.com", password: "password123" }
    )
  );
});

test("Error message is displayed when login fails", async () => {
  axios.post.mockRejectedValueOnce({ message: "Invalid credentials" });

  const { getByText, findByText } = render(
    <Router>
      <Login />
    </Router>
  );

  // Submit form
  fireEvent.click(getByText("Login"));

  // Check if error message is displayed
  expect(
    await findByText("Invalid email or password. Please try again.")
  ).toBeInTheDocument();
});
