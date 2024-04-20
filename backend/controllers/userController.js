const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const jwtExpireTime = 24 * 60 * 60;

exports.registerUser = (req, res) => {
  User.findOne({
    email: req.body.email,
  }).then((user) => {
    if (user) {
      return res.status(400).json({
        email: "Email Already registered!",
      });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });

      bcrypt.genSalt(10, (err, salt) => {
        if (err) console.log("There is an error", err);
        else {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) console.log("There is an error", err);
            else {
              newUser.password = hash;
              newUser.save().then((user) => {
                const payload = {
                  id: user._id,
                  name: user.name,
                };
                jwt.sign(
                  payload,
                  process.env.SECRET_KEY,
                  { expiresIn: jwtExpireTime },
                  (err, token) => {
                    if (err) console.log("There is an error in JWT", err);
                    else {
                      res.json({
                        success: true,
                        token: `Bearer ${token}`,
                        ...payload,
                      });
                    }
                  }
                );
              });
            }
          });
        }
      });
    }
  });
};

exports.loginUser = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        const payload = {
          id: user._id,
          name: user.name,
        };
        jwt.sign(
          payload,
          process.env.SECRET_KEY,
          { expiresIn: jwtExpireTime },
          (err, token) => {
            if (err) console.log("There is an error in JWT", err);
            else {
              res.json({
                success: true,
                token: `Bearer ${token}`,
                ...payload,
              });
            }
          }
        );
      } else {
        return res.status(400).json({ message: "Invalid credenntials" });
      }
    });
  });
};

exports.getUser = (req, res) => {
  const userID = req.query.id;

  // Use Mongoose to find the user by ID
  User.findById(userID)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      // If user found, return user details
      res.status(200).json({ user });
    })
    .catch((error) => {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "An error occurred while fetching user" });
    });
};
