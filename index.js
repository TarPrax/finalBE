const connectDB = require("/project/workspace/Utilis/database.js");

const express = require("express");

const auth = require("./authentication");

const respo = {
  name: "tarun",
  age: "25",
};

const app = express();

app.use("/test", auth, (req, res) => {
  console.log("test");
  res.send(respo);
});
app.use("/test", (req, res) => {
  console.log("universal");
  res.send("universal");
});

app.use(
  "/mid",
  (req, res, next) => {
    if (req.method === "GET") next();
    else res.send("this is not next");
  },
  (req, res) => {
    res.send("this is called next");
  }
);

connectDB()
  .then(() => {
    console.log("connected");

    app.listen(7777, () => {
      console.log("connected to app");
    });
  })
  .catch((err) => {
    console.error(err + "  database not connected");
  });
