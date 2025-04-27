const validator = require("validator");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      minLength: 3,
      maxLength: 25,
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
      validate: [validator.isEmail, "not a valid E-mail"],
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
      validate: [validator.isStrongPassword, "not a strong password"],
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.index({ emailId: 1 }, { unique: true });

userSchema.methods.JWToken = async function () {
  const data = this;
  const token = await jwt.sign({ _id: data._id }, "Secret@#1234");
  return token;
};

userSchema.methods.passValidator = async function (password) {
  const data = this;
  const res = await bcrypt.compare(password, data.password);
  return res;
};

const User = new mongoose.model("User", userSchema);

module.exports = User;
