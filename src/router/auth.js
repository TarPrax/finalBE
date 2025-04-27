const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../Models/user");
const validator = require("validator");
const { signupAuth } = require("/project/workspace/Utilis/signupauth.js");

authRouter.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, age, gender } = req.body;

  const { password } = req.body;

  const pass = await bcrypt.hash(password, 10);

  const user = new User({
    firstName,
    lastName,
    emailId,
    age,
    gender,
    password: pass,
  });
  try {
    signupAuth(req);
    await user.save();

    res.send("posted successfully the user");
  } catch (err) {
    res.status(400).send("Some Error occured" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { firstname, lastName, emailId } = req.body;
  const { password } = req.body;
  try {
    if (!validator.isEmail(emailId)) {
      throw new Error("Inavlid Credentials");
    }

    const data = await User.findOne({ emailId: emailId });
    if (!data) {
      throw new Error("Invalid Credentials");
    }

    const rel = await data.passValidator(password);

    if (!rel) {
      throw new Error("Invalid Credential");
    }
    const token = await data.JWToken();
    res.cookie("token", token);
    res.send("login successful");
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

module.exports = authRouter;
