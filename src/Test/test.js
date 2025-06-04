const bcrypt = require("bcrypt");

const testBcrypt = async (req, res) => {
  const password = "Anya@1234";
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword);
  const comparePass = await bcrypt.compare(password, hashedPassword);
  console.log(comparePass);
};

module.exports = { testBcrypt };
