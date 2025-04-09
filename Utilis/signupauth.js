const validate = require("validator");

const signupAuth = (req) => {
  const { firstName, lastName, emailId, age, gender, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Enter a valid Name");
  } else if (!validate.isEmail(emailId)) {
    throw new Error("Invalid E-mail Id");
  }
};

module.exports = { signupAuth };
