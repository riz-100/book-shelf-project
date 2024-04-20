import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";
import UserContext from "../UserContext";
import BookWithProgressBar from "./BookWithProgressBar";
import "../CSS/dashboard.css";

const Dashboard = () => {
  const backendURL =
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_BACKEND_URL_DEVELOPMENT
      : process.env.REACT_APP_BACKEND_URL_PRODUCTION;
  const [currentlyReading, setCurrentlyReading] = useState([]);
  const [completedBooks, setCompletedBooks] = useState([]);
  const { userID } = useParams();
  const { token } = useContext(UserContext);

  const fetchCurrentlyReading = async () => {
    try {
      const response = await axios.get(
        `${backendURL}/myBookshelf/getCurrentlyReading?id=${userID}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      const books = response.data.currentlyReading;
      const completed = books.filter((book) => book.progress === 100);
      const inProgress = books.filter((book) => book.progress < 100);
      setCompletedBooks(completed);
      setCurrentlyReading(inProgress);
    } catch (error) {
      console.error("Error fetching currently reading books:", error);
    }
  };

  useEffect(() => {
    fetchCurrentlyReading();
  }, [userID, token]);

  const handleProgressUpdate = async (bookId, progress) => {
    try {
      await axios.put(
        `${backendURL}/myBookshelf/updateProgress`,
        { userId: userID.slice(1), bookId, progress },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      // After updating progress, fetch currently reading books again
      fetchCurrentlyReading();
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="nav-links">
        <Link to={`/bookshelf/${userID}`} className="link">
          Bookshelf
        </Link>
        <Link to={`/User/${userID}`} className="link">
          My Profile
        </Link>
      </div>
      <div className="currently-reading-section">
        <h2 className="book-section-title">Currently Reading</h2>
        <br></br>
        <div className="book-list">
          {currentlyReading.map((book) => (
            <BookWithProgressBar
              key={book._id}
              book={book}
              buttonText="Mark as Completed"
              handleOnClick={() => {
                handleProgressUpdate(book._id, 100);
              }}
              btnClass={"book-btn"}
              handleProgressUpdate={handleProgressUpdate}
            />
          ))}
        </div>
      </div>
      <hr></hr>
      <div className="completed-books-section">
        <h2 className="book-section-title">
          Completed Books ({completedBooks.length})
        </h2>
        <br></br>
        <div className="book-list">
          {completedBooks.map((book) => (
            <BookWithProgressBar
              key={book._id}
              book={book}
              handleOnClick={() => {}}
              btnClass={"hide-btn"}
              handleProgressUpdate={handleProgressUpdate}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
