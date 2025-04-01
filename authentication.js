const auth = (req, res, next) => {
  console.log("called authentication");
  const token = "awe";
  if (token === "awer") next();
  else res.status(500).send("You are not authorized");
};

module.exports = auth;
