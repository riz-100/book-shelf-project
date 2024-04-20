const express = require("express");
const router = express.Router();
const passport = require("passport");
const myBookShelfController = require("../controllers/mybookshelfController");

router.post("/add", myBookShelfController.addBook);
router.get("/all", myBookShelfController.getAllBooks);
router.post("/addRating", myBookShelfController.addRating);
router.post("/addReview", myBookShelfController.addReview);
router.post(
  "/addToCurrentlyReading",
  myBookShelfController.addToCurrentlyReading
);
router.get("/getCurrentlyReading", myBookShelfController.getCurrentlyReading);
router.put("/updateProgress", myBookShelfController.updateProgress);

module.exports = router;
