const express = require("express");
const userEdit = express.Router();
const authZ = require("../../authentication");
const User = require("../Models/user");
const { userEditAuth } = require("../../Utilis/signupauth");

const { profileUpdateAuth } = require("../../Utilis/signupauth");
userEdit.patch("/profile/edit", authZ, async (req, res) => {
  try {
    console.log("Started Updating");
    const isValidData = profileUpdateAuth(req);
    const userData = req.userData;

    Object.keys(req.body).forEach((field) => {
      userData[field] = req.body[field];
    });
    console.log(userData);
    await userData.save();
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("Some error occuured" + err.message);
    console.log(err);
  }
});




userEdit.patch("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  const { firstName, lastName, age, ...rest } = req.body;

  // Validate required fields
  if (!firstName || !lastName || age === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Validate allowed fields only
  const allowedFields = ["firstName", "lastName", "age"];
  const invalidFields = Object.keys(rest).filter((key) => !allowedFields.includes(key));
  if (invalidFields.length > 0) {
    return res.status(400).json({ error: "Some error occurred: Invalid fields present" });
  }

  // Check age
  if (age < 18) {
    return res.status(400).json({ error: "Your age is less than 18, you cannot sign in" });
  }

  try {
    const currentUser = await User.findById(userId);
    console.log("Current user:", currentUser);

    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, age },
      { new: true, runValidators: true }
    );

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Error updating user:", err.message);
    res.status(500).send("Some error: " + err.message);
  }
});


userEdit.delete("/user", async (req, res) => {
  const delUser = req.body.userId;

  try {
    const del = await User.findByIdAndDelete(delUser);

    res.send("user deleted successfully");
  } catch (err) {
    res.status(500).send("Some error occurred" + err.message);
  }
});

module.exports = userEdit;
