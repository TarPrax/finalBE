const jwt = require("jsonwebtoken");
const User = require("./src/Models/user");

const authZ = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Token not valid");
    }
    const user = await jwt.verify(token, "Secret@#1234");

    const { _id } = user;
    console.log(_id);
    const userData = await User.findById(_id);
    if (!userData) {
      throw new Error("Did not found user");
    }

    req.userData = userData;

    next();
  } catch (err) {
    res.status(400).send("Error " + err.message);
  }
};

module.exports = authZ;
