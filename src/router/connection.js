const express = require("express");

const connection = express.Router();
const ConnectionRequestModel = require("../Models/connection");
const user = require("../Models/user");
const authZ = require("/project/workspace/authentication.js");
const User = require("../Models/user");

connection.post(
  "/newConnectionRequest/:status/:userID",
  authZ,
  async (req, res) => {
    try {
      const status = req.params.status;
      const toUserId = req.params.userID;
      console.log(status);
      const loggedInUser = req.userData;
      const fromUserId = loggedInUser._id;

      const allowedFields = ["interested", "ignored", "accepted", "rejected"];
      const isAllowedField = allowedFields.includes(status);

      const isUserValid = await user.findById(toUserId);
      if (!isUserValid) {
        throw new Error("User Does not exist");
      }
      if (!isAllowedField) {
        throw new Error("Invalid Field type");
      }

      if (fromUserId.toString() === toUserId.toString()) {
        throw new Error("Cannot send Request to Oneself");
      }

      // const isAlreadyPresent = await ConnectionRequestModel.findOne({
      //   $or: [
      //     { fromUserId, toUserId },
      //     { fromUserId: toUserId, toUserId: fromUserId },
      //   ],
      // });

      // if (isAlreadyPresent) {
      //   throw new Error("Already requeted");
      // }

      await new ConnectionRequestModel({
        fromUserId,
        toUserId,
        connectionStatus: status,
      }).save();
      res.send(`successfully ${status} the user`);
    } catch (err) {
      res.status(400).send("Some error " + err.message);
    }
  }
);

connection.post(
  "/requests/review/:status/:requestId",
  authZ,
  async (req, res) => {
    try {
      const loggedInUser = req.userData;

      const { status, requestId } = req.params;
      console.log(loggedInUser);
      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid Request Type");
      }

      const findExisitingRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        connectionStatus: "interested",
      });

      if (!findExisitingRequest) {
        throw new Error("Request not found");
      }

      findExisitingRequest.connectionStatus = status;
      await findExisitingRequest.save();
      res.json({ message: "The user has respondes" });
    } catch (err) {
      res.status(400).send("Some error: " + err.message);
    }
  }
);

connection.get("/user/requests/received", authZ, async (req, res) => {
  const loggedInUser = req.userData;

  try {
    const pendingRequestes = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      connectionStatus: "interested",
    }).populate("fromUserId", "firstName lastName emailId");
    res.json({ message: "Pending requests", data: pendingRequestes });
  } catch (err) {
    res.status(400).send("Some error " + err.message);
  }
});

connection.get("/user/connections", authZ, async (req, res) => {
  console.log("first");
  try {
    const loggedInUser = req.userData._id;
    console.log(loggedInUser);
    const data = await ConnectionRequestModel.find({
      $or: [
        { fromUserId: loggedInUser, connectionStatus: "accepted" },
        { toUserId: loggedInUser, connectionStatus: "accepted" },
      ],
    }).populate("fromUserId", "firstName lastName emailId");

    const relData = data.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString())
        return row.toUserId;
      return row.fromUserId;
    });

    res.json({ messgae: "your connection", data: relData });
  } catch (err) {
    res.status(400).send("Some error " + err.message);
  }
});

connection.get("/user/feed", authZ, async (req, res) => {
  try {
    const loggedInUser = req.userData;

    let page = req.query.page || 1;
    let limit = req.query.limit || 3;
    limit = limit > 100 ? 100 : limit;
    page = page < 1 ? 1 : page;
    const skip = (page - 1) * limit;

    const restrictProfile = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const userRestricted = new Set();
    restrictProfile.forEach((req) => {
      userRestricted.add(req.fromUserId.toString());
      userRestricted.add(req.toUserId.toString());
    });

    const UsertoView = await User.find({
      _id: { $nin: Array.from(userRestricted), $ne: loggedInUser._id },
    })
      .select("firstName lastName")
      .limit(limit)
      .skip(skip);
    console.log(UsertoView);
    res.send(UsertoView);
  } catch (err) {
    res.status(400).send("Error in feed api " + err.message);
  }
});

module.exports = connection;
