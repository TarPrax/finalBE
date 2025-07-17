const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../Models/user");
const validator = require("validator");
const { signupAuth } = require("../../Utilis/signupauth");
const authZ = require("../../authentication");

authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, age, gender } = req.body;

    const { password } = req.body;

    const pass = await bcrypt.hash(password, 10);
    const existingUser = await User.findOne({ emailId: emailId });
    if (existingUser) {
      throw new Error("Email already exists");
    }

    const user = new User({
      firstName,
      lastName,
      emailId,
      age,
      gender,
      password: pass,
    });

    signupAuth(req);
    await user.save();

    res.send("posted successfully the user");
  } catch (err) {
    res.status(400).send("Some Error occured" + err.message);
  }
});


authRouter.get("/isUserLoggedIn",authZ, async (req, res) => {
  try {
    const { token } = req.cookies;

    res.send(req.userData);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});



authRouter.get("/user/:userId",authZ, async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).send("Some error occurred" + err.message);
  }
});









authRouter.post("/login", async (req, res) => {
  const { firstname, lastName, emailId } = req.body;
  const { password } = req.body;
  console.log(req.body);
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
    res.cookie("token", token,{secure: true, httpOnly: true, sameSite: "None"});
    res.send(data);
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

authRouter.post("/logout", authZ, async (req, res) => {
  try {
    res.clearCookie("token");
    res.send("Logged out successfully");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = authRouter;
