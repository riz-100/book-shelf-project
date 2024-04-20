import React, { useContext, useState } from "react";
import axios from "axios";
import UserContext from "../UserContext";
import MessageBox from "./MessageBox";
import "../CSS/review.css";

const ReviewComponent = ({ userId, bookId, text }) => {
  const backendURL =
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_BACKEND_URL_DEVELOPMENT
      : process.env.REACT_APP_BACKEND_URL_PRODUCTION;

  const [review, setReview] = useState("");
  const [message, setMessage] = useState("");

  const { token } = useContext(UserContext);

  const handleSubmit = async () => {
    if (!review.trim()) {
      setMessage("Please write a review before submitting.");
      return;
    }
    try {
      // Make a POST request to your backend API to add the user rating
      const response = await axios.post(
        `${backendURL}/mybookshelf/addReview`,
        {
          bookId: bookId,
          review: review,
          userId: userId,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      // Handle success
      console.log("Review added successfully:");
      setMessage("Review added successfully");

      // Optionally, you can update the UI or perform any other actions after adding the rating
    } catch (error) {
      // Handle error
      console.error("Error adding review:", error);
      setMessage("Error adding review");
    }
  };
  const handleHideMessage = () => {
    setMessage(""); // Clear the message
  };

  return (
    <div className="review-component">
      <textarea
        className="review-textarea"
        value={review}
        placeholder={text}
        onChange={(e) => setReview(e.target.value)}
      />
      <button onClick={handleSubmit} className="submit-review-button">
        Submit Review
      </button>
      {message && (
        <MessageBox message={message} handleHideMessage={handleHideMessage} />
      )}
    </div>
  );
};

export default ReviewComponent;
