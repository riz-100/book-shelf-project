import { useState, useContext, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import UserContext from "../UserContext";
import axios from "axios";
import Book from "./Book";
import "../CSS/user.css";

const User = () => {
  const backendURL =
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_BACKEND_URL_DEVELOPMENT
      : process.env.REACT_APP_BACKEND_URL_PRODUCTION;
  const { userID } = useParams();
  const { token } = useContext(UserContext);
  const [userDetails, setUserDetails] = useState({});
  const [bookData, setBookData] = useState([]);
  const Navigate = useNavigate();
  const fetchBookshelfData = async () => {
    try {
      const response = await axios.get(
        `${backendURL}/myBookshelf/all?id=${userID}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      const books = response.data;
      setBookData(books);
    } catch (error) {
      console.error("Error fetching bookshelf data:", error);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `${backendURL}/users/getUser?id=${userID.slice(1)}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      const userData = response.data.user; // Extract user details from response
      setUserDetails(userData); // Set user details in state
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData(); // Fetch user data on component mount
    fetchBookshelfData();
  }, []); // Empty dependency array ensures the effect runs only once

  useEffect(() => {}, [bookData]);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userID");
      // Redirect to login page
      Navigate("/login");
    }
  };

  return (
    <div className="user-container">
      <div className="nav-links">
        <Link to={`/bookshelf/${userID}`} className="link">
          Bookshelf
        </Link>
        <Link to={`/dashboard/${userID}`} className="link">
          Dashboard
        </Link>
      </div>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
      <h1>Profile</h1>

      {userDetails && ( // Check if userDetails exists before accessing its properties
        <div>
          <div className="user-details">
            <p>Name: {userDetails.name}</p>
            <p>Email: {userDetails.email}</p>
          </div>
          <br></br>
          <hr></hr>
          {userDetails.currentlyReading && (
            <>
              <div className="users-book-details">
                Books:
                <p>
                  Currently Reading:{" "}
                  {
                    userDetails.currentlyReading.filter(
                      (book) => book.progress !== 100
                    ).length
                  }
                </p>
                <p>
                  Completed:{" "}
                  {
                    userDetails.currentlyReading.filter(
                      (book) => book.progress === 100
                    ).length
                  }
                </p>
              </div>
            </>
          )}
        </div>
      )}

      <h2>
        Reviews
        {` (${
          bookData.filter((book) =>
            book.reviews.some((review) => review.userId === userID)
          ).length
        })`}
      </h2>
      <span>Reviews added by the user will be shown here</span>
      <div className="reviewed-books-container">
        {bookData
          .filter((book) =>
            book.reviews.some((review) => review.userId === userID)
          )
          .map((book) => (
            <div key={book._id}>
              <Book
                book={book}
                ratingBtnVisibility={true}
                btnClass={"hide-btn"}
                reviewInputText={book.reviews
                  .filter((review) => review.userId === userID)
                  .map((review) => review.description)}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default User;
