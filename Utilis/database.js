const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://newtarunsh:VvGom30Imp9V8LTk@namastenode.joiqp.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
