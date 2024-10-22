const express = require("express");
const requestRounter = express.Router();
const mongoose = require("mongoose");
const ObjectId = require('mongoose').ObjectId;

const { userAuth } = require("../middlewares/auth.js");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user.js");

requestRounter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params?.toUserId;
      const status = req.params?.status;
   
      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).send({ message: "Status type is not valid" });
      }


    //   const existingUser = await User.findOne({"id": new ObjectId(toUserId)}).exec();
    //           if (!existingUser) {
    //             return res
    //               .status(404)
    //               .send({ message: " User does not exists in the DB" });
    //           }
        

      const exisitingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (exisitingConnectionRequest) {
        return res
          .json({ message: "Connection Request already exists" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      return res.json({ message: "Connection Request sent successfully" , data });
    } catch (err) {
      res.status(400).send("Error : " + err.message);
    }
  }
);

requestRounter.post("/request/review/:status/:requestId", userAuth, async (req, res) =>{
    try{
        const loggedInUser = req.user;
        const status = req.params?.status
        const requestId = req.params?.requestId;

        const allowedStatus = ["rejected", "accepted"];

        if(!allowedStatus.includes(status)){
            return res.status(400).json({message : "Status is invalid"});
        }

        const connectionRequest = await ConnectionRequest.findOne({
            fromUserId: requestId,
            toUserId : loggedInUser._id,
            status: "interested"
        });

        if(!connectionRequest){
            return res.status(404).json({message : "Connection request not found"});
        }
        connectionRequest.status = status;

        const data = await connectionRequest.save();

        return res.json({message: " Connection Request " + status, data});
    }
    catch(err){
        res.status(400).send("Error : " + err.message);
    }
});
module.exports = requestRounter;
