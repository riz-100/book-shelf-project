import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { toBeInTheDocument } from "@testing-library/jest-dom/extend-expect"; // Import toBeInTheDocument directly
import UserContext from "../UserContext";
import Book from "../Components/Book";

test("Book component renders correctly", () => {
  const book = {
    _id: "1",
    thumbnail: "thumbnail.jpg",
    title: "Sample Book",
    author: "Sample Author",
    avgRating: 4.5,
    ratings: [
      { userId: "user1", rating: 4 },
      { userId: "user2", rating: 5 },
    ],
  };
  const handleOnClick = jest.fn();
  const ratingBtnVisibility = true;
  const reviewInputText = "Write your review here";

  const { getByText, getByAltText } = render(
    <Router>
      <UserContext.Provider value={{ token: "mockToken" }}>
        <Book
          book={book}
          buttonText="Sample Button Text"
          handleOnClick={handleOnClick}
          ratingBtnVisibility={ratingBtnVisibility}
          reviewInputText={reviewInputText}
        />
      </UserContext.Provider>
    </Router>
  );

  // Check if elements are in the document
  expect(getByText("Sample Book")).toBeInTheDocument();
  expect(getByText("Sample Author")).toBeInTheDocument();
  expect(getByText("Avg Rating: 4.50")).toBeInTheDocument();
  expect(getByAltText("Sample Book")).toBeInTheDocument();
  expect(getByText("Sample Button Text")).toBeInTheDocument();
});

// You can write more specific tests for interactions and functionality as needed.
