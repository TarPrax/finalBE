const connectDB= require("./Utilis/database")

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

const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/", authRouter);
app.use("/", userEdit);
app.use("/", connection);

console.log(this, "this ends");
console.log(global, "global ends");
console.log(globalThis, "global this ends");
connectDB()
  .then(() => {
    console.log("connected to database");

    app.listen(4336, () => {
      console.log(`Server is running on http://localhost:4336`);
    });
  })
  .catch((err) => {
    console.error(err + "  database gnot connected");
  });

