import React, { useContext, useState } from "react";
import axios from "axios";
import UserContext from "../UserContext";
import "../CSS/ratingmeter.css";
import MessageBox from "./MessageBox";
//import userEvent from "@testing-library/user-event";

const RatingMeter = ({ userId, bookId, rate = 0, btnVisibility = false }) => {
  const backendURL =
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_BACKEND_URL_DEVELOPMENT
      : process.env.REACT_APP_BACKEND_URL_PRODUCTION;
  const [userRating, setUserRating] = useState(rate);
  const [message, setMessage] = useState("");
  const [btnVisible, setbtnVisible] = useState(rate === 0 || btnVisibility);
  const { token } = useContext(UserContext);

  const handleRatingChange = (newRating) => {
    setUserRating(newRating);
  };

  const handleSubmitRating = async () => {
    if (userRating === undefined || userRating === null || userRating === 0) {
      setMessage("Please select a rating before submitting.");
      return; // Exit the function early if userRating is undefined or null
    }

    try {
      // Make a POST request to your backend API to add the user rating
      const response = await axios.post(
        `${backendURL}/mybookshelf/addRating`,
        {
          bookId: bookId,
          rating: userRating,
          userId: userId,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      // Handle success
      console.log("Rating added successfully:");
      setMessage("Rating added successfully");
      setbtnVisible(false);

      // Optionally, you can update the UI or perform any other actions after adding the rating
    } catch (error) {
      // Handle error
      console.error("Error adding rating:", error);
      setMessage("Error adding rating");
    }
  };
  const handleHideMessage = () => {
    setMessage(""); // Clear the message
  };

  return (
    <div className="rating-meter">
      {[1, 2, 3, 4, 5].map((value) => (
        <label key={value} className="star-label">
          <input
            type="radio"
            value={value}
            checked={userRating === value}
            onChange={() => handleRatingChange(value)}
            className="star-input"
            style={{ display: "none" }}
          />
          <span className={`star ${userRating >= value ? "" : "empty"}`}>
            &#9733;
          </span>
        </label>
      ))}
      {btnVisible && (
        <button onClick={handleSubmitRating} className="submit-button">
          Submit Rating
        </button>
      )}
      {message && (
        <MessageBox message={message} handleHideMessage={handleHideMessage} />
      )}
    </div>
  );
};

export default RatingMeter;
