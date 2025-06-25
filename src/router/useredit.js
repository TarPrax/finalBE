const express = require("express");
const userEdit = express.Router();
const authZ = require("../../authentication");

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
  const userID = req.params;
  const data = req.body;
  // console.log(data);
  // console.log(userID);

  try {
    const allowedFields = ["firstName", "lastName", "age"];

    const checkAllowed = Object.keys(data).every((k) =>
      allowedFields.includes(k)
    );
    if (!checkAllowed) {
      throw new Error("Some error occurred");
    }
console.log("Received body:", data);
    const age = data.age;
    if (age < 18) {
      throw new Error("Your age is less than 18, you cannot sign In");
    }

    const currentUser = await User.findById(userID.userId);
    console.log("Current user:", currentUser);
    const updated = await User.findByIdAndUpdate(
      userID.userId, // ✅ Pass the ID directly
      {
        firstName: data.firstName,
        lastName: data.lastName,
        age: data.age,
      },
      { new: true, runValidators: true } // ✅ Return the updated document
    );

    if (!updated) {
      return res.status(404).send("User not found");
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(400).send("Some error: " + err.message);
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
