const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Book = require('../models/Book');
const jwtExpireTime = 24*60*60;


const findAll = async (book) => {
    let allBooks = await Book.find({});
    return book.json(allBooks);
};

exports.getAllBooks = (req, res) => {
    findAll(res);
}

    