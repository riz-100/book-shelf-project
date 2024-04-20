import React from "react";
import "../CSS/BookWithProgressBar.css"; // Import the CSS file
import Book from "./Book";
import ProgressBar from "./ProgressBar";

const BookWithProgressBar = ({
  book,
  buttonText,
  handleOnClick,
  handleProgressUpdate,
  btnClass,
}) => {
  return (
    <div className=" book-container">
      {" "}
      {/* Apply container class */}
      <Book
        book={book}
        buttonText={buttonText}
        handleOnClick={handleOnClick}
        reviewInputText={"Write your review..."}
        btnClass={btnClass}
      />
      <div className="progress-bar-container">
        <div className="progress-input-container">
          <span>Add Progress </span>
          <input
            type="number"
            value={book.progress}
            onChange={(e) => {
              const newValue = parseInt(e.target.value);
              if (newValue >= 0 && newValue <= 100) {
                handleProgressUpdate(book._id, newValue);
              }
            }}
            min={0}
            max={100}
            className="progress-input"
          />
        </div>
        <div className="progress-bar" style={{ width: `${book.progress}%` }}>
          {book.progress}%
        </div>
      </div>
    </div>
  );
};

export default BookWithProgressBar;
