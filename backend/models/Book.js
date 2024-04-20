const mongoose = require("mongoose");
const User = require("./User");

const Schema = mongoose.Schema;

const BookSchema = new Schema(
  {
    category: {
      type: String,
    },
    author: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    bookId: {
      type: String,
      required: true,
    },
    ratings: [
      {
        rating: {
          type: Number,
        },
        userId: {
          type: String,
        },
      },
    ],
    avgRating: {
      type: Number,
    },
    thumbnail: {
      type: String,
    },
    reviews: [
      {
        description: {
          type: String,
        },
        userId: {
          type: String,
        },
      },
    ],
    addedby: [
      {
        userID: {
          type: String,
          required: true,
        },
      },
    ],
    currentlyReading: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("books", BookSchema);

module.exports = Book;
