const connectDB = require("/project/workspace/Utilis/database.js");

const express = require("express");

const User = require("./src/Models/user");
const Subscriber = require("./src/Models/subscribers");
const bcrypt = require("bcrypt");
const { signupAuth } = require("./Utilis/signupauth");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const cookies = require("cookie-parser");
const cookieParser = require("cookie-parser");
const authRouter = require("./src/router/auth");
const userEdit = require("./src/router/useredit");
const connection = require("./src/router/connection");
const authZ = require("./authentication");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/", authRouter);
app.use("/", userEdit);
app.use("/", connection);

connectDB()
  .then(() => {
    console.log("connected to database");

    app.listen(6000, () => {
      console.log("connected to app");
    });
  })
  .catch((err) => {
    console.error(err + "  database gnot connected");
  });
