const mongoose = require("mongoose");

const Subscribe = new mongoose.Schema({
  name: { type: String },
  emailId: { type: String },
  password: { type: String },
  gender: { type: String },
});

const Subscriber = mongoose.model("Subscriber", Subscribe);
module.exports = Subscriber;
