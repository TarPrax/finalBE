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
const { testBcrypt } = require("../workspace/src/Test/test");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cookieParser());
const cors = require("cors");
app.use(
  cors({
    origin: "https://6xywc8-5174.csb.app", // allow your frontend
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true, // if you send cookies
  })
);

app.use("/", authRouter);
app.use("/", userEdit);
app.use("/", connection);

console.log(this, "this ends");
console.log(global, "global ends");
console.log(globalThis, "global this ends");
connectDB()
  .then(() => {
    console.log("connected to database");

    app.listen(7346, () => {
      console.log("connected to app");
    });
  })
  .catch((err) => {
    console.error(err + "  database gnot connected");
  });
setTimeout(function () {
  testBcrypt();
}, 5000);
