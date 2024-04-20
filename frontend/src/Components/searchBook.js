import React, { useState, useEffect } from "react";
import axios from "axios";
import "../CSS/searchbook.css";

const SearchBooks = ({ userID, addToBookshelf }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [loading, setLoading] = useState(false);

  const searchBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}`
      );

      const searchResult = response.data.items;
      setSearchedBooks(searchResult);
    } catch (error) {
      console.error("Error searching books:", error);
    } finally {
      setLoading(false); // Set loading state to false after fetching data
    }
  };

  // Call searchBooks when searchQuery changes
  useEffect(() => {
    // Clear any existing timeout
    clearTimeout(searchTimeout);

    // Set a new timeout
    const timeout = setTimeout(() => {
      if (searchQuery.trim() !== "") {
        searchBooks();
      } else {
        // Clear the search results if the search query is empty
        setSearchedBooks([]);
      }
    }, 500); // Adjust the delay here (in milliseconds)

    // Save the timeout ID
    setSearchTimeout(timeout);

    // Cleanup function to clear the timeout if component unmounts or searchQuery changes
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const addtoShelf = async (book) => {
    try {
      await addToBookshelf(book); // Call the addToBookshelf function passed from Bookshelf
    } catch (error) {
      console.error("Error adding book to shelf:", error);
    }
  };

  return (
    <div className={`search-container ${loading ? "loading" : ""}`}>
      <br />
      <input
        className="search-input"
        type="text"
        placeholder="Search for books..."
        value={searchQuery}
        onChange={(evt) => setSearchQuery(evt.target.value)}
      />
      <button className="search-button" onClick={searchBooks}>
        Search
      </button>
      <br />

      <div className="search-results">
        {searchedBooks.map((book) => (
          <div className="search-result" key={book.id}>
            <h2 className="book-title">{book.volumeInfo.title}</h2>
            <p className="book-author">{book.volumeInfo.authors}</p>
            <img
              className="book-thumbnail"
              src={book.volumeInfo.imageLinks?.thumbnail}
              alt={book.volumeInfo.title}
            />
            <button
              className="add-to-shelf-button"
              onClick={() => addtoShelf(book)}
            >
              Add to My Shelf
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBooks;
