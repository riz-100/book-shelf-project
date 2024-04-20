const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Book = require("../models/Book");
const User = require("../models/User");
const jwtExpireTime = 24 * 60 * 60;
const mongoose = require("mongoose");

exports.addBook = async (req, res) => {
  let searchBook = await Book.findOne({ bookId: req.body.bookId });
  if (searchBook) {
    let ifAlreadyAdded = searchBook.addedby.some(
      (user) => user.userID === req.body.addedby
    );
    if (ifAlreadyAdded) {
      return res.json({ ifAlreadyAdded });
    }

    searchBook.addedby.push({ userID: req.body.addedby });

    searchBook.save().then((book) => {
      return res.json(book);
    });
  } else {
    const newBook = new Book({
      category: req.body.category,
      author: req.body.author,
      title: req.body.title,
      thumbnail: req.body.thumbnail,
      addedby: { userID: req.body.addedby },
      bookId: req.body.bookId,
    });
    newBook.save().then((book) => {
      return res.json(book);
    });
  }
};

const findAll = async (req, res) => {
  const userID = req.query.id;

  let allBooks = await Book.find({ "addedby.userID": userID });

  return res.json(allBooks);
};

exports.getAllBooks = async (req, res) => {
  findAll(req, res);
};

exports.addRating = async (req, res) => {
  try {
    // Extract the bookId, rating, and userId from the request body
    const { bookId, rating, userId } = req.body;

    // Find the book by its ID
    const book = await Book.findById(bookId);

    // Check if the bookId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ error: "Invalid book ID" });
    }

    // Push the new rating into the book's ratings array
    // Check if the user has already rated the book
    const existingRating = book.ratings.find((item) => item.userId === userId);

    if (existingRating) {
      // If the user has already rated the book, update the existing rating
      existingRating.rating = rating;
    } else {
      // If the user has not rated the book before, add the new rating
      book.ratings.push({ rating: rating, userId: userId });
    }
    // Calculate the average rating
    const sum = book.ratings.reduce((total, value) => total + value.rating, 0);
    const avgRating = sum / book.ratings.length;

    // Update the book's average rating
    book.avgRating = avgRating;

    // Save the updated book document to the database
    await book.save();

    // Send a success response
    res.status(201).json({ message: "Rating added successfully", book });
  } catch (error) {
    // Handle errors
    console.error("Error adding rating:", error);
    res
      .status(500)
      .json({ error: "An error occurred while adding the rating" });
  }
};

exports.addReview = async (req, res) => {
  try {
    // Extract the bookId, review, and userID from the request body
    const { bookId, review, userId } = req.body;

    // Find the book by its ID
    const book = await Book.findById(bookId);

    // Check if the book exists
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Check if the user has already left a review for this book
    const existingReviewIndex = book.reviews.findIndex(
      (r) => r.userId === userId
    );

    if (existingReviewIndex !== -1) {
      // Update the existing review with the new review text
      book.reviews[existingReviewIndex].description = review;
    } else {
      // Add the new review to the book's reviews array
      book.reviews.push({ description: review, userId: userId });
    }

    // Save the updated book document to the database
    await book.save();

    // Send a success response
    res.status(201).json({ message: "Review added successfully", book });
  } catch (error) {
    // Handle errors
    console.error("Error adding review:", error);
    res
      .status(500)
      .json({ error: "An error occurred while adding the review" });
  }
};

exports.addToCurrentlyReading = async (req, res) => {
  const { userId, bookId } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const book = await Book.findById(bookId);

    // Check if the book exists
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Check if the book is already in currently reading list
    const alreadyReading = user.currentlyReading.some(
      (book) => book.book.toString() === bookId
    );

    if (alreadyReading) {
      return res
        .status(409)
        .json({ message: "Book already in currently reading list" });
    }

    user.currentlyReading.push({ book: bookId });

    // Save the updated user
    await user.save();

    res
      .status(200)
      .json({ message: "Book added to currently reading list", user });
  } catch (error) {
    console.error("Error adding book to currently reading list:", error);
    res.status(500).json({
      error: "An error occurred while adding book to currently reading list",
    });
  }
};

exports.getCurrentlyReading = async (req, res) => {
  const userId = req.query.id;

  try {
    // Find the user by ID

    const user = await User.findById(userId.slice(1));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get the currently reading books for the user
    const currentlyReadingBooks = user.currentlyReading;
    let allBooks = await Book.find({ "addedby.userID": userId });

    const currentlyReading = currentlyReadingBooks.map((CRbook) => {
      // Find the corresponding book
      const book = allBooks.find((b) => b._id.toString() === CRbook.book);

      if (book === undefined) {
        return null;
      }

      const bookWithProgress = {
        ...book.toObject(),
        progress: CRbook.progress,
      };

      return bookWithProgress;
    });

    const validCurrentlyReading = currentlyReading.filter(
      (book) => book !== null
    );

    res.status(200).json({ currentlyReading: validCurrentlyReading });
  } catch (error) {
    console.error("Error getting currently reading books:", error);
    res.status(500).json({
      error: "An error occurred while getting currently reading books",
    });
  }
};

exports.updateProgress = async (req, res) => {
  const { userId, bookId, progress } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the book in user's currently reading list
    const bookIndex = user.currentlyReading.findIndex(
      (item) => item.book === bookId
    );

    if (bookIndex === -1) {
      return res
        .status(404)
        .json({ message: "Book not found in currently reading list" });
    }

    // Update the progress of the book
    user.currentlyReading[bookIndex].progress = progress;

    // Save the updated user object
    await user.save();

    res.status(200).json({ message: "Progress updated successfully" });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({
      error: "An error occurred while updating progress",
    });
  }
};
