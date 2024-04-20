require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
//const cors = require("cors");

const user = require("./routes/user");
const myBookShelf = require("./routes/myBookShelf");
const dashboard = require("./routes/dashboard");
const verifyToken = require("./controllers/verifyToken");

const app = express();
//app.use(cors()); //To allow Port3000 where frontend is hosted, to access port 3001 where backend is hosting.
const PORT = process.env.PORT || 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_KEY, { useNewUrlParser: true }).then(
  () => {
    console.log("Connected to db...");
  },
  (err) => {
    console.log("something went wrong..." + err);
  }
);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use("/users", user);

app.use("/myBookShelf", verifyToken.verifyToken, myBookShelf);

app.use("/dashboard", dashboard);

// Configure a catch-all route that serves the main HTML file
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log("server at PORT " + PORT);
});
