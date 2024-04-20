import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import SearchBooks from "./searchBook";
import Book from "./Book";
import MessageBox from "./MessageBox";
import "../CSS/bookshelf.css";

const Bookshelf = () => {
  const { userID } = useParams();
  const [authToken, setAuthToken] = useState("");
  const [bookshelf, setBookshelf] = useState([]);
  const [message, setMessage] = useState("");
  const backendURL =
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_BACKEND_URL_DEVELOPMENT
      : process.env.REACT_APP_BACKEND_URL_PRODUCTION;

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setAuthToken(token);
    if (authToken) {
      fetchBookshelfData();
    }
  }, [authToken]);

  const fetchBookshelfData = async () => {
    try {
      const response = await axios.get(
        `${backendURL}/myBookshelf/all?id=${userID}`,
        {
          headers: {
            Authorization: `${authToken}`,
          },
        }
      );
      const books = response.data;
      setBookshelf(books);
    } catch (error) {
      console.error("Error fetching bookshelf data:", error);
    }
  };

  const addToBookshelf = async (book) => {
    try {
      const response = await axios.post(
        `${backendURL}/mybookshelf/add`,
        {
          title: book.volumeInfo.title,
          author: book.volumeInfo.authors.join("&"),
          bookId: book.id,
          addedby: userID,
          thumbnail: book.volumeInfo.imageLinks.thumbnail,
        },
        {
          headers: {
            Authorization: `${authToken}`,
          },
        }
      );

      console.log("Book added successfully:");
      if (!response.data.ifAlreadyAdded) {
        setBookshelf([...bookshelf, response.data]);
        setMessage(`${response.data.title} added successfully to your shelf.`);
      } else {
        setMessage("Book is already in your shelf.");
      }
    } catch (error) {
      console.error("Error adding book:", error);
      setMessage("Failed to add book to your shelf.");
    }
  };

  const addToCurrentlyReading = async (_id) => {
    try {
      const response = await axios.post(
        `${backendURL}/myBookshelf/addToCurrentlyReading`,
        {
          userId: userID.slice(1),
          bookId: _id,
        },
        {
          headers: {
            Authorization: `${authToken}`,
          },
        }
      );

      console.log("Response status code:", response.status);
      setMessage("Book added to currently reading list");
    } catch (error) {
      console.log(error.response.status);
      if (error.response && error.response.status === 409) {
        console.log("Book already in currently reading list");
        setMessage("This book is already in your currently reading list.");
      } else {
        console.error("Error adding book to currently reading list:", error);
      }
    }
  };
  const handleHideMessage = () => {
    setMessage("");
  };

  return (
    <div className="bookshelf-container">
      <div className="nav-links">
        <Link to={`/dashboard/${userID}`} className="link">
          Dashboard
        </Link>
        <Link to={`/user/${userID}`} className="link">
          My Profile
        </Link>
      </div>
      <div className="searchBook-container">
        <SearchBooks userID={userID} addToBookshelf={addToBookshelf} />
      </div>

      <h1 className="bookshelf-title">My Bookshelf</h1>
      <div className="bookshelf-list">
        {bookshelf.map((book) => (
          <Book
            book={book}
            key={book._id}
            buttonText="Add to Currently Reading"
            handleOnClick={addToCurrentlyReading}
            reviewInputText={"Write your review..."}
            btnClass={"book-btn"}
          />
        ))}
      </div>
      {message && (
        <MessageBox
          message={message}
          handleHideMessage={handleHideMessage}
          className="message"
        />
      )}
    </div>
  );
};

export default Bookshelf;
