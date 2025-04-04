const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      minLength: 3,
      maxLength: 25,
      required: true,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("not an valid option");
        }
      },
    },
    password: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = new mongoose.model("User", userSchema);

module.exports = User;
