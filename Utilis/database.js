const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://newtarunsh:May9794505375@namastenode.joiqp.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
