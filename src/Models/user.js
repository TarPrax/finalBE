const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
  password: {
    type: String,
  },
});

const User = new mongoose.model("User", userSchema);

module.exports = User;
