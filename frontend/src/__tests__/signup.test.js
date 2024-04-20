import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { BrowserRouter as Router } from "react-router-dom"; // Import MemoryRouter
import Signup from "../Components/signup";

test("Signup component renders correctly", () => {
  const { getByPlaceholderText, getByRole } = render(
    <Router>
      <Signup />
    </Router>
  );

  // Check if form elements are present
  expect(getByPlaceholderText("Name")).toBeInTheDocument();
  expect(getByPlaceholderText("Email")).toBeInTheDocument();
  expect(getByPlaceholderText("Password")).toBeInTheDocument();
  expect(getByRole("button", { name: "Signup" })).toBeInTheDocument();
});

test("Error messages are displayed when form fields are not filled correctly", async () => {
  const { findByText, getByRole } = render(
    <Router>
      <Signup />
    </Router>
  );

  // Submit form without filling any fields
  fireEvent.click(getByRole("button", { name: "Signup" }));

  // Check if error messages are displayed
  expect(
    await findByText(
      /Name is required|Email is required|Password must be at least 6 characters long/i
    )
  ).toBeInTheDocument();
});
