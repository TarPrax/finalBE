const mongoose = require("mongoose");
const User = require("../Models/user");
const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    connectionStatus: {
      type: String,
      enum: {
        values: ["interested", "ignored", "accepted", "rejected"],
        message: `{VALUE} is incorrect`,
      },
    },
  },
  { timestamps: true }
);

connectionRequestSchema.pre("save", async function (next) {
  if (!this.isNew) {
    return next(); // only run on new documents
  }

  const isAlreadyPresent = await ConnectionRequestModel.findOne({
    $or: [
      { fromUserId: this.fromUserId, toUserId: this.toUserId },
      { fromUserId: this.toUserId, toUserId: this.fromUserId },
    ],
  });
  if (isAlreadyPresent) {
    throw new Error("Already requeted");
  }

  next();
});

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

const ConnectionRequestModel = new mongoose.model(
  "ConnectionRequestModel",
  connectionRequestSchema
);
module.exports = ConnectionRequestModel;
