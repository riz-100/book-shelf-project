const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  currentlyReading: [
    {
      book: {
        type: String,
      },
      progress: {
        type: Number,
        default: 0,
      },
    },
  ],
});

const User = mongoose.model("users", UserSchema);

module.exports = User;
