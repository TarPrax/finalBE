const validate = require("validator");

const signupAuth = (req) => {
  const { firstName, lastName, emailId, age, gender, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Enter a valid Name");
  } else if (!validate.isEmail(emailId)) {
    throw new Error("Invalid E-mail Id");
  }
};

const profileUpdateAuth = (req, res) => {
  const allowedFields = ["firstName", "lastName", "emailId", "age", "gender"];

  try {
    const isAllowed = Object.keys(req.body).every((field) =>
      allowedFields.includes(field)
    );

    if (!isAllowed) {
      throw new Error("Invalid fields");
    }
  } catch (err) {
    res.status(400).send("Some error occurred");
  }
};

module.exports = { signupAuth, profileUpdateAuth };
