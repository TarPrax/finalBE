const connectDB = require("/project/workspace/Utilis/database.js");

const express = require("express");

const auth = require("./authentication");
const User = require("./src/Models/user");
const Subscriber = require("./src/Models/subscribers");

const respo = {
  name: "tarun",
  age: "25",
};

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  // const userOne = {
  //   firstName: "Kishan",
  //   lastName: "Singh",
  //   emailId: "tarun12@gmail.com",
  //   password: "tarun@123",
  // };
  console.log(req.body);
  const user = new User(req.body);

  await user.save();
  res.send("posted successfully the user");
});

app.post("/subscribe", async (req, res) => {
  try {
    const sub = {
      name: "Khalid",
      password: "k@t$irna",
      emailId: "hasda@gmail.com",
    };
    const subi = new Subscriber(sub);

    await subi.save();
    res.send("added subscriber");
  } catch (err) {
    res.send("some error occured: ", err);
  }
});

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
    console.log("connected to database");

    app.listen(7777, () => {
      console.log("connected to app");
    });
  })
  .catch((err) => {
    console.error(err + "  database not connected");
  });
